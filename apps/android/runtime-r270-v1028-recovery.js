/* CineTracker Android 1.0.28 / r270 — isolate profile lists, quick eligible discovery,
   incremental movie history and mutation-safe sports watch. Web r541 unchanged. */
(()=>{
'use strict';
if(window.__ctR270AndroidV1028)return;
window.__ctR270AndroidV1028='profile-nonempty+discover-six-requests+history-pagination+sports-no-scroll';
const q=(selector,root=document)=>root?.querySelector?.(selector)||null;
const isProfile=()=>route()==='profile',isDiscover=()=>route()==='discover'&&discoverState?.tab==='foryou';
const nowUser=()=>String(session?.user?.id||user?.id||'anonymous');
const profileKey=()=> 'ct:r270:profile-lists:'+nowUser();
const listKinds={series:'series_history',movies:'movie_history',seriesfav:'series_favorites',moviefav:'movie_favorites'};
const sectionTitles={series:'Séries',movies:'Filmes',seriesfav:'Séries Favoritas',moviefav:'Filmes Favoritos',actors:'Atores Favoritos'};
const kindKeys={series:'series',movies:'movies',seriesfav:'series_favorites',moviefav:'movie_favorites',actors:'actors'};
const profileCounts={};
let savedRows=null,savedRowsUser='',profileGeneration=0;
const isArray=Array.isArray;
function readSavedProfile(){
 try{
  const data=JSON.parse(localStorage.getItem(profileKey())||'null');
  if(data&&Date.now()-Number(data.at||0)<1000*60*60*24*3&&isArray(data.lists?.series)&&isArray(data.lists?.movies))return data.lists;
 }catch{}return null;
}
function goodSummary(summary){return summary&&typeof summary==='object'&&['series','movies','series_favorites','movie_favorites','actors'].every(k=>isArray(summary[k]))}
function mergeLists(summary){
 const d=profileCache&&typeof profileCache==='object'?profileCache:{};
 const byId=new Map();
 const add=(arr,extras)=>{for(const item of arr||[]){
  if(!item||typeof item!=='object')continue;
  const key=String(item.media_type||'')+':'+String(item.tmdb_id||item.media_id||'');
  const previous=byId.get(key)||{};
  byId.set(key,{...previous,...item,...extras,is_favorite:Boolean(previous.is_favorite||item.is_favorite||extras.is_favorite),is_seen:Boolean(previous.is_seen||item.is_seen||extras.is_seen)});
 }};
 add(summary.series,{media_type:'tv'});
 add(summary.movies,{media_type:'movie',is_seen:true});
 add(summary.series_favorites,{media_type:'tv',is_favorite:true});
 add(summary.movie_favorites,{media_type:'movie',is_favorite:true});
 const dashboard=[...byId.values()];
 const merged={...d,dashboard:dashboard.length?dashboard:(isArray(d.dashboard)?d.dashboard:[]),
  favorite_actors:isArray(summary.actors)?summary.actors:(isArray(d.favorite_actors)?d.favorite_actors:[])};
 if(Object.keys(summary.counts||{}).length)Object.assign(profileCounts,summary.counts);
 profileCache=merged;savedRows=summary;savedRowsUser=nowUser();
 try{ct163Write('profile',merged);localStorage.setItem(profileKey(),JSON.stringify({at:Date.now(),lists:summary}))}catch{}
 return merged;
}
function injectCounts(){
 if(!isProfile())return;
 const root=q('[data-profile]');if(!root)return;
 const labels={series:'series',filmes:'movies','series favoritas':'series_favorites','filmes favoritos':'movie_favorites','atores favoritos':'actors'};
 for(const sec of root.querySelectorAll('section.panel')){
  const heading=q('.panel-head h2',sec);if(!heading)continue;
  const title=heading.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const key=labels[title];if(!key)continue;
  const total=Number(profileCounts[key]||0),head=q('.panel-head',sec);
  let btn=q('[data-ct263-profile-more]',head);
  if(total>12){
   if(!btn){btn=document.createElement('button');btn.type='button';btn.className='chip ct263-profile-more';head.appendChild(btn)}
   btn.dataset.ct263ProfileMore=Object.keys(kindKeys).find(k=>kindKeys[k]===key)||'actors';btn.textContent='Ver mais';
  }
 }
}
function paintLists(summary){
 if(!goodSummary(summary)||!isProfile())return false;
 const updated=mergeLists(summary);
 ct168PaintProfile(updated,'');
 try{syncProfile263()}catch{}
 injectCounts();
 try{void stadiumSync(false)}catch{}
 return true;
}
function profileLoadingNote(){
 if(!isProfile())return;
 const root=q('[data-profile]');
 if(!root)return;
 for(const sec of root.querySelectorAll('section.panel')){
  const title=q('.panel-head h2',sec)?.textContent?.trim();
  if(!Object.values(sectionTitles).includes(title))continue;
  const empty=q('.row .empty',sec);
  if(empty)empty.textContent='Carregando biblioteca...';
 }
}
let profileFetch=null,profileFetchUser='';
function fetchSummary(){
 if(profileFetch&&profileFetchUser!==nowUser())profileFetch=null;
 profileFetchUser=nowUser();
 if(profileFetch)return profileFetch;
 profileFetch=rpc('cinetracker_profile_summary_v489',{}).then(result=>{
  if(goodSummary(result))return result;
  throw Error('Profile lists contract unavailable');
 }).catch(async()=>{
  // Independent per-section SQL limits are only used if the summary times out.
  const entries=await Promise.allSettled(Object.entries(listKinds).map(async ([label,kind])=>{
   const p=await rpc('cinetracker_profile_list_v475',{p_kind:kind,p_limit:12,p_offset:0});
   return[label,{rows:isArray(p?.rows)?p.rows:[],count:Number(p?.count||0)}];
  }));
  const summary={series:[],movies:[],series_favorites:[],movie_favorites:[],actors:[],counts:{}};
  for(const item of entries)if(item.status==='fulfilled'){
   const [kind,value]=item.value,key=kindKeys[kind];
   summary[key]=value.rows;summary.counts[key]=value.count;
  }
  const actor=await rpc('cinetracker_profile_actors_v465',{p_limit:12}).catch(()=>null);
  if(actor){summary.actors=isArray(actor.rows)?actor.rows:[];summary.counts.actors=Number(actor.count||0)}
  if(!entries.some(x=>x.status==='fulfilled')&&!actor)throw Error('profile lists unavailable');
  return summary;
 }).finally(()=>{profileFetch=null});
 return profileFetch;
}
/* Avoid the expensive legacy full-profile RPC. Cached sections are painted at once,
   quick stats and twelve-card lists update independently; a slow/failed stats request
   can never erase the loaded library. */
renderProfile=async function(seq){
 const rootId=seq;
 setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile',
  '<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
 const existing=profileCache||ct163Read('profile')||{};
 profileCache=existing;
 if(Object.keys(existing).length)ct168PaintProfile(existing,'');
 const previous=(savedRowsUser===nowUser()?savedRows:null)||readSavedProfile();
 if(previous)paintLists(previous);else profileLoadingNote();
 const token=++profileGeneration;
 const valid=()=>rootId===navSeq&&isProfile()&&token===profileGeneration;
 const quick=rpc('cinetracker_profile_quick_stats_v1',{}).then(data=>{
  if(!valid())return;
  const d=ct168MergeQuick(profileCache||existing,data);
  profileCache=d;
  ct168PaintProfile(d,'');
  try{syncProfile263()}catch{}
  if(savedRowsUser===nowUser()&&savedRows)injectCounts();else profileLoadingNote();
  try{void stadiumSync(false)}catch{}
 }).catch(()=>{});
 const lists=fetchSummary().then(data=>{
  if(!valid())return;
  if(goodSummary(data))paintLists(data);
  else if(!previous)ct168ProfileNote('Não foi possível buscar a biblioteca. Tente abrir o Perfil novamente.');
 }).catch(e=>{if(valid()&&!previous)ct168ProfileNote('Biblioteca temporariamente indisponível: '+String(e?.message||e))});
 await Promise.allSettled([quick,lists]);
};
const moreBase=openProfileMore263;
openProfileMore263=function(kind){
 moreBase(kind);
 const modal=q('[data-ct263-profile-modal]'),grid=q('.ct263-profile-grid',modal);
 if(!grid)return;
 const action=listKinds[kind];
 if(kind==='actors'){
  void rpc('cinetracker_profile_actors_v465',{p_limit:50}).then(d=>{
   if(!modal.isConnected)return;
   const values=isArray(d?.rows)?d.rows:[];
   grid.innerHTML=values.map(x=>cardHtml263(kind,x)).join('')||'<div class="empty">Nenhum ator favorito.</div>';
  }).catch(()=>{});
  return;
 }
 if(!action)return;
 let offset=0,moreLoading=false;
 const load=async()=>{
  if(moreLoading)return;moreLoading=true;
  const button=q('[data-ct270-more]',modal);if(button){button.disabled=true;button.textContent='Carregando...'}
  try{
   const v=await rpc('cinetracker_profile_list_v475',{p_kind:action,p_limit:120,p_offset:offset});
   if(!modal.isConnected)return;
   const rows=isArray(v?.rows)?v.rows:[];
   if(offset===0)grid.innerHTML='';
   grid.insertAdjacentHTML('beforeend',rows.map(x=>cardHtml263(kind,x)).join(''));
   offset+=rows.length;
   const total=Number(v?.count||offset);
   q('[data-ct270-more]',modal)?.remove();
   if(offset<total&&rows.length){
    const button=document.createElement('button');button.type='button';button.className='chip';
    button.dataset.ct270More='1';button.textContent='Carregar mais ('+String(total-offset)+' restantes)';
    grid.after(button);button.addEventListener('click',()=>{void load()});
   }
  }catch(e){
   if(!modal.isConnected)return;
   const warning=document.createElement('p');warning.className='notice';warning.textContent='Não foi possível carregar mais itens: '+String(e?.message||e);grid.after(warning);
  }finally{moreLoading=false}
 };
 void load();
};

/* Every Sports watch click is owned before the old document handlers. A single
   optimistic local mutation, no render(), no go(), no page reload/refetch. */
const sportLocks=new Set();
function sportsButtons(eventId,on){
 for(const btn of document.querySelectorAll('[data-sport-watched="'+eventId+'"]')){
  btn.dataset.on=on?'1':'0';btn.classList.toggle('on',on);
  btn.textContent=on?'✓ Assistido':'✓ Marcar como assistido';
  btn.disabled=sportLocks.has(eventId);
 }
}
function sportsCacheSet(id,on){
 try{
  for(const x of sportsCache?.events||[])if(Number(x.id)===id)x.is_watched=on;
  if(sportsCache)ct163Write('sports',sportsCache);
  window.__ctA26PersistSports?.();
 }catch{}
}
window.addEventListener('click',event=>{
 const button=event.target?.closest?.('[data-sport-watched]');
 if(!button||!session)return;
 event.preventDefault();event.stopImmediatePropagation();event.stopPropagation();
 const id=Number(button.dataset.sportWatched);
 if(!(id>0)||sportLocks.has(id))return;
 const before=button.dataset.on==='1',next=!before;
 sportLocks.add(id);sportsButtons(id,next);sportsCacheSet(id,next);
 const request={p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()};
 void rpc('cinetracker_sport_mark_watched_v1',request).then(result=>{
  const actual=typeof result?.is_watched==='boolean'?result.is_watched:next;
  sportsCacheSet(id,actual);sportLocks.delete(id);sportsButtons(id,actual);
  profileCache=null;
  try{toast(actual?'Evento marcado como assistido.':'Evento removido dos assistidos.')}catch{}
 }).catch(err=>{
  sportsCacheSet(id,before);sportLocks.delete(id);sportsButtons(id,before);
  try{toast('Não foi possível marcar: '+String(err?.message||err))}catch{}
 });
},true);

/* A compact 6-page initial recommendation search, 2 pages/category in parallel.
   Heavy r267/r268 nested supplementary searches are not involved. Strict auth
   exclusion context and the existing seven-card renderer remain authoritative. */
let discoverTask=null,discoverValue=null,discoverKey='',discoverGeneration=0;
const restrict=x=>typeof window.__ctR265Test?.allowed==='function'?window.__ctR265Test.allowed(x):false;
function cleanNew(rows,kind,context){
 const type=kind==='movie'?'movie':'tv';
 return ct186UniqueRows(rows).filter(x=>ct186Type(x)===type&&
  (kind==='anime'?ct186Anime(x):!ct186Anime(x))&&restrict(x)&&ct186FreshEligible(x,context));
}
function buildDiscover(context,m,t,a){
 const f={movie:cleanNew(m,'movie',context),series:cleanNew(t,'series',context),anime:cleanNew(a,'anime',context)};
 const watch=ct186WatchPools(context),empty={movie:[],series:[],anime:[]};
 const data={_ct186_fresh:f,_ct186_watchlist:watch,_ct186_fallback:empty,_ct186_reserve:empty,_ct166_fresh:f,_ct166_watchlist:watch,
  __ct263Audited:true};
 const s=ct186Select(data);
 Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa,wmPool:s.wmPool,wsPool:s.wsPool,waPool:s.waPool});
 return data;
}
function saveDiscover(data){
 ct186ForYouData=data;
 const k='r186:foryou:'+localDay();discoverCache.set(k,data);
 try{ct163Write('discover:foryou:all',data)}catch{}
}
ct186LoadForYou=async function(force=false){
 const key=nowUser()+':'+localDay();
 if(!force&&key===discoverKey&&discoverValue)return discoverValue;
 if(!force&&key===discoverKey&&discoverTask)return discoverTask;
 const token=++discoverGeneration;discoverKey=key;
 const request=(async()=>{
  const contextPromise=ct186Context(Boolean(force));
  const common={'vote_average.gte':CT186_MIN_SCORE,without_genres:'99',include_adult:false,sort_by:'popularity.desc'};
  const queries=[
   pages('/discover/movie',{...common,'primary_release_date.gte':'1991-01-01','vote_count.gte':100},'movie',2).catch(()=>[]),
   pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':80},'tv',2).catch(()=>[]),
   pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':40,with_genres:'16',with_origin_country:'JP'},'tv',2).catch(()=>[])
  ];
  const [c,all]=await Promise.all([contextPromise,Promise.all(queries)]);
  const data=buildDiscover(c,...all);
  if(token===discoverGeneration){discoverValue=data;saveDiscover(data)}
  return data;
 })().finally(()=>{if(token===discoverGeneration)discoverTask=null});
 discoverTask=request;
 return request;
};
ct186RefreshVisible=async function(){
 if(!isDiscover())return null;
 discoverValue=null;discoverKey='';discoverTask=null;
 ct186Invalidate();
 const data=await ct186LoadForYou(true);
 if(isDiscover())paintDiscover(data);
 return data;
};
/* Keep the old always-on warm preload from launching 10 long TMDB/SQL jobs
   simultaneously after the first paint. The visible route is already loaded. */
ct163PreloadAll=function(){ct163PreloadStarted=true};

/* Movie history: use its own ranked watch-history RPC. No changing the Home
   tab, no full page repaints, no emptying existing records. Newest at bottom. */
let movieHistoryJob=null,movieHistoryRows=[],movieHistoryTotal=0,movieHistoryUser='';
async function movieHistoryPage(offset=0){
 const response=await rpc('cinetracker_profile_list_v475',{p_kind:'movie_history',p_limit:120,p_offset:offset});
 if(!isArray(response?.rows))throw Error('Movie history unavailable');
 return response;
}
function movieHistoryPaint(){
 if(route()!=='home')return;
 const view=q('[data-home-viewport="movies"]');if(!view)return;
 const rail=q('.home-history .stack',view);if(!rail)return;
 const before=rail.parentElement?.scrollHeight||0,oldTop=view.scrollTop;
 const ordered=[...movieHistoryRows].reverse();
 const markup=ordered.map(x=>{
  const movie={...x,media_type:'movie',watched_at:x.rank_at||x.last_watched_at};
  return homeMovieRow158(movie,true);
 }).join('')||'<div class="empty">Nenhum filme assistido no Histórico.</div>';
 const button=movieHistoryRows.length<movieHistoryTotal?'<button class="chip" type="button" data-ct270-movie-more>Carregar filmes anteriores ('+String(movieHistoryTotal-movieHistoryRows.length)+')</button>':'';
 rail.innerHTML=button+markup;
 const after=rail.parentElement?.scrollHeight||0;
 if(oldTop<100&&movieHistoryRows.length>120)view.scrollTop=oldTop+Math.max(0,after-before);
}
async function movieHistoryLoad(older=false){
 if(movieHistoryJob)return movieHistoryJob;
 if(movieHistoryUser!==nowUser()){movieHistoryRows=[];movieHistoryTotal=0;movieHistoryUser=nowUser()}
 if(!older&&movieHistoryRows.length){movieHistoryPaint();return}
 const offset=older?movieHistoryRows.length:0;
 movieHistoryJob=(async()=>{
  const result=await movieHistoryPage(offset);
  if(movieHistoryUser!==nowUser())return;
  const ids=new Set(older?movieHistoryRows.map(x=>String(x.media_type)+':'+String(x.tmdb_id||x.media_id)):[]);
  if(!older)movieHistoryRows=[];
  for(const row of result.rows){
   const key=String(row.media_type)+':'+String(row.tmdb_id||row.media_id);
   if(!ids.has(key)){ids.add(key);movieHistoryRows.push(row)}
  }
  movieHistoryTotal=Math.max(movieHistoryRows.length,Number(result.count||0));
  movieHistoryPaint();
 })().catch(()=>{}).finally(()=>{movieHistoryJob=null});
 return movieHistoryJob;
}
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-ct270-movie-more]')){event.preventDefault();event.stopImmediatePropagation();void movieHistoryLoad(true)}
 if(event.target?.closest?.('[data-home-tab="movies"]'))requestAnimationFrame(()=>{void movieHistoryLoad(false)});
},true);
const homeBase=renderHome;
renderHome=async function(...args){
 const output=await homeBase.apply(this,args);
 if(route()==='home'&&homeActiveTab158==='movies')void movieHistoryLoad(false);
 return output;
};
window.__ctR270Test={mergeLists,goodSummary,cleanNew,buildDiscover,sportsButtons,movieHistoryPage,profileKey};
})();