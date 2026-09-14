import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r274.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v274.js','app-v274.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r274 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.65';window.__ctOfficialVersion='1.0.65';",
 "const REVISION='r274-official-1.0.65';",
 "window.__ctR274='home-r6-fast+ascending-history+rich-meta+rewatch'",
 "window.__ctR274Home='r6-limit20+series120+movies120'",
 "window.__ctR274History='oldest-top+newest-bottom+auto-bottom'",
 "rpc('cinetracker_profile_home_payload_v0997_r6'",
 'p_history_limit:20,p_series_limit:120,p_movie_limit:120',
 "rpc('cinetracker_rewatch_history_v1'",
 'function ct274EpisodeMeta(x)',
 'function ct274MovieMeta(x)',
 'function ct274AscHistory(rows)',
 's.scrollTop=s.scrollHeight',
 'paintHome=ct274PaintHome;renderHome=ct274RenderHome;',
 'ct273ReloadHome=ct274ReloadHome',
 'data-ct274-rewatch="',
 'data-ct274-history="episodes"',
 'data-ct274-history="movies"'
])must(js,x);
for(const x of[
 '[data-home] .ct274-media-card{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;',
 '[data-home] .ct274-history-actions{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;',
 'width:40px!important;min-width:40px!important;max-width:40px!important;',
 'max-height:min(55vh,520px)!important;overflow-y:auto!important;'
])must(css,x);
must(html,'app-v274.js');must(html,'app-v274.css');if(/app-v273\.(?:js|css)/.test(html))throw new Error('r274 html references r273 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.65'||meta.revision!=='r274-official-1.0.65')throw new Error('r274 release identity');
if(meta.home_payload_source!=='cinetracker_profile_home_payload_v0997_r6'||meta.home_history_limit!==20||meta.home_series_limit!==120||meta.home_movie_limit!==120||meta.home_history_order!=='oldest-top-newest-bottom'||meta.home_history_auto_bottom!==true||meta.home_episode_metadata!==true||meta.home_movie_metadata!==true||meta.home_rewatch!==true||meta.home_history_undo!==true||meta.home_card_layout!=='flex-row-nowrap'||meta.home_watch_action_px!==40)throw new Error('r274 Home release flags');
if(meta.discover!=='r273-preserved'||meta.detail!=='r273-preserved'||meta.sports!=='r273-preserved'||meta.android!=='1.0.20/10062')throw new Error('r274 frozen surfaces');
must(sw,"const CACHE='ct-web-1.0.65-r274';");must(sw,'app-v274.js');must(sw,'app-v274.css');
console.log('WEB_1_0_65_OFFICIAL_OK r274 timeout history-order rich-meta rewatch');
