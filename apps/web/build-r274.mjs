import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r273-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v273.js'),'utf8'),
  readFile(resolve(dist,'app-v273.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const replaceOnce=(source,from,to,label)=>{
  const i=source.indexOf(from);if(i<0)throw new Error('r274 missing '+label);
  if(source.indexOf(from,i+from.length)>=0)throw new Error('r274 ambiguous '+label);
  return source.slice(0,i)+to+source.slice(i+from.length);
};
const must=(source,needle,label=needle)=>{if(!source.includes(needle))throw new Error('r274 missing '+label)};

js=replaceOnce(js,"window.__ctWebBuild='1.0.64';window.__ctOfficialVersion='1.0.64';","window.__ctWebBuild='1.0.65';window.__ctOfficialVersion='1.0.65';",'web version');
js=replaceOnce(js,"const REVISION='r273-official-1.0.64';","const REVISION='r274-official-1.0.65';",'revision');
must(js,"window.__ctR273='home-r5-direct+history-undo+strict-flex-row'",'r273 baseline');
must(js,'function ct273UndoButton(x,kind)','r273 undo helper');
must(js,'async function tmdb(path,params={})','tmdb proxy helper');

const runtime=String.raw`
/* CT274_HOME_TIMEOUT_METADATA_START */
window.__ctR274='home-r6-fast+ascending-history+rich-meta+rewatch';
window.__ctR274Home='r6-limit20+series120+movies120';
window.__ctR274History='oldest-top+newest-bottom+auto-bottom';
window.__ctR274Frozen='discover+detail+sports+android-r273-preserved';
let ct274CanonicalHome=null,ct274Busy=false;
const ct274MetaCache=new Map();
function ct274NormalizeHomePayload(data){
 const p=data&&typeof data==='object'&&!Array.isArray(data)?data:null;
 if(!p)throw new Error('Payload da Home inválido');
 for(const k of ['series','movie_watchlist','history_episodes','history_movies'])if(!Array.isArray(p[k]))throw new Error('Payload da Home sem '+k);
 p.__ctHistoryAuthoritative=true;p.__ctFastHomeCache=false;window.__ctHomeHistoryPending=false;ct274CanonicalHome=p;return p;
}
async function ct274FetchHome(){return ct274NormalizeHomePayload(await rpc('cinetracker_profile_home_payload_v0997_r6',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10),p_history_limit:20,p_series_limit:120,p_movie_limit:120}))}
function ct274Payload(){if(homeCache&&homeCache.__ctHistoryAuthoritative===true){ct274CanonicalHome=homeCache;return homeCache}return ct274CanonicalHome||homeCache||{}}
function ct274Date(v){if(!v)return'—';const s=String(v);const m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return m[3]+'/'+m[2]+'/'+m[1];try{return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v))}catch{return'—'}}
function ct274Rating(v){const n=Number(v);return Number.isFinite(n)&&n>0?n.toFixed(1):'—'}
function ct274Genres(v){let a=v;if(typeof a==='string'){try{a=JSON.parse(a)}catch{a=a.split(',')}}if(!Array.isArray(a))return'Gênero não informado';const out=a.map(x=>typeof x==='string'?x:x?.name).filter(Boolean).slice(0,3);return out.join(', ')||'Gênero não informado'}
function ct274EpisodeMeta(x){const s=Number(x?.season_number??x?.next_season_number??0),e=Number(x?.episode_number??x?.next_episode_number??0),name=x?.episode_title||x?.cached_episode_title||x?.next_episode_title||('Episódio '+(e||'—')),rating=x?.episode_rating??x?.next_episode_rating,date=x?.episode_air_date||x?.next_episode_air_date||x?.watched_at;return 'S'+String(s||0).padStart(2,'0')+'E'+String(e||0).padStart(2,'0')+' • Ep: '+name+' • ⭐ '+ct274Rating(rating)+' • '+ct274Date(date)}
function ct274MovieMeta(x){const year=Number(x?.release_year)||String(x?.release_date||'').slice(0,4)||'—',runtime=Number(x?.runtime_minutes||x?.runtime||0),genres=ct274Genres(x?.genres),rating=x?.vote_average??x?.rating;return year+' • '+(runtime>0?runtime+' min':'Duração não informada')+' • '+genres+' • ⭐ '+ct274Rating(rating)}
function ct274AvailableText(x){const raw=x?.available_episodes??x?.history_missing_episodes??(Number(x?.released_episodes||0)-Number(x?.watched_episodes||0));const n=Math.max(0,Number(raw||0));return n===1?'1 episódio disponível para ver':n+' episódios disponíveis para ver'}
function ct274AscHistory(rows){return (Array.isArray(rows)?rows:[]).slice().sort((a,b)=>{const da=Date.parse(a?.watched_at||0)||0,db=Date.parse(b?.watched_at||0)||0;return da-db||Number(a?.id||0)-Number(b?.id||0)})}
function ct274Row(x,{meta='',sub='',action='',attrs=''}={}){
 const type=typeof mediaType==='function'?mediaType(x):(x?.media_type==='movie'?'movie':'tv'),id=typeof mediaTmdb==='function'?mediaTmdb(x):Number(x?.tmdb_id||0),p=typeof mediaPoster==='function'?mediaPoster(x):(x?.poster_path||null),title=typeof mediaTitle==='function'?mediaTitle(x):(x?.media_title||x?.title||'Sem título');
 const poster=p?" style=\"background-image:url('"+img(p,'w154')+"')\"":'';
 return '<div class="media-row ct274-media-card" data-media="'+type+':'+id+'" '+attrs+'><div class="ct274-row-left"><div class="thumb"'+poster+'></div><div class="ct274-row-copy"><b>'+esc(title)+'</b><small class="ct274-meta">'+esc(meta)+'</small>'+(sub?'<small class="ct274-sub">'+esc(sub)+'</small>':'')+'</div></div><span class="badge" aria-hidden="true">›</span>'+action+'</div>';
}
function ct274HistoryActions(x,kind){const mid=Number(x?.media_id||0),s=Number(x?.season_number||0),e=Number(x?.episode_number||0);if(!(mid>0))return'';const plays=Math.max(1,Number(x?.plays||1));return '<div class="ct274-history-actions"><button type="button" class="ct274-rewatch" data-ct274-rewatch="'+kind+'" data-media-id="'+mid+'"'+(s?' data-season="'+s+'"':'')+(e?' data-episode="'+e+'"':'')+' data-plays="'+plays+'" aria-label="Reassistir" title="Reassistir / registrar nova visualização">↻</button>'+ct273UndoButton(x,kind)+'</div>'}
function ct274EpisodeAttrs(x,context){const tmdb=Number(x?.tmdb_id||0),s=Number(x?.season_number??x?.next_season_number??0),e=Number(x?.episode_number??x?.next_episode_number??0);return 'data-ct274-episode-card="1" data-ct274-context="'+context+'" data-ct274-tmdb="'+tmdb+'" data-ct274-season="'+s+'" data-ct274-episode="'+e+'" data-ct274-fallback-title="'+esc(x?.episode_title||x?.cached_episode_title||x?.next_episode_title||'')+'" data-ct274-fallback-rating="'+esc(x?.episode_rating??x?.next_episode_rating??'')+'" data-ct274-fallback-date="'+esc(x?.episode_air_date||x?.next_episode_air_date||x?.watched_at||'')+'"';}
function ct274MovieAttrs(x){return 'data-ct274-movie-card="1" data-ct274-tmdb="'+Number(x?.tmdb_id||0)+'" data-ct274-year="'+esc(x?.release_year||'')+'" data-ct274-runtime="'+esc(x?.runtime_minutes||'')+'" data-ct274-rating="'+esc(x?.vote_average??'')+'"';}
function ct274HistoryRows(rows,kind,payload){
 if(kind==='episode')return ct274AscHistory(rows).map(x=>{const series=(payload?.series||[]).find(s=>Number(s.media_id||0)===Number(x.media_id||0)||Number(s.tmdb_id||0)===Number(x.tmdb_id||0));const sub=[ct274AvailableText(series||{}),'Assistido '+Math.max(1,Number(x.plays||1))+'x'].join(' • ');return ct274Row({...x,media_type:'tv',tmdb_id:x.tmdb_id},{meta:ct274EpisodeMeta(x),sub,action:ct274HistoryActions(x,'episode'),attrs:ct274EpisodeAttrs(x,'history')})}).join('');
 return ct274AscHistory(rows).map(x=>ct274Row({...x,media_type:'movie'},{meta:ct274MovieMeta(x),sub:'Assistido '+Math.max(1,Number(x.plays||1))+'x',action:ct274HistoryActions(x,'movie'),attrs:ct274MovieAttrs(x)})).join('');
}
function ct274EpisodeWatchAction(x){const tmdb=Number(x?.tmdb_id||0),s=Number(x?.next_season_number||0),e=Number(x?.next_episode_number||0);return tmdb>0&&s>0&&e>0&&typeof ct266WatchAction==='function'?ct266WatchAction('episode',tmdb,s,e,x?.next_episode_title||x?.title||''):''}
function ct274MovieWatchAction(x){const tmdb=Number(x?.tmdb_id||0);return tmdb>0&&typeof ct266WatchAction==='function'?ct266WatchAction('movie',tmdb,0,0,x?.title||x?.media_title||''):''}
function ct274SeriesSection(title,rows){return '<section class="home-section"><div class="panel-head"><h3>'+title+'</h3><small>'+rows.length+'</small></div><div class="stack">'+(rows.length?rows.slice(0,120).map(x=>{if(x.home_bucket==='continue'){const y={...x,season_number:x.next_season_number,episode_number:x.next_episode_number,episode_title:x.next_episode_title,episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};return ct274Row(y,{meta:ct274EpisodeMeta(y),sub:ct274AvailableText(x),action:ct274EpisodeWatchAction(x),attrs:ct274EpisodeAttrs(y,'continue')})}return ct274Row(x,{meta:String(Number(x.watched_episodes||0))+'/'+String(Math.max(Number(x.total_episodes||0),Number(x.released_episodes||0))||'?'),sub:ct274AvailableText(x)})}).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>'}
function ct274PaintHome(){
 const h=document.querySelector('[data-home]');if(!h)return;const p=ct274Payload(),authoritative=p?.__ctHistoryAuthoritative===true;
 const series=Array.isArray(p.series)?p.series:[],watch=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],histE=authoritative&&Array.isArray(p.history_episodes)?p.history_episodes:[],histM=authoritative&&Array.isArray(p.history_movies)?p.history_movies:[];
 const buckets=[['Assistir a seguir',series.filter(x=>x.home_bucket==='continue')],['Juntando poeira',series.filter(x=>x.home_bucket==='dust')],['Em dia',series.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',series.filter(x=>x.home_bucket==='not_started')],['Concluídas',series.filter(x=>x.home_bucket==='completed')]];
 const historyEpisodes='<section class="home-section ct274-history" data-ct274-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><small>'+(authoritative?histE.length:'…')+'</small></div><div class="stack ct274-history-stack">'+(authoritative?(ct274HistoryRows(histE,'episode',p)||'<div class="empty">Nenhum episódio no histórico.</div>'):'<div class="empty" data-ct274-history-loading>Carregando histórico…</div>')+'</div></section>';
 const historyMovies='<section class="home-section ct274-history" data-ct274-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><small>'+(authoritative?histM.length:'…')+'</small></div><div class="stack ct274-history-stack">'+(authoritative?(ct274HistoryRows(histM,'movie',p)||'<div class="empty">Nenhum filme no histórico.</div>'):'<div class="empty" data-ct274-history-loading>Carregando histórico…</div>')+'</div></section>';
 const movieWatch='<section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><small>'+watch.length+'</small></div><div class="stack">'+(watch.slice(0,120).map(x=>ct274Row({...x,media_type:'movie'},{meta:ct274MovieMeta(x),action:ct274MovieWatchAction(x),attrs:ct274MovieAttrs(x)})).join('')||'<div class="empty">Nenhum filme na Watchlist.</div>')+'</div></section>';
 const keep=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'series';
 h.innerHTML='<div class="home-tabs"><button class="chip active" data-home-tab="series">Séries</button><button class="chip" data-home-tab="movies">Filmes</button></div><div data-home-view="series" class="home-list">'+historyEpisodes+buckets.map(([title,rows])=>ct274SeriesSection(title,rows)).join('')+'</div><div data-home-view="movies" class="home-list hidden">'+historyMovies+movieWatch+'</div>';
 h.dataset.ct274Producer='r6-limited-rich-history';
 if(typeof ct266ApplyHomeTab==='function'){try{ct266HomeTab=keep==='movies'?'movies':'series'}catch{}ct266ApplyHomeTab(keep)}
 ct274AutoBottom();void ct274HydrateHome();
}
function ct274AutoBottom(){document.querySelectorAll('[data-ct274-history] .ct274-history-stack').forEach(s=>{s.scrollTop=s.scrollHeight})}
async function ct274SeasonData(tmdbId,season){const k='tv:'+tmdbId+':s'+season;if(ct274MetaCache.has(k))return ct274MetaCache.get(k);const p=tmdb('/tv/'+tmdbId+'/season/'+season).catch(()=>null);ct274MetaCache.set(k,p);return p}
async function ct274MovieData(tmdbId){const k='movie:'+tmdbId;if(ct274MetaCache.has(k))return ct274MetaCache.get(k);const p=tmdb('/movie/'+tmdbId).catch(()=>null);ct274MetaCache.set(k,p);return p}
async function ct274MapLimit(items,limit,fn){let i=0;const worker=async()=>{while(i<items.length){const n=i++;try{await fn(items[n])}catch{}}};await Promise.all(Array.from({length:Math.min(limit,items.length)},worker))}
async function ct274HydrateEpisodeCard(el){if(!el?.isConnected)return;const t=Number(el.dataset.ct274Tmdb||0),s=Number(el.dataset.ct274Season||0),e=Number(el.dataset.ct274Episode||0);if(!(t>0&&s>0&&e>0))return;const d=await ct274SeasonData(t,s),ep=Array.isArray(d?.episodes)?d.episodes.find(x=>Number(x?.episode_number||0)===e):null;if(!ep||!el.isConnected)return;const meta=el.querySelector('.ct274-meta');if(meta)meta.textContent=ct274EpisodeMeta({season_number:s,episode_number:e,episode_title:ep.name||el.dataset.ct274FallbackTitle,episode_rating:ep.vote_average??el.dataset.ct274FallbackRating,episode_air_date:ep.air_date||el.dataset.ct274FallbackDate})}
async function ct274HydrateMovieCard(el){if(!el?.isConnected)return;const t=Number(el.dataset.ct274Tmdb||0);if(!(t>0))return;const needs=!(Number(el.dataset.ct274Runtime||0)>0)||!(Number(el.dataset.ct274Rating||0)>0)||el.querySelector('.ct274-meta')?.textContent?.includes('Gênero não informado');if(!needs)return;const d=await ct274MovieData(t);if(!d||!el.isConnected)return;const meta=el.querySelector('.ct274-meta');if(meta)meta.textContent=ct274MovieMeta({release_year:el.dataset.ct274Year||String(d.release_date||'').slice(0,4),release_date:d.release_date,runtime_minutes:Number(el.dataset.ct274Runtime||0)||d.runtime,genres:d.genres,vote_average:Number(el.dataset.ct274Rating||0)||d.vote_average})}
async function ct274HydrateHome(){const eps=[...document.querySelectorAll('[data-home] [data-ct274-episode-card]')].slice(0,40),movies=[...document.querySelectorAll('[data-home] [data-ct274-movie-card]')].slice(0,40);await Promise.all([ct274MapLimit(eps,4,ct274HydrateEpisodeCard),ct274MapLimit(movies,4,ct274HydrateMovieCard)]);ct274AutoBottom()}
async function ct274RenderHome(seq){
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home>'+loading('Sincronizando Home...')+'</div>'));
 window.__ctHomeHistoryPending=true;
 try{const data=await ct274FetchHome();if(seq!==navSeq||route()!=='home')return;homeCache=data;ct274PaintHome()}catch(e){if(seq!==navSeq)return;const h=document.querySelector('[data-home]');if(h)h.innerHTML=fail('Falha ao sincronizar Home: '+(e?.message||e),'home')}
}
async function ct274ReloadHome(source='r274'){const keep=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'series';window.__ctHomeHistoryPending=true;const data=await ct274FetchHome();homeCache=data;if(route()==='home'){ct274PaintHome();if(typeof ct266ApplyHomeTab==='function')ct266ApplyHomeTab(keep)}try{profileCache=null;discoverCache?.clear?.()}catch{};return data}
async function ct274Rewatch(btn){if(!btn||ct274Busy)return;const kind=btn.dataset.ct274Rewatch,mediaId=Number(btn.dataset.mediaId||0),s=Number(btn.dataset.season||0),e=Number(btn.dataset.episode||0);if(!(mediaId>0)||!['episode','movie'].includes(kind))return;ct274Busy=true;btn.disabled=true;btn.setAttribute('aria-busy','true');try{await rpc('cinetracker_rewatch_history_v1',{p_media_id:mediaId,p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?e:null,p_title:null,p_watched_at:new Date().toISOString()});await ct274ReloadHome('history-rewatch');try{toast('Nova visualização registrada')}catch{}}catch(err){btn.disabled=false;btn.removeAttribute('aria-busy');try{toast(err?.message||String(err))}catch{}}finally{ct274Busy=false}}
paintHome=ct274PaintHome;renderHome=ct274RenderHome;
try{ct273ReloadHome=ct274ReloadHome}catch{}
if(typeof ct174RefreshHome==='function')ct174RefreshHome=async function(source='r274-refresh'){try{const p=await ct274ReloadHome(source);try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,at:Date.now()}}))}catch{}return p}catch{return null}};
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct274-rewatch]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();void ct274Rewatch(b)},true);
document.addEventListener('keydown',e=>{const b=e.target?.closest?.('[data-ct274-rewatch]');if(!b||(e.key!=='Enter'&&e.key!==' '))return;e.preventDefault();e.stopImmediatePropagation();void ct274Rewatch(b)},true);
window.__ctR274Test={normalize:ct274NormalizeHomePayload,fetchHome:ct274FetchHome,payload:ct274Payload,paintHome:ct274PaintHome,reloadHome:ct274ReloadHome,rewatch:ct274Rewatch,episodeMeta:ct274EpisodeMeta,movieMeta:ct274MovieMeta,ascHistory:ct274AscHistory,autoBottom:ct274AutoBottom,hydrate:ct274HydrateHome};
/* CT274_HOME_TIMEOUT_METADATA_END */`;
js=replaceOnce(js,'\nboot();','\n'+runtime+'\nboot();','r274 runtime insertion');

css+=String.raw`
/* CineTracker Web 1.0.65 r274 — fast bounded Home, rich metadata and history actions. */
[data-home] .ct274-media-card{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:space-between!important;width:100%!important;box-sizing:border-box!important;padding:12px!important;gap:12px!important;min-width:0!important;border:1px solid rgba(255,255,255,.10)!important;border-radius:16px!important;background:rgba(15,23,42,.60)!important;overflow:hidden!important}
[data-home] .ct274-media-card>.ct274-row-left{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;gap:12px!important;min-width:0!important;flex:1 1 auto!important;width:0!important}
[data-home] .ct274-media-card>.ct274-row-left>.thumb{width:48px!important;min-width:48px!important;max-width:48px!important;height:64px!important;min-height:64px!important;max-height:64px!important;flex:0 0 48px!important;border-radius:8px!important;background-size:cover!important;background-position:center!important}
[data-home] .ct274-row-copy{min-width:0!important;flex:1 1 auto!important;overflow:hidden!important}
[data-home] .ct274-row-copy>b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-home] .ct274-row-copy>.ct274-meta,[data-home] .ct274-row-copy>.ct274-sub{display:block!important;min-width:0!important;max-width:100%!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.35!important}
[data-home] .ct274-row-copy>.ct274-sub{margin-top:3px!important;color:var(--muted,#94a3b8)!important}
[data-home] .ct274-media-card>.badge{flex:0 0 auto!important;min-width:0!important}
[data-home] .ct274-media-card>[data-ct266-watch],[data-home] .ct274-media-card>.ct266-watch-action,[data-home] .ct274-history-actions>button{position:static!important;inset:auto!important;transform:none!important;margin:0!important;width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important;min-height:40px!important;max-height:40px!important;flex:0 0 40px!important;align-self:center!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;box-sizing:border-box!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.05)!important;color:#6ee7b7!important;line-height:1!important;z-index:2!important}
[data-home] .ct274-media-card>[data-ct266-watch],[data-home] .ct274-media-card>.ct266-watch-action{margin-left:auto!important}
[data-home] .ct274-history-actions{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;gap:6px!important;flex:0 0 auto!important;margin-left:auto!important}
[data-home] .ct274-history-actions>.ct273-history-undo{color:#cbd5e1!important}
[data-home] .ct274-history-actions>button:hover,[data-home] .ct274-media-card>[data-ct266-watch]:hover{background:rgba(16,185,129,.20)!important;border-color:rgba(16,185,129,.40)!important}
[data-home] [data-ct274-history]{display:block!important}
[data-home] .ct274-history-stack{max-height:min(55vh,520px)!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;scrollbar-gutter:stable!important;padding-right:3px!important}
@media(max-width:640px){[data-home] .ct274-media-card{gap:10px!important;padding:10px!important}[data-home] .ct274-media-card>.badge{display:none!important}[data-home] .ct274-history-actions{gap:4px!important}}
`;

html=html.replaceAll('app-v273.js','app-v274.js').replaceAll('app-v273.css','app-v274.css').replaceAll('CineTracker • v1.0.64','CineTracker • v1.0.65');
sw=sw.replaceAll('ct-web-1.0.64-r273','ct-web-1.0.65-r274').replaceAll('app-v273.js','app-v274.js').replaceAll('app-v273.css','app-v274.css');
const release={version:'1.0.65',revision:'r274-official-1.0.65',status:'official',base:'r273-production',home_payload_source:'cinetracker_profile_home_payload_v0997_r6',home_history_limit:20,home_series_limit:120,home_movie_limit:120,home_history_order:'oldest-top-newest-bottom',home_history_auto_bottom:true,home_episode_metadata:true,home_movie_metadata:true,home_rewatch:true,home_history_undo:true,home_card_layout:'flex-row-nowrap',home_watch_action_px:40,discover:'r273-preserved',detail:'r273-preserved',sports:'r273-preserved',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v274.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v274.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2)+'\n','utf8')
]);
await Promise.all([rm(resolve(dist,'app-v273.js'),{force:true}),rm(resolve(dist,'app-v273.css'),{force:true})]);
console.log('WEB_R274_READY home=r6-fast history=ascending-rich rewatch=true');
