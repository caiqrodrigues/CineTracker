/* CineTracker Android r276 / 1.0.34: verified weekly WWE episode freshness.
   Preserves the r275 Pra Você audit and r271 Sports/history owners intact. */
(()=>{
'use strict';
if(window.__ctR276AndroidV1034)return;
try{
window.__ctR276AndroidV1034='wwe-smackdown-raw-released-not-watched+foryou-poster-stable';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const targets=[
 {id:1549,season2026:28,title:/\bsmackdown\b/i,verified:{season:28,episode:42,date:'2026-10-16'}},
 {id:4656,season2026:34,title:/^(?:wwe\s+)?(?:monday\s+night\s+)?raw$/i,verified:{season:34,episode:41,date:'2026-10-12'}}
];
const stringDate=x=>String(x||'').slice(0,10);
const number=x=>Math.max(0,Number(x)||0);
const day=()=>String(localDay());
const later=(a,b)=>number(a?.season)>number(b?.season)||
 (number(a?.season)===number(b?.season)&&number(a?.episode)>number(b?.episode));
function latestForShow(data,config,today){
 const season=number(data?.season||config.season2026);
 const options=(Array.isArray(data?.episodes)?data.episodes:[])
  .filter(x=>number(x?.episode_number)>0&&stringDate(x?.air_date)&&stringDate(x.air_date)<=today)
  .map(x=>({season,episode:number(x.episode_number),date:stringDate(x.air_date),source:'tmdb'}));
 // Only episode broadcasts externally verified on those precise dates.
 // This floor never guesses future episodes or marks them as watched.
 if(config.verified?.date<=today&&season===number(config.verified.season))
  options.push({...config.verified,source:'broadcast-confirmed'});
 return options.sort((a,b)=>number(b.season)-number(a.season)||number(b.episode)-number(a.episode))[0]||null;
}
function applyLatest(row,latest,today){
 if(!row||!latest||!String(latest.date||'')||latest.date>today)return false;
 const previousBucket=String(row.home_bucket||'');
 const watched={season:number(row.last_season_number),episode:number(row.last_episode_number)};
 const wasStarted=number(row.watched_episodes)>0||watched.season>0;
 if(!wasStarted||row.home_bucket==='completed')return false;
 const inPast21Days=(Date.parse(today+'T12:00:00Z')-Date.parse(latest.date+'T12:00:00Z'))/86400000<=21;
 const unseen=later(latest,watched);
 const bucket=unseen&&inPast21Days?'continue':unseen?'dust':'up_to_date';
 const changed=row.home_bucket!==bucket||row.is_caught_up===unseen||
  number(row.latest_released_season_number)!==number(latest.season)||
  number(row.latest_released_episode_number)!==number(latest.episode);
 row.home_bucket=bucket;
 row.is_caught_up=!unseen;
 row.latest_released_season_number=number(latest.season);
 row.latest_released_episode_number=number(latest.episode);
 if(unseen){
  // Historical unwatched archive still counts toward remaining episodes,
  // but must not decide the weekly "Continuar assistindo" bucket.
  row.released_episodes=Math.max(number(row.released_episodes),number(row.watched_episodes)+1);
  row.history_missing_episodes=Math.max(1,number(row.history_missing_episodes),
    number(row.released_episodes)-number(row.watched_episodes));
 }
 return changed;
}
const owner=()=>String(session?.user?.id||user?.id||'');
const recent=new Map();
let request=null,token=0,repainting=false;
async function episodeSource(config,row){
 const year=Number(new Date(day()+'T12:00:00').getFullYear());
 const old=recent.get(config.id);
 if(old&&old.day===day()&&Date.now()-old.at<15*60000)return old.latest;
 // Query the actual current aired episodes, not the October 7 database
 // snapshot. Permit no more than 8 seconds for each show.
 const season=Math.max(number(row?.latest_released_season_number),
  number(row?.last_season_number),number(config.season2026+year-2026))||config.season2026;
 let seasonPayload=null;
 try{
  seasonPayload=await Promise.race([
   tmdb('/tv/'+config.id+'/season/'+season),
   new Promise((_,reject)=>setTimeout(()=>reject(new Error('WWE season timeout')),8000))
  ]);
 }catch{}
 const latest=latestForShow({season,episodes:seasonPayload?.episodes},config,day());
 if(latest)recent.set(config.id,{day:day(),at:Date.now(),latest});
 return latest;
}
async function synchronize(){
 if(route()!=='home'||!session||!homeCache?.series?.length||repainting)return false;
 if(request)return request;
 const localToken=++token,userAtStart=owner(),rowset=homeCache.series;
 request=(async()=>{
  let didChange=false;
  const result=await Promise.allSettled(targets.map(async config=>{
   const row=rowset.find(x=>number(x?.tmdb_id)===config.id||config.title.test(String(x?.title||'')));
   if(!row)return false;
   const latest=await episodeSource(config,row);
   if(!latest||route()!=='home'||owner()!==userAtStart||
      token!==localToken||homeCache?.series!==rowset)return false;
   return applyLatest(row,latest,day());
  }));
  didChange=result.some(x=>x.status==='fulfilled'&&x.value===true);
  if(didChange&&route()==='home'&&homeCache?.series===rowset){
   repainting=true;
   try{paintHome()}finally{repainting=false}
  }
  return didChange;
 })().finally(()=>{request=null});
 return request;
}
const previousPaint=paintHome;
paintHome=function(...args){
 const out=previousPaint.apply(this,args);
 if(!repainting&&route()==='home')queueMicrotask(()=>{void synchronize()});
 return out;
};
window.addEventListener('cinetracker:data-changed',()=>{
 // New authenticated Home payload on the next Home visit takes priority.
 // Do not cause any page-wide refetch on a watch mutation.
 for(const config of targets)recent.delete(config.id);
},{passive:true});

/* Keep next-card art warm, after primary contents have painted. Do not
   alter r275's eligibility/Watchlist/Seen/Trocar and do not add network
   requests during its critical first paint. */
const primed=new Set();
let warming=false;
function prewarm(){
 if(warming||route()!=='discover'||discoverState?.tab!=='foryou'||
    !session||!window.Image||!ct186ForYouData)return;
 warming=true;
 try{
  const f=ct186ForYouData._ct186_fresh||{},w=ct186ForYouData._ct186_watchlist||{};
  const keys=[f.movie?.[1],f.series?.[1],f.anime?.[1],w.movie?.[1],w.series?.[1],w.anime?.[1]];
  for(const item of keys){
   const poster=mediaPoster(item);if(!poster)continue;
   const url=img(poster,'w342');if(!url||primed.has(url))continue;
   primed.add(url);
   const image=new Image();image.decoding='async';image.src=url;
  }
 }catch{}
 finally{warming=false}
}
const previousDiscoverPaint=paintDiscover;
paintDiscover=function(...args){
 const out=previousDiscoverPaint.apply(this,args);
 if(route()==='discover'&&discoverState?.tab==='foryou')
  setTimeout(prewarm,900);
 return out;
};
window.__ctR276Test={latestForShow,applyLatest,synchronize};
}catch(error){
 window.__ctR276StartupError=String(error?.message||error);
 try{console.error('r276 WWE weekly integrity disabled:',error)}catch{}
}
})();