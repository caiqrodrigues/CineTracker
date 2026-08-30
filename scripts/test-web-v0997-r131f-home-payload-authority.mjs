import {readFile} from 'node:fs/promises';
const js=await readFile('dist/patch-v131f-v0997-home-payload-authority.js','utf8');
const html=await readFile('dist/index.html','utf8');
const normalizedHtml=html.replace(/\?[^"']+/g,'');
for(const needle of ['v131f-home-payload-authority','cinetracker_profile_home_payload_v0994','cinetracker_home_live_v0997','name===HOME_OLD||name===HOME_LIVE','window.sbRpc=authority','ct0994_home_preload_v1','window.__ct0994PreloadedHome=data',"window.__ct0994Navigate('home')",'cache:\'no-store\'']){
  if(!js.includes(needle))throw new Error(`r131f missing ${needle}`);
}
if((html.match(/patch-v131f-v0997-home-payload-authority\.js/g)||[]).length!==1)throw new Error('r131f must be emitted exactly once');
if(!normalizedHtml.includes('patch-v131e-v0997-enable-runtime.js"></script><script src="/patch-v131f-v0997-home-payload-authority.js'))throw new Error('r131f must load immediately after r131e');
if(/patch-v132-v0997|patch-v133-v0997/.test(html))throw new Error('r132/r133 must remain disabled');
console.log('WEB_R131F_OK source=live renderer=r131 preload=fresh');
