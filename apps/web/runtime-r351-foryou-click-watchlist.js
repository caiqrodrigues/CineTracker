/* CineTracker Web 1.0.142 r351 — direct first-capture actions + restore "Da sua Watchlist". */
(()=>{
'use strict';
if(window.__ctR351?.version==='1.0.142')return;
window.__ctR351Marker='foryou-first-capture-direct+watchlist-source-restore';
window.__ctR351Scope='discover-foryou-only';
window.__ctR351Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
let testBridge=null,restoreTask=null,restoreAt=0,watchMo=null,watchHost=null;

function routeNow351(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function typeOf351(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function idOf351(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf351(x){const id=idOf351(x);return id>0?(typeOf351(x)==='movie'?'movie':'tv')+':'+id:''}
function category351(x){
 try{return window.__ctR309Test?.category?.(x)|| (typeOf351(x)==='movie'?'movie':'series')}catch{return typeOf351(x)==='movie'?'movie':'series'}
}
function mergeUnique351(a,b){
 const out=[],seen=new Set();
 for(const x of [...rows(a),...rows(b)]){const k=keyOf351(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}
 return out;
}
function modelHasWatch351(){
 const m=window.__ctR336Test?.fyModel336?.();
 return !!(m&&Object.values(m.watch||{}).some(Boolean));
}
async function fetchWatchRows351(){
 if(testBridge?.watchRows)return rows(await testBridge.watchRows());
 if(typeof rpc!=='function')return[];
 const v=await rpc('cinetracker_watchlist_full_v119',{});
 return rows(v?.rows||v);
}
async function filterWatchRows351(list){
 const base=rows(list).filter(x=>idOf351(x)>0);
 if(!base.length)return[];
 if(testBridge?.filter)return rows(await testBridge.filter(base));
 if(typeof rpc!=='function')return base;
 const payload=base.map(x=>({
  media_type:typeOf351(x),
  tmdb_id:idOf351(x),
  title:x?.title||x?.name||x?.media_title||'',
  release_year:Number(x?.release_year||String(x?.release_date||x?.first_air_date||'').slice(0,4))||null
 }));
 const a=await rpc('cinetracker_discover_filter_v320',{p_items:payload});
 const watch=new Set(rows(a?.watch_keys).map(String)),seen=new Set(rows(a?.seen_keys).map(String));
 return base.filter(x=>watch.has(keyOf351(x))&&!seen.has(keyOf351(x)));
}
async function restoreWatchlist351(force=false){
 if(routeNow351()!=='discover')return false;
 if(!force&&modelHasWatch351())return true;
 if(!force&&restoreTask)return restoreTask;
 if(!force&&Date.now()-restoreAt<15000)return modelHasWatch351();
 restoreTask=(async()=>{
  try{
   const raw=await fetchWatchRows351(),eligible=await filterWatchRows351(raw);
   if(routeNow351()!=='discover'||!eligible.length)return false;
   const st=window.__ctR309Test?.state;if(!st)return false;
   const next={
    ...st,
    watchPools:{
     movie:[...rows(st.watchPools?.movie)],
     series:[...rows(st.watchPools?.series)],
     anime:[...rows(st.watchPools?.anime)]
    },
    watchIndex:{...(st.watchIndex||{movie:0,series:0,anime:0})}
   };
   const grouped={movie:[],series:[],anime:[]};
   for(const x of eligible){const c=category351(x);if(grouped[c])grouped[c].push(x)}
   for(const kind of ['movie','series','anime']){
    next.watchPools[kind]=mergeUnique351(next.watchPools[kind],grouped[kind]);
    next.watchIndex[kind]=0;
   }
   window.__ctR309Test?.setForYouState?.(next);
   try{window.__ctR336Test?.paintForYou336?.()}catch{try{window.__ctR336?.paintForYou?.()}catch{}}
   queueMicrotask(()=>{try{window.__ctR348?.fixAll?.()}catch{};try{window.__ctR349?.compact?.()}catch{}});
   restoreAt=Date.now();return modelHasWatch351();
  }catch{return false}
  finally{restoreTask=null}
 })();
 return restoreTask;
}
function afterAction351(ok){
 if(ok!==false)void restoreWatchlist351(true);
}
function directClick351(target,event){
 if(!target?.closest||routeNow351()!=='discover')return false;
 const root=target.closest('[data-ct336-foryou]');if(!root)return false;
 const swap=target.closest('[data-ct336-swap-only]');
 if(swap){
  event?.preventDefault?.();event?.stopPropagation?.();
  if(!swap.disabled){
   const name=String(swap.dataset.ct336SwapOnly||'');
   const ok=window.__ctR350?.swap?.(name)??window.__ctR336?.swapForYou?.(name);
   if(ok){try{window.__ctR349?.animateIn?.(name)}catch{}}
  }
  return true;
 }
 const action=target.closest('[data-ct336-action]');
 if(action){
  event?.preventDefault?.();event?.stopPropagation?.();
  let p=false;
  try{p=window.__ctR350?.action?.(action)??window.__ctR336?.persistForYou?.(action)}catch(e){try{toast(e?.message||String(e))}catch{}}
  Promise.resolve(p).then(afterAction351).catch(()=>{});
  return true;
 }
 return false;
}
window.__ctR351DirectClick=directClick351;

/* Keep the dynamic legacy hook aligned too, but the build patch makes r351 run first. */
const previousEarly351=window.__ctR336EarlyHandle;
window.__ctR336EarlyHandle=function(target,event){
 if(directClick351(target,event))return true;
 return typeof previousEarly351==='function'?previousEarly351(target,event):false;
};

function bindWatchRestore351(){
 const h=q('[data-ct319-content]');
 if(!h||h===watchHost)return false;
 watchMo?.disconnect?.();watchHost=h;
 watchMo=new MutationObserver(ms=>{
  if(routeNow351()!=='discover')return;
  if(ms.some(m=>m.addedNodes.length||m.removedNodes.length))queueMicrotask(()=>void restoreWatchlist351(false));
 });
 watchMo.observe(h,{subtree:true,childList:true});return true;
}
function startup351(){
 if(routeNow351()!=='discover')return;
 try{window.__ctR348?.fixAll?.()}catch{}
 try{window.__ctR349?.compact?.()}catch{}
 bindWatchRestore351();void restoreWatchlist351(false);
}
setTimeout(startup351,0);
setTimeout(startup351,600);
setTimeout(startup351,1600);

window.__ctR351={
 version:'1.0.142',
 directClick:directClick351,
 restoreWatchlist:restoreWatchlist351,
 bindWatchRestore:bindWatchRestore351,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR351Test={
 directClick351,restoreWatchlist351,filterWatchRows351,mergeUnique351,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
})();