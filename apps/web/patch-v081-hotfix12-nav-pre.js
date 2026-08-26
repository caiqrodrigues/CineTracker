(() => {
'use strict';
if (window.__ctHotfix12NavPre) return;
window.__ctHotfix12NavPre = true;

const allowed12 = new Set(['home','discover','history','profile','settings']);
const stable95 = window.ct95Navigate;
const stable94 = window.ct94Navigate;
const stable92 = window.ct92Navigate;
const stable91 = window.ct91Navigate;

const css = document.createElement('style');
css.id = 'ct12-nav-style';
css.textContent = `
.nav,.mobile-nav{z-index:10000!important;pointer-events:auto!important;isolation:isolate}
.nav button[data-view],.mobile-nav button[data-view]{pointer-events:auto!important;position:relative;z-index:1}
`;
document.head.appendChild(css);

function setView12(target) {
  try { view = target; } catch {}
  try { window.view = target; } catch {}
}

function fallback12(target) {
  const fn = stable95 || stable94 || stable92 || stable91;
  if (typeof fn !== 'function') return false;
  setView12(target);
  const out = fn(target);
  return out !== false;
}

function scheduleSettings12() {
  for (const delay of [90,180,340,620]) {
    setTimeout(() => {
      try { window.ct11UpgradeImporter?.(); } catch {}
      try { window.ct12BindImporter?.(); } catch {}
    }, delay);
  }
}

function navigate12(target) {
  target = String(target || '');
  if (!allowed12.has(target)) return false;
  let ok = false;
  try {
    const selective = window.ct10Navigate;
    if (typeof selective === 'function' && selective !== navigate12) {
      ok = selective(target) !== false;
    } else {
      ok = fallback12(target);
    }
  } catch (error) {
    console.error('CineTracker HOTFIX12 navigation primary path:', error);
    try { ok = fallback12(target); } catch (fallbackError) { console.error('CineTracker HOTFIX12 navigation fallback:', fallbackError); }
  }
  if (target === 'settings') scheduleSettings12();
  if (target === 'discover') {
    setTimeout(() => {
      const fy = document.querySelector('[data-ct95-tab="for-you"]');
      if (fy && !fy.classList.contains('active')) fy.click();
    }, 120);
  }
  window.scrollTo?.(0, 0);
  return ok;
}
window.ct12Navigate = navigate12;

// Must be registered before HOTFIX10's window-capture listener.
window.addEventListener('click', event => {
  const button = event.target?.closest?.('.nav button[data-view],.mobile-nav button[data-view]');
  if (!button) return;
  const target = String(button.dataset.view || '');
  if (!allowed12.has(target)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  navigate12(target);
}, true);
})();