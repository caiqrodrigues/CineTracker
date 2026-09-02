/* Android 0.99.7.34 — Discover uses the app's original delegated click handling again. */
(() => {
'use strict';
if(window.__ctAndroidR206Loaded)return;
window.__ctAndroidR206Loaded=true;
window.__ctAndroidR206='discover-core-events-three-cards';
window.__ctAndroidDiscoverFilters='foryou-no-type-subfilters';
window.__ctAndroidDiscoverTabs='core-document-click-no-android-capture';
window.__ctAndroidDiscoverCarousels='native-horizontal-three-cards-per-viewport';
window.__ctAndroidScope='discover-only-no-global-render-no-sports-profile-nav-overrides';

function onDiscover206(){
  try{return String(route())==='discover'}catch{return String(location.pathname||'')==='/discover'}
}
function syncForYou206(){
  if(!onDiscover206()||String(discoverState?.tab||'foryou')!=='foryou')return;
  discoverState.type='all';
  const root=document.querySelector('[data-page="discover"]')||document;
  root.querySelectorAll('.ct-r180-type-filters,.filters').forEach(el=>el.remove());
}

/* Keep only the already-approved PRA VOCE filter behavior. No Android touch/pointer/click
   listener is installed here: data-discover-tab/data-discover-type are handled by the
   original application document click listener. */
try{
  const base=renderDiscover;
  renderDiscover=async function(seq){
    if(String(discoverState?.tab||'foryou')==='foryou')discoverState.type='all';
    const p=base.call(this,seq);syncForYou206();
    try{const out=await p;syncForYou206();return out}catch(e){syncForYou206();throw e}
  };
}catch{}
try{
  const base=paintDiscover;
  paintDiscover=function(){const out=base.apply(this,arguments);syncForYou206();return out};
}catch{}

const style=document.createElement('style');
style.id='ct-android-099734-discover';
style.textContent=`
/* Preserve the 0.99.7.32 tab rail appearance. Existing r180 arrows expose off-screen tabs. */
[data-page="discover"] [data-ct-r180-tabs],
[data-page="discover"]>.page>.tabs{
  overflow-x:hidden!important;
  overflow-y:hidden!important;
  scroll-behavior:auto!important;
  scroll-snap-type:none!important;
  touch-action:pan-y!important;
  -webkit-overflow-scrolling:auto!important;
}
[data-page="discover"] [data-ct-r180-tabs]>.chip,
[data-page="discover"]>.page>.tabs>.chip,
[data-page="discover"] .ct-r180-tab-arrow{
  flex:0 0 auto!important;
  pointer-events:auto!important;
  touch-action:manipulation!important;
}
[data-page="discover"] .ct-r180-tab-arrow{z-index:6!important}

/* Preserve the approved 0.99.7.32 content layout: three cards, then native horizontal swipe. */
[data-page="discover"] .foryou-grid,
[data-page="discover"] .discover-carousel,
[data-page="discover"] .ct-r180-discover-section .row,
[data-page="discover"] [data-discover-content]>.row,
[data-page="discover"] .ct171-top-row{
  display:flex!important;
  flex-wrap:nowrap!important;
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
  padding:1px 1px 8px!important;
}
[data-page="discover"] .foryou-grid>.ct166-slot,
[data-page="discover"] .foryou-grid>*,
[data-page="discover"] .discover-carousel>.card,
[data-page="discover"] .ct-r180-discover-section .row>.card,
[data-page="discover"] [data-discover-content]>.row>.card{
  box-sizing:border-box!important;
  flex:0 0 calc((100% - 16px)/3)!important;
  width:calc((100% - 16px)/3)!important;
  min-width:calc((100% - 16px)/3)!important;
  max-width:calc((100% - 16px)/3)!important;
}
[data-page="discover"] .foryou-grid .card,
[data-page="discover"] .foryou-grid .ct166-slot .card{width:100%!important;min-width:0!important;max-width:100%!important}
[data-page="discover"] .foryou-grid .poster,
[data-page="discover"] .discover-carousel .poster,
[data-page="discover"] [data-discover-content]>.row .poster{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}
[data-page="discover"] .foryou-grid .card-title,
[data-page="discover"] .discover-carousel .card-title,
[data-page="discover"] [data-discover-content]>.row .card-title{font-size:11px!important;line-height:1.18!important}
[data-page="discover"] .discover-section,
[data-page="discover"] [data-discover-content],
[data-page="discover"] .page{min-width:0!important;max-width:100%!important}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);
syncForYou206();
})();
