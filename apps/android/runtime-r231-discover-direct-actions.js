/* Android 0.99.7.59 r231 — direct Trocar slot swap + true native Top 10 rail */
(() => {
'use strict';
if(window.__ctAndroidR231Loaded)return;
window.__ctAndroidR231Loaded=true;
window.__ctAndroidR231='discover-direct-slot-trocar-native-top10-unblocked';
window.__ctAndroidBundle='android-v0.99.7.59-r231-direct-slot-trocar-native-top10';
window.__ctR231Swap='unique-data-ct231-swap-direct-slot-replace-no-global-paint';
window.__ctR231Top10='r200-r201-excluded-native-webview-horizontal';
window.__ctR231Scope='android-only-web-r203-untouched';
window.__ctR231RootCause='stale-r200-r201-top10-pan-y-plus-global-paint-swap-chain';

const isDiscover231=()=>{try{return String(route?.()||'')==='discover'}catch{return String(location.pathname||'').replace(/^\/+/,'').split('/')[0]==='discover'}};
const mediaId231=el=>{
  const raw=String(el?.querySelector?.('[data-media]')?.dataset?.media||'');
  return Number(raw.split(':')[1]||0)||0;
};
function unique231(list){
  const seen=new Set();
  return (Array.isArray(list)?list:[]).filter(x=>{
    const id=Number(x?.id||x?.tmdb_id||0)||0;
    if(!id||seen.has(id))return false;
    seen.add(id);
    return true;
  });
}
function pool231(key){
  const d=(typeof ct166ForYouData==='object'&&ct166ForYouData)||{};
  const fresh=d._ct186_fresh||d._ct166_fresh||{movie:[],series:[],anime:[]};
  const watch=d._ct186_watchlist||d._ct166_watchlist||{movie:[],series:[],anime:[]};
  if(key==='daily:movie'||key==='fresh:movie')return unique231(fresh.movie);
  if(key==='fresh:series')return unique231(fresh.series);
  if(key==='fresh:anime')return unique231(fresh.anime);
  if(key==='watchlist:movie')return unique231(watch.movie);
  if(key==='watchlist:series')return unique231(watch.series);
  if(key==='watchlist:anime')return unique231(watch.anime);
  return [];
}
function usable231(key){
  let rows=pool231(key);
  if(key==='fresh:movie'){
    const dailyId=mediaId231(document.querySelector('.ct166-daily-grid .ct166-slot'));
    if(dailyId)rows=rows.filter(x=>Number(x?.id||x?.tmdb_id||0)!==dailyId);
  }
  return rows;
}
function pickNext231(rows,current){
  const list=unique231(rows);
  if(list.length<2)return {next:null,index:-1};
  let at=list.findIndex(x=>Number(x?.id||x?.tmdb_id||0)===Number(current||0));
  if(at<0)at=-1;
  for(let step=1;step<=list.length;step++){
    const index=(at+step+list.length)%list.length;
    const next=list[index];
    if(Number(next?.id||next?.tmdb_id||0)!==Number(current||0))return {next,index};
  }
  return {next:null,index:-1};
}
window.__ctR231PickNext=pickNext231;

function swap231(button){
  if(!button||!isDiscover231())return false;
  const key=String(button.dataset?.ct231Swap||'');
  const slot=button.closest?.('.ct166-slot,.foryou-slot');
  if(!key||!slot||typeof ct166Slot!=='function')return false;
  const rows=usable231(key),current=mediaId231(slot),picked=pickNext231(rows,current);
  if(!picked.next)return false;
  try{ct166SwapIndex[key]=picked.index}catch{}
  const label=slot.querySelector?.('.ct166-slot-head small,small')?.textContent?.trim()||'';
  const box=document.createElement('div');
  box.innerHTML=ct166Slot(label,picked.next,key,rows.length);
  const fresh=box.firstElementChild;
  if(!fresh)return false;
  slot.replaceWith(fresh);
  return mediaId231(fresh)!==current;
}
window.__ctR231Swap=swap231;

/* This is the only active authority for Trocar. The button uses a new attribute that no
   legacy r166/r224-r229 decorator knows about, and the slot is replaced directly. */
document.addEventListener('click',e=>{
  const button=e.target?.closest?.('[data-ct231-swap]');
  if(!button||!isDiscover231())return;
  e.preventDefault();
  e.stopImmediatePropagation();
  swap231(button);
},true);

const style=document.createElement('style');
style.id='ct-android-099759';
style.textContent=`
[data-page="discover"] [data-ct231-swap]{
  pointer-events:auto!important;
  touch-action:manipulation!important;
}
[data-page="discover"] .ct171-top-row{
  box-sizing:border-box!important;
  display:flex!important;
  flex-flow:row nowrap!important;
  gap:8px!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  overflow-x:auto!important;
  overflow-y:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior-x:contain!important;
  scroll-behavior:auto!important;
  scroll-snap-type:none!important;
  touch-action:auto!important;
  pointer-events:auto!important;
  padding-bottom:8px!important;
  scrollbar-width:none!important;
}
[data-page="discover"] .ct171-top-row::-webkit-scrollbar{display:none!important}
[data-page="discover"] .ct171-top-row>.ct171-top-card{
  box-sizing:border-box!important;
  flex:0 0 min(42vw,160px)!important;
  width:min(42vw,160px)!important;
  min-width:min(42vw,160px)!important;
  max-width:160px!important;
  touch-action:auto!important;
  pointer-events:auto!important;
}
[data-page="discover"] .ct171-top-row>.ct171-top-card button,
[data-page="discover"] .ct171-top-row>.ct171-top-card [data-media]{
  touch-action:auto!important;
  pointer-events:auto!important;
}
`;
document.getElementById(style.id)?.remove();
document.head.appendChild(style);
})();
