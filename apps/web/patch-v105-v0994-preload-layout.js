(() => {
'use strict';
if (window.__ct0994PreloadLayoutLoaded) return;
window.__ct0994PreloadLayoutLoaded = true;
window.__ct0994PreloadLayout = 'v105-preload-desktop-frame';

const HOME_RPC = 'cinetracker_profile_home_payload_v0994';
const REMAINING_RPC = 'cinetracker_profile_remaining_v0994';
const HOME_CACHE_KEY = 'ct0994_home_preload_v1';
const HOME_CACHE_TTL = 5 * 60 * 1000;
const RPC_TTL = 45 * 1000;
const rawRpc105 = typeof window.sbRpc === 'function' ? window.sbRpc : (typeof sbRpc === 'function' ? sbRpc : null);
const rpcCache105 = new Map();
let warmStarted105 = false;
let freshHomeStarted105 = false;

function sessionUser105() {
  try { if (currentUser?.id) return String(currentUser.id); } catch {}
  try { if (ctSession?.user?.id) return String(ctSession.user.id); } catch {}
  try {
    const raw = localStorage.getItem('cinetracker_session');
    const saved = raw ? JSON.parse(raw) : null;
    return saved?.user?.id ? String(saved.user.id) : '';
  } catch { return ''; }
}
function authenticated105() {
  try { return Boolean(ctSession?.access_token); } catch { return false; }
}
function readHomeCache105() {
  try {
    const raw = localStorage.getItem(HOME_CACHE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const uid = sessionUser105();
    if (!uid || saved?.uid !== uid || !saved?.data || Date.now() - Number(saved.at || 0) > HOME_CACHE_TTL) return null;
    return saved.data;
  } catch { return null; }
}
function saveHomeCache105(data) {
  if (!data || typeof data !== 'object') return;
  const uid = sessionUser105();
  if (!uid) return;
  try { localStorage.setItem(HOME_CACHE_KEY, JSON.stringify({ uid, at: Date.now(), data })); } catch {}
}
function key105(name, body) {
  let suffix = '{}';
  try { suffix = JSON.stringify(body || {}); } catch {}
  return `${name}:${suffix}`;
}
function setCached105(name, body, data) {
  rpcCache105.set(key105(name, body), { at: Date.now(), data });
  if (name === HOME_RPC && data) {
    window.__ct0994PreloadedHome = data;
    saveHomeCache105(data);
    warmHomeImages105(data);
  }
  return data;
}
async function rpc105(name, body = {}) {
  if (!rawRpc105) throw new Error('RPC indisponível');
  const cacheable = name === HOME_RPC || name === REMAINING_RPC || name === 'cinetracker_profile_media_dashboard_v0991' || name === 'cinetracker_profile_media_dashboard' || name === 'cinetracker_profile_stats' || name === 'cinetracker_series_state_stats';
  if (!cacheable) return rawRpc105(name, body);
  const key = key105(name, body);
  const hit = rpcCache105.get(key);
  if (hit && Date.now() - hit.at < RPC_TTL) return hit.data;
  if (name === HOME_RPC && window.__ct0994PreloadedHome) {
    const cached = window.__ct0994PreloadedHome;
    rpcCache105.set(key, { at: Date.now(), data: cached });
    return cached;
  }
  const pendingKey = `${key}:pending`;
  const pending = rpcCache105.get(pendingKey)?.data;
  if (pending) return pending;
  const promise = Promise.resolve(rawRpc105(name, body))
    .then(data => setCached105(name, body, data))
    .finally(() => rpcCache105.delete(pendingKey));
  rpcCache105.set(pendingKey, { at: Date.now(), data: promise });
  return promise;
}
if (rawRpc105) {
  try { sbRpc = rpc105; } catch {}
  window.sbRpc = rpc105;
}

function imageUrl105(path, size = 'w342') {
  try { return path ? `${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${size}` : ''; } catch { return ''; }
}
function warmImage105(path, size = 'w342') {
  if (!path || typeof Image !== 'function') return;
  try { const im = new Image(); im.decoding = 'async'; im.src = imageUrl105(path, size); } catch {}
}
function warmHomeImages105(data) {
  const series = Array.isArray(data?.series) ? data.series : [];
  const movies = Array.isArray(data?.movie_watchlist) ? data.movie_watchlist : [];
  const rows = [...series.filter(x => x?.poster_path).slice(0, 20), ...movies.filter(x => x?.poster_path).slice(0, 32)];
  rows.forEach(x => warmImage105(x.poster_path));
}
function warmDiscoverImages105(data) {
  if (!data || typeof data !== 'object') return;
  const rows = Object.values(data).flatMap(v => Array.isArray(v) ? v : (v && typeof v === 'object' ? [v] : []));
  rows.filter(x => x?.poster_path).slice(0, 18).forEach(x => warmImage105(x.poster_path, 'w500'));
}

const storedHome105 = readHomeCache105();
if (storedHome105) {
  window.__ct0994PreloadedHome = storedHome105;
  warmHomeImages105(storedHome105);
}

async function refreshHome105() {
  if (!rawRpc105 || !authenticated105() || freshHomeStarted105) return null;
  freshHomeStarted105 = true;
  try {
    const data = await rawRpc105(HOME_RPC, {});
    return setCached105(HOME_RPC, {}, data);
  } catch (error) {
    console.warn('[CineTracker 0.99.4] atualização silenciosa da Home', error);
    return null;
  }
}

window.__ct0994PreloadCore = async function({ target = 'home' } = {}) {
  if (!authenticated105()) return false;
  const homeJob = Promise.resolve(rpc105(HOME_RPC, {})).then(data => { warmHomeImages105(data); return data; });
  const dashboardJob = Promise.resolve().then(() => window.__ct991Preload?.(false)).catch(() => null);
  const remainingJob = Promise.resolve(rpc105(REMAINING_RPC, {})).catch(() => null);
  const discoverJob = Promise.resolve().then(() => window.__ct991PreloadDiscover?.()).then(data => { warmDiscoverImages105(data); return data; }).catch(() => null);

  if (target === 'profile') await Promise.all([homeJob, dashboardJob, remainingJob]);
  else if (target === 'discover') await Promise.all([homeJob, dashboardJob, discoverJob]);
  else if (target === 'home') await homeJob;

  void dashboardJob;
  void remainingJob;
  void discoverJob;
  return true;
};

function startWarm105() {
  if (warmStarted105 || !authenticated105()) return;
  warmStarted105 = true;
  void window.__ct0994PreloadCore({ target: 'home' }).catch(error => console.warn('[CineTracker 0.99.4] preload', error));
  if (storedHome105) setTimeout(() => void refreshHome105(), 900);
}
for (const delay of [0, 140, 420]) setTimeout(startWarm105, delay);
window.addEventListener('cinetracker:auth-state-change', event => {
  if (event?.detail?.event === 'SIGNED_IN') {
    warmStarted105 = false;
    freshHomeStarted105 = false;
    startWarm105();
  }
});
window.addEventListener('cinetracker:data-changed', () => {
  rpcCache105.clear();
  window.__ct0994PreloadedHome = null;
  try { localStorage.removeItem(HOME_CACHE_KEY); } catch {}
  warmStarted105 = false;
  freshHomeStarted105 = false;
  setTimeout(startWarm105, 80);
});

const frameStyle105 = document.createElement('style');
frameStyle105.id = 'ct0994-desktop-frame-v105';
frameStyle105.textContent = `
@media (min-width:851px){
  html,body,#app{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
  .app{width:100%!important;max-width:100%!important;grid-template-columns:180px minmax(0,1fr)!important}
  .content{margin:0!important;max-width:none!important;width:100%!important;min-width:0!important;padding:20px clamp(22px,2.6vw,40px)!important;overflow-x:hidden!important}
  .content>.header,.content>.search,.ct991-shell,.ct992-shell,.ct91-settings,#ct991-profile,#ct994-home-root{width:100%!important;max-width:1280px!important;margin-left:auto!important;margin-right:auto!important;min-width:0!important}
  .ct992-viewport{height:calc(100vh - 230px)!important;min-height:520px!important;max-height:none!important;width:100%!important}
  .ct991-profile,.ct991-mainstats,.ct991-panel,.ct991-sections,.ct991-section,.ct991-rec,.ct991-rec-section,.ct991-media-grid,.ct991-extra{min-width:0!important;max-width:100%!important}
  .ct991-items.carousel,.ct991-timeline,.ct991-calrow{max-width:100%!important}
}
`;
document.getElementById(frameStyle105.id)?.remove();
document.head.appendChild(frameStyle105);
})();
