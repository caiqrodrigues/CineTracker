(() => {
'use strict';
if (window.__ct98NavPre) return;
window.__ct98NavPre = true;
const targets = new Set(['home','discover','history','profile','settings']);
window.addEventListener('click', event => {
  const button = event.target?.closest?.('.nav button[data-view],.mobile-nav button[data-view],[data-view]');
  if (!button) return;
  const target = String(button.dataset.view || '');
  if (!targets.has(target) || typeof window.ct98Navigate !== 'function') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  window.ct98Navigate(target === 'history' ? 'profile' : target);
}, true);
})();
