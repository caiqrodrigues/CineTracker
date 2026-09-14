import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r281-official.mjs');
const dist=resolve('dist');
const [js,css,release,runtime]=await Promise.all([
 readFile(resolve(dist,'app-v281.js'),'utf8'),
 readFile(resolve(dist,'app-v281.css'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve('runtime-r281-watch-click-isolation.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R281_STATIC missing '+x)};
for(const x of[
 "window.__ctR281='watch-click-isolation+single-owner-refresh'",
 "window.__ctR281Watch='window-capture+no-card-navigation+no-data-changed-broadcast'",
 "window.__ctR281Layout='inline-check+stable-home-producer'",
 'function ct281CaptureWatchClick(e)',
 "e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void ct281MarkWatched(action)",
 'async function ct281MarkWatched(action)',
 "if(typeof ct275ReloadHome==='function')await ct275ReloadHome('r281-watch');",
 "window.addEventListener('click',ct281CaptureWatchClick,true);",
 'ct279ReconcileWatchButtons=ct281ReconcileWatchButtons;',
 'ct279ScheduleReconcile=ct281ScheduleReconcile;',
 'ct279MarkWatched=ct281MarkWatched;'
])must(js,x);
if(runtime.includes("dispatchEvent(new CustomEvent('cinetracker:data-changed'"))throw new Error('R281_STATIC data-changed broadcast reintroduced');
if((runtime.match(/new MutationObserver/g)||[]).length)throw new Error('R281_STATIC persistent observer introduced');
for(const x of[
 '[data-home] .media-row.ct279-watch-host',
 'display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important',
 'width:40px!important;min-width:40px!important;max-width:40px!important',
 'height:40px!important;min-height:40px!important;max-height:40px!important',
 'margin:0 0 0 auto!important'
])must(css,x);
const meta=JSON.parse(release);if(meta.version!=='1.0.72'||meta.revision!=='r281-official-1.0.72'||meta.home_watch_click_owner!=='window-capture-r281'||meta.home_watch_card_navigation_blocked!==true||meta.home_watch_refresh!=='canonical-r6-single-owner'||meta.home_watch_data_changed_broadcast!==false||meta.home_watch_reconcile!=='finite-idempotent-r281'||meta.home_watch_layout!=='inline-right-all-producers'||meta.home_watch_stability!=='single-producer'||meta.android!=='1.0.20/10062')throw new Error('R281_STATIC release flags');
console.log('R281_STATIC_OK click isolation single refresh no broadcast inline layout');
