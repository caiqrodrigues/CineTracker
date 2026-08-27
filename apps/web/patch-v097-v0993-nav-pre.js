(() => {
'use strict';
if (window.__ct0993NavPreLoaded) return;
window.__ct0993NavPreLoaded = true;
window.__ct0993NavPre = 'web-0.99.3-navigation-discover-pre';

const routes993 = new Set(['home', 'discover', 'profile', 'settings']);
const stable993 = {
  current: window.ct0992Navigate,
  v991: window.ct991Navigate,
  v98: window.ct98Navigate,
  v92: window.ct92Navigate,
  v91: window.ct91Navigate
};
const diagnostics993 = window.__ct0993Diagnostics = window.__ct0993Diagnostics || { clicks: [], errors: [] };

function log993(kind, target) {
  const entry = { kind, target: String(target || ''), at: new Date().toISOString() };
  diagnostics993.clicks.push(entry);
  if (diagnostics993.clicks.length > 80) diagnostics993.clicks.shift();
  console.log(`[CineTracker 0.99.3] ${kind}:`, entry.target);
}
function error993(kind, error) {
  const message = String(error?.message || error?.reason?.message || error?.reason || error || 'erro desconhecido');
  diagnostics993.errors.push({ kind, message, at: new Date().toISOString() });
  if (diagnostics993.errors.length > 40) diagnostics993.errors.shift();
  console.error(`[CineTracker 0.99.3] ${kind}:`, error);
}
window.addEventListener('error', event => error993('window.error', event.error || event.message));
window.addEventListener('unhandledrejection', event => error993('unhandledrejection', event.reason));

function normalize993(target) {
  const value = String(target || '');
  return value === 'history' ? 'profile' : value;
}
function setCurrent993(target) {
  try { view = target; } catch {}
  try { window.view = target; } catch {}
}
function ready993(target) {
  if (target === 'home') return !!document.querySelector('.ct992-shell,.ct991-home,[data-view-screen="home"]');
  if (target === 'discover') return !!document.querySelector('#ct991-discover-results,.ct98-discover,[data-view-screen="discover"]');
  if (target === 'profile') return !!document.querySelector('#ct991-profile,.ct99-profile,.ct98-profile,[data-view-screen="profile"]');
  if (target === 'settings') return !!document.querySelector('.ct91-settings,#ct-v025-save,#ct10-import-panel,[data-view-screen="settings"]');
  return false;
}
function invoke993(router, target) {
  if (typeof router !== 'function') return false;
  try {
    const result = router(target);
    return result === false ? false : (result ?? true);
  } catch (error) {
    error993(`route.${target}`, error);
    return false;
  }
}
function syncActive993(target) {
  document.querySelectorAll('.sidebar .nav button,.mobile-nav button').forEach(button => {
    const buttonTarget = normalize993(button.dataset.view || button.dataset.view99 || button.dataset.view991);
    const active = buttonTarget === target;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}
function fallback993(target, firstRouter) {
  if (ready993(target)) return true;
  const candidates = target === 'settings'
    ? [stable993.v991, stable993.v92, stable993.v91, stable993.v98]
    : [stable993.v991, stable993.v98, stable993.v92, stable993.v91];
  for (const candidate of candidates) {
    if (candidate === firstRouter) continue;
    invoke993(candidate, target);
    if (ready993(target)) return true;
  }
  try {
    if (typeof render === 'function') {
      setCurrent993(target);
      render();
    }
  } catch (error) {
    error993(`route-fallback.${target}`, error);
  }
  return ready993(target);
}
function navigate993(requested) {
  const target = normalize993(requested);
  if (!routes993.has(target)) return false;
  log993('navigation', target);
  setCurrent993(target);
  const firstRouter = target === 'home' ? stable993.current : (stable993.v991 || stable993.current);
  const result = invoke993(firstRouter, target);
  syncActive993(target);
  window.setTimeout(() => { fallback993(target, firstRouter); syncActive993(target); }, 80);
  window.setTimeout(() => { fallback993(target, firstRouter); syncActive993(target); }, 260);
  try { window.scrollTo?.(0, 0); } catch {}
  return result !== false;
}
function stop993(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
}
function invokeBound993(button, kind, value, event) {
  if (!button) return false;
  log993(kind, value);
  const handler = button.onclick;
  if (typeof handler !== 'function') return false;
  try {
    const result = handler.call(button, event);
    if (result && typeof result.catch === 'function') result.catch(error => error993(`${kind}.${value}`, error));
    return true;
  } catch (error) {
    error993(`${kind}.${value}`, error);
    return false;
  }
}
function retryBound993(selector, kind, value) {
  let completed = false;
  for (const delay of [0, 60, 180]) {
    window.setTimeout(() => {
      if (completed) return;
      completed = invokeBound993(document.querySelector(selector), `${kind}.retry`, value, null);
    }, delay);
  }
}
function tab993(button, event) {
  const tab = String(button?.dataset?.dtab991 || '');
  if (!tab) return false;
  stop993(event);
  if (!invokeBound993(button, 'discover-tab', tab, event)) {
    navigate993('discover');
    retryBound993(`[data-dtab991="${tab.replace(/"/g, '')}"]`, 'discover-tab', tab);
  }
  return true;
}
function filter993(button, event) {
  const filter = String(button?.dataset?.dfilter991 || '');
  if (!filter) return false;
  stop993(event);
  if (!invokeBound993(button, 'discover-filter', filter, event)) {
    retryBound993(`[data-dfilter991="${filter.replace(/"/g, '')}"]`, 'discover-filter', filter);
  }
  return true;
}

window.__ct0993Navigate = navigate993;
window.addEventListener('click', event => {
  const refresh = event.target?.closest?.('[data-ct0993-refresh-for-you]');
  if (refresh) {
    stop993(event);
    log993('discover-fallback', 'refresh');
    navigate993('discover');
    retryBound993('[data-dtab991="foryou"]', 'discover-tab', 'foryou');
    return;
  }
  const sync = event.target?.closest?.('[data-ct0993-go-settings]');
  if (sync) {
    stop993(event);
    log993('discover-fallback', 'settings');
    navigate993('settings');
    return;
  }
  const tab = event.target?.closest?.('[data-dtab991]');
  if (tab && tab993(tab, event)) return;
  const filter = event.target?.closest?.('[data-dfilter991]');
  if (filter && filter993(filter, event)) return;
  const button = event.target?.closest?.('.sidebar .nav button,.mobile-nav button');
  if (!button) return;
  const target = normalize993(button.dataset.view || button.dataset.view99 || button.dataset.view991);
  if (!routes993.has(target)) return;
  stop993(event);
  navigate993(target);
}, true);
})();
