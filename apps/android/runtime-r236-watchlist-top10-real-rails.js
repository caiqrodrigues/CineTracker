/* Android 0.99.7.64 r236 — watchlist Trocar + real Top10 rails */
(() => {
'use strict';
if(window.__ctAndroidR236Loaded)return;
window.__ctAndroidR236Loaded=true;
window.__ctAndroidR236='watchlist-trocar-real-top10-overflow';
window.__ctAndroidBundle='android-v0.99.7.64-r236-watchlist-top10-real-rails';
window.__ctR236Base='clean-r226-no-r227-r235';
window.__ctR236Swap='ct166pick-watchlist-and-fresh-direct-slot';
window.__ctR236Top10='constrain-real-rail-direct-touchmove-scrollleft';
window.__ctR236Cards='preserve-r235-fixed-equal-card-geometry';
window.__ctR236Scope='android-only-web-r203-untouched';

const SWAP236='[data-ct236-swap]';
const RAIL236='.ct171-provider-tabs,.ct171-top-row';

function isDiscover236(){
  try{return String(route())==='discover'}catch{return String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover'}
}
function isForYou236(){
  if(!isDiscover236())return false;
  try{return String(discoverState?.tab||'foryou')==='foryou'}catch{return true}
}
function mediaId236(slot){
  const raw=String(slot?.querySelector?.('[data-media]')?.dataset?.media||'');
  return Number(raw.split(':')[1]||0);
}
function pool236(key){
  let d=null;
  try{if(typeof ct166ForYouData==='object'&&ct166ForYouData)d=ct166ForYouData}catch{}
  try{if(!d&&typeof ct186ForYouData==='object'&&ct186ForYouData)d=ct186ForYouData}catch{}
  d=d||{};
  const f=d._ct166_fresh||d._ct186_fresh||{movie:[],series:[],anime:[]};
  const w=d._ct166_watchlist||d._ct186_watchlist||{movie:[],series:[],anime:[]};
  if(key==='daily:movie'||key==='fresh:movie')return Array.isArray(f.movie)?f.movie:[];
  if(key==='fresh:series')return Array.isArray(f.series)?f.series:[];
  if(key==='fresh:anime')return Array.isArray(f.anime)?f.anime:[];
  if(key==='watchlist:movie')return Array.isArray(w.movie)?w.movie:[];
  if(key==='watchlist:series')return Array.isArray(w.series)?w.series:[];
  if(key==='watchlist:anime')return Array.isArray(w.anime)?w.anime:[];
  return [];
}
function unique236(rows){
  const seen=new Set(),out=[];
  for(const x of Array.isArray(rows)?rows:[]){
    const id=Number(x?.id||x?.tmdb_id||0);
    if(!(id>0)||seen.has(id))continue;
    seen.add(id);out.push(x);
  }
  return out;
}
function pickByCt166236(key,current){
  const rows=unique236(pool236(key));if(rows.length<2)return null;
  const excluded=[];
  if(key==='fresh:movie'){
    try{
      const daily=ct166Pick(pool236('daily:movie'),'daily:movie',[]);
      const id=Number(daily?.id||daily?.tmdb_id||0);if(id>0)excluded.push(id);
    }catch{}
  }
  for(let i=0;i<rows.length+2;i++){
    try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1}catch{return null}
    let next=null;
    try{next=ct166Pick(rows,key,excluded)}catch{}
    const id=Number(next?.id||next?.tmdb_id||0);
    if(id>0&&id!==Number(current||0))return next;
  }
  return rows.find(x=>Number(x?.id||x?.tmdb_id||0)!==Number(current||0)&&!excluded.includes(Number(x?.id||x?.tmdb_id||0)))||null;
}
window.__ctR236PickByCt166=pickByCt166236;

function placeSwap236(slot){
  if(!slot)return;
  const swap=slot.querySelector?.(SWAP236);if(!swap)return;
  swap.classList?.add?.('ct166-swap','ct236-swap');
  const card=slot.querySelector?.('.discover-card,.card');if(!card)return;
  let actions=card.querySelector?.('.ct169-card-actions');
  if(!actions){actions=document.createElement('div');actions.className='ct169-card-actions';card.appendChild(actions)}
  const wl=card.querySelector?.('.discover-watch,[data-discover-watch],[data-ct224-watchlist],[data-ct226-watchlist]');
  if(wl&&wl.parentElement!==actions)actions.appendChild(wl);
  if(swap.parentElement!==actions)actions.appendChild(swap);
  slot.querySelector?.('.ct166-slot-head')?.classList?.add?.('ct169-clean-head');
}
function decorateSwap236(root=document){
  const slots=[];
  try{if(root?.matches?.('.ct166-slot,.foryou-slot'))slots.push(root)}catch{}
  try{slots.push(...(root?.querySelectorAll?.('.ct166-slot,.foryou-slot')||[]))}catch{}
  for(const s of slots)placeSwap236(s);
}
function swapNow236(button){
  const key=String(button?.dataset?.ct236Swap||''),slot=button?.closest?.('.ct166-slot,.foryou-slot');
  if(!key||!slot||typeof ct166Slot!=='function'||typeof ct166Pick!=='function')return false;
  const current=mediaId236(slot),next=pickByCt166236(key,current);if(!next)return false;
  const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const count=unique236(pool236(key)).length;
  const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,count);
  const fresh=box.firstElementChild;if(!fresh)return false;
  slot.replaceWith(fresh);fresh.classList?.add?.('ct236-swap-pulse');
  placeSwap236(fresh);
  try{decorate226(fresh)}catch{}
  requestAnimationFrame(()=>{try{ct169TuneForYou()}catch{};placeSwap236(fresh)});
  return true;
}
window.__ctR236SwapNow=swapNow236;

let lastSwapKey236='',lastSwapAt236=0;
function activateSwap236(e){
  if(!isForYou236()||e?.touches?.length!==1)return;
  const b=e.target?.closest?.(SWAP236);if(!b)return;
  const key=String(b.dataset?.ct236Swap||'');if(!key)return;
  const now=Date.now();
  if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  if(key===lastSwapKey236&&now-lastSwapAt236<280)return;
  if(swapNow236(b)){lastSwapKey236=key;lastSwapAt236=now}
}
window.addEventListener('touchstart',activateSwap236,{capture:true,passive:false});
window.addEventListener('click',e=>{
  if(!isForYou236())return;
  const b=e.target?.closest?.(SWAP236);if(!b)return;
  e.preventDefault();e.stopImmediatePropagation?.();
  const key=String(b.dataset?.ct236Swap||''),now=Date.now();
  if(key===lastSwapKey236&&now-lastSwapAt236<700)return;
  if(swapNow236(b)){lastSwapKey236=key;lastSwapAt236=now}
},true);

/* The failing physical-device case had a visually clipped rail whose own clientWidth could
   still expand to its contents. Constrain each dynamic rail to the actual visible WebView
   width before handling the gesture, making scrollWidth > clientWidth a real invariant. */
function visibleWidth236(r){
  const viewport=Number(window.visualViewport?.width||window.innerWidth||document.documentElement?.clientWidth||0);
  const rect=r?.getBoundingClientRect?.()||{left:0,width:0};
  const left=Math.max(0,Number(rect.left||0));
  let w=viewport>0?viewport-left-12:Number(rect.width||0);
  const p=r?.parentElement;
  const pw=Number(p?.clientWidth||p?.getBoundingClientRect?.()?.width||0);
  if(pw>0)w=w>0?Math.min(w,pw):pw;
  return Math.max(180,Math.floor(w||320));
}
function setImp236(style,name,value){
  try{style?.setProperty?.(name,value,'important')}catch{try{style[name]=value}catch{}}
}
function normalizeRail236(r){
  if(!r)return null;
  const w=visibleWidth236(r);
  setImp236(r.style,'box-sizing','border-box');
  setImp236(r.style,'display','flex');
  setImp236(r.style,'flex-flow','row nowrap');
  setImp236(r.style,'width',w+'px');
  setImp236(r.style,'max-width',w+'px');
  setImp236(r.style,'min-width','0');
  setImp236(r.style,'overflow-x','auto');
  setImp236(r.style,'overflow-y','hidden');
  setImp236(r.style,'-webkit-overflow-scrolling','touch');
  setImp236(r.style,'overscroll-behavior-x','contain');
  setImp236(r.style,'scroll-behavior','auto');
  setImp236(r.style,'scroll-snap-type','none');
  setImp236(r.style,'touch-action','pan-y');
  return r;
}
window.__ctR236NormalizeRail=normalizeRail236;

const railState236=new WeakMap();
function bindRail236(r){
  if(!r||r.__ct236RailBound)return r;
  r.__ct236RailBound=true;normalizeRail236(r);
  r.addEventListener('touchstart',e=>{
    if(!isDiscover236()||e?.touches?.length!==1)return;
    normalizeRail236(r);
    const t=e.touches[0];
    railState236.set(r,{id:t.identifier,x:t.clientX,y:t.clientY,left:Number(r.scrollLeft||0),axis:'',moved:false});
  },{passive:true});
  r.addEventListener('touchmove',e=>{
    const s=railState236.get(r);if(!s)return;
    const t=Array.from(e.touches||[]).find(x=>x.identifier===s.id);if(!t)return;
    const dx=t.clientX-s.x,dy=t.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
    if(!s.axis){if(Math.max(ax,ay)<4)return;s.axis=ax>ay*1.05?'x':'y'}
    if(s.axis!=='x')return;
    normalizeRail236(r);
    const max=Math.max(0,Number(r.scrollWidth||0)-Number(r.clientWidth||0));
    if(max<=1)return;
    if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
    r.scrollLeft=Math.max(0,Math.min(max,s.left-dx));if(ax>7)s.moved=true;
  },{passive:false});
  const finish=e=>{
    const s=railState236.get(r);if(!s)return;
    if(e?.changedTouches?.length&&!Array.from(e.changedTouches).some(x=>x.identifier===s.id))return;
    railState236.delete(r);
    if(s.axis==='x'&&s.moved){r.__ct236SuppressClickUntil=Date.now()+420}
  };
  r.addEventListener('touchend',finish,{passive:true});
  r.addEventListener('touchcancel',finish,{passive:true});
  r.addEventListener('click',e=>{
    if(Date.now()<Number(r.__ct236SuppressClickUntil||0)){e.preventDefault();e.stopImmediatePropagation?.()}
  },true);
  return r;
}
window.__ctR236BindRail=bindRail236;
function scanRails236(root=document){
  const rails=[];
  try{if(root?.matches?.(RAIL236))rails.push(root)}catch{}
  try{rails.push(...(root?.querySelectorAll?.(RAIL236)||[]))}catch{}
  for(const r of rails)bindRail236(r);
}

try{
  const base=paintDiscover;
  paintDiscover=function(...args){
    const out=base.apply(this,args);
    decorateSwap236(document);scanRails236(document);
    requestAnimationFrame(()=>{decorateSwap236(document);scanRails236(document)});
    return out;
  };
}catch{}
let frame236=0;
try{
  new MutationObserver(ms=>{
    if(frame236)return;
    frame236=requestAnimationFrame(()=>{
      frame236=0;
      for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1){decorateSwap236(n);scanRails236(n)}
      decorateSwap236(document);scanRails236(document);
    });
  }).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true});
}catch{}
window.addEventListener('resize',()=>requestAnimationFrame(()=>scanRails236(document)),{passive:true});

const style236=document.createElement('style');style236.id='ct-android-099764-watchlist-top10';
style236.textContent=`
/* Preserve the card geometry already approved on .63. */
[data-discover] .foryou-grid:not(.ct166-daily-grid){display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:1fr!important;gap:6px!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow:visible!important;align-items:stretch!important;padding:1px!important}
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot,
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot{box-sizing:border-box!important;display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;width:auto!important;min-width:0!important;max-width:none!important;height:100%!important;align-self:stretch!important}
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot>.discover-card,
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot>.discover-card{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important;overflow:hidden!important}
[data-discover] .foryou-grid .poster,[data-discover] .discover-carousel .poster{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}
.card .card-body>b,.ct171-top-card .card-body>b,.ct169-related-card b,.ct169-cast-card b,.ct171-provider-card b{display:block!important;min-width:0!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.card .card-body>small,.ct171-top-card .card-body>small{display:block!important;min-width:0!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.discover-card .card-body{box-sizing:border-box!important;height:42px!important;min-height:42px!important;max-height:42px!important;overflow:hidden!important}
.ct171-top-card .card-body{box-sizing:border-box!important;height:48px!important;min-height:48px!important;max-height:48px!important;overflow:hidden!important}
[data-discover] .ct169-card-actions{box-sizing:border-box!important;min-height:38px!important;height:38px!important;max-height:38px!important;align-items:stretch!important;overflow:hidden!important}
[data-discover] .ct169-card-actions>*{min-height:0!important;height:100%!important;max-height:100%!important;margin:0!important}
[data-discover] .ct236-swap{pointer-events:auto!important;touch-action:manipulation!important;width:auto!important;min-width:0!important;margin:0!important}
.ct236-swap-pulse{animation:ct236Swap .16s ease-out}
@keyframes ct236Swap{0%{opacity:.35;transform:translateX(8px) scale(.985)}100%{opacity:1;transform:none}}

/* Real Top10 overflow: prevent the shell/panels from growing to min-content width. */
[data-discover] .ct171-top10-shell,
[data-discover] [data-ct226-top-content],
[data-discover] .ct171-top-section{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important}
[data-discover] .ct171-top-section{overflow:hidden!important}
.ct171-provider-tabs,.ct171-top-row{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;scroll-behavior:auto!important;scroll-snap-type:none!important;touch-action:pan-y!important;pointer-events:auto!important}
.ct171-provider-tabs>*,.ct171-top-row>*{flex:0 0 auto!important;min-width:0;touch-action:pan-y!important}
.ct171-provider-tabs *,.ct171-top-row *{touch-action:pan-y!important}
`;
document.getElementById(style236.id)?.remove();document.head.appendChild(style236);
requestAnimationFrame(()=>{decorateSwap236(document);scanRails236(document)});
})();
