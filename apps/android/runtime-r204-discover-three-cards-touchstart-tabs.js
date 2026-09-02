/* Android 0.99.7.32 — targeted Discover: three cards per viewport + deterministic touchstart tabs */
(() => {
'use strict';
if(window.__ctAndroidR204Loaded)return;
window.__ctAndroidR204Loaded=true;
window.__ctAndroidR204='discover-three-cards-touchstart-tabs';
window.__ctAndroidDiscoverFilters='foryou-no-type-subfilters';
window.__ctAndroidDiscoverTabs='touchstart-capture-immediate-no-synthetic-click';
window.__ctAndroidDiscoverCarousels='native-horizontal-three-cards-per-viewport';

/* Navigation/filter work must never be suppressed by the mobile performance layer. */
render=async function(){
  const seq=++navSeq,r=route();
  if(r==='auth'){await renderAuth();return}
  if(!session){history.replaceState({},'','/');await renderAuth();return}
  if(r==='home')return renderHome(seq);
  if(r==='discover')return renderDiscover(seq);
  if(r==='sports')return renderSports(seq);
  if(r==='profile')return renderProfile(seq);
  if(r==='configs')return renderConfigs(seq);
  const id=Number(location.pathname.match(/\d+/)?.[0]||0);
  if(r==='movie'||r==='series')return renderDetail(r,id,seq);
  if(r==='person')return renderPerson(id,seq);
  go('/home',true);
};
window.__ctAndroidRenderPolicy='discover-tabs-touchstart-never-throttled';

function onDiscover204(){try{return String(route())==='discover'}catch{return String(location.pathname||'')==='/discover'}}
function removeForYouFilters204(){
  if(!onDiscover204()||String(discoverState?.tab||'foryou')!=='foryou')return;
  discoverState.type='all';
  const root=document.querySelector('[data-page="discover"]')||document;
  root.querySelectorAll('.ct-r180-type-filters,.filters').forEach(el=>el.remove());
}
try{
  const base=renderDiscover;
  renderDiscover=async function(seq){
    if(String(discoverState?.tab||'foryou')==='foryou')discoverState.type='all';
    const p=base.call(this,seq);removeForYouFilters204();
    try{const out=await p;removeForYouFilters204();return out}catch(e){removeForYouFilters204();throw e}
  };
}catch{}
try{
  const base=paintDiscover;
  paintDiscover=function(){const out=base.apply(this,arguments);removeForYouFilters204();return out};
}catch{}

function control204(e){
  try{
    for(const n of e.composedPath?.()||[])if(n?.matches?.('[data-discover-tab],[data-discover-type],[data-ct-r180-tab-scroll]'))return n;
  }catch{}
  return e.target?.closest?.('[data-discover-tab],[data-discover-type],[data-ct-r180-tab-scroll]')||null;
}
function activateDiscover204(btn){
  if(!btn||!onDiscover204())return false;
  if(btn.matches?.('[data-ct-r180-tab-scroll]')){
    const rail=document.querySelector('[data-ct-r180-tabs]');
    if(rail){const dir=Number(btn.dataset.ctR180TabScroll||1)||1;rail.scrollLeft+=dir*Math.max(150,rail.clientWidth*.72)}
    return true;
  }
  const tab=btn.matches?.('[data-discover-tab]')?btn:btn.closest?.('[data-discover-tab]');
  if(tab){
    const next=String(tab.dataset.discoverTab||'foryou');
    discoverState.tab=next;if(next==='foryou')discoverState.type='all';
    const seq=++navSeq;
    void Promise.resolve(renderDiscover(seq)).catch(err=>{try{toast(err?.message||String(err))}catch{}});
    return true;
  }
  const type=btn.matches?.('[data-discover-type]')?btn:btn.closest?.('[data-discover-type]');
  if(type){
    if(String(discoverState?.tab||'')==='foryou')return true;
    discoverState.type=String(type.dataset.discoverType||'all');
    const seq=++navSeq;
    void Promise.resolve(renderDiscover(seq)).catch(err=>{try{toast(err?.message||String(err))}catch{}});
    return true;
  }
  return false;
}

/* Strong Android path: switch the Discover tab on TOUCHSTART at window capture level.
   The tab rail itself does not accept finger panning, so there is no swipe-vs-tap ambiguity.
   preventDefault also prevents the broken synthetic click chain from firing afterwards. */
let handled204=0;
window.addEventListener('touchstart',e=>{
  if(e.touches?.length!==1||!onDiscover204())return;
  const btn=control204(e);if(!btn)return;
  if(activateDiscover204(btn)){
    handled204=Date.now();
    if(e.cancelable)e.preventDefault();
    e.stopImmediatePropagation();
  }
},{capture:true,passive:false});

/* Pointer/mouse/accessibility fallback. Touch-generated clicks are swallowed because the
   action has already happened on touchstart. */
window.addEventListener('click',e=>{
  if(!onDiscover204())return;
  const btn=control204(e);if(!btn)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(Date.now()-handled204<900)return;
  activateDiscover204(btn);
},true);

const style=document.createElement('style');style.id='ct-android-099732-discover';style.textContent=`
/* TOP TAB RAIL: deterministic buttons; use the existing arrows to expose off-screen tabs. */
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

/* CONTENT CAROUSELS: native Android horizontal swipe. */
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

/* Exactly three cards in the useful carousel width before horizontal swipe. */
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
document.getElementById(style.id)?.remove();document.head.appendChild(style);

try{
  const root=document.querySelector('#app')||document.body;
  new MutationObserver(ms=>{
    if(!onDiscover204()||String(discoverState?.tab||'')!=='foryou')return;
    for(const m of ms){if((m.addedNodes||[]).length){queueMicrotask(removeForYouFilters204);break}}
  }).observe(root,{childList:true,subtree:true});
}catch{}
removeForYouFilters204();
})();
