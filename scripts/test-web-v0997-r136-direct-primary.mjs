import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const runtime='dist/patch-v136-v0997-direct-primary.js';
execFileSync(process.execPath,['--check',runtime],{stdio:'pipe'});
const [js,html,v120,v126]=await Promise.all([
  readFile(runtime,'utf8'),readFile('dist/index.html','utf8'),readFile('dist/patch-v120-v0997-structural-authority.js','utf8'),readFile('dist/patch-v126-v0997-video3124-recovery.js','utf8')
]);
for(const x of [
  '__ct0997DirectPrimary136Loaded',
  "rpcDirect('cinetracker_home_live_v0997_r2'",
  "rpcDirect('cinetracker_profile_payload_v0997'",
  'async function renderHome',
  'async function renderProfile',
  'async function renderDiscover',
  'async function renderSettings',
  'slice(0,10)',
  'all.length-10',
  'window.__ct135RenderDiscover',
  'window.__ct135EnsureCalendar',
  "fn('settings')",
  '.observe(app,{childList:true})',
  "total=Math.max(released,Number(x.total_episodes||0))",
  "missing=Math.max(0,released-seen)",
  "missing?`Faltam ${missing}`:'Em dia'"
])if(!js.includes(x))throw new Error('r136 runtime missing '+x);
if(js.includes('.observe(app,{childList:true,subtree:true'))throw new Error('r136 must not observe app subtree');
if((html.match(/patch-v136-v0997-direct-primary\.js/g)||[]).length!==1)throw new Error('r136 runtime must be emitted once');
if(html.lastIndexOf('patch-v136-v0997-direct-primary.js')<html.lastIndexOf('patch-v135-v0997-final-primary-authority.js'))throw new Error('r136 must load after r135');
if(!v120.includes('__ct0997DirectPrimary136Loaded'))throw new Error('v120 must yield to r136');
if(!v126.includes('__ct0997DirectPrimary136Loaded'))throw new Error('v126 must yield to r136');
console.log('WEB_R136_OK direct-home-r2 profile-10 discover-direct configs-state-sync root-observer=shallow');
