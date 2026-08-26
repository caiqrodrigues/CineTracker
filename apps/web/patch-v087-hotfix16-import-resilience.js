(() => {
'use strict';
if (window.__ctHotfix16ImportResilience) return;
window.__ctHotfix16ImportResilience = true;

const nativeFetch16 = window.fetch.bind(window);
const endpoint16 = '/functions/v1/ct-import-bingers-user';
const retryableStatus16 = new Set([408, 425, 429, 500, 502, 503, 504]);
const retryDelay16 = Array.isArray(window.__ctHotfix16RetryDelays) ? window.__ctHotfix16RetryDelays : [300, 800, 1600, 3200, 6000];
const requestTimeout16 = Number(window.__ctHotfix16RetryTimeoutMs || 25000);
const sleep16 = ms => new Promise(resolve => setTimeout(resolve, ms));
let refreshPromise16 = null;

function requestUrl16(input) {
  try { return typeof input === 'string' ? input : String(input?.url || input || ''); }
  catch { return ''; }
}
function parseBody16(init) {
  try {
    if (typeof init?.body !== 'string') return null;
    const body = JSON.parse(init.body);
    return body && typeof body === 'object' ? body : null;
  } catch { return null; }
}
function newRunId16() {
  try { if (crypto?.randomUUID) return crypto.randomUUID(); } catch {}
  return `ct16-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}
function withFreshAuth16(init, body) {
  const headers = new Headers(init?.headers || {});
  try {
    const fresh = typeof authHeaders === 'function' ? authHeaders() : {};
    for (const [key, value] of Object.entries(fresh || {})) {
      if (value !== undefined && value !== null && String(value)) headers.set(key, String(value));
    }
  } catch {}
  headers.set('Content-Type', 'application/json');
  return { ...(init || {}), headers, body: JSON.stringify(body) };
}
function showRetry16(action, attempt, reason) {
  const target = document.querySelector('#ct10-progress-wrap .ct10-progress-label');
  if (!target) return;
  const names = { begin: 'início', library_batch: 'biblioteca', watches_batch: 'histórico', finish: 'finalização', status: 'status' };
  target.textContent = `Recuperando ${names[action] || 'importação'}: tentativa ${attempt}${reason ? ` (${reason})` : ''}…`;
}
async function refreshSession16() {
  if (refreshPromise16) return refreshPromise16;
  refreshPromise16 = (async () => {
    if (typeof ctRefreshSession !== 'function') throw new Error('Renovação de sessão indisponível');
    await ctRefreshSession();
    if (!ctSession?.access_token) throw new Error('Sessão não pôde ser renovada');
  })().finally(() => { refreshPromise16 = null; });
  return refreshPromise16;
}
async function refreshIfNearExpiry16() {
  const expiresAt = Number(ctSession?.expires_at || 0);
  if (!expiresAt || !ctSession?.refresh_token) return;
  if (expiresAt <= Math.floor(Date.now() / 1000) + 90) await refreshSession16();
}
async function fetchAttempt16(input, init, body) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  try {
    if (controller) timer = setTimeout(() => controller.abort(), requestTimeout16);
    const next = withFreshAuth16(init, body);
    if (controller) next.signal = controller.signal;
    return await nativeFetch16(input, next);
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}
async function resilientImportFetch16(input, init, originalBody) {
  const body = { ...originalBody };
  if (body.action === 'begin' && !body.client_run_id) body.client_run_id = newRunId16();
  const action = String(body.action || '');
  const maxAttempts = Math.max(2, retryDelay16.length + 1);
  let refreshed401 = false;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await refreshIfNearExpiry16();
      const response = await fetchAttempt16(input, init, body);
      if (response.status === 401 && !refreshed401 && ctSession?.refresh_token) {
        refreshed401 = true;
        showRetry16(action, attempt + 1, 'sessão renovada');
        await refreshSession16();
        continue;
      }
      if (!retryableStatus16.has(response.status) || attempt >= maxAttempts) return response;
      const wait = retryDelay16[Math.min(attempt - 1, retryDelay16.length - 1)] || 0;
      showRetry16(action, attempt + 1, `HTTP ${response.status}`);
      if (wait) await sleep16(wait);
      continue;
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts) throw error;
      const wait = retryDelay16[Math.min(attempt - 1, retryDelay16.length - 1)] || 0;
      const reason = error?.name === 'AbortError' ? 'timeout' : 'conexão';
      showRetry16(action, attempt + 1, reason);
      if (wait) await sleep16(wait);
    }
  }
  throw lastError || new Error('Falha de transporte da importação');
}

window.fetch = async function(input, init = {}) {
  const url = requestUrl16(input);
  const method = String(init?.method || (typeof input !== 'string' ? input?.method : '') || 'GET').toUpperCase();
  const body = parseBody16(init);
  const action = String(body?.action || '');
  if (method !== 'POST' || !url.includes(endpoint16) || !body || !['begin', 'library_batch', 'watches_batch', 'finish', 'status'].includes(action)) {
    return nativeFetch16(input, init);
  }
  return resilientImportFetch16(input, init, body);
};

window.ct16ImportTransport = {
  version: 'HOTFIX16',
  endpoint: endpoint16,
  retryableStatus: [...retryableStatus16],
  timeoutMs: requestTimeout16,
};
})();
