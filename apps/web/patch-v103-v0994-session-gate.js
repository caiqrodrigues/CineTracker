(() => {
'use strict';
if (window.__ct0994SessionGateLoaded) return;
window.__ct0994SessionGateLoaded = true;
window.__ct0994SessionGate = 'web-0.99.4-auth-required';

let restoring994 = null;
const rawRpc994 = typeof sbRpc === 'function' ? sbRpc : null;
const rawNavigate994 = window.__ct0994Navigate;
const rawSignIn994 = typeof signIn === 'function' ? signIn : null;
const rawSignUp994 = typeof signUp === 'function' ? signUp : null;

function hasSession994() {
  try { return Boolean(ctSession?.access_token); } catch { return false; }
}
function currentRoute994() {
  let v = 'home';
  try { v = String(typeof view !== 'undefined' ? view : (window.view || 'home')); } catch {}
  if (v === 'history') return 'profile';
  return ['home','discover','profile','settings'].includes(v) ? v : 'home';
}
function showAuth994() {
  try { ctSession = null; currentUser = null; } catch {}
  try {
    if (typeof renderAuth === 'function') {
      renderAuth();
      return false;
    }
  } catch (error) { console.warn('[CineTracker 0.99.4] renderAuth', error); }
  try { if (typeof render === 'function') render(); } catch (error) { console.warn('[CineTracker 0.99.4] render login', error); }
  return false;
}
async function ensureSession994() {
  if (hasSession994()) return true;
  if (restoring994) return restoring994;
  restoring994 = (async () => {
    try {
      if (typeof restoreSession === 'function') {
        const restored = await restoreSession();
        if (restored && hasSession994()) return true;
      }
    } catch (error) {
      console.warn('[CineTracker 0.99.4] sessão não pôde ser restaurada', error);
    }
    return false;
  })().finally(() => { restoring994 = null; });
  return restoring994;
}

if (rawRpc994) {
  sbRpc = async function(name, body = {}) {
    if (!hasSession994() && !(await ensureSession994())) {
      showAuth994();
      throw new Error('Sessão necessária. Entre novamente.');
    }
    return rawRpc994(name, body);
  };
  window.sbRpc = sbRpc;
}

async function guardedNavigate994(target) {
  if (!(await ensureSession994())) return showAuth994();
  if (typeof rawNavigate994 !== 'function') return false;
  return rawNavigate994(target);
}
window.__ct0994Navigate = guardedNavigate994;
window.ct0994Navigate = guardedNavigate994;
window.ct0992Navigate = guardedNavigate994;
window.ct991Navigate = guardedNavigate994;
window.ct98Navigate = guardedNavigate994;

if (rawSignIn994) {
  signIn = async function(...args) {
    const result = await rawSignIn994(...args);
    if (hasSession994()) setTimeout(() => void guardedNavigate994('home'), 0);
    return result;
  };
  window.signIn = signIn;
}
if (rawSignUp994) {
  signUp = async function(...args) {
    const result = await rawSignUp994(...args);
    if (hasSession994()) setTimeout(() => void guardedNavigate994('home'), 0);
    return result;
  };
  window.signUp = signUp;
}

setTimeout(async () => {
  const ok = await ensureSession994();
  if (!ok) {
    showAuth994();
    return;
  }
  await guardedNavigate994(currentRoute994());
}, 0);
})();
