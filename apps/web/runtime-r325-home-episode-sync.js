/* CineTracker Web 1.0.116 r325 — authoritative hidden Home history + live episode state/release sync. */
(()=>{
'use strict';
if(window.__ctR325?.version==='1.0.116')return;
window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode';
window.__ctR325Android='preserved-1.0.20-10062';

const rows=v=>Array.isArray(v)?v:[];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let testBridge=null,refreshBusy=null;

/* Load both hidden histories before Home is painted. */
const baseFetchHome325=typeof ct274FetchHome==='function'?ct274FetchHome:null;
function mergeHistory325(data,h){
 const out=data&&typeof data==='object'?data:{};
 out.history_episodes=rows(h?.history_episodes);
 out.history_movies=rows(h?.history_movies);
 out.__ctHistoryAuthoritative=true;
 out.__ctR325History='episodes+movies-preloaded';
 return out;
}
if(baseFetchHome325){
 ct274FetchHome=async function(){
  const baseP=baseFetchHome325.apply(this,arguments);
  const histP=testBridge?.homeHistory
    ? Promise.resolve(testBridge.homeHistory())
    : (typeof rpc==='function'?rpc('cinetracker_home_history_v324',{p_limit:50}):Promise.resolve({history_episodes:[],history_movies:[]}));
  const [data,h]=await Promise.all([baseP,histP]);
  return mergeHistory325(data,h);
 };
}

/* One watch state for every duplicate/imported row that resolves to the same TMDB series. */
async function fetchWatchState325(list){
 const ids=[...new Set(rows(list).map(x=>{try{return n(ct275Tmdb(x))}catch{return n(x?.tmdb_id)}}).filter(x=>x>0))].slice(0,200);
 if(!ids.length)return new Map();
 const data=testBridge?.seriesState
   ? await testBridge.seriesState(ids)
   : await rpc('cinetracker_home_series_watch_state_v2',{p_tmdb_ids:ids});
 return new Map(rows(data).map(x=>[n(x?.tmdb_id),x]));
}
function applyWatchState325(list,state){
 for(const x of rows(list)){
  let t=0;try{t=n(ct275Tmdb(x))}catch{t=n(x?.tmdb_id)}
  const s=state.get(t);if(!s)continue;
  if(n(s.canonical_media_id)>0)x.media_id=n(s.canonical_media_id);
  x.watched_episodes=n(s.watched_episodes);
  x.__ct275WatchedKeys=rows(s.watched_keys);
  x.__ct275MediaIds=rows(s.media_ids);
  if(n(s.last_season_number)>0)x.last_season_number=n(s.last_season_number);
  if(n(s.last_episode_number)>0)x.last_episode_number=n(s.last_episode_number);
  if(s.last_watched_at)x.last_watched_at=s.last_watched_at;
 }
 return list;
}
try{ct275FetchWatchState=fetchWatchState325;ct275ApplyWatchState=applyWatchState325}catch{}

/* Reconcile released episodes against current TMDB data, not the raw_tmdb snapshot stored weeks ago. */
function releasedCount325(show,row){
 const today=(()=>{try{return ct275Today()}catch{return new Date().toISOString().slice(0,10)}})();
 const last=show?.last_episode_to_air;
 if(!last||n(last.season_number)<=0||n(last.episode_number)<=0||!last.air_date||String(last.air_date)>today)return Math.max(n(row?.released_episodes),n(row?.watched_episodes));
 const ls=n(last.season_number),le=n(last.episode_number);
 let prev=0;
 for(const s of rows(show?.seasons)){
  const sn=n(s?.season_number);if(sn>0&&sn<ls)prev+=Math.max(0,n(s?.episode_count));
 }
 let value=prev+le,total=n(show?.number_of_episodes)||n(row?.total_episodes);
 if(total>0)value=Math.min(total,value);
 return Math.max(value,n(row?.watched_episodes));
}
function recentEpisode325(air){
 const t=Date.parse(String(air||'')+'T12:00:00Z');if(!Number.isFinite(t))return false;
 const age=Date.now()-t;return age>=0&&age<=14*86400000;
}
async function reconcileOne325(row){
 let t=0;try{t=n(ct275Tmdb(row))}catch{t=n(row?.tmdb_id)}
 if(!(t>0))return row;
 let show=null;
 try{show=testBridge?.show?await testBridge.show(t):await ct275ShowData(t)}catch{}
 if(!show)return row;
 const released=releasedCount325(show,row),watched=n(row?.watched_episodes),last=show?.last_episode_to_air;
 row.total_episodes=Math.max(n(row?.total_episodes),n(show?.number_of_episodes));
 row.released_episodes=released;
 if(last&&n(last.season_number)>0&&n(last.episode_number)>0){
  row.latest_released_season_number=n(last.season_number);
  row.latest_released_episode_number=n(last.episode_number);
 }
 let unseen=null;
 try{unseen=testBridge?.firstUnseen?await testBridge.firstUnseen(row,show):await ct275FirstReleasedUnseen(row,show)}catch{}
 if(unseen){
  row.next_season_number=n(unseen.season_number);
  row.next_episode_number=n(unseen.episode_number);
  row.next_episode_title=unseen.name||('Episódio '+n(unseen.episode_number));
  row.next_episode_rating=unseen.vote_average??null;
  row.next_episode_air_date=unseen.air_date||null;
  row.available_episodes=Math.max(1,released-watched);
  if(row.home_bucket!=='dust')row.home_bucket='continue';
  row.__ct275FreshMissing=true;
  row.__ct275NextAnnounced=null;
  row.__ct325NewEpisode=recentEpisode325(unseen.air_date);
 }else{
  const ended=['ended','canceled','cancelled'].includes(String(show?.status||'').toLowerCase());
  row.home_bucket=ended?'completed':'up_to_date';
  row.available_episodes=0;
  row.__ct275FreshMissing=false;
  row.__ct325NewEpisode=false;
  try{row.__ct275NextAnnounced=ct275FutureEpisode(show)}catch{row.__ct275NextAnnounced=null}
 }
 return row;
}
try{ct275ReconcileOne=reconcileOne325}catch{}

function seriesSection325(title,list){
 return '<section class="home-section"><div class="panel-head"><h3>'+title+'</h3><small>'+rows(list).length+'</small></div><div class="stack">'+
  (rows(list).length?rows(list).slice(0,120).map(x=>{
   if(x.home_bucket==='continue'){
    const y={...x,season_number:x.next_season_number,episode_number:x.next_episode_number,episode_title:x.next_episode_title,episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};
    return ct274Row(y,{meta:ct274EpisodeMeta(y),sub:ct274AvailableText(x)+(x.__ct325NewEpisode?' · NOVO':''),action:ct274EpisodeWatchAction(x),attrs:ct274EpisodeAttrs(y,'continue')});
   }
   if(x.home_bucket==='up_to_date')return ct274Row(x,{meta:ct275NextText(x),sub:'Em dia'});
   return ct274Row(x,{meta:String(n(x.watched_episodes))+'/'+String(Math.max(n(x.total_episodes),n(x.released_episodes))||'?'),sub:ct274AvailableText(x)});
  }).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>';
}
try{ct275SeriesSection=seriesSection325}catch{}

/* Persist stale/passed-next TMDB series metadata with the already deployed authenticated refresh function. */
function supabaseUrl325(){try{return String(typeof SUPABASE_URL!=='undefined'?SUPABASE_URL:(window.SUPABASE_URL||''))}catch{return String(window.SUPABASE_URL||'')}}
function auth325(){try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}}
async function refreshTv325(force=false){
 if(refreshBusy)return refreshBusy;
 const key='ct325:tv-refresh-at',now=Date.now();
 try{if(!force&&now-n(sessionStorage.getItem(key))<15*60*1000)return{skipped:true}}catch{}
 try{sessionStorage.setItem(key,String(now))}catch{}
 refreshBusy=(async()=>{
  try{
   let out;
   if(testBridge?.refreshTv)out=await testBridge.refreshTv();
   else{
    const base=supabaseUrl325();if(!base)return{skipped:true};
    const r=await fetch(base+'/functions/v1/ct-refresh-tv-state-user',{method:'POST',headers:{...auth325(),'content-type':'application/json'},body:'{}'});
    if(!r.ok)throw new Error('TV refresh '+r.status);
    out=await r.json();
   }
   if(n(out?.refreshed)>0){
    try{ct275ShowCache?.clear?.();ct275SeasonCache?.clear?.()}catch{}
    try{homeCache=null;window.__ct0997PreloadedHomeLive=null}catch{}
    if(routeNow()==='home'&&typeof ct275ReloadHome==='function')await ct275ReloadHome('r325-tv-metadata-refresh');
   }
   return out||{};
  }catch{return{failed:true}}finally{refreshBusy=null}
 })();
 return refreshBusy;
}
const baseRenderHome325=typeof renderHome==='function'?renderHome:null;
if(baseRenderHome325)renderHome=async function(){
 const out=await baseRenderHome325.apply(this,arguments);
 setTimeout(()=>void refreshTv325(false),40);
 return out;
};
window.addEventListener('focus',()=>{if(routeNow()==='home')void refreshTv325(false)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&routeNow()==='home')void refreshTv325(false)});

/* r324 already owns compact Discover actions, Top10 alias filter and complete Watchlist modal.
   Hide the older duplicate r275 history button so there is only one visible history control. */
const style=document.createElement('style');style.id='ct-web-r325';style.textContent=`
[data-ct274-history] .ct275-history-toggle{display:none!important}
`;document.head.appendChild(style);

window.__ctR325={
 mergeHistory:mergeHistory325,fetchWatchState:fetchWatchState325,applyWatchState:applyWatchState325,
 releasedCount:releasedCount325,reconcileOne:reconcileOne325,refreshTv:refreshTv325,
 version:'1.0.116',setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR325Test={mergeHistory325,fetchWatchState325,applyWatchState325,releasedCount325,recentEpisode325,reconcileOne325,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();
