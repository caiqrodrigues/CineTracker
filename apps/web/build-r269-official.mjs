import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r269.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v269.js','app-v269.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r269 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.60';window.__ctOfficialVersion='1.0.60';",
 "const REVISION='r269-official-1.0.60';",
 "window.__ctR269='video-history-r3+series-watch-inline'",
 "window.__ctR269Home='canonical-r3-history+orphan-watch-reparent'",
 "window.__ctR269Frozen='discover+detail+sports+android-r268-preserved'",
 'CT269_HOME_RECOVERY_START','CT269_HOME_RECOVERY_END','cinetracker_home_live_v0997_r3','function ct269RepairSeriesWatch','function ct269PaintHistory',
 "window.__ctR268='home-history-authority+history-first+inline-right-watch'",
 "window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions'",
 "window.__ctR267Detail='r169-rich-producer-local-x'",
 "window.__ctR267Sports='r266-stable-preserved'"
])must(js,x);
for(const x of[
 '[data-home-view="series"] .media-row.ct269-inline-watch-host{position:relative!important;padding-right:52px!important',
 '>.ct269-inline-watch-action{position:absolute!important;right:12px!important'
])must(css,x);
if(/ct26[5-9]AfterF1Paint/.test(js))throw new Error('r269 contains forbidden Sports callback');
must(html,'app-v269.js');must(html,'app-v269.css');if(/app-v268\.(?:js|css)/.test(html))throw new Error('r269 html references r268 assets');
must(release,'"version": "1.0.60"');must(release,'"revision": "r269-official-1.0.60"');must(release,'"home_history_restored": true');must(release,'"home_series_watch_inline": true');must(release,'"android": "1.0.20/10062"');
must(sw,"const CACHE='ct-web-1.0.60-r269';");must(sw,'app-v269.js');must(sw,'app-v269.css');
console.log('WEB_1_0_60_OFFICIAL_OK r269 history-r3-restored series-watch-inline-right');
