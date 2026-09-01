/* r175 — Bingers-like next episode handoff: prewarm current+successor metadata */
window.__ctR175='bingers-next-episode-instant-handoff';
window.__ct175Home='current-next-successor-prewarmed-name-score-date';

const ct175EpisodePairs=new Map();
const ct175PairPromises=new Map();
let ct175PaintTimer=0;

function ct175SchedulePaint(){
  if(route()!=='home'||ct175PaintTimer)return;
  ct175PaintTimer=setTimeout(()=>{ct175PaintTimer=0;if(route()==='home'&&homeCache)paintHome()},32);
}
async function ct175EpisodeMeta(showId,ep){
  if(!ep||!(showId>0))return ep||null;
  try{
    const sd=await ct172Season(showId,Number(ep.season));
    const row=(sd?.episodes||[]).find(v=>Number(v.episode_number)===Number(ep.episode));
    if(row)return {...ep,title:String(row.name||ep.title||'').trim()||null,runtime:Number(row.runtime||ep.runtime||0)||null,vote_average:Number(row.vote_average||0),air_date:String(row.air_date||'').slice(0,10)};
  }catch{}
  return {...ep,vote_average:Number(ep.vote_average||0),air_date:String(ep.air_date||'').slice(0,10)};
}
async function ct175ReleasedAfter(showId,ep){
  if(!ep||!(showId>0))return null;
  const today=localDay(),startS=Number(ep.season||1),startE=Number(ep.episode||0);
  try{
    const show=await tmdb('/tv/'+showId),sns=(show?.seasons||[]).map(s=>Number(s.season_number||0)).filter(n=>n>0&&n>=startS).sort((a,b)=>a-b);
    for(const sn of sns){
      const sd=await ct172Season(showId,sn),eps=(sd?.episodes||[]).filter(x=>Number(x.episode_number)>0&&x.air_date&&String(x.air_date).slice(0,10)<=today).sort((a,b)=>Number(a.episode_number)-Number(b.episode_number));
      for(const row of eps){const en=Number(row.episode_number);if(sn===startS&&en<=startE)continue;return {season:sn,episode:en,title:row.name||null,runtime:Number(row.runtime||0)||null,status:show.status||null,vote_average:Number(row.vote_average||0),air_date:String(row.air_date||'').slice(0,10)}}
    }
  }catch{}
  return null;
}
async function ct175PrimeOne(x){
  const mid=Number(x?.media_id||0),showId=mediaTmdb(x);if(!(mid>0&&showId>0)||x?.is_caught_up)return null;
  if(ct175PairPromises.has(mid))return ct175PairPromises.get(mid);
  const task=(async()=>{
    const existing=ct175EpisodePairs.get(mid);
    if(existing?.current){
      if(existing.next===undefined){existing.next=await ct175ReleasedAfter(showId,existing.current);ct175EpisodePairs.set(mid,existing);ct175SchedulePaint()}
      return existing;
    }
    let p=ct174NextEpisodeCache.get(mid);if(!p){p=Promise.resolve(findNextReleasedEpisode158(x));ct174NextEpisodeCache.set(mid,p)}
    let current=await p;if(!current){ct175EpisodePairs.set(mid,{current:null,next:null});return null}
    current=await ct175EpisodeMeta(showId,current);
    const next=await ct175ReleasedAfter(showId,current);
    const pair={current,next};ct175EpisodePairs.set(mid,pair);
    ct174NextEpisodeCache.set(mid,Promise.resolve(current));ct175SchedulePaint();return pair;
  })().catch(()=>null).finally(()=>ct175PairPromises.delete(mid));
  ct175PairPromises.set(mid,task);return task;
}
function ct175PrimeHome(){
  for(const x of (homeCache?.series||[]).filter(v=>!v?.is_caught_up).slice(0,24))void ct175PrimeOne(x);
}

const ct175HomeSeriesRowBase=homeSeriesRow158;
homeSeriesRow158=function(x){
  const pair=ct175EpisodePairs.get(Number(x?.media_id||0)),ep=pair?.current;
  if(!ep)return ct175HomeSeriesRowBase(x);
  const y={...x,latest_episode_meta_season_number:Number(ep.season||0),latest_episode_meta_episode_number:Number(ep.episode||0),latest_episode_name:ep.title||null,latest_episode_vote_average:Number(ep.vote_average||0),latest_episode_air_date:ep.air_date||null};
  return ct175HomeSeriesRowBase(y).replace('class="ct172-home-episode"','class="ct172-home-episode ct175-next-episode"').replace('<span data-ct172-ep-name>Ep: ','<span data-ct172-ep-name>Próximo: ');
};

const ct175PaintHomeBase=paintHome;
paintHome=function(){ct175PaintHomeBase();requestAnimationFrame(ct175PrimeHome)};

/* Replace r174 Home action so current -> successor is already in memory at click time. */
markNextEpisode158=async function(mediaId){
  mediaId=Number(mediaId);if(ct174BusyMedia.has(mediaId))return;
  const x=(homeCache?.series||[]).find(v=>Number(v.media_id)===mediaId);if(!x)return;
  ct174BusyMedia.add(mediaId);
  const backup={series:(homeCache?.series||[]).slice(),hist:(homeCache?.history_episodes||[]).slice(),row:{...x},pair:ct175EpisodePairs.has(mediaId)?structuredClone(ct175EpisodePairs.get(mediaId)):undefined};
  const btn=document.querySelector(`[data-home-mark-episode="${mediaId}"]`);if(btn){btn.classList.add('ct174-pending');btn.textContent='✓'}
  try{
    let pair=ct175EpisodePairs.get(mediaId);if(!pair?.current)pair=await ct175PrimeOne(x);
    let ep=pair?.current;if(!ep){let p=ct174NextEpisodeCache.get(mediaId);if(!p){p=Promise.resolve(findNextReleasedEpisode158(x));ct174NextEpisodeCache.set(mediaId,p)}ep=await p}
    if(!ep){ct174Flash('Nenhum episódio lançado pendente.','warn');return}
    const successor=pair?.next||null;
    ct174OptimisticHomeEpisode(x,ep);
    ct175EpisodePairs.set(mediaId,{current:successor,next:undefined});
    ct174NextEpisodeCache.delete(mediaId);
    paintHome();
    ct174Flash(x.is_caught_up?'Você está em dia':successor?`Agora: ${successor.title||('S'+successor.season+' E'+successor.episode)}`:'Episódio atualizado');
    await rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(x.media_id),p_season_number:Number(ep.season),p_episode_number:Number(ep.episode),p_title:ep.title,p_runtime_minutes:ep.runtime,p_released_episodes:Number(x.released_episodes||0)||null,p_series_status:ep.status,p_watched_at:new Date().toISOString()});
    profileCache=null;discoverCache.clear();ct171SeenMap=null;
    if(successor&&!x.is_caught_up)void ct175PrimeOne(x);else ct175EpisodePairs.delete(mediaId);
    void ct174RefreshHome('home-watch-r175');
  }catch(e){
    if(homeCache){homeCache.series=backup.series;homeCache.history_episodes=backup.hist;const cur=(homeCache.series||[]).find(v=>Number(v.media_id)===mediaId);if(cur)Object.assign(cur,backup.row)}
    if(backup.pair!==undefined)ct175EpisodePairs.set(mediaId,backup.pair);else ct175EpisodePairs.delete(mediaId);
    paintHome();ct174Flash('Não foi possível sincronizar. Alteração revertida.','warn');toast(e?.message||e);
  }finally{ct174BusyMedia.delete(mediaId);const b=document.querySelector(`[data-home-mark-episode="${mediaId}"]`);if(b)b.classList.remove('ct174-pending')}
};

/* Any data reconciliation can invalidate the prewarmed pair; rebuild it silently. */
window.addEventListener('cinetracker:data-changed',e=>{const src=String(e?.detail?.source||'');if(src.includes('unwatch'))ct175EpisodePairs.clear();setTimeout(ct175PrimeHome,0)});
