/* Android r270: authenticated full movie history, progressive For You, lazy posters. */
(()=>{'use strict';
if(window.__ctR270AndroidV1028)return;
window.__ctR270AndroidV1028='play-events-movies+progressive-foryou+lazy-posters+stable-sports';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
let recentMovies=null,recentOwner='',recentTime=0,moviesTask=null,posterIO=[];
const arr=x=>Array.isArray(x)?x:[];
function combineMovies(base,extra){
 const map=new Map;
 for(const x of arr(base)){const key=String(x.media_id||x.id||'');if(key)map.set(key,x)}
 for(const x of arr(extra)){const key=String(x.media_id||x.id||'');if(!key)continue;
  const old=map.get(key);
  map.set(key,!old||String(x.watched_at||'')>=String(old.watched_at||'')?{...old,...x}:{...x,...old,plays:Math.max(Number(old.plays||1),Number(x.plays||1))});
 }
 return [...map.values()].sort((a,b)=>new Date(a.watched_at||0)-new Date(b.watched_at||0)||Number(a.id||0)-Number(b.id||0));
}
function showMovieHistory(){
 if(route()!=='home'||!homeCache||recentOwner!==String(user?.id||'')||!recentMovies)return;
 homeCache.history_movies=combineMovies(homeCache.history_movies,recentMovies);
 const viewport=q('[data-home-viewport="movies"]'),stack=q('.home-history .stack',viewport);if(!stack)return;
 const beforeHeight=viewport.scrollHeight,beforeScroll=viewport.scrollTop,atEnd=beforeHeight-beforeScroll-viewport.clientHeight<110;
 stack.innerHTML=homeCache.history_movies.map(x=>homeMovieRow158({...x,media_type:'movie'},true)).join('');
 viewport.scrollTop=atEnd?Math.max(0,viewport.scrollHeight-viewport.clientHeight):beforeScroll+Math.max(0,viewport.scrollHeight-beforeHeight);
 watchPosters();
}
function fetchMovieHistory(){
 if(!session||!user)return Promise.resolve(null);
 const owner=String(user.id);
 if(recentOwner===owner&&recentMovies&&Date.now()-recentTime<90000){showMovieHistory();return Promise.resolve(recentMovies)}
 if(moviesTask)return moviesTask;
 moviesTask=rpc('cinetracker_home_movie_history_v323',{p_limit:100}).then(rows=>{
  if(!Array.isArray(rows)||String(user?.id||'')!==owner)return null;
  recentMovies=rows;recentOwner=owner;recentTime=Date.now();showMovieHistory();return rows;
 }).catch(()=>null).finally(()=>{moviesTask=null});return moviesTask;
}
const baseHome270=renderHome;
renderHome=async function(...args){const result=await baseHome270.apply(this,args);if(route()==='home')void fetchMovieHistory();return result};

const lazyHTML=markup=>String(markup).replace(/ style="background-image:url\('([^']+)'\)"/g,(_,url)=>' data-ct270-bg="'+esc(url)+'"');
const movieRow270=homeMovieRow158,seriesRow270=homeSeriesRow158,episodeRow270=homeEpisodeHistory158;
homeMovieRow158=function(...args){return lazyHTML(movieRow270.apply(this,args))};
homeSeriesRow158=function(...args){return lazyHTML(seriesRow270.apply(this,args))};
homeEpisodeHistory158=function(...args){return lazyHTML(episodeRow270.apply(this,args))};
function watchPosters(){
 posterIO.forEach(x=>x.disconnect());posterIO=[];
 for(const vp of document.querySelectorAll('[data-home-viewport]')){
  const elems=[...vp.querySelectorAll('.thumb[data-ct270-bg]')];
  const load=el=>{const src=el.dataset?.ct270Bg;if(src){el.style.backgroundImage='url("'+src+'")';delete el.dataset.ct270Bg}};
  if(!window.IntersectionObserver){elems.forEach(load);continue}
  const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){load(e.target);io.unobserve(e.target)}},{root:vp,rootMargin:'280px 0px'});
  posterIO.push(io);elems.forEach(el=>io.observe(el));
 }
}
const basePaintHome270=paintHome;
paintHome=function(...args){
 const old=q('[data-home-viewport="'+homeActiveTab158+'"]'),scroll=old?.scrollTop||0,exists=!!old?.querySelector('.media-row');
 const r=basePaintHome270.apply(this,args);
 requestAnimationFrame(()=>{if(exists){const v=q('[data-home-viewport="'+homeActiveTab158+'"]');if(v)v.scrollTop=scroll}watchPosters()});
 return r;
};
try{const link=document.createElement('link');link.rel='preconnect';link.href=SUPABASE_URL;document.head.appendChild(link)}catch{}

const keys270=['movie','series','anime'],blank270=()=>({movie:[],series:[],anime:[]});
let forYouTask270=null,epoch270=0;
function select270(data){
 const s=ct186Select(data);
 Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa,wmPool:s.wmPool,wsPool:s.wsPool,waPool:s.waPool});
 return data;
}
function publish270(d,visible=true){
 select270(d);ct186ForYouData=d;discoverCache.set('r186:foryou:'+localDay(),d);
 try{ct163Write('discover:foryou:all',d)}catch{}
 if(visible&&route()==='discover'&&discoverState.tab==='foryou'&&q('[data-discover-content]'))paintDiscover(d);
 return d;
}
async function supplements270(data,c,id){
 const allowed=window.__ctR265Test?.allowed;
 await Promise.allSettled(keys270.filter(k=>data._ct186_fresh[k].length<(k==='movie'?3:2)).map(async k=>{
  try{const rows=await Promise.race([ct186PopularPool(k,c),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),12000))]);
   if(id!==epoch270||String(user?.id||'')!==c.owner)return;
   const ok=ct186UniqueRows(arr(rows)).filter(x=>ct186FreshEligible(x,c)&&(!allowed||allowed(x)));
   if(ok.length){data._ct186_fresh[k]=ct186MergeRows(data._ct186_fresh[k],ok);publish270(data)}
  }catch{}
 }));
}
ct186LoadForYou=async function(force=false){
 if(!force&&forYouTask270)return forYouTask270;
 const key='r186:foryou:'+localDay();
 if(!force){const cached=discoverCache.get(key);if(cached&&!cached.then)return cached}
 const id=++epoch270;
 forYouTask270=(async()=>{
  const c=await ct186Context(force);c.owner=String(user?.id||'');const watch=ct186WatchPools(c);
  const cached=force?null:(ct163Read('discover:foryou:all')||ct186ForYouData);
  const fresh=blank270(),allowed=window.__ctR265Test?.allowed;
  for(const k of keys270)fresh[k]=ct186UniqueRows(arr(cached?._ct186_fresh?.[k])).filter(x=>ct186FreshEligible(x,c)&&(!allowed||allowed(x)));
  if(keys270.reduce((sum,k)=>sum+fresh[k].length,0)<4){
   const initial=await ct186FreshPools(c);
   for(const k of keys270)fresh[k]=ct186MergeRows(fresh[k],initial[k]);
  }
  const d={_ct186_fresh:fresh,_ct166_fresh:fresh,_ct186_watchlist:watch,_ct166_watchlist:watch,_ct186_fallback:blank270(),_ct186_reserve:blank270()};
  if(id!==epoch270)return ct186ForYouData||select270(d);
  publish270(d,false);
  setTimeout(()=>void supplements270(d,c,id),650);
  return d;
 })().finally(()=>{forYouTask270=null});
 return forYouTask270;
};
const oldDiscoverRows270=discoverRows;
discoverRows=async function(tab){return tab==='foryou'?ct186LoadForYou(false):oldDiscoverRows270(tab)};
ct186RefreshVisible=async function(){
 if(route()!=='discover'||discoverState?.tab!=='foryou')return null;
 if(forYouTask270)return forYouTask270;
 ct186ContextValue=null;ct186ContextAt=0;
 discoverCache.delete('r186:foryou:'+localDay());
 const d=await ct186LoadForYou(true);if(d)publish270(d);return d;
};
const style=document.createElement('style');style.id='ct-r270-cards';
style.textContent='[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions{position:static!important;inset:auto!important;transform:none!important;margin-top:auto!important}[data-page="discover"] [data-ct241-section] .ct166-slot .card-body b{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}[data-home-viewport] .thumb[data-ct270-bg]{background-color:#112c3c}';
document.head.appendChild(style);
window.__ctR270Test={combineMovies,select270,fetchMovieHistory,watchPosters};
})();