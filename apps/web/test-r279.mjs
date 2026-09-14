import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r279-official.mjs');
const dist=resolve('dist');
const [js,css,release,runtime]=await Promise.all([
 readFile(resolve(dist,'app-v279.js'),'utf8'),readFile(resolve(dist,'app-v279.css'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve('runtime-r279-explicit-watched-buttons.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R279_STATIC missing '+x)};
for(const x of[
 "window.__ctR279='explicit-watched-buttons+canonical-r6-refresh'",
 "window.__ctR279Watch='real-button+episode+movie+finite-reconcile'",
 "window.__ctR279Tabs='r278-fixed-home-tabs-preserved'",
 'function ct279ExplicitWatchAction(kind,tmdb,s=0,e=0,title=',
 'class="ct266-watch-action ct279-watch-button"',
 '<span class="ct279-watch-label">Marcar</span>',
 'function ct279Row(x,opts={})',
 'function ct279ReconcileWatchButtons(root=document)',
 "head!=='assistir a seguir'&&head!=='juntando poeira'",
 "[data-home-view=\"movies\"] .home-section",
 'async function ct279MarkWatched(action)',
 "rpc('cinetracker_mark_watch_v0994'",
 "ct275ReloadHome('r279-watch')",
 'ct266WatchAction=ct279ExplicitWatchAction;',
 'ct274EpisodeWatchAction=ct279EpisodeWatchAction;',
 'ct274MovieWatchAction=ct279MovieWatchAction;',
 'ct274Row=ct279Row;',
 'ct266MarkWatched=ct279MarkWatched;',
 'ct275PaintHome=ct279PaintHome;',
 "window.__ctR278='effective-tmdb-watch-action+fixed-home-tabs'"
])must(js,x);
for(const x of[
 '[data-home] .ct274-media-card.ct279-watch-host>.ct279-watch-button{position:static!important',
 'min-width:82px!important',
 'visibility:visible!important;opacity:1!important',
 '[data-home] .home-tabs{position:fixed!important;top:0!important;left:136px!important;right:0!important',
 '@media(max-width:700px){[data-home]{padding-top:56px!important}[data-home] .home-tabs{position:fixed!important'
])must(css,x);
if((runtime.match(/new MutationObserver/g)||[]).length)throw new Error('R279_STATIC persistent observer introduced');
const meta=JSON.parse(release);if(meta.version!=='1.0.70'||meta.revision!=='r279-official-1.0.70'||meta.home_watch_action_control!=='button'||meta.home_watch_action_label!=='Marcar'||meta.home_watch_action_episode!==true||meta.home_watch_action_movie!==true||meta.home_watch_action_reconcile!=='finite'||meta.home_watch_action_refresh!=='canonical-r6'||meta.home_tabs_fixed!==true||meta.home_tabs_mode!=='fixed-top'||meta.android!=='1.0.20/10062')throw new Error('R279_STATIC release flags');
console.log('R279_STATIC_OK explicit episode+movie buttons finite reconcile fixed-home-tabs');
