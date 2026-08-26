(() => {
'use strict';
if (window.__ctHotfix12Version) return;
window.__ctHotfix12Version = true;
const VERSION = '0.0.97 HOTFIX 12';
function applyHotfixVersion() {
  window.__ctAndroidBuild = VERSION;
  const host = document.querySelector('.content') || document.querySelector('#app');
  if (!host) return;
  for (const el of host.querySelectorAll('.ct95-version,.ct94-version,.ct-version-footer,#ct56-version')) {
    if (/CineTracker|versão|v\d/i.test(el.textContent || '') || el.classList?.contains('ct95-version')) {
      const next = `CineTracker • v${VERSION}`;
      if (el.textContent !== next) el.textContent = next;
    }
  }
}
const oldRender = window.render;
if (typeof oldRender === 'function' && !window.__ctHotfix12Render) {
  window.__ctHotfix12Render = oldRender;
  window.render = function(...args) {
    const out = window.__ctHotfix12Render.apply(this, args);
    setTimeout(applyHotfixVersion, 0);
    return out;
  };
}
setTimeout(applyHotfixVersion, 0);
setTimeout(applyHotfixVersion, 250);
})();