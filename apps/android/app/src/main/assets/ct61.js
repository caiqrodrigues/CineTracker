(() => {
'use strict';
if (window.__ct61Loaded) return;
window.__ct61Loaded = true;
window.__ctAndroidBuild = '0.0.76';

const CACHE_TTL = 120000;
const STARTUP_BUDGET = 2200;
const responseCache = new Map();
const inFlight = new Map();
const originalFetch = window.fetch.bind(window);
const readRpc = new Set([
  'cinetracker_continue_items_v2',
  'cinetracker_episode_state',
  'cinetracker_watch_daily_timeline'
]);

function cacheKey(input, init = {}) {
  const url = typeof input === 'string' ? input : input?.url || '';
  const method = String(init?.method || (typeof input !== 'string' && input?.method) || 'GET').toUpperCase();
  const body = typeof init?.body === 'string' ? init.body : '';
  return `${method}|${url}|${body}`;
}

function rpcName(url) {
  const m = String(url || '').match(/\/rest\/v1\/rpc\/([^?]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

function isCacheable(input, init = {}) {
  const url = typeof input === 'string' ? input : input?.url || '';
  const method = String(init?.method || (typeof input !== 'string' && input?.method) || 'GET').toUpperCase();
  if (/\/functions\/v1\/tmdb-(proxy|image)/.test(url) && method === 'GET') return true;
  if (/\/rest\/v1\//.test(url) && method === 'GET') return true;
  if (method === 'POST' && readRpc.has(rpcName(url))) return true;
  return false;
}

window.fetch = async function(input, init = {}) {
  if (!isCacheable(input, init)) return originalFetch(input, init);
  const key = cacheKey(input, init);
  const hit = responseCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.response.clone();
  if (inFlight.has(key)) {
    const shared = await inFlight.get(key);
    return shared.clone();
  }
  const job = originalFetch(input, init).then(response => {
    if (response.ok) responseCache.set(key, { at: Date.now(), response: response.clone() });
    return response;
  }).finally(() => inFlight.delete(key));
  inFlight.set(key, job);
  return (await job).clone();
};

const wait = ms => new Promise(r => setTimeout(r, ms));
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForSession(maxMs = 1100) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (window.ctSession?.access_token && typeof window.sbRpc === 'function') return true;
    await wait(60);
  }
  return false;
}

async function warmCoreData() {
  if (!(await waitForSession())) return;
  const jobs = [];
  try { jobs.push(window.sbRpc('cinetracker_continue_items_v2', {})); } catch {}
  try { jobs.push(window.sbRpc('cinetracker_watch_daily_timeline', { p_days_back: 15, p_days_forward: 3 })); } catch {}
  try { jobs.push(window.sbApi('media_overrides?select=state,media:media(tmdb_id,media_type,title)&limit=5000')); } catch {}
  await Promise.race([Promise.allSettled(jobs), timeout(STARTUP_BUDGET)]);
}

function finishStartup() {
  try { window.ct59Refresh?.(true); } catch {}
  try { window.ct51Refresh?.(true); } catch {}
  try { window.CineTrackerNative?.appReady?.(); } catch {}
}

async function preload() {
  const hardStop = setTimeout(finishStartup, 3000);
  try {
    await warmCoreData();
  } finally {
    clearTimeout(hardStop);
    finishStartup();
  }
}

setTimeout(() => { void preload(); }, 40);
})();
