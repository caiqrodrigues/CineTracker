import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r272-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v272.js'),'utf8'),
  readFile(resolve(dist,'app-v272.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const replaceOnce=(source,from,to,label)=>{
  const i=source.indexOf(from);if(i<0)throw new Error('r273 missing '+label);
  if(source.indexOf(from,i+from.length)>=0)throw new Error('r273 ambiguous '+label);
  return source.slice(0,i)+to+source.slice(i+from.length);
};
const must=(source,needle,label=needle)=>{if(!source.includes(needle))throw new Error('r273 missing '+label)};

js=replaceOnce(js,"window.__ctWebBuild='1.0.63';window.__ctOfficialVersion='1.0.63';","window.__ctWebBuild='1.0.64';window.__ctOfficialVersion='1.0.64';",'web version');
js=replaceOnce(js,"const REVISION='r272-official-1.0.63';","const REVISION='r273-official-1.0.64';",'revision');
must(js,"rpc('cinetracker_profile_home_payload_v0997_r5'",'r5 authority');
must(js,'function ct266AttachWatch(','direct watched helper');
must(js,'cinetracker_unmark_episode_v1','episode undo RPC');

const runtime=String.raw`
/* CT273_HOME_HISTORY_LAYOUT_START */
window.__ctR273='home-r5-direct+history-undo+strict-flex-row';
window.__ctR273Home='canonical-r5-state+history-first+no-false-empty';
window.__ctR273Layout='flex-row-nowrap+right-action-40';
window.__ctR273Frozen='discover+detail+sports+android-r272-preserved';
let ct273CanonicalHome=null,ct273HistoryBusy=false;
function ct273NormalizeHomePayload(data){
 const p=data&&typeof data==='object'&&!Array.isArray(data)?data:null;
 if(!p)throw new Error('Payload da Home inválido');
 for(const k of ['series','movie_watchlist','history_episodes','history_movies'])if(!Array.isArray(p[k]))throw new Error('Payload da Home sem '+k);
 p.__ctHistoryAuthoritative=true;p.__ctFastHomeCache=false;window.__ctHomeHistoryPending=false;ct273CanonicalHome=p;return p;
}
async function ct273FetchHome(){return ct273NormalizeHomePayload(await rpc('cinetracker_profile_home_payload_v0997_r5',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)}))}
function ct273Payload(){
 if(homeCache&&homeCache.__ctHistoryAuthoritative===true){ct273CanonicalHome=homeCache;return homeCache}
 return ct273CanonicalHome||homeCache||{};
}
function ct273Row(x,meta='',action=''){
 const type=typeof mediaType==='function'?mediaType(x):(x?.media_type==='movie'?'movie':'tv'),id=typeof mediaTmdb==='function'?mediaTmdb(x):Number(x?.tmdb_id||0),p=typeof mediaPoster==='function'?mediaPoster(x):(x?.poster_path||null),title=typeof mediaTitle==='function'?mediaTitle(x):(x?.media_title||x?.title||'Sem título');
 const poster=p?" style=\"background-image:url('"+img(p,'w154')+"')\"":'';
 return '<div class="media-row ct273-media-card" data-media="'+type+':'+id+'"><div class="ct273-row-left"><div class="thumb"'+poster+'></div><div class="ct273-row-copy"><b>'+esc(title)+'</b><small>'+esc(meta)+'</small></div></div><span class="badge" aria-hidden="true">›</span>'+action+'</div>';
}
function ct273UndoButton(x,kind){
 const mid=Number(x?.media_id||0),s=Number(x?.season_number||0),e=Number(x?.episode_number||0);if(!(mid>0))return'';
 return '<button type="button" class="ct273-history-undo" data-ct273-history-undo="'+kind+'" data-media-id="'+mid+'"'+(s?' data-season="'+s+'"':'')+(e?' data-episode="'+e+'"':'')+' aria-label="Desfazer marcação de visto" title="Desfazer marcação de visto">↶</button>';
}
function ct273HistoryRows(rows,kind){
 if(kind==='episode')return rows.slice(0,80).map(x=>ct273Row({...x,media_type:'tv',tmdb_id:x.tmdb_id},'S'+String(x.season_number||0).padStart(2,'0')+' E'+String(x.episode_number||0).padStart(2,'0')+(x.watched_at?' · '+new Date(x.watched_at).toLocaleString('pt-BR'):''),ct273UndoButton(x,'episode'))).join('');
 return rows.slice(0,80).map(x=>ct273Row({...x,media_type:'movie'},x.watched_at?new Date(x.watched_at).toLocaleString('pt-BR'):'Visto',ct273UndoButton(x,'movie'))).join('');
}
function ct273PaintHome(){
 const h=document.querySelector('[data-home]');if(!h)return;const p=ct273Payload(),authoritative=p?.__ctHistoryAuthoritative===true;
 const series=Array.isArray(p.series)?p.series:[],watch=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],histE=authoritative&&Array.isArray(p.history_episodes)?p.history_episodes:[],histM=authoritative&&Array.isArray(p.history_movies)?p.history_movies:[];
 const buckets=[['Assistir a seguir',series.filter(x=>x.home_bucket==='continue')],['Juntando poeira',series.filter(x=>x.home_bucket==='dust')],['Em dia',series.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',series.filter(x=>x.home_bucket==='not_started')],['Concluídas',series.filter(x=>x.home_bucket==='completed')]];
 const historyEpisodes='<section class="home-section ct273-history" data-ct273-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><small>'+(authoritative?histE.length:'…')+'</small></div><div class="stack">'+(authoritative?(ct273HistoryRows(histE,'episode')||'<div class="empty">Nenhum episódio no histórico.</div>'):'<div class="empty" data-ct273-history-loading>Carregando histórico…</div>')+'</div></section>';
 const seriesSections=buckets.map(([title,rows])=>'<section class="home-section"><div class="panel-head"><h3>'+title+'</h3><small>'+rows.length+'</small></div><div class="stack">'+(rows.length?rows.slice(0,100).map(x=>ct273Row(x,String(Number(x.watched_episodes||0))+'/'+String(Math.max(Number(x.total_episodes||0),Number(x.released_episodes||0))||'?')+' · '+(Math.max(0,Number(x.released_episodes||0)-Number(x.watched_episodes||0))?'Faltam '+Math.max(0,Number(x.released_episodes||0)-Number(x.watched_episodes||0)):'Em dia'))).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>').join('');
 const historyMovies='<section class="home-section ct273-history" data-ct273-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><small>'+(authoritative?histM.length:'…')+'</small></div><div class="stack">'+(authoritative?(ct273HistoryRows(histM,'movie')||'<div class="empty">Nenhum filme no histórico.</div>'):'<div class="empty" data-ct273-history-loading>Carregando histórico…</div>')+'</div></section>';
 const movieWatch='<section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><small>'+watch.length+'</small></div><div class="stack">'+(watch.slice(0,240).map(x=>ct273Row({...x,media_type:'movie'},[x.release_year,x.runtime_minutes?String(x.runtime_minutes)+' min':null].filter(Boolean).join(' · '))).join('')||'<div class="empty">Nenhum filme na Watchlist.</div>')+'</div></section>';
 const keep=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'series';
 h.innerHTML='<div class="home-tabs"><button class="chip active" data-home-tab="series">Séries</button><button class="chip" data-home-tab="movies">Filmes</button></div><div data-home-view="series" class="home-list">'+historyEpisodes+seriesSections+'</div><div data-home-view="movies" class="home-list hidden">'+historyMovies+movieWatch+'</div>';
 h.dataset.ct273Producer='r5-history-first';
 if(typeof ct266EnhanceHome==='function')ct266EnhanceHome();
 if(typeof ct266ApplyHomeTab==='function'){try{ct266HomeTab=keep==='movies'?'movies':'series'}catch{}ct266ApplyHomeTab(keep)}
}
async function ct273RenderHome(seq){
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home>'+loading('Sincronizando Home...')+'</div>'));
 window.__ctHomeHistoryPending=true;
 try{const data=await ct273FetchHome();if(seq!==navSeq||route()!=='home')return;homeCache=data;ct273PaintHome()}catch(e){if(seq!==navSeq)return;const h=document.querySelector('[data-home]');if(h)h.innerHTML=fail('Falha ao sincronizar Home: '+(e?.message||e),'home')}
}
async function ct273ReloadHome(source='r273'){
 const keep=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'series';window.__ctHomeHistoryPending=true;
 const data=await ct273FetchHome();homeCache=data;if(route()==='home'){ct273PaintHome();if(typeof ct266ApplyHomeTab==='function')ct266ApplyHomeTab(keep)}
 try{profileCache=null;discoverCache?.clear?.()}catch{};return data;
}
async function ct273UndoHistory(btn){
 if(!btn||ct273HistoryBusy)return;const kind=btn.dataset.ct273HistoryUndo,mediaId=Number(btn.dataset.mediaId||0),s=Number(btn.dataset.season||0),e=Number(btn.dataset.episode||0);if(!(mediaId>0)||!['episode','movie'].includes(kind))return;
 ct273HistoryBusy=true;btn.disabled=true;btn.setAttribute('aria-busy','true');
 try{
  if(kind==='episode'){if(!(s>0&&e>0))throw new Error('Episódio inválido');await rpc('cinetracker_unmark_episode_v1',{p_media_id:mediaId,p_season_number:s,p_episode_number:e,p_changed_at:new Date().toISOString()})}
  else await rpc('cinetracker_unmark_media_seen_v1',{p_media_id:mediaId,p_media_type:'movie',p_changed_at:new Date().toISOString()});
  await ct273ReloadHome('history-undo');try{toast('Marcação de visto desfeita')}catch{}
 }catch(err){btn.disabled=false;btn.removeAttribute('aria-busy');try{toast(err?.message||String(err))}catch{}}
 finally{ct273HistoryBusy=false}
}
if(typeof ct266WatchAction==='function')ct266WatchAction=function(kind,tmdb,s=0,e=0,title=''){return '<button type="button" class="ct266-watch-action" aria-label="Marcar como assistido" title="Marcar como assistido" data-ct266-watch="'+kind+'" data-tmdb="'+tmdb+'"'+(s?' data-season="'+s+'"':'')+(e?' data-episode="'+e+'"':'')+(title?' data-title="'+esc(title)+'"':'')+'>✓</button>'};
paintHome=ct273PaintHome;renderHome=ct273RenderHome;
if(typeof ct174RefreshHome==='function')ct174RefreshHome=async function(source='r273-refresh'){try{const p=await ct273ReloadHome(source);try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,at:Date.now()}}))}catch{}return p}catch{return null}};
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct273-history-undo]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();void ct273UndoHistory(b)},true);
document.addEventListener('keydown',e=>{const b=e.target?.closest?.('[data-ct273-history-undo]');if(!b||(e.key!=='Enter'&&e.key!==' '))return;e.preventDefault();e.stopImmediatePropagation();void ct273UndoHistory(b)},true);
window.__ctR273Test={normalize:ct273NormalizeHomePayload,fetchHome:ct273FetchHome,payload:ct273Payload,paintHome:ct273PaintHome,reloadHome:ct273ReloadHome,undoHistory:ct273UndoHistory,row:ct273Row,historyRows:ct273HistoryRows};
/* CT273_HOME_HISTORY_LAYOUT_END */`;
js=replaceOnce(js,'\nboot();','\n'+runtime+'\nboot();','r273 runtime insertion');

css+=String.raw`
/* CineTracker Web 1.0.64 r273 — strict horizontal Home cards + canonical history. */
[data-home] .ct273-media-card{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:space-between!important;width:100%!important;box-sizing:border-box!important;padding:12px!important;gap:16px!important;min-width:0!important;border:1px solid rgba(255,255,255,.10)!important;border-radius:16px!important;background:rgba(15,23,42,.60)!important;overflow:hidden!important}
[data-home] .ct273-media-card>.ct273-row-left{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;gap:12px!important;min-width:0!important;flex:1 1 auto!important;width:0!important}
[data-home] .ct273-media-card>.ct273-row-left>.thumb{width:48px!important;min-width:48px!important;max-width:48px!important;height:64px!important;min-height:64px!important;max-height:64px!important;flex:0 0 48px!important;border-radius:8px!important;background-size:cover!important;background-position:center!important}
[data-home] .ct273-media-card .ct273-row-copy{min-width:0!important;flex:1 1 auto!important;overflow:hidden!important}
[data-home] .ct273-media-card .ct273-row-copy>b,[data-home] .ct273-media-card .ct273-row-copy>small{display:block!important;min-width:0!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-home] .ct273-media-card>.badge{flex:0 0 auto!important;min-width:0!important}
[data-home] .ct273-media-card>[data-ct266-watch],[data-home] .ct273-media-card>.ct266-watch-action,[data-home] .ct273-media-card>.ct273-history-undo{position:static!important;inset:auto!important;right:auto!important;left:auto!important;top:auto!important;bottom:auto!important;transform:none!important;margin:0 0 0 auto!important;width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important;min-height:40px!important;max-height:40px!important;flex:0 0 40px!important;align-self:center!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;box-sizing:border-box!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.05)!important;color:#6ee7b7!important;line-height:1!important;z-index:2!important}
[data-home] .ct273-media-card>.ct273-history-undo{color:#cbd5e1!important;cursor:pointer!important}
[data-home] .ct273-media-card>[data-ct266-watch]:hover,[data-home] .ct273-media-card>.ct273-history-undo:hover{background:rgba(16,185,129,.20)!important;border-color:rgba(16,185,129,.40)!important}
[data-home] [data-ct273-history]{display:block!important}
@media(max-width:640px){[data-home] .ct273-media-card{gap:12px!important;padding:12px!important}[data-home] .ct273-media-card>.badge{display:none!important}}
`;
html=html.replaceAll('app-v272.js','app-v273.js').replaceAll('app-v272.css','app-v273.css');
sw=sw.replaceAll('ct-web-1.0.63-r272','ct-web-1.0.64-r273').replaceAll('app-v272.js','app-v273.js').replaceAll('app-v272.css','app-v273.css');
const release={version:'1.0.64',revision:'r273-official-1.0.64',base:'r272-production',home_history_source:'cinetracker_profile_home_payload_v0997_r5',home_history_direct_fetch:true,home_history_payload_validated:true,home_history_first:true,home_history_undo:true,home_false_empty_prevented:true,home_card_layout:'flex-row-nowrap',home_watch_action_px:40,home_post_render_repair:false,discover:'r272-preserved',detail:'r272-preserved',sports:'r272-preserved',android:'1.0.20/10062',generated_at:new Date().toISOString()};
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v273.js'),js,'utf8'),writeFile(resolve(dist,'app-v273.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v272.js'),{force:true}),rm(resolve(dist,'app-v272.css'),{force:true})]);
console.log('WEB_R273_READY history=r5-direct undo=true cards=flex-row-nowrap action=40px');
