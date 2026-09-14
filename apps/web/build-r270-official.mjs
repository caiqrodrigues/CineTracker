import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r270.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v270.js','app-v270.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r270 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.61';window.__ctOfficialVersion='1.0.61';",
 "const REVISION='r270-official-1.0.61';",
 "window.__ctR270='real-r5-history+dom-order-watch-host'",
 "window.__ctR270Home='r5-watch-history+direct-child-right-check'",
 "window.__ctR270Frozen='discover+detail+sports+android-r269-preserved'",
 "window.__ctR269='video-history-r5+series-watch-inline'",
 "window.__ctR269Home='canonical-r5-history+orphan-watch-reparent'",
 "const p=await rpc('cinetracker_profile_home_payload_v0997_r5'",
 'function ct270ShowHistoryShell()',
 'function ct270AdoptCanonicalHistory(pack=window.homeCache)',
 'function ct270RowForAction(action,view)',
 'function ct270HardenWatch(row,action)',
 "const props={position:'absolute',right:'10px'",
 "ct270SetImportant(action,k,v)",
 'CT270_HOME_REAL_DOM_START','CT270_HOME_REAL_DOM_END',
 "window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions'",
 "window.__ctR267Detail='r169-rich-producer-local-x'",
 "window.__ctR267Sports='r266-stable-preserved'"
])must(js,x);
if(js.includes("window.__ctR269='video-history-r3+series-watch-inline'"))throw new Error('r270 keeps obsolete r269 r3 marker');
if(js.includes("window.__ctR269Home='canonical-r3-history+orphan-watch-reparent'"))throw new Error('r270 keeps obsolete r269 r3 Home marker');
must(css,'[data-home-view="series"] .media-row.ct270-watch-host>.ct270-inline-watch-action{position:absolute!important;right:10px!important');
if(/ct270AfterF1Paint/.test(js))throw new Error('r270 contains forbidden Sports callback');
must(html,'app-v270.js');must(html,'app-v270.css');if(/app-v269\.(?:js|css)/.test(html))throw new Error('r270 html references r269 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.61'||meta.revision!=='r270-official-1.0.61')throw new Error('r270 release identity');
if(meta.home_history_source!=='cinetracker_profile_home_payload_v0997_r5'||meta.home_history_restored!==true||meta.home_history_first!==true||meta.home_series_watch_direct_child!==true||meta.home_series_watch_inline_right!==true)throw new Error('r270 release Home flags');
if(meta.discover!=='r269-preserved'||meta.detail!=='r269-preserved'||meta.sports!=='r269-preserved'||meta.android!=='1.0.20/10062')throw new Error('r270 frozen surfaces');
must(sw,"const CACHE='ct-web-1.0.61-r270';");must(sw,'app-v270.js');must(sw,'app-v270.css');
console.log('WEB_1_0_61_OFFICIAL_OK r270 real-r5-history real-dom-watch-direct-child');
