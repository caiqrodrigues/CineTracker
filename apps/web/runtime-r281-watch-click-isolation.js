/* CineTracker Web 1.0.72 / r281 — isolate watched action from generic card navigation and legacy repaint churn. */
window.__ctR281='watch-click-isolation+single-owner-refresh';
window.__ctR281Watch='window-capture+no-card-navigation+no-data-changed-broadcast';
window.__ctR281Layout='inline-check+stable-home-producer';
window.__ctR281Frozen='r280-minimal-check+r279-writer-contract+r278-fixed-tabs+r277-sidebar+r276-history+android-preserved';

const ct281BaseReconcile=ct279ReconcileWatchButtons;
const ct281BaseSchedule=ct279ScheduleReconcile;
let ct281WatchBusy=false,ct281ReconcileToken=0;

function ct281Home(root=document){return root?.matches?.('[data-home]')?root:root?.querySelector?.('[data-home]')}
function ct281NormalizeHome(root=document){
 const home=ct281Home(root);if(!home)return 0;let changed=0;
 try{if(typeof ct280NormalizeButtons==='function')changed+=Number(ct280NormalizeButtons(home)||0)}catch{}
 for(const card of home.querySelectorAll('.media-row[data-media],.ct274-media-card[data-media]')){
  const current=[...card.querySelectorAll(':scope > [data-ct279-watch]')];
  if(current.length){card.classList.add('ct279-watch-host','ct281-watch-host');for(const extra of current.slice(1)){extra.remove();changed++}}
  for(const old of card.querySelectorAll(':scope > [data-ct266-watch]:not([data-ct279-watch])')){old.remove();changed++}
 }
 return changed
}
function ct281ReconcileWatchButtons(root=document){let changed=0;try{changed+=Number(ct281BaseReconcile(root)||0)}catch{}changed+=ct281NormalizeHome(root);return changed}
function ct281ScheduleReconcile(){const token=++ct281ReconcileToken;for(const ms of [0,120,420])setTimeout(()=>{if(token!==ct281ReconcileToken||route()!=='home')return;ct281ReconcileWatchButtons(document)},ms)}

async function ct281MarkWatched(action){
 if(!action||ct281WatchBusy||route()!=='home')return;
 const kind=action.dataset.ct279Watch,tmdbId=Number(action.dataset.tmdb||0),s=Number(action.dataset.season||0),e=Number(action.dataset.episode||0);
 if(!(tmdbId>0)||!['movie','episode'].includes(kind)||(kind==='episode'&&(!(s>0)||!(e>0))))return;
 const keep=typeof ct279CurrentHomeTab==='function'?ct279CurrentHomeTab():'series';
 ct281WatchBusy=true;action.disabled=true;action.setAttribute('aria-busy','true');action.setAttribute('aria-disabled','true');if(typeof ct280SetActive==='function')ct280SetActive(action,true);
 try{
  if(typeof ensureMedia!=='function'||typeof rpc!=='function')throw new Error('Writer de assistidos indisponível');
  const media=await ensureMedia(kind==='episode'?'tv':'movie',tmdbId);
  await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(media.id),p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?e:null,p_title:action.dataset.title||media.title||null,p_runtime_minutes:Number(media.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});
  if(typeof ct275ReloadHome==='function')await ct275ReloadHome('r281-watch');
  else if(typeof ct274FetchHome==='function'){try{homeCache=await ct274FetchHome()}catch{};if(route()==='home'&&typeof paintHome==='function')paintHome()}
  if(route()==='home'){
   if(typeof ct279ApplyHomeTab==='function')ct279ApplyHomeTab(keep);
   ct281ReconcileWatchButtons(document);ct281ScheduleReconcile();
  }
  try{profileCache=null;discoverCache?.clear?.()}catch{}
  try{toast(kind==='episode'?'Episódio marcado como assistido':'Filme marcado como assistido')}catch{}
 }catch(err){
  if(action.isConnected){action.disabled=false;action.removeAttribute('aria-busy');action.removeAttribute('aria-disabled');if(typeof ct280SetActive==='function')ct280SetActive(action,false)}
  try{toast(err?.message||String(err))}catch{}
 }finally{ct281WatchBusy=false}
}

function ct281CaptureWatchClick(e){
 const action=e.target?.closest?.('[data-ct279-watch]');if(!action)return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void ct281MarkWatched(action)
}
function ct281CaptureWatchKey(e){
 const action=e.target?.closest?.('[data-ct279-watch]');if(!action||(e.key!=='Enter'&&e.key!==' '))return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void ct281MarkWatched(action)
}

ct279ReconcileWatchButtons=ct281ReconcileWatchButtons;
ct279ScheduleReconcile=ct281ScheduleReconcile;
ct279MarkWatched=ct281MarkWatched;
window.addEventListener('click',ct281CaptureWatchClick,true);
window.addEventListener('keydown',ct281CaptureWatchKey,true);
ct281ReconcileWatchButtons(document);ct281ScheduleReconcile();
window.__ctR281Test={normalizeHome:ct281NormalizeHome,reconcile:ct281ReconcileWatchButtons,schedule:ct281ScheduleReconcile,markWatched:ct281MarkWatched,captureClick:ct281CaptureWatchClick,captureKey:ct281CaptureWatchKey,baseReconcile:ct281BaseReconcile,baseSchedule:ct281BaseSchedule};
