/* Android 0.99.7.59 r231 — clean direct Trocar + isolated Top 10 controls, branching from r226/.54 */
(() => {
'use strict';
if(window.__ctAndroidR231Loaded)return;
window.__ctAndroidR231Loaded=true;
window.__ctAndroidR231='discover-clean-direct-actions-from-r226';
window.__ctAndroidBundle='android-v0.99.7.59-r231-clean-discover-actions';
window.__ctR231Base='branch-from-r226-no-r227-r230';
window.__ctR231Swap='private-button-direct-slot-replace-single-authority';
window.__ctR231Top10='isolated-row-touch-pointer-drag-with-arrow-fallback';
window.__ctR231Scope='android-only-web-r203-untouched';
window.__ctR231RootCause='legacy-swap-paint-chain-and-android-webview-gesture-unreliability';

const route231=()=>{try{return String(route?.()||'')}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const isDiscover231=()=>route231()==='discover'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover';
const id231=x=>Number(x?.id||x?.tmdb_id||0)||0;
function mediaId231(el){const host=el?.matches?.('[data-media]')?el:el?.querySelector?.('[data-media]');return Number(String(host?.dataset?.media||'').split(':')[1]||0)||0}
function unique231(list){const seen=new Set();return (Array.isArray(list)?list:[]).filter(x=>{const id=id231(x);if(!id||seen.has(id))return false;seen.add(id);return true})}
function pools231(){
  const d=(typeof ct166ForYouData==='object'&&ct166ForYouData)||{};
  return {data:d,fresh:d._ct186_fresh||d._ct166_fresh||{movie:[],series:[],anime:[]},watch:d._ct186_watchlist||d._ct166_watchlist||{movie:[],series:[],anime:[]}};
}
function rawPool231(key){
  const {fresh,watch}=pools231();
  if(key==='daily:movie'||key==='fresh:movie')return unique231(fresh.movie);
  if(key==='fresh:series')return unique231(fresh.series);
  if(key==='fresh:anime')return unique231(fresh.anime);
  if(key==='watchlist:movie')return unique231(watch.movie);
  if(key==='watchlist:series')return unique231(watch.series);
  if(key==='watchlist:anime')return unique231(watch.anime);
  return [];
}
function dailyId231(){
  const slot=document.querySelector('.ct166-daily-grid .ct166-slot,.ct166-daily-grid .foryou-slot');
  const direct=mediaId231(slot);if(direct>0)return direct;
  const d=pools231().data;return id231(d?.daily)||id231(d?.movie)||0;
}
function usable231(key){let rows=rawPool231(key);if(key==='fresh:movie'){const daily=dailyId231();if(daily)rows=rows.filter(x=>id231(x)!==daily)}return rows}
function pickNext231(rows,current){
  const list=unique231(rows);if(!list.length)return {next:null,index:-1};
  const currentId=Number(current||0),at=list.findIndex(x=>id231(x)===currentId);
  const start=at>=0?at:-1;
  for(let step=1;step<=list.length;step++){
    const index=(start+step+list.length)%list.length,next=list[index];
    if(id231(next)!==currentId)return {next,index};
  }
  return {next:null,index:-1};
}
window.__ctR231PickNext=pickNext231;

function swap231(button){
  if(!button?.isConnected||!isDiscover231())return false;
  const key=String(button.dataset?.ct231Swap||''),slot=button.closest?.('.ct166-slot,.foryou-slot');
  if(!key||!slot||typeof ct166Slot!=='function')return false;
  const rows=usable231(key),current=mediaId231(slot),picked=pickNext231(rows,current);
  if(!picked.next||id231(picked.next)===current)return false;
  try{ct166SwapIndex[key]=picked.index}catch{}
  const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const box=document.createElement('div');box.innerHTML=ct166Slot(label,picked.next,key,rows.length);
  const fresh=box.firstElementChild;if(!fresh)return false;
  slot.replaceWith(fresh);fresh.classList?.add('ct231-swap-pulse');bindSwap231(fresh);
  return mediaId231(fresh)!==current;
}
window.__ctR231Swap=swap231;

let lastSwapAt231=0;
function ownSwap231(e){
  const b=e?.currentTarget;if(!b?.dataset?.ct231Swap||!isDiscover231())return;
  if(e.type==='pointerup'&&e.pointerType&& !['touch','pen','mouse'].includes(e.pointerType))return;
  e.preventDefault?.();e.stopPropagation?.();e.stopImmediatePropagation?.();
  const now=Date.now();if(now-lastSwapAt231<520)return;
  if(swap231(b))lastSwapAt231=now;
}
function bindSwapButton231(button){
  if(!button||button.dataset?.ct231Bound==='1'||!button.dataset?.ct231Swap)return;
  button.dataset.ct231Bound='1';button.disabled=false;
  button.addEventListener('pointerup',ownSwap231,{capture:true,passive:false});
  button.addEventListener('touchend',ownSwap231,{capture:true,passive:false});
  button.addEventListener('click',ownSwap231,{capture:true,passive:false});
}
function bindSwap231(root=document){
  const nodes=[];try{if(root?.matches?.('[data-ct231-swap]'))nodes.push(root)}catch{}try{nodes.push(...(root?.querySelectorAll?.('[data-ct231-swap]')||[]))}catch{}
  for(const b of nodes)bindSwapButton231(b);
}

function clamp231(row,value){const max=Math.max(0,Number(row?.scrollWidth||0)-Number(row?.clientWidth||0));return Math.max(0,Math.min(max,Number(value||0)))}
function dragTo231(row,left,dx){if(!row)return 0;row.scrollLeft=clamp231(row,Number(left||0)-Number(dx||0));return Number(row.scrollLeft||0)}
function nudge231(row,dir){if(!row)return 0;const step=Math.max(150,Math.round(Number(row.clientWidth||0)*.78));row.scrollLeft=clamp231(row,Number(row.scrollLeft||0)+(Number(dir||1)<0?-step:step));return Number(row.scrollLeft||0)}
window.__ctR231Clamp=clamp231;window.__ctR231DragTo=dragTo231;window.__ctR231Nudge=nudge231;

let suppressTopClickUntil231=0,suppressTopRow231=null;
function bindTopRow231(row){
  if(!row||row.dataset?.ct231TopBound==='1')return;
  row.dataset.ct231TopBound='1';row.classList.add('ct231-top-row');
  let touch=null,pointer=null;
  row.addEventListener('touchstart',e=>{
    if(!isDiscover231()||e.touches?.length!==1)return;
    const t=e.touches[0];touch={id:t.identifier,x:t.clientX,y:t.clientY,left:row.scrollLeft,axis:'',moved:false};
  },{capture:true,passive:true});
  row.addEventListener('touchmove',e=>{
    const s=touch;if(!s)return;const t=Array.from(e.touches||[]).find(x=>x.identifier===s.id);if(!t)return;
    const dx=t.clientX-s.x,dy=t.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
    if(!s.axis){if(ax<5&&ay<5)return;s.axis=ax>ay*1.03?'x':'y'}
    if(s.axis!=='x')return;if(e.cancelable)e.preventDefault();e.stopPropagation?.();s.moved=s.moved||ax>7;dragTo231(row,s.left,dx);
  },{capture:true,passive:false});
  const endTouch=e=>{if(!touch)return;const ended=!e?.changedTouches||Array.from(e.changedTouches).some(x=>x.identifier===touch.id);if(!ended)return;if(touch.axis==='x'&&touch.moved){suppressTopRow231=row;suppressTopClickUntil231=Date.now()+520}touch=null};
  row.addEventListener('touchend',endTouch,{capture:true,passive:true});row.addEventListener('touchcancel',endTouch,{capture:true,passive:true});

  row.addEventListener('pointerdown',e=>{
    if(!isDiscover231()||e.isPrimary===false||e.pointerType==='touch')return;
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY,left:row.scrollLeft,axis:'',moved:false};
    try{row.setPointerCapture?.(e.pointerId)}catch{}
  },{capture:true,passive:true});
  row.addEventListener('pointermove',e=>{
    const s=pointer;if(!s||e.pointerId!==s.id)return;const dx=e.clientX-s.x,dy=e.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
    if(!s.axis){if(ax<5&&ay<5)return;s.axis=ax>ay*1.03?'x':'y'}if(s.axis!=='x')return;
    if(e.cancelable)e.preventDefault();e.stopPropagation?.();s.moved=s.moved||ax>7;dragTo231(row,s.left,dx);
  },{capture:true,passive:false});
  const endPointer=e=>{const s=pointer;if(!s||e.pointerId!==s.id)return;try{if(row.hasPointerCapture?.(s.id))row.releasePointerCapture(s.id)}catch{}if(s.axis==='x'&&s.moved){suppressTopRow231=row;suppressTopClickUntil231=Date.now()+520}pointer=null};
  row.addEventListener('pointerup',endPointer,{capture:true,passive:true});row.addEventListener('pointercancel',endPointer,{capture:true,passive:true});row.addEventListener('lostpointercapture',()=>{pointer=null},{capture:true,passive:true});
  row.addEventListener('click',e=>{if(Date.now()<suppressTopClickUntil231&&suppressTopRow231===row){e.preventDefault();e.stopImmediatePropagation()}},true);
}
function addTopControls231(row){
  const section=row?.closest?.('section');if(!section)return;const head=section.querySelector?.('.panel-head');if(!head||head.querySelector?.('[data-ct231-top-controls]'))return;
  const controls=document.createElement('div');controls.className='ct231-top-controls';controls.dataset.ct231TopControls='1';
  controls.innerHTML='<button type="button" data-ct231-top-prev aria-label="Mover Top 10 para a esquerda">‹</button><button type="button" data-ct231-top-next aria-label="Mover Top 10 para a direita">›</button>';
  const prev=controls.querySelector?.('[data-ct231-top-prev]'),next=controls.querySelector?.('[data-ct231-top-next]');
  prev?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();nudge231(row,-1)},true);
  next?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();nudge231(row,1)},true);
  head.appendChild(controls);
}
function bindTop231(root=document){
  if(!isDiscover231())return;const rows=[];try{if(root?.matches?.('.ct171-top-row'))rows.push(root)}catch{}try{rows.push(...(root?.querySelectorAll?.('.ct171-top-row')||[]))}catch{}
  for(const row of rows){bindTopRow231(row);addTopControls231(row)}
}
function decorate231(root=document){bindSwap231(root);bindTop231(root)}

let frame231=0;
try{new MutationObserver(ms=>{if(frame231)return;frame231=requestAnimationFrame(()=>{frame231=0;if(!isDiscover231())return;for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)decorate231(n);decorate231(document)})}).observe(document.querySelector('#app')||document.documentElement,{childList:true,subtree:true})}catch{}

const style=document.createElement('style');style.id='ct-android-099759';style.textContent=`
[data-ct231-swap]{pointer-events:auto!important;touch-action:manipulation!important}
.ct231-swap-pulse{animation:ct231Swap .18s ease-out}
.ct171-top-row,.ct231-top-row{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;gap:8px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;scroll-behavior:auto!important;scroll-snap-type:none!important;touch-action:pan-y!important;pointer-events:auto!important;padding-bottom:8px!important;scrollbar-width:none!important}
.ct171-top-row::-webkit-scrollbar,.ct231-top-row::-webkit-scrollbar{display:none!important}
.ct171-top-row>.ct171-top-card,.ct231-top-row>.ct171-top-card{box-sizing:border-box!important;flex:0 0 min(42vw,160px)!important;width:min(42vw,160px)!important;min-width:min(42vw,160px)!important;max-width:160px!important;touch-action:pan-y!important}
.ct231-top-controls{display:flex!important;align-items:center!important;gap:5px!important;margin-left:auto!important;pointer-events:auto!important}
.ct231-top-controls button{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:30px!important;min-width:30px!important;height:28px!important;padding:0!important;border-radius:999px!important;font-size:18px!important;line-height:1!important;touch-action:manipulation!important;pointer-events:auto!important}
@keyframes ct231Swap{0%{opacity:.3;transform:translateX(9px) scale(.98)}100%{opacity:1;transform:none}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
requestAnimationFrame(()=>decorate231(document));
})();
