import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const edge = await readFile('supabase/functions/ct-import-bingers-user/index.ts', 'utf8');
const retry = await readFile('apps/web/patch-v086-hotfix15-import-retry.js', 'utf8');
const fail = message => { throw new Error(`HOTFIX17 import resilience: ${message}`); };

for (const marker of [
  "const STRATEGY = 'hotfix17_resilient_import'",
  'class RestError extends AppError',
  'async function insertResilient',
  'async function countExact',
  'async function markFailed',
  'HISTORY_COUNT_MISMATCH',
  'source_import_id=in.(',
  "season_number: null as number | null",
  "episode_number: null as number | null",
]) if (!edge.includes(marker)) fail(`backend marker missing: ${marker}`);

if (edge.includes('episode_progress?profile_id=eq.${user}&origin=eq.import`, { method:\'DELETE\'')) fail('broad episode_progress import cleanup returned');
if (edge.includes('media_overrides?profile_id=eq.${user}&origin=eq.import`, { method:\'DELETE\'')) fail('broad media_overrides import cleanup returned');
if (edge.includes('imports?profile_id=eq.${user}`, { method:\'DELETE\'')) fail('broad imports cleanup returned');
if (edge.includes('delete settings.trakt_import')) fail('Bingers finalization must not erase another importer setting');
if (edge.includes('if (!m) continue')) fail('history rows may no longer be silently skipped');

for (const marker of [
  'window.__ctHotfix17ImportResilience = true',
  'ensureFreshSession15',
  'ctRefreshSession()',
  'response?.status !== 401',
  "const idempotentActions15 = ['library_batch', 'watches_batch', 'finish']",
  "if (action === 'begin')",
]) if (!retry.includes(marker)) fail(`transport marker missing: ${marker}`);

if (/retryableStatus15\s*=\s*new Set\([^)]*422/.test(retry)) fail('HTTP 422 must remain deterministic and non-retryable');

const endpoint = 'https://example.supabase.co/functions/v1/ct-import-bingers-user';
let access = 'old';
let refreshes = 0;
let calls = 0;
const ctSession = { access_token: access, refresh_token: 'refresh', expires_at: 1 };
const window = { fetch: async (_input, init) => {
  calls++;
  const headers = init?.headers || {};
  const authorization = headers.Authorization || headers.authorization || (typeof headers.get === 'function' ? headers.get('Authorization') : '');
  if (authorization !== 'Bearer new') fail(`stale Authorization header used: ${authorization}`);
  return { status: calls === 1 ? 401 : 200, ok: calls !== 1 };
}, __ctHotfix15RetryDelays: [1], __ctHotfix15RetryTimeoutMs: 1000 };
const context = vm.createContext({
  window,
  document: { querySelector: () => null },
  console,
  setTimeout,
  clearTimeout,
  AbortController,
  DOMException,
  Request,
  ctSession,
  ctRefreshSession: async () => {
    refreshes++;
    access = 'new';
    ctSession.access_token = access;
    ctSession.expires_at = Math.floor(Date.now() / 1000) + 3600;
  },
});
vm.runInContext(retry, context, { filename: 'patch-v086-hotfix15-import-retry.js' });
const response = await window.fetch(endpoint, {
  method: 'POST',
  headers: { Authorization: 'Bearer old', 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'watches_batch', import_id: 1, rows: [{ source_history_id: 1 }] }),
});
if (response.status !== 200 || calls !== 2 || refreshes < 1) fail(`401 recovery failed: status=${response.status} calls=${calls} refreshes=${refreshes}`);

console.log(`HOTFIX17_IMPORT_RESILIENCE_OK auth_refresh=${refreshes}; auth_calls=${calls}; strict_finish=1; scoped_cleanup=1; row_isolation=1`);
