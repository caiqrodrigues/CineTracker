import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r257.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,release]=await Promise.all([readFile(resolve(dist,'app-v257.js'),'utf8'),readFile(resolve(dist,'app-v257.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')]);
for(const x of[
 "window.__ctR257='exact-sequence-discover-personal-exclusions-horizontal-drag-f1-grid'",
 "window.__ctR257Home='exact-watched-set+next-aired-after-frontier+historic-holes-ignored'",
 "window.__ctR257Discover='fail-closed-personal-state+complete-public-pools+poster-cards'",
 "window.__ctR257Horizontal='persistent-rails+pointer-drag+discover-tabs-details-cast'",
 "window.__ctR257F1='weekend-sessions+next-qualifying-grid+previous-start-finish-grid'",
 "const REVISION='r257-official-1.0.48';"
])if(!js.includes(x))throw new Error('r257 official missing '+x);
for(const x of['cinetracker_series_episode_state_v1','cinetracker_profile_media_dashboard_v0991','cinetracker_watchlist_full_v119','QualifyingResults','pointermove','data-ct257-discover-tab','data-ct257-f1-root'])if(!js.includes(x))throw new Error('r257 authority missing '+x);
if(!css.includes('.ct257-discover-tabs')||!css.includes('touch-action:pan-y!important')||!css.includes('.ct257-f1-grid')||!css.includes('.ct257-f1-sessions'))throw new Error('r257 visual CSS missing');
if(!html.includes('app-v257.js')||!html.includes('app-v257.css')||!release.includes('r257-official-1.0.48'))throw new Error('r257 assets/release mismatch');
console.log('WEB_1_0_48_OFFICIAL r257 verified');
