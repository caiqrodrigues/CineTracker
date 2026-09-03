/* Android 0.99.7.55 r227 — deterministic Trocar + native-feeling Top 10 horizontal swipe */
(() => {
'use strict';
if(window.__ctAndroidR227Loaded)return;
window.__ctAndroidR227Loaded=true;
window.__ctAndroidR227='discover-swap-deterministic-top10-horizontal-swipe';
window.__ctAndroidBundle='android-v0.99.7.55-r227-discover-swap-top10-swipe';
window.__ctR227Swap='trocar-direct-next-different-item-no-old-index-handler';
window.__ctR227Top10='r226-authority-plus-horizontal-drag-cards';
window.__ctR227Scope='android-discover-only-web-untouched';

const isDiscover227=()=>{try{return String(route?.()||'')==='discover'}catch{return String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover'}};
const selected227=()=>{try{return String(discoverState?.tab||'foryou')}catch{return'foryou'}};
const mediaId227=el=>{const raw=String(el?.querySelector?.('[data-media]')?.dataset?.media||'');return Number(raw.split(':')[1]||0)};

function pool227(key){
  const d=ct166ForYouData||{},fresh=d._ct166_fresh||d._ct186_fresh||{movie:[],series:[],anime:[]},wl=d._ct166_watchlist||d._ct186_watchlist||{movie:[],series:[],anime:[]};
  if(key==='daily:movie'||key==='fresh:movie')return fresh.movie||[];
  if(key==='fresh:series')return fresh.series||[];
  if(key==='fresh:anime')return fresh.anime||[];
  if(key==='watchlist:movie')return wl.movie||[];
  if(key==='watchlist:series')return wl.series||[];
  if(key==='watchlist:anime')return wl.anime||[];
  return [];
}
function dailyId227(){
  const b=document.querySelector('[data-ct227-swap="daily:movie"]'),slot=b?.closest('.ct166-slot,.foryou-slot');
  return mediaId227(slot);
}
function usable227(key){
  const all=pool227(key).filter(x=>Number(x?.id||0)>0),daily=key==='fresh:movie'?dailyId227():0,seen=new Set();
  return all.filter(x=>{const id=Number(x.id);if(id===daily||seen.has(id))return false;seen.add(id);return true});
}
function decorateSwap227(root=document){
  if(!isDiscover227())return;
  const nodes=[];
  try{if(root?.matches?.('[data-ct166-swap],[data-ct224-swap],[data-ct225-swap],[data-ct226-swap],[data-ct227-swap]'))nodes.push(root)}catch{}
  try{nodes.push(...(root?.querySelectorAll?.('[data-ct166-swap],[data-ct224-swap],[data-ct225-swap],[data-ct226-swap],[data-ct227-swap]')||[]))}catch{}
  for(const b of nodes){
    const key=String(b.dataset.ct227Swap||b.dataset.ct226Swap||b.dataset.ct225Swap||b.dataset.ct224Swap||b.dataset.ct166Swap||'');if(!key)continue;
    for(const a of ['data-ct166-swap','data-ct224-swap','data-ct225-swap','data-ct226-swap'])b.removeAttribute(a);
    b.dataset.ct227Swap=key;b.classList.add('ct227-swap');b.disabled=false;
  }
}
function swap227(button){
  const key=String(button.dataset.ct227Swap||''),slot=button.closest('.ct166-slot,.foryou-slot');if(!key||!slot)return false;
  const pool=usable227(key),current=mediaId227(slot);if(pool.length<2)return false;
  let idx=pool.findIndex(x=>Number(x.id)===current);if(idx<0)idx=0;
  let next=null,nextIdx=idx;
  for(let step=1;step<=pool.length;step++){const ni=(idx+step)%pool.length,cand=pool[ni];if(Number(cand?.id||0)!==current){next=cand;nextIdx=ni;break}}
  if(!next)return false;
  try{ct166SwapIndex[key]=nextIdx}catch{}
  const label=slot.querySelector('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const box=document.createElement('div');box.innerHTML=ct166Slot(label,next,key,pool.length);const fresh=box.firstElementChild;if(!fresh)return false;
  slot.replaceWith(fresh);fresh.classList.add('ct227-swap-pulse');decorateSwap227(fresh);return true;
}

function enableTopSwipe227(root=document){
  if(!isDiscover227()||selected227()!=='top10')return;
  const rows=[];try{if(root?.matches?.('.ct171-top-row'))rows.push(root)}catch{};try{rows.push(...(root?.querySelectorAll?.('.ct171-top-row')||[]))}catch{}
  for(const row of rows){
    if(row.getAttribute('data-ct227-swipe')==='1')continue;row.setAttribute('data-ct227-swipe','1');
    let state=null;
    row.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.touches[0];state={x:t.clientX,y:t.clientY,left:row.scrollLeft,horizontal:false}}, {passive:true});
    row.addEventListener('touchmove',e=>{if(!state||e.touches.length!==1)return;const t=e.touches[0],dx=t.clientX-state.x,dy=t.clientY-state.y;if(!state.horizontal&&Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)*1.08)state.horizontal=true;if(!state.horizontal)return;e.preventDefault();row.scrollLeft=state.left-dx}, {passive:false});
    row.addEventListener('touchend',()=>{state=null},{passive:true});row.addEventListener('touchcancel',()=>{state=null},{passive:true});
  }
}
function decorate227(root=document){decorateSwap227(root);enableTopSwipe227(root)}

/* r223's stale Top10 document capture is neutralized by prepare-v099755 before this runtime is injected. The normal delegated click now reaches r226, then r227 decorates the result. */
const selectBase227=typeof window.ct214SelectDiscoverTab==='function'?window.ct214SelectDiscoverTab:null;
if(selectBase227){window.ct214SelectDiscoverTab=async function(value,opt){const out=await selectBase227.call(this,value,opt);requestAnimationFrame(()=>decorate227());return out}}

/* Only r227 owns Trocar after prepare neutralizes the previous swap capture handlers. */
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct227-swap]');if(!b||!isDiscover227())return;e.preventDefault();e.stopImmediatePropagation();swap227(b)},true);

const paintBase227=paintDiscover;try{paintDiscover=function(...args){const out=paintBase227.apply(this,args);decorate227();requestAnimationFrame(()=>decorate227());return out}}catch{}
let frame227=0;try{new MutationObserver(ms=>{if(frame227)return;frame227=requestAnimationFrame(()=>{frame227=0;if(!isDiscover227())return;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)decorate227(n);decorate227()})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}

const style=document.createElement('style');style.id='ct-android-099755';style.textContent=`
[data-page="discover"] .ct227-swap-pulse{animation:ct227Swap .18s ease-out}
[data-page="discover"] .ct171-top-row{display:flex!important;flex-wrap:nowrap!important;overflow-x:scroll!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;scroll-snap-type:none!important;touch-action:pan-y!important;pointer-events:auto!important;cursor:grab!important;padding-bottom:8px!important}
[data-page="discover"] .ct171-top-row>.ct171-top-card{flex:0 0 min(42vw,160px)!important;width:min(42vw,160px)!important;min-width:min(42vw,160px)!important;max-width:160px!important;touch-action:pan-y!important}
[data-page="discover"] .ct171-top-row>.ct171-top-card button{touch-action:pan-y!important}
@keyframes ct227Swap{0%{opacity:.28;transform:translateX(12px) scale(.97)}65%{opacity:.95;transform:translateX(-2px) scale(1.01)}100%{opacity:1;transform:none}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);requestAnimationFrame(()=>decorate227());
})();
