/* Android 1.0.28/r270 — full Home films, optimistic Sports and lazy posters. Web frozen. */
(()=>{
'use strict';
if(window.__ctR270AndroidV1028)return;
window.__ctR270AndroidV1028='full-movie-history+sport-optimistic-no-scroll+discover-priority+lazy-posters';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
let historyTask=null,historyAt=0,historyRows=null;
const historyKey=()=> 'ct:r270:movies:'+String(user?.id||session?.user?.id||'anon');
function readHistory(){
 try{const v=JSON.parse(sessionStorage.getItem(historyKey())||'null');if(v&&Date.now()-v.at<600000&&Array.isArray(v.rows))return v.rows}catch{}
 return null;
}
function historyValue(x){
 return {...x,media_type:'movie',media_title:x.media_title||x.title||'Filme',title:x.media_title||x.title||'Filme',poster_path:x.poster_path||null};
}
function drawMovieHistory(rows){
 if(route()!=='home')return false;
 const viewport=q('[data-home-viewport="movies"]'),root=q('.home-history .stack',viewport);
 if(!root)return false;
 const previousHeight=root.offsetHeight,previousTop=viewport.scrollTop;
 const ordered=[...rows].map(historyValue).sort((a,b)=>new Date(a.watched_at||0)-new Date(b.watched_at||0)||Number(a.id||0)-Number(b.id||0));
 root.innerHTML=ordered.length?ordered.map(x=>homeMovieRow158(x,true)).join(''):'<div class="empty">Nenhum filme no histórico.</div>';
 const count=q('.home-history-hint',viewport);if(count)count.textContent='Histórico de filmes · '+ordered.length+' filmes · role para cima para revelar';
 if(homeActiveTab158==='movies')viewport.scrollTop=Math.max(0,previousTop+root.offsetHeight-previousHeight);
 void lazyPaint270(root);
 return true;
}
async function fullMovieHistory(force=false){
 if(!session?.user&&!user)return null;
 if(!force&&historyRows&&Date.now()-historyAt<600000){drawMovieHistory(historyRows);return historyRows}
 if(!force){const cached=readHistory();if(cached){historyRows=cached;historyAt=Date.now();drawMovieHistory(cached);return cached}}
 if(historyTask)return historyTask;
 historyTask=(async()=>{
  const response=await rpc('cinetracker_android_movie_history_v1028',{p_limit:450});
  const rows=Array.isArray(response)?response:Array.isArray(response?.rows)?response.rows:null;
  if(!rows)throw new Error('Histórico de filmes inválido');
  historyRows=rows;historyAt=Date.now();
  try{sessionStorage.setItem(historyKey(),JSON.stringify({at:historyAt,rows}))}catch{}
  if(homeCache&&typeof homeCache==='object')homeCache.history_movies=rows;
  drawMovieHistory(rows);return rows;
 })().catch(e=>{try{console.warn('Android movie history:',e?.message||e)}catch{}return null}).finally(()=>{historyTask=null});
 return historyTask;
}
const originalPaintHome270=paintHome;
paintHome=function(...args){
 const result=originalPaintHome270.apply(this,args);
 if(route()==='home'){
  const cached=historyRows||readHistory();if(cached)requestAnimationFrame(()=>drawMovieHistory(cached));
  else if(!historyTask)requestAnimationFrame(()=>{void fullMovieHistory(false)});
  requestAnimationFrame(()=>void lazyPaint270(q('[data-home]')));
 }
 return result;
};
const originalRenderHome270=renderHome;
renderHome=async function(...args){const result=await originalRenderHome270.apply(this,args);if(route()==='home')requestAnimationFrame(()=>{void fullMovieHistory(false)});return result};
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-home-tab="movies"]'))requestAnimationFrame(()=>{void fullMovieHistory(false)})},true);

/* Replace the old sport-watched handler, which rebuilt and scrolled the entire Sports page. */
const processingSport270=new Set();
markSportWatched159=async function(eventId,currentlyWatched){
 const id=Number(eventId)||0;if(!id||processingSport270.has(id))return;
 processingSport270.add(id);
 const before=!!currentlyWatched,next=!before,buttons=qa('[data-sport-watch="'+id+'"]'),stamp=new Date().toISOString();
 const matching=(sportsCache?.events||[]).filter(x=>Number(x?.id)===id);
 const original=matching.map(x=>({obj:x,is_watched:x.is_watched,sport_watched_at:x.sport_watched_at,duration_minutes:x.duration_minutes}));
 const previousHistory=Array.isArray(sportsCache?.watch_history)?[...sportsCache.watch_history]:null;
 function update(value){
  for(const b of qa('[data-sport-watch="'+id+'"]')){b.dataset.watched=value?'1':'0';b.classList.toggle('on',value);b.textContent=value?'✓ Assistido':'✓ Marcar assistido'}
  try{ct168SetWatchedButtons(id,value)}catch{}
  for(const x of matching){x.is_watched=value;x.sport_watched_at=value?stamp:null}
  if(Array.isArray(sportsCache?.watch_history)){
   sportsCache.watch_history=sportsCache.watch_history.filter(x=>Number(x.id||x.event_id)!==id);
   if(value&&matching[0])sportsCache.watch_history.unshift({...matching[0],is_watched:true,sport_watched_at:stamp});
  }
 }
 update(next);for(const b of buttons)b.disabled=true;
 try{
  const result=await rpc('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:stamp});
  const actual=typeof result?.is_watched==='boolean'?result.is_watched:next;
  update(actual);
  if(sportsCache?.stats&&actual!==before){
   const delta=actual?1:-1;sportsCache.stats.watched_events=Math.max(0,Number(sportsCache.stats.watched_events||0)+delta);
   if(Number.isFinite(Number(result?.duration_minutes)))sportsCache.stats.sports_minutes=Math.max(0,Number(sportsCache.stats.sports_minutes||0)+delta*Number(result.duration_minutes));
  }
  profileCache=null;try{ct163Write('sports',sportsCache)}catch{}
  toast(actual?'Evento marcado como assistido.':'Evento removido dos assistidos.');
 }catch(e){
  update(before);
  original.forEach(x=>{x.obj.is_watched=x.is_watched;x.obj.sport_watched_at=x.sport_watched_at;x.obj.duration_minutes=x.duration_minutes});
  if(previousHistory)sportsCache.watch_history=previousHistory;
  toast('Esportes: '+(e?.message||e));
 }finally{processingSport270.delete(id);for(const b of buttons)if(b.isConnected)b.disabled=false}
};

/* Browser-level lazy loading for posters that were rendered as eager CSS backgrounds. */
let posterObserver270=null;
function lazyPosterHtml270(html){
 return String(html).replace(/\sstyle="background-image:url\('([^']+)'\)"/g,(_,src)=>' data-ct270-poster="'+esc(src)+'"');
}
const baseMovieRow270=homeMovieRow158;
homeMovieRow158=function(x,history=false){return history?lazyPosterHtml270(baseMovieRow270(x,history)):baseMovieRow270(x,history)};
const baseEpisodeHistory270=homeEpisodeHistory158;
homeEpisodeHistory158=function(x){return lazyPosterHtml270(baseEpisodeHistory270(x))};
const baseDiscoverCard270=discoverCard158;
discoverCard158=function(x){return lazyPosterHtml270(baseDiscoverCard270(x))};
function lazyPaint270(root=document){
 if(!root)return;const pending=qa('[data-ct270-poster]',root);if(!pending.length)return;
 const unveil=el=>{
  const src=el.dataset.ct270Poster;if(!src)return;
  el.style.backgroundImage='url("'+src.replace(/"/g,'%22')+'")';delete el.dataset.ct270Poster;
 };
 if(typeof IntersectionObserver==='undefined'){pending.forEach(unveil);return}
 if(!posterObserver270)posterObserver270=new IntersectionObserver(entries=>{
  for(const e of entries)if(e.isIntersecting){posterObserver270.unobserve(e.target);unveil(e.target)}
 },{root:null,rootMargin:'500px 0px',threshold:0});
 for(const el of pending)posterObserver270.observe(el);
}
const basePaintDiscover270=paintDiscover;
paintDiscover=function(...args){const out=basePaintDiscover270.apply(this,args);if(route()==='discover')requestAnimationFrame(()=>void lazyPaint270(q('[data-discover]')));return out};
/* Current route loader already fetches its own data; don't fetch every other page. */
ct163PreloadAll=function(){ct163PreloadStarted=true};
const style270=document.createElement('style');style270.id='ct270-discover-layout';
style270.textContent=[
 '[data-page="discover"] [data-ct241-section] .foryou-grid:not(.ct166-daily-grid){display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;overflow:visible!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;min-width:0!important;max-width:100%!important;overflow:visible!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot-head{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;gap:4px!important;align-items:stretch!important;min-height:52px!important;width:100%!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot-head small{display:block!important;min-height:16px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:100%!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot-head .ct166-swap{box-sizing:border-box!important;position:static!important;width:100%!important;max-width:100%!important;height:28px!important;min-height:28px!important;margin:0!important;padding:2px 4px!important;font-size:10px!important;white-space:nowrap!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .discover-card{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;position:relative!important;min-width:0!important;width:100%!important;height:auto!important;min-height:0!important;overflow:hidden!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .discover-card>button[data-media]{display:block!important;position:static!important;flex:0 0 auto!important;width:100%!important;min-width:0!important;padding:0!important;margin:0!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .poster{aspect-ratio:2/3!important;position:static!important;width:100%!important;height:auto!important;min-height:0!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .card-body{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;gap:2px!important;height:37px!important;min-height:37px!important;max-height:37px!important;overflow:hidden!important;margin:0!important;padding:4px!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .card-body b,[data-page="discover"] [data-ct241-section] .ct166-slot .card-body small{display:block!important;width:100%!important;min-width:0!important;line-height:14px!important;max-height:14px!important;white-space:nowrap!important;text-overflow:ellipsis!important;overflow:hidden!important;overflow-wrap:normal!important;word-break:normal!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .discover-card>.discover-watch{box-sizing:border-box!important;position:static!important;display:block!important;flex:0 0 auto!important;width:100%!important;max-width:100%!important;margin:0!important;padding:4px 2px!important;height:32px!important;min-height:32px!important;font-size:9px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions{position:static!important;inset:auto!important;display:flex!important;align-items:center!important;gap:4px!important;margin:0!important;min-height:34px!important;padding:2px!important;overflow:hidden!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions>.discover-watch{flex:1 1 auto!important;min-width:0!important;position:static!important}',
 '[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions>.ct166-swap{flex:0 0 30px!important;position:static!important;max-width:30px!important;min-width:30px!important}',
 '[data-page="home"] .home-history .thumb[data-ct270-poster],[data-page="discover"] .poster[data-ct270-poster]{background-color:#0f1e2b!important}'
].join('\n');document.head.appendChild(style270);
window.__ctR270Test={historyValue,lazyPosterHtml270,drawMovieHistory,fullMovieHistory,processingSport270,lazyPaint270};
})();