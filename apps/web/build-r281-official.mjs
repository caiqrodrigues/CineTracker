import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r281.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v281.js','app-v281.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r281 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.72';window.__ctOfficialVersion='1.0.72';",
 "const REVISION='r281-official-1.0.72';",
 "window.__ctR280='minimal-watch-check+green-active'",
 "window.__ctR281='watch-click-isolation+single-owner-refresh'",
 "window.__ctR281Watch='window-capture+no-card-navigation+no-data-changed-broadcast'",
 "window.__ctR281Layout='inline-check+stable-home-producer'",
 'function ct281CaptureWatchClick(e)',
 'async function ct281MarkWatched(action)',
 "window.addEventListener('click',ct281CaptureWatchClick,true);",
 'ct279MarkWatched=ct281MarkWatched;',
 'ct279ScheduleReconcile=ct281ScheduleReconcile;'
])must(js,x);
for(const x of[
 '[data-home] .media-row.ct279-watch-host',
 'display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important',
 'width:40px!important;min-width:40px!important;max-width:40px!important',
 'margin:0 0 0 auto!important'
])must(css,x);
must(html,'app-v281.js');must(html,'app-v281.css');if(/app-v280\.(?:js|css)/.test(html))throw new Error('r281 html references r280 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.72'||meta.revision!=='r281-official-1.0.72'||meta.home_watch_click_owner!=='window-capture-r281'||meta.home_watch_card_navigation_blocked!==true||meta.home_watch_refresh!=='canonical-r6-single-owner'||meta.home_watch_data_changed_broadcast!==false||meta.home_watch_layout!=='inline-right-all-producers'||meta.home_watch_stability!=='single-producer')throw new Error('r281 release identity');
if(meta.android!=='1.0.20/10062')throw new Error('r281 Android changed');
must(sw,"const CACHE='ct-web-1.0.72-r281';");must(sw,'app-v281.js');must(sw,'app-v281.css');
console.log('WEB_1_0_72_OFFICIAL_OK r281 isolated watched click stable Home');
