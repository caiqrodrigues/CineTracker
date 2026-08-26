import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const H = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' };
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};
const STRATEGY = 'hotfix17_resilient_import';
const json = (d: any, s = 200) => new Response(JSON.stringify(d), {
  status: s,
  headers: { ...CORS, 'content-type': 'application/json', 'cache-control': 'no-store' },
});

class AppError extends Error {
  status: number;
  code: string;
  transient: boolean;
  details?: string;
  constructor(message: string, status = 422, code = 'VALIDATION', transient = false, details?: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.transient = transient;
    this.details = details;
  }
}

class RestError extends AppError {
  restStatus: number;
  path: string;
  constructor(path: string, status: number, body: string) {
    const transient = status === 408 || status === 425 || status === 429 || status >= 500;
    super(`Falha no banco ao processar ${path.split('?')[0]}.`, transient ? 503 : 422, 'REST_ERROR', transient, body.slice(0, 700));
    this.name = 'RestError';
    this.restStatus = status;
    this.path = path;
  }
}

async function restResponse(path: string, init: RequestInit = {}) {
  let r: Response;
  try {
    r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...H, ...(init.headers || {}) } });
  } catch (e) {
    throw new AppError('Banco temporariamente indisponível.', 503, 'REST_NETWORK', true, e instanceof Error ? e.message : String(e));
  }
  const text = await r.text();
  if (!r.ok) throw new RestError(path, r.status, text);
  return { response: r, text };
}

async function rest(path: string, init: RequestInit = {}) {
  const { text } = await restResponse(path, init);
  return text ? JSON.parse(text) : null;
}

async function countExact(path: string) {
  const { response } = await restResponse(path, {
    method: 'GET',
    headers: { Prefer: 'count=exact', Range: '0-0' },
  });
  const range = response.headers.get('content-range') || '';
  const match = range.match(/\/(\d+|\*)$/);
  if (!match || match[1] === '*') throw new AppError('Não foi possível validar a contagem final da importação.', 503, 'COUNT_UNAVAILABLE', true);
  return Number(match[1]);
}

async function uid(req: Request) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) throw new AppError('Sessão ausente', 401, 'AUTH_MISSING');
  let r: Response;
  try {
    r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SERVICE, Authorization: auth } });
  } catch (e) {
    throw new AppError('Não foi possível validar a sessão.', 503, 'AUTH_NETWORK', true, e instanceof Error ? e.message : String(e));
  }
  if (!r.ok) throw new AppError('Sessão expirada. Entre novamente.', 401, 'AUTH_INVALID');
  const u = await r.json();
  if (!u?.id) throw new AppError('Usuário inválido', 401, 'AUTH_INVALID');
  return String(u.id);
}

function hash32(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const mt = (x: any) => x.type === 'movie' ? 'movie' : 'tv';
function stableTmdb(x: any) {
  const real = Number(x.tmdb_id || 0);
  if (Number.isInteger(real) && real > 0 && real <= 2147483647) return real;
  return -(1000000000 + (hash32(`${mt(x)}|${x.tvdb_id || ''}|${x.title || ''}|${x.year || ''}`) % 900000000));
}
function plays(x: any) {
  const n = Number(x?.plays || 1);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}
function optionalPositiveInt(v: any) {
  if (v === null || v === undefined || String(v).trim() === '') return null;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 && n <= 2147483647 ? n : null;
}
function requiredInt(v: any, label: string, min: number, max: number) {
  if (v === null || v === undefined || String(v).trim() === '') throw new AppError(`${label} ausente.`, 422, 'INVALID_ROW');
  const raw = String(v).trim();
  let n = Number(raw);
  if (!Number.isInteger(n)) {
    const prefixed = raw.match(/^[sSeE]\s*0*(\d+)$/);
    if (prefixed) n = Number(prefixed[1]);
  }
  if (!Number.isInteger(n) || n < min || n > max) throw new AppError(`${label} inválido: ${raw}`, 422, 'INVALID_ROW');
  return n;
}
function safeIso(v: any) {
  if (v === null || v === undefined || String(v).trim() === '') return null;
  if (typeof v === 'number' || /^\d{10,13}$/.test(String(v).trim())) {
    const n = Number(v);
    const ms = n < 100000000000 ? n * 1000 : n;
    if (Number.isFinite(ms)) {
      const d = new Date(ms);
      if (Number.isFinite(d.getTime())) return d.toISOString();
    }
  }
  const ms = Date.parse(String(v).trim());
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}
function watchDates(x: any, sourceId: number) {
  const first = safeIso(x.first_watched_at);
  const last = safeIso(x.last_watched_at);
  const valid = last || first;
  if (!valid) throw new AppError(`Histórico ${sourceId}: data de visualização inválida ou ausente.`, 422, 'INVALID_WATCH_DATE');
  return { first: first || valid, last: last || valid };
}
function rowLabel(table: string, row: any) {
  if (table === 'watch_history') return `histórico ${row?.source_history_id ?? '?'}`;
  if (table === 'episode_progress') return `episódio mídia ${row?.media_id ?? '?'} T${row?.season_number ?? '?'}E${row?.episode_number ?? '?'}`;
  if (table === 'media') return `mídia ${row?.media_type ?? '?'}:${row?.tmdb_id ?? '?'}`;
  if (table === 'media_overrides') return `estado ${row?.media_id ?? '?'}:${row?.state ?? '?'}`;
  return table;
}

async function insert(table: string, rows: any[], conflict = '', mode: 'merge' | 'ignore' = 'merge') {
  if (!rows.length) return;
  const q = conflict ? `?on_conflict=${encodeURIComponent(conflict)}` : '';
  const resolution = conflict ? (mode === 'ignore' ? 'resolution=ignore-duplicates,return=minimal' : 'resolution=merge-duplicates,return=minimal') : 'return=minimal';
  await rest(`${table}${q}`, { method: 'POST', headers: { Prefer: resolution }, body: JSON.stringify(rows) });
}

function deterministicDbError(e: unknown) {
  return e instanceof RestError && [400, 409, 422].includes(e.restStatus);
}

async function insertResilient(table: string, rows: any[], conflict = '', mode: 'merge' | 'ignore' = 'merge'): Promise<void> {
  if (!rows.length) return;
  try {
    await insert(table, rows, conflict, mode);
    return;
  } catch (e) {
    if (!deterministicDbError(e)) throw e;
    if (rows.length === 1) {
      const detail = e instanceof RestError ? e.details : (e instanceof Error ? e.message : String(e));
      throw new AppError(`Registro inválido em ${rowLabel(table, rows[0])}.`, 422, 'ROW_REJECTED', false, detail);
    }
    const mid = Math.floor(rows.length / 2);
    await insertResilient(table, rows.slice(0, mid), conflict, mode);
    await insertResilient(table, rows.slice(mid), conflict, mode);
  }
}

async function owned(u: string, id: number) {
  const r = await rest(`imports?id=eq.${id}&profile_id=eq.${u}&select=id,status,summary,error_message`);
  if (!r?.[0]) throw new AppError('Importação não pertence ao usuário', 404, 'IMPORT_NOT_FOUND');
  return r[0];
}

async function mediaMap(ids: number[]) {
  const unique = [...new Set(ids.filter(n => Number.isInteger(n) && n !== 0 && n >= -2147483648 && n <= 2147483647))];
  if (!unique.length) return new Map<string, any>();
  const r = await rest(`media?select=id,tmdb_id,media_type,title&tmdb_id=in.(${unique.join(',')})`);
  return new Map((r || []).map((m: any) => [`${m.media_type}:${m.tmdb_id}`, m]));
}

const progressStates = new Set(['AlreadySeen', 'Completed', 'InProgress', 'NotInterested']);
function conflicts(incoming: string, manual: Set<string>) {
  if (manual.has(incoming)) return true;
  if (incoming === 'AlreadySeen' || incoming === 'InProgress' || incoming === 'Completed') return [...manual].some(s => progressStates.has(s));
  if (incoming === 'AddedToWatchlist') return [...manual].some(s => progressStates.has(s));
  if (incoming === 'WatchLater') return manual.has('AlreadySeen') || manual.has('Completed') || manual.has('NotInterested');
  return false;
}
async function withoutConflictingManualOverrides(user: string, rows: any[]) {
  if (!rows.length) return rows;
  const ids = [...new Set(rows.map((x: any) => Number(x.media_id)).filter(n => Number.isInteger(n) && n > 0))];
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

async function clearPreviousImport(user: string) {
  const previous = await rest(`imports?profile_id=eq.${user}&select=id,filename,summary`);
  const ids = (previous || [])
    .filter((x: any) => String(x?.summary?.source || '').toLowerCase() === 'bingers' || /^bingers/i.test(String(x?.filename || '')))
    .map((x: any) => Number(x.id))
    .filter((n: number) => Number.isInteger(n) && n > 0);

  if (ids.length) {
    const inIds = ids.join(',');
    await rest(`episode_progress?profile_id=eq.${user}&origin=eq.import&source_import_id=in.(${inIds})`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
    await rest(`media_overrides?profile_id=eq.${user}&origin=eq.import&source_import_id=in.(${inIds})`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  }
  await rest(`watch_history?profile_id=eq.${user}&source=eq.bingers`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  if (ids.length) await rest(`imports?profile_id=eq.${user}&id=in.(${ids.join(',')})`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
}

async function markFailed(user: string, importId: number, action: string, err: AppError) {
  if (!user || !importId || err.transient || err.status === 401) return;
  try {
    const r = await rest(`imports?id=eq.${importId}&profile_id=eq.${user}&select=summary,status`);
    const current = r?.[0];
    if (!current || current.status === 'completed') return;
    const now = new Date().toISOString();
    const summary = {
      ...(current.summary || {}),
      source: 'Bingers', strategy: STRATEGY, phase: 'failed', failed_action: action,
      error_code: err.code, failed_at: now, preserves_manual: true,
    };
    await rest(`imports?id=eq.${importId}&profile_id=eq.${user}`, {
      method: 'PATCH', headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'failed', error_message: `${err.message}${err.details ? ` ${err.details.slice(0, 350)}` : ''}`.slice(0, 1000), summary, updated_at: now }),
    });
  } catch { /* do not mask the original error */ }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, error: 'Método não permitido', code: 'METHOD' }, 405);

  let user = '';
  let importId = 0;
  let action = '';
  try {
    user = await uid(req);
    const b = await req.json().catch(() => ({}));
    action = String(b.action || '');

    if (action === 'begin') {
      await clearPreviousImport(user);
      const totalItems = requiredInt(b.total_items ?? 0, 'Total de itens', 0, 2147483647);
      const r = await rest('imports', {
        method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({
          profile_id: user, filename: String(b.filename || 'Bingers'), file_type: b.file_type === 'json' ? 'json' : 'zip', status: 'processing',
          total_items: totalItems, matched_items: 0, unmatched_items: 0, processing_cursor: 0,
          summary: { source: 'Bingers', strategy: STRATEGY, phase: 'begin', preserves_manual: true, ratings_ignored: true, lists_ignored: true },
        }),
      });
      return json({ ok: true, import_id: r?.[0]?.id, strategy: STRATEGY });
    }

    importId = requiredInt(b.import_id, 'import_id', 1, 2147483647);
    const importRow = await owned(user, importId);
    if (importRow.status === 'completed' && action === 'finish') return json({ ok: true, summary: importRow.summary || {}, already_completed: true });
    if (importRow.status === 'failed') throw new AppError('Esta tentativa já foi marcada como falha. Inicie uma nova importação.', 409, 'IMPORT_FAILED');

    if (action === 'library_batch') {
      const rows = Array.isArray(b.rows) ? b.rows : [];
      if (!rows.length || rows.length > 200) throw new AppError('Lote de biblioteca deve ter 1-200 registros', 422, 'INVALID_BATCH');
      const now = new Date().toISOString();
      const mediaRows = rows.map((x: any) => ({
        tmdb_id: stableTmdb(x), media_type: mt(x), media_kind: x.type === 'movie' ? 'movie' : 'series', title: String(x.title || 'Sem título'),
        original_title: x.original_title || null, release_year: optionalPositiveInt(x.year),
        raw_tmdb: { tvdb_id: optionalPositiveInt(x.tvdb_id), source_tmdb_id: optionalPositiveInt(x.tmdb_id), bingers_added_at: safeIso(x.added_at), import_key: x.import_key || null, history_only: x.history_only === true || undefined },
        updated_at: now,
      }));
      await insertResilient('media', mediaRows, 'tmdb_id,media_type', 'ignore');
      const map = await mediaMap(mediaRows.map((m: any) => m.tmdb_id));
      let ovs: any[] = [];
      for (let i = 0; i < rows.length; i++) {
        const x = rows[i], m = mediaRows[i], found = map.get(`${m.media_type}:${m.tmdb_id}`);
        if (!found) throw new AppError(`Biblioteca: mídia não encontrada após gravação (${m.media_type}:${m.tmdb_id}, ${m.title}).`, 422, 'MEDIA_MAPPING_FAILED');
        if (x.ct13_added_to_watchlist === true) ovs.push({ profile_id: user, media_id: found.id, state: 'AddedToWatchlist', origin: 'import', source_import_id: importId });
        if (x.ct13_watch_later === true) ovs.push({ profile_id: user, media_id: found.id, state: 'WatchLater', origin: 'import', source_import_id: importId });
        if (x.type === 'show' && x.ct13_in_progress === true) ovs.push({ profile_id: user, media_id: found.id, state: 'InProgress', origin: 'import', source_import_id: importId });
      }
      ovs = await withoutConflictingManualOverrides(user, ovs);
      await insertResilient('media_overrides', ovs, 'profile_id,media_id,state', 'ignore');
      const cursor = Number(b.cursor || 0) + rows.length;
      await rest(`imports?id=eq.${importId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({
        processing_cursor: cursor, updated_at: now,
        summary: { source: 'Bingers', strategy: STRATEGY, phase: 'library', progress: Number(b.progress || 0), preserves_manual: true },
      }) });
      return json({ ok: true, count: rows.length, cursor });
    }

    if (action === 'watches_batch') {
      const rows = Array.isArray(b.rows) ? b.rows : [];
      if (!rows.length || rows.length > 200) throw new AppError('Lote de histórico deve ter 1-200 registros', 422, 'INVALID_BATCH');
      const mediaIds = rows.map((x: any) => requiredInt(x.media_tmdb_id, `Histórico ${x.source_history_id || '?'}: media_tmdb_id`, -2147483648, 2147483647));
      const map = await mediaMap(mediaIds), hist: any[] = [], prog: any[] = [];
      let ovs: any[] = [];
      const states = new Set<string>();

      for (const x of rows) {
        const sourceId = requiredInt(x.source_history_id, 'source_history_id', 1, Number.MAX_SAFE_INTEGER);
        const mediaTmdbId = requiredInt(x.media_tmdb_id, `Histórico ${sourceId}: media_tmdb_id`, -2147483648, 2147483647);
        const type = x.media_type === 'movie' ? 'movie' : 'tv';
        const m = map.get(`${type}:${mediaTmdbId}`);
        if (!m) throw new AppError(`Histórico ${sourceId}: mídia ${type}:${mediaTmdbId} não encontrada.`, 422, 'MEDIA_MAPPING_FAILED');
        const dates = watchDates(x, sourceId), p = plays(x);
        const common = {
          profile_id: user, source: 'bingers', source_history_id: sourceId, media_id: m.id,
          season_number: null as number | null, episode_number: null as number | null,
          watched_at: dates.last,
          external_ids: { plays: p, first_watched_at: dates.first, last_watched_at: dates.last, tvdb_id: optionalPositiveInt(x.tvdb_id), tmdb_id: optionalPositiveInt(x.tmdb_id) },
        };

        if (x.type === 'movie') {
          hist.push({ ...common, item_type: 'movie', title: x.title || m.title });
          const k = `${m.id}:AlreadySeen`;
          if (!states.has(k)) { states.add(k); ovs.push({ profile_id: user, media_id: m.id, state: 'AlreadySeen', origin: 'import', source_import_id: importId, watched_at: dates.last }); }
        } else if (x.type === 'episode') {
          const s = requiredInt(x.season_number, `Histórico ${sourceId}: temporada`, 0, 10000);
          const e = requiredInt(x.episode_number, `Histórico ${sourceId}: episódio`, 0, 100000);
          hist.push({ ...common, item_type: 'episode', season_number: s, episode_number: e, title: `${x.title || m.title} — T${s}E${e}` });
          prog.push({ profile_id: user, media_id: m.id, season_number: s, episode_number: e, watched: true, watched_at: dates.last, origin: 'import', source_import_id: importId });
          const k = `${m.id}:InProgress`;
          if (!states.has(k)) { states.add(k); ovs.push({ profile_id: user, media_id: m.id, state: 'InProgress', origin: 'import', source_import_id: importId, watched_at: dates.last }); }
        } else {
          throw new AppError(`Histórico ${sourceId}: tipo não suportado (${String(x.type || 'vazio')}).`, 422, 'INVALID_WATCH_TYPE');
        }
      }

      ovs = await withoutConflictingManualOverrides(user, ovs);
      await insertResilient('watch_history', hist, 'profile_id,source,source_history_id');
      await insertResilient('episode_progress', prog, 'profile_id,media_id,season_number,episode_number', 'ignore');
      await insertResilient('media_overrides', ovs, 'profile_id,media_id,state', 'ignore');
      const cursor = Number(b.cursor || 0) + rows.length;
      const now = new Date().toISOString();
      await rest(`imports?id=eq.${importId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({
        processing_cursor: cursor, updated_at: now,
        summary: { source: 'Bingers', strategy: STRATEGY, phase: 'history', progress: Number(b.progress || 0), preserves_manual: true },
      }) });
      return json({ ok: true, count: rows.length, cursor });
    }

    if (action === 'finish') {
      const s = b.summary || {};
      const unmatched = Number(s.unmatched_watch_events || 0);
      if (unmatched > 0) throw new AppError('Importação bloqueada: existem registros de histórico não mapeados.', 422, 'UNMATCHED_HISTORY');
      const expected = requiredInt(s.watch_records ?? s.raw_watch_records ?? 0, 'Quantidade esperada do histórico', 0, 2147483647);
      const rawExpected = requiredInt(s.raw_watch_records ?? expected, 'Quantidade bruta do histórico', 0, 2147483647);
      if (expected !== rawExpected) throw new AppError(`Histórico incompleto antes da finalização: ${expected}/${rawExpected} registros mapeados.`, 422, 'HISTORY_PREVIEW_MISMATCH');
      const actual = await countExact(`watch_history?profile_id=eq.${user}&source=eq.bingers&select=id`);
      if (actual !== expected) throw new AppError(`Histórico incompleto: esperados ${expected} registros, gravados ${actual}.`, 422, 'HISTORY_COUNT_MISMATCH');

      const now = new Date().toISOString();
      const finalSummary = { source: 'Bingers', strategy: STRATEGY, preserves_manual: true, ratings_ignored: true, lists_ignored: true, ...s, verified_watch_records: actual };
      const p = await rest(`profiles?id=eq.${user}&select=settings`), settings = { ...(p?.[0]?.settings || {}) };
      settings.bingers_import = { import_id: importId, imported_at: now, preserves_manual: true, ratings_ignored: true, lists_ignored: true, ...s, verified_watch_records: actual, strategy: STRATEGY };
      await rest(`profiles?id=eq.${user}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ settings, updated_at: now }) });
      await rest(`imports?id=eq.${importId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({
        status: 'completed', matched_items: Number(s.library_items || 0), unmatched_items: unmatched,
        processing_cursor: Number(s.import_media_items || s.library_items || 0) + rawExpected,
        summary: finalSummary, completed_at: now, updated_at: now, error_message: null,
      }) });
      return json({ ok: true, summary: finalSummary });
    }

    throw new AppError('Ação desconhecida', 422, 'UNKNOWN_ACTION');
  } catch (e) {
    const err = e instanceof AppError ? e : new AppError(e instanceof Error ? e.message : String(e), 500, 'INTERNAL', true);
    await markFailed(user, importId, action, err);
    return json({ ok: false, error: err.message, code: err.code, details: err.details || undefined, retryable: err.transient }, err.status);
  }
});
