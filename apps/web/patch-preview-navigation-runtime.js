(() => {
'use strict';
if (window.__ctPreviewNavigationRuntime) return;
window.__ctPreviewNavigationRuntime = 'web-0.99.2-fix2-routes-discover-v3';

const routes = new Set(['home', 'discover', 'profile', 'settings']);
const stable = {
  current: window.ct0992Navigate,
  v991: window.ct991Navigate,
  v98: window.ct98Navigate,
  v92: window.ct92Navigate,
  v91: window.ct91Navigate
};
const diagnostics = window.__ctPreviewDiagnostics = window.__ctPreviewDiagnostics || {
  clicks: [],
  errors: []
};

function logClick(kind, target) {
  const entry = { kind, target: String(target || ''), at: new Date().toISOString() };
  diagnostics.clicks.push(entry);
  if (diagnostics.clicks.length > 80) diagnostics.clicks.shift();
  console.log(`[CineTracker preview] ${kind}:`, entry.target);
}

function recordError(kind, error) {
  const message = String(error?.message || error?.reason?.message || error?.reason || error || 'erro desconhecido');
  diagnostics.errors.push({ kind, message, at: new Date().toISOString() });
  if (diagnostics.errors.length > 40) diagnostics.errors.shift();
  console.error(`[CineTracker preview] ${kind}:`, error);
}

window.addEventListener('error', event => recordError('window.error', event.error || event.message));
window.addEventListener('unhandledrejection', event => recordError('unhandledrejection', event.reason));

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
    recordError(`route.${target}`, error);
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
    recordError(`route-fallback.${target}`, error);
  }
  return isReady(target);
}

function navigate(requested) {
  const target = normalize(requested);
  if (!routes.has(target)) return false;
  logClick('navigation', target);
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

function stopEvent(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
}

function invokeBoundControl(button, kind, value, event) {
  if (!button) return false;
  logClick(kind, value);
  const handler = button.onclick;
  if (typeof handler !== 'function') return false;
  try {
    const result = handler.call(button, event);
    if (result && typeof result.catch === 'function') {
      result.catch(error => recordError(`${kind}.${value}`, error));
    }
    return true;
  } catch (error) {
    recordError(`${kind}.${value}`, error);
    return false;
  }
}

function retryBoundControl(selector, kind, value) {
  let completed = false;
  for (const delay of [0, 60, 180]) {
    window.setTimeout(() => {
      if (completed) return;
      const live = document.querySelector(selector);
      completed = invokeBoundControl(live, `${kind}.retry`, value, null);
    }, delay);
  }
}

function activateDiscoverTab(button, event) {
  const tab = String(button?.dataset?.dtab991 || '');
  if (!tab) return false;
  stopEvent(event);
  if (!invokeBoundControl(button, 'discover-tab', tab, event)) {
    navigate('discover');
    retryBoundControl(`[data-dtab991="${tab.replace(/"/g, '')}"]`, 'discover-tab', tab);
  }
  return true;
}

function activateDiscoverFilter(button, event) {
  const filter = String(button?.dataset?.dfilter991 || '');
  if (!filter) return false;
  stopEvent(event);
  if (!invokeBoundControl(button, 'discover-filter', filter, event)) {
    retryBoundControl(`[data-dfilter991="${filter.replace(/"/g, '')}"]`, 'discover-filter', filter);
  }
  return true;
}

window.__ctPreviewNavigate = navigate;

window.addEventListener('click', event => {
  const refresh = event.target?.closest?.('[data-preview-refresh-for-you]');
  if (refresh) {
    stopEvent(event);
    logClick('discover-fallback', 'refresh');
    navigate('discover');
    retryBoundControl('[data-dtab991="foryou"]', 'discover-tab', 'foryou');
    return;
  }

  const sync = event.target?.closest?.('[data-preview-go-settings]');
  if (sync) {
    stopEvent(event);
    logClick('discover-fallback', 'settings');
    navigate('settings');
    return;
  }

  const tab = event.target?.closest?.('[data-dtab991]');
  if (tab && activateDiscoverTab(tab, event)) return;

  const filter = event.target?.closest?.('[data-dfilter991]');
  if (filter && activateDiscoverFilter(filter, event)) return;

  const button = event.target?.closest?.('.sidebar .nav button,.mobile-nav button');
  if (!button) return;
  const target = normalize(button.dataset.view || button.dataset.view99 || button.dataset.view991);
  if (!routes.has(target)) return;
  stopEvent(event);
  navigate(target);
}, true);
})();
