/* r186 shared — strict Pra Voce authority + live cross-device invalidation */
window.__ctR186='foryou-strict-quality-year-history-realtime';
window.__ct186Quality='tmdb-gte-7.5-release-year-gt-1990';
window.__ct186Genres='block-pure-drama-18-and-any-documentary-99';
window.__ct186History='watch_history-canonical-via-dashboard';
window.__ct186Watchlist='only-watchlist-block-can-consume-watchlist';
window.__ct186Unique='seven-slots-no-duplicate-media';
window.__ct186Daily='one-movie-stable-per-user-local-day-until-midnight';
window.__ct186Fallback='reserve-popular-unseen-equivalent-keeps-seven-slots-filled';
window.__ct186Realtime='watch_history+media_overrides-postgres-changes';
window.__ct186Dynamic='optimistic-local-replacement-plus-realtime-refresh';

const CT186_MIN_SCORE=7.5;
const CT186_MIN_YEAR=1991;
const CT186_CONTEXT_TTL=15000;
let ct186ContextValue=null,ct186ContextAt=0,ct186ContextTask=null;
let ct186ForYouData=null,ct186ForYouTask=null;
let ct186RefreshTask=null;
const ct186LocalBlocked=new Set();

function ct186Type(x){return mediaType(x)}
function ct186Id(x){return Number(x?.id||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0)}
function ct186Key(x){const id=ct186Id(x);return id>0?ct186Type(x)+':'+id:''}
function ct186Year(x){return Number(String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0)}
function ct186Score(x){return Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0}
function ct186GenresOf(x){try{return [...new Set((genreIds158(x)||[]).map(Number).filter(n=>n>0))]}catch{return[]}}
function ct186BadGenre(x){const g=ct186GenresOf(x);return g.includes(99)||(g.length>0&&g.every(id=>id===18))}
function ct186Quality(x){return Boolean(x&&ct186Id(x)>0&&mediaPoster(x)&&ct186Score(x)>=CT186_MIN_SCORE&&ct186Year(x)>=CT186_MIN_YEAR&&!ct186BadGenre(x))}
function ct186Anime(x){try{return isAnime158(x)}catch{return false}}
function ct186AliasValues(x){const r=x?.raw_tmdb||{};return[x?.title,x?.name,x?.original_title,x?.original_name,r?.title,r?.name,r?.original_title,r?.original_name].map(norm).filter(Boolean)}
function ct186AddAliases(set,t,x){for(const n of ct186AliasValues(x))set.add(t+':'+n)}
function ct186HasAlias(set,x){const t=ct186Type(x);return ct186AliasValues(x).some(n=>set.has(t+':'+n))}
function ct186DashHistory(x){return Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||Number(x?.watched_episodes||0)>0||x?.last_watched_at)}
function ct186DashWatchlist(x){return Boolean(x?.is_watchlist)}

async function ct186Context(force=false){
  if(!force&&ct186ContextValue&&Date.now()-ct186ContextAt<CT186_CONTEXT_TTL)return ct186ContextValue;
  if(ct186ContextTask)return ct186ContextTask;
  ct186ContextTask=(async()=>{
    const dash=await rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]);
    const historyMovieIds=new Set(),historyTvIds=new Set(),watchMovieIds=new Set(),watchTvIds=new Set(),historyAliases=new Set(),watchAliases=new Set();
    for(const x of dash||[]){
      const t=ct186Type(x),id=Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);
      if(ct186DashHistory(x)){if(id)(t==='movie'?historyMovieIds:historyTvIds).add(id);ct186AddAliases(historyAliases,t,x)}
      if(ct186DashWatchlist(x)){if(id)(t==='movie'?watchMovieIds:watchTvIds).add(id);ct186AddAliases(watchAliases,t,x)}
    }
    ct186ContextValue={dash:dash||[],historyMovieIds,historyTvIds,watchMovieIds,watchTvIds,historyAliases,watchAliases};ct186ContextAt=Date.now();
    return ct186ContextValue;
  })().finally(()=>{ct186ContextTask=null});
  return ct186ContextTask;
}
function ct186InHistory(x,c){const id=ct186Id(x),t=ct186Type(x);return Boolean((id&&(t==='movie'?c.historyMovieIds:c.historyTvIds).has(id))||ct186HasAlias(c.historyAliases,x))}
function ct186InWatchlist(x,c){const id=ct186Id(x),t=ct186Type(x);return Boolean((id&&(t==='movie'?c.watchMovieIds:c.watchTvIds).has(id))||ct186HasAlias(c.watchAliases,x))}
function ct186FreshEligible(x,c){return ct186Quality(x)&&!ct186InHistory(x,c)&&!ct186InWatchlist(x,c)&&!ct186LocalBlocked.has(ct186Key(x))}
function ct186WatchEligible(x,c){return ct186Quality(x)&&ct186InWatchlist(x,c)&&!ct186InHistory(x,c)&&!ct186LocalBlocked.has(ct186Key(x))}
function ct186UniqueRows(rows){const seen=new Set(),out=[];for(const x of rows||[]){const k=ct186Key(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function ct186MergeRows(a,b){return ct186UniqueRows([...(a||[]),...(b||[])])}
function ct186FavoriteGenres(dash){try{return ct166FavoriteGenres(dash)}catch{return[]}}

async function ct186FreshPools(c){
  const genres=ct186FavoriteGenres(c.dash),wg=genres.length?genres.join('|'):undefined;
  const common={'vote_average.gte':CT186_MIN_SCORE,'without_genres':'99',include_adult:false};
  const [m,t,a]=await Promise.all([
    pages('/discover/movie',{...common,'primary_release_date.gte':'1991-01-01','vote_count.gte':120,with_genres:wg,sort_by:'vote_average.desc'},'movie',6),
    pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':100,with_genres:wg,sort_by:'vote_average.desc'},'tv',6),
    pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':60,with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc'},'tv',6)
  ]);
  const clean=rows=>ct186UniqueRows(rows).filter(x=>ct186FreshEligible(x,c));
  return{movie:clean(m).filter(x=>!ct186Anime(x)),series:clean(t).filter(x=>!ct186Anime(x)),anime:clean(a).filter(x=>ct186Anime(x))};
}
function ct186WatchPools(c){
  const rows=ct186UniqueRows((c.dash||[]).filter(ct186DashWatchlist).map(x=>{try{const d=dashboardCard162(x);return d?{...d,_ct_watchlist:true}:null}catch{return null}}).filter(Boolean)).filter(x=>ct186WatchEligible(x,c)).sort((a,b)=>Number(b?.vote_average||0)-Number(a?.vote_average||0)||Number(b?.popularity||0)-Number(a?.popularity||0));
  return{movie:rows.filter(x=>ct186Type(x)==='movie'),series:rows.filter(x=>ct186Type(x)==='tv'&&!ct186Anime(x)),anime:rows.filter(x=>ct186Type(x)==='tv'&&ct186Anime(x))};
}
async function ct186PopularPool(kind,c){
  const common={'vote_average.gte':CT186_MIN_SCORE,'without_genres':'99',include_adult:false,sort_by:'popularity.desc'};
  let rows=[];
  if(kind==='movie')rows=await pages('/discover/movie',{...common,'primary_release_date.gte':'1991-01-01','vote_count.gte':120},'movie',6);
  else if(kind==='series')rows=await pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':100},'tv',6);
  else rows=await pages('/discover/tv',{...common,'first_air_date.gte':'1991-01-01','vote_count.gte':60,with_origin_country:'JP',with_genres:'16'},'tv',6);
  return ct186UniqueRows(rows).filter(x=>ct186FreshEligible(x,c)).filter(x=>kind==='movie'?ct186Type(x)==='movie':kind==='anime'?ct186Type(x)==='tv'&&ct186Anime(x):ct186Type(x)==='tv'&&!ct186Anime(x));
}
function ct186Hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function ct186DailyStorage(){return 'ct:r186:daily:'+String(user?.id||session?.user?.id||'anon')+':'+localDay()}
function ct186DailyPick(pool,used){
  const usable=(pool||[]).filter(x=>!used.has(ct186Key(x))&&!ct186LocalBlocked.has(ct186Key(x)));if(!usable.length)return null;
  let saved='';try{saved=localStorage.getItem(ct186DailyStorage())||''}catch{}
  let pick=usable.find(x=>ct186Key(x)===saved)||null;
  if(!pick){const seed=localDay()+':'+String(user?.id||session?.user?.id||'anon');pick=usable[ct186Hash(seed)%usable.length]||usable[0];try{localStorage.setItem(ct186DailyStorage(),ct186Key(pick))}catch{}}
  return pick;
}
function ct186Pick(pool,key,used){
  const usable=(pool||[]).filter(x=>!used.has(ct186Key(x))&&!ct186LocalBlocked.has(ct186Key(x)));if(!usable.length)return null;
  const idx=typeof ct166SwapIndex!=='undefined'?Math.max(0,Number(ct166SwapIndex[key]||0)):0;return usable[idx%usable.length]||usable[0]||null;
}
function ct186PoolFor(primary,fallback,used){return (primary||[]).some(x=>!used.has(ct186Key(x))&&!ct186LocalBlocked.has(ct186Key(x)))?primary:fallback}
function ct186Select(data){
  const f=data?._ct186_fresh||{movie:[],series:[],anime:[]},w=data?._ct186_watchlist||{movie:[],series:[],anime:[]},fb=data?._ct186_fallback||{movie:[],series:[],anime:[]},used=new Set();
  const take=(x)=>{if(x)used.add(ct186Key(x));return x};
  const daily=take(ct186DailyPick(f.movie,used));
  const wmPool=ct186PoolFor(w.movie,fb.movie,used),wm=take(ct186Pick(wmPool,'watchlist:movie',used));
  const wsPool=ct186PoolFor(w.series,fb.series,used),ws=take(ct186Pick(wsPool,'watchlist:series',used));
  const waPool=ct186PoolFor(w.anime,fb.anime,used),wa=take(ct186Pick(waPool,'watchlist:anime',used));
  const fm=take(ct186Pick(f.movie,'fresh:movie',used)),fs=take(ct186Pick(f.series,'fresh:series',used)),fa=take(ct186Pick(f.anime,'fresh:anime',used));
  return{daily,wm,ws,wa,fm,fs,fa,wmPool,wsPool,waPool,used};
}
async function ct186LoadForYou(force=false){
  if(!force&&ct186ForYouTask)return ct186ForYouTask;
  const cacheKey='r186:foryou:'+localDay();if(!force&&discoverCache.has(cacheKey)){const v=discoverCache.get(cacheKey);if(v&&typeof v.then!=='function')return v}
  ct186ForYouTask=(async()=>{
    const c=await ct186Context(force),fresh=await ct186FreshPools(c),watch=ct186WatchPools(c),fallback={movie:[],series:[],anime:[]},reserve={movie:[],series:[],anime:[]};
    const need={movie:fresh.movie.length<3||!watch.movie.length,series:fresh.series.length<2||!watch.series.length,anime:fresh.anime.length<2||!watch.anime.length};
    await Promise.all(['movie','series','anime'].filter(k=>need[k]).map(k=>ct186PopularPool(k,c).then(v=>{reserve[k]=v})));
    for(const k of ['movie','series','anime']){
      if(reserve[k].length)fresh[k]=ct186MergeRows(fresh[k],reserve[k]);
      if(!watch[k].length)fallback[k]=reserve[k];
    }
    const data={_ct186_fresh:fresh,_ct186_watchlist:watch,_ct186_fallback:fallback,_ct186_reserve:reserve,_ct166_fresh:fresh,_ct166_watchlist:watch};const s=ct186Select(data);
    Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa});
    ct186ForYouData=data;discoverCache.set(cacheKey,data);try{ct163Write('discover:foryou:all',data)}catch{}return data;
  })().finally(()=>{ct186ForYouTask=null});
  discoverCache.set(cacheKey,ct186ForYouTask);try{return await ct186ForYouTask}catch(e){discoverCache.delete(cacheKey);throw e}
}

const ct186DiscoverRowsBase=discoverRows;
discoverRows=async function(tab){if(String(tab)!=='foryou')return ct186DiscoverRowsBase(tab);return ct186LoadForYou(false)};
function ct186Slot(label,x,key,count){try{return ct166Slot(label,x,key,count)}catch{return '<div class="foryou-slot"><small>'+esc(label)+'</small>'+(x?discoverCard158(x):'<div class="empty compact">Sem item elegível</div>')+'</div>'}}
function ct186RenderForYou(data){
  ct186ForYouData=data||ct186ForYouData||{};const s=ct186Select(ct186ForYouData),f=ct186ForYouData?._ct186_fresh||{};
  const dailyHtml=s.daily?'<div class="foryou-grid ct166-daily-grid">'+ct186Slot('Filme',s.daily,'daily:movie',1)+'</div>':'<div class="empty">Nenhuma indicação elegível agora.</div>';
  const watchHtml='<div class="foryou-grid watchlist-picks-r162">'+ct186Slot('Filme',s.wm,'watchlist:movie',s.wmPool?.length||1)+ct186Slot('Série',s.ws,'watchlist:series',s.wsPool?.length||1)+ct186Slot('Anime',s.wa,'watchlist:anime',s.waPool?.length||1)+'</div>';
  const freshHtml='<div class="foryou-grid">'+ct186Slot('Filme',s.fm,'fresh:movie',f.movie?.length||1)+ct186Slot('Série',s.fs,'fresh:series',f.series?.length||1)+ct186Slot('Anime',s.fa,'fresh:anime',f.anime?.length||1)+'</div>';
  return '<section class="panel discover-section"><div class="panel-head"><h2>Indicação do dia</h2><small>fora da Watchlist, histórico e progresso</small></div>'+dailyHtml+'</section><section class="panel discover-section"><div class="panel-head"><h2>Da sua Watchlist</h2><small>somente não assistidos · Filme · Série · Anime</small></div>'+watchHtml+'</section><section class="panel discover-section"><div class="panel-head"><h2>100% novos</h2><small>fora da Watchlist, histórico e progresso</small></div>'+freshHtml+'</section>';
}
ct166RenderForYou=ct186RenderForYou;renderForYou158=ct186RenderForYou;

function ct186PaintCurrent(){if(route()==='discover'&&discoverState?.tab==='foryou'&&ct186ForYouData){try{paintDiscover(ct186ForYouData)}catch{}}}
function ct186Block(type,id){id=Number(id||0);if(!(id>0))return;ct186LocalBlocked.add((type==='movie'?'movie':'tv')+':'+id);ct186PaintCurrent()}
function ct186Unblock(type,id){ct186LocalBlocked.delete((type==='movie'?'movie':'tv')+':'+Number(id||0));ct186PaintCurrent()}
function ct186Invalidate(){
  ct186ContextValue=null;ct186ContextAt=0;ct186ContextTask=null;ct186ForYouTask=null;discoverCache.clear();
  try{ct168ResetExclusions()}catch{};try{if(typeof ct185CDiscoverHot!=='undefined')ct185CDiscoverHot.clear()}catch{};
}
async function ct186RefreshVisible(){
  if(route()!=='discover'||discoverState?.tab!=='foryou')return null;if(ct186RefreshTask)return ct186RefreshTask;
  ct186RefreshTask=(async()=>{ct186Invalidate();const data=await ct186LoadForYou(true);if(route()==='discover'&&discoverState?.tab==='foryou')paintDiscover(data);return data})().catch(()=>null).finally(()=>{ct186RefreshTask=null});return ct186RefreshTask;
}

const ct186AddWatchlistBase=addWatchlist;
addWatchlist=async function(type,id){ct186Block(type,id);try{const out=await ct186AddWatchlistBase(type,id);try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r186-watchlist',media_type:type,tmdb_id:Number(id)}}))}catch{};return out}catch(e){ct186Unblock(type,id);throw e}};
const ct186MarkSeenBase=markSeen;
markSeen=async function(type,id){ct186Block(type,id);try{const out=await ct186MarkSeenBase(type,id);try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r186-seen',media_type:type,tmdb_id:Number(id)}}))}catch{};return out}catch(e){ct186Unblock(type,id);throw e}};
window.addEventListener('cinetracker:data-changed',()=>{ct186Invalidate();if(route()==='discover'&&discoverState?.tab==='foryou')void ct186RefreshVisible()});

/* Native Supabase Realtime protocol: watch_history + media_overrides are already in supabase_realtime. */
let ct186Socket=null,ct186Heartbeat=null,ct186Reconnect=null,ct186RealtimeToken='',ct186Ref=0;
function ct186Send(topic,event,payload,joinRef=null){if(!ct186Socket||ct186Socket.readyState!==WebSocket.OPEN)return;const ref=String(++ct186Ref);ct186Socket.send(JSON.stringify({topic,event,payload,ref,join_ref:joinRef}));return ref}
function ct186DecodeRealtime(raw){try{const m=JSON.parse(raw);if(Array.isArray(m))return{join_ref:m[0],ref:m[1],topic:m[2],event:m[3],payload:m[4]};return m}catch{return null}}
async function ct186ResolveMediaKey(mediaId){
  mediaId=Number(mediaId||0);if(!(mediaId>0))return'';const row=ct186ContextValue?.dash?.find(x=>Number(x?.media_id||0)===mediaId);if(row&&Number(row?.tmdb_id||0)>0)return (row.media_type==='movie'?'movie':'tv')+':'+Number(row.tmdb_id);
  const r=await api('media?select=tmdb_id,media_type&id=eq.'+mediaId+'&limit=1').catch(()=>[]),x=r?.[0];return Number(x?.tmdb_id||0)>0?(x.media_type==='movie'?'movie':'tv')+':'+Number(x.tmdb_id):'';
}
function ct186RealtimeRelevant(table,data){
  if(table==='watch_history')return true;if(table!=='media_overrides')return false;const rec=data?.record||{},old=data?.old_record||{},state=String(rec.state||old.state||'');return !state||['AddedToWatchlist','WatchLater','AlreadySeen','Completed','InProgress','UpToDate'].includes(state);
}
function ct186RealtimeChange(table,data){
  if(!ct186RealtimeRelevant(table,data))return;const rec=data?.record||{},old=data?.old_record||{},mediaId=Number(rec.media_id||old.media_id||0),kind=String(data?.type||'');
  if(mediaId>0&&kind!=='DELETE')void ct186ResolveMediaKey(mediaId).then(k=>{if(k){ct186LocalBlocked.add(k);ct186PaintCurrent()}});
  ct186Invalidate();clearTimeout(ct186RealtimeChange._t);ct186RealtimeChange._t=setTimeout(()=>void ct186RefreshVisible(),120);
}
function ct186RealtimeStart(){
  if(!session?.access_token||!(user?.id||session?.user?.id)||typeof WebSocket==='undefined')return;const token=session.access_token;if(ct186Socket&&ct186RealtimeToken===token&&[WebSocket.OPEN,WebSocket.CONNECTING].includes(ct186Socket.readyState))return;
  try{ct186Socket?.close()}catch{};clearInterval(ct186Heartbeat);clearTimeout(ct186Reconnect);ct186RealtimeToken=token;
  const uid=String(user?.id||session?.user?.id),wsUrl=SUPABASE_URL.replace(/^http/,'ws')+'/realtime/v1/websocket?apikey='+encodeURIComponent(SUPABASE_KEY)+'&vsn=1.0.0';
  const ws=ct186Socket=new WebSocket(wsUrl),topic='realtime:ct-r186-'+uid;
  ws.onopen=()=>{ct186Send(topic,'phx_join',{config:{broadcast:{self:false},presence:{key:''},postgres_changes:[{event:'*',schema:'public',table:'watch_history',filter:'profile_id=eq.'+uid},{event:'*',schema:'public',table:'media_overrides',filter:'profile_id=eq.'+uid}]},access_token:token});ct186Heartbeat=setInterval(()=>ct186Send('phoenix','heartbeat',{}),25000)};
  ws.onmessage=e=>{const m=ct186DecodeRealtime(e.data);if(!m||m.event!=='postgres_changes')return;const d=m.payload?.data||m.payload||{},table=String(d.table||'');ct186RealtimeChange(table,d)};
  ws.onclose=()=>{clearInterval(ct186Heartbeat);if(session)ct186Reconnect=setTimeout(ct186RealtimeStart,1800)};ws.onerror=()=>{try{ws.close()}catch{}};
}
const ct186BootBase=boot;
boot=async function(){const out=await ct186BootBase();ct186RealtimeStart();return out};
window.addEventListener('pageshow',()=>{if(session)ct186RealtimeStart()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&session)ct186RealtimeStart()});
window.addEventListener('beforeunload',()=>{try{ct186Socket?.close()}catch{}});
