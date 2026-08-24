(() => {
'use strict';
if (window.__ct61Loaded) return;
window.__ct61Loaded = true;
window.__ctAndroidBuild = '0.0.75';

const CACHE_TTL = 120000;
const responseCache = new Map();
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
  const response = await originalFetch(input, init);
  if (response.ok) responseCache.set(key, { at: Date.now(), response: response.clone() });
  return response;
};

const wait = ms => new Promise(r => setTimeout(r, ms));

async function goto(target, settle = 520) {
  try {
    if (typeof window.ct71Navigate === 'function') window.ct71Navigate(target);
    else if (typeof window.ct48Navigate === 'function') window.ct48Navigate(target);
    else if (typeof window.ct47Navigate === 'function' && target === 'library') window.ct47Navigate(target);
    else {
      window.view = target;
      if (typeof window.render === 'function') window.render();
    }
  } catch {}
  await wait(settle);
}

async function preload() {
  const timeout = setTimeout(() => {
    try { window.CineTrackerNative?.appReady?.(); } catch {}
  }, 9000);

  try {
    await wait(180);
    const order = ['home', 'library', 'discover', 'history', 'profile', 'settings'];
    for (const target of order) await goto(target);
    await goto('home', 700);
    try { window.ct59Refresh?.(true); } catch {}
    await wait(450);
  } finally {
    clearTimeout(timeout);
    try { window.CineTrackerNative?.appReady?.(); } catch {}
  }
}

setTimeout(() => { void preload(); }, 80);
})();
