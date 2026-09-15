/* CineTracker Web 1.0.78 / r287 — Home interaction liveness + generic available-episode priority. */
(()=>{
'use strict';
if(window.__ctR287)return;
window.__ctR287='home-interaction-liveness+available-episode-priority';
window.__ctR287Home='pointer-click-authority+overlay-hit-test';
window.__ctR287Series='urgent-availability-before-budget';
window.__ctR287Frozen='r286-related-actions+r285-atomic-home+r284-imported-series+discover+sports+android-preserved';

const CT287_ACTIVE_BUCKETS=new Set(['continue','up_to_date','dust']);
let ct287Pointer=null,ct287LastActivation=null;
const ct287N=v=>Number.isFinite(Number(v))?Number(v):0;
const ct287NowDay=()=>{try{return localDay()}catch{return new Date().toISOString().slice(0,10)}};

function ct287Urgent(row){
 if(ct287N(row?.watched_episodes)<=0||!CT287_ACTIVE_BUCKETS.has(String(row?.home_bucket||'')))return false;
 const watched=ct287N(row?.watched_episodes),released=ct287N(row?.released_episodes),available=ct287N(row?.available_episodes),missing=ct287N(row?.history_missing_episodes);
 const s=ct287N(row?.next_season_number),e=ct287N(row?.next_episode_number),air=String(row?.next_episode_air_date||'');
 return available>0||missing>0||(released>watched)||(s>0&&e>0&&(!air||air<=ct287NowDay()));
}
function ct287WatchTime(row){return Date.parse(row?.last_watched_at||row?.watched_at||0)||0}
function ct287Candidates(rows){
 const active=(rows||[]).filter(x=>ct287N(x?.watched_episodes)>0&&CT287_ACTIVE_BUCKETS.has(String(x?.home_bucket||'')));
 const urgent=active.filter(ct287Urgent).sort((a,b)=>ct287WatchTime(b)-ct287WatchTime(a));
 const urgentSet=new Set(urgent),rest=active.filter(x=>!urgentSet.has(x)).sort((a,b)=>ct287WatchTime(b)-ct287WatchTime(a));
 return [...urgent,...rest.slice(0,Math.max(0,40-urgent.length))];
}

/* r285 remains the Home producer. r287 only changes candidate selection: every row that already signals
   released/unwatched availability is reconciled even when it is outside the old first-40 window. */
async function ct287PrepareHome(payload,seq){
 const rows=ct275DedupSeries(payload?.series||[]).map(ct285CloneRow);
 try{
  const state=await ct275FetchWatchState(rows);
  if(seq!==ct285HomeSeq||ct274Payload()!==payload)return;
  ct275ApplyWatchState(rows,state);
  await ct275MapLimit(ct287Candidates(rows),6,ct275ReconcileOne);
 }catch(_){/* Preserve payload if enrichment is unavailable. */}
 if(seq!==ct285HomeSeq||ct274Payload()!==payload)return;
 ct285HomePayload=payload;
 ct285CommittedRows=rows.map(ct285CloneRow);
 ct275SourcePayload=payload;
 ct275CanonicalSeries=ct285CommittedRows.map(ct285CloneRow);
 ct285PaintBase();
 ct285DecorateCovers(document);
}
ct285PrepareHome=ct287PrepareHome;

function ct287BlockedTarget(target){
 return target?.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct284-season],[data-ct284-back],[data-ct285-watch],[data-ct285-season],[data-ct285-back],[data-ct169-related-watch],[data-ct169-related-seen],input,textarea,select')||null;
}
function ct287Match(node,home){
 const hit=node?.closest?.('[data-home-tab],[data-nav],[data-media]')||null;
 return hit&&((hit.closest?.('[data-home]')===home)||hit.matches?.('[data-nav]'))?hit:null;
}
function ct287Target(e){
 if(route()!=='home')return null;
 const home=document.querySelector('[data-home]');if(!home||ct287BlockedTarget(e.target))return null;
 const direct=ct287Match(e.target,home);if(direct)return direct;
 if(Number.isFinite(e.clientX)&&Number.isFinite(e.clientY)&&typeof document.elementsFromPoint==='function'){
  for(const el of document.elementsFromPoint(e.clientX,e.clientY)){const hit=ct287Match(el,home);if(hit&&!ct287BlockedTarget(el))return hit}
 }
 return null;
}
function ct287Special(target){try{return typeof ct284Kind==='function'?ct284Kind(target):''}catch{return''}}
function ct287Stop(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
function ct287Activate(e,target=ct287Target(e)){
 if(!target)return false;
 if(target.matches('[data-home-tab]')){
  const tab=target.dataset.homeTab==='movies'?'movies':'series';ct287Stop(e);
  try{ct266HomeTab=tab}catch{}
  if(typeof ct279ApplyHomeTab==='function')ct279ApplyHomeTab(tab);else if(typeof ct266ApplyHomeTab==='function')ct266ApplyHomeTab(tab);
  return true;
 }
 if(target.matches('[data-nav]')){
  const key=target.dataset.nav;if(!key)return false;ct287Stop(e);
  const dest=typeof pathFor==='function'?pathFor(key):('/'+key);if(typeof go==='function')go(dest);return true;
 }
 if(target.matches('[data-media]')){
  if(ct287Special(target))return false;
  const [rawType,rawId]=String(target.dataset.media||'').split(':'),id=ct287N(rawId),type=rawType==='movie'?'movie':rawType==='tv'?'tv':'';
  if(!type||!(id>0))return false;ct287Stop(e);if(typeof go==='function')go(`/${type==='movie'?'movie':'series'}/${id}`);return true;
 }
 return false;
}
function ct287SameActivation(target){return ct287LastActivation?.target===target&&Date.now()-ct287LastActivation.at<900}
window.addEventListener('pointerdown',e=>{if(route()!=='home')return;ct287Pointer={id:e.pointerId,x:e.clientX,y:e.clientY,at:Date.now()}},true);
window.addEventListener('pointerup',e=>{
 if(route()!=='home')return;const p=ct287Pointer;ct287Pointer=null;if(!p||p.id!==e.pointerId||Math.hypot(e.clientX-p.x,e.clientY-p.y)>12)return;
 const target=ct287Target(e);if(!target)return;if(ct287Activate(e,target))ct287LastActivation={target,at:Date.now()};
},true);
window.addEventListener('pointercancel',()=>{ct287Pointer=null},true);
window.addEventListener('click',e=>{if(route()!=='home')return;const target=ct287Target(e);if(!target)return;if(ct287SameActivation(target)){ct287Stop(e);return}if(ct287Activate(e,target))ct287LastActivation={target,at:Date.now()}},true);
window.addEventListener('keydown',e=>{if(route()!=='home'||(e.key!=='Enter'&&e.key!==' '))return;const target=ct287Target(e);if(target)ct287Activate(e,target)},true);

window.__ctR287Test={urgent:ct287Urgent,candidates:ct287Candidates,prepareHome:ct287PrepareHome,target:ct287Target,activate:ct287Activate,blocked:ct287BlockedTarget};
})();
