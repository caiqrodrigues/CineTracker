import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r258.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,release]=await Promise.all([readFile(resolve(dist,'app-v258.js'),'utf8'),readFile(resolve(dist,'app-v258.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')]);
for(const x of[
 "window.__ctR258='account-ground-truth-home-discover-native-scroll'",
 "window.__ctR258Home='payload-pending-first+raw-smackdown-priority-sequence+historic-holes-ignored'",
 "window.__ctR258Discover='safe-item-hydration+strict-personal-exclusions+cached-complete-pools'",
 "window.__ctR258Horizontal='native-pan-x+mouse-drag+discover-and-details'",
 "window.__ctR258Frozen='sports-profile-configs-r257-unchanged'",
 "const REVISION='r258-official-1.0.49';"
])if(!js.includes(x))throw new Error('r258 official missing '+x);
for(const x of['cinetracker_series_episode_state_v1','cinetracker_profile_media_dashboard_v0991','cinetracker_watchlist_full_v119','payloadNormalize258','weeklySequence258','hydrate258','data-ct258-discover-tab','window.__ctR257F1'])if(!js.includes(x))throw new Error('r258 authority missing '+x);
if(js.includes('void auditHomeExact257()')||js.includes('void auditHome256()'))throw new Error('r258 old slow Home audits still active');
if(!js.includes("if(e.pointerType==='touch')return;if(e.button!=null&&e.button!==0)return;"))throw new Error('r258 touch pointer capture not disabled');
if(!css.includes('.ct258-media-rail')||!css.includes('touch-action:pan-x pan-y!important')||!css.includes('.ct258-discover-tabs'))throw new Error('r258 native-scroll CSS missing');
if(!html.includes('app-v258.js')||!html.includes('app-v258.css')||!release.includes('r258-official-1.0.49'))throw new Error('r258 assets/release mismatch');
console.log('WEB_1_0_49_OFFICIAL r258 verified');
