(() => {
'use strict';
if (window.__ctHotfix8Version) return;
window.__ctHotfix8Version = true;
const VERSION = '0.0.97 HOTFIX 8';
function applyHotfixVersion() {
  window.__ctAndroidBuild = VERSION;
  const host = document.querySelector('.content') || document.querySelector('#app');
  if (!host) return;
  for (const el of host.querySelectorAll('.ct97-version,.ct-version-footer,#ct56-version')) {
    if (el.classList?.contains('ct97-version')) {
      if (el.textContent !== `CineTracker • v${VERSION}`) el.textContent = `CineTracker • v${VERSION}`;
    } else if (/CineTracker|versão|v\d/i.test(el.textContent || '')) {
      const next = `CineTracker • v${VERSION}`;
      if (el.textContent !== next) el.textContent = next;
    }
  }
}
const oldRender = window.render;
if (typeof oldRender === 'function' && !window.__ctHotfix8Render) {
  window.__ctHotfix8Render = oldRender;
  window.render = function(...args) {
    const out = window.__ctHotfix8Render.apply(this, args);
    setTimeout(applyHotfixVersion, 0);
    return out;
  };
}
setTimeout(applyHotfixVersion, 0);
setTimeout(applyHotfixVersion, 250);
})();
