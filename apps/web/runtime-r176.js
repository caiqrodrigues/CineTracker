/* r176 — gap-safe next episode authority: first released unwatched episode always wins */
window.__ctR176='first-released-unwatched-gap-authority';
window.__ct176Rule='next=lowest-released-episode-not-watched-never-last-pointer-plus-one';
window.__ct176Undo='unwatch-rewinds-next-episode-and-successor-queue';

const ct176EpisodeQueues=new Map();
const ct176PrimePromises=new Map();

function ct176EpisodeKey(sn,en){return Number(sn)+':'+Number(en)}
function ct176PickUnwatched(rows,watched,limit=6){
  const out=[];
  for(const row of rows||[]){
    const sn=Number(row?.season||row?.season_number||0),en=Number(row?.episode||row?.episode_number||0);
    if(!(sn>0&&en>0)||watched.has(ct176EpisodeKey(sn,en)))continue;
    out.push(row);if(out.length>=limit)break;
  }
  return out;
}
function ct176SetQueue(mediaId,queue){
  mediaId=Number(mediaId);const q=(queue||[]).filter(Boolean);ct176EpisodeQueues.set(mediaId,q);
  ct175EpisodePairs.set(mediaId,{current:q[0]||null,next:q[1]||null});
  if(q[0])ct174NextEpisodeCache.set(mediaId,Promise.resolve(q[0]));else ct174NextEpisodeCache.delete(mediaId);
  return ct175EpisodePairs.get(mediaId);
}
function ct176ClearMedia(mediaId){
  mediaId=Number(mediaId);ct176EpisodeQueues.delete(mediaId);ct175EpisodePairs.delete(mediaId);ct174NextEpisodeCache.delete(mediaId);ct176PrimePromises.delete(mediaId);
}
async function ct176ReleasedUnwatched(showId,watched,limit=6){
  showId=Number(showId);if(!(showId>0))return[];
  const today=localDay(),show=await tmdb('/tv/'+showId),counts=new Map();
  for(const key of watched||[]){const sn=Number(String(key).split(':')[0]||0);if(sn>0)counts.set(sn,(counts.get(sn)||0)+1)}
  const seasons=(show?.seasons||[]).filter(s=>Number(s.season_number)>0).sort((a,b)=>Number(a.season_number)-Number(b.season_number));
  const out=[];
  for(const s of seasons){
    const sn=Number(s.season_number),declared=Math.max(0,Number(s.episode_count||0)),seen=counts.get(sn)||0;
    if(declared>0&&seen>=declared)continue;
    let sd;try{sd=await ct172Season(showId,sn)}catch{continue}
    const released=(sd?.episodes||[]).filter(ep=>Number(ep.episode_number)>0&&ep.air_date&&String(ep.air_date).slice(0,10)<=today).sort((a,b)=>Number(a.episode_number)-Number(b.episode_number)).map(ep=>({season:sn,episode:Number(ep.episode_number),title:ep.name||null,runtime:Number(ep.runtime||0)||null,status:show?.status||null,vote_average:Number(ep.vote_average||0),air_date:String(ep.air_date||'').slice(0,10)}));
    const missing=ct176PickUnwatched(released,watched,limit-out.length);out.push(...missing);if(out.length>=limit)break;
  }
  return out;
}
async function ct176PrimeWithWatched(x,watched,force=false){
  const mediaId=Number(x?.media_id||0),showId=mediaTmdb(x);if(!(mediaId>0&&showId>0))return null;
  if(!force&&ct176EpisodeQueues.has(mediaId))return ct175EpisodePairs.get(mediaId)||ct176SetQueue(mediaId,ct176EpisodeQueues.get(mediaId));
  if(!force&&ct176PrimePromises.has(mediaId))return ct176PrimePromises.get(mediaId);
  const task=(async()=>{const queue=await ct176ReleasedUnwatched(showId,watched,6);return ct176SetQueue(mediaId,queue)})().catch(()=>null).finally(()=>ct176PrimePromises.delete(mediaId));
  ct176PrimePromises.set(mediaId,task);return task;
}
async function ct176PrimeCanonical(x,force=false){
  const mediaId=Number(x?.media_id||0),showId=mediaTmdb(x);if(!(mediaId>0&&showId>0))return null;
  if(!force&&ct176EpisodeQueues.has(mediaId))return ct175EpisodePairs.get(mediaId)||null;
  if(!force&&ct176PrimePromises.has(mediaId))return ct176PrimePromises.get(mediaId);
  const task=(async()=>{const watched=await ct169WatchedSet(showId);const queue=await ct176ReleasedUnwatched(showId,watched,6);return ct176SetQueue(mediaId,queue)})().catch(()=>null).finally(()=>ct176PrimePromises.delete(mediaId));
  ct176PrimePromises.set(mediaId,task);return task;
}

/* Never derive next from last_season/last_episode. Gaps have priority. */
findNextReleasedEpisode158=async function(x){
  const mediaId=Number(x?.media_id||0),showId=mediaTmdb(x);if(!(mediaId>0&&showId>0))throw new Error('Série sem identidade válida');
  const pair=await ct176PrimeCanonical(x,false);return pair?.current||null;
};

/* Replace r175 prewarmer with canonical watched-set queue. */
ct175PrimeOne=async function(x){return ct176PrimeCanonical(x,false)};
ct175PrimeHome=function(){
  for(const x of (homeCache?.series||[]).filter(v=>!v?.is_caught_up||Number(v?.history_missing_episodes||0)>0).slice(0,24))void ct176PrimeCanonical(x,false);
};

/* Home marking consumes the precomputed gap queue, so 5 seen + 6 unseen + 7 seen => current 6, successor 8. */
markNextEpisode158=async function(mediaId){
  mediaId=Number(mediaId);if(ct174BusyMedia.has(mediaId))return;
  const x=(homeCache?.series||[]).find(v=>Number(v.media_id)===mediaId);if(!x)return;ct174BusyMedia.add(mediaId);
  const backup={series:(homeCache?.series||[]).slice(),hist:(homeCache?.history_episodes||[]).slice(),row:{...x},queue:(ct176EpisodeQueues.get(mediaId)||[]).slice(),pair:ct175EpisodePairs.has(mediaId)?structuredClone(ct175EpisodePairs.get(mediaId)):undefined};
  const btn=document.querySelector(`[data-home-mark-episode="${mediaId}"]`);if(btn){btn.classList.add('ct174-pending');btn.textContent='✓'}
  try{
    if(!ct176EpisodeQueues.get(mediaId)?.length)await ct176PrimeCanonical(x,true);
    const queue=(ct176EpisodeQueues.get(mediaId)||[]).slice(),ep=queue[0];if(!ep){ct174Flash('Nenhum episódio lançado pendente.','warn');return}
    const remaining=queue.slice(1),successor=remaining[0]||null;
    ct174OptimisticHomeEpisode(x,ep);ct176SetQueue(mediaId,remaining);paintHome();
    ct174Flash(x.is_caught_up?'Você está em dia':successor?`Agora: ${successor.title||('S'+successor.season+' E'+successor.episode)}`:'Episódio atualizado');
    await rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(x.media_id),p_season_number:Number(ep.season),p_episode_number:Number(ep.episode),p_title:ep.title,p_runtime_minutes:ep.runtime,p_released_episodes:Number(x.released_episodes||0)||null,p_series_status:ep.status,p_watched_at:new Date().toISOString()});
    profileCache=null;discoverCache.clear();ct171SeenMap=null;
    void ct176PrimeCanonical(x,true);void ct174RefreshHome('home-watch-r176');
  }catch(e){
    if(homeCache){homeCache.series=backup.series;homeCache.history_episodes=backup.hist;const cur=(homeCache.series||[]).find(v=>Number(v.media_id)===mediaId);if(cur)Object.assign(cur,backup.row)}
    ct176EpisodeQueues.set(mediaId,backup.queue);if(backup.pair!==undefined)ct175EpisodePairs.set(mediaId,backup.pair);else ct175EpisodePairs.delete(mediaId);if(backup.queue[0])ct174NextEpisodeCache.set(mediaId,Promise.resolve(backup.queue[0]));else ct174NextEpisodeCache.delete(mediaId);
    paintHome();ct174Flash('Não foi possível sincronizar. Alteração revertida.','warn');toast(e?.message||e);
  }finally{ct174BusyMedia.delete(mediaId);const b=document.querySelector(`[data-home-mark-episode="${mediaId}"]`);if(b)b.classList.remove('ct174-pending')}
};

/* Unwatch invalidates the forward pointer immediately and seeds the queue from the drawer's full logical watched set. */
const ct176UnmarkEpisodeBase=ct174UnmarkEpisode;
ct174UnmarkEpisode=async function(sn,en){
  const st=ct169DrawerState,key=ct176EpisodeKey(sn,en),showId=Number(st?.showId||0);let mediaId=0,x=null;
  if(showId>0&&homeCache?.series){x=(homeCache.series||[]).find(v=>mediaTmdb(v)===showId)||null;mediaId=Number(x?.media_id||0)}
  if(mediaId>0)ct176ClearMedia(mediaId);else{ct176EpisodeQueues.clear();ct175EpisodePairs.clear();ct174NextEpisodeCache.clear()}
  if(st&&showId>0&&x){const localWatched=new Set(st.watched);localWatched.delete(key);void ct176PrimeWithWatched(x,localWatched,true)}
  return ct176UnmarkEpisodeBase(sn,en);
};

/* Every reconciliation rebuilds next from truth, never from the previous pointer. */
window.addEventListener('cinetracker:data-changed',()=>{
  ct176EpisodeQueues.clear();ct175EpisodePairs.clear();ct174NextEpisodeCache.clear();
  setTimeout(()=>{if(route()==='home'&&homeCache)ct175PrimeHome()},0);
});
