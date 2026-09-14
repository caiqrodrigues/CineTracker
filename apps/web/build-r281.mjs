import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r280-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v280.js'),'utf8'),
 readFile(resolve(dist,'app-v280.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r281-watch-click-isolation.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r281 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r281 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r281 missing '+x)};
for(const x of[
 "window.__ctR281='watch-click-isolation+single-owner-refresh';",
 "window.__ctR281Watch='window-capture+no-card-navigation+no-data-changed-broadcast';",
 "window.__ctR281Layout='inline-check+stable-home-producer';",
 'function ct281CaptureWatchClick(e)',
 'async function ct281MarkWatched(action)',
 "window.addEventListener('click',ct281CaptureWatchClick,true);",
 'ct279MarkWatched=ct281MarkWatched;',
 'ct279ScheduleReconcile=ct281ScheduleReconcile;'
])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.71';window.__ctOfficialVersion='1.0.71';","window.__ctWebBuild='1.0.72';window.__ctOfficialVersion='1.0.72';",'version');
js=once(js,"const REVISION='r280-official-1.0.71';","const REVISION='r281-official-1.0.72';",'revision');
must(js,"window.__ctR280='minimal-watch-check+green-active'");
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.72 r281 — watched check cannot navigate the media card; stable inline layout on every Home producer. */
[data-home] .media-row.ct279-watch-host,[data-home] .media-row.ct281-watch-host,[data-home] .ct274-media-card.ct279-watch-host,[data-home] .ct274-media-card.ct281-watch-host{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;box-sizing:border-box!important;min-width:0!important;width:100%!important;overflow:hidden!important;padding-right:10px!important}
[data-home] .media-row.ct279-watch-host>.ct274-row-left,[data-home] .media-row.ct281-watch-host>.ct274-row-left,[data-home] .ct274-media-card.ct279-watch-host>.ct274-row-left,[data-home] .ct274-media-card.ct281-watch-host>.ct274-row-left{min-width:0!important;flex:1 1 auto!important}
[data-home] .media-row.ct279-watch-host>[data-ct279-watch],[data-home] .media-row.ct281-watch-host>[data-ct279-watch],[data-home] .ct274-media-card.ct279-watch-host>[data-ct279-watch],[data-home] .ct274-media-card.ct281-watch-host>[data-ct279-watch]{position:static!important;inset:auto!important;transform:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important;min-height:40px!important;max-height:40px!important;flex:0 0 40px!important;margin:0 0 0 auto!important;padding:0!important;align-self:center!important;white-space:nowrap!important}
[data-home] .media-row.ct279-watch-host.ct266-home-watch-host,[data-home] .media-row.ct281-watch-host.ct266-home-watch-host,[data-home] .ct274-media-card.ct279-watch-host.ct266-home-watch-host,[data-home] .ct274-media-card.ct281-watch-host.ct266-home-watch-host{padding-right:10px!important}
[data-home] .media-row.ct279-watch-host>[data-ct266-watch]:not([data-ct279-watch]),[data-home] .media-row.ct281-watch-host>[data-ct266-watch]:not([data-ct279-watch]){display:none!important}
@media(max-width:700px){[data-home] .media-row.ct279-watch-host,[data-home] .media-row.ct281-watch-host,[data-home] .ct274-media-card.ct279-watch-host,[data-home] .ct274-media-card.ct281-watch-host{padding-right:8px!important}[data-home] .media-row.ct279-watch-host>[data-ct279-watch],[data-home] .media-row.ct281-watch-host>[data-ct279-watch],[data-home] .ct274-media-card.ct279-watch-host>[data-ct279-watch],[data-home] .ct274-media-card.ct281-watch-host>[data-ct279-watch]{margin-left:auto!important}}
`;
html=html.replaceAll('app-v280.js','app-v281.js').replaceAll('app-v280.css','app-v281.css').replaceAll('CineTracker • v1.0.71','CineTracker • v1.0.72');
sw=sw.replaceAll('ct-web-1.0.71-r280','ct-web-1.0.72-r281').replaceAll('app-v280.js','app-v281.js').replaceAll('app-v280.css','app-v281.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.72',revision:'r281-official-1.0.72',base:'r280-production',home_watch_click_owner:'window-capture-r281',home_watch_card_navigation_blocked:true,home_watch_refresh:'canonical-r6-single-owner',home_watch_data_changed_broadcast:false,home_watch_reconcile:'finite-idempotent-r281',home_watch_layout:'inline-right-all-producers',home_watch_stability:'single-producer',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v281.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v281.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v280.js'),{force:true}),rm(resolve(dist,'app-v280.css'),{force:true})]);
console.log('WEB_R281_READY watch-click=isolated navigation=blocked refresh=single-owner layout=inline');
