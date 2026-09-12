import {readFile} from 'node:fs/promises';
const runtime=await readFile(new URL('./runtime-r257-sequence-scroll-discover-f1-grid.js',import.meta.url),'utf8');
const build=await readFile(new URL('./build-r257.mjs',import.meta.url),'utf8');
const official=await readFile(new URL('./build-r257-official.mjs',import.meta.url),'utf8');
const need=(s,x)=>{if(!s.includes(x))throw new Error('R257 missing '+x)};
for(const x of[
 "window.__ctR257='exact-sequence-discover-personal-exclusions-horizontal-drag-f1-grid'",
 "window.__ctR257Home='exact-watched-set+next-aired-after-frontier+historic-holes-ignored'",
 "window.__ctR257Discover='fail-closed-personal-state+complete-public-pools+poster-cards'",
 "window.__ctR257Horizontal='persistent-rails+pointer-drag+discover-tabs-details-cast'",
 "window.__ctR257F1='weekend-sessions+next-qualifying-grid+previous-start-finish-grid'",
 'cinetracker_series_episode_state_v1','watchedFrontierExact257','sequence257(row)','p>frontier','history_missing_episodes=seq.pending.length',
 'is_in_progress','is_up_to_date','cinetracker_watchlist_full_v119','browseEligible257','pages=3','out.slice(0,60)',
 '.ct257-discover-tabs','.ct257-media-rail','pointerdown','pointermove','scrollLeft=st.left-dx','ct257-dragging',
 'QualifyingResults','Grid de largada do próximo GP','Grid de largada → resultado','sessionRows257','data-ct257-f1-root'
])need(runtime,x);
for(const x of["await import('./build-r256-official.mjs')","const REVISION='r257-official-1.0.48';",'app-v257.js','app-v257.css',"ct-web-1.0.48-r257",'touch-action:pan-y!important','.ct257-f1-grid'])need(build,x);
need(official,'WEB_1_0_48_OFFICIAL r257 verified');
if(runtime.includes('next_episode_to_air'))throw new Error('r257 Home must not use next_episode_to_air as an aired episode');
console.log('R257_STATIC_PASS');
