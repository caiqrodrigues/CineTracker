/* Android 0.99.7.58 r230 — restore original Pra voce Trocar + native WebView Top 10 horizontal scroll */
(() => {
'use strict';
if(window.__ctAndroidR230Loaded)return;
window.__ctAndroidR230Loaded=true;
window.__ctAndroidR230='discover-original-trocar-native-top10-scroll';
window.__ctAndroidBundle='android-v0.99.7.58-r230-discover-original-trocar-native-top10';
window.__ctR230Swap='restore-original-r166-click-authority-no-clone';
window.__ctR230Top10='native-webview-overflow-no-js-gesture';
window.__ctR230Scope='android-only-web-r203-untouched';
window.__ctR230Removed='no-r224-r229-swap-hijack-no-r227-r229-top10-gesture';

/* No Trocar listener is added here. prepare-v099758 restores the original r166 delegated click
   and disables every later decorator that renamed/cloned the button. */

const style=document.createElement('style');
style.id='ct-android-099758';
style.textContent=`
.ct171-top-row{
  box-sizing:border-box!important;
  display:flex!important;
  flex-flow:row nowrap!important;
  gap:8px!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  overflow-x:auto!important;
  overflow-y:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior-x:contain!important;
  scroll-behavior:auto!important;
  scroll-snap-type:none!important;
  touch-action:auto!important;
  pointer-events:auto!important;
  padding-bottom:8px!important;
  scrollbar-width:none!important;
}
.ct171-top-row::-webkit-scrollbar{display:none!important}
.ct171-top-row>.ct171-top-card{
  box-sizing:border-box!important;
  flex:0 0 min(42vw,160px)!important;
  width:min(42vw,160px)!important;
  min-width:min(42vw,160px)!important;
  max-width:160px!important;
  touch-action:auto!important;
  pointer-events:auto!important;
}
.ct171-top-row>.ct171-top-card button,
.ct171-top-row>.ct171-top-card [data-media]{
  touch-action:auto!important;
  pointer-events:auto!important;
}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);
})();
