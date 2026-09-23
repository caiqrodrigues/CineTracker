/* CineTracker Web 1.0.141 r350 — direct functional actions for Descobrir > Pra você only. */
(()=>{
'use strict';
if(window.__ctR350?.version==='1.0.141')return;
window.__ctR350Marker='foryou-direct-actions+optimistic-first+backend-second';
window.__ctR350Scope='discover-foryou-actions-only';
window.__ctR350Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
let testBridge=null;

function routeNow350(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function cloneState350(st){
 if(!st)return null;
 return {
  ...st,
  watchPools:{
   movie:[...rows(st.watchPools?.movie)],
   series:[...rows(st.watchPools?.series)],
   anime:[...rows(st.watchPools?.anime)]
  },
  freshPools:{
   movie:[...rows(st.freshPools?.movie)],
   series:[...rows(st.freshPools?.series)],
   anime:[...rows(st.freshPools?.anime)]
  },
  watchIndex:{...st.watchIndex},
  freshIndex:{...st.freshIndex},
  dailyPool:[...rows(st.dailyPool)],
  initial:st.initial?{
   ...st.initial,
   watch:{...(st.initial.watch||{})},
   fresh:{...(st.initial.fresh||{})}
  }:st.initial
 };
}
function keyOf350(x){
 const t=String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv';
 const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);
 return id>0?t+':'+id:'';
}
function removeKey350(list,key){return rows(list).filter(x=>keyOf350(x)!==key)}
function normalizeIndex350(index,len){return len>0?((Number(index||0)%len)+len)%len:0}
function normalizeState350(st){
 for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime']){
  const pool=rows(st?.[bucket+'Pools']?.[kind]);
  if(!st[bucket+'Index'])st[bucket+'Index']={movie:0,series:0,anime:0};
  st[bucket+'Index'][kind]=normalizeIndex350(st[bucket+'Index'][kind],pool.length);
 }
 st.dailyIndex=normalizeIndex350(st.dailyIndex,rows(st.dailyPool).length);
 return st;
}
function installState350(st){
 normalizeState350(st);
 window.__ctR309Test?.setForYouState?.(st);
 return true;
}
function repaint350(slotName){
 let out=false;
 try{out=window.__ctR336Test?.paintForYou336?.()||false}catch{}
 if(!out){try{out=window.__ctR336?.paintForYou?.()||false}catch{}}
 queueMicrotask(()=>{
  try{window.__ctR348?.fixAll?.()}catch{}
  try{window.__ctR349?.compact?.()}catch{}
  if(slotName){try{window.__ctR349?.animateIn?.(slotName)}catch{}}
 });
 return out;
}
function swapDirect350(name){
 const st=window.__ctR309Test?.state;if(!st)return false;
 const next=cloneState350(st);
 if(name==='daily'){
  const pool=rows(next.dailyPool);if(pool.length<2)return false;
  next.dailyIndex=(normalizeIndex350(next.dailyIndex,pool.length)+1)%pool.length;
 }else{
  const [bucket,kind]=String(name||'').split(':');
  if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;
  const pool=rows(next[bucket+'Pools']?.[kind]);if(pool.length<2)return false;
  next[bucket+'Index'][kind]=(normalizeIndex350(next[bucket+'Index'][kind],pool.length)+1)%pool.length;
 }
 installState350(next);repaint350(name);return true;
}
function rotateAction350(action,key,slotName){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const before=cloneState350(st),next=cloneState350(st);
 if(action==='seen'){
  for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime'])
   next[bucket+'Pools'][kind]=removeKey350(next[bucket+'Pools'][kind],key);
  next.dailyPool=removeKey350(next.dailyPool,key);
 }else if(action==='watchlist'){
  for(const kind of ['movie','series','anime'])next.freshPools[kind]=removeKey350(next.freshPools[kind],key);
  next.dailyPool=removeKey350(next.dailyPool,key);
 }else return null;
 installState350(next);repaint350(slotName);return before;
}
async function persistBackend350(action,type,id){
 if(testBridge){
  if(action==='watchlist'&&typeof testBridge.watchlist==='function')return await testBridge.watchlist(type,id);
  if(action==='seen'&&typeof testBridge.seen==='function')return await testBridge.seen(type,id);
 }
 if(action==='watchlist'){
  if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');
  return await addWatchlist(type,id);
 }
 if(action==='seen'){
  if(typeof markSeen!=='function')throw new Error('Visto indisponível');
  return await markSeen(type,id);
 }
 throw new Error('Ação inválida');
}
async function actionDirect350(btn){
 if(!btn||btn.disabled)return false;
 const action=String(btn.dataset.ct336Action||'');
 const media=String(btn.dataset.ct336Media||'');
 const slotName=String(btn.dataset.ct336Swap||btn.closest('[data-ct336-slot]')?.dataset?.ct336Slot||'');
 const [type,idRaw]=media.split(':'),id=Number(idRaw||0);
 if(!['watchlist','seen'].includes(action)||!['movie','tv'].includes(type)||!(id>0))return false;
 const before=rotateAction350(action,media,slotName);if(!before)return false;
 try{
  await persistBackend350(action,type,id);
  return true;
 }catch(e){
  installState350(before);repaint350(slotName);
  try{toast(e?.message||String(e))}catch{}
  try{await window.__ctR321?.loadForYou?.(true);repaint350(slotName)}catch{}
  return false;
 }
}
function handle350(target,event){
 if(!target?.closest)return false;
 if(routeNow350()!=='discover')return false;
 const root=target.closest('[data-ct336-foryou]');if(!root)return false;
 const swap=target.closest('[data-ct336-swap-only]');
 if(swap){
  event?.preventDefault?.();event?.stopPropagation?.();
  if(!swap.disabled)swapDirect350(String(swap.dataset.ct336SwapOnly||''));
  return true;
 }
 const action=target.closest('[data-ct336-action]');
 if(action){
  event?.preventDefault?.();event?.stopPropagation?.();
  void actionDirect350(action);
  return true;
 }
 return false;
}

/* The r336 global capture dynamically reads this variable on every click. */
const previousEarly350=window.__ctR336EarlyHandle;
function earlyHandle350(target,event){
 if(handle350(target,event))return true;
 return typeof previousEarly350==='function'?previousEarly350(target,event):false;
}
window.__ctR336EarlyHandle=earlyHandle350;

/* Ensure no poster/card overlay can steal the already-correct action buttons. */
const style=document.createElement('style');style.id='ct-web-r350';style.textContent=`
[data-ct336-foryou] .ct336-actions{
 position:relative!important;z-index:30!important;pointer-events:auto!important
}
[data-ct336-foryou] .ct336-actions>button.ct336-action{
 position:relative!important;z-index:31!important;pointer-events:auto!important;cursor:pointer!important
}
`;document.head.appendChild(style);

window.__ctR350={
 version:'1.0.141',
 swap:swapDirect350,
 action:actionDirect350,
 handle:handle350,
 repaint:repaint350,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR350Test={
 cloneState350,removeKey350,normalizeState350,swapDirect350,rotateAction350,actionDirect350,handle350,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
})();