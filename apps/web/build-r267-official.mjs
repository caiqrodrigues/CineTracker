import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r267.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v267.js','app-v267.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r267 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.58';window.__ctOfficialVersion='1.0.58';",
 "const REVISION='r267-official-1.0.58';",
 "window.__ctR267='video-ground-truth-discover-detail-home'",
 "window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions'",
 "window.__ctR267Detail='r169-rich-producer-local-x'",
 "window.__ctR267Home='glyph-only-right-watch'",
 "window.__ctR267Sports='r266-stable-preserved'",
 'CT267_PERSONAL_START','CT267_DISCOVER_TRANSITION_START','CT267_DETAIL_HELPERS_START',
 'ct169-season-row ct267-detail-x','ct169-season-chart-carousel ct267-detail-x','ct169-cast-row ct267-detail-x','ct169-related-row ct267-detail-x',
 'cinetracker_profile_media_dashboard_v0991','cinetracker_watchlist_full_v119','cinetracker_mark_watch_v0994'
])must(js,x);
for(const x of['.ct267-detail-scope','.ct267-detail-section','.ct267-detail-x','max-width:calc(100vw - 192px)!important','.ct266-watch-action{border:0!important;background:transparent!important'])must(css,x);
if(js.includes('ct265AfterF1Paint')||js.includes('ct266AfterF1Paint')||js.includes('ct267AfterF1Paint'))throw new Error('r267 contains forbidden Sports callback');
const transition=js.match(/\/\* CT267_DISCOVER_TRANSITION_START \*\/[\s\S]*?\/\* CT267_DISCOVER_TRANSITION_END \*\//)?.[0]||'';
if(!transition||transition.includes("h.innerHTML='<div class=\"ct263-loading\">Carregando títulos…</div>';if(tab==='foryou'"))throw new Error('r267 still clears Discover between browse tabs');
const fy=js.match(/function paintForYou263\(\)\{[\s\S]*?\}\nasync function loadBrowse263/)?.[0]||'';if(!fy||fy.includes('Da sua Watchlist'))throw new Error('r267 active Pra Você renders Watchlist recommendations');
must(html,'app-v267.js');must(html,'app-v267.css');if(/app-v26[3456]\.js/.test(html))throw new Error('r267 html references stale JS');
must(release,'"version": "1.0.58"');must(release,'"revision": "r267-official-1.0.58"');must(release,'"video_ground_truth": true');
must(sw,"const CACHE='ct-web-1.0.58-r267';");
console.log('WEB_1_0_58_OFFICIAL_OK r267 video-ground-truth');
