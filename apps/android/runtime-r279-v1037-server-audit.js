/* CineTracker Android 1.0.37/r279 — authenticated final recommendation audit.
   Only Pra Você; no changes to Web, Home logic or Sports watch mutations. */
(()=>{
'use strict';
if(window.__ctR279AndroidV1037)return;
window.__ctR279AndroidV1037='v525-server-authority+fresh-watchlist-disjoint+verified-swaps';
const bags=['movie','series','anime'],checked=new Set(),blocked=new Set(),watched=new Set(),watchlisted=new Set(),notInterested=new Set();
const active=new WeakMap();
let identity='',pendingRepaint=false;
function identityKey(){return String(session?.user?.id||user?.id||'')+':'+localDay()}
function resetIfNewUser(){
 const key=identityKey();if(key===identity)return;
 identity=key;checked.clear();blocked.clear();watched.clear();watchlisted.clear();notInterested.clear();
}
function ref(x){const id=Number(ct186Id(x));if(!Number.isSafeInteger(id)||id<=0)return '';return (ct186Type(x)==='movie'?'movie':'tv')+':'+id}
function candidatesOf(data){
 const all=[],seen=new Set();
 for(const name of ['_ct186_fresh','_ct186_watchlist','_ct186_reserve']){
  const bag=data?.[name];if(!bag)continue;
  for(const kind of bags){
   // Auditing 50 alternatives per kind is sufficient for the seven visible
   // slots plus swaps. Never expose any unchecked tail candidates.
   for(const x of (Array.isArray(bag[kind])?bag[kind]:[]).slice(0,50)){
    const key=ref(x);if(!key||seen.has(key))continue;
    seen.add(key);all.push(x);
   }
  }
 }
 return all;
}
function payloadFor(x){return {
 media_type:ct186Type(x)==='movie'?'movie':'tv',
 tmdb_id:Number(ct186Id(x)),
 title:String(x?.title||x?.name||''),
 original_title:String(x?.original_title||x?.raw_tmdb?.original_title||''),
 original_name:String(x?.original_name||x?.raw_tmdb?.original_name||''),
 release_year:Number(ct186Year(x)||0)||null
}}
const batchTimeout=(p,ms)=>Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(new Error('recommendation-audit-timeout')),ms))]);
async function auditCandidates(items){
 resetIfNewUser();
 const owner=identity;
 const rows=[...new Map((items||[]).map(x=>[ref(x),x]).filter(([k])=>k&&!checked.has(k))).values()];
 if(!rows.length)return true;
 const chunks=[];for(let i=0;i<rows.length;i+=45)chunks.push(rows.slice(i,i+45));
 let success=true;
 // Bounded three parallel RPCs. The existing v525 server function resolves
 // duplicate media IDs, aliases, watched episodes and manual state.
 for(let i=0;i<chunks.length;i+=3){
  const batches=chunks.slice(i,i+3);
  const replies=await Promise.allSettled(batches.map(batch=>batchTimeout(
   rpc('cinetracker_recommendation_filter_v525',{p_items:batch.map(payloadFor)}),10000
  )));
  if(owner!==identityKey())return false;
  replies.forEach((reply,j)=>{
   if(reply.status!=='fulfilled'){success=false;return}
   const d=Array.isArray(reply.value)&&reply.value.length===1?reply.value[0]:reply.value;
   const batch=batches[j];if(!d||Number(d.checked_count)!==batch.length){success=false;return}
   const put=(key,dst)=>{for(const s of Array.isArray(d[key])?d[key]:[])if(/^(movie|tv):[1-9][0-9]*$/.test(String(s)))dst.add(String(s))};
   put('blocked_keys',blocked);put('watch_keys',watchlisted);put('seen_keys',watched);put('not_interested_keys',notInterested);
   for(const row of batch)checked.add(ref(row));
  });
 }
 return success;
}
function permitted(item,isWatchlist){
 const id=ref(item);
 if(!id||!checked.has(id)||watched.has(id)||notInterested.has(id))return false;
 if(isWatchlist)return watchlisted.has(id);
 return !blocked.has(id)&&!watchlisted.has(id);
}
function filterData(data){
 if(!data||typeof data!=='object')return data;
 for(const k of bags){
  for(const name of ['_ct186_fresh','_ct186_watchlist']){
   const bag=data[name];if(!bag)continue;
   bag[k]=(Array.isArray(bag[k])?bag[k]:[]).filter(x=>permitted(x,name==='_ct186_watchlist'));
  }
  // Reserved titles must pass the same final audit before being eligible for Trocar.
  if(data._ct186_reserve)data._ct186_reserve[k]=(Array.isArray(data._ct186_reserve[k])?data._ct186_reserve[k]:[]).filter(x=>permitted(x,false));
 }
 data._ct186_fallback={movie:[],series:[],anime:[]};
 data._ct166_fresh=data._ct186_fresh;
 data._ct166_watchlist=data._ct186_watchlist;
 data._ct279AuditedFor=identity;
 return data;
}
function unverified(data){return candidatesOf(data).some(x=>!checked.has(ref(x)))}
async function auditData(data){
 if(!data||typeof data!=='object')return data;
 resetIfNewUser();
 const current=active.get(data);if(current)return current;
 if(!unverified(data)&&data._ct279AuditedFor===identity)return data;
 const promise=(async()=>{
  document.documentElement.dataset.ct279Audit='pending';
  await auditCandidates(candidatesOf(data));
  if(identity!==identityKey())return data;
  filterData(data);
  document.documentElement.dataset.ct279Audit='ready';
  return data;
 })().finally(()=>active.delete(data));
 active.set(data,promise);return promise;
}
const originalLoad=ct186LoadForYou;
ct186LoadForYou=async function(...args){
 const data=await originalLoad.apply(this,args);
 await auditData(data);
 return data;
};
const originalPaint=paintDiscover;
paintDiscover=function(...args){
 const data=args[0]||ct186ForYouData;
 if(route()==='discover'&&discoverState?.tab==='foryou'&&data&&unverified(data)){
  document.documentElement.dataset.ct279Audit='pending';
  const result=originalPaint.apply(this,args);
  void auditData(data).then(d=>{
   if(route()==='discover'&&discoverState?.tab==='foryou'&&identity===identityKey()&&!pendingRepaint){
    pendingRepaint=true;
    try{originalPaint.call(this,d)}finally{pendingRepaint=false}
   }
  });
  return result;
 }
 return originalPaint.apply(this,args);
};
const css=document.createElement('style');css.id='ct279-server-v525-gate';
css.textContent='html[data-ct279-audit="pending"] [data-discover-content] [data-ct241-section] .discover-card{visibility:hidden!important}';
document.head.appendChild(css);
window.addEventListener('cinetracker:data-changed',()=>{
 // The canonical Dashboard and user-specific v525 RPC are refreshed by
 // existing invalidation code; do not leave previously permitted cards
 // visible while a different tab changes their states.
 checked.clear();blocked.clear();watched.clear();watchlisted.clear();notInterested.clear();
 const data=ct186ForYouData;
 if(data&&route()==='discover'&&discoverState?.tab==='foryou'){
  document.documentElement.dataset.ct279Audit='pending';
  void auditData(data).then(d=>{if(route()==='discover'&&discoverState?.tab==='foryou')originalPaint(d)});
 }
});
window.__ctR279Audit={auditCandidates,auditData,permitted,ref,filterData,resetIfNewUser,getStats:()=>({
 checked:checked.size,blocked:blocked.size,watchlisted:watchlisted.size,watched:watched.size
})};
})();