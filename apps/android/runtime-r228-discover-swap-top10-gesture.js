/* Android 0.99.7.56 r228 — direct-owned Trocar + unconditional Top 10 touch rail */
(() => {
'use strict';
if(window.__ctAndroidR228Loaded)return;
window.__ctAndroidR228Loaded=true;
window.__ctAndroidR228='discover-swap-direct-owned-top10-row-gesture';
window.__ctAndroidBundle='android-v0.99.7.56-r228-discover-swap-top10-gesture';
window.__ctR228Swap='cloned-direct-button-one-alternative-valid';
window.__ctR228Top10='bind-any-visible-top-row-no-selected-state-gate';
window.__ctR228Scope='android-discover-only-web-untouched';
window.__ctR228Top10SwipeMarker='data-ct228-swipe';

const isDiscover228=()=>{try{return String(route?.()||'')==='discover'}catch{return String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover'}};
const mediaId228=el=>{const raw=String(el?.querySelector?.('[data-media]')?.dataset?.media||'');return Number(raw.split(':')[1]||0)};

function pools228(){
  const d=(typeof ct166ForYouData==='object'&&ct166ForYouData)||{};
  return {
    fresh:d._ct166_fresh||d._ct186_fresh||{movie:[],series:[],anime:[]},
    watch:d._ct166_watchlist||d._ct186_watchlist||{movie:[],series:[],anime:[]}
  };
}
function rawPool228(key){
  const {fresh,watch}=pools228();
  if(key==='daily:movie'||key==='fresh:movie')return fresh.movie||[];
  if(key==='fresh:series')return fresh.series||[];
  if(key==='fresh:anime')return fresh.anime||[];
  if(key==='watchlist:movie')return watch.movie||[];
  if(key==='watchlist:series')return watch.series||[];
  if(key==='watchlist:anime')return watch.anime||[];
  return [];
}
function unique228(list){
  const seen=new Set();
  return (Array.isArray(list)?list:[]).filter(x=>{const id=Number(x?.id||0);if(!id||seen.has(id))return false;seen.add(id);return true});
}
function pickNext228(all,current,excluded=0){
  const list=unique228(all).filter(x=>Number(x.id)!==Number(excluded||0));
  if(!list.length)return null;
  const at=list.findIndex(x=>Number(x.id)===Number(current||0));
  if(at<0)return list.find(x=>Number(x.id)!==Number(current||0))||null;
  for(let step=1;step<=list.length;step++){
    const cand=list[(at+step)%list.length];
    if(Number(cand?.id||0)!==Number(current||0))return cand;
  }
  return null;
}
window.__ctR228PickNext=pickNext228;

function dailyId228(){
  const b=document.querySelector('[data-ct228-swap="daily:movie"],[data-ct227-swap="daily:movie"],[data-ct166-swap="daily:movie"]');
  return mediaId228(b?.closest?.('.ct166-slot,.foryou-slot'));
}
function nextFor228(key,current){
  const excluded=key==='fresh:movie'?dailyId228():0;
  return pickNext228(rawPool228(key),current,excluded);
}

function swapKey228(b){return String(b?.dataset?.ct228Swap||b?.dataset?.ct227Swap||b?.dataset?.ct226Swap||b?.dataset?.ct225Swap||b?.dataset?.ct224Swap||b?.dataset?.ct166Swap||'')}
function bindSwapButton228(button){
  if(!button||button.dataset?.ct228Bound==='1')return button;
  const key=swapKey228(button);if(!key)return button;
  const clone=button.cloneNode(true);
  for(const a of ['data-ct166-swap','data-ct224-swap','data-ct225-swap','data-ct226-swap','data-ct227-swap','data-ct228-bound'])clone.removeAttribute(a);
  clone.dataset.ct228Swap=key;
  clone.dataset.ct228Bound='1';
  clone.classList.add('ct228-swap');
  clone.disabled=false;
  button.replaceWith(clone);
  return clone;
}
function decorateSwap228(root=document){
  if(!isDiscover228())return;
  const selector='[data-ct166-swap],[data-ct224-swap],[data-ct225-swap],[data-ct226-swap],[data-ct227-swap],[data-ct228-swap]';
  const nodes=[];
  try{if(root?.matches?.(selector))nodes.push(root)}catch{}
  try{nodes.push(...(root?.querySelectorAll?.(selector)||[]))}catch{}
  for(const b of nodes)bindSwapButton228(b);
}
function swap228(button){
  const key=String(button?.dataset?.ct228Swap||''),slot=button?.closest?.('.ct166-slot,.foryou-slot');
  if(!key||!slot)return false;
  const current=mediaId228(slot),next=nextFor228(key,current);
  if(!next)return false;
  if(typeof ct166Slot!=='function')return false;
  const label=slot.querySelector?.('.ct166-slot-head small')?.textContent?.trim()||'';
  const box=document.createElement('div');
  box.innerHTML=ct166Slot(label,next,key,unique228(rawPool228(key)).length);
  const fresh=box.firstElementChild;if(!fresh)return false;
  slot.replaceWith(fresh);
  fresh.classList.add('ct228-swap-pulse');
  decorateSwap228(fresh);
  return true;
}

let suppressSwapClick228=0;
function swapTarget228(e){return e?.target?.closest?.('[data-ct228-swap]')||null}
function ownSwap228(e,fromPointer=false){
  const b=swapTarget228(e);if(!b||!isDiscover228())return;
  if(fromPointer&&e.pointerType&&e.pointerType!=='touch'&&e.pointerType!=='pen')return;
  e.preventDefault?.();e.stopImmediatePropagation?.();
  if(!fromPointer&&Date.now()<suppressSwapClick228)return;
  const changed=swap228(b);
  if(changed)suppressSwapClick228=Date.now()+650;
}
document.addEventListener('pointerup',e=>ownSwap228(e,true),true);
document.addEventListener('click',e=>ownSwap228(e,false),true);

function decorateTop228(root=document){
  if(!isDiscover228())return;
  const rows=[];
  try{if(root?.matches?.('.ct171-top-row'))rows.push(root)}catch{}
  try{rows.push(...(root?.querySelectorAll?.('.ct171-top-row')||[]))}catch{}
  for(const row of rows){row.dataset.ct228Swipe='1';row.classList.add('ct228-top-row')}
}

let touchState228=null;
function topRowFrom228(e){return e?.target?.closest?.('.ct171-top-row')||null}
document.addEventListener('touchstart',e=>{
  if(!isDiscover228()||e.touches?.length!==1)return;
  const row=topRowFrom228(e);if(!row)return;
  const t=e.touches[0];
  touchState228={row,id:t.identifier,x:t.clientX,y:t.clientY,left:row.scrollLeft,axis:''};
},{capture:true,passive:true});
document.addEventListener('touchmove',e=>{
  const s=touchState228;if(!s)return;
  const t=Array.from(e.touches||[]).find(x=>x.identifier===s.id);if(!t)return;
  const dx=t.clientX-s.x,dy=t.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
  if(!s.axis){if(ax<6&&ay<6)return;s.axis=ax>ay*1.04?'x':'y'}
  if(s.axis!=='x')return;
  e.preventDefault();e.stopImmediatePropagation();
  s.row.scrollLeft=s.left-dx;
},{capture:true,passive:false});
function endTopTouch228(e){
  if(!touchState228)return;
  const ended=Array.from(e.changedTouches||[]).some(x=>x.identifier===touchState228.id);
  if(ended)touchState228=null;
}
document.addEventListener('touchend',endTopTouch228,{capture:true,passive:true});
document.addEventListener('touchcancel',()=>{touchState228=null},{capture:true,passive:true});

function decorate228(root=document){decorateSwap228(root);decorateTop228(root)}
const paintBase228=typeof paintDiscover==='function'?paintDiscover:null;
if(paintBase228){try{paintDiscover=function(...args){const out=paintBase228.apply(this,args);decorate228();requestAnimationFrame(()=>decorate228());return out}}catch{}}
let frame228=0;
try{new MutationObserver(ms=>{if(frame228)return;frame228=requestAnimationFrame(()=>{frame228=0;if(!isDiscover228())return;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)decorate228(n);decorate228()})}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}

const style=document.createElement('style');style.id='ct-android-099756';style.textContent=`
.ct228-swap-pulse{animation:ct228Swap .18s ease-out}
.ct171-top-row{display:flex!important;flex-flow:row nowrap!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;scroll-snap-type:none!important;touch-action:pan-y!important;pointer-events:auto!important;padding-bottom:8px!important;scrollbar-width:none!important}
.ct171-top-row::-webkit-scrollbar{display:none!important}
.ct171-top-row>.ct171-top-card{flex:0 0 44vw!important;width:44vw!important;min-width:44vw!important;max-width:164px!important;touch-action:pan-y!important}
.ct171-top-row>.ct171-top-card button,.ct171-top-row>.ct171-top-card [data-media]{touch-action:pan-y!important}
@keyframes ct228Swap{0%{opacity:.3;transform:translateX(10px) scale(.98)}70%{opacity:1;transform:translateX(-2px) scale(1.01)}100%{opacity:1;transform:none}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
requestAnimationFrame(()=>decorate228());
})();
