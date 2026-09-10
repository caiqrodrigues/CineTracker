/* CineTracker Web 1.0.34 r243 — HOME ONLY.
   Prevent metadata fan-out from starving interaction and audit every "Em dia" series
   through the existing canonical first-released-unwatched authority. */
(()=>{
'use strict';
if(window.__ctR243)return;
window.__ctR243='home-interaction-bounded-metadata-canonical-catchup';
window.__ctR243Scope='home-only';
window.__ctR243MovieHydration='single-queue-max-3';
window.__ctR243SeriesAuthority='all-up-to-date-through-r176-canonical';

const CT243_MOVIE_MAX=3;
const CT243_SERIES_MAX=2;
const ct243MovieQueue=new Map(),ct243MovieDone=new Set();
const ct243SeriesQueue=new Map(),ct243SeriesChecked=new Set();
let ct243MovieActive=0,ct243SeriesActive=0,ct243MoviePumpTimer=0,ct243SeriesPumpTimer=0;

const ct243Num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const ct243MovieId=x=>ct243Num(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);
const ct243SeriesMediaId=x=>ct243Num(x?.media_id);
const ct243SeriesShowId=x=>ct243Num(typeof mediaTmdb==='function'?mediaTmdb(x):(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id));

function ct243ScheduleMoviePump(delay=16){
  if(ct243MoviePumpTimer||ct243MovieActive>=CT243_MOVIE_MAX)return;
  ct243MoviePumpTimer=setTimeout(()=>{ct243MoviePumpTimer=0;ct243PumpMovies()},delay);
}
function ct243PumpMovies(){
  if(route()!=='home')return;
  while(ct243MovieActive<CT243_MOVIE_MAX&&ct243MovieQueue.size){
    const first=ct243MovieQueue.entries().next().value;if(!first)break;
    const [id,x]=first;ct243MovieQueue.delete(id);
    if(ct243MovieDone.has(id))continue;
    const fetcher=window.__ctR243FetchMovieMeta;
    if(typeof fetcher!=='function'){ct243MovieQueue.set(id,x);return}
    ct243MovieActive++;
    Promise.resolve(fetcher(x)).catch(()=>{}).finally(()=>{
      ct243MovieActive--;ct243MovieDone.add(id);ct243ScheduleMoviePump(50);
    });
  }
}
window.__ctR243QueueMovieMeta=function(rows){
  for(const x of rows||[]){
    const id=ct243MovieId(x);if(id>0&&!ct243MovieDone.has(id)&&!ct243MovieQueue.has(id))ct243MovieQueue.set(id,x);
  }
  ct243ScheduleMoviePump();
};

const ct243SetQueueBase=ct176SetQueue;
ct176SetQueue=function(mediaId,queue){
  const pair=ct243SetQueueBase(mediaId,queue);
  const current=pair?.current||null;
  if(current&&homeCache?.series){
    const x=(homeCache.series||[]).find(v=>ct243SeriesMediaId(v)===ct243Num(mediaId));
    if(x&&x.home_bucket!=='completed'&&x.home_bucket!=='not_started'){
      const changed=x.home_bucket!=='continue'||x.is_caught_up!==false;
      x.home_bucket='continue';
      x.is_caught_up=false;
      x.history_missing_episodes=Math.max(1,ct243Num(x.history_missing_episodes));
      if(changed&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint();
    }
  }
  return pair;
};

function ct243SeriesKey(x){
  const mid=ct243SeriesMediaId(x),sid=ct243SeriesShowId(x);
  return mid>0?`m:${mid}`:sid>0?`t:${sid}`:'';
}
function ct243QueueCaughtUpSeries(){
  const rows=(homeCache?.series||[])
    .filter(x=>x&&x.home_bucket==='up_to_date'&&ct243SeriesShowId(x)>0&&ct243SeriesMediaId(x)>0)
    .sort((a,b)=>String(b.last_watched_at||'').localeCompare(String(a.last_watched_at||'')));
  for(const x of rows){
    const key=ct243SeriesKey(x);
    if(key&&!ct243SeriesChecked.has(key)&&!ct243SeriesQueue.has(key))ct243SeriesQueue.set(key,x);
  }
  ct243ScheduleSeriesPump();
}
function ct243ScheduleSeriesPump(delay=80){
  if(ct243SeriesPumpTimer||ct243SeriesActive>=CT243_SERIES_MAX)return;
  ct243SeriesPumpTimer=setTimeout(()=>{ct243SeriesPumpTimer=0;ct243PumpSeries()},delay);
}
function ct243PumpSeries(){
  if(route()!=='home')return;
  while(ct243SeriesActive<CT243_SERIES_MAX&&ct243SeriesQueue.size){
    const first=ct243SeriesQueue.entries().next().value;if(!first)break;
    const [key,x]=first;ct243SeriesQueue.delete(key);
    if(ct243SeriesChecked.has(key))continue;
    ct243SeriesChecked.add(key);ct243SeriesActive++;
    Promise.resolve(ct176PrimeCanonical(x,true)).catch(()=>null).finally(()=>{
      ct243SeriesActive--;ct243ScheduleSeriesPump(120);
    });
  }
}

const ct243PaintHomeBase=paintHome;
paintHome=function(){
  const out=ct243PaintHomeBase();
  ct243ScheduleMoviePump(20);
  ct243QueueCaughtUpSeries();
  return out;
};

document.addEventListener('cinetracker:data-changed',()=>{
  ct243SeriesChecked.clear();ct243SeriesQueue.clear();
  if(route()==='home')setTimeout(ct243QueueCaughtUpSeries,80);
});
window.addEventListener('pageshow',()=>{
  if(route()==='home'){ct243ScheduleMoviePump(20);ct243QueueCaughtUpSeries()}
});
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&route()==='home'){ct243ScheduleMoviePump(20);ct243QueueCaughtUpSeries()}
});

window.__ctR243Debug=()=>({
  movieActive:ct243MovieActive,movieQueued:ct243MovieQueue.size,movieDone:ct243MovieDone.size,
  seriesActive:ct243SeriesActive,seriesQueued:ct243SeriesQueue.size,seriesChecked:ct243SeriesChecked.size
});
})();
