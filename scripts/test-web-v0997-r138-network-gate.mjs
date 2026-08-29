import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const [html,gate,js]=await Promise.all([
  readFile('dist/index.html','utf8'),
  readFile('dist/patch-v138-v0997-network-gate.js','utf8'),
  readFile('dist/patch-v138-v0997-resilient-primary.js','utf8')
]);
execFileSync(process.execPath,['--check','dist/patch-v138-v0997-network-gate.js'],{stdio:'pipe'});
execFileSync(process.execPath,['--check','dist/patch-v138-v0997-resilient-primary.js'],{stdio:'pipe'});
const gateTag='patch-v138-v0997-network-gate.js',runtimeTag='patch-v138-v0997-resilient-primary.js';
if((html.match(new RegExp(gateTag.replaceAll('.','\\.'),'g'))||[]).length!==1)throw new Error('r138 gate must be emitted once');
if((html.match(new RegExp(runtimeTag.replaceAll('.','\\.'),'g'))||[]).length!==1)throw new Error('r138 runtime must be emitted once');
if(html.indexOf(gateTag)>html.indexOf('const SUPABASE_URL'))throw new Error('r138 network gate must load before core runtime');
if(html.includes('patch-v137-v0997-single-primary.js'))throw new Error('r137 runtime must not execute with r138');
for(const x of ['MAX_HEAVY=1','ct-enrich-media-user','cinetracker_profile_home_payload_v0994','cinetracker_profile_media_dashboard_v0991','exactLegacyEpisodeQuery','X-CT-Network-Gate'])if(!gate.includes(x))throw new Error('r138 gate missing '+x);
for(const x of ["'X-CT-Primary':'r138'",'readPrimaryCache','writePrimaryCache','surfaceObserver.observe(c,{childList:true})','__ct0997StablePrimary138Loaded'])if(!js.includes(x))throw new Error('r138 primary missing '+x);
if(js.includes('surfaceObserver.observe(c,{childList:true,subtree:true'))throw new Error('r138 content observer must stay shallow');
if(!js.includes("writePrimaryCache('home',homeData)")||!js.includes("writePrimaryCache('profile',profileData)"))throw new Error('r138 stale-safe caches missing');
console.log('WEB_R138_OK gate=early heavy=serialized enrich=suppressed primary=cache-safe surface-observer=shallow');
