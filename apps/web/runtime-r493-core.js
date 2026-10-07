/* CT_R493_CORE_START */
const CT493_CACHE_MS=5*60*1000;
function ct493Rows(v){return Array.isArray(v)?v:[]}
function ct493One(v){return Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?v[0]:(v&&typeof v==='object'?v:{})}
function ct493Deadline(p,ms){return Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))])}
function ct493CacheRead(key,maxAge=CT493_CACHE_MS){try{const x=JSON.parse(sessionStorage.getItem(key)||'null');return x&&Date.now()-Number(x.at||0)<maxAge?x.data:null}catch{return null}}
function ct493CacheWrite(key,data){try{sessionStorage.setItem(key,JSON.stringify({at:Date.now(),data}))}catch{}}

let ct493HomeKind='series',ct493SeriesTask=null,ct493HistoryTask=null,ct493MoviesTask=null;
let ct493Series=[],ct493History=null,ct493Movies=[],ct493MovieTotal=0;

function ct493SkeletonRows(n=6){return Array.from({length:n},()=>'<div class="ct493-sk-row"><div class="ct493-sk-poster"></div><div class="ct493-sk-copy"><span></span><span></span></div></div>').join('')}
function ct493MovieSkeleton(n=10){return Array.from({length:n},()=>'<article class="card ct493-poster-skeleton"><div class="poster"></div><div class="card-body"><b></b><small></small></div></article>').join('')}
function ct493HomeMarkup(){
 const opts=[['added_desc','Último adicionado'],['added_asc','Primeiro adicionado'],['release_desc','Último lançado'],['release_asc','Primeiro lançado'],['az','A-Z'],['za','Z-A']];
 return '<div class="home-tabs" role="tablist" aria-label="Home"><button type="button" class="chip active" data-home-tab="series" role="tab" aria-selected="true">Séries</button><button type="button" class="chip" data-home-tab="movies" role="tab" aria-selected="false">Filmes</button></div>'+
  '<div data-home-view="series" class="home-list"><section class="home-section" data-ct388-series-loading data-ct493-series-loading><div class="panel-head"><h3>Continuar assistindo</h3><small>…</small></div><div class="ct493-home-skeleton">'+ct493SkeletonRows(6)+'</div></section><section class="home-section ct274-history ct276-history" data-ct274-history="episodes" data-ct388-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><small>…</small></div><div class="stack ct274-history-stack"><div class="ct493-history-skeleton">'+ct493SkeletonRows(3)+'</div></div></section></div>'+
  '<div data-home-view="movies" class="home-list hidden" hidden><section class="home-section" data-ct388-movie-watch><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><div class="ct388-movie-tools"><small data-ct388-movie-count>…</small><label class="ct388-sort-wrap" title="Ordenar Watchlist"><span>⇅</span><select data-ct388-movie-sort aria-label="Ordenar Watchlist">'+opts.map(([v,l])=>'<option value="'+v+'">'+l+'</option>').join('')+'</select></label></div></div><div class="ct388-movie-stack ct492-movie-grid">'+ct493MovieSkeleton(10)+'</div><div class="ct492-more-wrap" data-ct493-movie-more-wrap hidden><button type="button" class="chip ct492-more" data-ct493-movies-more>Carregar mais filmes</button></div></section><section class="home-section ct274-history ct276-history" data-ct274-history="movies" data-ct388-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><small>…</small></div><div class="stack ct274-history-stack"><div class="ct493-history-skeleton">'+ct493SkeletonRows(3)+'</div></div></section></div>';
}
function ct493SyncR388(){try{window.__ctR388Test?.setHome?.({series:ct493Series,history:ct493History,movies:ct493Movies})}catch{}}
function ct493PaintHistory(kind){
 const ep=kind==='episodes',view=document.querySelector('[data-home-view="'+(ep?'series':'movies')+'"]'),sec=view?.querySelector(':scope > [data-ct388-history="'+kind+'"]');
 if(!sec||!ct493History)return false;
 const data=ct493Rows(ep?ct493History.history_episodes:ct493History.history_movies),label=ep?'Histórico recente':'Filmes vistos';let body='';
 try{if(typeof ct274HistoryRows==='function')body=ct274HistoryRows(data,ep?'episode':'movie',{series:ct493Series,movie_watchlist:ct493Movies,history_episodes:ct493Rows(ct493History.history_episodes),history_movies:ct493Rows(ct493History.history_movies)})||''}catch{}
 if(!body)body=data.map(x=>mediaRow({...x,media_type:ep?'tv':'movie',tmdb_id:Number(x?.tmdb_id||0)},ep?('S'+String(Number(x?.season_number||0)).padStart(2,'0')+' E'+String(Number(x?.episode_number||0)).padStart(2,'0')):(x?.watched_at?new Date(x.watched_at).toLocaleString('pt-BR'):'Visto'))).join('');
 sec.innerHTML='<div class="panel-head"><h3>'+label+'</h3><small>'+data.length+'</small></div><div class="stack ct274-history-stack">'+(body||'<div class="empty">Nenhum item.</div>')+'</div>';
 return true;
}
function ct493PaintSeries(){
 if(route()!=='home')return false;
 ct493SyncR388();
 try{window.__ctR388?.renderSeries?.()}catch{}
 const first=document.querySelector('[data-home-view="series"] > [data-ct388-series-section] h3');
 if(first&&/assistir a seguir/i.test(first.textContent||''))first.textContent='Continuar assistindo';
 document.documentElement.dataset.ct493SeriesReady=String(ct493Series.length);
 return true;
}
function ct493PaintMovies(){
 if(route()!=='home')return false;
 ct493SyncR388();
 try{window.__ctR388?.renderMoviesAll?.()}catch{}
 const count=document.querySelector('[data-ct388-movie-count]');
 if(count)count.textContent=ct493Movies.length.toLocaleString('pt-BR')+(ct493MovieTotal>ct493Movies.length?' / '+ct493MovieTotal.toLocaleString('pt-BR'):'');
 const wrap=document.querySelector('[data-ct493-movie-more-wrap]');
 if(wrap)wrap.hidden=!(ct493MovieTotal>ct493Movies.length);
 document.documentElement.dataset.ct493MoviesReady=String(ct493Movies.length)+'/'+String(ct493MovieTotal);
 return true;
}
function ct493HomeError(kind,message){
 const target=kind==='series'?document.querySelector('[data-ct493-series-loading]'):kind==='movies'?document.querySelector('.ct388-movie-stack'):null;
 if(target&&!((kind==='series'&&ct493Series.length)||(kind==='movies'&&ct493Movies.length)))target.innerHTML='<div class="empty">Não foi possível carregar agora. <button type="button" class="chip" data-ct493-home-retry="'+kind+'">Tentar novamente</button></div>';
 document.documentElement.dataset.ct493HomeError=kind+':'+String(message||'erro');
}
async function ct493LoadSeries(force=false){
 if(ct493SeriesTask)return ct493SeriesTask;
 const limit=Math.max(24,Math.min(250,Number(document.documentElement.dataset.ct492SeriesLimit||24)||24));
 if(!force&&!ct493Series.length){
  const c=ct493CacheRead('ct493:home:series');
  if(c?.rows?.length){ct493Series=c.rows;window.__ctR492SeriesCounts=c.counts||{};ct493PaintSeries()}
 }
 ct493SeriesTask=(async()=>{try{
  const raw=await ct493Deadline(rpc('cinetracker_home_series_v492',{p_today:localDay(),p_limit_per_bucket:limit}),3500),data=raw?.data??raw??{},rows=ct493Rows(data?.rows);
  if(rows.length){ct493Series=rows;window.__ctR492SeriesCounts=data?.counts||{};ct493CacheWrite('ct493:home:series',{rows,counts:data?.counts||{}});ct493PaintSeries();ct493PaintHistory('episodes')}
  else if(!ct493Series.length)ct493HomeError('series','empty');
  return ct493Series;
 }catch(e){ct493HomeError('series',e?.message||e);return ct493Series}
 finally{ct493SeriesTask=null}})();
 return ct493SeriesTask;
}
async function ct493LoadHistory(force=false){
 if(ct493HistoryTask)return ct493HistoryTask;
 if(!force&&!ct493History){
  const c=ct493CacheRead('ct493:home:history');
  if(c){ct493History=c;ct493SyncR388();ct493PaintHistory('episodes');ct493PaintHistory('movies')}
 }
 ct493HistoryTask=(async()=>{try{
  const raw=await ct493Deadline(rpc('cinetracker_home_history_v391',{p_limit:100}),3000);
  if(raw&&typeof raw==='object'){ct493History=raw;ct493CacheWrite('ct493:home:history',raw);ct493SyncR388();ct493PaintHistory('episodes');ct493PaintHistory('movies')}
  return ct493History;
 }catch(e){document.documentElement.dataset.ct493HistoryError=String(e?.message||e);return ct493History}
 finally{ct493HistoryTask=null}})();
 return ct493HistoryTask;
}
async function ct493LoadMovies(force=false,append=false){
 if(ct493MoviesTask)return ct493MoviesTask;
 if(!force&&!append&&!ct493Movies.length){
  const c=ct493CacheRead('ct493:home:movies');
  if(c?.rows?.length){ct493Movies=c.rows;ct493MovieTotal=Number(c.total||c.rows.length);ct493PaintMovies()}
 }
 const offset=append?ct493Movies.length:0;
 ct493MoviesTask=(async()=>{try{
  const raw0=await ct493Deadline(rpc('cinetracker_home_movies_v405',{p_limit:60,p_offset:offset}),3000),raw=raw0?.data??raw0??{},incoming=ct493Rows(raw?.rows);
  if(append){
   const seen=new Set(ct493Movies.map(x=>Number(x?.media_id||x?.id||0)));
   for(const x of incoming){const id=Number(x?.media_id||x?.id||0);if(id&&!seen.has(id)){seen.add(id);ct493Movies.push(x)}}
  }else ct493Movies=incoming;
  ct493MovieTotal=Math.max(Number(raw?.count||0)||0,ct493Movies.length);
  if(ct493Movies.length){ct493CacheWrite('ct493:home:movies',{rows:ct493Movies,total:ct493MovieTotal});ct493PaintMovies()}
  else if(!append)ct493HomeError('movies','empty');
  return ct493Movies;
 }catch(e){ct493HomeError('movies',e?.message||e);return ct493Movies}
 finally{ct493MoviesTask=null}})();
 return ct493MoviesTask;
}
function ct493SelectHome(kind,resetScroll=true){
 const wanted=kind==='movies'?'movies':'series';
 ct493HomeKind=wanted;
 const root=document.querySelector('[data-home]');
 if(!root)return false;
 root.dataset.ct493HomeTab=wanted;
 root.querySelectorAll('[data-home-tab]').forEach(b=>{const on=b.dataset.homeTab===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 root.querySelectorAll('[data-home-view]').forEach(v=>{const on=v.dataset.homeView===wanted;v.hidden=!on;v.classList.toggle('hidden',!on)});
 if(resetScroll){try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo?.(0,0)}}
 if(wanted==='movies'){void ct493LoadMovies(false,false);if(ct493History)ct493PaintHistory('movies')}
 else{void ct493LoadSeries(false);if(ct493History)ct493PaintHistory('episodes')}
 return true;
}
function ct493HydrateHome(){
 const s=ct493CacheRead('ct493:home:series'),h=ct493CacheRead('ct493:home:history');
 if(s?.rows?.length){ct493Series=s.rows;window.__ctR492SeriesCounts=s.counts||{};ct493PaintSeries()}
 if(h){ct493History=h;ct493SyncR388();ct493PaintHistory('episodes');ct493PaintHistory('movies')}
}
async function renderHome493(seq){
 ct493HomeKind='series';
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home>'+ct493HomeMarkup()+'</div>'));
 if(seq!==navSeq||route()!=='home')return false;
 ct493HydrateHome();
 ct493SelectHome('series',false);
 void ct493LoadSeries(true);
 void ct493LoadHistory(true);
 document.documentElement.dataset.ct493Home='progressive-direct';
 return true;
}
function ct493EnsureHome(){if(route()!=='home')return false;if(!document.querySelector('[data-home]'))void renderHome493(navSeq);return true}
function ct493RefreshHome(){
 try{sessionStorage.removeItem('ct493:home:series');sessionStorage.removeItem('ct493:home:history');sessionStorage.removeItem('ct493:home:movies')}catch{}
 void ct493LoadSeries(true);void ct493LoadHistory(true);if(ct493HomeKind==='movies')void ct493LoadMovies(true,false)
}
window.__ctR493Home={get kind(){return ct493HomeKind},render:renderHome493,ensure:ct493EnsureHome,select:ct493SelectHome,loadSeries:ct493LoadSeries,loadHistory:ct493LoadHistory,loadMovies:(force=false)=>ct493LoadMovies(force,false),loadMoreMovies:()=>ct493LoadMovies(true,true),refresh:ct493RefreshHome};
window.__ctR492LoadMoreMovies=()=>ct493LoadMovies(true,true);

function ct493PaintProfile(summary,quick,stats,sports,activity){
 const st=ct493One(stats),qv=ct493One(quick),sp=ct493One(sports),sum=ct493One(summary),act=ct493Rows(activity);
 const sportsStats={...(qv?.sports_stats||{}),watched_events:Number(sp?.watched_events??qv?.sports_stats?.watched_events??0)};
 const merged={stats:qv?.stats||st||{},series_stats:qv?.series_stats||{},remaining:qv?.remaining||{},activity:act,dashboard:[],favorite_actors:ct493Rows(sum?.actors),sports_stats:sportsStats};
 profileCache=merged;
 if(typeof ct168PaintProfile!=='function')throw new Error('PROFILE_PAINTER_UNAVAILABLE');
 ct168PaintProfile(merged,'');
 ct491PatchProfileLists(sum);
 ct491PatchSports(sportsStats,{stadium_events:Number(sp?.stadium_events||0),watched_events:Number(sp?.watched_events||0)});
 try{if(typeof ct169RenderActivity==='function')ct169RenderActivity(act)}catch{}
 const root=$('[data-profile]');
 if(root){root.dataset.ct493Profile='ready';root.dataset.ct493Lists='12-exact';root.dataset.ct493Source='summary+quick+stats+sports+activity'}
 ct493CacheWrite('ct493:profile',{summary:sum,quick:qv,stats:st,sports:sp,activity:act});
 return true;
}
async function renderProfile493(seq){
 setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile><div class="ct493-profile-loading"><div class="loader">Carregando Perfil...</div>'+ct493SkeletonRows(6)+'</div></div>'));
 if(seq!==navSeq||route()!=='profile')return false;
 const cached=ct493CacheRead('ct493:profile',2*60*1000);
 if(cached?.summary){try{ct493PaintProfile(cached.summary,cached.quick,cached.stats,cached.sports,cached.activity)}catch{}}
 const jobs=await Promise.allSettled([
  ct493Deadline(rpc('cinetracker_profile_summary_v489',{}),2500),
  ct493Deadline(rpc('cinetracker_profile_quick_stats_v1',{}),2500),
  ct493Deadline(rpc('cinetracker_profile_stats',{}),1800),
  ct493Deadline(rpc('cinetracker_sports_stadium_summary_v296',{}),1500),
  ct493Deadline(rpc('cinetracker_activity_by_day_v320',{p_days:15,p_tz:tz()}),1800)
 ]);
 if(seq!==navSeq||route()!=='profile')return false;
 const val=(i,fallback)=>jobs[i].status==='fulfilled'?jobs[i].value:fallback;
 const summary=val(0,cached?.summary||{}),quick=val(1,cached?.quick||{}),stats=val(2,cached?.stats||{}),sports=val(3,cached?.sports||{}),activity=val(4,cached?.activity||[]);
 if(!ct493Rows(ct493One(summary)?.series).length&&!cached?.summary){
  const root=$('[data-profile]');
  if(root)root.innerHTML='<div class="error">Não foi possível carregar as listas do Perfil. <button type="button" class="btn retry" data-ct493-profile-retry>Tentar novamente</button></div>';
  return false;
 }
 try{return ct493PaintProfile(summary,quick,stats,sports,activity)}
 catch(e){const root=$('[data-profile]');if(root)root.innerHTML=fail('Falha ao montar Perfil: '+(e?.message||e),'profile');return false}
}
/* CT_R493_CORE_END */