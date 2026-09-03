/* Android 0.99.7.29 — WebView-native pointer controller for Discover and horizontal rails */
(() => {
'use strict';
if(window.__ctAndroidR201Loaded)return;
window.__ctAndroidR201Loaded=true;
window.__ctAndroidR201='pointer-capture-discover-tabs-horizontal-rails';
window.__ctAndroidDiscoverTabs='direct-capture-click-without-touch-listener-conflict';
window.__ctAndroidHorizontalEngine='pointer-events-pan-y-manual-scrollleft-with-arrow-fallback';

/* r198 may suppress a legitimate route render immediately after foregrounding.
   Navigation/filter changes must always render. */
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
window.__ctAndroidRenderPolicy='navigation-and-discover-filters-never-throttled';

const RAIL_SEL_R201=[
  '[data-page="discover"] [data-ct-r180-tabs]',
  '[data-page="discover"] .tabs',
  '[data-page="discover"] .ct-r180-type-filters',
  '[data-page="discover"] .filters',
  '[data-page="discover"] [data-discover-content] .row',
  '[data-page="discover"] .discover-carousel',
  '[data-page="discover"] .ct171-provider-tabs',
  '[data-page="discover"] .ct171-top-row-disabled-r231',
  '.ct169-cast-row','.ct169-related-row','.ct169-season-row','.ct169-season-chart-carousel',
  '.ct171-provider-row','.ct169-chart-scroll','.ct169-activity-scroll','.timeline'
].join(',');

function rail201(el){
  const r=el?.closest?.(RAIL_SEL_R201);
  if(!r)return null;
  return Number(r.scrollWidth||0)>Number(r.clientWidth||0)+2?r:null;
}

let drag201=null;
let suppressRail201=null;
let suppressUntil201=0;

document.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;
  if(!e.isPrimary)return;
  const r=rail201(e.target);if(!r)return;
  drag201={id:e.pointerId,rail:r,x:e.clientX,y:e.clientY,left:r.scrollLeft,axis:null,moved:false};
},{capture:true,passive:true});

document.addEventListener('pointermove',e=>{
  const g=drag201;if(!g||e.pointerId!==g.id)return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);
  if(!g.axis){
    if(Math.max(ax,ay)<7)return;
    g.axis=ax>ay*1.12?'x':'y';
    if(g.axis==='x')try{g.rail.setPointerCapture(e.pointerId)}catch{}
  }
  if(g.axis!=='x')return;
  g.rail.scrollLeft=g.left-dx;
  if(ax>12)g.moved=true;
  if(e.cancelable)e.preventDefault();
},{capture:true,passive:false});

function finish201(e){
  const g=drag201;if(!g||e.pointerId!==g.id)return;
  drag201=null;
  try{g.rail.releasePointerCapture(e.pointerId)}catch{}
  if(g.moved&&g.axis==='x'){suppressRail201=g.rail;suppressUntil201=Date.now()+260}
}
document.addEventListener('pointerup',finish201,{capture:true,passive:true});
document.addEventListener('pointercancel',finish201,{capture:true,passive:true});

function onDiscover201(){try{return String(route())==='discover'}catch{return String(location.pathname)==='/discover'}}
function paintActive201(btn,sel){btn.parentElement?.querySelectorAll(sel).forEach(x=>x.classList.toggle('active',x===btn))}

/* Runs on window capture before the legacy document capture listener. A real drag gets
   one short click suppression; ordinary taps are never delayed. */
window.addEventListener('click',e=>{
  if(Date.now()<suppressUntil201&&suppressRail201?.contains?.(e.target)){
    e.preventDefault();e.stopImmediatePropagation();return;
  }
  const arrow=e.target.closest?.('[data-ct-r180-tab-scroll],[data-r201-scroll]');
  if(arrow){
    const target=arrow.hasAttribute('data-ct-r180-tab-scroll')
      ?document.querySelector('[data-ct-r180-tabs]')
      :document.querySelector(`[data-r201-rail="${CSS.escape(String(arrow.dataset.r201Scroll||''))}"]`);
    if(target){e.preventDefault();e.stopImmediatePropagation();const dir=Number(arrow.dataset.ctR180TabScroll||arrow.dataset.r201Dir||1)||1;target.scrollLeft+=dir*Math.max(180,target.clientWidth*.78)}
    return;
  }
  if(!onDiscover201())return;
  const tab=e.target.closest?.('[data-discover-tab]');
  if(tab){
    e.preventDefault();e.stopImmediatePropagation();
    const next=String(tab.dataset.discoverTab||'foryou');discoverState.tab=next;if(next==='foryou')discoverState.type='all';
    paintActive201(tab,'[data-discover-tab]');const seq=++navSeq;
    void Promise.resolve(renderDiscover(seq)).catch(err=>{try{toast(err?.message||String(err))}catch{}});return;
  }
  const type=e.target.closest?.('[data-discover-type]');
  if(type){
    e.preventDefault();e.stopImmediatePropagation();discoverState.type=String(type.dataset.discoverType||'all');
    paintActive201(type,'[data-discover-type]');const seq=++navSeq;
    void Promise.resolve(renderDiscover(seq)).catch(err=>{try{toast(err?.message||String(err))}catch{}});return;
  }
},true);

let railSeq201=0;
function addFallback201(r){
  if(!r||Number(r.scrollWidth||0)<=Number(r.clientWidth||0)+2)return;
  if(r.dataset.r201Rail)return;
  const id='r201-'+(++railSeq201);r.dataset.r201Rail=id;
  /* The main Discover tab rail already has its own arrows. */
  if(r.matches('[data-ct-r180-tabs]'))return;
  const controls=document.createElement('div');controls.className='ct201-scroll-controls';controls.dataset.r201Controls=id;
  controls.innerHTML=`<button type="button" aria-label="Mover para esquerda" data-r201-scroll="${id}" data-r201-dir="-1">‹</button><button type="button" aria-label="Mover para direita" data-r201-scroll="${id}" data-r201-dir="1">›</button>`;
  r.insertAdjacentElement('beforebegin',controls);
}
function enhanceRails201(root=document){
  const rows=[];try{if(root.matches?.(RAIL_SEL_R201))rows.push(root)}catch{}
  try{rows.push(...root.querySelectorAll?.(RAIL_SEL_R201)||[])}catch{}
  for(const r of rows)addFallback201(r);
}

try{
  const pd=paintDiscover;paintDiscover=function(){const out=pd.apply(this,arguments);requestAnimationFrame(()=>enhanceRails201(document));return out};
}catch{}
try{
  const rd=renderDiscover;renderDiscover=async function(){const out=await rd.apply(this,arguments);requestAnimationFrame(()=>enhanceRails201(document));return out};
}catch{}
try{
  const det=renderDetail;renderDetail=async function(){const out=await det.apply(this,arguments);requestAnimationFrame(()=>enhanceRails201(document));return out};
}catch{}

const style=document.createElement('style');style.id='ct-android-099729-pointer-controller';style.textContent=`
/* Remove all previous smooth/snap behavior. The pointer controller owns legacy horizontal drag;
   Top 10 is excluded and remains native. */
${RAIL_SEL_R201}{overflow-x:auto!important;overflow-y:hidden!important;scroll-behavior:auto!important;scroll-snap-type:none!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-x:contain!important;pointer-events:auto!important}
${RAIL_SEL_R201} *{touch-action:pan-y!important}
[data-page="discover"] .ct-r180-tab-shell{min-width:0!important;width:100%!important;max-width:100%!important;display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;align-items:center!important;gap:4px!important;overflow:visible!important}
[data-page="discover"] [data-ct-r180-tabs]{min-width:0!important;max-width:100%!important;display:flex!important;flex-wrap:nowrap!important}
[data-page="discover"] [data-ct-r180-tabs]>.chip,[data-page="discover"] .filters>.chip,[data-page="discover"] .ct-r180-type-filters>.chip{flex:0 0 auto!important;pointer-events:auto!important}
[data-page="discover"] .ct-r180-tab-arrow{display:flex!important;align-items:center!important;justify-content:center!important;min-width:30px!important;width:30px!important;height:30px!important;padding:0!important;z-index:4!important;touch-action:manipulation!important}
.ct201-scroll-controls{display:flex!important;justify-content:flex-end!important;gap:5px!important;height:28px!important;margin:0 0 3px!important;pointer-events:auto!important}
.ct201-scroll-controls button{display:flex!important;align-items:center!important;justify-content:center!important;width:32px!important;height:28px!important;padding:0!important;border:1px solid #315f78!important;border-radius:999px!important;background:#0a1b25!important;color:#eaf8ff!important;font-size:18px!important;line-height:1!important;touch-action:manipulation!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

/* Rows are often created asynchronously after the page shell. Observe only child insertion;
   no attribute writes are observed, so this cannot loop. */
try{
  const root=document.querySelector('#app')||document.body;
  new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)requestAnimationFrame(()=>enhanceRails201(n))}).observe(root,{childList:true,subtree:true});
}catch{}
requestAnimationFrame(()=>enhanceRails201(document));
})();
