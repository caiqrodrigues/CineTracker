import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r279.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v279.js','app-v279.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r279 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.70';window.__ctOfficialVersion='1.0.70';",
 "const REVISION='r279-official-1.0.70';",
 "window.__ctR278='effective-tmdb-watch-action+fixed-home-tabs'",
 "window.__ctR279='explicit-watched-buttons+canonical-r6-refresh'",
 "window.__ctR279Watch='real-button+episode+movie+finite-reconcile'",
 "window.__ctR279Tabs='r278-fixed-home-tabs-preserved'",
 'function ct279ExplicitWatchAction(kind,tmdb,s=0,e=0,title=',
 'function ct279ReconcileWatchButtons(root=document)',
 'async function ct279MarkWatched(action)',
 'ct266WatchAction=ct279ExplicitWatchAction;',
 'ct274EpisodeWatchAction=ct279EpisodeWatchAction;',
 'ct274MovieWatchAction=ct279MovieWatchAction;',
 'ct274Row=ct279Row;',
 'ct266MarkWatched=ct279MarkWatched;',
 'ct275PaintHome=ct279PaintHome;',
 'paintHome=ct279PaintHome;'
])must(js,x);
for(const x of['[data-home] button.ct266-watch-action.ct279-watch-button[data-ct266-watch]{position:static!important','min-width:82px!important','[data-home] .home-tabs{position:fixed!important;top:0!important;left:136px!important;right:0!important','.sidebar{position:fixed!important;left:0!important;top:0!important'])must(css,x);
must(html,'app-v279.js');must(html,'app-v279.css');if(/app-v278\.(?:js|css)/.test(html))throw new Error('r279 html references r278 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.70'||meta.revision!=='r279-official-1.0.70'||meta.home_watch_action_control!=='button'||meta.home_watch_action_episode!==true||meta.home_watch_action_movie!==true||meta.home_watch_action_reconcile!=='finite'||meta.home_watch_action_refresh!=='canonical-r6'||meta.home_tabs_fixed!==true||meta.home_tabs_mode!=='fixed-top'||meta.sidebar_fixed!==true)throw new Error('r279 release identity');
if(meta.android!=='1.0.20/10062')throw new Error('r279 Android changed');
must(sw,"const CACHE='ct-web-1.0.70-r279';");must(sw,'app-v279.js');must(sw,'app-v279.css');
console.log('WEB_1_0_70_OFFICIAL_OK r279 explicit episode+movie watched buttons');
