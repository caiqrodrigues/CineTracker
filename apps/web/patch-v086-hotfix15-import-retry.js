(() => {
'use strict';
if (window.__ctHotfix15ImportRetry) return;
window.__ctHotfix15ImportRetry = true;
window.__ctHotfix17ImportResilience = true;

const nativeFetch15 = window.fetch.bind(window);
const endpoint15 = '/functions/v1/ct-import-bingers-user';
const retryableStatus15 = new Set([408, 425, 429, 500, 502, 503, 504]);
const retryDelay15 = Array.isArray(window.__ctHotfix15RetryDelays) ? window.__ctHotfix15RetryDelays : [350, 900, 1800, 3500, 6500];
const requestTimeout15 = Number(window.__ctHotfix15RetryTimeoutMs || 20000);
const sleep15r = ms => new Promise(resolve => setTimeout(resolve, ms));
let refreshPromise15 = null;

function requestUrl15(input) {
  try { return typeof input === 'string' ? input : String(input?.url || input || ''); }
  catch { return ''; }
}
function action15(init) {
  try {
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null;
    return String(body?.action || '');
  } catch { return ''; }
}
function session15() {
  try { return typeof ctSession !== 'undefined' ? ctSession : null; }
  catch { return null; }
}
function refreshAvailable15() {
  try { return typeof ctRefreshSession === 'function'; }
  catch { return false; }
}
function expiresSoon15(session) {
  const expiresAt = Number(session?.expires_at || 0);
  return !!session?.refresh_token && (!expiresAt || expiresAt <= Math.floor(Date.now() / 1000) + 120);
}
async function ensureFreshSession15(force = false) {
  const before = session15();
  if (!refreshAvailable15() || !before?.refresh_token || (!force && !expiresSoon15(before))) return false;
  if (!refreshPromise15) {
    refreshPromise15 = Promise.resolve().then(() => ctRefreshSession()).finally(() => { refreshPromise15 = null; });
  }
  await refreshPromise15;
  return true;
}
function headersWithCurrentAuth15(headers) {
  const token = session15()?.access_token;
  if (!token) return headers;
  if (typeof Headers !== 'undefined') {
    try {
      const out = new Headers(headers || {});
      out.set('Authorization', `Bearer ${token}`);
      return out;
    } catch {}
  }
  if (Array.isArray(headers)) {
    const out = headers.filter(([k]) => String(k).toLowerCase() !== 'authorization');
    out.push(['Authorization', `Bearer ${token}`]);
    return out;
  }
  const out = { ...(headers || {}) };
  for (const key of Object.keys(out)) if (key.toLowerCase() === 'authorization') delete out[key];
  out.Authorization = `Bearer ${token}`;
  return out;
}
function freshInit15(init) {
  return { ...(init || {}), headers: headersWithCurrentAuth15(init?.headers) };
}
function showRetry15(action, attempt, reason) {
  try {
    const label = document.querySelector('.ct10-progress-label');
    if (!label) return;
    const phase = action === 'finish' ? 'finalização' : action === 'library_batch' ? 'biblioteca' : action === 'begin' ? 'início' : 'histórico';
    label.textContent = `Conexão instável na ${phase}. Tentativa automática ${attempt}/${retryDelay15.length + 1}…`;
    label.dataset.ct15Retry = `${action}:${attempt}:${reason || 'network'}`;
  } catch {}
}
async function timedFetch15(input, init) {
  const controller = new AbortController();
  const callerSignal = init?.signal;
  let callerAbort = null;
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort(callerSignal.reason);
    else {
      callerAbort = () => controller.abort(callerSignal.reason);
      callerSignal.addEventListener('abort', callerAbort, { once: true });
    }
  }
  const timer = setTimeout(() => controller.abort(new DOMException('Import request timed out', 'AbortError')), requestTimeout15);
  try {
    return await nativeFetch15(input, { ...(init || {}), signal: controller.signal });
  } finally {
    clearTimeout(timer);
    if (callerSignal && callerAbort) callerSignal.removeEventListener('abort', callerAbort);
  }
}
async function authenticatedFetch15(input, init, timed) {
  await ensureFreshSession15(false);
  let currentInit = freshInit15(init);
  let response = await (timed ? timedFetch15(input, currentInit) : nativeFetch15(input, currentInit));
  if (response?.status !== 401) return response;
  await ensureFreshSession15(true);
  currentInit = freshInit15(init);
  return await (timed ? timedFetch15(input, currentInit) : nativeFetch15(input, currentInit));
}

window.fetch = async function hotfix15Fetch(input, init) {
  const url = requestUrl15(input);
  const method = String(init?.method || (typeof Request !== 'undefined' && input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase();
  if (!url.includes(endpoint15) || method !== 'POST') return nativeFetch15(input, init);

  const action = action15(init);
  const idempotentActions15 = ['library_batch', 'watches_batch', 'finish'];
  if (action === 'begin') {
    // begin stays single-shot for network/5xx. A 401 is retried only after refreshing the JWT;
    // the server authenticates before running begin, so that retry cannot clear a committed run.
    return authenticatedFetch15(input, init, false);
  }
  if (!idempotentActions15.includes(action)) return authenticatedFetch15(input, init, false);

  let lastError = null;
  let lastResponse = null;
  const attempts = retryDelay15.length + 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await authenticatedFetch15(input, init, true);
      if (!retryableStatus15.has(response.status)) return response;
      lastResponse = response;
      if (attempt === attempts) return response;
      showRetry15(action, attempt + 1, `HTTP ${response.status}`);
    } catch (error) {
      if (init?.signal?.aborted) throw error;
      lastError = error;
      if (attempt === attempts) throw error;
      showRetry15(action, attempt + 1, error?.name || 'network');
    }
    await sleep15r(retryDelay15[attempt - 1]);
  }
  if (lastResponse) return lastResponse;
  throw lastError || new Error('Falha transitória na importação.');
};
})();
