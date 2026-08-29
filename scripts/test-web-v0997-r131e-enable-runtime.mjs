import {readFile} from 'node:fs/promises';
const js=await readFile('dist/patch-v131e-v0997-enable-runtime.js','utf8');
const html=await readFile('dist/index.html','utf8');
for(const needle of ['v131e-direct-rest-nonstarving','/rest/v1/rpc/cinetracker_home_live_v0997','cinetracker_home_live_v0997',"cache:'no-store'",'fire(true)']){
  if(!js.includes(needle))throw new Error(`r131e missing ${needle}`);
}
if(js.includes('while(timers.length)clearTimeout')||js.includes('[80,350,900,1800,3500]'))throw new Error('r131e must not use starving r131d timer pattern');
if((html.match(/patch-v131e-v0997-enable-runtime\.js/g)||[]).length!==1)throw new Error('r131e must be emitted exactly once');
if(!html.includes('patch-v131d-v0997-real-data-path.js"></script><script src="/patch-v131e-v0997-enable-runtime.js'))throw new Error('r131e must load immediately after r131d');
if(/patch-v132-v0997|patch-v133-v0997/.test(html))throw new Error('r132/r133 must remain disabled');
console.log('WEB_R131E_OK direct-rest=enabled nonstarving=true emitted=once');
