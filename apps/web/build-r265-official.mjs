import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r265.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v265.js','app-v265.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r265 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.56';window.__ctOfficialVersion='1.0.56';",
 "const REVISION='r265-official-1.0.56';",
 "window.__ctR265='producer-owned-home-discover-sports-detail'",
 "window.__ctR265Home='paint-owned-tab+side-watch-actions'",
 "window.__ctR265Discover='single-nine-tab-producer+personal-authority'",
 "window.__ctR265Sports='producer-f1-tabs-filters-feed+direct-f1-watch'",
 "window.__ctR265Detail='producer-markup+nowrap-local-x'",
 "function scheduleHomeRestore263(){return restoreHomeList263()}",
 "function scheduleF1Watch263(force=false){return false}",
 "cinetracker_mark_watch_v0994",
 "cinetracker_profile_media_dashboard_v0991",
 "cinetracker_watchlist_full_v119",
 "cinetracker_recommendation_state_v108",
 "ct265AfterF1Paint()"
])must(js,x);
for(const x of['.ct265-home-action-row','.ct265-watch-btn','.ct265-detail-x','flex-wrap:nowrap!important','overflow-x:auto!important','html,body,#app'])must(css,x);
if(js.includes('__ctR264')||js.includes('ct264-'))throw new Error('r265 official contains rejected r264 authority');
if(js.includes('runtime-r264-home-watched-discover-sports-detail-scroll'))throw new Error('r265 official references runtime r264');
must(html,'app-v265.js');must(html,'app-v265.css');if(html.includes('app-v264.js')||html.includes('app-v263.js'))throw new Error('r265 html references stale JS');
must(release,'"version": "1.0.56"');must(release,'"revision": "r265-official-1.0.56"');must(release,'"r264": "removed"');
must(sw,"const CACHE='ct-web-1.0.56-r265';");
console.log('WEB_1_0_56_OFFICIAL_OK r265');
