import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r271-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v271.js'),'utf8'),
  readFile(resolve(dist,'app-v271.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const replaceOnce=(source,from,to,label)=>{
  const i=source.indexOf(from);if(i<0)throw new Error('r272 missing '+label);
  if(source.indexOf(from,i+from.length)>=0)throw new Error('r272 ambiguous '+label);
  return source.slice(0,i)+to+source.slice(i+from.length);
};
const must=(source,needle,label=needle)=>{if(!source.includes(needle))throw new Error('r272 missing '+label)};

js=replaceOnce(js,"window.__ctWebBuild='1.0.62';window.__ctOfficialVersion='1.0.62';","window.__ctWebBuild='1.0.63';window.__ctOfficialVersion='1.0.63';",'web version');
js=replaceOnce(js,"const REVISION='r271-official-1.0.62';","const REVISION='r272-official-1.0.63';",'revision');

/* Canonical producer fix: History is part of paintHome itself and is always the first section.
   Fast cache may provide series/watchlist immediately, but it is never allowed to claim an empty
   History. Canonical r5 repaints the same producer once its real watch_history arrays arrive. */
const paintStart=js.indexOf('function paintHome(){'),paintEnd=js.indexOf('function profileRows(',paintStart);
if(paintStart<0||paintEnd<0||paintEnd<=paintStart)throw new Error('r272 cannot locate canonical paintHome producer');
const paint272=String.raw`function ct272HistoryReady(p,histE,histM){return p?.__ctHistoryAuthoritative===true||(!p?.__ctFastHomeCache&&window.__ctHomeHistoryPending!==true&&(histE.length>0||histM.length>0))}
function ct272HistoryStack(rows,kind,ready){
 if(!ready)return '<div class="empty" data-ct272-history-loading>Carregando histórico…</div>';
 if(kind==='episode')return rows.slice(0,30).map(x=>mediaRow({...x,media_type:'tv',tmdb_id:x.tmdb_id},'S'+String(x.season_number||0).padStart(2,'0')+' E'+String(x.episode_number||0).padStart(2,'0'))).join('')||'<div class="empty">Nenhum episódio recente.</div>';
 return rows.slice(0,100).map(x=>mediaRow({...x,media_type:'movie'},x.watched_at?new Date(x.watched_at).toLocaleString('pt-BR'):'Visto')).join('')||'<div class="empty">Nenhum filme recente.</div>';
}
function paintHome(){
 const h=$('[data-home]');if(!h)return;
 const p=homeCache||{},series=Array.isArray(p.series)?p.series:[],watch=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],histM=Array.isArray(p.history_movies)?p.history_movies:[],histE=Array.isArray(p.history_episodes)?p.history_episodes:[],historyReady=ct272HistoryReady(p,histE,histM);
 const buckets=[['Assistir a seguir',series.filter(x=>x.home_bucket==='continue')],['Juntando poeira',series.filter(x=>x.home_bucket==='dust')],['Em dia',series.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',series.filter(x=>x.home_bucket==='not_started')],['Concluídas',series.filter(x=>x.home_bucket==='completed')]];
 const historyEpisodes='<section class="home-section" data-ct272-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><small>'+(historyReady?histE.length:'…')+'</small></div><div class="stack">'+ct272HistoryStack(histE,'episode',historyReady)+'</div></section>';
 const seriesSections=buckets.map(([title,rows])=>'<section class="home-section"><div class="panel-head"><h3>'+title+'</h3><small>'+rows.length+'</small></div><div class="stack">'+(rows.length?rows.slice(0,100).map(x=>mediaRow(x,String(Number(x.watched_episodes||0))+'/'+String(Math.max(Number(x.total_episodes||0),Number(x.released_episodes||0))||'?')+' · '+(Math.max(0,Number(x.released_episodes||0)-Number(x.watched_episodes||0))?'Faltam '+Math.max(0,Number(x.released_episodes||0)-Number(x.watched_episodes||0)):'Em dia'))).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>').join('');
 const historyMovies='<section class="home-section" data-ct272-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><small>'+(historyReady?histM.length:'…')+'</small></div><div class="stack">'+ct272HistoryStack(histM,'movie',historyReady)+'</div></section>';
 const movieWatch='<section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><small>'+watch.length+'</small></div><div class="stack">'+(watch.slice(0,240).map(x=>mediaRow({...x,media_type:'movie'},[x.release_year,x.runtime_minutes?String(x.runtime_minutes)+' min':null].filter(Boolean).join(' · '))).join('')||'<div class="empty">Nenhum filme na Watchlist.</div>')+'</div></section>';
 h.innerHTML='<div class="home-tabs"><button class="chip active" data-home-tab="series">Séries</button><button class="chip" data-home-tab="movies">Filmes</button></div><div data-home-view="series" class="home-list">'+historyEpisodes+seriesSections+'</div><div data-home-view="movies" class="home-list hidden">'+historyMovies+movieWatch+'</div>';
 h.dataset.ct272Producer='canonical-history-first';
}
`;
js=js.slice(0,paintStart)+paint272+js.slice(paintEnd);

/* Mark-watched must refresh through the same r5 authority. r3 can never overwrite Home again. */
const markR3="homeCache=await rpc('cinetracker_home_live_v0997_r3',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)});";
must(js,markR3,'ct266 mark-watched r3 refresh');
js=replaceOnce(js,markR3,"homeCache=await rpc('cinetracker_profile_home_payload_v0997_r5',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)});if(homeCache&&typeof homeCache==='object'){homeCache.__ctHistoryAuthoritative=true;homeCache.__ctFastHomeCache=false}window.__ctHomeHistoryPending=false;",'ct266 mark-watched refresh');

/* Retire the post-render repair layers that caused the current video regressions. r266 already
   inserts the watched glyph directly inside eligible rows; r272 keeps that producer behavior. */
const retire=[
 ["ct268Schedule();","/* r272: r268 one-shot Home repair retired */",'r268 activation'],
 ["if(ct269PaintHomeBase)paintHome=function(...args){const out=ct269PaintHomeBase.apply(this,args);ct269Schedule();return out};","/* r272: r269 paint wrapper retired */",'r269 paint wrapper'],
 ["if(ct269RenderHomeBase)renderHome=async function(...args){const out=await ct269RenderHomeBase.apply(this,args);if(String(typeof route==='function'?route():'')==='home'){ct269RepairSeriesWatch();void ct269LoadHistory(true)}return out};","/* r272: r269 render/history wrapper retired */",'r269 render wrapper'],
 ["document.addEventListener('click',e=>{if(e.target?.closest?.('[data-home-tab]'))setTimeout(()=>{ct269RepairHome();if(!ct269State.history)void ct269LoadHistory(false)},0)},true);","/* r272: r269 Home-tab repair listener retired */",'r269 tab listener'],
 ["if(ct270PaintHomeBase)paintHome=function(...args){const out=ct270PaintHomeBase.apply(this,args);ct270RepairHome();return out};","/* r272: r270 paint repair wrapper retired */",'r270 paint wrapper'],
 ["if(ct270RenderHomeBase)renderHome=async function(...args){const out=await ct270RenderHomeBase.apply(this,args);ct270RepairHome();return out};","/* r272: r270 render repair wrapper retired */",'r270 render wrapper'],
 ["document.addEventListener('click',e=>{if(e.target?.closest?.('[data-home-tab]'))setTimeout(ct270RepairHome,0)},true);","/* r272: r270 Home-tab repair listener retired */",'r270 tab listener'],
 ["window.addEventListener('hashchange',()=>setTimeout(ct270RepairHome,0),{passive:true});","/* r272: r270 hash repair listener retired */",'r270 hash listener'],
 ["for(const ms of [0,30,100,300])setTimeout(ct270RepairHome,ms);","/* r272: r270 delayed repair timers retired */",'r270 delayed repairs']
];
for(const [from,to,label] of retire)js=replaceOnce(js,from,to,label);

const runtime=String.raw`
/* CT272_HOME_CANONICAL_PRODUCER_START */
window.__ctR272='canonical-home-producer+r5-history+direct-watch';
window.__ctR272Home='history-first-in-paintHome+no-post-render-repair';
window.__ctR272Frozen='discover+detail+sports+android-r271-preserved';
window.__ctR272Test={historyReady:ct272HistoryReady,historyStack:ct272HistoryStack};
/* CT272_HOME_CANONICAL_PRODUCER_END */`;
js=replaceOnce(js,'\nboot();','\n'+runtime+'\nboot();','boot insertion');

css+='\n/* CineTracker Web 1.0.63 r272 — Home History is produced first; watched glyph remains direct child via r266. */\n[data-home] [data-ct272-history]{display:block!important}\n[data-home] [data-ct272-history][hidden]{display:block!important}\n';
html=html.replaceAll('app-v271.js','app-v272.js').replaceAll('app-v271.css','app-v272.css');
sw=sw.replaceAll('ct-web-1.0.62-r271','ct-web-1.0.63-r272').replaceAll('app-v271.js','app-v272.js').replaceAll('app-v271.css','app-v272.css');
const release={version:'1.0.63',revision:'r272-official-1.0.63',base:'r271-production',home_history_source:'cinetracker_profile_home_payload_v0997_r5',home_history_in_producer:true,home_history_first:true,home_fast_cache_never_empty_history:true,home_mark_watched_refresh:'r5',home_post_render_repair:false,home_series_watch_direct_child:true,discover:'r271-preserved',detail:'r271-preserved',sports:'r271-preserved',android:'1.0.20/10062',generated_at:new Date().toISOString()};
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v272.js'),js,'utf8'),writeFile(resolve(dist,'app-v272.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v271.js'),{force:true}),rm(resolve(dist,'app-v271.css'),{force:true})]);
console.log('WEB_R272_READY history=producer-first authority=r5 watch=direct-row post-repair=off');
