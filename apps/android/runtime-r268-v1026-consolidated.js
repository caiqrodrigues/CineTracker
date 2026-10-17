/* CineTracker Android r268 — protect seven Pra Você slots, compact F1 overview. */
(()=>{
'use strict';
if(window.__ctR268AndroidV1026)return;
window.__ctR268AndroidV1026='daily-not-stuck+seven-filtered-pools+compact-f1-overview';
const allowed=window.__ctR265Test?.allowed;
const poolNames=['movie','series','anime'];
const typeMatches=(x,k)=>ct186Type(x)===(k==='movie'?'movie':'tv')&&
 (k==='movie'?!ct186Anime(x):k==='anime'?ct186Anime(x):!ct186Anime(x));
function good(x,k,mode,ctx){
 if(!x||!typeMatches(x,k)||typeof allowed!=='function'||!allowed(x)||!ct186Quality(x))return false;
 if(mode==='fresh'){
  if(ctx&&!ct186FreshEligible(x,ctx))return false;
  if(!ctx&&(x.is_seen||x.is_watchlist||x.watched_episodes>0||ct186LocalBlocked.has(ct186Key(x))))return false;
 }else{
  if(ctx&&!ct186WatchEligible(x,ctx))return false;
  if(!ctx&&!x._ct_watchlist&&!x.is_watchlist)return false;
 }
 return true;
}
function unique(arr){return ct186UniqueRows(arr||[])}
const selectBase=ct186Select;
ct186Select=function(data){
 if(!data||typeof data!=='object')return selectBase(data);
 const ctx=ct186ContextValue||null;
 const fresh=data._ct186_fresh||{movie:[],series:[],anime:[]},watch=data._ct186_watchlist||{movie:[],series:[],anime:[]};
 for(const k of poolNames){
  fresh[k]=unique(fresh[k]).filter(x=>good(x,k,'fresh',ctx));
  watch[k]=unique(watch[k]).filter(x=>good(x,k,'watchlist',ctx));
 }
 data._ct186_fallback={movie:[],series:[],anime:[]};
 data._ct166_fresh=fresh;data._ct166_watchlist=watch;
 const picked=selectBase(data);
 const used=new Set();
 const take=(item)=>{if(!item)return null;const key=ct186Key(item);if(!key||used.has(key))return null;used.add(key);return item};
 const next={
  daily:take(picked.daily),
  wm:take(picked.wm),ws:take(picked.ws),wa:take(picked.wa),
  fm:null,fs:null,fa:null,
  wmPool:watch.movie,wsPool:watch.series,waPool:watch.anime
 };
 for(const [name,kind] of [['fm','movie'],['fs','series'],['fa','anime']]){
  const selected=picked[name],source=fresh[kind];
  next[name]=take(selected);
  if(!next[name])next[name]=take(source.find(x=>!used.has(ct186Key(x))));
 }
 if(!next.daily)next.daily=take(fresh.movie.find(x=>!used.has(ct186Key(x))));
 return {...picked,...next,used};
};
const refreshBase=ct186RefreshVisible;
let loadingFallback=false,refreshTask=null;
function repaint(data){
 if(!data||route()!=='discover'||discoverState?.tab!=='foryou')return;
 ct186ForYouData=data;paintDiscover(data);
}
function sync(data){
 const s=ct186Select(data);
 Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,
  watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa,
  wmPool:s.wmPool,wsPool:s.wsPool,waPool:s.waPool});
 repaint(data);
 return s;
}
async function restore(data){
 if(!data?._ct186_fresh||loadingFallback)return data;
 const empty=poolNames.filter(k=>!data._ct186_fresh[k]?.length);
 if(!empty.length)return data;
 loadingFallback=true;
 try{
  const ctx=await ct186Context(false);
  // Reuse only candidates already eligible after the same history/alias audit.
  for(const kind of empty){
   const reserves=[...(data._ct186_reserve?.[kind]||[]),...(data._ct166_fresh?.[kind]||[])];
   const valid=unique(reserves).filter(x=>good(x,kind,'fresh',ctx));
   if(valid.length)data._ct186_fresh[kind]=unique([...(data._ct186_fresh[kind]||[]),...valid]);
  }
  sync(data);
 }finally{loadingFallback=false}
 return data;
}
ct186RefreshVisible=async function(...args){
 if(refreshTask)return refreshTask;
 refreshTask=Promise.resolve(refreshBase.apply(this,args)).then(async data=>{
  if(data){await restore(data);sync(data)}
  return data;
 }).finally(()=>{refreshTask=null});
 return refreshTask;
};
// Keep actual renderer's seven slots and all actions. Empty Watchlist never
// gets invented candidates. When one candidate exists, Trocar invites more.
const paintBase=paintDiscover;
paintDiscover=function(data){
 if(discoverState?.tab==='foryou'&&data?._ct186_fresh){
  const s=ct186Select(data);
  Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,
   watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa});
 }
 const out=paintBase.apply(this,arguments);
 if(discoverState?.tab==='foryou'){
  const day=document.querySelector('[data-ct241-slot-key="daily:movie"]');
  const fresh=document.querySelector('[data-ct241-slot-key="fresh:movie"]');
  if(day&&fresh){
   const id1=day.querySelector('[data-media]')?.dataset?.media||'';
   const id2=fresh.querySelector('[data-media]')?.dataset?.media||'';
   document.documentElement.dataset.ct268Unique=id1&&id1!==id2?'yes':'pending';
  }
 }
 return out;
};
const css=document.createElement('style');css.id='ct268-overview-style';
css.textContent=[
 '#ct-f1-v111 .ct267-f1-overview{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}',
 '.ct268-f1-overview{max-width:100%!important}',
 '#ct-f1-v111 .ct267-f1-overview>.ct111-f1-card{min-width:0!important;padding:8px!important;border-radius:9px!important}',
 '#ct-f1-v111 .ct267-f1-overview h2{font-size:13px!important;line-height:1.2!important;margin:5px 0!important;overflow-wrap:anywhere!important}',
 '#ct-f1-v111 .ct267-f1-overview h3{font-size:11px!important;line-height:1.2!important;margin:0 0 5px!important}',
 '#ct-f1-v111 .ct267-f1-overview .ct111-f1-row{display:grid!important;grid-template-columns:12px minmax(0,1fr)!important;gap:3px!important;padding:4px 0!important;align-items:start!important}',
 '#ct-f1-v111 .ct267-f1-overview .ct111-f1-row>strong{grid-column:2!important;font-size:10px!important;opacity:.82!important}',
 '#ct-f1-v111 .ct267-f1-overview .ct111-f1-row span{white-space:normal!important;overflow-wrap:anywhere!important;font-size:11px!important;line-height:1.25!important}',
 '#ct-f1-v111 .ct267-f1-overview .ct111-f1-row small{font-size:9px!important}',
 '#ct-f1-v111 .ct267-f1-overview .ct111-f1-card>small{font-size:10px!important;line-height:1.25!important}',
 '#ct-f1-v111 .ct268-overview-more{display:block!important;color:#55bbec!important;font-size:11px!important;margin-top:7px!important}',
 '[data-discover] [data-ct241-slot-key] .ct166-slot-head small{font-size:10px!important;white-space:normal!important}',
 '[data-discover] [data-ct241-slot-key] .discover-card .poster{aspect-ratio:2/3!important}',
 '[data-discover] .ct265-empty-slot{min-height:160px!important;display:flex!important;flex-direction:column!important;gap:6px!important}',
 '[data-discover] .ct265-empty-slot button{margin-top:auto!important;width:100%!important;white-space:normal!important;min-height:32px!important}'
].join('\n');document.head.appendChild(css);
window.__ctR268Test={good,restore,sync};
})();