/* CineTracker Android 1.0.28/r270: data correctness and progressive rendering.
   The original Web r541 and the Android native shell remain untouched. */
(()=>{
'use strict';
if(window.__ctR270AndroidV1028)return;
window.__ctR270AndroidV1028='profile-real-library+foryou-progressive-audit+movie-history-complete+sports-no-refresh';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const arr=x=>Array.isArray(x)?x:[];
const uid=()=>String(user?.id||session?.user?.id||'');
const scoped=k=>'ct:r270:'+uid()+':'+k;
const get=k=>{try{return JSON.parse(localStorage.getItem(scoped(k))||'null')}catch{return null}};
const put=(k,data)=>{try{localStorage.setItem(scoped(k),JSON.stringify({time:Date.now(),data}))}catch{}};
const goodRecord=r=>r&&r.data&&Date.now()-Number(r.time||0)<2*86400000;
const deadline=(promise,ms)=>Promise.race([Promise.resolve(promise),new Promise((_,reject)=>setTimeout(()=>reject(new Error('TIMEOUT')),ms))]);

/* Profile: a quick-stats payload is NOT a complete library. Older Android r208
   discarded a previously valid dashboard when its fast read returned null.
   Keep the user's last real items; NEVER fabricate counts or media rows. */
let knownDashboard=[],knownActors=[],lastProfileUid='';
function profileKnown(){
 if(lastProfileUid===uid())return;
 lastProfileUid=uid();
 const d=get('dashboard'),a=get('actors');
 knownDashboard=goodRecord(d)?arr(d.data):[];
 knownActors=goodRecord(a)?arr(a.data):[];
}
profileKnown();
const originalProfilePaint=ct168PaintProfile;
function profileMerge(d){
 profileKnown();
 const x=d&&typeof d==='object'?d:{};
 const from=arr(x.dashboard),actors=arr(x.favorite_actors);
 if(from.length){knownDashboard=from;put('dashboard',from)}
 if(actors.length){knownActors=actors;put('actors',actors)}
 return {...x,dashboard:from.length?from:knownDashboard,
  favorite_actors:actors.length?actors:knownActors};
}
ct168PaintProfile=function(d,note){
 const merged=profileMerge(d);
 const result=originalProfilePaint.call(this,merged,note);
 if(!arr(merged.dashboard).length&&Number(merged.stats?.movies_watched||0)+Number(merged.stats?.episodes_watched||0)>0){
  for(const el of document.querySelectorAll('[data-profile] .row .empty'))el.textContent='Sincronizando biblioteca...';
 }
 return result;
};
let profileRecovery=null,profileRequestId=0;
async function recoverProfileFromRows(){
 // Targeted fallback if both canonical dashboard RPCs time out.
 // Always filter by the authenticated profile (in addition to existing RLS).
 const id=encodeURIComponent(uid());if(!id)return [];
 const [overrides,movies,episodes,progress]=await Promise.all([
  deadline(api('media_overrides?select=media_id,state&profile_id=eq.'+id+'&limit=1800'),11000).catch(()=>[]),
  deadline(api('watch_history?select=media_id,item_type,watched_at&profile_id=eq.'+id+'&item_type=eq.movie&order=watched_at.desc&limit=1200'),11000).catch(()=>[]),
  deadline(api('watch_history?select=media_id,item_type,watched_at&profile_id=eq.'+id+'&item_type=eq.episode&order=watched_at.desc&limit=1600'),11000).catch(()=>[]),
  deadline(api('episode_progress?select=media_id,watched_at&profile_id=eq.'+id+'&watched=eq.true&limit=1000'),11000).catch(()=>[])
 ]);
 const map=new Map();
 const entry=n=>{n=Number(n);if(!(n>0))return null;if(!map.has(n))map.set(n,{media_id:n,states:new Set(),seenMovie:false,seenTv:false,watched_episodes:0,last_watched_at:null});return map.get(n)};
 for(const x of arr(overrides)){const s=entry(x.media_id);if(s&&x.state)s.states.add(String(x.state))}
 for(const x of arr(movies)){const s=entry(x.media_id);if(s){s.seenMovie=true;if(x.watched_at&&(!s.last_watched_at||x.watched_at>s.last_watched_at))s.last_watched_at=x.watched_at}}
 for(const x of [...arr(episodes),...arr(progress)]){const s=entry(x.media_id);if(s){s.seenTv=true;s.watched_episodes++;if(x.watched_at&&(!s.last_watched_at||x.watched_at>s.last_watched_at))s.last_watched_at=x.watched_at}}
 if(!map.size)return [];
 const ids=[...map.keys()],all=[];
 for(let i=0;i<ids.length;i+=70){
  const result=await deadline(api('media?select=id,media_type,media_kind,tmdb_id,title,poster_path,release_year,runtime_minutes,total_episodes&'+'id=in.('+ids.slice(i,i+70).join(',')+')'),9000).catch(()=>[]);
  all.push(...arr(result));
 }
 const out=all.map(m=>{
  const s=map.get(Number(m.id));if(!s)return null;
  const tv=m.media_type==='tv',seen=tv?s.seenTv:s.seenMovie;
  return {...m,media_id:m.id,watched_episodes:tv?s.watched_episodes:0,
   is_favorite:s.states.has('Liked'),is_watchlist:s.states.has('AddedToWatchlist')||s.states.has('WatchLater'),
   is_seen:seen||s.states.has('AlreadySeen'),is_completed:s.states.has('Completed'),
   is_in_progress:s.states.has('InProgress')||tv&&s.seenTv,is_up_to_date:s.states.has('UpToDate'),
   last_watched_at:s.last_watched_at};
 }).filter(Boolean);
 return out.sort((a,b)=>String(b.last_watched_at||'').localeCompare(String(a.last_watched_at||'')));
}
async function recoverProfile(){
 if(!uid()||profileRecovery)return profileRecovery;
 const req=++profileRequestId;
 profileRecovery=(async()=>{
  let dash=null;
  for(const endpoint of ['cinetracker_profile_media_dashboard_v0997_fast','cinetracker_profile_media_dashboard_v0991']){
   try{
    const result=await deadline(rpc(endpoint,{}),12500);
    if(Array.isArray(result)&&result.length){dash=result;break}
   }catch{}
  }
  if(!dash?.length)try{dash=await recoverProfileFromRows()}catch{}
  let actors=knownActors;
  if(!actors.length)try{
   const result=await deadline(api('favorite_actors?select=tmdb_person_id,actor_name,profile_path,created_at&user_id=eq.'+encodeURIComponent(uid())+'&order=created_at.desc&limit=100'),6500);
   if(Array.isArray(result))actors=result;
  }catch{}
  if(!dash?.length&&!actors.length)return null;
  if(req!==profileRequestId||route()!=='profile')return null;
  const d=profileMerge({...profileCache,dashboard:dash||knownDashboard,favorite_actors:actors});
  // Full Profile component remains the authority for stats/plots and More buttons.
  if(!q('.favorite-overlay')&&!q('[data-ct263-profile-modal]')){
   const pane=q('[data-profile]'),near=pane?.closest('.content')||null;
   const scroll=near?.scrollTop||0,top=window.scrollY||0;
   originalProfilePaint(d,'');
   try{syncProfile263()}catch{}
   if(near)near.scrollTop=scroll;
   if(top>0&&window.scrollY!==top)window.scrollTo(0,top);
  }
  return d;
 })().finally(()=>{profileRecovery=null});
 return profileRecovery;
}
const originalRenderProfile=renderProfile;
renderProfile=async function(...args){
 profileKnown();
 if(knownDashboard.length&&route()==='profile'&&q('[data-profile]')){
  try{ct168PaintProfile({...profileCache,dashboard:knownDashboard,favorite_actors:knownActors},'Atualizando biblioteca...')}catch{}
 }
 const run=originalRenderProfile.apply(this,args);
 // The library request is independent of the stat payload and never blocks navigation.
 if(!knownDashboard.length||!arr(profileCache?.dashboard).length)void recoverProfile();
 try{return await run}finally{
  if(route()==='profile'&&!arr(profileCache?.dashboard).length)void recoverProfile();
 }
};

/* Pra Você: show the user's cached eligible candidates immediately, then
   audit new TMDB candidates in bounded background batches, never fake
   Watchlist membership or bypass age/short-film/reality/wrestling rules. */
let recInFlight=null,recGeneration=0,recCurrent=null;
const recStore=()=>get('foryou:'+localDay());
function emptyRec(){return{
 _ct186_fresh:{movie:[],series:[],anime:[]},
 _ct186_watchlist:{movie:[],series:[],anime:[]},
 _ct186_fallback:{movie:[],series:[],anime:[]}
}}
function recValidate(x){return x&&typeof x==='object'&&x._ct186_fresh&&x._ct186_watchlist}
function recSelect(data){
 const s=ct186Select(data);
 Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,
  watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa,
  wmPool:s.wmPool,wsPool:s.wsPool,waPool:s.waPool});
 ct186ForYouData=data;return data;
}
function showRec(data){
 if(recCurrent!==data||route()!=='discover'||discoverState?.tab!=='foryou')return;
 try{paintDiscover(recSelect(data))}catch{}
}
const allowed270=x=>window.__ctR265Test?.allowed?.(x)===true;
async function recCandidates(kind,context,pageCount=2){
 const movie=kind==='movie',anime=kind==='anime';
 const type=movie?'movie':'tv',path=movie?'/discover/movie':'/discover/tv';
 const search={sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':movie?80:45,without_genres:'99',include_adult:false,
  [movie?'primary_release_date.gte':'first_air_date.gte']:'1991-01-01',
  ...(anime?{with_origin_country:'JP',with_genres:'16'}:{})};
 const raw=await deadline(pages(path,search,type,pageCount),10500);
 const prior=ct186UniqueRows(arr(raw)).filter(x=>
  ct186FreshEligible(x,context)&&allowed270(x)&&
  (movie?ct186Type(x)==='movie'&&!ct186Anime(x):anime?ct186Type(x)==='tv'&&ct186Anime(x):ct186Type(x)==='tv'&&!ct186Anime(x)));
 const checked=await deadline(audit263(prior,'fresh',Math.min(18,prior.length)),13000);
 return arr(checked).filter(x=>ct186FreshEligible(x,context)&&allowed270(x));
}
async function buildRec(data,version,force=false){
 try{
  const context=await deadline(ct186Context(force),14000);
  if(version!==recGeneration||!context)return;
  data._ct186_watchlist=ct186WatchPools(context);
  showRec(data);
  // Parallel, independent categories. Repaint each as soon as it is audited.
  await Promise.allSettled(['movie','series','anime'].map(async kind=>{
   let fresh=[];
   try{fresh=await recCandidates(kind,context,2)}catch{}
   if(version!==recGeneration)return;
   data._ct186_fresh[kind]=ct186MergeRows(data._ct186_fresh[kind],fresh);
   data._ct166_fresh=data._ct186_fresh;
   data._ct166_watchlist=data._ct186_watchlist;
   put('foryou:'+localDay(),data);showRec(data);
  }));
  if(version!==recGeneration)return;
  // Only empty categories need the expensive six-page fallback; never block first paint.
  for(const kind of ['movie','series','anime']){
   if(arr(data._ct186_fresh[kind]).length>=(kind==='movie'?2:1))continue;
   try{
    const other=await deadline(ct186PopularPool(kind,context),15000);
    const checked=await deadline(audit263(arr(other),'fresh',15),12000);
    if(version!==recGeneration)return;
    data._ct186_fresh[kind]=ct186MergeRows(data._ct186_fresh[kind],
      arr(checked).filter(x=>ct186FreshEligible(x,context)&&allowed270(x)));
    put('foryou:'+localDay(),data);showRec(data);
   }catch{}
  }
 }catch(e){if(version===recGeneration)try{console.warn('Android Pra Você: aguardando sincronização',e)}catch{}}
 finally{if(version===recGeneration)recInFlight=null}
}
function startRec(force=false){
 if(!uid())return Promise.resolve(emptyRec());
 if(recInFlight&&!force)return Promise.resolve(recCurrent||emptyRec());
 if(force)recGeneration++;
 if(!recCurrent){
  const saved=recStore();
  recCurrent=goodRecord(saved)&&recValidate(saved.data)?saved.data:emptyRec();
 }
 const data=recSelect(recCurrent);
 if(!recInFlight){const version=++recGeneration;recInFlight=buildRec(data,version,force)}
 return Promise.resolve(data);
}
ct186LoadForYou=async function(force=false){return startRec(force)};
discoverRows=async function(tab){return String(tab)==='foryou'?startRec(false):previousDiscoverRows270(tab)};
ct186RefreshVisible=async function(){
 if(route()!=='discover'||discoverState?.tab!=='foryou')return null;
 recInFlight=null;
 return startRec(true);
};
// Initial cache may have been written by a broken Android version: never display it
// without running the current selection and detailed eligibility audit.
const previousDiscoverRows270=discoverRows;
const oldRecPaint=paintDiscover;
paintDiscover=function(data){
 if(discoverState?.tab==='foryou'&&recValidate(data)){
  try{data=recSelect(data)}catch{}
 }
 return oldRecPaint.call(this,data);
};

/* Movie history: the r5 Home SQL intentionally returns only 80 movies.
   Paginate only the authenticated user's own watch_history and rehydrate
   each movie with its true media poster/title; update only the history rail. */
let movieHistoryTask=null,movieHistoryAt=0;
async function fullMovieHistory(force=false){
 if(!uid())return [];
 const previous=get('movie-history');
 if(!force&&goodRecord(previous)&&Date.now()-previous.time<5*60000)return arr(previous.data);
 if(movieHistoryTask)return movieHistoryTask;
 movieHistoryTask=(async()=>{
  const rows=[];
  for(let off=0;off<600;off+=200){
   const part=await deadline(api('watch_history?select=id,media_id,title,watched_at,external_ids&item_type=eq.movie&order=watched_at.desc,id.desc&limit=200&offset='+off),11000);
   if(!Array.isArray(part))throw new Error('watch_history returned no array');
   rows.push(...part);if(part.length<200)break;
  }
  if(!rows.length)return [];
  const ids=[...new Set(rows.map(x=>Number(x.media_id)).filter(n=>n>0))],meta=new Map();
  for(let start=0;start<ids.length;start+=80){
   const part=await deadline(api('media?select=id,tmdb_id,title,poster_path,release_year,raw_tmdb&id=in.('+ids.slice(start,start+80).join(',')+')'),9000);
   for(const item of arr(part))meta.set(Number(item.id),item);
  }
  const merged=rows.map(x=>{
   const m=meta.get(Number(x.media_id))||{};
   return {...x,tmdb_id:Number(m.tmdb_id||m.raw_tmdb?.source_tmdb_id||0),
    media_title:m.title||x.title||'',poster_path:m.poster_path||m.raw_tmdb?.poster_path||null,
    media_type:'movie',release_year:m.release_year||null};
  }).sort((a,b)=>new Date(a.watched_at||0)-new Date(b.watched_at||0)||Number(a.id)-Number(b.id));
  put('movie-history',merged);movieHistoryAt=Date.now();return merged;
 })().finally(()=>{movieHistoryTask=null});
 return movieHistoryTask;
}
let movieHistoryLimit=120;
function paintMovieHistoryOnly(list,keepAnchor=false){
 const root=q('[data-home-viewport="movies"]');
 const stack=q('.home-history .stack',root),container=q('.home-history',root);
 if(!stack||!arr(list).length)return;
 const oldScroll=root.scrollTop,before=stack.offsetHeight;
 const shown=arr(list).slice(-movieHistoryLimit);
 stack.innerHTML=shown.map(x=>homeMovieRow158(x,true)).join('');
 let more=q('[data-ct270-movie-more]',container);
 if(shown.length<list.length){
  if(!more){more=document.createElement('button');more.type='button';more.className='chip ct270-movie-more';more.dataset.ct270MovieMore='1';container.insertBefore(more,stack)}
  more.textContent='Mostrar mais '+Math.min(120,list.length-shown.length)+' filmes antigos';
 }else more?.remove();
 homeCache={...(homeCache||{}),history_movies:list};
 root.scrollTop=keepAnchor?oldScroll+Math.max(0,stack.offsetHeight-before):oldScroll;
}
const originalRenderHome=renderHome;
renderHome=async function(...args){
 const p=originalRenderHome.apply(this,args);
 if(route()==='home'){
  const cached=get('movie-history');
  if(goodRecord(cached)&&arr(cached.data).length&&q('[data-home-viewport="movies"]'))
   paintMovieHistoryOnly(cached.data);
  if(Date.now()-movieHistoryAt>4*60000)void fullMovieHistory(false).then(rows=>{
   if(rows.length&&route()==='home')paintMovieHistoryOnly(rows);
  }).catch(()=>{});
 }
 return p;
};
document.addEventListener('click',e=>{
 const more=e.target?.closest?.('[data-ct270-movie-more]');
 if(more){e.preventDefault();e.stopImmediatePropagation();movieHistoryLimit+=120;paintMovieHistoryOnly(homeCache?.history_movies||[],true);return}
 if(e.target?.closest?.('[data-home-tab="movies"]')){
  requestAnimationFrame(()=>{
   const c=get('movie-history');
   if(goodRecord(c)&&arr(c.data).length)paintMovieHistoryOnly(c.data);
   if(Date.now()-movieHistoryAt>4*60000)void fullMovieHistory(false).then(rows=>{if(rows.length&&route()==='home')paintMovieHistoryOnly(rows)}).catch(()=>{});
  });
 }
},true);

window.__ctR270Test={profileMerge,emptyRec,recSelect,recCandidates,fullMovieHistory,paintMovieHistoryOnly,ct270Safe:true};
})();