(() => {
'use strict';
if (window.__ctHotfix15ImportRetry) return;
window.__ctHotfix15ImportRetry = true;

const nativeFetch15 = window.fetch.bind(window);
const endpoint15 = '/functions/v1/ct-import-bingers-user';
const retryableStatus15 = new Set([408, 425, 429, 500, 502, 503, 504]);
const retryDelay15 = [350, 900, 1800, 3500, 6500];
const requestTimeout15 = 20000;
const sleep15r = ms => new Promise(resolve => setTimeout(resolve, ms));

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
function showRetry15(action, attempt, reason) {
  try {
    const label = document.querySelector('.ct10-progress-label');
    if (!label) return;
    const phase = action === 'finish' ? 'finalização' : action === 'library_batch' ? 'biblioteca' : 'histórico';
    label.textContent = `Conexão instável na ${phase}. Tentativa automática ${attempt}/6…`;
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

window.fetch = async function hotfix15Fetch(input, init) {
  const url = requestUrl15(input);
  const method = String(init?.method || (typeof Request !== 'undefined' && input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase();
  if (!url.includes(endpoint15) || method !== 'POST') return nativeFetch15(input, init);

  const action = action15(init);
  // begin intentionally remains single-shot. Retrying begin could clear/restart a run
  // if the server committed but the response was lost.
  if (action === 'begin' || !['library_batch', 'watches_batch', 'finish'].includes(action)) {
    return nativeFetch15(input, init);
  }

  let lastError = null;
  let lastResponse = null;
  const attempts = retryDelay15.length + 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await timedFetch15(input, init);
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
