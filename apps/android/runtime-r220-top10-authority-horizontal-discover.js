/* Android 0.99.7.48 — Top 10 through the authoritative selector + Discover single horizontal rail */
(() => {
'use strict';
if(window.__ctAndroidR220Loaded)return;
window.__ctAndroidR220Loaded=true;
window.__ctAndroidR220='top10-r214-ticket-r217-render-horizontal-rail';
window.__ctAndroidBundle='android-v0.99.7.48-r220-top10-authority-horizontal-discover';
window.__ctAndroidDiscover='single-r218-click-authority-r214-selector-all-nine-tabs';
window.__ctAndroidManualMedia='r217-library-behavior-no-r219-synthetic-fallback';

/*
  r214 owns Discover state/ticket cancellation. r217 owns the corrected Top 10 renderer.
  .47 bypassed r214 and therefore left previous async Discover work alive. Instead, keep
  every tab — including Top 10 — on r214 and only replace the stale r180 Top 10 hook.
*/
function installTop10Authority220(){
  const render=window.ctR217RenderTop10;
  if(typeof render!=='function')return false;
  window.ctR180RenderTop10=function(...args){return render.apply(this,args)};
  window.__ctAndroidTop10='r214-selector-ticket-r217-authoritative-render';
  return true;
}
if(!installTop10Authority220())queueMicrotask(installTop10Authority220);
window.ctR220InstallTop10Authority=installTop10Authority220;

/* Restore the original one-row Discover navigation. No 3x3 grid and no forced stacking. */
const style220=document.createElement('style');
style220.id='ct-android-099748';
style220.textContent=`
[data-page="discover"] .ct-r180-tab-shell{display:flex!important;flex-wrap:nowrap!important;align-items:center!important;min-width:0!important;width:100%!important}
[data-page="discover"] .ct-r180-tab-rail{display:flex!important;flex:1 1 auto!important;flex-wrap:nowrap!important;min-width:0!important;width:auto!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;touch-action:pan-x!important;overscroll-behavior-x:contain!important}
[data-page="discover"] .ct-r180-tab-rail::-webkit-scrollbar{display:none!important}
[data-page="discover"] .ct-r180-tab-btn,[data-page="discover"] [data-discover-tab]{flex:0 0 auto!important;width:auto!important;min-width:max-content!important;white-space:nowrap!important}
`;
document.getElementById(style220.id)?.remove();
document.head.appendChild(style220);
})();
