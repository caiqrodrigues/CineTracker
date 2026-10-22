/* CineTracker Android 1.0/r311 — narrow recovery for Home sports-series,
 * verified movie history and audited personalized recommendations.
 * Only installed WebView runtime; no Web, database or native activity changes. */
(()=>{
'use strict';
if(window.__ctR311Special)return;
const userId=()=>String(session?.user?.id||user?.id||'');
const home=()=>route()==='home'&&homeActiveTab158==='series'&&!!userId()&&!!session?.access_token;
const kinds=['ufc','wwe','f1'];
const requests={
 ufc:['cinetracker_ufc_series_v518',21],
 wwe:['cinetracker_wwe_ppv_series_v519',30],
 f1:['cinetracker_f1_series_v512',21]
};
const records=new Map();
let owner='',pending=null,seq=0,lastTry=0,verified=0,error='';
const safeDate=()=>localDay();
const valid=x=>Boolean(x&&x.series&&typeof x.series==='object'&&Array.isArray(x.events));
function reset(){
 const id=userId();if(id===owner)return;
 owner=id;seq++;pending=null;lastTry=0;error='';records.clear();
}
function best(kind){reset();return records.get(kind)||null}
const bounded=(task,ms)=>Promise.race([Promise.resolve(task),new Promise((_,reject)=>setTimeout(()=>reject(Error('Tempo limite da sincronização')),ms))]);
async function refresh(force=false){
 reset();const id=owner;if(!home())return false;
 if(pending)return pending;
 if(!force&&Date.now()-lastTry<45000)return kinds.every(k=>valid(records.get(k)));
 lastTry=Date.now();const ticket=++seq;
 const job=(async()=>{
  const season=new Date().getFullYear(),today=safeDate();
  const replies=await Promise.allSettled(kinds.map(async kind=>{
   const [name,days]=requests[kind];
   return await bounded(rpc(name,{p_season:season,p_today:today,p_recent_days:days}),14000);
  }));
  if(id!==userId()||ticket!==seq)return false;
  for(let i=0;i<kinds.length;i++){
   const reply=replies[i],kind=kinds[i];
   if(reply.status==='fulfilled'&&valid(reply.value))records.set(kind,reply.value);
   else if(reply.status==='rejected')error=String(reply.reason?.message||reply.reason);
  }
  verified=kinds.filter(k=>valid(records.get(k))).length;
  // The r290 presenter reads the same authenticated results in get(k).
  // Do not fabricate progress or replace ordinary Home cards.
  if(home()){
   try{window.__ctR290HomeTest?.mount?.()}catch(err){error=String(err?.message||err)}
   try{void window.__ctAndroidV1021?.loadCounts?.(false)}catch{}
  }
  document.documentElement.dataset.ct311SpecialVerified=String(verified);
  return verified===3;
 })().catch(e=>{if(owner===id)error=String(e?.message||e);return false})
 .finally(()=>{if(owner===id&&ticket===seq)pending=null});
 pending=job;return job;
}
// A refresh runs only on a true visit/foreground entry or explicit retry.
const oldRender=renderHome;
renderHome=async function(...args){
 const result=await oldRender.apply(this,args);
 if(home())void refresh(false);
 return result;
};
const oldPaint=paintHome;
paintHome=function(...args){
 const result=oldPaint.apply(this,args);
 if(home()){
  reset();
  if(kinds.some(k=>!valid(records.get(k)))&&!pending&&Date.now()-lastTry>45000)
   queueMicrotask(()=>{void refresh(false)});
 }
 return result;
};
document.addEventListener('visibilitychange',()=>{
 if(!document.hidden&&home())void refresh(true);
});
window.addEventListener('pageshow',()=>{if(home())void refresh(true)});
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-home-tab="series"]')){
  queueMicrotask(()=>{if(home())void refresh(true)});
  return;
 }
 const item=event.target?.closest?.('[data-ct263-special]');
 if(item&&home()&&!valid(best(item.dataset.ct263Special)))
  queueMicrotask(()=>{void refresh(true)});
},false);
window.__ctR311Special={refresh,best,stats:()=>({owner,verified,lastTry,error,pending:!!pending})};
})();
(()=>{
'use strict';
if(window.__ctR311Movies)return;
const id=()=>String(session?.user?.id||user?.id||'');
const live=()=>route()==='home'&&homeActiveTab158==='movies'&&!!id();
const all=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const latest=()=>window.__ctR308Home?.mergeMovies?.([])||[];
const key=x=>Number(x?.tmdb_id)>0?'movie:'+Number(x.tmdb_id):'movie:'+Number(x?.media_id||0);
let owner='',root=null,observer=null,scheduled=false,lastFix=0,repairs=0,checking=null;
function check(){
 if(!live())return false;
 const saved=latest(),max=saved.at(-1),vp=document.querySelector('[data-home-viewport="movies"]');
 if(!vp||!max)return false;
 document.documentElement.dataset.ct308MoviesPending='0';
 const stack=vp.querySelector('.home-history .stack');if(!stack)return false;
 const visible=all('[data-media^="movie:"]',stack);
 const final=visible.at(-1)?.getAttribute('data-media')||'';
 if(final===key(max))return false;
 if(Date.now()-lastFix<550)return false;
 lastFix=Date.now();
 // Reuse the canonical history painter already wrapping pagination, posters
 // and the authenticated, account-scoped v542 recent snapshot.
 try{
  const bridge=window.__ctR271Bridge;
  if(!bridge?.getPainter)return false;
  bridge.getPainter()(window.__ctR308Home.mergeMovies(homeCache?.history_movies));
  repairs++;return true;
 }catch(error){
  document.documentElement.dataset.ct311MovieRestoreError=String(error?.message||error);
  return false;
 }
}
function scan(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;check()})}
function attach(){
 const current=document.querySelector('[data-home-viewport="movies"]');
 if(current===root)return;
 observer?.disconnect();observer=null;root=current;
 if(!current||typeof MutationObserver!=='function')return;
 observer=new MutationObserver(scan);
 const stack=current.querySelector('.home-history');
 if(stack)observer.observe(stack,{childList:true,subtree:true});
}
async function sync(force=false){
 if(!live()||!session?.access_token)return false;
 const who=id();
 if(checking)return checking;
 const req=(async()=>{
  const already=latest();
  // On a cold install, do not flash the old Pokémon-only page while
  // the server's more recent authenticated records are still loading.
  if(!already.length)document.documentElement.dataset.ct308MoviesPending='1';
  try{await window.__ctR305MovieHistory?.refresh?.(force)}
  finally{
   if(id()===who&&live()){
    if(!latest().length)document.documentElement.dataset.ct308MoviesPending='0';
    scan();
   }
  }
  return Boolean(latest().length);
 })().finally(()=>{if(id()===who)checking=null});
 checking=req;return req;
}
const oldPaint=paintHome;
paintHome=function(...args){
 const result=oldPaint.apply(this,args);
 if(live()){attach();scan()}
 return result;
};
const oldRender=renderHome;
renderHome=async function(...args){
 const result=await oldRender.apply(this,args);
 if(live()){attach();scan();void sync(true)}
 return result;
};
document.addEventListener('click',event=>{
 if(!event.target?.closest?.('[data-home-tab="movies"],[data-home-tab="films"]'))return;
 queueMicrotask(()=>{if(live()){attach();void sync(true)}});
},false);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&live())void sync(true)});
window.addEventListener('pageshow',()=>{if(live())void sync(true)});
window.__ctR311Movies={check,sync,stats:()=>({account:id(),repairs,latest:key(latest().at(-1)),checking:!!checking,watching:!!observer})};
})();
(()=>{
'use strict';
if(window.__ctR311Discover)return;
const arr=x=>Array.isArray(x)?x:[];
const empty=()=>({movie:[],series:[],anime:[]});
const uid=()=>String(session?.user?.id||user?.id||'');
const isVisible=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!uid();
const safe=task=>Promise.race([Promise.resolve(task),new Promise((_,reject)=>setTimeout(()=>reject(Error('Pra Você: consulta expirou')),9500))]);
const kindMatches=(x,k)=>{
 const type=ct186Type(x),anime=ct186Anime(x);
 return k==='movie'?type==='movie'&&!anime:k==='anime'?type==='tv'&&anime:type==='tv'&&!anime;
};
const good=(item,kind,ctx)=>{
 if(!kindMatches(item,kind))return false;
 if(window.__ctR265Test?.allowed?.(item)!==true)return false;
 if(!ct186FreshEligible(item,ctx))return false;
 return true;
};
let count=0,fromTmdb=0,lastError='',filling=null,account='';
function reset(){const id=uid();if(id===account)return;account=id;filling=null;count=0;lastError=''}
function source(kind,attempt,preferred){
 const movie=kind==='movie',anime=kind==='anime';
 const params={
  include_adult:false,without_genres:movie?'99':'99,10764,10767,10766',
  sort_by:attempt%3===0?'popularity.desc':attempt%3===1?'vote_count.desc':movie?'primary_release_date.desc':'first_air_date.desc',
  'vote_count.gte':anime?32:50,'vote_average.gte':5.5,
  page:1+(Math.floor(Math.random()*16)%16)
 };
 if(anime){params.with_genres='16';params.with_origin_country='JP'}
 else if(preferred)params.with_genres=String(preferred);
 if(movie)params['primary_release_date.gte']='1991-01-01';
 else params['first_air_date.gte']='1991-01-01';
 return{endpoint:movie?'/discover/movie':'/discover/tv',params};
}
async function recover(data,stamp=''){
 reset();const who=account;
 if(!who||!session?.access_token||!data?._ct186_fresh)return false;
 if(filling)return filling;
 const task=(async()=>{
  const ctx=await safe(ct186Context(true));
  if(uid()!==who||!ctx?.dash)return false;
  const watch=ct186WatchPools(ctx);
  for(const kind of ['movie','series','anime'])
   if(!arr(data._ct186_watchlist?.[kind]).length)
    data._ct186_watchlist[kind]=arr(watch[kind]).filter(x=>
     window.__ctR265Test?.allowed?.(x)===true&&ct186WatchEligible(x,ctx)).slice(0,50);
  const taste=window.__ctR307Taste;
  // This takes the authenticated dashboard first; only discovery candidates
  // are public TMDB. Final choices still require v525's authenticated audit.
  try{await safe(taste?.warm?.(false))}catch{}
  const genres=[...(taste?.profile?.().positive||new Map())].sort((a,b)=>b[1]-a[1]).map(([g])=>g)
   .filter(g=>Number(g)>0&&![99,10764,10767,10766].includes(Number(g))).slice(0,6);
  const missing=['movie','series','anime'].filter(k=>arr(data._ct186_fresh[k]).length<14);
  await Promise.allSettled(missing.map(async kind=>{
   let result=arr(data._ct186_fresh[kind]);
   for(let attempt=0;attempt<3&&result.length<20;attempt++){
    if(uid()!==who)return;
    const pref=kind==='anime'?null:genres[(attempt+count)%genres.length];
    const req=source(kind,attempt,pref);
    try{
     const dataTmdb=await safe(safeTmdb(req.endpoint,req.params));
     if(uid()!==who)return;
     const mapped=arr(dataTmdb?.results).map(x=>({...x,media_type:kind==='movie'?'movie':'tv'}));
     result=ct186UniqueRows([...result,...mapped.filter(x=>good(x,kind,ctx))]).slice(0,90);
     fromTmdb+=mapped.length;
    }catch(error){lastError=String(error?.message||error)}
   }
   if(uid()===who)data._ct186_fresh[kind]=result;
  }));
  if(uid()!==who)return false;
  data._ct166_fresh=data._ct186_fresh;
  data._ct166_watchlist=data._ct186_watchlist;
  count++;
  document.documentElement.dataset.ct311DiscoverRecovered=String(count);
  // The caller's existing v525 auditData is the only writer that sets
  // __ct283ServerAudited. This layer never asserts its own eligibility.
  return ['movie','series','anime'].some(k=>arr(data._ct186_fresh[k]).length);
 })().catch(e=>{lastError=String(e?.message||e);return false})
 .finally(()=>{if(uid()===who)filling=null});
 filling=task;return task;
}
function diagnostics(){reset();return{account,count,tmdbRows:fromTmdb,lastError,pending:!!filling}}
window.__ctR311Discover={recover,stats:diagnostics,scope:'Discover Pra Você fallback, audited by v525'};
})();