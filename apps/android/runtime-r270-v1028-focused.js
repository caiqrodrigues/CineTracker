/* CineTracker Android r270 / v1.0.28 — native-only fixes, frozen Web r541. */
(()=>{
'use strict';
if(window.__ctR270AndroidV1028)return;
window.__ctR270AndroidV1028='movie-history-paged+fast-foryou+lazy-posters+sports-no-scroll';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const watchedLocks=new Set();
function setWatched270(id,on){
 const n=Number(id);
 for(const b of document.querySelectorAll('[data-sport-watch="'+n+'"],[data-sport-watched="'+n+'"],[data-ct263-sport-watch="'+n+'"]')){
  b.dataset.watched=on?'1':'0';b.dataset.on=on?'1':'0';
  b.setAttribute('aria-pressed',String(on));b.classList.toggle('on',on);
  b.textContent=on?'↶ Desmarcar assistido':'✓ Marcar como assistido';
 }
 if(sportsCache?.events)for(const e of sportsCache.events)if(Number(e.id)===n)e.is_watched=on;
 if(Array.isArray(sportsDetail263?.events))for(const e of sportsDetail263.events)if(Number(e.id)===n)e.is_watched=on;
}
function persistWatch270(){
 try{if(sportsCache){ct163Write('sports',sportsCache);window.__ctA26PersistSports?.()}}catch{}
}
async function sportToggle270(id,was){
 id=Number(id);if(!(id>0)||watchedLocks.has(id))return false;
 const next=!was;watchedLocks.add(id);
 setWatched270(id,next);persistWatch270();
 try{
  const result=await rpc('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()});
  const actual=typeof result?.is_watched==='boolean'?result.is_watched:next;
  setWatched270(id,actual);persistWatch270();profileCache=null;
  try{localStorage.removeItem('cinetracker:preload:r163:profile')}catch{}
  toast(actual?'Evento marcado como assistido.':'Evento removido dos assistidos.');
  return true;
 }catch(e){
  setWatched270(id,was);persistWatch270();toast('Esportes: '+(e?.message||e));return false;
 }finally{watchedLocks.delete(id)}
}
// Directly replaces r159 authority: NO sportsPayload(true), paintSports(),
// setApp(), render(), navigation, global scroll or full-page refetch.
markSportWatched159=async function(id,was){return sportToggle270(id,was)};
toggleSports263=async function(button){
 const id=Number(button?.dataset?.ct263SportWatch||0);
 const ev=(sportsDetail263?.events||[]).find(e=>Number(e.id)===id);
 if(!ev||watchedLocks.has(id))return false;
 return sportToggle270(id,Boolean(ev.is_watched));
};

/* Historical film records: r5 returns only last 80 entries; fetch additional
   authenticated rows in the background, never replace the visible Home shell. */
let movieHistoryTask270=null,movieHistoryKey270='',movieHistoryComplete270=false,movieHistoryRows270=null;
function historyKey270(){return String(user?.id||session?.user?.id||'anon')}
function recordTime270(x){const n=Date.parse(x?.watched_at||'');return Number.isFinite(n)?n:0}
async function movieHistory270(){
 const key=historyKey270();
 if(movieHistoryComplete270&&movieHistoryKey270===key)return;
 if(movieHistoryTask270&&movieHistoryKey270===key)return movieHistoryTask270;
 movieHistoryKey270=key;
 movieHistoryTask270=(async()=>{
  const items=[];
  // Ordered newest first at the API, displayed chronologically with the newest
  // at the bottom of Histórico. Bounded 600 rows, 2 paginated reads.
  for(const offset of [0,300]){
   const part=await api('watch_history?select=id,media_id,title,watched_at&item_type=eq.movie&order=watched_at.desc,id.desc&limit=300&offset='+offset);
   if(!Array.isArray(part))throw new Error('History format');
   items.push(...part);
   if(part.length<300)break;
  }
  const base=Array.isArray(homeCache?.history_movies)?homeCache.history_movies:[];
  const media=new Map(base.filter(x=>Number(x.media_id)>0).map(x=>[Number(x.media_id),x]));
  const missing=[...new Set(items.map(x=>Number(x.media_id)).filter(id=>id>0&&!media.has(id)))];
  const tasks=[];
  for(let i=0;i<missing.length;i+=80){
   const ids=missing.slice(i,i+80);
   tasks.push(api('media?select=id,tmdb_id,title,poster_path,raw_tmdb&id=in.('+ids.join(',')+')&limit=100')
    .then(list=>{for(const m of Array.isArray(list)?list:[])media.set(Number(m.id),{media_id:Number(m.id),media_title:m.title,poster_path:m.poster_path||m.raw_tmdb?.poster_path||null,tmdb_id:Number(m.tmdb_id||m.raw_tmdb?.source_tmdb_id||0)})})
    .catch(()=>{}));
  }
  await Promise.all(tasks);
  const merged=new Map();
  for(const r of [...base,...items]){
   if(r.id==null)continue;
   const m=media.get(Number(r.media_id))||{},original=base.find(x=>String(x.id)===String(r.id))||{};
   merged.set(String(r.id),{
    ...original,...r,
    media_type:'movie',
    media_title:m.media_title||original.media_title||r.media_title||r.title||'Filme',
    poster_path:m.poster_path||original.poster_path||r.poster_path||null,
    tmdb_id:Number(m.tmdb_id||original.tmdb_id||r.tmdb_id||0)
   });
  }
  const rows=[...merged.values()].sort((a,b)=>recordTime270(a)-recordTime270(b)||Number(a.id)-Number(b.id));
  if(!rows.length)return;
  // Protect newer cache if another route mutated the record during retrieval.
  if(historyKey270()!==key)return;
  movieHistoryRows270=rows;homeCache=homeCache||{};homeCache.history_movies=rows;
  try{ct163Write('home',homeCache)}catch{}
  const viewport=q('[data-home-viewport="movies"]');
  const stack=q('.home-history .stack',viewport);
  if(stack&&route()==='home'){
   const before=viewport.scrollTop,oldHeight=q('.home-history',viewport)?.scrollHeight||0;
   stack.innerHTML=rows.map(x=>homeMovieRow158(x,true)).join('');
   const newHeight=q('.home-history',viewport)?.scrollHeight||oldHeight;
   viewport.scrollTop=Math.max(0,before+newHeight-oldHeight);
   lazyPosters270(stack);
  }
  movieHistoryComplete270=items.length<600;
 })().catch(e=>{document.documentElement.dataset.ct270MovieHistoryError=String(e?.message||e)}).finally(()=>{movieHistoryTask270=null});
 return movieHistoryTask270;
}
function maybeMovies270(){
 if(route()==='home'&&homeActiveTab158==='movies'&&session){
  void movieHistory270();
 }
}
const oldRenderHome270=renderHome;
renderHome=async function(...args){
 const out=await oldRenderHome270.apply(this,args);
 if(route()==='home')requestAnimationFrame(maybeMovies270);
 return out;
};
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-home-tab="movies"]'))requestAnimationFrame(()=>void movieHistory270());
},true);

/* Fast, audited first paint. Old r186 used three 6-page discover scans and
   then three more 6-page popular scans BEFORE it returned any cards. */
let activeForYou270=null,pendingForYou270=null,userForYou270='';
async function fastForYou270(force=false){
 const key=historyKey270()+':'+localDay();
 if(!force&&activeForYou270&&userForYou270===key)return activeForYou270;
 if(pendingForYou270&&userForYou270===key)return pendingForYou270;
 userForYou270=key;
 const job=(async()=>{
  const context=await ct186Context(force);
  const watch=ct186WatchPools(context);
  const fresh={movie:[],series:[],anime:[]};
  const settings=[
   ['movie','/discover/movie','movie',{'primary_release_date.gte':'1991-01-01','vote_count.gte':120}],
   ['series','/discover/tv','tv',{'first_air_date.gte':'1991-01-01','vote_count.gte':100}],
   ['anime','/discover/tv','tv',{'first_air_date.gte':'1991-01-01','vote_count.gte':60,with_origin_country:'JP',with_genres:'16'}]
  ];
  const quality=window.__ctR265Test?.allowed||(()=>false);
  await Promise.all(settings.map(async ([kind,path,type,params])=>{
   try{
    const raw=await pages(path,{...params,'vote_average.gte':CT186_MIN_SCORE,include_adult:false,without_genres:'99',sort_by:'popularity.desc'},type,2);
    fresh[kind]=ct186UniqueRows(raw).filter(x=>ct186FreshEligible(x,context)&&quality(x)&&
      (kind==='movie'?ct186Type(x)==='movie'&&!ct186Anime(x):kind==='anime'?ct186Type(x)==='tv'&&ct186Anime(x):ct186Type(x)==='tv'&&!ct186Anime(x)));
   }catch{fresh[kind]=[]}
  }));
  const data={_ct186_fresh:fresh,_ct186_watchlist:watch,_ct186_fallback:{movie:[],series:[],anime:[]},_ct186_reserve:{movie:[],series:[],anime:[]},_ct166_fresh:fresh,_ct166_watchlist:watch};
  const selected=ct186Select(data);
  Object.assign(data,{daily:selected.daily,movie:selected.fm,series:selected.fs,anime:selected.fa,
   watchlist_movie:selected.wm,watchlist_series:selected.ws,watchlist_anime:selected.wa,
   wmPool:selected.wmPool,wsPool:selected.wsPool,waPool:selected.waPool});
  if(userForYou270!==key)return data;
  activeForYou270=data;ct186ForYouData=data;
  discoverCache.set('r186:foryou:'+localDay(),data);
  try{ct163Write('discover:foryou:all',data)}catch{}
  // Additional requests are bounded and occur after visible content exists.
  const empty=['movie','series','anime'].filter(k=>fresh[k].length<(k==='movie'?3:2));
  if(empty.length)setTimeout(()=>{
   if(userForYou270!==key||activeForYou270!==data||!session)return;
   void Promise.allSettled(empty.map(async kind=>{
    const params=kind==='movie'?{'primary_release_date.gte':'1991-01-01'}:{'first_air_date.gte':'1991-01-01'};
    try{
     const p=kind==='movie'?'/discover/movie':'/discover/tv';
     const r=await pages(p,{...params,sort_by:'vote_average.desc','vote_average.gte':CT186_MIN_SCORE,'vote_count.gte':30,include_adult:false,without_genres:'99',...(kind==='anime'?{with_genres:'16',with_origin_country:'JP'}:{})},kind==='movie'?'movie':'tv',2);
     const next=ct186UniqueRows(r).filter(x=>ct186FreshEligible(x,context)&&quality(x)&&
      (kind==='movie'?ct186Type(x)==='movie'&&!ct186Anime(x):kind==='anime'?ct186Type(x)==='tv'&&ct186Anime(x):ct186Type(x)==='tv'&&!ct186Anime(x)));
     if(next.length&&activeForYou270===data){
      fresh[kind]=ct186MergeRows(fresh[kind],next);data._ct186_fresh=fresh;
      if(route()==='discover'&&discoverState?.tab==='foryou')paintDiscover(data);
     }
    }catch{}
   }));
  },1000);
  return data;
 })().finally(()=>{if(pendingForYou270===job)pendingForYou270=null});
 pendingForYou270=job;return job;
}
ct186LoadForYou=async function(force=false){return fastForYou270(force)};
const baseInvalid270=ct186Invalidate;
ct186Invalidate=function(...args){
 activeForYou270=null;userForYou270='';pendingForYou270=null;
 return baseInvalid270.apply(this,args);
};

/* WebView draws CSS background poster for every item in its large hidden
   history. Keep the DOM/cards, but load only images near the viewport. */
const posterObserver270=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
 for(const entry of entries){
  if(!entry.isIntersecting)continue;
  const el=entry.target;
  if(el.dataset.ct270Poster){el.style.backgroundImage=el.dataset.ct270Poster;delete el.dataset.ct270Poster}
  posterObserver270.unobserve(el);
 }
},{rootMargin:'250px 0px'}):null;
function lazyPosters270(root){
 if(!root||!posterObserver270)return;
 for(const el of root.querySelectorAll('.thumb[style*="background-image"],.poster[style*="background-image"]')){
  if(el.dataset.ct270Lazy==='1')continue;
  const image=el.style.backgroundImage;
  if(!image||image==='none')continue;
  el.dataset.ct270Lazy='1';el.dataset.ct270Poster=image;
  el.style.backgroundImage='none';posterObserver270.observe(el);
 }
}
const oldPaintHome270=paintHome;
paintHome=function(...args){
 if(movieHistoryRows270&&movieHistoryKey270===historyKey270()&&homeCache){
  const merged=new Map();
  for(const m of [...movieHistoryRows270,...(Array.isArray(homeCache.history_movies)?homeCache.history_movies:[])])if(m?.id!=null)merged.set(String(m.id),m);
  homeCache.history_movies=[...merged.values()].sort((a,b)=>recordTime270(a)-recordTime270(b)||Number(a.id)-Number(b.id));
 }
 const out=oldPaintHome270.apply(this,args);lazyPosters270(q('[data-home]'));return out
};
const oldPaintDiscover270=paintDiscover;
paintDiscover=function(...args){const out=oldPaintDiscover270.apply(this,args);lazyPosters270(q('[data-discover]'));return out};
// For first paint: never launch the old all-tabs/6-page preloader while Home,
// sports or Pra Você is loading; those routes fetch their own focused data.
ct163WarmOnIdle=function(){};
window.__ctR270Test={sportToggle270,fastForYou270,movieHistory270,lazyPosters270};
})();