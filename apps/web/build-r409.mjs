import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r408.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v408.js'),'utf8'),readFile(resolve(dist,'app-v408.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),Promise.all(['01','02','03','04c1','04c2','04c3','04c4','04c5','04c6','04c7','04c8'].map(i=>readFile(resolve(root,'runtime-r409-part'+i+'.txt'),'utf8'))).then(x=>x.join(''))
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r409 expected one '+label+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r409 forbidden '+bad);
for(const need of ['cinetracker_home_history_v324','cinetracker_mark_watch_v0994','cinetracker_discover_foryou_v396','cinetracker_discover_watch_unseen_v396','cinetracker_discover_fresh_v387','Promise.any','data-ct409-action','↻ Trocar'])if(!runtime.includes(need))throw new Error('r409 runtime missing '+need);

// The r281 capture listener fires before later listeners. Hand the existing click/key path to r409.
{const needle='void ct281MarkWatched(action)',hits=js.split(needle).length-1;if(hits!==2)throw new Error('r409 expected two r281 action calls, found '+hits);js=js.replaceAll(needle,"if(window.__ctR409?.markWatched)return void window.__ctR409.markWatched(action);void ct281MarkWatched(action)")}

// Expose the current r406 series snapshot for synchronous optimistic transitions, without changing its server authority.
js=once(js,
"window.__ctR406={version:'1.0.197',scope:'home-series-counts+movie-watchlist-paint+foryou-actions',loadSeries,renderSeries,loadMovies,renderMovies,enterHome,loadForYou,renderForYou,repairForYouActions,swap:swapForYou};",
"window.__ctR406={version:'1.0.197',scope:'home-series-counts+movie-watchlist-paint+foryou-actions',loadSeries,renderSeries,loadMovies,renderMovies,enterHome,loadForYou,renderForYou,repairForYouActions,swap:swapForYou,getSeries:()=>series,setSeries:(list,paint=true)=>{series=rows(list);if(paint&&routeNow()==='home'&&activeKind()==='series')renderSeries();return series}};",
'r406 series state bridge');
js=once(js,"document.documentElement.dataset.ct406Series=String(series.length);return true","document.documentElement.dataset.ct406Series=String(series.length);window.__ctR409?.onHomePaint?.('series');return true",'series paint callback');
js=once(js,"paint();document.documentElement.dataset.ct406Movies=String(items.length);return true","paint();document.documentElement.dataset.ct406Movies=String(items.length);window.__ctR409?.onHomePaint?.('movies');return true",'movie paint callback');

// r408 remains the compatibility bridge, but r409 owns alignment and Pra Voce from the first call onward.
js=once(js,"function alignHome(kind=activeHome(),fresh=true){if(fresh){alignRun++;userMoved=false;alignedRun=-1}","function alignHome(kind=activeHome(),fresh=true){if(window.__ctR409?.alignHome)return window.__ctR409.alignHome(kind,fresh);if(fresh){alignRun++;userMoved=false;alignedRun=-1}",'r408 align delegation');
js=once(js,"async function loadForYou(force=false){if(!authReady()||routeNow()!=='discover')return false;","async function loadForYou(force=false){if(window.__ctR409?.loadForYou)return window.__ctR409.loadForYou(force);if(!authReady()||routeNow()!=='discover')return false;",'r408 ForYou load delegation');
js=once(js,"function renderForYou(){if(!isForYou())return false;","function renderForYou(){if(window.__ctR409?.renderForYou)return window.__ctR409.renderForYou();if(!isForYou())return false;",'r408 ForYou render delegation');
js=once(js,"function swap(name){if(locks.has(name))return false;","function swap(name){if(window.__ctR409?.swap)return window.__ctR409.swap(name);if(locks.has(name))return false;",'r408 swap delegation');

js=once(js,"window.__ctWebBuild='1.0.199';window.__ctOfficialVersion='1.0.199';","window.__ctWebBuild='1.0.200';window.__ctOfficialVersion='1.0.200';",'version');
js=once(js,"const REVISION='r408-official-1.0.199';","const REVISION='r409-official-1.0.200';",'revision');
js=once(js,"const version='1.0.199',revision='r408-official-1.0.199';","const version='1.0.200',revision='r409-official-1.0.200';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');
html=html.replaceAll('app-v408.js','app-v409.js').replaceAll('app-v408.css','app-v409.css').replaceAll('v1.0.199','v1.0.200').replaceAll('r408-official-1.0.199','r409-official-1.0.200');
sw=sw.replaceAll('ct-web-1.0.199-r408','ct-web-1.0.200-r409').replaceAll('app-v408.js','app-v409.js').replaceAll('app-v408.css','app-v409.css');
css+='\n/* CineTracker Web 1.0.200 r409 */\n[data-home]{overflow-anchor:none!important}\n[data-ct409-foryou] .ct409-actions{width:100%!important;max-width:100%!important;margin-top:8px!important;overflow:visible!important}\n[data-ct409-foryou] .ct409-actions.three{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important}\n[data-ct409-foryou] .ct409-actions.two{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important}\n[data-ct409-foryou] .ct409-actions button{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;padding:7px 2px!important;font-size:10px!important;white-space:nowrap!important;overflow:visible!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.200',revision:'r409-official-1.0.200',base:'r408+r409-optimistic-owner',scope:'home-entry+home-episode-optimistic+discover-foryou',home_entry:'one-shot alignment occurs on actual r406 paint; no history-end restoration',home_episode:'instant local series/history transition, cached TMDB next metadata, server reconciliation after persistence',home_movies:'r408/r406 v405 paging preserved',home_series:'r406 server authority preserved with local optimistic bridge',discover_foryou:'primary v396 races six authoritative fallback pools; first valid payload wins',discover_actions:'daily/fresh Watchlist+Visto+Trocar; watch Visto+Trocar; r409 owns render/actions',freeze_guard:'bounded timers/network only; no observer/interval/unbounded loop/full reload',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v409.js'),js),writeFile(resolve(dist,'app-v409.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v408.js'),{force:true}),rm(resolve(dist,'app-v408.css'),{force:true})]);
const [bh,bs,bj]=await Promise.all([readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'app-v409.js'),'utf8')]);
if(!bh.includes('app-v409.js')||bh.includes('app-v408.js'))throw new Error('r409 html asset');
if(!bs.includes('ct-web-1.0.200-r409')||!bs.includes('app-v409.js'))throw new Error('r409 sw asset');
for(const need of ["window.__ctR409Marker='instant-episode-history-next+foryou-primary-fallback-complete-actions'","if(window.__ctR409?.markWatched)return void window.__ctR409.markWatched(action)","getSeries:()=>series","window.__ctR409?.onHomePaint?.('series')","if(window.__ctR409?.loadForYou)return window.__ctR409.loadForYou(force)","data-ct409-action"])if(!bj.includes(need))throw new Error('r409 assembled missing '+need);
console.log('WEB_R409_READY');
