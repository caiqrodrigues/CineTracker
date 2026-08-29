import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const files={
  runtime:'dist/patch-v137-v0997-single-primary.js',
  html:'dist/index.html',
  v120:'dist/patch-v120-v0997-structural-authority.js',
  v124:'dist/patch-v124-v0997-video-smoke-authority.js',
  v126:'dist/patch-v126-v0997-video3124-recovery.js',
  r131:'dist/patch-v131-v0997-rich-movie-discover.js',
  r134a:'dist/patch-v134a-v0997-discover-final.js',
  r134c:'dist/patch-v134c-v0997-deeplink-details.js'
};
for(const p of Object.values(files).filter(x=>x.endsWith('.js')))execFileSync(process.execPath,['--check',p],{stdio:'pipe'});
const [js,html,v120,v124,v126,r131,r134a,r134c]=await Promise.all(Object.values(files).map(p=>readFile(p,'utf8')));

for(const x of [
  '__ct0997StablePrimary137Loaded',
  'r137-single-primary-no-legacy-prime',
  "function prime(key){try{window.view=key}catch{}try{if(typeof view!=='undefined')view=key}catch{}}",
  "rpcDirect('cinetracker_home_live_v0997_r2'",
  "rpcDirect('cinetracker_profile_payload_v0997'",
  'async function renderDiscover()',
  'async function renderSettings()',
  ".observe(app,{childList:true})"
])if(!js.includes(x))throw new Error('r137 runtime missing '+x);
if(js.includes('primed.set(key,now)'))throw new Error('r137 must not wake legacy navigation from prime');
if(js.includes('.observe(app,{childList:true,subtree:true'))throw new Error('r137 must not observe app subtree');
if((html.match(/patch-v137-v0997-single-primary\.js/g)||[]).length!==1)throw new Error('r137 runtime must be emitted once');
for(const old of ['patch-v135-v0997-final-primary-authority.js','patch-v136-v0997-direct-primary.js'])if(html.includes(`<script src="/${old}"></script>`))throw new Error(old+' must not execute in final HTML');
if(!v120.includes('function hardClean120(){if(window.__ct0997StablePrimary137Loaded)return;'))throw new Error('v120 does not yield to r137');
for(const x of ['function reconcile(){if(window.__ct0997StablePrimary137Loaded)return;','async function warmAuthenticated(){if(window.__ct0997StablePrimary137Loaded)return;','function watchAuth(){if(window.__ct0997StablePrimary137Loaded)return;'])if(!v124.includes(x))throw new Error('v124 does not yield: '+x);
if(!v126.includes('function cleanup(){if(window.__ct0997StablePrimary137Loaded)return;'))throw new Error('v126 does not yield to r137');
for(const [label,s] of [['r131',r131],['r134a',r134a]])for(const x of ['function ensureDiscover(){if(window.__ct0997StablePrimary137Loaded)return;','function warmDiscover(){if(window.__ct0997StablePrimary137Loaded)return;'])if(!s.includes(x))throw new Error(label+' autonomous discover survived: '+x);
if(!r134c.includes("function normalizeNav(){if(window.__ct0997StablePrimary137Loaded&&parseRoute().kind==='primary')return;"))throw new Error('r134c can still rewrite primary nav');
if(!r134c.includes('async function renderPrimary(key){if(window.__ct0997StablePrimary137Loaded)return false;'))throw new Error('r134c can still invoke legacy primary renderer');
console.log('WEB_R137_OK single-primary prime=state-only v120/v124/v126=yield discover=nonautonomous deeplink=details-only');
