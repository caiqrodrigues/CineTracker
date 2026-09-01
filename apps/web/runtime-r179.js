/* r179 — target the real Assistir a seguir card, never a History row with same TMDB id */
window.__ctR179='home-target-card-by-media-id';
window.__ct179Next='history-duplicate-safe-next-episode-card';

const ct179HomeSeriesRowBase=homeSeriesRow158;
homeSeriesRow158=function(x){
  const mid=Number(x?.media_id||0),pair=ct175EpisodePairs.get(mid),ep=pair?.current||null;
  let html=ct179HomeSeriesRowBase(x);
  if(ep){
    const tag='S'+String(Number(ep.season||0)).padStart(2,'0')+'E'+String(Number(ep.episode||0)).padStart(2,'0');
    html=html.replace(/ · atual S\d{2}E\d{2}/,` · próximo ${tag}`);
  }
  return html;
};

ct178PatchHomeSeries=function(mediaId){
  mediaId=Number(mediaId);if(route()!=='home'||!homeCache||!(mediaId>0))return;
  const x=(homeCache.series||[]).find(v=>Number(v?.media_id||0)===mediaId);if(!x)return;
  const showId=mediaTmdb(x);if(!(showId>0))return;
  /* The History can contain the same tv:<tmdb> before the live card. Anchor on the unique action button first. */
  const action=document.querySelector(`[data-home-mark-episode="${mediaId}"]`);
  let host=action?.closest?.('.home-action-row')||null;
  if(!host){
    host=[...document.querySelectorAll('.home-action-row')].find(row=>row.querySelector?.(`.media-row[data-media="tv:${showId}"]`))||null;
  }
  if(!host)return;
  const tpl=document.createElement('template');tpl.innerHTML=homeSeriesRow158(x).trim();const next=tpl.content.firstElementChild;if(!next)return;
  host.replaceWith(next);
  requestAnimationFrame(()=>{const el=next.querySelector?.('[data-ct172-home-episode][data-ct172-complete="0"]');if(el)void ct172HydrateHomeEpisode(el)});
};

/* Initial/canonical resolution must patch the live action card even when a History row for the same show exists above it. */
const ct179SetQueueBase=ct176SetQueue;
ct176SetQueue=function(mediaId,queue){
  const pair=ct179SetQueueBase(mediaId,queue);
  if(route()==='home')requestAnimationFrame(()=>ct178PatchHomeSeries(Number(mediaId)));
  return pair;
};
