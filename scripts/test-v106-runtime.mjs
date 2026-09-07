import fs from 'node:fs';
const p='apps/web/runtime-r210-v106-safe.js';const s=fs.readFileSync(p,'utf8');
new Function(s);
const must=["window.__ctR210='v106-scope-safe-runtime'",'data-ct106-rewatch-movie','data-ct106-rewatch-episode','data-ct106-history-rewatch','cinetracker_rewatch_counts_v104','cinetracker_mark_watch_v0994','cinetracker_mark_episode_v0994','cinetracker-f1-v1','paintF1','ensureF1','pointerdown'];
for(const x of must)if(!s.includes(x))throw new Error('v106 runtime missing '+x);
for(const x of ['ct104PaintF1=','ct104Blocked=','ct104MovieRewatch(','ct104EpisodeRewatch(','ct104Counts?.','ct104LoadCounts('])if(s.includes(x))throw new Error('v106 runtime contains private scope leak '+x);
console.log('CINETRACKER_1_0_6_RUNTIME_OK scope-safe rewatch f1 navigation');