/* CineTracker Android 1.0.28 / r270
   Bounded movie-history continuation, authoritative Sports optimistic click,
   scoped warm recommendations and network-priority first paint.
   Web r541, native Activity and other mutations are untouched. */
(()=>{
'use strict';
if(window.__ctR270AndroidV1028)return;
window.__ctR270AndroidV1028='movies-history-pages+sports-no-jump+foryou-warm-cache+poster-priority';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const rows=x=>Array.isArray(x)?x:[];
const uid=()=>String(session?.user?.id||user?.id||'');
const day=()=>localDay();
const preconnect=(url)=>{
 if(document.querySelector('link[data-ct270="'+url+'"]'))return;
 const el=document.createElement('link');el.rel='preconnect';el.href=url;el.crossOrigin='anonymous';
 el.dataset.ct270=url;document.head.appendChild(el);
};
preconnect('https://image.tmdb.org');
try{preconnect(new URL(SUPABASE_URL).origin)}catch{}

/* -------- Sport mutations. Stop r159's document-capture listener at WINDOW
   capture, before it issues a bulk sportsPayload(true) / paintSports().
   Keep DOM, tabs, active scroll and network single-flight. -------- */
const busySports=new Set();
function sportButtons(id){return [...document.querySelectorAll('[data-sport-watch="'+id+'"],[data-sport-watched="'+id+'"]')]}
function applySport(id,on){
 for(const btn of sportButtons(id)){
  const older=btn.hasAttribute('data-sport-watch');
  btn.dataset.watched=on?'1':'0';btn.dataset.on=on?'1':'0';
  btn.classList.toggle('on',on);
  btn.textContent=on?'✓ Assistido':older?'✓ Marcar assistido':'✓ Marcar como assistido';
  btn.disabled=busySports.has(id);
 }
 for(const item of rows(sportsCache?.events).concat(rows(sportsCache?.watch_history))){
  if(Number(item?.id||item?.event_id||0)===id)item.is_watched=on;
 }
 for(const item of document.querySelectorAll('.event,.ct165-event')){
  if(item.querySelector('[data-sport-watch="'+id+'"],[data-sport-watched="'+id+'"]'))item.classList.toggle('watched',on);
 }
}
function persistSportCache(){
 try{if(sportsCache){ct163Write('sports',sportsCache);window.__ctA26PersistSports?.()}}catch{}
}
function sportsClick(e){
 const btn=e.target?.closest?.('[data-sport-watch],[data-sport-watched]');
 if(!btn||!session)return;
 const id=Number(btn.dataset.sportWatch||btn.dataset.sportWatched||0);
 if(!(id>0))return;
 e.preventDefault();e.stopImmediatePropagation();
 if(btn.disabled||busySports.has(id))return;
 const old=btn.dataset.watched==='1'||btn.dataset.on==='1',next=!old;
 busySports.add(id);applySport(id,next);persistSportCache();
 const originScroll=window.scrollY;
 void rpc('cinetracker_sport_mark_watched_v1',{
  p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()
 }).then(result=>{
  const actual=typeof result?.is_watched==='boolean'?result.is_watched:next;
  applySport(id,actual);persistSportCache();
  profileCache=null;
  try{localStorage.removeItem('cinetracker:preload:r163:profile')}catch{}
  toast(actual?'Evento marcado como assistido.':'Evento removido dos assistidos.');
 }).catch(err=>{
  applySport(id,old);persistSportCache();toast('Esportes: '+(err?.message||err));
 }).finally(()=>{
  busySports.delete(id);applySport(id,(sportButtons(id)[0]?.dataset.watched==='1'));
 });
}
window.addEventListener('click',sportsClick,true);

/* -------- Full movie history: Home RPC is deliberately capped at 80.
   The remaining authenticated rows load only when Movies is visible, with
   a finite 40-page limit, separate media hydration, and no Home remount. -------- */
const PAGE=120,MAX_PAGES=40,historyTasks=new Map(),historyMemo=new Map();
const historyKey=()=> 'ct:r270:movie-history:'+uid();
function historyMeta(rowsIn){
 const ids=[...new Set(rowsIn.map(x=>Number(x.media_id)||0).filter(Boolean))];
 return ids;
}
async function movieHistoryFetch(){
 const result=[];
 for(let page=0;page<MAX_PAGES;page++){
  const offset=page*PAGE;
  const path='watch_history?select=id,media_id,title,watched_at,external_ids&item_type=eq.movie&order=watched_at.desc,id.desc&limit='+PAGE+'&offset='+offset;
  const chunk=rows(await api(path));
  result.push(...chunk);
  if(chunk.length<PAGE)break;
 }
 const media=new Map(),ids=historyMeta(result);
 for(let i=0;i<ids.length;i+=100){
  const group=ids.slice(i,i+100);
  const detail=rows(await api('media?select=id,title,tmdb_id,poster_path,raw_tmdb&id=in.('+group.join(',')+')'));
  for(const m of detail)media.set(Number(m.id),m);
 }
 const normalized=result.map(x=>{
  const m=media.get(Number(x.media_id))||{};
  return{...x,media_title:m.title||x.title||'Filme',
   title:x.title||m.title||'Filme',tmdb_id:Number(m.tmdb_id||m.raw_tmdb?.source_tmdb_id||0),
   poster_path:m.poster_path||m.raw_tmdb?.poster_path||null,media_type:'movie'};
 });
 normalized.sort((a,b)=>{
  const diff=Date.parse(a.watched_at||0)-Date.parse(b.watched_at||0);
  return diff||Number(a.id||0)-Number(b.id||0);
 });
 return normalized;
}
function insertHistory(items){
 if(route()!=='home'||homeActiveTab158!=='movies'||!items?.length)return false;
 const vp=q('[data-home-viewport="movies"]');
 const stack=q('.home-history .stack',vp);
 if(!vp||!stack)return false;
 const oldHeight=vp.scrollHeight,oldTop=vp.scrollTop;
 const oldCount=stack.querySelectorAll('.home-action-row').length;
 if(items.length<=oldCount&&stack.dataset.ct270History===String(items.length))return true;
 stack.innerHTML=items.map(x=>homeMovieRow158(x,true)).join('');
 stack.dataset.ct270History=String(items.length);
 const delta=vp.scrollHeight-oldHeight;
 // Old 80 newest rows remain next to Watchlist, so compensate when older
 // history is prepended. Do not send the user back to the top.
 vp.scrollTop=Math.max(0,oldTop+delta);
 return true;
}
function readHistoryCache(){
 try{
  if(historyMemo.has(historyKey()))return historyMemo.get(historyKey());
  const x=JSON.parse(sessionStorage.getItem(historyKey())||'null');
  if(x&&Date.now()-Number(x.at)<6*3600000&&Array.isArray(x.items))return x.items;
 }catch{}return null;
}
function historySchedule(){
 if(route()!=='home'||homeActiveTab158!=='movies'||!uid())return;
 const k=historyKey(),cached=readHistoryCache();
 if(cached?.length)insertHistory(cached);
 if(historyTasks.has(k))return;
 const latest=rows(homeCache?.history_movies)[0]?.id;
 try{
  const rec=JSON.parse(sessionStorage.getItem(k)||'null');
  if(rec&&rec.latest===latest&&Date.now()-Number(rec.at)<10*60*1000)return;
 }catch{}
 const job=movieHistoryFetch().then(items=>{
  if(!items.length)return;
  historyMemo.set(k,items);
  try{sessionStorage.setItem(k,JSON.stringify({at:Date.now(),latest,items}))}catch{}
  insertHistory(items);
 }).catch(err=>{
  document.documentElement.dataset.ct270HistoryError=String(err?.message||err).slice(0,140);
 }).finally(()=>historyTasks.delete(k));
 historyTasks.set(k,job);
}
const baseHomePaint=paintHome;
paintHome=function(...args){
 const out=baseHomePaint.apply(this,args);
 queueMicrotask(()=>{deferPosters(q('[data-home]'));historySchedule()});
 return out;
};
document.addEventListener('click',ev=>{
 if(ev.target?.closest?.('[data-home-tab="movies"]'))requestAnimationFrame(historySchedule);
},true);
window.addEventListener('cinetracker:data-changed',()=>{
 historyMemo.delete(historyKey());
 try{sessionStorage.removeItem(historyKey())}catch{}
});


/* Lazy offscreen poster backgrounds: preserve image URLs, skip competing CDN
   requests until cards approach the visible WebView viewport. */
const posterObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
 for(const entry of entries){
  if(!entry.isIntersecting)continue;
  const el=entry.target;if(el.dataset.ct270Poster){el.style.backgroundImage=el.dataset.ct270Poster;delete el.dataset.ct270Poster}
  posterObserver.unobserve(el);
 }
},{root:null,rootMargin:'400px 0px'}):null;
function deferPosters(root){
 if(!posterObserver||!root)return;
 const viewportHeight=window.innerHeight||document.documentElement.clientHeight||800;
 for(const el of root.querySelectorAll('.thumb,.poster')){
  if(el.dataset.ct270LazyDone)return;
  el.dataset.ct270LazyDone='1';
  const image=el.style.backgroundImage;
  if(!image||image==='none')continue;
  const box=el.getBoundingClientRect();
  if(box.top<viewportHeight+450&&box.bottom>-300)continue;
  el.dataset.ct270Poster=image;el.style.backgroundImage='none';
  posterObserver.observe(el);
 }
}
/* -------- Pra Você. Don't wait for a 6+6+6 page TMDB bulk search on each
   revisit. Only reuse validated user/day snapshots, invalidate on mutation,
   keep all 7 original slots/actions and the real eligibility audit. -------- */
const forYouKey=()=> 'ct:r270:foryou:'+uid()+':'+day();
const basePools=ct186FreshPools,basePopular=ct186PopularPool,baseLoad=ct186LoadForYou;
ct186FreshPools=async function(ctx){
 const genres=ct186FavoriteGenres(ctx.dash),withGenres=genres.length?genres.join('|'):undefined;
 const common={'vote_average.gte':CT186_MIN_SCORE,without_genres:'99',include_adult:false};
 const [m,t,a]=await Promise.all([
  pages('/discover/movie',{...common,'primary_release_date.gte':'1991-01-01','vote_count.gte':120,with_genres:withGenres,sort_by:'vote_average.desc'},'movie',2),
  pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':100,with_genres:withGenres,sort_by:'vote_average.desc'},'tv',2),
  pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':60,with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc'},'tv',2)
 ]);
 const clean=list=>ct186UniqueRows(list).filter(x=>ct186FreshEligible(x,ctx));
 return{movie:clean(m).filter(x=>!ct186Anime(x)),series:clean(t).filter(x=>!ct186Anime(x)),anime:clean(a).filter(ct186Anime)};
};
ct186PopularPool=async function(kind,ctx){
 const common={'vote_average.gte':CT186_MIN_SCORE,without_genres:'99',include_adult:false,sort_by:'popularity.desc'};
 const type=kind==='movie'?'movie':'tv',path=kind==='movie'?'/discover/movie':'/discover/tv';
 const params={...common,...(type==='movie'?{'primary_release_date.gte':'1991-01-01','vote_count.gte':120}:{'first_air_date.gte':'1991-01-01','vote_count.gte':kind==='anime'?60:100}),...(kind==='anime'?{with_origin_country:'JP',with_genres:'16'}:{})};
 const out=await pages(path,params,type,2);
 return ct186UniqueRows(out).filter(x=>ct186FreshEligible(x,ctx)&&
  (kind==='movie'?ct186Type(x)==='movie'&&!ct186Anime(x):kind==='anime'?ct186Type(x)==='tv'&&ct186Anime(x):ct186Type(x)==='tv'&&!ct186Anime(x)));
};
let quickForYou=null;
function restoreForYou(){
 try{
  if(quickForYou?.key===forYouKey()&&Date.now()-quickForYou.at<12*60*1000)return quickForYou.data;
  const rec=JSON.parse(sessionStorage.getItem(forYouKey())||'null');
  if(rec?.at&&Date.now()-rec.at<12*60*1000&&rec.data?._ct186_fresh&&rec.data?._ct186_watchlist)return rec.data;
 }catch{}return null;
}
ct186LoadForYou=async function(force=false){
 if(!force){
  const saved=restoreForYou();
  if(saved){
   ct186ForYouData=saved;
   discoverCache.set('r186:foryou:'+day(),saved);
   return saved;
  }
 }
 const data=await baseLoad.apply(this,arguments);
 if(data?._ct186_fresh&&data?._ct186_watchlist){
  quickForYou={key:forYouKey(),at:Date.now(),data};
  try{sessionStorage.setItem(forYouKey(),JSON.stringify({at:quickForYou.at,data}))}catch{}
 }
 return data;
};
const baseInvalidation=ct186Invalidate;
ct186Invalidate=function(...args){
 quickForYou=null;
 try{sessionStorage.removeItem(forYouKey())}catch{}
 return baseInvalidation.apply(this,args);
};
const prevDiscoverPaint=paintDiscover;
paintDiscover=function(...args){const out=prevDiscoverPaint.apply(this,args);queueMicrotask(()=>deferPosters(q('[data-discover]')));return out};
const prevSportsPaint=paintSports;
paintSports=function(...args){const out=prevSportsPaint.apply(this,args);queueMicrotask(()=>deferPosters(q('[data-sports]')));return out};
/* Constrain the previous r267 after-paint top-up, which otherwise issues
   another nine pages on every new user-visible selection. */
/* Idle warmup cannot launch all long media/discover/sports requests in parallel:
   it competed with the first visible screen and CDN poster requests. */
ct163PreloadAll=function(){
 if(ct163PreloadStarted||!session)return;
 ct163PreloadStarted=true;
 const jobs=[];
 if(route()!=='home'&&!ct163Read('home'))jobs.push(rpc('cinetracker_home_live_v0997_r3',{p_today:day()}).then(data=>ct163Write('home',data)).catch(()=>{}));
 void Promise.allSettled(jobs);
};
const links=document.querySelectorAll('link[rel="preconnect"]');
window.__ctR270Test={sportsClick,movieHistoryFetch,historySchedule,insertHistory,restoreForYou,forYouKey};
})();