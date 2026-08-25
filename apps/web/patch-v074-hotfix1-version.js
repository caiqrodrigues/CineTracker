(() => {
'use strict';
if (window.__ctHotfix7Version) return;
window.__ctHotfix7Version = true;
const VERSION = '0.0.97 HOTFIX 7';
function applyHotfixVersion() {
  window.__ctAndroidBuild = VERSION;
  const host = document.querySelector('.content') || document.querySelector('#app');
  if (!host) return;
  for (const el of host.querySelectorAll('.ct97-version,.ct-version-footer,#ct56-version')) {
    if (el.classList?.contains('ct97-version')) {
      el.textContent = `CineTracker • v${VERSION}`;
    } else if (/CineTracker|versão|v\d/i.test(el.textContent || '')) {
      el.textContent = `CineTracker • v${VERSION}`;
    }
  }
}
const oldRender = window.render;
if (typeof oldRender === 'function' && !window.__ctHotfix7Render) {
  window.__ctHotfix7Render = oldRender;
  window.render = function(...args) {
    const out = window.__ctHotfix7Render.apply(this, args);
    setTimeout(applyHotfixVersion, 0);
    return out;
  };
}
setTimeout(applyHotfixVersion, 0);
setTimeout(applyHotfixVersion, 250);
})();
