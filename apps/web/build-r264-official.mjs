import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r264.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v264.js','app-v264.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r264 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.55';window.__ctOfficialVersion='1.0.55';","const REVISION='r264-official-1.0.55';",
 "window.__ctR264='home-watched-stable-discover-single-sports-order-detail-rails'","window.__ctR264Home='stable-tab+side-watched-episode-movie+canonical-mark-watch'",
 "window.__ctR264Discover='single-nine-tabs+canonical-exclusions+local-rails+top10-streaming'","window.__ctR264Sports='f1-first-synchronous-order+watched-panel-persistent'",
 "window.__ctR264Detail='generic-season-episode-chart-related-similar-cast-local-x'","window.__ctR263EnhanceF1Watch=enhanceF1Watch263",
 "cinetracker_mark_watch_v0994","cinetracker_profile_media_dashboard_v0991","cinetracker_watchlist_full_v119","function reorderSports264()","function semanticRails264(root=document)"
])must(js,x);
for(const x of['.ct264-home-action-row','.ct264-watch-btn','.ct264-local-x','overflow-x:auto!important','html,body,#app'])must(css,x);
must(html,'app-v264.js');must(html,'app-v264.css');must(release,'"version": "1.0.55"');must(release,'"revision": "r264-official-1.0.55"');must(sw,"const CACHE='ct-web-1.0.55-r264';");
if(html.includes('app-v263.js')||html.includes('app-v263.css'))throw new Error('r264 official references r263 assets');
console.log('WEB_1_0_55_OFFICIAL_OK r264');
