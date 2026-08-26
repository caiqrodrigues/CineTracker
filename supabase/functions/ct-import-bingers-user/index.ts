import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const H = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' };
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};
const STRATEGY = 'hotfix16_hardened_import';
const json = (data: any, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { ...CORS, 'content-type': 'application/json', 'cache-control': 'no-store' },
});

class ImportError extends Error {
  code: string;
  status: number;
  details: any;
  permanent: boolean;
  constructor(code: string, status: number, message: string, details: any = null, permanent = false) {
    super(message);
    this.name = 'ImportError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.permanent = permanent;
  }
}

function asImportError(error: unknown) {
  if (error instanceof ImportError) return error;
  return new ImportError('INTERNAL_ERROR', 500, error instanceof Error ? error.message : String(error));
}

async function serviceFetch(path: string, init: RequestInit = {}) {
  try {
    return await fetch(`${URL}${path}`, { ...init, headers: { ...H, ...(init.headers || {}) } });
  } catch (error) {
    throw new ImportError('BACKEND_UNAVAILABLE', 503, 'Supabase temporariamente indisponível.', {
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

async function rest(path: string, init: RequestInit = {}) {
  const response = await serviceFetch(`/rest/v1/${path}`, init);
  const text = await response.text();
  let payload: any = null;
  if (text) {
    try { payload = JSON.parse(text); } catch { payload = text; }
  }
  if (!response.ok) {
    const message = typeof payload === 'object' && payload
      ? String(payload.message || payload.details || payload.hint || `Banco ${response.status}`)
      : String(payload || `Banco ${response.status}`);
    if (response.status >= 500 || response.status === 429) {
      throw new ImportError('BACKEND_UNAVAILABLE', 503, message, { upstream_status: response.status, path });
    }
    throw new ImportError('DATABASE_REJECTED', 422, message, {
      upstream_status: response.status,
      path,
      database_code: typeof payload === 'object' && payload ? payload.code || null : null,
    }, true);
  }
  return payload;
}

async function countExact(path: string) {
  const joiner = path.includes('?') ? '&' : '?';
  const response = await serviceFetch(`/rest/v1/${path}${joiner}select=id`, {
    method: 'GET',
    headers: { Prefer: 'count=exact', Range: '0-0' },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new ImportError('BACKEND_UNAVAILABLE', 503, `Não foi possível validar a contagem final (${response.status}).`, { path, response: text.slice(0, 400) });
  }
  const range = response.headers.get('content-range') || '';
  const totalText = range.split('/')[1];
  const total = Number(totalText);
  if (!Number.isInteger(total) || total < 0) {
    throw new ImportError('BACKEND_UNAVAILABLE', 503, 'O banco não retornou uma contagem final válida.', { path, content_range: range });
  }
  return total;
}

async function uid(req: Request) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) {
    throw new ImportError('AUTH_REQUIRED', 401, 'Sessão ausente. Entre novamente e retome a importação.');
  }
  let response: Response;
  try {
    response = await fetch(`${URL}/auth/v1/user`, { headers: { apikey: SERVICE, Authorization: auth } });
  } catch (error) {
    throw new ImportError('AUTH_UNAVAILABLE', 503, 'Não foi possível validar a sessão agora.', {
      cause: error instanceof Error ? error.message : String(error),
    });
  }
  if (response.status === 401 || response.status === 403) {
    throw new ImportError('AUTH_EXPIRED', 401, 'Sessão expirada. O CineTracker tentará renová-la automaticamente.');
  }
  if (!response.ok) {
    throw new ImportError('AUTH_UNAVAILABLE', 503, `Falha temporária ao validar a sessão (${response.status}).`);
  }
  const user = await response.json().catch(() => null);
  if (!user?.id) throw new ImportError('AUTH_INVALID', 401, 'Sessão inválida. Entre novamente.');
  return String(user.id);
}

function integer(value: any, label: string, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  if (value === '' || value === null || value === undefined) {
    throw new ImportError('INVALID_DATA', 422, `${label} ausente.`, { field: label, value }, true);
  }
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < min || n > max) {
    throw new ImportError('INVALID_DATA', 422, `${label} inválido.`, { field: label, value }, true);
  }
  return n;
}

function optionalPositiveInteger(value: any) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

function optionalYear(value: any) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 1800 && n <= 3000 ? n : null;
}

function nonEmptyText(value: any, label: string) {
  const text = String(value ?? '').trim();
  if (!text) throw new ImportError('INVALID_DATA', 422, `${label} ausente.`, { field: label }, true);
  return text;
}

function timestamp(value: any, label: string) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  const ms = Date.parse(text);
  if (!Number.isFinite(ms)) {
    throw new ImportError('INVALID_DATA', 422, `${label} contém uma data inválida.`, { field: label, value: text }, true);
  }
  return new Date(ms).toISOString();
}

function watchPlays(value: any) {
  if (value === '' || value === null || value === undefined) return 1;
  return integer(value, 'plays', 1, 1000000);
}

function hash32(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function mediaType(x: any) {
  return x.type === 'movie' ? 'movie' : 'tv';
}

function stableTmdb(x: any) {
  const real = Number(x.tmdb_id || 0);
  if (Number.isSafeInteger(real) && real > 0) return real;
  return -(1000000000 + (hash32(`${mediaType(x)}|${x.tvdb_id || ''}|${x.title || ''}|${x.year || ''}`) % 900000000));
}

function dedupeBy<T>(rows: T[], key: (row: T) => string, prefer?: (current: T, incoming: T) => T) {
  const map = new Map<string, T>();
  for (const row of rows) {
    const k = key(row);
    if (!map.has(k)) map.set(k, row);
    else map.set(k, prefer ? prefer(map.get(k)!, row) : row);
  }
  return [...map.values()];
}

async function insert(table: string, rows: any[], conflict = '', mode: 'merge' | 'ignore' = 'merge') {
  if (!rows.length) return;
  const q = conflict ? `?on_conflict=${encodeURIComponent(conflict)}` : '';
  const resolution = conflict
    ? (mode === 'ignore' ? 'resolution=ignore-duplicates,return=minimal' : 'resolution=merge-duplicates,return=minimal')
    : 'return=minimal';
  await rest(`${table}${q}`, { method: 'POST', headers: { Prefer: resolution }, body: JSON.stringify(rows) });
}

async function mediaMap(ids: number[]) {
  const unique = [...new Set(ids.filter(x => Number.isSafeInteger(x) && x !== 0))];
  if (!unique.length) return new Map<string, any>();
  const rows = await rest(`media?select=id,tmdb_id,media_type,title&tmdb_id=in.(${unique.join(',')})`);
  return new Map((rows || []).map((m: any) => [`${m.media_type}:${m.tmdb_id}`, m]));
}

const progressStates = new Set(['AlreadySeen', 'Completed', 'InProgress', 'NotInterested']);
function conflicts(incoming: string, manual: Set<string>) {
  if (manual.has(incoming)) return true;
  if (incoming === 'AlreadySeen' || incoming === 'InProgress' || incoming === 'Completed') {
    return [...manual].some(state => progressStates.has(state));
  }
  if (incoming === 'AddedToWatchlist') return [...manual].some(state => progressStates.has(state));
  if (incoming === 'WatchLater') return manual.has('AlreadySeen') || manual.has('Completed') || manual.has('NotInterested');
  return false;
}

async function withoutConflictingManualOverrides(user: string, rows: any[]) {
  if (!rows.length) return rows;
  const ids = [...new Set(rows.map((x: any) => Number(x.media_id)).filter(x => Number.isSafeInteger(x) && x > 0))];
  if (!ids.length) return rows;
  const manual = await rest(`media_overrides?profile_id=eq.${user}&origin=eq.manual&media_id=in.(${ids.join(',')})&select=media_id,state`);
  const byMedia = new Map<number, Set<string>>();
  for (const x of manual || []) {
    const id = Number(x.media_id);
    if (!byMedia.has(id)) byMedia.set(id, new Set());
    byMedia.get(id)!.add(String(x.state));
  }
  return rows.filter((x: any) => !conflicts(String(x.state), byMedia.get(Number(x.media_id)) || new Set()));
}

async function priorBingersImports(user: string) {
  const rows = await rest(`imports?profile_id=eq.${user}&select=id,status,processing_cursor,total_items,summary,created_at&order=id.desc&limit=100`);
  return (rows || []).filter((row: any) => row?.summary?.source === 'Bingers');
}

async function clearPreviousBingersImport(user: string, prior: any[]) {
  const ids = prior.map((row: any) => Number(row.id)).filter((id: number) => Number.isSafeInteger(id) && id > 0);
  if (ids.length) {
    const inIds = ids.join(',');
    await rest(`episode_progress?profile_id=eq.${user}&origin=eq.import&source_import_id=in.(${inIds})`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
    await rest(`media_overrides?profile_id=eq.${user}&origin=eq.import&source_import_id=in.(${inIds})`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  }
  await rest(`watch_history?profile_id=eq.${user}&source=eq.bingers`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  const processing = prior.filter((row: any) => row.status === 'processing').map((row: any) => Number(row.id)).filter(Boolean);
  if (processing.length) {
    await rest(`imports?profile_id=eq.${user}&id=in.(${processing.join(',')})`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'failed', updated_at: new Date().toISOString() }),
    });
  }
}

async function loadImport(user: string, id: number) {
  const rows = await rest(`imports?id=eq.${id}&profile_id=eq.${user}&select=id,status,total_items,processing_cursor,summary,filename,file_type`);
  const row = rows?.[0];
  if (!row) throw new ImportError('IMPORT_NOT_FOUND', 404, 'Importação não encontrada para este usuário.');
  return row;
}

function validateBatchEnvelope(importRow: any, cursorValue: any, rowCount: number) {
  if (importRow.status !== 'processing') {
    throw new ImportError('IMPORT_NOT_PROCESSING', 409, `A importação está com status ${importRow.status}.`, { status: importRow.status });
  }
  const expected = integer(cursorValue, 'cursor', 0);
  const stored = integer(importRow.processing_cursor ?? 0, 'processing_cursor', 0);
  const next = expected + rowCount;
  const total = integer(importRow.total_items, 'total_items', 1);
  if (stored === next) return { expected, next, total, replay: true };
  if (stored !== expected) {
    throw new ImportError('CURSOR_MISMATCH', 409, 'Outro lote já avançou esta importação. O cliente deve sincronizar o cursor antes de continuar.', { expected, stored, next });
  }
  if (next > total) {
    throw new ImportError('CURSOR_OVERFLOW', 422, 'O lote ultrapassa o total previsto da importação.', { expected, next, total }, true);
  }
  return { expected, next, total, replay: false };
}

async function advanceCursor(user: string, importId: number, expected: number, next: number, phase: string, progress: any) {
  const patched = await rest(`imports?id=eq.${importId}&profile_id=eq.${user}&status=eq.processing&processing_cursor=eq.${expected}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      processing_cursor: next,
      summary: { source: 'Bingers', strategy: STRATEGY, phase, progress: Number(progress || 0), preserves_manual: true },
      updated_at: new Date().toISOString(),
    }),
  });
  if (patched?.[0]) return next;
  const fresh = await loadImport(user, importId);
  if (Number(fresh.processing_cursor) === next) return next;
  throw new ImportError('CURSOR_MISMATCH', 409, 'O cursor mudou durante a gravação do lote.', { expected, stored: Number(fresh.processing_cursor), next });
}

function validateLibraryRows(rows: any[]) {
  if (!rows.length || rows.length > 200) {
    throw new ImportError('INVALID_BATCH_SIZE', 422, 'Lote de biblioteca deve ter 1-200 registros.', { count: rows.length }, true);
  }
  return rows.map((x: any, index: number) => {
    if (x?.type !== 'movie' && x?.type !== 'show') {
      throw new ImportError('INVALID_DATA', 422, 'Tipo de mídia inválido na biblioteca.', { index, type: x?.type }, true);
    }
    const title = nonEmptyText(x.title, `library[${index}].title`);
    const tmdbId = stableTmdb({ ...x, title });
    if (!Number.isSafeInteger(tmdbId) || tmdbId === 0) {
      throw new ImportError('INVALID_DATA', 422, 'Identificador de mídia inválido na biblioteca.', { index, title }, true);
    }
    return { ...x, title, __tmdb_id: tmdbId };
  });
}

function validateWatchRows(rows: any[]) {
  if (!rows.length || rows.length > 200) {
    throw new ImportError('INVALID_BATCH_SIZE', 422, 'Lote de histórico deve ter 1-200 registros.', { count: rows.length }, true);
  }
  const seenSourceIds = new Set<number>();
  return rows.map((x: any, index: number) => {
    if (x?.type !== 'movie' && x?.type !== 'episode') {
      throw new ImportError('INVALID_DATA', 422, 'Tipo de histórico inválido.', { index, type: x?.type }, true);
    }
    const sourceHistoryId = integer(x.source_history_id, `watches[${index}].source_history_id`, 1);
    if (seenSourceIds.has(sourceHistoryId)) {
      throw new ImportError('DUPLICATE_HISTORY_ID', 422, 'O lote contém source_history_id duplicado.', { index, source_history_id: sourceHistoryId }, true);
    }
    seenSourceIds.add(sourceHistoryId);
    const mediaTmdbId = integer(x.media_tmdb_id, `watches[${index}].media_tmdb_id`);
    if (mediaTmdbId === 0) throw new ImportError('INVALID_DATA', 422, 'media_tmdb_id não pode ser zero.', { index, source_history_id: sourceHistoryId }, true);
    const first = timestamp(x.first_watched_at, `watches[${index}].first_watched_at`);
    const last = timestamp(x.last_watched_at, `watches[${index}].last_watched_at`);
    if (!first && !last) {
      throw new ImportError('MISSING_WATCH_DATE', 422, 'Registro de histórico sem data. Nenhuma data será inventada.', { index, source_history_id: sourceHistoryId, title: x.title || null }, true);
    }
    const normalizedFirst = first || last!;
    const normalizedLast = last || first!;
    const normalized: any = {
      ...x,
      source_history_id: sourceHistoryId,
      media_tmdb_id: mediaTmdbId,
      media_type: x.type === 'movie' ? 'movie' : 'tv',
      first_watched_at: normalizedFirst,
      last_watched_at: normalizedLast,
      plays: watchPlays(x.plays),
    };
    if (x.type === 'episode') {
      normalized.season_number = integer(x.season_number, `watches[${index}].season_number`, 0, 10000);
      normalized.episode_number = integer(x.episode_number, `watches[${index}].episode_number`, 0, 100000);
    }
    return normalized;
  });
}

async function markPermanentFailure(user: string, importId: number, action: string, error: ImportError) {
  if (!importId || !error.permanent) return;
  try {
    const current = await loadImport(user, importId);
    if (current.status !== 'processing') return;
    await rest(`imports?id=eq.${importId}&profile_id=eq.${user}&status=eq.processing`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        status: 'failed',
        summary: {
          source: 'Bingers', strategy: STRATEGY, phase: action || 'error', preserves_manual: true,
          failure_code: error.code, failure_message: error.message, failure_details: error.details || null,
          progress_cursor: Number(current.processing_cursor || 0),
        },
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // O erro original é mais importante; a marcação de falha não pode mascará-lo.
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, code: 'METHOD_NOT_ALLOWED', error: 'Método não permitido.' }, 405);

  let user = '';
  let body: any = {};
  let action = '';
  let importId = 0;
  try {
    user = await uid(req);
    body = await req.json().catch(() => { throw new ImportError('INVALID_JSON', 400, 'Corpo JSON inválido.'); });
    action = String(body.action || '');

    if (action === 'begin') {
      const filename = nonEmptyText(body.filename || 'Bingers', 'filename');
      const totalItems = integer(body.total_items, 'total_items', 1, 1000000);
      const clientRunId = String(body.client_run_id || '').trim().slice(0, 160);
      const prior = await priorBingersImports(user);
      if (clientRunId) {
        const same = prior.find((row: any) => row.status === 'processing' && row?.summary?.client_run_id === clientRunId);
        if (same) {
          return json({ ok: true, import_id: Number(same.id), cursor: Number(same.processing_cursor || 0), resumed: true });
        }
      }
      await clearPreviousBingersImport(user, prior);
      const created = await rest('imports', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          profile_id: user,
          filename,
          file_type: body.file_type === 'json' ? 'json' : 'zip',
          status: 'processing',
          total_items: totalItems,
          matched_items: 0,
          unmatched_items: 0,
          processing_cursor: 0,
          summary: {
            source: 'Bingers', strategy: STRATEGY, phase: 'begin', client_run_id: clientRunId || null,
            preserves_manual: true, ratings_ignored: true, lists_ignored: true,
          },
        }),
      });
      importId = Number(created?.[0]?.id || 0);
      if (!importId) throw new ImportError('BACKEND_UNAVAILABLE', 503, 'O banco não retornou o ID da importação.');
      return json({ ok: true, import_id: importId, cursor: 0, resumed: false });
    }

    importId = integer(body.import_id, 'import_id', 1);
    const importRow = await loadImport(user, importId);

    if (action === 'status') {
      return json({
        ok: true,
        import_id: importId,
        status: importRow.status,
        cursor: Number(importRow.processing_cursor || 0),
        total_items: Number(importRow.total_items || 0),
        summary: importRow.summary || {},
      });
    }

    if (action === 'library_batch') {
      const rawRows = Array.isArray(body.rows) ? body.rows : [];
      const envelope = validateBatchEnvelope(importRow, body.cursor, rawRows.length);
      if (envelope.replay) return json({ ok: true, count: rawRows.length, cursor: envelope.next, replay: true });
      const rows = validateLibraryRows(rawRows);
      const mediaRows = rows.map((x: any) => ({
        tmdb_id: x.__tmdb_id,
        media_type: x.type === 'movie' ? 'movie' : 'tv',
        media_kind: x.type === 'movie' ? 'movie' : 'series',
        title: x.title,
        original_title: String(x.original_title || '').trim() || null,
        release_year: optionalYear(x.year),
        raw_tmdb: {
          tvdb_id: optionalPositiveInteger(x.tvdb_id),
          source_tmdb_id: optionalPositiveInteger(x.tmdb_id),
          bingers_added_at: String(x.added_at || '').trim() || null,
          import_key: String(x.import_key || '').trim() || null,
          history_only: x.history_only === true,
        },
        updated_at: new Date().toISOString(),
      }));
      await insert('media', mediaRows, 'tmdb_id,media_type', 'ignore');
      const map = await mediaMap(mediaRows.map((m: any) => Number(m.tmdb_id)));
      const missing = mediaRows.filter((m: any) => !map.has(`${m.media_type}:${m.tmdb_id}`));
      if (missing.length) {
        throw new ImportError('MEDIA_MAPPING_INCOMPLETE', 503, 'O banco não devolveu todas as mídias gravadas. O lote pode ser repetido com segurança.', { missing: missing.slice(0, 10).map((m: any) => ({ tmdb_id: m.tmdb_id, media_type: m.media_type, title: m.title })) });
      }
      let overrides: any[] = [];
      for (let i = 0; i < rows.length; i++) {
        const x = rows[i], m = mediaRows[i], found = map.get(`${m.media_type}:${m.tmdb_id}`)!;
        if (x.ct13_added_to_watchlist === true) overrides.push({ profile_id: user, media_id: found.id, state: 'AddedToWatchlist', origin: 'import', source_import_id: importId, watched_at: null });
        if (x.ct13_watch_later === true) overrides.push({ profile_id: user, media_id: found.id, state: 'WatchLater', origin: 'import', source_import_id: importId, watched_at: null });
        if (x.type === 'show' && x.ct13_in_progress === true) overrides.push({ profile_id: user, media_id: found.id, state: 'InProgress', origin: 'import', source_import_id: importId, watched_at: null });
      }
      overrides = dedupeBy(overrides, x => `${x.media_id}:${x.state}`);
      overrides = await withoutConflictingManualOverrides(user, overrides);
      await insert('media_overrides', overrides, 'profile_id,media_id,state', 'ignore');
      const cursor = await advanceCursor(user, importId, envelope.expected, envelope.next, 'library', body.progress);
      return json({ ok: true, count: rawRows.length, cursor });
    }

    if (action === 'watches_batch') {
      const rawRows = Array.isArray(body.rows) ? body.rows : [];
      const envelope = validateBatchEnvelope(importRow, body.cursor, rawRows.length);
      if (envelope.replay) return json({ ok: true, count: rawRows.length, cursor: envelope.next, replay: true });
      const rows = validateWatchRows(rawRows);
      const map = await mediaMap(rows.map((x: any) => Number(x.media_tmdb_id)));
      const missing = rows.filter((x: any) => !map.has(`${x.type === 'movie' ? 'movie' : 'tv'}:${x.media_tmdb_id}`));
      if (missing.length) {
        throw new ImportError('MEDIA_MAPPING_INCOMPLETE', 503, 'Há histórico apontando para mídia que ainda não está disponível no banco. O lote pode ser repetido com segurança.', {
          missing: missing.slice(0, 10).map((x: any) => ({ source_history_id: x.source_history_id, media_tmdb_id: x.media_tmdb_id, type: x.type, title: x.title || null })),
        });
      }
      const history: any[] = [];
      const progress: any[] = [];
      let overrides: any[] = [];
      for (const x of rows) {
        const type = x.type === 'movie' ? 'movie' : 'tv';
        const m = map.get(`${type}:${x.media_tmdb_id}`)!;
        const first = x.first_watched_at;
        const last = x.last_watched_at;
        if (x.type === 'movie') {
          history.push({
            profile_id: user, source: 'bingers', source_history_id: x.source_history_id, media_id: m.id,
            item_type: 'movie', season_number: null, episode_number: null, watched_at: last,
            external_ids: { plays: x.plays, first_watched_at: first, last_watched_at: last, tvdb_id: optionalPositiveInteger(x.tvdb_id), tmdb_id: optionalPositiveInteger(x.tmdb_id) },
            title: String(x.title || m.title || 'Filme'),
          });
          overrides.push({ profile_id: user, media_id: m.id, state: 'AlreadySeen', origin: 'import', source_import_id: importId, watched_at: last });
        } else {
          history.push({
            profile_id: user, source: 'bingers', source_history_id: x.source_history_id, media_id: m.id,
            item_type: 'episode', season_number: x.season_number, episode_number: x.episode_number, watched_at: last,
            external_ids: { plays: x.plays, first_watched_at: first, last_watched_at: last, tvdb_id: optionalPositiveInteger(x.tvdb_id), tmdb_id: optionalPositiveInteger(x.tmdb_id) },
            title: `${String(x.title || m.title || 'Série')} — T${x.season_number}E${x.episode_number}`,
          });
          progress.push({
            profile_id: user, media_id: m.id, season_number: x.season_number, episode_number: x.episode_number,
            watched: true, watched_at: last, origin: 'import', source_import_id: importId,
          });
          overrides.push({ profile_id: user, media_id: m.id, state: 'InProgress', origin: 'import', source_import_id: importId, watched_at: last });
        }
      }
      const historyRows = dedupeBy(history, x => String(x.source_history_id));
      const progressRows = dedupeBy(progress, x => `${x.media_id}:${x.season_number}:${x.episode_number}`, (a, b) => Date.parse(b.watched_at) >= Date.parse(a.watched_at) ? b : a);
      overrides = dedupeBy(overrides, x => `${x.media_id}:${x.state}`, (a, b) => Date.parse(b.watched_at || 0) >= Date.parse(a.watched_at || 0) ? b : a);
      overrides = await withoutConflictingManualOverrides(user, overrides);
      await insert('watch_history', historyRows, 'profile_id,source,source_history_id');
      await insert('episode_progress', progressRows, 'profile_id,media_id,season_number,episode_number');
      await insert('media_overrides', overrides, 'profile_id,media_id,state', 'ignore');
      const cursor = await advanceCursor(user, importId, envelope.expected, envelope.next, 'history', body.progress);
      return json({ ok: true, count: rawRows.length, cursor });
    }

    if (action === 'finish') {
      if (importRow.status === 'completed') return json({ ok: true, already_completed: true, summary: importRow.summary || {} });
      if (importRow.status !== 'processing') {
        throw new ImportError('IMPORT_NOT_PROCESSING', 409, `A importação está com status ${importRow.status}.`, { status: importRow.status });
      }
      const summary = body.summary && typeof body.summary === 'object' ? body.summary : {};
      const unmatched = integer(summary.unmatched_watch_events ?? 0, 'unmatched_watch_events', 0);
      if (unmatched > 0) {
        throw new ImportError('UNMATCHED_HISTORY', 422, 'Importação bloqueada: existem registros de histórico não mapeados.', { unmatched }, true);
      }
      const rawWatchRecords = integer(summary.raw_watch_records, 'raw_watch_records', 1);
      const importMediaItems = integer(summary.import_media_items ?? summary.library_items, 'import_media_items', 1);
      const expectedTotal = importMediaItems + rawWatchRecords;
      const total = integer(importRow.total_items, 'total_items', 1);
      const cursor = integer(importRow.processing_cursor, 'processing_cursor', 0);
      if (expectedTotal !== total) {
        throw new ImportError('TOTAL_MISMATCH', 422, 'O total da prévia não corresponde ao total iniciado.', { expectedTotal, total }, true);
      }
      if (cursor !== total) {
        throw new ImportError('IMPORT_INCOMPLETE', 409, 'A finalização foi recusada porque ainda existem lotes não confirmados.', { cursor, total });
      }
      const historyCount = await countExact(`watch_history?profile_id=eq.${user}&source=eq.bingers`);
      if (historyCount !== rawWatchRecords) {
        throw new ImportError('HISTORY_COUNT_MISMATCH', 422, 'A contagem gravada do histórico não confere com o arquivo. A importação não será marcada como concluída.', { expected: rawWatchRecords, actual: historyCount }, true);
      }

      const profileRows = await rest(`profiles?id=eq.${user}&select=settings`);
      const settings = profileRows?.[0]?.settings && typeof profileRows[0].settings === 'object' ? { ...profileRows[0].settings } : {};
      settings.bingers_import = {
        import_id: importId,
        imported_at: new Date().toISOString(),
        strategy: STRATEGY,
        preserves_manual: true,
        ratings_ignored: true,
        lists_ignored: true,
        ...summary,
      };
      await rest(`profiles?id=eq.${user}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ settings, updated_at: new Date().toISOString() }),
      });
      const finalSummary = { source: 'Bingers', strategy: STRATEGY, preserves_manual: true, ratings_ignored: true, lists_ignored: true, verified_history_records: historyCount, ...summary };
      await rest(`imports?id=eq.${importId}&profile_id=eq.${user}&status=eq.processing&processing_cursor=eq.${cursor}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          status: 'completed',
          matched_items: Number(summary.library_items || importMediaItems),
          unmatched_items: 0,
          processing_cursor: total,
          summary: finalSummary,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
      return json({ ok: true, summary: finalSummary });
    }

    throw new ImportError('UNKNOWN_ACTION', 400, 'Ação desconhecida.');
  } catch (error) {
    const e = asImportError(error);
    if (user && importId) await markPermanentFailure(user, importId, action, e);
    return json({ ok: false, code: e.code, error: e.message, details: e.details || undefined, retryable: e.status === 401 || e.status === 408 || e.status === 425 || e.status === 429 || e.status >= 500 }, e.status);
  }
});
