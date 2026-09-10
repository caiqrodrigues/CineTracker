/* CineTracker Web 1.0.32 r241 — HOME ONLY: first-paint metadata authority. */
(()=>{
'use strict';
if(window.__ctR241Home)return;
window.__ctR241Home='fast-first-paint-episode-and-movie-metadata';
window.__ctR241Scope='home-only';
const movieDetails241=new Map();
const n241=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const id241=x=>n241(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);
const day241=()=>{try{return localDay()}catch{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}};
const year241=x=>String(x?.release_year||x?.release_date||x?.raw_tmdb?.release_date||'').slice(0,4);
const runtime241=x=>n241(x?.runtime_minutes||x?.runtime||x?.raw_tmdb?.runtime);
function genres241(x){
 const src=x?.genres||x?.raw_tmdb?.genres||[];
 if(Array.isArray(src)&&src.length)return src.map(g=>typeof g==='string'?g:g?.name).filter(Boolean).slice(0,3);
 return [];
}
async function movieDetail241(x){
 const id=id241(x);if(!id)return null;
 if(movieDetails241.has(id))return movieDetails241.get(id);
 const p=Promise.resolve().then(()=>safeTmdb(`/movie/${id}`,{})).catch(()=>null);movieDetails241.set(id,p);return p;
}
function applyMovie241(x,d){if(!d)return; if(!x.release_year&&d.release_date)x.release_year=String(d.release_date).slice(0,4);if(!x.release_date&&d.release_date)x.release_date=d.release_date;if(!runtime241(x)&&n241(d.runtime))x.runtime_minutes=n241(d.runtime);if(!genres241(x).length&&Array.isArray(d.genres))x.genres=d.genres.map(g=>({id:g.id,name:g.name}));}
function applySeries241(x,d){
 const ep=d?.last_episode_to_air,air=String(ep?.air_date||'').slice(0,10);if(!ep||!air||air>day241())return;
 x.latest_released_season_number=n241(ep.season_number);x.latest_released_episode_number=n241(ep.episode_number);x.latest_episode_meta_season_number=n241(ep.season_number);x.latest_episode_meta_episode_number=n241(ep.episode_number);x.latest_episode_air_date=air;x.latest_episode_name=String(ep.name||'');
 const lastS=n241(x.last_season_number),lastE=n241(x.last_episode_number),s=n241(ep.season_number),e=n241(ep.episode_number);const behind=s>lastS||(s===lastS&&e>lastE);
 if(behind){x.is_caught_up=false;if(x.home_bucket==='up_to_date')x.home_bucket='continue';x.history_missing_episodes=Math.max(1,n241(x.history_missing_episodes));}
}
async function pool241(items,worker,limit=12){let i=0;await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(i<items.length){const x=items[i++];try{await worker(x)}catch{}}}));}
async function preloadHome241(){
 const p=homeCache||{},series=Array.isArray(p.series)?p.series:[],watch=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],hist=Array.isArray(p.history_movies)?p.history_movies:[];
 try{window.__ctV127FixKnownHome?.()}catch{}
 const seriesNeed=series.filter(x=>id241(x)>0&&n241(x.watched_episodes)>0&&(!x.latest_episode_name||!n241(x.latest_released_episode_number)||x.home_bucket==='up_to_date'));
 const movies=[...watch.slice(0,36),...hist.slice(0,24)].filter(x=>id241(x)>0&&(!year241(x)||!runtime241(x)||!genres241(x).length));
 await Promise.all([
  pool241(seriesNeed,async x=>applySeries241(x,await safeTmdb(`/tv/${id241(x)}`,{})),12),
  pool241(movies,async x=>applyMovie241(x,await movieDetail241(x)),12)
 ]);
 try{window.__ctV127FixKnownHome?.()}catch{}
}
function movieMeta241(x){const parts=[];const r=runtime241(x),y=year241(x),g=genres241(x);if(r)parts.push(`${r} min`);if(y)parts.push(y);if(g.length)parts.push(g.join(', '));return parts.join(' · ')}
function decorateMovies241(){
 const root=document.querySelector('[data-home]');if(!root)return;const p=homeCache||{},all=[...(Array.isArray(p.movie_watchlist)?p.movie_watchlist:[]),...(Array.isArray(p.history_movies)?p.history_movies:[])];const by=new Map(all.map(x=>[id241(x),x]));
 for(const row of root.querySelectorAll('[data-media^="movie:"]')){const id=n241(String(row.getAttribute('data-media')||'').split(':')[1]),x=by.get(id),small=row.querySelector('small');if(x&&small){const meta=movieMeta241(x);if(meta)small.textContent=meta;}}
}
let basePaint241=paintHome;
paintHome=function(...args){const out=basePaint241.apply(this,args);decorateMovies241();return out};
renderHome=async function(seq){
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home',`<div class="page" data-home>${loading('Sincronizando Home...')}</div>`));
 try{
  const data=await rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()});if(seq!==navSeq||route()!=='home')return;homeCache=data||{};
  await preloadHome241();if(seq!==navSeq||route()!=='home')return;paintHome();
  /* Remaining movie rows enrich after first paint without blocking navigation. */
  const p=homeCache||{},rest=[...(Array.isArray(p.movie_watchlist)?p.movie_watchlist.slice(36):[]),...(Array.isArray(p.history_movies)?p.history_movies.slice(24):[])].filter(x=>id241(x)>0&&(!year241(x)||!runtime241(x)||!genres241(x).length));
  void pool241(rest,async x=>{applyMovie241(x,await movieDetail241(x))},8).then(()=>{if(route()==='home'){decorateMovies241()}});
 }catch(e){if(seq!==navSeq)return;const h=document.querySelector('[data-home]');if(h)h.innerHTML=fail(`Falha ao sincronizar Home: ${e?.message||e}`,'home')}
};
window.__ctR241PreloadHome=preloadHome241;
window.__ctR241MovieMeta=movieMeta241;
})();