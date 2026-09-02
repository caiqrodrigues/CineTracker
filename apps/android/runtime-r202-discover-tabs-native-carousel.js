/* Android 0.99.7.30 — targeted Discover fix: direct tab taps + native horizontal carousels */
(() => {
'use strict';
if(window.__ctAndroidR202Loaded)return;
window.__ctAndroidR202Loaded=true;
window.__ctAndroidR202='discover-direct-pointerup-native-horizontal-carousels';
window.__ctAndroidDiscoverFilters='foryou-no-type-subfilters';
window.__ctAndroidDiscoverTabs='pointerup-direct-render-no-legacy-click-dependency';
window.__ctAndroidDiscoverCarousels='native-overflow-x-foryou-and-generic-feeds';

/* r198 may skip a legitimate render right after foregrounding. Navigation and Discover
   interactions must never be throttled. */
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

function onDiscover202(){try{return String(route())==='discover'}catch{return String(location.pathname||'')==='/discover'}}
function removeForYouFilters202(){
  if(!onDiscover202())return;
  if(String(discoverState?.tab||'foryou')!=='foryou')return;
  discoverState.type='all';
  const root=document.querySelector('[data-page="discover"]')||document;
  root.querySelectorAll('.ct-r180-type-filters,.filters').forEach(el=>el.remove());
}

/* Apply the Android-only PRA VOCE rule immediately when the shell is mounted and again
   after async data paint. No Web source is modified. */
try{
  const renderDiscoverBase202=renderDiscover;
  renderDiscover=async function(seq){
    if(String(discoverState?.tab||'foryou')==='foryou')discoverState.type='all';
    const p=renderDiscoverBase202.call(this,seq);
    removeForYouFilters202();
    try{const out=await p;removeForYouFilters202();return out}catch(e){removeForYouFilters202();throw e}
  };
}catch{}
try{
  const paintDiscoverBase202=paintDiscover;
  paintDiscover=function(){const out=paintDiscoverBase202.apply(this,arguments);removeForYouFilters202();return out};
}catch{}

/* Direct pointer-up activation. This bypasses the legacy document click chain entirely on
   Android. A tab activates only when the finger did not drag. */
let tap202=null,lastDirect202=0;
window.addEventListener('pointerdown',e=>{
  if(!e.isPrimary)return;
  const btn=e.target.closest?.('[data-discover-tab],[data-discover-type]');
  if(!btn||!onDiscover202())return;
  tap202={id:e.pointerId,btn,x:e.clientX,y:e.clientY};
},true);

function runDiscoverTab202(btn){
  if(!btn||!onDiscover202())return false;
  const tab=btn.closest?.('[data-discover-tab]');
  if(tab){
    const next=String(tab.dataset.discoverTab||'foryou');
    discoverState.tab=next;
    if(next==='foryou')discoverState.type='all';
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

window.addEventListener('pointerup',e=>{
  const t=tap202;tap202=null;
  if(!t||e.pointerId!==t.id||!t.btn?.isConnected)return;
  const dx=Math.abs(e.clientX-t.x),dy=Math.abs(e.clientY-t.y);
  if(dx>12||dy>12)return;
  if(runDiscoverTab202(t.btn)){
    lastDirect202=Date.now();
    if(e.cancelable)e.preventDefault();
    e.stopImmediatePropagation();
  }
},true);

/* Mouse/accessibility fallback and suppression of the synthetic click generated after the
   pointer-up handled above. */
window.addEventListener('click',e=>{
  const btn=e.target.closest?.('[data-discover-tab],[data-discover-type]');
  if(!btn||!onDiscover202())return;
  e.preventDefault();e.stopImmediatePropagation();
  if(Date.now()-lastDirect202<450)return;
  runDiscoverTab202(btn);
},true);

/* The problem shown on-device is content width, not the Web route itself. These are the
   actual containers used by PRA VOCE and the standard Discover feeds. Let Chromium own
   the swipe natively instead of translating touch events in JavaScript. */
const style202=document.createElement('style');style202.id='ct-android-099730-discover-native-carousel';style202.textContent=`
[data-page="discover"] .foryou-grid,
[data-page="discover"] .discover-carousel,
[data-page="discover"] .ct-r180-discover-section .row,
[data-page="discover"] [data-discover-content]>.row,
[data-page="discover"] .ct171-top-row{
  display:flex!important;
  flex-wrap:nowrap!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  overflow-x:auto!important;
  overflow-y:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior-x:contain!important;
  scroll-behavior:auto!important;
  scroll-snap-type:x proximity!important;
  touch-action:auto!important;
  padding-bottom:8px!important;
}
[data-page="discover"] .foryou-grid>*{
  flex:0 0 min(76vw,300px)!important;
  min-width:min(76vw,300px)!important;
  max-width:min(76vw,300px)!important;
  scroll-snap-align:start!important;
}
[data-page="discover"] .discover-carousel>.card,
[data-page="discover"] .ct-r180-discover-section .row>.card,
[data-page="discover"] [data-discover-content]>.row>.card{
  flex:0 0 min(42vw,170px)!important;
  min-width:min(42vw,170px)!important;
  max-width:min(42vw,170px)!important;
  scroll-snap-align:start!important;
}
[data-page="discover"] .discover-section,
[data-page="discover"] [data-discover-content],
[data-page="discover"] .page{
  min-width:0!important;
  max-width:100%!important;
}
[data-page="discover"] [data-ct-r180-tabs]{
  overflow-x:auto!important;
  overflow-y:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  touch-action:auto!important;
  scroll-behavior:auto!important;
  scroll-snap-type:none!important;
}
[data-page="discover"] [data-ct-r180-tabs]>.chip{
  flex:0 0 auto!important;
  pointer-events:auto!important;
  touch-action:manipulation!important;
}
`;
document.getElementById(style202.id)?.remove();document.head.appendChild(style202);

/* If PRA VOCE is rebuilt by another runtime, remove its type filter again. Observe only
   child insertion, not attributes, so there is no mutation loop. */
try{
  const root=document.querySelector('#app')||document.body;
  new MutationObserver(ms=>{
    if(!onDiscover202()||String(discoverState?.tab||'')!=='foryou')return;
    for(const m of ms){if((m.addedNodes||[]).length){queueMicrotask(removeForYouFilters202);break}}
  }).observe(root,{childList:true,subtree:true});
}catch{}
removeForYouFilters202();
})();
