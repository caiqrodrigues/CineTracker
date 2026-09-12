import {readFile} from 'node:fs/promises';
const runtime=await readFile(new URL('./runtime-r259-fast-home-discover.js',import.meta.url),'utf8');
const build=await readFile(new URL('./build-r259.mjs',import.meta.url),'utf8');
const official=await readFile(new URL('./build-r259-official.mjs',import.meta.url),'utf8');
const migration=await readFile(new URL('../../supabase/migrations/20260912111000_r259_recommendation_state_v108.sql',import.meta.url),'utf8');
const need=(s,x)=>{if(!s.includes(x))throw new Error('R259 missing '+x)};
for(const x of[
 "window.__ctR259='fast-home-discover-no-observers'",
 "window.__ctR259Home='r5-first-paint+weekly-priority-only+no-dom-repair'",
 "window.__ctR259Discover='v108-fast-state+staged-first-page+never-global-blank'",
 "window.__ctR259Horizontal='css-native-pan-x-no-mutation-observer'",
 "window.__ctR259Frozen='sports-profile-configs-r257-unchanged'",
 'cinetracker_profile_home_payload_v0997_r5','provisionalWeekly259','auditWeeklyRow259','cinetracker_series_episode_state_v1',
 'cinetracker_recommendation_state_v108','cinetracker_recommendation_state_v107','forYouSkeleton259','Promise.all([personal259(),freshPools259()])',
 'data-ct259-discover-tab','data-ct259-discover-type','ct259-media-card'
])need(runtime,x);
if(runtime.includes('MutationObserver'))throw new Error('r259 runtime must not observe the whole app');
if(runtime.includes('cinetracker_profile_media_dashboard_v0991')||runtime.includes('cinetracker_watchlist_full_v119'))throw new Error('r259 Discover must not use the heavy dashboard/full-watchlist pair');
for(const x of["await import('./build-r257-official.mjs')","if(false&&root256&&window.MutationObserver)","if(false&&app257&&window.MutationObserver)","if(e.pointerType==='touch')return;","const REVISION='r259-official-1.0.50';",'app-v259.js','app-v259.css',"ct-web-1.0.50-r259",'touch-action:pan-x pan-y!important'])need(build,x);
if(build.includes("await import('./build-r258"))throw new Error('r259 must skip the broken r258 composition');
for(const x of['create or replace function public.cinetracker_recommendation_state_v108()','security',"revoke all on function public.cinetracker_recommendation_state_v108() from anon",'limit 80'])need(migration,x);
need(official,'WEB_1_0_50_OFFICIAL r259 verified');
console.log('R259_STATIC_PASS');
