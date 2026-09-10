/* CineTracker Web 1.0.34 r243 — HOME ONLY. Interaction authority + generic released-unwatched reconciliation. */
(()=>{
'use strict';
if(window.__ctR243Home)return;
window.__ctR243Home='interaction-stable+released-unwatched-continue';
window.__ctR243Scope='home-only';
window.__ctR243Interaction='capture-home-tabs-nav-media';
window.__ctR243Series='generic-canonical-released-unwatched';
window.__ctR243MovieMeta='lazy-visible-only';

/* r242 enriched every missing movie row in bulk. Keep the same metadata contract, but only hydrate rows that become visible. */
const ct243Observed=new WeakSet();
const ct243MovieObserver=('IntersectionObserver'in window)?new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const row=entry.target;ct243MovieObserver.unobserve(row);
    if(route()!=='home')continue;
    const id=ct242Num(String(row.getAttribute('data-media')||'').split(':')[1]);
    const x=ct242MovieMap().get(id),small=row.querySelector('small');if(!x||!small)continue;
    const meta=ct242MetaText(x);if(meta&&small.textContent!==meta)small.textContent=meta;
    if(!ct242Year(x)||!ct242Runtime(x)||!ct242Genres(x).length)void ct242FetchMeta(x);
  }
},{root:null,rootMargin:'240px 0px'}):null;

ct242DecorateMovies=function(){
  ct242DecorateTimer=0;if(route()!=='home')return;
  const root=document.querySelector('[data-home]');if(!root)return;
  const by=ct242MovieMap();
  for(const row of root.querySelectorAll('[data-media^="movie:"]')){
    const id=ct242Num(String(row.getAttribute('data-media')||'').split(':')[1]),x=by.get(id),small=row.querySelector('small');if(!x||!small)continue;
    const meta=ct242MetaText(x);if(meta&&small.textContent!==meta)small.textContent=meta;
    if(!ct242Year(x)||!ct242Runtime(x)||!ct242Genres(x).length){
      if(ct243MovieObserver){if(!ct243Observed.has(row)){ct243Observed.add(row);ct243MovieObserver.observe(row)}}
      else void ct242FetchMeta(x);
    }
  }
};

/* Any series with a released unwatched episode belongs in Assistir a seguir. First use payload counts, then verify generic gaps against the canonical r176 episode authority. */
const ct243SeriesChecked=new Set(),ct243SeriesPending=new Set();
let ct243ReconTimer=0,ct243ReconGeneration=0;
function ct243PromoteByCounts(){
  let changed=false;
  for(const x of homeCache?.series||[]){
    const watched=Number(x?.watched_episodes||0),released=Number(x?.released_episodes||0);
    if(watched>0&&released>watched&&x.home_bucket!=='continue'&&x.home_bucket!=='completed'){
      x.home_bucket='continue';x.is_caught_up=false;changed=true;
    }
  }
  return changed;
}
async function ct243CheckSeriesCandidate(x,generation){
  const mediaId=Number(x?.media_id||0),showId=mediaTmdb(x);if(!(mediaId>0&&showId>0)||ct243SeriesPending.has(mediaId))return false;
  ct243SeriesPending.add(mediaId);
  try{
    const pair=await ct176PrimeCanonical(x,false);
    if(generation!==ct243ReconGeneration||route()!=='home')return false;
    if(pair?.current&&x.home_bucket!=='continue'&&x.home_bucket!=='completed'){
      x.home_bucket='continue';x.is_caught_up=false;
      x.released_episodes=Math.max(Number(x.released_episodes||0),Number(x.watched_episodes||0)+1);
      return true;
    }
    return false;
  }catch{return false}finally{ct243SeriesPending.delete(mediaId);ct243SeriesChecked.add(mediaId)}
}
async function ct243ReconcileSeries(){
  ct243ReconTimer=0;if(route()!=='home'||!homeCache?.series)return;
  const generation=++ct243ReconGeneration;
  let changed=ct243PromoteByCounts();
  if(changed){paintHome();ct242ScheduleDecorate()}
  const candidates=(homeCache.series||[]).filter(x=>{
    const mediaId=Number(x?.media_id||0),watched=Number(x?.watched_episodes||0);
    return mediaId>0&&watched>0&&x.home_bucket!=='continue'&&x.home_bucket!=='completed'&&!ct243SeriesChecked.has(mediaId)&&!ct243SeriesPending.has(mediaId);
  });
  let i=0,verifiedChange=false;
  const workers=Array.from({length:Math.min(2,candidates.length)},async()=>{while(i<candidates.length){if(generation!==ct243ReconGeneration||route()!=='home')return;const x=candidates[i++];if(await ct243CheckSeriesCandidate(x,generation))verifiedChange=true}});
  await Promise.all(workers);
  if(verifiedChange&&generation===ct243ReconGeneration&&route()==='home'){paintHome();ct242ScheduleDecorate()}
}
function ct243ScheduleSeries(){if(ct243ReconTimer)return;ct243ReconTimer=setTimeout(ct243ReconcileSeries,60)}

const ct243PaintHomeBase=paintHome;
paintHome=function(){const out=ct243PaintHomeBase();ct243ScheduleSeries();ct242ScheduleDecorate();return out};

/* Home click authority. It bypasses any later stalled/duplicated bubble handlers without affecting controls inside a media row. */
document.addEventListener('click',e=>{
  if(route()!=='home')return;
  const tab=e.target.closest('[data-home-tab]');
  if(tab){e.preventDefault();e.stopImmediatePropagation();document.querySelectorAll('[data-home-tab]').forEach(x=>x.classList.toggle('active',x===tab));document.querySelectorAll('[data-home-view]').forEach(x=>x.classList.toggle('hidden',x.dataset.homeView!==tab.dataset.homeTab));ct242ScheduleDecorate();return}
  const nav=e.target.closest('[data-nav]');
  if(nav){e.preventDefault();e.stopImmediatePropagation();go(pathFor(nav.dataset.nav));return}
  const row=e.target.closest('[data-home] [data-media]');
  if(row){
    const inner=e.target.closest('button,a,input,select,textarea');if(inner&&inner!==row)return;
    const [type,id]=String(row.dataset.media||'').split(':');if(!(Number(id)>0))return;
    e.preventDefault();e.stopImmediatePropagation();go(`/${type==='movie'?'movie':'series'}/${Number(id)}`);return;
  }
},true);

window.addEventListener('popstate',()=>{ct243ReconGeneration++;if(route()==='home'){ct243SeriesChecked.clear();ct243ScheduleSeries()}});
document.addEventListener('cinetracker:data-changed',()=>{ct243SeriesChecked.clear();ct243ReconGeneration++;if(route()==='home')ct243ScheduleSeries()});
window.__ctR243ReconcileSeries=()=>{ct243SeriesChecked.clear();ct243ReconGeneration++;ct243ScheduleSeries()};
})();
