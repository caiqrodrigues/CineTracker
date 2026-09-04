/* Android 0.99.7.65 r237 — native Top10 rails + Watchlist Trocar from all live sources */
(() => {
'use strict';
if(window.__ctAndroidR237Loaded)return;
window.__ctAndroidR237Loaded=true;
window.__ctAndroidR237='watchlist-trocar-merged-native-top10';
window.__ctAndroidBundle='android-v0.99.7.65-r237-two-fixes-only';
window.__ctR237Swap='merge-ct166-ct186-watchlist-direct-slot';
window.__ctR237Top10='native-webview-horizontal-no-manual-touch';
window.__ctR237Cards='preserve-approved-equal-card-geometry';
window.__ctR237Scope='android-only-two-fixes-web-untouched';

const SWAP237='[data-ct237-swap]';
const RAIL237='.ct171-provider-tabs,.ct171-top-row';

function isDiscover237(){
  try{return String(route())==='discover'}catch{return String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover'}
}
function isForYou237(){
  if(!isDiscover237())return false;
  try{return String(discoverState?.tab||'foryou')==='foryou'}catch{return true}
}
function mediaId237(slot){
  const raw=String(slot?.querySelector?.('[data-media]')?.dataset?.media||'');
  return Number(raw.split(':')[1]||0);
}
function unique237(rows){
  const seen=new Set(),out=[];
  for(const x of Array.isArray(rows)?rows:[]){
    const id=Number(x?.id||x?.tmdb_id||0);
    if(!(id>0)||seen.has(id))continue;
    seen.add(id);out.push(x);
  }
  return out;
}
function liveData237(){
  const out=[];
  try{if(typeof ct166ForYouData==='object'&&ct166ForYouData)out.push(ct166ForYouData)}catch{}
  try{if(typeof ct186ForYouData==='object'&&ct186ForYouData&&!out.includes(ct186ForYouData))out.push(ct186ForYouData)}catch{}
  return out;
}
function pool237(key){
  const rows=[];
  for(const d of liveData237()){
    const fresh=[d?._ct166_fresh,d?._ct186_fresh].filter(Boolean);
    const watch=[d?._ct166_watchlist,d?._ct186_watchlist].filter(Boolean);
    const bags=key.startsWith('watchlist:')?watch:fresh;
    const kind=key==='fresh:series'||key==='watchlist:series'?'series':key==='fresh:anime'||key==='watchlist:anime'?'anime':'movie';
    for(const bag of bags)if(Array.isArray(bag?.[kind]))rows.push(...bag[kind]);
  }
  return unique237(rows);
}
window.__ctR237Pool=pool237;
function pick237(key,current){
  const rows=pool237(key);if(rows.length<2)return null;
  const excluded=[];
  if(key==='fresh:movie'){
    try{const daily=ct166Pick(pool237('daily:movie'),'daily:movie',[]);const id=Number(daily?.id||daily?.tmdb_id||0);if(id>0)excluded.push(id)}catch{}
  }
  for(let i=0;i<rows.length+2;i++){
    try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1}catch{return null}
    let next=null;try{next=ct166Pick(rows,key,excluded)}catch{}
    const id=Number(next?.id||next?.tmdb_id||0);
    if(id>0&&id!==Number(current||0))return next;
  }
  return rows.find(x=>Number(x?.id||x?.tmdb_id||0)!==Number(current||0)&&!excluded.includes(Number(x?.id||x?.tmdb_id||0)))||null;
}
function placeSwap237(slot){
  if(!slot)return;
  const swap=slot.querySelector?.(SWAP237);if(!swap)return;
  swap.classList?.add?.('ct166-swap','ct237-swap');
  const card=slot.querySelector?.('.discover-card,.card');if(!card)return;
  let actions=card.querySelector?.('.ct169-card-actions');
  if(!actions){actions=document.createElement('div');actions.className='ct169-card-actions';card.appendChild(actions)}
  const wl=card.querySelector?.('.discover-watch,[data-discover-watch],[data-ct224-watchlist],[data-ct226-watchlist]');
  if(wl&&wl.parentElement!==actions)actions.appendChild(wl);
  if(swap.parentElement!==actions)actions.appendChild(swap);
  slot.querySelector?.('.ct166-slot-head')?.classList?.add?.('ct169-clean-head');
}
function decorateSwap237(root=document){
  const slots=[];
  try{if(root?.matches?.('.ct166-slot,.foryou-slot'))slots.push(root)}catch{}
  try{slots.push(...(root?.querySelectorAll?.('.ct166-slot,.foryou-slot')||[]))}catch{}
  for(const s of slots)placeSwap237(s);
}
function swapNow237(button){
  const key=String(button?.dataset?.ct237Swap||''),slot=button?.closest?.('.ct166-slot,.foryou-slot');
  if(!key||!slot||typeof ct166Slot!=='function'||typeof ct166Pick!=='function')return false;
  const pool=pool237(key),next=pick237(key,mediaId237(slot));if(!next)return false;
  const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,pool.length);
  const fresh=box.firstElementChild;if(!fresh)return false;
  slot.replaceWith(fresh);fresh.classList?.add?.('ct237-swap-pulse');placeSwap237(fresh);
  try{decorate226(fresh)}catch{}
  requestAnimationFrame(()=>{try{ct169TuneForYou()}catch{};placeSwap237(fresh)});
  return true;
}
window.__ctR237SwapNow=swapNow237;
let lastSwapKey237='',lastSwapAt237=0;
function activateSwap237(e){
  if(!isForYou237())return;
  const b=e?.target?.closest?.(SWAP237);if(!b)return;
  const key=String(b.dataset?.ct237Swap||'');if(!key)return;
  const now=Date.now();
  if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  if(key===lastSwapKey237&&now-lastSwapAt237<650)return;
  if(swapNow237(b)){lastSwapKey237=key;lastSwapAt237=now}
}
/* Same event authority already reliable on physical Android taps: pointerup, with click fallback. */
window.addEventListener('pointerup',activateSwap237,{capture:true,passive:false});
window.addEventListener('click',activateSwap237,{capture:true,passive:false});

function visibleWidth237(r){
  const viewport=Number(window.visualViewport?.width||window.innerWidth||document.documentElement?.clientWidth||0);
  const rect=r?.getBoundingClientRect?.()||{left:0,width:0};
  const left=Math.max(0,Number(rect.left||0));
  let w=viewport>0?viewport-left-12:Number(rect.width||0);
  const p=r?.parentElement,pw=Number(p?.clientWidth||p?.getBoundingClientRect?.()?.width||0);
  if(pw>0)w=w>0?Math.min(w,pw):pw;
  return Math.max(180,Math.floor(w||320));
}
function setImp237(style,name,value){try{style?.setProperty?.(name,value,'important')}catch{try{style[name]=value}catch{}}}
function normalizeRail237(r){
  if(!r)return null;
  const w=visibleWidth237(r);
  setImp237(r.style,'box-sizing','border-box');setImp237(r.style,'display','flex');setImp237(r.style,'flex-flow','row nowrap');
  setImp237(r.style,'width',w+'px');setImp237(r.style,'max-width',w+'px');setImp237(r.style,'min-width','0');
  setImp237(r.style,'overflow-x','scroll');setImp237(r.style,'overflow-y','hidden');setImp237(r.style,'-webkit-overflow-scrolling','touch');
  setImp237(r.style,'overscroll-behavior-x','contain');setImp237(r.style,'scroll-behavior','auto');setImp237(r.style,'scroll-snap-type','none');
  setImp237(r.style,'touch-action','pan-x pan-y');setImp237(r.style,'pointer-events','auto');
  return r;
}
window.__ctR237NormalizeRail=normalizeRail237;
function scanRails237(root=document){
  const rails=[];try{if(root?.matches?.(RAIL237))rails.push(root)}catch{};try{rails.push(...(root?.querySelectorAll?.(RAIL237)||[]))}catch{}
  for(const r of rails)normalizeRail237(r);
}
try{
  const base=paintDiscover;paintDiscover=function(...args){const out=base.apply(this,args);decorateSwap237(document);scanRails237(document);requestAnimationFrame(()=>{decorateSwap237(document);scanRails237(document)});return out};
}catch{}
let frame237=0;
try{new MutationObserver(ms=>{if(frame237)return;frame237=requestAnimationFrame(()=>{frame237=0;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1){decorateSwap237(n);scanRails237(n)}decorateSwap237(document);scanRails237(document)})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('resize',()=>requestAnimationFrame(()=>scanRails237(document)),{passive:true});

const style237=document.createElement('style');style237.id='ct-android-099765-two-fixes';style237.textContent=`
[data-discover] .foryou-grid:not(.ct166-daily-grid){display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:1fr!important;gap:6px!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow:visible!important;align-items:stretch!important;padding:1px!important}
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot,[data-discover] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot{box-sizing:border-box!important;display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;width:auto!important;min-width:0!important;max-width:none!important;height:100%!important;align-self:stretch!important}
[data-discover] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot>.discover-card,[data-discover] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot>.discover-card{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important;overflow:hidden!important}
[data-discover] .foryou-grid .poster,[data-discover] .discover-carousel .poster{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}
.card .card-body>b,.ct171-top-card .card-body>b,.ct169-related-card b,.ct169-cast-card b,.ct171-provider-card b{display:block!important;min-width:0!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.card .card-body>small,.ct171-top-card .card-body>small{display:block!important;min-width:0!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.discover-card .card-body{box-sizing:border-box!important;height:42px!important;min-height:42px!important;max-height:42px!important;overflow:hidden!important}.ct171-top-card .card-body{box-sizing:border-box!important;height:48px!important;min-height:48px!important;max-height:48px!important;overflow:hidden!important}
[data-discover] .ct169-card-actions{box-sizing:border-box!important;min-height:38px!important;height:38px!important;max-height:38px!important;align-items:stretch!important;overflow:hidden!important}[data-discover] .ct169-card-actions>*{min-height:0!important;height:100%!important;max-height:100%!important;margin:0!important}
[data-discover] .ct237-swap{pointer-events:auto!important;touch-action:manipulation!important;width:auto!important;min-width:0!important;margin:0!important}.ct237-swap-pulse{animation:ct237Swap .16s ease-out}@keyframes ct237Swap{0%{opacity:.35;transform:translateX(8px) scale(.985)}100%{opacity:1;transform:none}}
[data-discover] .ct171-top10-shell,[data-discover] [data-ct226-top-content],[data-discover] .ct171-top-section{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important}[data-discover] .ct171-top-section{overflow:hidden!important}
.ct171-provider-tabs,.ct171-top-row{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;max-width:100%!important;min-width:0!important;overflow-x:scroll!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;scroll-behavior:auto!important;scroll-snap-type:none!important;touch-action:pan-x pan-y!important;pointer-events:auto!important}
.ct171-provider-tabs>*,.ct171-top-row>*{flex:0 0 auto!important;min-width:0;touch-action:pan-x pan-y!important}.ct171-provider-tabs *,.ct171-top-row *{touch-action:pan-x pan-y!important}
`;
document.getElementById(style237.id)?.remove();document.head.appendChild(style237);
requestAnimationFrame(()=>{decorateSwap237(document);scanRails237(document)});
})();
