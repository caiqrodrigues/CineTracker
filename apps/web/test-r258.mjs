import {readFile} from 'node:fs/promises';
const runtime=await readFile(new URL('./runtime-r258-account-ground-truth.js',import.meta.url),'utf8');
const build=await readFile(new URL('./build-r258.mjs',import.meta.url),'utf8');
const official=await readFile(new URL('./build-r258-official.mjs',import.meta.url),'utf8');
const need=(s,x)=>{if(!s.includes(x))throw new Error('R258 missing '+x)};
for(const x of[
 "window.__ctR258='account-ground-truth-home-discover-native-scroll'",
 "window.__ctR258Home='payload-pending-first+raw-smackdown-priority-sequence+historic-holes-ignored'",
 "window.__ctR258Discover='safe-item-hydration+strict-personal-exclusions+cached-complete-pools'",
 "window.__ctR258Horizontal='native-pan-x+mouse-drag+discover-and-details'",
 "window.__ctR258Frozen='sports-profile-configs-r257-unchanged'",
 'released_episodes)-n258(r?.watched_episodes)','payloadNormalize258','weeklySequence258','p>frontier','r._ct258DisplayMissing=missing','r.released_episodes=n258(r.watched_episodes)+missing',
 'cinetracker_series_episode_state_v1','cinetracker_profile_media_dashboard_v0991','cinetracker_watchlist_full_v119','media_overrides?select=media_id,state&state=eq.NotInterested',
 'async function tmdb258','catch{return null}','async function hydrate258','candidates.slice(0,24).map(hydrate258)','out.slice(0,80)',
 '.ct258-native-x','.ct258-media-rail','pointerType===\'touch\'','data-ct258-discover-tab','data-ct258-foryou'
])need(runtime,x);
for(const x of["await import('./build-r257-official.mjs')","const REVISION='r258-official-1.0.49';",'app-v258.js','app-v258.css',"ct-web-1.0.49-r258",'void auditHomeExact257()','void auditHome256()',"if(e.pointerType==='touch')return",'touch-action:pan-x pan-y!important'])need(build,x);
need(official,'WEB_1_0_49_OFFICIAL r258 verified');
if(/renderSports\s*=|renderProfile\s*=|renderConfigs\s*=/.test(runtime))throw new Error('r258 must not alter approved Sports/Profile/Configs renderers');
if(runtime.includes('next_episode_to_air'))throw new Error('r258 Home must never use next_episode_to_air as an aired episode');
console.log('R258_STATIC_PASS');
