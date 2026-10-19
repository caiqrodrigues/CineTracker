/* CineTracker Android 1.0.28/r270 — one Pra Voce owner; WWE weekly freshness; stable Sports watch; movie history. */
(()=>{
'use strict';
if(window.__ctR270AndroidV1028)return;
window.__ctR270AndroidV1028='weekly-wwe-recent+foryou-single-fast-owner+movie-history-canonical+sports-optimistic-no-scroll';
const R=(s,root=document)=>root?.querySelector?.(s)||null;
const arr=x=>Array.isArray(x)?x:[];
const same=(a,b)=>String(a??'')===String(b??'');
const profile=()=>String(user?.id||session?.user?.id||'anonymous');
const today=()=>localDay();
const cacheKey=()=> 'ct:r270:recommendations:'+profile()+':'+today();
const clone=x=>JSON.parse(JSON.stringify(x));
async function timeout(p,ms){let id;try{return await Promise.race([Promise.resolve(p),new Promise((_,reject)=>{id=setTimeout(()=>reject(new Error('timeout')),ms)})])}finally{if(id)clearTimeout(id)}}
const mediaId=x=>Number(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0);
const slotKinds=['movie','series','anime'];
const empty=()=>({movie:[],series:[],anime:[]});
const counts={movie:7,series:5,anime:5};
const confirmed=window.__ctR265Test?.allowed||(()=>false);
const typeOK=(x,k)=>ct186Type(x)===(k==='movie'?'movie':'tv')&&(k==='movie'?!ct186Anime(x):k==='anime'?ct186Anime(x):!ct186Anime(x));
function locallyEligible(x,k,context){
 if(!x||!confirmed(x)||!ct186Quality(x)||!typeOK(x,k))return false;
 const mins=Number(x.runtime||x.runtime_minutes||x.raw_tmdb?.runtime||0);
 if(mins>0&&mins<40)return false;
 const names=String(x.production_companies?.map(v=>v.name).join(' ')||'')+' '+String(x.homepage||'');
 if(/youtube|youtu\.be/i.test(names))return false;
 return !context||ct186FreshEligible(x,context);
}
function filteredWatch(x,k,context){
 return !!context&&typeOK(x,k)&&ct186WatchEligible(x,context)&&confirmed(x);
}
const query={include_adult:false,'vote_average.gte':7.5,without_genres:'99'};
const queries={
 movie:[{...query,'primary_release_date.gte':'1991-01-01','vote_count.gte':65,sort_by:'popularity.desc'},{...query,'primary_release_date.gte':'1991-01-01','vote_count.gte':40,sort_by:'vote_average.desc'}],
 series:[{...query,'first_air_date.gte':'1991-01-01','vote_count.gte':55,sort_by:'popularity.desc'},{...query,'first_air_date.gte':'1991-01-01','vote_count.gte':35,sort_by:'vote_average.desc'}],
 anime:[{...query,'first_air_date.gte':'1991-01-01',with_origin_country:'JP',with_genres:'16','vote_count.gte':30,sort_by:'popularity.desc'},{...query,'first_air_date.gte':'1991-01-01',with_genres:'16','vote_count.gte':35,sort_by:'vote_average.desc'}]
};
let current=null,task=null,taskUser='',lastAt=0;
const inMemoryTTL=15*60*1000;
function publish(data){
 if(!data)return data;
 const s=ct186Select(data);
 Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,
 watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa,
 wmPool:s.wmPool,wsPool:s.wsPool,waPool:s.waPool});
 ct186ForYouData=data;ct166ForYouData=data;
 discoverCache.set('r186:foryou:'+today(),data);
 try{ct163Write('discover:foryou:all',data)}catch{}
 return data;
}
function decode(){
 try{
  const c=JSON.parse(sessionStorage.getItem(cacheKey())||'null');
  if(c&&c.user===profile()&&c.day===today()&&Date.now()-Number(c.time)<inMemoryTTL&&c.data?._ct186_fresh){
   return c.data;
  }
 }catch{}
 return null;
}
function persist(data){
 try{sessionStorage.setItem(cacheKey(),JSON.stringify({user:profile(),day:today(),time:Date.now(),data}))}catch{}
}
function paintCurrent(data){
 if(route()==='discover'&&discoverState?.tab==='foryou'&&R('[data-discover-content]'))paintDiscover(data);
}
async function collect(k,c,variants=1){
 const type=k==='movie'?'movie':'tv',path=k==='movie'?'/discover/movie':'/discover/tv';
 let collected=[];
 for(let round=0;round<variants;round++){
  const opts=queries[k][round]||queries[k][0];
  const results=await Promise.allSettled([1,2,3].map(page=>timeout(tmdb(path,{...opts,page}),7900)));
  for(const o of results)if(o.status==='fulfilled')
   for(const x of arr(o.value?.results))if(x?.id)collected.push({...x,media_type:type});
  const clean=ct186UniqueRows(collected).filter(x=>locallyEligible(x,k,c));
  if(clean.length>=counts[k])return clean.slice(0,25);
 }
 return ct186UniqueRows(collected).filter(x=>locallyEligible(x,k,c)).slice(0,25);
}
async function personalize(fresh,c){
 const all=slotKinds.flatMap(k=>fresh[k]).slice(0,90),items=all.map(x=>({
  media_type:ct186Type(x),tmdb_id:mediaId(x),
  title:x.title||x.name||'',original_title:x.original_title||'',original_name:x.original_name||'',release_year:ct186Year(x)
 }));
 if(!items.length)return fresh;
 const audit=await timeout(rpc('cinetracker_recommendation_filter_v525',{p_items:items}),8500);
 const blocked=new Set(arr(audit?.blocked_keys));
 for(const kind of slotKinds)fresh[kind]=fresh[kind].filter(x=>!blocked.has(ct186Key(x))&&!ct186LocalBlocked.has(ct186Key(x)));
 return fresh;
}
async function produce(){
 const context=await timeout(ct186Context(false),11000);
 const watch=ct186WatchPools(context),fresh=empty();
 const responses=await Promise.allSettled(slotKinds.map(k=>collect(k,context,1)));
 responses.forEach((r,i)=>{if(r.status==='fulfilled')fresh[slotKinds[i]]=r.value});
 // Bounded second pass only for categories that cannot supply cards + alternatives.
 const needs=slotKinds.filter(k=>fresh[k].length<3);
 await Promise.allSettled(needs.map(async k=>{fresh[k]=ct186MergeRows(fresh[k],await collect(k,context,2))}));
 try{await personalize(fresh,context)}catch{/* Strict local seen/Watchlist context still enforces exclusion when batch audit fails. */}
 const safeWatch=empty();for(const k of slotKinds)safeWatch[k]=arr(watch[k]).filter(x=>filteredWatch(x,k,context));
 const data={_ct186_fresh:fresh,_ct166_fresh:fresh,_ct186_watchlist:safeWatch,_ct166_watchlist:safeWatch,_ct186_fallback:empty(),_ct186_reserve:empty(),__ct270Canonical:true};
 return publish(data);
}
ct186LoadForYou=async function(force=false){
 const id=profile();
 if(id!==taskUser){current=null;lastAt=0;task=null;taskUser=id}
 if(!force&&current&&Date.now()-lastAt<inMemoryTTL)return publish(current);
 if(!force){
  const saved=decode();if(saved){current=publish(saved);lastAt=Date.now();return current}
 }
 if(task)return task;
 task=produce().then(d=>{current=d;lastAt=Date.now();persist(d);paintCurrent(d);return d})
  .catch(err=>{if(current)return publish(current);const saved=decode();if(saved)return publish(saved);throw err})
  .finally(()=>{task=null});
 return task;
};
const refreshBase270=ct186RefreshVisible;
ct186RefreshVisible=async function(...args){
 if(route()!=='discover'||discoverState?.tab!=='foryou')return null;
 // Keep current seven cards visible during an asynchronous replacement.
 if(task)return task;
 ct186ContextValue=null;ct186ContextAt=0;
 lastAt=0;
 const data=await ct186LoadForYou(true).catch(()=>current);
 if(data)paintCurrent(data);
 return data;
};
try{discoverCache.delete('r186:foryou:'+today())}catch{}
const invalidation270=()=>{
 if(!session?.access_token)return;
 const fresh=Date.now()-lastAt<1500;
 if(fresh)return;
 lastAt=0;
 // Later reads will replace the affected recommendations; don't blank the screen.
};
window.addEventListener('cinetracker:data-changed',invalidation270);
window.__ctR270ForYou={collect,locallyEligible,produce,decode,cacheKey,counts};

/* The TMDB titles in stored Raw/SmackDown metadata stop in early October.
   Resolve recently aired weekly episodes from fresh TMDB and read-only watch
   history. Old thousands of missed episodes never decide the recent status. */
const WEEKLY=[
 {id:1549,title:/smackdown/i,day:5,knownMedia:[9627,2110]},
 {id:4656,title:/^raw$|\bwwe raw\b/i,day:1,knownMedia:[2111]}
];
const checked=new Map(),checking=new Map();
function fridayOrMonday(day){
 const now=new Date(today()+'T12:00:00'),delta=(now.getDay()-day+7)%7;
 now.setDate(now.getDate()-delta);return now.toISOString().slice(0,10);
}
function findRow(cfg){
 return arr(homeCache?.series).find(x=>mediaTmdb(x)===cfg.id||cfg.title.test(String(x.title||x.name||'')));
}
async function watchSet(cfg,row){
 const ids=[...new Set([Number(row?.media_id||0),...cfg.knownMedia].filter(x=>x>0))].slice(0,3);
 const params=ids.length===1?'media_id=eq.'+ids[0]:'media_id=in.('+ids.join(',')+')';
 const [progress,hist]=await Promise.all([
  api('episode_progress?select=season_number,episode_number&watched=eq.true&'+params).catch(()=>[]),
  api('watch_history?select=season_number,episode_number&item_type=eq.episode&'+params).catch(()=>[])
 ]);
 return new Set([...arr(progress),...arr(hist)].map(x=>Number(x.season_number)+':'+Number(x.episode_number)));
}
async function verifyWeekly(cfg){
 const row=findRow(cfg);if(!row)return null;
 const raw=row.raw_tmdb?.last_episode_to_air||{};
 const freshest=await timeout(tmdb('/tv/'+cfg.id),9000).catch(()=>null);
 const recent= freshest?.last_episode_to_air||raw;
 const season=Number(recent?.season_number||raw?.season_number||0);
 const last=Number(recent?.episode_number||0);
 const weeklyDate=fridayOrMonday(cfg.day);
 const seen=await watchSet(cfg,row);
 const latestDate=String(recent?.air_date||'').slice(0,10);
 if(season>0&&last>0&&latestDate&&latestDate<=today()&&latestDate>='2026-10-08'){
  const key=season+':'+last;
  if(!seen.has(key)){
   return{pending:true,air_date:latestDate,season,episode:last,title:recent?.name||'Episódio '+last,certainty:'tmdb'};
  }
  return{pending:false};
 }
 // Do not invent an exact episode number from out-of-date metadata.  Weekly
 // broadcasts newer than that metadata are listed as pending until the API
 // supplies season/episode; never count all historical unwatched episodes.
 const catalogDate=String(raw?.air_date||'').slice(0,10);
 const newestWatched=arr(homeCache?.history_episodes).some(x=>
  Number(x.tmdb_id)===cfg.id&&String(x.episode_air_date||'').slice(0,10)===weeklyDate);
 if(catalogDate&&catalogDate<weeklyDate&&!newestWatched){
  const lastWatch=String(row?.last_watched_at||'').slice(0,10);
  if(lastWatch>=weeklyDate)return null;
  return{pending:true,air_date:weeklyDate,title:'Episódio semanal recente · detalhes pendentes',certainty:'schedule'};
 }
 return null;
}
function applyWeekly(cfg,v){
 if(!v?.pending||route()!=='home')return false;
 const row=findRow(cfg);if(!row)return false;
 if(v.certainty==='tmdb'&&Number(row.next_season_number)===v.season&&Number(row.next_episode_number)===v.episode&&row.home_bucket==='continue')return false;
 row.home_bucket='continue';row.is_caught_up=false;row.is_up_to_date=false;
 row.available_episodes=Math.max(1,Number(row.available_episodes||0));
 row.next_episode_air_date=v.air_date;row.next_episode_title=v.title;
 if(v.certainty==='tmdb'){row.next_season_number=v.season;row.next_episode_number=v.episode}
 row._ct270_recent_verified=v.certainty;
 return true;
}
let weeklyPaintGuard=false;
async function reconcileWeekly(){
 if(route()!=='home'||!session?.access_token||!homeCache?.series)return;
 const stamp=profile()+':'+today();
 if(checking.has(stamp))return checking.get(stamp);
 if(checked.get(stamp)&&Date.now()-checked.get(stamp)<6*60*1000)return;
 checked.set(stamp,Date.now());
 const job=Promise.allSettled(WEEKLY.map(cfg=>verifyWeekly(cfg))).then(results=>{
  if(route()!=='home'||!homeCache?.series)return;
  let changed=false;
  results.forEach((r,i)=>{if(r.status==='fulfilled'&&applyWeekly(WEEKLY[i],r.value))changed=true});
  if(changed&&!weeklyPaintGuard){
   weeklyPaintGuard=true;
   const viewport=R('[data-home-viewport="series"]'),pos=viewport?.scrollTop??null;
   try{paintHome();if(viewport&&pos!==null){const newViewport=R('[data-home-viewport="series"]');if(newViewport)newViewport.scrollTop=pos}}finally{weeklyPaintGuard=false}
  }
 }).finally(()=>checking.delete(stamp));
 checking.set(stamp,job);return job;
}
const basePaintHome270=paintHome;
paintHome=function(...args){
 const out=basePaintHome270.apply(this,args);
 if(!weeklyPaintGuard&&route()==='home')queueMicrotask(()=>{void reconcileWeekly()});
 return out;
};

/* Restore complete movie history metadata from the canonical grouped RPC,
   preserving chronology and keeping the current movie scroll position. */
let movieHistoryTask=null,movieHistoryStamp='',movieHistoryDone=false;
async function movieHistory270(){
 const stamp=profile()+':'+today();
 if(movieHistoryDone&&stamp===movieHistoryStamp)return;
 if(movieHistoryTask)return movieHistoryTask;
 movieHistoryStamp=stamp;
 movieHistoryTask=(async()=>{
  const d=await timeout(rpc('cinetracker_home_history_v387',{}),12000);
  if(!arr(d?.history_movies).length||!homeCache)return;
  const rows=arr(d.history_movies);
  const merge=new Map();
  for(const x of [...arr(homeCache.history_movies),...rows]){
   const key=Number(x?.tmdb_id||0)>0?'tmdb:'+x.tmdb_id:'media:'+x.media_id;
   const old=merge.get(key)||{};
   merge.set(key,{...old,...x,title:x.title||old.title,poster_path:x.poster_path||old.poster_path,
    runtime_minutes:Number(x.runtime_minutes||old.runtime_minutes||0),
    vote_average:Number(x.vote_average||old.vote_average||0),
    genres:x.genres?.length?x.genres:old.genres,
    watched_at:x.watched_at||old.watched_at});
  }
  homeCache.history_movies=[...merge.values()].sort((a,b)=>Date.parse(a.watched_at||0)-Date.parse(b.watched_at||0));
  try{ct163Write('home',homeCache)}catch{}
  movieHistoryDone=true;
  if(route()==='home'&&homeActiveTab158==='movies'){
   const vp=R('[data-home-viewport="movies"]'),pos=vp?.scrollTop||0;
   paintHome();
   const v=R('[data-home-viewport="movies"]');if(v)v.scrollTop=pos;
  }
 })().catch(()=>{}).finally(()=>{movieHistoryTask=null});
 return movieHistoryTask;
}
document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab="movies"]');
 if(tab&&route()==='home')void movieHistory270();
},true);

/* Own Sports watch actions above legacy delegated listeners (window capture).
   No navigation, page-level paint, scroll reset or duplicate RPC. */
const inProgress=new Set();
function applySports(id,watched){
 for(const b of document.querySelectorAll('[data-sport-watched="'+id+'"],[data-ct263-sport-watch="'+id+'"]')){
  b.dataset.on=watched?'1':'0';b.classList.toggle('on',watched);b.disabled=false;
  b.textContent=b.matches('[data-ct263-sport-watch]')?(watched?'↶ Desmarcar assistido':'✓ Marcar como assistido'):(watched?'✓ Assistido':'✓ Marcar como assistido');
 }
 for(const x of arr(sportsCache?.events))if(Number(x.id)===id)x.is_watched=watched;
 /* Detail-screen buttons are patched in place. Its private event store belongs to the r263 closure. */
 try{ct163Write('sports',sportsCache);window.__ctA26PersistSports?.()}catch{}
}
window.addEventListener('click',e=>{
 const button=e.target?.closest?.('[data-sport-watched],[data-ct263-sport-watch]');
 if(!button)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 const id=Number(button.dataset.sportWatched||button.dataset.ct263SportWatch||0);
 if(id<=0||inProgress.has(id))return;
 const old=button.dataset.on?button.dataset.on==='1':!/Marcar como assistido/i.test(button.textContent||'');
 const next=!old;
 inProgress.add(id);applySports(id,next);
 void rpc('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()})
 .then(result=>{applySports(id,result?.is_watched===undefined?next:Boolean(result.is_watched));profileCache=null})
 .catch(err=>{applySports(id,old);toast('Esportes: '+(err?.message||'Erro ao salvar'))})
 .finally(()=>inProgress.delete(id));
},true);
window.__ctR270Test={fridayOrMonday,applyWeekly,verifyWeekly,reconcileWeekly,locallyEligible,cacheKey,watchSet,applySports,movieHistory270};
})();