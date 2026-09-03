/* Android 0.99.7.50 r222 — compact Discover horizontal pills, preserving r220/r221 behavior */
(() => {
'use strict';
if(window.__ctAndroidR222Loaded)return;
window.__ctAndroidR222Loaded=true;
window.__ctAndroidR222='discover-horizontal-compact-pills';
window.__ctAndroidBundle='android-v0.99.7.50-r222-discover-compact-horizontal';
window.__ctR222Discover='single-row-compact-auto-width-28px-pills';

const style=document.createElement('style');
style.id='ct-android-099750-discover-compact';
style.textContent=`
[data-page="discover"] .ct-r180-tab-shell{
  display:flex!important;
  flex-direction:row!important;
  flex-wrap:nowrap!important;
  align-items:center!important;
  gap:4px!important;
  width:100%!important;
  min-width:0!important;
  min-height:28px!important;
  padding:0!important;
  margin:0 0 8px!important;
}
[data-page="discover"] .ct-r180-tab-rail,
[data-page="discover"] [data-ct-r180-tabs]{
  display:flex!important;
  flex:1 1 auto!important;
  flex-direction:row!important;
  flex-wrap:nowrap!important;
  align-items:center!important;
  gap:5px!important;
  width:auto!important;
  min-width:0!important;
  max-width:100%!important;
  min-height:28px!important;
  padding:0 1px!important;
  margin:0!important;
  overflow-x:auto!important;
  overflow-y:hidden!important;
  white-space:nowrap!important;
  -webkit-overflow-scrolling:touch!important;
  scrollbar-width:none!important;
  touch-action:pan-x!important;
}
[data-page="discover"] .ct-r180-tab-rail::-webkit-scrollbar,
[data-page="discover"] [data-ct-r180-tabs]::-webkit-scrollbar{display:none!important}

[data-page="discover"] .ct-r180-tab-btn,
[data-page="discover"] [data-discover-tab],
[data-page="discover"] [data-ct-r180-tabs]>.chip{
  box-sizing:border-box!important;
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  flex:0 0 auto!important;
  flex-grow:0!important;
  flex-shrink:0!important;
  flex-basis:auto!important;
  width:auto!important;
  min-width:0!important;
  max-width:none!important;
  height:28px!important;
  min-height:28px!important;
  max-height:28px!important;
  padding:0 9px!important;
  margin:0!important;
  border-radius:999px!important;
  font-size:10px!important;
  font-weight:600!important;
  line-height:1!important;
  letter-spacing:0!important;
  white-space:nowrap!important;
  text-align:center!important;
  touch-action:manipulation!important;
}
[data-page="discover"] .ct-r180-tab-arrow{
  box-sizing:border-box!important;
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  flex:0 0 28px!important;
  width:28px!important;
  min-width:28px!important;
  max-width:28px!important;
  height:28px!important;
  min-height:28px!important;
  max-height:28px!important;
  padding:0!important;
  margin:0!important;
  border-radius:9px!important;
  font-size:14px!important;
  line-height:1!important;
}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);
})();
