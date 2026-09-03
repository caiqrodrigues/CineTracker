/* Android 0.99.7.28 — deterministic Discover touch + horizontal gesture fallback */
(() => {
'use strict';
if(window.__ctAndroidR200Loaded)return;
window.__ctAndroidR200Loaded=true;
window.__ctAndroidR200='discover-direct-tabs-manual-horizontal-scroll';
window.__ctAndroidDiscoverTabs='window-capture-direct-renderDiscover';
window.__ctAndroidHorizontalEngine='touch-scrollLeft-horizontal-dominance';
window.__ctAndroidWatchlist='r196-shared-add-remove-toggle';

const HORIZONTAL_R200=[
  '[data-page="discover"] [data-ct-r180-tabs]',
  '[data-page="discover"] .ct-r180-type-filters',
  '[data-page="discover"] .filters',
  '[data-page="discover"] .discover-carousel',
  '[data-page="discover"] [data-discover-content] .row',
  '[data-page="discover"] .ct171-provider-tabs',
  '[data-page="discover"] .ct171-top-row-disabled-r231',
  '.ct169-cast-row',
  '.ct169-related-row',
  '.ct169-season-row',
  '.ct169-season-chart-carousel',
  '.ct171-provider-row',
  '.ct169-chart-scroll',
  '.ct169-activity-scroll'
].join(',');

function railR200(target){
  const r=target?.closest?.(HORIZONTAL_R200);if(!r)return null;
  return Number(r.scrollWidth||0)>Number(r.clientWidth||0)+3?r:null;
}

let gestureR200=null,lastDragRailR200=null,suppressClickUntilR200=0;

document.addEventListener('touchstart',e=>{
  if(e.touches?.length!==1){gestureR200=null;return}
  const r=railR200(e.target);if(!r){gestureR200=null;return}
  const t=e.touches[0];gestureR200={rail:r,x:t.clientX,y:t.clientY,left:r.scrollLeft,axis:'',moved:false};
},{capture:true,passive:true});

document.addEventListener('touchmove',e=>{
  const g=gestureR200;if(!g||e.touches?.length!==1)return;
  const t=e.touches[0],dx=t.clientX-g.x,dy=t.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);
  if(!g.axis){
    if(Math.max(ax,ay)<6)return;
    g.axis=ax>ay*1.08?'x':'y';
  }
  if(g.axis!=='x')return;
  if(e.cancelable)e.preventDefault();
  g.rail.scrollLeft=g.left-dx;
  if(ax>9)g.moved=true;
},{capture:true,passive:false});

function endGestureR200(){
  const g=gestureR200;gestureR200=null;
  if(g?.moved&&g.axis==='x'){lastDragRailR200=g.rail;suppressClickUntilR200=Date.now()+520}
}
document.addEventListener('touchend',endGestureR200,{capture:true,passive:true});
document.addEventListener('touchcancel',endGestureR200,{capture:true,passive:true});

/* Window capture runs before the legacy document capture handler. This makes Discover
   tabs deterministic and also prevents a drag release from opening the poster underneath. */
window.addEventListener('click',e=>{
  if(Date.now()<suppressClickUntilR200&&lastDragRailR200?.contains?.(e.target)){
    e.preventDefault();e.stopImmediatePropagation();return;
  }
  let r='';try{r=String(route?.()||'').replace(/^\//,'')}catch{r=String(location.pathname||'').replace(/^\//,'')}
  if(r!=='discover')return;
  const tab=e.target.closest?.('[data-discover-tab]');
  if(tab){
    e.preventDefault();e.stopImmediatePropagation();
    const next=String(tab.dataset.discoverTab||'foryou');
    discoverState.tab=next;
    if(next==='foryou')discoverState.type='all';
    tab.parentElement?.querySelectorAll('[data-discover-tab]').forEach(x=>x.classList.toggle('active',x===tab));
    const seq=++navSeq;void Promise.resolve(renderDiscover(seq)).catch(err=>{try{toast(err?.message||String(err))}catch{}});return;
  }
  const type=e.target.closest?.('[data-discover-type]');
  if(type){
    e.preventDefault();e.stopImmediatePropagation();
    discoverState.type=String(type.dataset.discoverType||'all');
    type.parentElement?.querySelectorAll('[data-discover-type]').forEach(x=>x.classList.toggle('active',x===type));
    const seq=++navSeq;void Promise.resolve(renderDiscover(seq)).catch(err=>{try{toast(err?.message||String(err))}catch{}});return;
  }
},true);

/* JS owns horizontal displacement for legacy rails only. Top 10 is excluded and remains native. */
const styleR200=document.createElement('style');styleR200.id='ct-android-099728-horizontal-engine';styleR200.textContent=`
[data-page="discover"] [data-ct-r180-tabs],
[data-page="discover"] .ct-r180-type-filters,
[data-page="discover"] .filters,
[data-page="discover"] .discover-carousel,
[data-page="discover"] [data-discover-content] .row,
[data-page="discover"] .ct171-provider-tabs,
[data-page="discover"] .ct171-top-row-disabled-r231,
.ct169-cast-row,.ct169-related-row,.ct169-season-row,.ct169-season-chart-carousel,.ct171-provider-row,.ct169-chart-scroll,.ct169-activity-scroll{
  overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:none!important;scroll-behavior:auto!important;
  overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;
  pointer-events:auto!important;
}
[data-page="discover"] [data-ct-r180-tabs] *,
[data-page="discover"] .ct-r180-type-filters *,
[data-page="discover"] .filters *,
[data-page="discover"] .discover-carousel *,
[data-page="discover"] [data-discover-content] .row *,
.ct169-cast-row *,.ct169-related-row *,.ct169-season-row *,.ct169-season-chart-carousel *,.ct171-provider-row *{
  touch-action:pan-y!important;
}
[data-page="discover"] .ct-r180-tab-shell{min-width:0!important;width:100%!important;max-width:100%!important;overflow:visible!important}
[data-page="discover"] [data-ct-r180-tabs]>.chip,[data-page="discover"] .ct-r180-type-filters>.chip{flex:0 0 auto!important;pointer-events:auto!important}
`;
document.getElementById(styleR200.id)?.remove();document.head.appendChild(styleR200);

})();
