/* Android 0.99.7.63 r235 — final physical-device Discover fix */
(() => {
'use strict';
if(window.__ctAndroidR235Loaded)return;
window.__ctAndroidR235Loaded=true;
window.__ctAndroidR235='final-physical-swap-top10-equal-cards';
window.__ctAndroidBundle='android-v0.99.7.63-r235-final-device-fix';
window.__ctR235Base='clean-r226-no-r227-r234';
window.__ctR235Swap='window-touchstart-private-direct-slot-replacement';
window.__ctR235Top10='bare-dynamic-rail-touchmove-scrollleft';
window.__ctR235Cards='fixed-media-card-copy-single-line-ellipsis';
window.__ctR235Scope='android-only-web-r203-untouched';

const SWAP235='[data-ct235-swap]';
/* IMPORTANT: these are the actual dynamically rendered rails. Never prefix this selector
   with [data-page="discover"] — the Android shell uses [data-discover], and the previous
   prefixed selector is why the gesture controller never acquired the real rail. */
const TOP235='.ct171-provider-tabs,.ct171-top-row';

function isDiscover235(){
  try{return String(route())==='discover'}catch{return String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover'}
}
function isForYou235(){
  if(!isDiscover235())return false;
  try{return String(discoverState?.tab||'foryou')==='foryou'}catch{return true}
}
function mediaId235(slot){
  const raw=String(slot?.querySelector?.('[data-media]')?.dataset?.media||'');
  return Number(raw.split(':')[1]||0);
}
function pools235(){
  let d=null;
  try{if(typeof ct166ForYouData==='object'&&ct166ForYouData)d=ct166ForYouData}catch{}
  try{if(!d&&typeof ct186ForYouData==='object'&&ct186ForYouData)d=ct186ForYouData}catch{}
  d=d||{};
  return {
    fresh:d._ct166_fresh||d._ct186_fresh||{movie:[],series:[],anime:[]},
    watch:d._ct166_watchlist||d._ct186_watchlist||{movie:[],series:[],anime:[]}
  };
}
function rawPool235(key){
  const {fresh,watch}=pools235();
  if(key==='daily:movie'||key==='fresh:movie')return fresh.movie||[];
  if(key==='fresh:series')return fresh.series||[];
  if(key==='fresh:anime')return fresh.anime||[];
  if(key==='watchlist:movie')return watch.movie||[];
  if(key==='watchlist:series')return watch.series||[];
  if(key==='watchlist:anime')return watch.anime||[];
  return [];
}
function unique235(rows){
  const seen=new Set(),out=[];
  for(const x of Array.isArray(rows)?rows:[]){const id=Number(x?.id||0);if(!(id>0)||seen.has(id))continue;seen.add(id);out.push(x)}
  return out;
}
function dailyId235(){
  const b=document.querySelector?.('[data-ct235-swap="daily:movie"]');
  return mediaId235(b?.closest?.('.ct166-slot,.foryou-slot'));
}
function pickNext235(key,current){
  const excluded=key==='fresh:movie'?dailyId235():0;
  const rows=unique235(rawPool235(key)).filter(x=>Number(x?.id||0)!==Number(excluded||0));
  if(rows.length<2&&rows.every(x=>Number(x?.id||0)===Number(current||0)))return null;
  const at=rows.findIndex(x=>Number(x?.id||0)===Number(current||0));
  if(at<0)return rows.find(x=>Number(x?.id||0)!==Number(current||0))||null;
  for(let step=1;step<=rows.length;step++){
    const next=rows[(at+step)%rows.length];
    if(Number(next?.id||0)!==Number(current||0))return next;
  }
  return null;
}
window.__ctR235PickNext=pickNext235;

function placeSwap235(slot){
  if(!slot)return;
  const swap=slot.querySelector?.(SWAP235);if(!swap)return;
  swap.classList?.add?.('ct166-swap','ct235-swap');
  const card=slot.querySelector?.('.discover-card,.card');if(!card)return;
  let actions=card.querySelector?.('.ct169-card-actions');
  if(!actions){actions=document.createElement('div');actions.className='ct169-card-actions';card.appendChild(actions)}
  const wl=card.querySelector?.('.discover-watch,[data-discover-watch],[data-ct224-watchlist],[data-ct226-watchlist]');
  if(wl&&wl.parentElement!==actions)actions.appendChild(wl);
  if(swap.parentElement!==actions)actions.appendChild(swap);
  slot.querySelector?.('.ct166-slot-head')?.classList?.add?.('ct169-clean-head');
}
function decorate235(root=document){
  const slots=[];
  try{if(root?.matches?.('.ct166-slot,.foryou-slot'))slots.push(root)}catch{}
  try{slots.push(...(root?.querySelectorAll?.('.ct166-slot,.foryou-slot')||[]))}catch{}
  for(const s of slots)placeSwap235(s);
}
function swapNow235(button){
  const key=String(button?.dataset?.ct235Swap||''),slot=button?.closest?.('.ct166-slot,.foryou-slot');
  if(!key||!slot||typeof ct166Slot!=='function')return false;
  const current=mediaId235(slot),next=pickNext235(key,current);if(!next)return false;
  try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1}catch{}
  const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const count=unique235(rawPool235(key)).length;
  const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,count);
  const fresh=box.firstElementChild;if(!fresh)return false;
  slot.replaceWith(fresh);fresh.classList?.add?.('ct235-swap-pulse');
  placeSwap235(fresh);
  try{decorate226(fresh)}catch{}
  requestAnimationFrame(()=>{try{ct169TuneForYou()}catch{};placeSwap235(fresh)});
  return true;
}
window.__ctR235SwapNow=swapNow235;

/* Physical Android tap authority. touchstart is used deliberately: there is no older
   window touchstart authority in the clean r226 branch, and this avoids WebView's
   unreliable pointerup/click delivery that caused the visible but inoperative button. */
let lastSwapKey235='',lastSwapAt235=0;
function activateSwap235(e){
  if(!isForYou235()||e?.touches?.length!==1)return;
  const b=e.target?.closest?.(SWAP235);if(!b)return;
  const key=String(b.dataset?.ct235Swap||'');if(!key)return;
  const now=Date.now();
  if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  if(key===lastSwapKey235&&now-lastSwapAt235<300)return;
  if(swapNow235(b)){lastSwapKey235=key;lastSwapAt235=now}
}
window.addEventListener('touchstart',activateSwap235,{capture:true,passive:false});
/* Mouse/accessibility fallback; touchstart normally suppresses the synthetic click. */
window.addEventListener('click',e=>{
  if(!isForYou235())return;
  const b=e.target?.closest?.(SWAP235);if(!b)return;
  e.preventDefault();e.stopImmediatePropagation?.();
  const key=String(b.dataset?.ct235Swap||''),now=Date.now();
  if(key===lastSwapKey235&&now-lastSwapAt235<700)return;
  if(swapNow235(b)){lastSwapKey235=key;lastSwapAt235=now}
},true);

/* Top 10: direct touch displacement on the actual dynamic rails. The previous controller
   used target.closest('[data-page="discover"] .ct171-top-row'), which never matched the
   real Android DOM. This controller uses the bare rail classes and therefore survives every
   provider/Top10 repaint. Vertical movement is left entirely to the page. */
let drag235=null,suppressRail235=null,suppressUntil235=0;
function railFromTarget235(target,path){
  const direct=target?.closest?.(TOP235);if(direct)return direct;
  for(const n of path||[])if(n?.matches?.(TOP235))return n;
  return null;
}
function usableRail235(target,path){
  const r=railFromTarget235(target,path);if(!r)return null;
  return Number(r.scrollWidth||0)>Number(r.clientWidth||0)+2?r:null;
}
function clamp235(r,v){return Math.max(0,Math.min(Math.max(0,Number(r.scrollWidth||0)-Number(r.clientWidth||0)),Number(v||0)))}
function startRail235(e){
  if(!isDiscover235()||e?.touches?.length!==1||e.target?.closest?.(SWAP235))return;
  const r=usableRail235(e.target,e.composedPath?.());if(!r)return;
  const t=e.touches[0];drag235={rail:r,id:t.identifier,x:t.clientX,y:t.clientY,left:Number(r.scrollLeft||0),axis:'',moved:false};
}
function moveRail235(e){
  const s=drag235;if(!s)return;
  const t=Array.from(e.touches||[]).find(x=>x.identifier===s.id);if(!t)return;
  const dx=t.clientX-s.x,dy=t.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
  if(!s.axis){if(Math.max(ax,ay)<4)return;s.axis=ax>ay*1.08?'x':'y'}
  if(s.axis!=='x')return;
  if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  s.rail.scrollLeft=clamp235(s.rail,s.left-dx);if(ax>7)s.moved=true;
}
function endRail235(e){
  const s=drag235;if(!s)return;
  const changed=Array.from(e.changedTouches||[]).some(x=>x.identifier===s.id);if(!changed)return;
  drag235=null;
  if(s.axis==='x'&&s.moved){suppressRail235=s.rail;suppressUntil235=Date.now()+420}
}
window.addEventListener('touchstart',startRail235,{capture:true,passive:true});
window.addEventListener('touchmove',moveRail235,{capture:true,passive:false});
window.addEventListener('touchend',endRail235,{capture:true,passive:true});
window.addEventListener('touchcancel',()=>{drag235=null},{capture:true,passive:true});
window.addEventListener('click',e=>{
  if(Date.now()<suppressUntil235&&suppressRail235?.contains?.(e.target)){
    e.preventDefault();e.stopImmediatePropagation?.();
  }
},true);
window.__ctR235RailFromTarget=railFromTarget235;
window.__ctR235MoveRail=moveRail235;

/* Keep placement correct across every asynchronous repaint. */
try{
  const base=paintDiscover;
  paintDiscover=function(...args){const out=base.apply(this,args);decorate235(document);requestAnimationFrame(()=>decorate235(document));return out};
}catch{}
let frame235=0;
try{
  new MutationObserver(ms=>{if(frame235)return;frame235=requestAnimationFrame(()=>{frame235=0;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)decorate235(n);decorate235(document)})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true});
}catch{}

const style235=document.createElement('style');style235.id='ct-android-099763-final-device';style235.textContent=`
/* Recommendation cards: title length must never change card geometry. */
[data-discover] .foryou-grid:not(.ct166-daily-grid){display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:1fr!important;gap:6px!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow:visible!important;align-items:stretch!important;padding:1px!important}
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot,
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot{box-sizing:border-box!important;display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;width:auto!important;min-width:0!important;max-width:none!important;height:100%!important;align-self:stretch!important}
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot>.discover-card,
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot>.discover-card{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important;overflow:hidden!important}
[data-discover] .foryou-grid .poster,[data-discover] .discover-carousel .poster{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}

/* All repeated media-card titles use one line + ellipsis. Their content can no longer make
   one card taller than its siblings. */
.card .card-body>b,
.ct171-top-card .card-body>b,
.ct169-related-card b,
.ct169-cast-card b,
.ct171-provider-card b{display:block!important;min-width:0!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.card .card-body>small,
.ct171-top-card .card-body>small{display:block!important;min-width:0!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.discover-card .card-body{box-sizing:border-box!important;height:42px!important;min-height:42px!important;max-height:42px!important;overflow:hidden!important}
.ct171-top-card .card-body{box-sizing:border-box!important;height:48px!important;min-height:48px!important;max-height:48px!important;overflow:hidden!important}
[data-discover] .ct169-card-actions{box-sizing:border-box!important;min-height:38px!important;height:38px!important;max-height:38px!important;align-items:stretch!important;overflow:hidden!important}
[data-discover] .ct169-card-actions>*{min-height:0!important;height:100%!important;max-height:100%!important;margin:0!important}
[data-discover] .ct235-swap{pointer-events:auto!important;touch-action:manipulation!important;width:auto!important;min-width:0!important;margin:0!important}
.ct235-swap-pulse{animation:ct235Swap .16s ease-out}
@keyframes ct235Swap{0%{opacity:.35;transform:translateX(8px) scale(.985)}100%{opacity:1;transform:none}}

/* Actual Top 10 rails. pan-y keeps page vertical scroll native; r235 owns horizontal MOVE. */
.ct171-provider-tabs,.ct171-top-row{display:flex!important;flex-flow:row nowrap!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;scroll-behavior:auto!important;scroll-snap-type:none!important;touch-action:pan-y!important;pointer-events:auto!important}
.ct171-provider-tabs>*,.ct171-top-row>*{flex:0 0 auto!important;touch-action:pan-y!important}
.ct171-provider-tabs *,.ct171-top-row *{touch-action:pan-y!important}
`;
document.getElementById(style235.id)?.remove();document.head.appendChild(style235);
requestAnimationFrame(()=>decorate235(document));
})();
