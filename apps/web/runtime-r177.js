/* r177 — canonical queue must repaint Home as soon as first unwatched is resolved */
window.__ctR177='canonical-next-episode-repaint';
window.__ct177Home='drawer-and-home-share-first-unwatched-immediate-repaint';

const ct177SetQueueBase=ct176SetQueue;
ct176SetQueue=function(mediaId,queue){
  const before=ct175EpisodePairs.get(Number(mediaId))?.current||null;
  const pair=ct177SetQueueBase(mediaId,queue);
  const after=pair?.current||null;
  const changed=Number(before?.season||0)!==Number(after?.season||0)||Number(before?.episode||0)!==Number(after?.episode||0)||String(before?.title||'')!==String(after?.title||'');
  if(changed&&route()==='home')ct175SchedulePaint();
  return pair;
};

/* When an unwatch succeeds, repaint from the drawer's already-correct watched set immediately,
   then let the canonical backend reconciliation confirm the same result in the background. */
const ct177UnmarkEpisodeBase=ct174UnmarkEpisode;
ct174UnmarkEpisode=async function(sn,en){
  const st=ct169DrawerState,showId=Number(st?.showId||0),key=ct176EpisodeKey(sn,en);
  let x=null;
  if(showId>0&&homeCache?.series)x=(homeCache.series||[]).find(v=>mediaTmdb(v)===showId)||null;
  if(x&&st){
    const watchedNow=new Set(st.watched);watchedNow.delete(key);
    ct176ClearMedia(Number(x.media_id||0));
    void ct176PrimeWithWatched(x,watchedNow,true).then(()=>{if(route()==='home')ct175SchedulePaint()});
  }
  return ct177UnmarkEpisodeBase(sn,en);
};

/* Also repaint after any canonical rebuild, not only after optimistic Home clicks. */
const ct177PrimeCanonicalBase=ct176PrimeCanonical;
ct176PrimeCanonical=async function(x,force=false){
  const pair=await ct177PrimeCanonicalBase(x,force);
  if(route()==='home'&&pair)ct175SchedulePaint();
  return pair;
};
