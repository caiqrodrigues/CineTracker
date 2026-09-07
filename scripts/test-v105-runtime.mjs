import fs from 'node:fs';
const p='apps/web/runtime-r209-v105-fixes.js';const s=fs.readFileSync(p,'utf8');
new Function(s);
const must=["window.__ctR209='v105-video-corrections'",'data-ct105-rewatch-movie','data-ct105-rewatch-episode','data-ct105-history-rewatch','ct104MovieRewatch','ct104EpisodeRewatch','ct104PaintF1=async function','cinetracker-f1-v1','action:\'overview\'','current105','ct104Blocked=function'];
for(const x of must)if(!s.includes(x))throw new Error('v105 runtime missing '+x);
if(s.includes(".json'"))throw new Error('v105 runtime must not use old Jolpica .json paths');
const base=fs.readFileSync('apps/web/runtime-r208-v104-core.js','utf8');if(!base.includes('--ct104-card-w'))throw new Error('validated 1.0.4 card geometry missing from preserved base');
console.log('CINETRACKER_1_0_5_RUNTIME_OK visible-rewatch f1-v2 recommendation-session cards-preserved');
