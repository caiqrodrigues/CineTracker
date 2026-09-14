import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r272.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v272.js','app-v272.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r272 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.63';window.__ctOfficialVersion='1.0.63';",
 "const REVISION='r272-official-1.0.63';",
 "window.__ctR272='canonical-home-producer+r5-history+direct-watch'",
 "window.__ctR272Home='history-first-in-paintHome+no-post-render-repair'",
 "window.__ctR272Frozen='discover+detail+sports+android-r271-preserved'",
 'function ct272HistoryReady(p,histE,histM)',
 'function ct272HistoryStack(rows,kind,ready)',
 'data-ct272-history="episodes"',
 'data-ct272-history="movies"',
 "homeCache=await rpc('cinetracker_profile_home_payload_v0997_r5'",
 'r272: r269 paint wrapper retired',
 'r272: r270 paint repair wrapper retired',
 "window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions'",
 "window.__ctR267Detail='r169-rich-producer-local-x'",
 "window.__ctR267Sports='r266-stable-preserved'"
])must(js,x);
if(js.includes("homeCache=await rpc('cinetracker_home_live_v0997_r3'"))throw new Error('r272 still refreshes Home from r3 after watched action');
if(js.includes("if(ct269PaintHomeBase)paintHome=function"))throw new Error('r272 keeps r269 paint wrapper active');
if(js.includes("if(ct270PaintHomeBase)paintHome=function"))throw new Error('r272 keeps r270 paint wrapper active');
if(js.includes("if(ct269RenderHomeBase)renderHome=async function"))throw new Error('r272 keeps r269 render wrapper active');
if(js.includes("if(ct270RenderHomeBase)renderHome=async function"))throw new Error('r272 keeps r270 render wrapper active');
if(js.includes('new MutationObserver(ct270Schedule).observe'))throw new Error('r272 keeps r270 observer');
must(css,'[data-home] [data-ct272-history]{display:block!important}');
must(html,'app-v272.js');must(html,'app-v272.css');if(/app-v271\.(?:js|css)/.test(html))throw new Error('r272 html references r271 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.63'||meta.revision!=='r272-official-1.0.63')throw new Error('r272 release identity');
if(meta.home_history_source!=='cinetracker_profile_home_payload_v0997_r5'||meta.home_history_in_producer!==true||meta.home_history_first!==true||meta.home_fast_cache_never_empty_history!==true||meta.home_mark_watched_refresh!=='r5'||meta.home_post_render_repair!==false||meta.home_series_watch_direct_child!==true)throw new Error('r272 Home release flags');
if(meta.discover!=='r271-preserved'||meta.detail!=='r271-preserved'||meta.sports!=='r271-preserved'||meta.android!=='1.0.20/10062')throw new Error('r272 frozen surfaces');
must(sw,"const CACHE='ct-web-1.0.63-r272';");must(sw,'app-v272.js');must(sw,'app-v272.css');
console.log('WEB_1_0_63_OFFICIAL_OK r272 producer-history r5-only direct-watch no-post-repair');
