(() => {
'use strict';
if (window.__ctPreviewNavigationRuntime) return;
window.__ctPreviewNavigationRuntime = 'web-0.99.2-fix2-routes-v2';

/*
 * This layer is intentionally emitted before the 0.99.2 navigation gate.
 * It captures the last known-good 0.99.2/0.99.1 routers and handles the four
 * supported destinations before historical capture listeners can interfere.
 */
const routes = new Set(['home', 'discover', 'profile', 'settings']);
const stable = {
  current: window.ct0992Navigate,
  v991: window.ct991Navigate,
  v98: window.ct98Navigate,
  v92: window.ct92Navigate,
  v91: window.ct91Navigate
};

function normalize(target) {
  const value = String(target || '');
  return value === 'history' ? 'profile' : value;
}

function setCurrent(target) {
  try { view = target; } catch {}
  try { window.view = target; } catch {}
}

function isReady(target) {
  if (target === 'home') return !!document.querySelector('.ct992-shell,.ct991-home,[data-view-screen="home"]');
  if (target === 'discover') return !!document.querySelector('#ct991-discover-results,.ct98-discover,[data-view-screen="discover"]');
  if (target === 'profile') return !!document.querySelector('#ct991-profile,.ct99-profile,.ct98-profile,[data-view-screen="profile"]');
  if (target === 'settings') return !!document.querySelector('.ct91-settings,#ct-v025-save,#ct10-import-panel,[data-view-screen="settings"]');
  return false;
}

function invoke(router, target) {
  if (typeof router !== 'function') return false;
  try {
    const result = router(target);
    return result === false ? false : result ?? true;
  } catch (error) {
    console.error(`CineTracker preview navigation (${target}):`, error);
    return false;
  }
}

function syncActive(target) {
  document.querySelectorAll('.sidebar .nav button,.mobile-nav button').forEach(button => {
    const buttonTarget = normalize(button.dataset.view || button.dataset.view99 || button.dataset.view991);
    const active = buttonTarget === target;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

function fallback(target, firstRouter) {
  if (isReady(target)) return true;
  const candidates = target === 'settings'
    ? [stable.v991, stable.v92, stable.v91, stable.v98]
    : [stable.v991, stable.v98, stable.v92, stable.v91];
  for (const candidate of candidates) {
    if (candidate === firstRouter) continue;
    invoke(candidate, target);
    if (isReady(target)) return true;
  }
  try {
    if (typeof render === 'function') {
      setCurrent(target);
      render();
    }
  } catch (error) {
    console.error(`CineTracker preview navigation fallback (${target}):`, error);
  }
  return isReady(target);
}

function navigate(requested) {
  const target = normalize(requested);
  if (!routes.has(target)) return false;
  setCurrent(target);
  const firstRouter = target === 'home' ? stable.current : (stable.v991 || stable.current);
  const result = invoke(firstRouter, target);
  syncActive(target);
  window.setTimeout(() => {
    fallback(target, firstRouter);
    syncActive(target);
  }, 80);
  window.setTimeout(() => {
    fallback(target, firstRouter);
    syncActive(target);
  }, 260);
  try { window.scrollTo?.(0, 0); } catch {}
  return result !== false;
}

window.__ctPreviewNavigate = navigate;
window.addEventListener('click', event => {
  const button = event.target?.closest?.('.sidebar .nav button,.mobile-nav button');
  if (!button) return;
  const target = normalize(button.dataset.view || button.dataset.view99 || button.dataset.view991);
  if (!routes.has(target)) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  navigate(target);
}, true);
})();
