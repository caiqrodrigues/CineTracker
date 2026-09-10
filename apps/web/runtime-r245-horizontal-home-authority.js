/* CineTracker Web 1.0.36 r245 — WEB ONLY.
   Restore real horizontal drag for detail carousels/charts and audit every started
   series through the canonical released-unwatched authority before secondary movie metadata. */
(()=>{
'use strict';
if(window.__ctR245)return;
window.__ctR245='real-horizontal-drag-and-started-series-authority';
window.__ctR245Scope='web-only';
window.__ctR245Horizontal='ct169-real-scrollers-pointer-drag';
window.__ctR245SeriesAuthority='all-started-series-through-r176-canonical';
window.__ctR245HomePriority='series-before-secondary-movie-metadata';

const ct245Num=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const CT245_SERIES_MAX=4;
const CT245_PRIORITY_BATCH=12;
const CT245_SCROLLER_SELECTOR='.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll';

/* Horizontal drag authority: vertical finger movement remains native page scrolling;
   horizontal movement is owned by the intended local scroller. */
const ct245Wired=new WeakSet();
function ct245WireScroller(el){
  if(!el||ct245Wired.has(el))return;
  ct245Wired.add(el);el.classList.add('ct-r245-real-horizontal');
  let pid=null,startX=0,startY=0,startScroll=0,axis='',suppressUntil=0;
  const finish=()=>{
    if(pid!==null){try{el.releasePointerCapture?.(pid)}catch{}}
    pid=null;axis='';el.classList.remove('ct-r245-dragging');
  };
  el.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    if(el.scrollWidth<=el.clientWidth+1)return;
    pid=e.pointerId;startX=e.clientX;startY=e.clientY;startScroll=el.scrollLeft;axis='';
  },{passive:true});
  el.addEventListener('pointermove',e=>{
    if(pid!==e.pointerId)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(!axis){
      if(Math.max(Math.abs(dx),Math.abs(dy))<5)return;
      axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
      if(axis==='y'){finish();return;}
      try{el.setPointerCapture?.(e.pointerId)}catch{}
      el.classList.add('ct-r245-dragging');
    }
    if(axis!=='x')return;
    el.scrollLeft=startScroll-dx;suppressUntil=Date.now()+220;e.preventDefault();
  },{passive:false});
  el.addEventListener('pointerup',finish,{passive:true});
  el.addEventListener('pointercancel',finish,{passive:true});
  el.addEventListener('lostpointercapture',()=>{pid=null;axis='';el.classList.remove('ct-r245-dragging')},{passive:true});
  el.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopPropagation()}},true);
}
function ct245WireHorizontal(root=document){
  if(root?.matches?.(CT245_SCROLLER_SELECTOR))ct245WireScroller(root);
  for(const el of root?.querySelectorAll?.(CT245_SCROLLER_SELECTOR)||[])ct245WireScroller(el);
}
const ct245HorizontalObserver=new MutationObserver(ms=>{
  for(const m of ms)for(const node of m.addedNodes)if(node?.nodeType===1)ct245WireHorizontal(node);
});
ct245HorizontalObserver.observe(document.documentElement,{childList:true,subtree:true});
ct245WireHorizontal();
window.__ctR245WireHorizontal=ct245WireHorizontal;

/* Canonical Home authority. A released unwatched episode always forces Continue,
   even when preview/cache/RPC had stale up_to_date/completed/other bucket state. */
const ct245MediaId=x=>ct245Num(x?.media_id||x?.mediaId);
const ct245ShowId=x=>ct245Num(typeof mediaTmdb==='function'?mediaTmdb(x):(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id));
function ct245Started(x){
  if(!x)return false;
  if(ct245Num(x.watched_episodes||x.episodes_watched||x.watched_count||x.history_watched_episodes)>0)return true;
  if(ct245Num(x.last_season||x.last_episode||x.current_season||x.current_episode)>0)return true;
  if(x.last_watched_at||x.last_watch_at||x.started_at)return true;
  return ['continue','up_to_date','completed'].includes(String(x.home_bucket||''));
}
function ct245Fingerprint(x){
  return [x?.home_bucket,ct245Num(x?.watched_episodes||x?.episodes_watched||x?.watched_count),x?.last_watched_at||x?.last_watch_at||'',ct245Num(x?.history_missing_episodes),String(x?.is_caught_up)].join('|');
}
function ct245Priority(x){
  const b=String(x?.home_bucket||'');
  if(b==='up_to_date')return 0;
  if(b==='completed')return 1;
  if(b!=='continue')return 2;
  return 3;
}
function ct245ApplyCanonical(mediaId,current){
  if(!current||!homeCache?.series)return false;
  const row=(homeCache.series||[]).find(x=>ct245MediaId(x)===ct245Num(mediaId));
  if(!row||!ct245Started(row))return false;
  const changed=row.home_bucket!=='continue'||row.is_caught_up!==false||ct245Num(row.history_missing_episodes)<1;
  row.home_bucket='continue';row.is_caught_up=false;row.history_missing_episodes=Math.max(1,ct245Num(row.history_missing_episodes));
  if(changed&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint();
  return changed;
}

if(typeof ct176SetQueue==='function'){
  const ct245SetQueueBase=ct176SetQueue;
  ct176SetQueue=function(mediaId,queue){
    const pair=ct245SetQueueBase(mediaId,queue);
    if(pair?.current)ct245ApplyCanonical(mediaId,pair.current);
    return pair;
  };
}

const ct245AuditQueue=[];
const ct245Queued=new Set();
const ct245Fingerprints=new Map();
let ct245AuditActive=0,ct245PriorityOutstanding=0,ct245InitialReleased=false,ct245MovieFailSafe=0;
const ct245DeferredMovies=new Map();
let ct245MovieQueueBase=typeof window.__ctR243QueueMovieMeta==='function'?window.__ctR243QueueMovieMeta:null;

function ct245ReleaseMovies(){
  if(ct245InitialReleased)return;
  ct245InitialReleased=true;
  if(ct245MovieFailSafe){clearTimeout(ct245MovieFailSafe);ct245MovieFailSafe=0}
  if(!ct245MovieQueueBase)return;
  const rows=[...ct245DeferredMovies.values()];ct245DeferredMovies.clear();
  if(rows.length)ct245MovieQueueBase(rows);
}
if(ct245MovieQueueBase){
  window.__ctR243QueueMovieMeta=function(rows){
    if(route()==='home'&&!ct245InitialReleased&&ct245StartedSeriesAvailable()){
      for(const x of rows||[]){const id=ct245Num(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);if(id>0&&!ct245DeferredMovies.has(id))ct245DeferredMovies.set(id,x)}
      return;
    }
    return ct245MovieQueueBase(rows);
  };
}
function ct245StartedSeriesAvailable(){
  return (homeCache?.series||[]).some(x=>ct245Started(x)&&ct245MediaId(x)>0&&ct245ShowId(x)>0);
}
async function ct245RunAudit(item){
  try{
    const row=(homeCache?.series||[]).find(x=>ct245MediaId(x)===item.mid)||item.row;
    if(!row||!ct245Started(row)||!(ct245MediaId(row)>0&&ct245ShowId(row)>0))return;
    const pair=await ct176PrimeCanonical(row,true);
    if(pair?.current)ct245ApplyCanonical(item.mid,pair.current);
    ct245Fingerprints.set(item.mid,ct245Fingerprint(row));
  }catch(e){console.warn('r245 series audit failed',item.mid,e)}
  finally{
    ct245Queued.delete(item.mid);ct245AuditActive--;
    if(item.priority)ct245PriorityOutstanding=Math.max(0,ct245PriorityOutstanding-1);
    if(!ct245InitialReleased&&ct245PriorityOutstanding===0)ct245ReleaseMovies();
    ct245PumpAudits();
  }
}
function ct245PumpAudits(){
  if(route()!=='home')return;
  while(ct245AuditActive<CT245_SERIES_MAX&&ct245AuditQueue.length){
    const item=ct245AuditQueue.shift();ct245AuditActive++;void ct245RunAudit(item);
  }
}
function ct245QueueStarted(force=false){
  if(route()!=='home')return;
  const rows=(homeCache?.series||[])
    .filter(x=>ct245Started(x)&&ct245MediaId(x)>0&&ct245ShowId(x)>0)
    .sort((a,b)=>ct245Priority(a)-ct245Priority(b)||String(b.last_watched_at||b.last_watch_at||'').localeCompare(String(a.last_watched_at||a.last_watch_at||'')));
  let rank=0;
  for(const row of rows){
    const mid=ct245MediaId(row),fp=ct245Fingerprint(row);
    if(ct245Queued.has(mid)||(!force&&ct245Fingerprints.get(mid)===fp))continue;
    const priority=rank++<CT245_PRIORITY_BATCH;
    ct245Queued.add(mid);ct245AuditQueue.push({mid,row,priority});if(priority)ct245PriorityOutstanding++;
  }
  ct245PumpAudits();
  if(!ct245PriorityOutstanding&&ct245AuditActive===0)ct245ReleaseMovies();
  else if(!ct245MovieFailSafe)ct245MovieFailSafe=setTimeout(ct245ReleaseMovies,1400);
}
function ct245Kick(force=false){
  if(route()!=='home')return;
  if(!ct245InitialReleased&&ct245StartedSeriesAvailable())ct245QueueStarted(force);
  else ct245QueueStarted(force);
}

const ct245PrimeHomeBase=typeof ct175PrimeHome==='function'?ct175PrimeHome:null;
if(ct245PrimeHomeBase){
  ct175PrimeHome=function(){const out=ct245PrimeHomeBase.apply(this,arguments);queueMicrotask(()=>ct245Kick(false));return out};
}
const ct245PaintHomeBase=paintHome;
paintHome=function(){const out=ct245PaintHomeBase.apply(this,arguments);queueMicrotask(()=>ct245Kick(false));return out};
document.addEventListener('cinetracker:data-changed',()=>queueMicrotask(()=>ct245Kick(false)));
window.addEventListener('pageshow',()=>queueMicrotask(()=>ct245Kick(false)));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)queueMicrotask(()=>ct245Kick(false))});
queueMicrotask(()=>ct245Kick(false));

window.__ctR245AuditStarted=()=>ct245Kick(true);
window.__ctR245Debug=()=>({auditActive:ct245AuditActive,auditQueued:ct245AuditQueue.length,tracked:ct245Fingerprints.size,priorityOutstanding:ct245PriorityOutstanding,moviesReleased:ct245InitialReleased,deferredMovies:ct245DeferredMovies.size});
})();
