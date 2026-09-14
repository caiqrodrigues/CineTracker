import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r266.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v266.js','app-v266.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r266 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.57';window.__ctOfficialVersion='1.0.57';",
 "const REVISION='r266-official-1.0.57';",
 "window.__ctR266='r263-rebuilt-home-discover-detail-sports-safe'",
 "window.__ctR266Home='approved-list+inside-right-minimal-watch'",
 "window.__ctR266Discover='watchlist-is-exclusion+complete-personal-authority'",
 "window.__ctR266Sports='r263-stable-no-cross-scope-runtime-call'",
 "window.__ctR266Detail='producer-rails+local-horizontal-only'",
 "cinetracker_mark_watch_v0994",
 "cinetracker_profile_media_dashboard_v0991",
 "cinetracker_watchlist_full_v119",
 "cinetracker_recommendation_state_v108",
 "function scheduleHomeRestore263(){return restoreHomeList263()}"
])must(js,x);
for(const x of['.ct266-home-watch-host','.ct266-watch-action','.ct266-detail-x','flex-wrap:nowrap!important','overflow-x:auto!important','html,body,#app'])must(css,x);
if(js.includes('__ctR264')||js.includes('__ctR265')||js.includes('ct264-')||js.includes('ct265-'))throw new Error('r266 official contains rejected r264/r265 authority');
if(js.includes('ct265AfterF1Paint')||js.includes('ct266AfterF1Paint'))throw new Error('r266 official contains cross-scope Sports callback');
const fy=js.match(/function paintForYou263\(\)\{[\s\S]*?\}\nasync function loadBrowse263/)?.[0]||'';if(!fy||fy.includes('Da sua Watchlist'))throw new Error('r266 active Pra Você still renders Watchlist recommendations');
must(html,'app-v266.js');must(html,'app-v266.css');if(/app-v26[345]\.js/.test(html))throw new Error('r266 html references stale JS');
must(release,'"version": "1.0.57"');must(release,'"revision": "r266-official-1.0.57"');must(release,'"r264": "rejected"');must(release,'"r265": "rejected"');
must(sw,"const CACHE='ct-web-1.0.57-r266';");
console.log('WEB_1_0_57_OFFICIAL_OK r266');
