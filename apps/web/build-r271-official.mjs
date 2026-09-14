import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r271.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v271.js','app-v271.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r271 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.62';window.__ctOfficialVersion='1.0.62';",
 "const REVISION='r271-official-1.0.62';",
 "window.__ctR271='home-no-persistent-observer+history-idempotent'",
 "window.__ctR271Home='r270-layout-preserved+finite-reconciliation'",
 "window.__ctR271Frozen='discover+detail+sports+android-r270-preserved'",
 "window.__ctR270='real-r5-history+dom-order-watch-host'",
 "const p=await rpc('cinetracker_profile_home_payload_v0997_r5'",
 'function ct271HistorySig(hist)',
 "const ct270State={queued:false,historySig:''};",
 'persistent Home MutationObserver removed',
 'CT271_HOME_RESPONSIVENESS_START','CT271_HOME_RESPONSIVENESS_END',
 "window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions'",
 "window.__ctR267Detail='r169-rich-producer-local-x'",
 "window.__ctR267Sports='r266-stable-preserved'"
])must(js,x);
if(js.includes('new MutationObserver(ct270Schedule).observe(document.documentElement,{childList:true,subtree:true});'))throw new Error('r271 keeps r270 persistent observer');
if(js.includes("window.__ctR269='video-history-r3+series-watch-inline'"))throw new Error('r271 keeps obsolete r3 history');
must(css,'[data-home-view="series"] .media-row.ct270-watch-host>.ct270-inline-watch-action');
must(html,'app-v271.js');must(html,'app-v271.css');if(/app-v270\.(?:js|css)/.test(html))throw new Error('r271 html references r270 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.62'||meta.revision!=='r271-official-1.0.62')throw new Error('r271 release identity');
if(meta.home_persistent_observer!==false||meta.home_history_idempotent!==true||meta.home_history_restored!==true||meta.home_series_watch_inline_right!==true)throw new Error('r271 Home flags');
if(meta.discover!=='r270-preserved'||meta.detail!=='r270-preserved'||meta.sports!=='r270-preserved'||meta.android!=='1.0.20/10062')throw new Error('r271 frozen surfaces');
must(sw,"const CACHE='ct-web-1.0.62-r271';");must(sw,'app-v271.js');must(sw,'app-v271.css');
console.log('WEB_1_0_62_OFFICIAL_OK r271 responsive-home finite-reconciliation');
