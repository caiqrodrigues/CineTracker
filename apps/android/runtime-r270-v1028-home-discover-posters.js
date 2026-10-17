/* CineTracker Android 1.0.28 / r270: visible-asset priority and fresh Home movie history. */
(()=>{
'use strict';
if(window.__ctR270AndroidV1028)return;
window.__ctR270AndroidV1028='fast-foryou+home-recent-history+lazy-posters+top10-priority';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const thumbToLazy=html=>String(html).replace(/<div class="thumb" style="background-image:url\('([^']+)'\)"><\/div>/g,
 (_,url)=>'<div class="thumb ct270-lazy-thumb"><img loading="lazy" decoding="async" src="'+url+'" alt="" draggable="false"></div>');
const originalMovie=homeMovieRow158,originalSeries=homeSeriesRow158,originalEpisode=homeEpisodeHistory158;
homeMovieRow158=function(...args){return thumbToLazy(originalMovie.apply(this,args))};
homeSeriesRow158=function(...args){return thumbToLazy(originalSeries.apply(this,args))};
homeEpisodeHistory158=function(...args){return thumbToLazy(originalEpisode.apply(this,args))};

/* The server's Home RPC takes the most recent 80 watch_history rows.  An older
   cached snapshot is not authoritative.  When History itself is stale, reconcile
   extra seen movies with independently stamped profile dashboard rows. */
let lastHistoryCheck='',historyRequest=null;
const movieKey=x=>Number(x?.media_id||0)>0?'id:'+Number(x.media_id):'tmdb:'+Number(x?.tmdb_id||0);
function mergeHistory(payload,dashboard){
 if(!payload||!Array.isArray(payload.history_movies)||!Array.isArray(dashboard))return false;
 const before=payload.history_movies;
 const existing=new Set(before.map(movieKey));
 const add=[];
 for(const row of dashboard){
  if(String(row?.media_type||'')!=='movie'||!row?.is_seen)continue;
  const stamp=String(row?.last_watched_at||'');
  const ms=Date.parse(stamp);
  if(!Number.isFinite(ms)||ms>Date.now()+86400000||ms<Date.now()-366*86400000)continue;
  const id=movieKey(row);if(existing.has(id))continue;
  const name=String(row?.title||'').trim();if(!name)continue;
  add.push({id:'dashboard:'+id,media_id:Number(row.media_id||0),tmdb_id:Number(row.tmdb_id||row.raw_tmdb?.source_tmdb_id||0),
    media_title:name,title:name,poster_path:row.poster_path||row.raw_tmdb?.poster_path||null,watched_at:stamp,plays:1});
  existing.add(id);
 }
 if(!add.length)return false;
 payload.history_movies=[...before,...add].sort((a,b)=>Date.parse(b.watched_at||0)-Date.parse(a.watched_at||0)).slice(0,120);
 return true;
}
function reconcileHome(){
 if(route()!=='home'||!session||!homeCache||historyRequest)return;
 const recent=Array.isArray(homeCache.history_movies)?homeCache.history_movies:[];
 const latest=Math.max(0,...recent.map(x=>Date.parse(x.watched_at||0)||0));
 // Skip a costly profile query when the history already shows a recent film.
 if(latest&&Date.now()-latest<4*86400000)return;
 const key=String(session.user?.id||user?.id||'')+':'+localDay();
 if(lastHistoryCheck===key)return;
 lastHistoryCheck=key;
 historyRequest=rpc('cinetracker_profile_media_dashboard_v0991',{}).then(d=>{
  if(!Array.isArray(d)||route()!=='home'||!session)return;
  const current=homeCache;
  if(mergeHistory(current,d)){
   ct163Write('home',current);
   const vp=q('[data-home-viewport="'+homeActiveTab158+'"]'),scroll=vp?.scrollTop||0;
   paintHome();const next=q('[data-home-viewport="'+homeActiveTab158+'"]');
   if(next)next.scrollTop=Math.min(scroll,next.scrollHeight);
  }
 }).catch(()=>{lastHistoryCheck=''}).finally(()=>{historyRequest=null});
}
const paintHomeBase=paintHome;
let followupPending=false;
paintHome=function(...args){
 const result=paintHomeBase.apply(this,args);
 if(route()==='home'&&!followupPending){
  followupPending=true;
  setTimeout(()=>{followupPending=false;reconcileHome()},1500);
 }
 return result;
};
// When any watched media changes, permit another real backend reconciliation.
window.addEventListener('cinetracker:data-changed',()=>{lastHistoryCheck=''});
const css=document.createElement('style');css.id='ct-r270-lazy-assets';
css.textContent=[
 '.ct270-lazy-thumb{overflow:hidden!important;display:block!important;position:relative!important}',
 '.ct270-lazy-thumb>img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;border-radius:inherit!important}',
 '.home-history,.home-start>.home-section{content-visibility:auto;contain-intrinsic-size:auto 800px}',
 'body [data-page="discover"] .ct171-top-card .poster{background-color:#102332}'
].join('\n');document.head.appendChild(css);
for(const host of ['https://image.tmdb.org','https://api.themoviedb.org']){
 const link=document.createElement('link');link.rel='preconnect';link.href=host;link.crossOrigin='anonymous';document.head.appendChild(link);
}
window.__ctR270Test={thumbToLazy,mergeHistory,reconcileHome};
})();