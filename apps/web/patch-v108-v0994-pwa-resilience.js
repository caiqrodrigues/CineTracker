(() => {
'use strict';
if (window.__ct0994PwaResilienceLoaded) return;
window.__ct0994PwaResilienceLoaded = true;
window.__ct0994PwaResilience = 'v108-web-pwa-home-resilience';

const HOME_RPC_108 = 'cinetracker_profile_home_payload_v0994';
const HOME_CACHE_KEY_108 = 'ct0994_home_preload_v1';
const HOME_TIMEOUT_MS_108 = Number(window.__ct0994HomeTimeoutMs || 10000);
const HOME_STALE_MAX_MS_108 = 7 * 24 * 60 * 60 * 1000;
const rawRpc108 = typeof window.sbRpc === 'function' ? window.sbRpc : (typeof sbRpc === 'function' ? sbRpc : null);

function sessionUser108() {
  try { if (currentUser?.id) return String(currentUser.id); } catch {}
  try { if (ctSession?.user?.id) return String(ctSession.user.id); } catch {}
  try {
    const raw = localStorage.getItem('cinetracker_session');
    const saved = raw ? JSON.parse(raw) : null;
    return saved?.user?.id ? String(saved.user.id) : '';
  } catch { return ''; }
}

function readStaleHome108() {
  try {
    const raw = localStorage.getItem(HOME_CACHE_KEY_108);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved?.data) return null;
    const uid = sessionUser108();
    if (uid && saved?.uid && String(saved.uid) !== uid) return null;
    const age = Date.now() - Number(saved.at || 0);
    if (!Number.isFinite(age) || age < 0 || age > HOME_STALE_MAX_MS_108) return null;
    return saved.data;
  } catch { return null; }
}

function withTimeout108(promise, ms) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('Tempo limite ao sincronizar Home. Tente novamente.'));
    }, ms);
    Promise.resolve(promise).then(value => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    }, error => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
  });
}

if (rawRpc108) {
  const rpc108 = async function(name, body = {}) {
    if (name !== HOME_RPC_108) return rawRpc108(name, body);

    const stale = readStaleHome108();
    try {
      if (typeof navigator !== 'undefined' && navigator.onLine === false && stale) {
        window.__ct0994PreloadedHome = stale;
        return stale;
      }
      return await withTimeout108(Promise.resolve().then(() => rawRpc108(name, body)), HOME_TIMEOUT_MS_108);
    } catch (error) {
      if (stale) {
        window.__ct0994PreloadedHome = stale;
        console.warn('[CineTracker 0.99.4] Home usou cache local após falha/timeout do RPC', error);
        return stale;
      }
      throw error;
    }
  };
  rpc108.__ct0994PwaResilience = true;
  try { sbRpc = rpc108; } catch {}
  window.sbRpc = rpc108;
}
})();
