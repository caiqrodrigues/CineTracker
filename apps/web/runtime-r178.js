/* r178 — stop Home repaint loop; patch only the changed series card */
window.__ctR178='stable-home-dom-no-repaint-loop';
window.__ct178Home='no-global-repaint-scroll-click-history-stable';

function ct178PatchHomeSeries(mediaId){
  mediaId=Number(mediaId);if(route()!=='home'||!homeCache||!(mediaId>0))return;
  const x=(homeCache.series||[]).find(v=>Number(v?.media_id||0)===mediaId);if(!x)return;
  const showId=mediaTmdb(x);if(!(showId>0))return;
  const media=document.querySelector(`.media-row[data-media="tv:${showId}"]`),host=media?.closest?.('.home-action-row');if(!host)return;
  const tpl=document.createElement('template');tpl.innerHTML=homeSeriesRow158(x).trim();const next=tpl.content.firstElementChild;if(!next)return;
  host.replaceWith(next);
  requestAnimationFrame(()=>{const ep=next.querySelector?.('[data-ct172-home-episode][data-ct172-complete="0"]');if(ep)void ct172HydrateHomeEpisode(ep)});
}

/* r177 scheduled a full Home paint after every canonical prime. paintHome -> prime -> paint became a loop.
   Restore the r176 canonical prime, which is cache-aware and does not repaint on cache hits. */
ct176PrimeCanonical=ct177PrimeCanonicalBase;

/* Keep canonical queue semantics, but update only the affected card when the first unwatched changes. */
ct176SetQueue=function(mediaId,queue){
  mediaId=Number(mediaId);const before=ct175EpisodePairs.get(mediaId)?.current||null;
  const pair=ct177SetQueueBase(mediaId,queue),after=pair?.current||null;
  const changed=Number(before?.season||0)!==Number(after?.season||0)||Number(before?.episode||0)!==Number(after?.episode||0)||String(before?.title||'')!==String(after?.title||'');
  if(changed&&route()==='home')requestAnimationFrame(()=>ct178PatchHomeSeries(mediaId));
  return pair;
};

/* Defensive: any legacy scheduled repaint caused only by background priming becomes an in-place patch pass,
   preserving scroll position, click targets and the rendered History section. */
ct175SchedulePaint=function(){
  if(route()!=='home'||!homeCache)return;
  requestAnimationFrame(()=>{
    if(route()!=='home'||!homeCache)return;
    for(const x of homeCache.series||[]){const mid=Number(x?.media_id||0);if(mid>0&&ct175EpisodePairs.has(mid))ct178PatchHomeSeries(mid)}
  });
};
