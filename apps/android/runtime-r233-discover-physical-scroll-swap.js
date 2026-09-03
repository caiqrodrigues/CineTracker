/* Android 0.99.7.61 r233 — physical-device Trocar + authoritative Top10 drag */
(() => {
'use strict';
if(window.__ctAndroidR233Loaded)return;
window.__ctAndroidR233Loaded=true;
window.__ctAndroidR233='direct-button-swap-window-top10-drag-equal-cards';
window.__ctAndroidBundle='android-v0.99.7.61-r233-physical-discover-fix';
window.__ctR233Base='branch-from-r226-reject-r227-r232';
window.__ctR233Swap='keep-ct166-layout-class-private-data-direct-element-listeners';
window.__ctR233Top10='window-capture-move-scrollleft-provider-series-movies';
window.__ctR233Cards='equal-three-columns-grid-row-stretch';
window.__ctR233Scope='android-only-web-r203-untouched';

const SWAP233='[data-ct233-swap]';
const TOP233='[data-page="discover"] .ct171-provider-tabs,[data-page="discover"] .ct171-top-row';
const mediaId233=slot=>{const raw=String(slot?.querySelector?.('[data-media]')?.dataset?.media||'');return Number(raw.split(':')[1]||0)};
function pools233(){
  const d=(typeof ct166ForYouData==='object'&&ct166ForYouData)||{};
  return {
    fresh:d._ct166_fresh||d._ct186_fresh||{movie:[],series:[],anime:[]},
    watch:d._ct166_watchlist||d._ct186_watchlist||{movie:[],series:[],anime:[]}
  };
}
function rawPool233(key){
  const {fresh,watch}=pools233();
  if(key==='daily:movie'||key==='fresh:movie')return fresh.movie||[];
  if(key==='fresh:series')return fresh.series||[];
  if(key==='fresh:anime')return fresh.anime||[];
  if(key==='watchlist:movie')return watch.movie||[];
  if(key==='watchlist:series')return watch.series||[];
  if(key==='watchlist:anime')return watch.anime||[];
  return [];
}
function unique233(list){
  const seen=new Set();
  return (Array.isArray(list)?list:[]).filter(x=>{const id=Number(x?.id||0);if(!id||seen.has(id))return false;seen.add(id);return true});
}
function dailyId233(){
  const b=document.querySelector?.('[data-ct233-swap="daily:movie"]');
  return mediaId233(b?.closest?.('.ct166-slot,.foryou-slot'));
}
function pickNext233(key,current){
  const excluded=key==='fresh:movie'?dailyId233():0;
  const list=unique233(rawPool233(key)).filter(x=>Number(x.id)!==Number(excluded||0));
  if(!list.length)return null;
  const at=list.findIndex(x=>Number(x.id)===Number(current||0));
  if(at<0)return list.find(x=>Number(x.id)!==Number(current||0))||null;
  for(let step=1;step<=list.length;step++){
    const x=list[(at+step)%list.length];
    if(Number(x?.id||0)!==Number(current||0))return x;
  }
  return null;
}
window.__ctR233PickNext=pickNext233;

function placeSwap233(slot){
  if(!slot)return;
  const swap=slot.querySelector?.(SWAP233);if(!swap)return;
  swap.classList?.add?.('ct166-swap','ct233-swap');
  const card=slot.querySelector?.('.discover-card,.card');
  if(card){
    let actions=card.querySelector?.('.ct169-card-actions');
    if(!actions){actions=document.createElement('div');actions.className='ct169-card-actions';card.appendChild(actions)}
    const wl=card.querySelector?.('.discover-watch,[data-discover-watch],[data-ct224-watchlist],[data-ct226-watchlist]');
    if(wl&&wl.parentElement!==actions)actions.appendChild(wl);
    if(swap.parentElement!==actions)actions.appendChild(swap);
    slot.querySelector?.('.ct166-slot-head')?.classList?.add?.('ct169-clean-head');
  }
  bindSwap233(swap);
}
function swapNow233(button){
  const key=String(button?.dataset?.ct233Swap||''),slot=button?.closest?.('.ct166-slot,.foryou-slot');
  if(!key||!slot||typeof ct166Slot!=='function')return false;
  const current=mediaId233(slot),next=pickNext233(key,current);if(!next)return false;
  const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const count=unique233(rawPool233(key)).length;
  const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,count);
  const fresh=box.firstElementChild;if(!fresh)return false;
  slot.replaceWith(fresh);fresh.classList?.add?.('ct233-swap-pulse');
  decorateSwap233(fresh);placeSwap233(fresh);return true;
}
window.__ctR233SwapNow=swapNow233;

let lastSwap233=null,lastSwapKey233='',lastSwapAt233=0;
function bindSwap233(button){
  if(!button||button.dataset?.ct233Bound==='1')return;
  button.dataset.ct233Bound='1';button.disabled=false;
  const fire=e=>{
    if(e?.type==='pointerup'&&e.pointerType&&e.pointerType!=='touch'&&e.pointerType!=='pen'&&e.pointerType!=='mouse')return;
    const key=String(button.dataset.ct233Swap||''),now=Date.now();
    e?.preventDefault?.();e?.stopImmediatePropagation?.();
    if(button===lastSwap233&&key===lastSwapKey233&&now-lastSwapAt233<520)return;
    if(swapNow233(button)){lastSwap233=button;lastSwapKey233=key;lastSwapAt233=now}
  };
  button.addEventListener('touchend',fire,{passive:false});
  button.addEventListener('pointerup',fire,false);
  button.addEventListener('click',fire,false);
}
function decorateSwap233(root=document){
  const nodes=[];
  try{if(root?.matches?.(SWAP233))nodes.push(root)}catch{}
  try{nodes.push(...(root?.querySelectorAll?.(SWAP233)||[]))}catch{}
  for(const b of nodes){const slot=b.closest?.('.ct166-slot,.foryou-slot');if(slot)placeSwap233(slot);else bindSwap233(b)}
}
window.__ctR233BindSwap=bindSwap233;

/* Physical Android: window owns displacement during MOVE only. Starts/ends are left
   untouched, so a simple tap still reaches provider buttons and media cards normally. */
let touch233=null,pointer233=null,suppressRail233=null,suppressUntil233=0;
function rail233(target){
  const r=target?.closest?.(TOP233);if(!r)return null;
  return Number(r.scrollWidth||0)>Number(r.clientWidth||0)+2?r:null;
}
function clampLeft233(r,v){return Math.max(0,Math.min(Math.max(0,Number(r.scrollWidth||0)-Number(r.clientWidth||0)),Number(v||0)))}
function startTouch233(e){
  if(e.touches?.length!==1)return;
  const r=rail233(e.target);if(!r)return;
  const t=e.touches[0];touch233={rail:r,id:t.identifier,x:t.clientX,y:t.clientY,left:Number(r.scrollLeft||0),axis:'',moved:false};
}
function moveTouch233(e){
  const s=touch233;if(!s)return;
  const t=Array.from(e.touches||[]).find(x=>x.identifier===s.id);if(!t)return;
  const dx=t.clientX-s.x,dy=t.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
  if(!s.axis){if(Math.max(ax,ay)<5)return;s.axis=ax>ay*1.03?'x':'y'}
  if(s.axis!=='x')return;
  if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  s.rail.scrollLeft=clampLeft233(s.rail,s.left-dx);if(ax>9)s.moved=true;
}
function endTouch233(e){
  const s=touch233;if(!s)return;
  if(!(Array.from(e.changedTouches||[]).some(x=>x.identifier===s.id)))return;
  touch233=null;if(s.moved&&s.axis==='x'){suppressRail233=s.rail;suppressUntil233=Date.now()+360}
}
window.addEventListener('touchstart',startTouch233,{capture:true,passive:true});
window.addEventListener('touchmove',moveTouch233,{capture:true,passive:false});
window.addEventListener('touchend',endTouch233,{capture:true,passive:true});
window.addEventListener('touchcancel',()=>{touch233=null},{capture:true,passive:true});

function startPointer233(e){
  if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;
  const r=rail233(e.target);if(!r)return;
  pointer233={rail:r,id:e.pointerId,x:e.clientX,y:e.clientY,left:Number(r.scrollLeft||0),axis:'',moved:false};
}
function movePointer233(e){
  const s=pointer233;if(!s||e.pointerId!==s.id)return;
  const dx=e.clientX-s.x,dy=e.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
  if(!s.axis){if(Math.max(ax,ay)<5)return;s.axis=ax>ay*1.03?'x':'y'}
  if(s.axis!=='x')return;
  if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  s.rail.scrollLeft=clampLeft233(s.rail,s.left-dx);if(ax>9)s.moved=true;
}
function endPointer233(e){
  const s=pointer233;if(!s||e.pointerId!==s.id)return;
  pointer233=null;if(s.moved&&s.axis==='x'){suppressRail233=s.rail;suppressUntil233=Date.now()+360}
}
window.addEventListener('pointerdown',startPointer233,true);
window.addEventListener('pointermove',movePointer233,{capture:true,passive:false});
window.addEventListener('pointerup',endPointer233,true);
window.addEventListener('pointercancel',endPointer233,true);
window.addEventListener('click',e=>{
  if(Date.now()<suppressUntil233&&suppressRail233?.contains?.(e.target)){
    e.preventDefault();e.stopImmediatePropagation?.();
  }
},true);
window.__ctR233MoveTouch=moveTouch233;
window.__ctR233MovePointer=movePointer233;

try{
  const base=paintDiscover;
  paintDiscover=function(...args){const out=base.apply(this,args);requestAnimationFrame(()=>decorateSwap233(document));return out};
}catch{}
let frame233=0;
try{
  new MutationObserver(ms=>{if(frame233)return;frame233=requestAnimationFrame(()=>{frame233=0;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)decorateSwap233(n);decorateSwap233(document)})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true});
}catch{}

const style233=document.createElement('style');style233.id='ct-android-099761-physical-discover';style233.textContent=`
/* Preserve original compact action placement. ct166-swap is a layout class only;
   data-ct233-swap is the sole action authority. */
[data-page="discover"] .ct233-swap{pointer-events:auto!important;touch-action:manipulation!important}
[data-page="discover"] .ct169-card-actions .ct233-swap{width:auto!important;min-width:0!important;margin:0!important}
.ct233-swap-pulse{animation:ct233Swap .18s ease-out}
@keyframes ct233Swap{0%{opacity:.35;transform:translateX(8px) scale(.985)}70%{opacity:1;transform:translateX(-1px)}100%{opacity:1;transform:none}}

/* Three recommendation slots: equal columns and equal card row height without moving
   the action button out of the compact ct169 card action area. */
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid){display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:1fr!important;gap:6px!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow:visible!important;align-items:stretch!important;padding:1px!important}
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot,[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot{box-sizing:border-box!important;display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;width:auto!important;min-width:0!important;max-width:none!important;height:100%!important;align-self:stretch!important}
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot>.card,[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot>.card{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important}
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid) .poster{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}

/* Top 10 is intentionally JS-dragged on Android. pan-y leaves vertical page scrolling
   native while horizontal movement is handled at window capture before legacy handlers. */
[data-page="discover"] .ct171-provider-tabs,[data-page="discover"] .ct171-top-row{display:flex!important;flex-flow:row nowrap!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;scroll-behavior:auto!important;scroll-snap-type:none!important;touch-action:pan-y!important;pointer-events:auto!important}
[data-page="discover"] .ct171-provider-tabs>*,[data-page="discover"] .ct171-top-row>*{flex:0 0 auto!important;touch-action:pan-y!important}
[data-page="discover"] .ct171-provider-tabs *,[data-page="discover"] .ct171-top-row *{touch-action:pan-y!important}
`;
document.getElementById(style233.id)?.remove();document.head.appendChild(style233);
try{requestAnimationFrame(()=>decorateSwap233(document))}catch{}
})();
