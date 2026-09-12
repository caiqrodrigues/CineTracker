import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r259.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,release]=await Promise.all([readFile(resolve(dist,'app-v259.js'),'utf8'),readFile(resolve(dist,'app-v259.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')]);
for(const x of[
 "window.__ctR259='fast-home-discover-no-observers'",
 "window.__ctR259Home='r5-first-paint+weekly-priority-only+no-dom-repair'",
 "window.__ctR259Discover='v108-fast-state+staged-first-page+never-global-blank'",
 "window.__ctR259Horizontal='css-native-pan-x-no-mutation-observer'",
 "window.__ctR259Frozen='sports-profile-configs-r257-unchanged'",
 "window.__ctR257F1='weekend-sessions+next-qualifying-grid+previous-start-finish-grid'",
 "const REVISION='r259-official-1.0.50';",
 "cinetracker_profile_home_payload_v0997_r5",
 "cinetracker_recommendation_state_v108",
 "if(false&&root256&&window.MutationObserver)",
 "if(false&&app257&&window.MutationObserver)",
 "if(e.pointerType==='touch')return;"
])if(!js.includes(x))throw new Error('r259 official missing '+x);
if(js.includes("window.__ctR258='account-ground-truth-home-discover-native-scroll'"))throw new Error('r258 regression layer leaked into r259');
if(!css.includes('.ct259-media-card')||!css.includes('touch-action:pan-x pan-y!important')||!css.includes('.season-row'))throw new Error('r259 native rail/card CSS missing');
if(!html.includes('app-v259.js')||!html.includes('app-v259.css')||!release.includes('r259-official-1.0.50'))throw new Error('r259 assets/release mismatch');
console.log('WEB_1_0_50_OFFICIAL r259 verified');
