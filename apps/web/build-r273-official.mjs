import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r273.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v273.js','app-v273.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r273 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.64';window.__ctOfficialVersion='1.0.64';",
 "const REVISION='r273-official-1.0.64';",
 "window.__ctR273='home-r5-direct+history-undo+strict-flex-row'",
 "window.__ctR273Home='canonical-r5-state+history-first+no-false-empty'",
 "window.__ctR273Layout='flex-row-nowrap+right-action-40'",
 'function ct273NormalizeHomePayload(data)',
 "async function ct273FetchHome(){return ct273NormalizeHomePayload(await rpc('cinetracker_profile_home_payload_v0997_r5'",
 'function ct273PaintHome()',
 'function ct273UndoButton(x,kind)',
 "rpc('cinetracker_unmark_episode_v1'",
 "rpc('cinetracker_unmark_media_seen_v1'",
 'paintHome=ct273PaintHome;renderHome=ct273RenderHome;',
 'data-ct273-history="episodes"',
 'data-ct273-history="movies"',
 'data-ct273-history-undo="'
])must(js,x);
for(const x of[
 '[data-home] .ct273-media-card{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;',
 'justify-content:space-between!important;',
 'width:40px!important;min-width:40px!important;max-width:40px!important;',
 'height:40px!important;min-height:40px!important;max-height:40px!important;',
 'flex:0 0 40px!important;',
 'position:static!important;'
])must(css,x);
if(js.includes("rpc('cinetracker_home_live_v0997_r3'"))throw new Error('r273 still contains legacy r3 Home RPC');
must(html,'app-v273.js');must(html,'app-v273.css');if(/app-v272\.(?:js|css)/.test(html))throw new Error('r273 html references r272 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.64'||meta.revision!=='r273-official-1.0.64')throw new Error('r273 release identity');
if(meta.home_history_source!=='cinetracker_profile_home_payload_v0997_r5'||meta.home_history_direct_fetch!==true||meta.home_history_payload_validated!==true||meta.home_history_first!==true||meta.home_history_undo!==true||meta.home_false_empty_prevented!==true||meta.home_card_layout!=='flex-row-nowrap'||meta.home_watch_action_px!==40||meta.home_post_render_repair!==false)throw new Error('r273 Home release flags');
if(meta.discover!=='r272-preserved'||meta.detail!=='r272-preserved'||meta.sports!=='r272-preserved'||meta.android!=='1.0.20/10062')throw new Error('r273 frozen surfaces');
must(sw,"const CACHE='ct-web-1.0.64-r273';");must(sw,'app-v273.js');must(sw,'app-v273.css');
console.log('WEB_1_0_64_OFFICIAL_OK r273 canonical-history undo strict-flex-row');
