/* Android 0.99.7.31 — targeted Discover: compact PRA VOCE + reliable touch tabs */
(() => {
'use strict';
if(window.__ctAndroidR203Loaded)return;
window.__ctAndroidR203Loaded=true;
window.__ctAndroidR203='discover-compact-foryou-reliable-touch-tabs';
window.__ctAndroidDiscoverFilters='foryou-no-type-subfilters';
window.__ctAndroidDiscoverTabs='touchend-direct-render-tabrail-no-horizontal-gesture';
window.__ctAndroidDiscoverCarousels='native-horizontal-content-compact-cards';

/* r198 may skip a legitimate render immediately after foregrounding. */
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
window.__ctAndroidRenderPolicy='discover-tabs-never-throttled';

function onDiscover203(){try{return String(route())==='discover'}catch{return String(location.pathname||'')==='/discover'}}
function removeForYouFilters203(){
  if(!onDiscover203()||String(discoverState?.tab||'foryou')!=='foryou')return;
  discoverState.type='all';
  const root=document.querySelector('[data-page="discover"]')||document;
  root.querySelectorAll('.ct-r180-type-filters,.filters').forEach(el=>el.remove());
}
try{
  const base=renderDiscover;
  renderDiscover=async function(seq){
    if(String(discoverState?.tab||'foryou')==='foryou')discoverState.type='all';
    const p=base.call(this,seq);removeForYouFilters203();
    try{const out=await p;removeForYouFilters203();return out}catch(e){removeForYouFilters203();throw e}
  };
}catch{}
try{
  const base=paintDiscover;
  paintDiscover=function(){const out=base.apply(this,arguments);removeForYouFilters203();return out};
}catch{}

function activateDiscover203(btn){
  if(!btn||!onDiscover203())return false;
  const tab=btn.closest?.('[data-discover-tab]');
  if(tab){
    const next=String(tab.dataset.discoverTab||'foryou');
    discoverState.tab=next;if(next==='foryou')discoverState.type='all';
    const seq=++navSeq;
    void Promise.resolve(renderDiscover(seq)).catch(err=>{try{toast(err?.message||String(err))}catch{}});
    return true;
  }
  const type=btn.closest?.('[data-discover-type]');
  if(type){
    if(String(discoverState?.tab||'')==='foryou')return true;
    discoverState.type=String(type.dataset.discoverType||'all');
    const seq=++navSeq;
    void Promise.resolve(renderDiscover(seq)).catch(err=>{try{toast(err?.message||String(err))}catch{}});
    return true;
  }
  return false;
}

/* Android-specific tab input. The tab rail itself no longer pans horizontally with a finger,
   eliminating the swipe-vs-tap ambiguity. Its existing arrow buttons remain responsible for
   exposing off-screen tabs. Content carousels below keep native horizontal swipe. */
let touch203=null,lastHandled203=0;
window.addEventListener('touchstart',e=>{
  if(e.touches?.length!==1||!onDiscover203())return;
  const btn=e.target.closest?.('[data-discover-tab],[data-discover-type]');if(!btn)return;
  const t=e.touches[0];touch203={btn,x:t.clientX,y:t.clientY,at:Date.now()};
},{capture:true,passive:true});
window.addEventListener('touchend',e=>{
  const s=touch203;touch203=null;if(!s||!s.btn?.isConnected||!onDiscover203())return;
  const t=e.changedTouches?.[0];if(!t)return;
  const dx=Math.abs(t.clientX-s.x),dy=Math.abs(t.clientY-s.y),elapsed=Date.now()-s.at;
  if(dx>28||dy>28||elapsed>1100)return;
  if(activateDiscover203(s.btn)){
    lastHandled203=Date.now();
    if(e.cancelable)e.preventDefault();
    e.stopImmediatePropagation();
  }
},{capture:true,passive:false});
window.addEventListener('touchcancel',()=>{touch203=null},{capture:true,passive:true});

/* Mouse/accessibility fallback and synthetic-click suppression after touchend. */
window.addEventListener('click',e=>{
  const btn=e.target.closest?.('[data-discover-tab],[data-discover-type]');
  if(!btn||!onDiscover203())return;
  e.preventDefault();e.stopImmediatePropagation();
  if(Date.now()-lastHandled203<650)return;
  activateDiscover203(btn);
},true);

const style=document.createElement('style');style.id='ct-android-099731-discover';style.textContent=`
/* TAB RAIL: no finger pan. This gives every chip a deterministic tap target.
   Existing ‹ › controls still scroll the rail programmatically. */
[data-page="discover"] [data-ct-r180-tabs],
[data-page="discover"]>.page>.tabs{
  overflow-x:auto!important;
  overflow-y:hidden!important;
  scroll-behavior:auto!important;
  scroll-snap-type:none!important;
  touch-action:pan-y!important;
  -webkit-overflow-scrolling:auto!important;
}
[data-page="discover"] [data-ct-r180-tabs]>.chip,
[data-page="discover"]>.page>.tabs>.chip{
  flex:0 0 auto!important;
  pointer-events:auto!important;
  touch-action:manipulation!important;
}
[data-page="discover"] .ct-r180-tab-arrow{
  pointer-events:auto!important;
  touch-action:manipulation!important;
  z-index:5!important;
}

/* CONTENT: native horizontal swipe stays enabled. */
[data-page="discover"] .foryou-grid,
[data-page="discover"] .discover-carousel,
[data-page="discover"] .ct-r180-discover-section .row,
[data-page="discover"] [data-discover-content]>.row,
[data-page="discover"] .ct171-top-row{
  display:flex!important;
  flex-wrap:nowrap!important;
  gap:10px!important;
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

/* PRA VOCE: compact mobile cards — roughly two visible at once instead of one giant card. */
[data-page="discover"] .foryou-grid>.ct166-slot,
[data-page="discover"] .foryou-grid>*{
  flex:0 0 min(44vw,168px)!important;
  width:min(44vw,168px)!important;
  min-width:min(44vw,168px)!important;
  max-width:min(44vw,168px)!important;
}
[data-page="discover"] .foryou-grid .card,
[data-page="discover"] .foryou-grid .ct166-slot .card{
  width:100%!important;
  min-width:0!important;
  max-width:100%!important;
}
[data-page="discover"] .foryou-grid .poster{width:100%!important;aspect-ratio:2/3!important}

/* Standard Discover feeds remain compact and horizontally swipeable. */
[data-page="discover"] .discover-carousel>.card,
[data-page="discover"] .ct-r180-discover-section .row>.card,
[data-page="discover"] [data-discover-content]>.row>.card{
  flex:0 0 min(43vw,168px)!important;
  width:min(43vw,168px)!important;
  min-width:min(43vw,168px)!important;
  max-width:min(43vw,168px)!important;
}
[data-page="discover"] .discover-section,
[data-page="discover"] [data-discover-content],
[data-page="discover"] .page{min-width:0!important;max-width:100%!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

try{
  const root=document.querySelector('#app')||document.body;
  new MutationObserver(ms=>{
    if(!onDiscover203()||String(discoverState?.tab||'')!=='foryou')return;
    for(const m of ms){if((m.addedNodes||[]).length){queueMicrotask(removeForYouFilters203);break}}
  }).observe(root,{childList:true,subtree:true});
}catch{}
removeForYouFilters203();
})();
