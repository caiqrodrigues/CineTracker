/* CineTracker Android 1.0.42 / r284 — authenticated movie history + DB-first Pra Você. */
(()=>{'use strict';
if(window.__ctR284AndroidV1042)return;
window.__ctR284AndroidV1042='paged-movie-history-v542+six-authenticated-pools-v421+verified-v525';
const kinds=['movie','series','anime'],array=x=>Array.isArray(x)?x:[];
const empty=()=>({movie:[],series:[],anime:[]});
const owner=()=>String(session?.user?.id||user?.id||'');
const isForYou=()=>route()==='discover'&&discoverState?.tab==='foryou';
const isMovies=()=>route()==='home'&&homeActiveTab158==='movies';
const bounded=(job,ms)=>Promise.race([Promise.resolve(job),new Promise((_,reject)=>setTimeout(()=>reject(Error('request-timeout')),ms))]);
const clean=x=>x&&typeof x==='object'&&!Array.isArray(x)&&x.data!=null?clean(x.data):x;
const unique=list=>ct186UniqueRows(array(list).filter(x=>x&&Number(ct186Id(x))>0));
let recommendationOwner='',recommendationData=null,recommendationTask=null,recommendationEpoch=0;
function moreThanZero(data){return kinds.some(k=>array(data?._ct186_fresh?.[k]).length||array(data?._ct186_watchlist?.[k]).length)}
function renderData(data){
 if(!isForYou()||!data||!owner())return false;
 ct186ForYouData=data;ct166ForYouData=data;
 if(!ct186ContextValue){
  ct186ContextValue={dash:[],historyMovieIds:new Set(),historyTvIds:new Set(),
   watchMovieIds:new Set(),watchTvIds:new Set(),historyAliases:new Set(),watchAliases:new Set()};
  ct186ContextAt=0;
 }
 const selected=ct186Select(data);
 Object.assign(data,{daily:selected.daily,movie:selected.fm,series:selected.fs,anime:selected.fa,
  watchlist_movie:selected.wm,watchlist_series:selected.ws,watchlist_anime:selected.wa});
 paintDiscover(data);
 document.documentElement.dataset.ct284ForYou=moreThanZero(data)?'verified':'empty';
 return true;
}
async function bucket(group,kind){
 const name=group==='watchlist'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';
 const limit=group==='watchlist'?30:48;
 for(let attempt=0;attempt<2;attempt++){
  try{
   const raw=clean(await bounded(rpc(name,{p_kind:kind,p_limit:limit}),8500));
   if(!Array.isArray(raw))throw Error('invalid authenticated pool');
   const found=unique(raw);
   if(found.length||attempt===1)return found;
  }catch(error){if(attempt===1)document.documentElement.dataset.ct284PoolError=kind+':'+group+':'+String(error?.message||error)}
  await new Promise(resolve=>setTimeout(resolve,300));
 }
 return[];
}
async function loadRecommendations(force=false){
 const id=owner(),stamp=id+':'+localDay();
 if(!id)return{_ct186_fresh:empty(),_ct186_watchlist:empty(),_ct186_reserve:empty()};
 if(recommendationOwner!==stamp){recommendationOwner=stamp;recommendationData=null;recommendationEpoch++;recommendationTask=null}
 if(recommendationTask)return recommendationTask;
 if(!force&&recommendationData&&moreThanZero(recommendationData))return recommendationData;
 const turn=++recommendationEpoch;
 recommendationTask=(async()=>{
  const next={_ct186_fresh:empty(),_ct186_watchlist:empty(),_ct186_reserve:empty(),_ct186_fallback:empty(),
   _ct166_fresh:empty(),_ct166_watchlist:empty()};
  document.documentElement.dataset.ct284ForYou='loading';
  const specs=[...kinds.map(k=>['fresh',k]),...kinds.map(k=>['watchlist',k])];
  const results=await Promise.allSettled(specs.map(([bag,kind])=>bucket(bag,kind)));
  if(turn!==recommendationEpoch||owner()+':'+localDay()!==stamp)return next;
  results.forEach((r,i)=>{
   if(r.status==='fulfilled'){
    const [bag,kind]=specs[i];next[bag== 'fresh'?'_ct186_fresh':'_ct186_watchlist'][kind]=array(r.value);
   }
  });
  if(moreThanZero(next)){
   const auditor=window.__ctR279Audit;
   if(typeof auditor?.auditData!=='function')throw Error('authenticated-v525-auditor-unavailable');
   await bounded(auditor.auditData(next),16000);
   if(turn!==recommendationEpoch||owner()+':'+localDay()!==stamp)return next;
   next.__ct283ServerAudited=true;
  }
  next._ct166_fresh=next._ct186_fresh;
  next._ct166_watchlist=next._ct186_watchlist;
  if(turn!==recommendationEpoch||owner()+':'+localDay()!==stamp)return next;
  recommendationData=next;
  if(isForYou())renderData(next);
  document.documentElement.dataset.ct284PoolCounts=JSON.stringify({
   fresh:Object.fromEntries(kinds.map(k=>[k,next._ct186_fresh[k].length])),
   watchlist:Object.fromEntries(kinds.map(k=>[k,next._ct186_watchlist[k].length]))});
  return next;
 })().catch(error=>{
  document.documentElement.dataset.ct284ForYouError=String(error?.message||error);
  if(isForYou())document.documentElement.dataset.ct284ForYou='retry';
  return recommendationData||{_ct186_fresh:empty(),_ct186_watchlist:empty(),_ct186_reserve:empty()};
 }).finally(()=>{if(turn===recommendationEpoch)recommendationTask=null});
 return recommendationTask;
}
const oldDiscover=discoverRows;
discoverRows=async function(tab){
 if(String(tab)!=='foryou')return oldDiscover.apply(this,arguments);
 return loadRecommendations(false);
};
ct186LoadForYou=async function(force=false){return loadRecommendations(Boolean(force))};
ct186RefreshVisible=async function(){
 if(!isForYou())return null;
 const result=await loadRecommendations(true);
 if(isForYou())renderData(result);
 return result;
};
let historyOwner='',historyData=[],historyTask=null,historyEpoch=0,historyStamp=0;
const historyBridge=window.__ctR271Bridge;
const merge=(parts)=>window.__ctR283History?.combine?.(parts)||parts.flatMap(array);
function repack(items){
 const merged=merge([array(items),historyData]);
 if(!merged.length)return array(items);
 if(homeCache)homeCache={...homeCache,history_movies:merged};
 return merged;
}
if(historyBridge?.getFetcher&&historyBridge?.setFetcher&&historyBridge?.getPainter){
 const previous=historyBridge.getFetcher();
 historyBridge.setFetcher(async function(...args){
  const result=await previous.apply(this,args);
  if(isMovies())queueMicrotask(()=>{void loadMoviePages(false)});
  return repack(result);
 });
}
async function moviePage(offset){
 const data=clean(await bounded(rpc('cinetracker_home_movie_history_v542',{p_limit:120,p_offset:offset}),9500));
 if(!data||!Array.isArray(data.rows)||!Number.isFinite(Number(data.total)))throw Error('invalid paged movie history');
 return{rows:data.rows,total:Math.max(0,Number(data.total))};
}
async function loadMoviePages(force=false){
 const id=owner();if(!id)return[];
 if(historyOwner!==id){historyOwner=id;historyData=[];historyTask=null;historyStamp=0;historyEpoch++}
 if(historyTask)return historyTask;
 if(!force&&historyData.length&&Date.now()-historyStamp<90000)return historyData;
 const turn=++historyEpoch;
 historyTask=(async()=>{
  const first=await moviePage(0);
  const total=Math.min(first.total,5000),pages=Math.ceil(total/120),all=[...first.rows];
  for(let base=1;base<pages;base+=3){
   const offsets=[base,base+1,base+2].filter(p=>p<pages).map(p=>p*120);
   const replies=await Promise.allSettled(offsets.map(moviePage));
   if(replies.some(r=>r.status!=='fulfilled'))throw Error('incomplete authenticated movie history page');
   for(const response of replies)all.push(...array(response.value.rows));
   if(turn!==historyEpoch||owner()!==id)return[];
  }
  if(turn!==historyEpoch||owner()!==id)return[];
  historyData=merge([historyData,all]);
  historyStamp=Date.now();
  const current=array(homeCache?.history_movies),complete=repack(current);
  document.documentElement.dataset.ct284MovieHistory=historyData.length+'/'+total;
  if(isMovies()&&historyBridge?.getPainter&&complete.length)
   historyBridge.getPainter()(complete);
  return historyData;
 })().catch(e=>{
  document.documentElement.dataset.ct284MovieHistoryError=String(e?.message||e);
  return historyData;
 }).finally(()=>{if(turn===historyEpoch)historyTask=null});
 return historyTask;
}
const basePaintHome=paintHome;
paintHome=function(...args){
 const value=basePaintHome.apply(this,args);
 if(isMovies())queueMicrotask(()=>{void loadMoviePages(false)});
 return value;
};
window.addEventListener('cinetracker:data-changed',()=>{
 recommendationData=null;recommendationEpoch++;
 historyStamp=0;
 if(isForYou())void ct186RefreshVisible();
 if(isMovies())void loadMoviePages(true);
});
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-home-tab="movies"],[data-home-tab="films"]'))queueMicrotask(()=>{void loadMoviePages(false)});
 if(event.target?.closest?.('[data-ct283-retry]')&&isForYou())void ct186RefreshVisible();
},false);
window.__ctR284Test={bucket,loadRecommendations,loadMoviePages,merge,repack,moreThanZero};
})();