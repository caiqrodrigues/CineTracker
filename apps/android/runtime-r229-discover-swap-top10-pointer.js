/* Android 0.99.7.57 r229 — direct Trocar authority + pointer-captured Top 10 horizontal rail */
(() => {
'use strict';
if(window.__ctAndroidR229Loaded)return;
window.__ctAndroidR229Loaded=true;
window.__ctAndroidR229='discover-swap-direct-target-top10-pointer-capture';
window.__ctAndroidBundle='android-v0.99.7.57-r229-discover-swap-top10-pointer';
window.__ctR229Swap='direct-button-listeners-official-index-plus-fallback';
window.__ctR229Top10='pointer-capture-horizontal-scrollleft';
window.__ctR229Scope='android-only-web-r203-untouched';
window.__ctR229Stale='disable-r227-r228-stale-gesture-authorities';

const isDiscover229=()=>{try{return String(route?.()||'')==='discover'}catch{return String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover'}};
function mediaId229(el){
  const host=el?.matches?.('[data-media]')?el:el?.querySelector?.('[data-media]');
  const raw=String(host?.dataset?.media||'');
  return Number(raw.split(':')[1]||0);
}
function sources229(){
  const d=(typeof ct166ForYouData==='object'&&ct166ForYouData)||{};
  return {
    data:d,
    fresh:d._ct166_fresh||d._ct186_fresh||{movie:[],series:[],anime:[]},
    watch:d._ct166_watchlist||d._ct186_watchlist||{movie:[],series:[],anime:[]}
  };
}
function rawPool229(key){
  const {fresh,watch}=sources229();
  if(key==='daily:movie'||key==='fresh:movie')return fresh.movie||[];
  if(key==='fresh:series')return fresh.series||[];
  if(key==='fresh:anime')return fresh.anime||[];
  if(key==='watchlist:movie')return watch.movie||[];
  if(key==='watchlist:series')return watch.series||[];
  if(key==='watchlist:anime')return watch.anime||[];
  return [];
}
function unique229(list){
  const seen=new Set();
  return (Array.isArray(list)?list:[]).filter(x=>{
    const id=Number(x?.id||0);
    if(!(id>0)||seen.has(id))return false;
    seen.add(id);return true;
  });
}
function dailyId229(){
  const q='[data-ct229-swap="daily:movie"],[data-ct228-swap="daily:movie"],[data-ct227-swap="daily:movie"],[data-ct166-swap="daily:movie"]';
  const b=document.querySelector(q),id=mediaId229(b?.closest?.('.ct166-slot,.foryou-slot'));
  if(id>0)return id;
  const d=sources229().data;
  return Number(d?.daily?.id||d?.movie?.id||0);
}
function excluded229(key){return key==='fresh:movie'?dailyId229():0}
function pickNext229(all,current,excluded=0){
  const list=unique229(all).filter(x=>Number(x.id)!==Number(excluded||0));
  if(!list.length)return null;
  const at=list.findIndex(x=>Number(x.id)===Number(current||0));
  if(at<0)return list.find(x=>Number(x.id)!==Number(current||0))||null;
  for(let step=1;step<=list.length;step++){
    const cand=list[(at+step)%list.length];
    if(Number(cand?.id||0)!==Number(current||0))return cand;
  }
  return null;
}
window.__ctR229PickNext=pickNext229;

function officialNext229(key,current){
  const pool=unique229(rawPool229(key)),excluded=excluded229(key),skip=excluded?[excluded]:[];
  if(!pool.length)return null;
  try{
    if(typeof ct166Pick==='function'&&typeof ct166SwapIndex==='object'&&ct166SwapIndex){
      const original=Number(ct166SwapIndex[key]||0);
      for(let step=1;step<=pool.length+1;step++){
        ct166SwapIndex[key]=original+step;
        const cand=ct166Pick(pool,key,skip);
        if(Number(cand?.id||0)>0&&Number(cand.id)!==Number(current||0)&&Number(cand.id)!==Number(excluded||0))return cand;
      }
      ct166SwapIndex[key]=original;
    }
  }catch{}
  return pickNext229(pool,current,excluded);
}
window.__ctR229OfficialNext=officialNext229;

function swapKey229(b){
  return String(b?.dataset?.ct229Swap||b?.dataset?.ct228Swap||b?.dataset?.ct227Swap||b?.dataset?.ct226Swap||b?.dataset?.ct225Swap||b?.dataset?.ct224Swap||b?.dataset?.ct166Swap||'');
}
let lastSwap229=0;
function swap229(button){
  if(!button?.isConnected||!isDiscover229())return false;
  const key=String(button.dataset.ct229Swap||''),slot=button.closest('.ct166-slot,.foryou-slot');
  if(!key||!slot)return false;
  const current=mediaId229(slot),next=officialNext229(key,current);
  if(!next||Number(next.id||0)===Number(current||0))return false;
  if(typeof ct166Slot!=='function')return false;
  const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const box=document.createElement('div');
  box.innerHTML=ct166Slot(label,next,key,unique229(rawPool229(key)).length);
  const fresh=box.firstElementChild;
  if(!fresh)return false;
  slot.replaceWith(fresh);
  fresh.classList.add('ct229-swap-pulse');
  decorateSwap229(fresh);
  return mediaId229(fresh)===Number(next.id||0)||Number(next.id||0)>0;
}
function ownSwap229(e){
  const b=e?.currentTarget;
  if(!b?.dataset?.ct229Swap||!isDiscover229())return;
  if(e.type==='pointerup'&&e.pointerType&& !['touch','pen','mouse'].includes(e.pointerType))return;
  e.preventDefault?.();e.stopPropagation?.();e.stopImmediatePropagation?.();
  const now=Date.now();
  if(now-lastSwap229<420)return;
  if(swap229(b))lastSwap229=now;
}
function bindSwap229(button){
  if(!button||button.dataset?.ct229Bound==='1')return button;
  const key=swapKey229(button);if(!key)return button;
  const clone=button.cloneNode(true);
  for(const a of ['data-ct166-swap','data-ct224-swap','data-ct225-swap','data-ct226-swap','data-ct227-swap','data-ct228-swap','data-ct228-bound','data-ct229-bound'])clone.removeAttribute(a);
  clone.dataset.ct229Swap=key;
  clone.dataset.ct229Bound='1';
  clone.classList.add('ct229-swap');
  clone.disabled=false;
  clone.addEventListener('pointerup',ownSwap229,{capture:true,passive:false});
  clone.addEventListener('touchend',ownSwap229,{capture:true,passive:false});
  clone.addEventListener('click',ownSwap229,{capture:true,passive:false});
  button.replaceWith(clone);
  return clone;
}
function decorateSwap229(root=document){
  if(!isDiscover229())return;
  const selector='[data-ct166-swap],[data-ct224-swap],[data-ct225-swap],[data-ct226-swap],[data-ct227-swap],[data-ct228-swap],[data-ct229-swap]';
  const nodes=[];
  try{if(root?.matches?.(selector))nodes.push(root)}catch{}
  try{nodes.push(...(root?.querySelectorAll?.(selector)||[]))}catch{}
  for(const b of nodes)bindSwap229(b);
}

function clamp229(row,value){
  const max=Math.max(0,Number(row?.scrollWidth||0)-Number(row?.clientWidth||0));
  return Math.max(0,Math.min(max,Number(value||0)));
}
function applyDrag229(row,left,dx){
  if(!row)return 0;
  row.scrollLeft=clamp229(row,Number(left||0)-Number(dx||0));
  return row.scrollLeft;
}
window.__ctR229ApplyDrag=applyDrag229;

let suppressTopClick229=0;
function bindTop229(row){
  if(!row||row.dataset?.ct229Swipe==='1')return;
  row.dataset.ct229Swipe='1';
  row.classList.add('ct229-top-row');
  let s=null;
  const end=()=>{
    if(!s)return;
    try{if(row.hasPointerCapture?.(s.id))row.releasePointerCapture(s.id)}catch{}
    if(s.axis==='x'&&s.moved)suppressTopClick229=Date.now()+500;
    s=null;
  };
  row.addEventListener('pointerdown',e=>{
    if(!isDiscover229()||e.isPrimary===false)return;
    if(e.pointerType&& !['touch','pen','mouse'].includes(e.pointerType))return;
    s={id:e.pointerId,x:e.clientX,y:e.clientY,left:row.scrollLeft,axis:'',moved:false};
    try{row.setPointerCapture?.(e.pointerId)}catch{}
  },{capture:true,passive:true});
  row.addEventListener('pointermove',e=>{
    if(!s||e.pointerId!==s.id)return;
    const dx=e.clientX-s.x,dy=e.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
    if(!s.axis){
      if(ax<5&&ay<5)return;
      s.axis=ax>ay*1.03?'x':'y';
    }
    if(s.axis!=='x')return;
    e.preventDefault();e.stopPropagation();
    s.moved=s.moved||ax>7;
    applyDrag229(row,s.left,dx);
  },{capture:true,passive:false});
  row.addEventListener('pointerup',end,{capture:true,passive:true});
  row.addEventListener('pointercancel',end,{capture:true,passive:true});
  row.addEventListener('lostpointercapture',end,{capture:true,passive:true});
  row.addEventListener('click',e=>{
    if(Date.now()<suppressTopClick229){e.preventDefault();e.stopImmediatePropagation()}
  },true);
}
function decorateTop229(root=document){
  if(!isDiscover229())return;
  const rows=[];
  try{if(root?.matches?.('.ct171-top-row'))rows.push(root)}catch{}
  try{rows.push(...(root?.querySelectorAll?.('.ct171-top-row')||[]))}catch{}
  for(const row of rows)bindTop229(row);
}
function decorate229(root=document){decorateSwap229(root);decorateTop229(root)}

const paintBase229=typeof paintDiscover==='function'?paintDiscover:null;
if(paintBase229){try{paintDiscover=function(...args){const out=paintBase229.apply(this,args);decorate229();requestAnimationFrame(()=>decorate229());return out}}catch{}}
let frame229=0;
try{new MutationObserver(ms=>{
  if(frame229)return;
  frame229=requestAnimationFrame(()=>{
    frame229=0;if(!isDiscover229())return;
    for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)decorate229(n);
    decorate229();
  });
}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}

const style=document.createElement('style');
style.id='ct-android-099757';
style.textContent=`
.ct229-swap-pulse{animation:ct229Swap .2s ease-out}
.ct171-top-row{
  box-sizing:border-box!important;
  display:flex!important;
  flex-flow:row nowrap!important;
  gap:8px!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  overflow-x:scroll!important;
  overflow-y:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior-x:contain!important;
  scroll-behavior:auto!important;
  scroll-snap-type:none!important;
  touch-action:pan-y!important;
  pointer-events:auto!important;
  padding-bottom:8px!important;
  scrollbar-width:none!important;
}
.ct171-top-row::-webkit-scrollbar{display:none!important}
.ct171-top-row>.ct171-top-card{
  box-sizing:border-box!important;
  flex:0 0 min(42vw,160px)!important;
  width:min(42vw,160px)!important;
  min-width:min(42vw,160px)!important;
  max-width:160px!important;
  touch-action:pan-y!important;
}
.ct171-top-row>.ct171-top-card button,
.ct171-top-row>.ct171-top-card [data-media]{touch-action:pan-y!important}
@keyframes ct229Swap{0%{opacity:.28;transform:translateX(12px) scale(.97)}65%{opacity:1;transform:translateX(-2px) scale(1.01)}100%{opacity:1;transform:none}}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);
requestAnimationFrame(()=>decorate229());
})();
