import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const source=resolve(root,'apps/web/patch-v136-v0997-direct-primary.js');
const name='patch-v137-v0997-single-primary.js';

let runtime=await readFile(source,'utf8');
runtime=runtime
  .replaceAll('__ct0997DirectPrimary136Loaded','__ct0997StablePrimary137Loaded')
  .replaceAll('__ct0997DirectPrimary136','__ct0997StablePrimary137')
  .replaceAll("r136-direct-home-profile-discover-router","r137-single-primary-no-legacy-prime");

const oldPrime="function prime(key){const now=Date.now(),last=primed.get(key)||0;if(now-last<5000)return;primed.set(key,now);try{window.view=key}catch{}try{if(typeof view!=='undefined')view=key}catch{}const fn=window.__ct0994Navigate;if(typeof fn==='function'){try{Promise.resolve(fn(key)).catch(()=>{})}catch{}}}";
const newPrime="function prime(key){try{window.view=key}catch{}try{if(typeof view!=='undefined')view=key}catch{}}";
if(!runtime.includes(oldPrime))throw new Error('r137: legacy prime() call not found');
runtime=runtime.replace(oldPrime,newPrime);
if(runtime.includes("function prime(key){const now=Date.now()")||runtime.includes("primed.set(key,now)"))throw new Error('r137: legacy prime survived');

for(const dir of dirs){
  const r137Path=resolve(dir,name);
  await writeFile(r137Path,runtime,'utf8');

  // v120: its observer may remain registered, but after r137 it must become a no-op
  // for every primary route, including Home (r136 only yielded Profile/Discover/Settings).
  const v120Path=resolve(dir,'patch-v120-v0997-structural-authority.js');
  let v120=await readFile(v120Path,'utf8');
  if(!v120.includes('window.__ct0997StablePrimary137Loaded')){
    v120=v120.replace('function hardClean120(){','function hardClean120(){if(window.__ct0997StablePrimary137Loaded)return;');
  }
  if(!v120.includes('function hardClean120(){if(window.__ct0997StablePrimary137Loaded)return;'))throw new Error('r137: v120 yield failed');
  await writeFile(v120Path,v120,'utf8');

  // v126: click/focus/data bursts must not normalize nav/profile after r137 owns the UI.
  const v126Path=resolve(dir,'patch-v126-v0997-video3124-recovery.js');
  let v126=await readFile(v126Path,'utf8');
  if(!v126.includes('function cleanup(){if(window.__ct0997StablePrimary137Loaded)return;')){
    v126=v126.replace('function cleanup(){','function cleanup(){if(window.__ct0997StablePrimary137Loaded)return;');
  }
  if(!v126.includes('function cleanup(){if(window.__ct0997StablePrimary137Loaded)return;'))throw new Error('r137: v126 global cleanup yield failed');
  await writeFile(v126Path,v126,'utf8');

  // v124: its subtree observer and auth warmer were still reconciling chrome/profile.
  const v124Path=resolve(dir,'patch-v124-v0997-video-smoke-authority.js');
  let v124=await readFile(v124Path,'utf8');
  if(!v124.includes('function reconcile(){if(window.__ct0997StablePrimary137Loaded)return;'))v124=v124.replace('function reconcile(){','function reconcile(){if(window.__ct0997StablePrimary137Loaded)return;');
  if(!v124.includes('async function warmAuthenticated(){if(window.__ct0997StablePrimary137Loaded)return;'))v124=v124.replace('async function warmAuthenticated(){','async function warmAuthenticated(){if(window.__ct0997StablePrimary137Loaded)return;');
  if(!v124.includes('function watchAuth(){if(window.__ct0997StablePrimary137Loaded)return;'))v124=v124.replace('function watchAuth(){','function watchAuth(){if(window.__ct0997StablePrimary137Loaded)return;');
  for(const x of ['function reconcile(){if(window.__ct0997StablePrimary137Loaded)return;','async function warmAuthenticated(){if(window.__ct0997StablePrimary137Loaded)return;','function watchAuth(){if(window.__ct0997StablePrimary137Loaded)return;'])if(!v124.includes(x))throw new Error('r137: v124 yield failed '+x);
  await writeFile(v124Path,v124,'utf8');

  // r131 and its fresh r134 copy may keep their observers registered for detail helpers,
  // but autonomous Discover repaint/warm is forbidden once r137 exists.
  for(const file of ['patch-v131-v0997-rich-movie-discover.js','patch-v134a-v0997-discover-final.js']){
    const p=resolve(dir,file);let js=await readFile(p,'utf8');
    if(!js.includes('function ensureDiscover(){if(window.__ct0997StablePrimary137Loaded)return;'))js=js.replace('function ensureDiscover(){','function ensureDiscover(){if(window.__ct0997StablePrimary137Loaded)return;');
    if(!js.includes('function warmDiscover(){if(window.__ct0997StablePrimary137Loaded)return;'))js=js.replace('function warmDiscover(){','function warmDiscover(){if(window.__ct0997StablePrimary137Loaded)return;');
    if(!js.includes('function ensureDiscover(){if(window.__ct0997StablePrimary137Loaded)return;')||!js.includes('function warmDiscover(){if(window.__ct0997StablePrimary137Loaded)return;'))throw new Error(`r137: ${file} autonomous Discover yield failed`);
    await writeFile(p,js,'utf8');
  }

  // r134c remains active for movie/series/person deep links, but is no longer allowed
  // to rewrite primary navigation or invoke its legacy primary renderer.
  const routesPath=resolve(dir,'patch-v134c-v0997-deeplink-details.js');
  let routes=await readFile(routesPath,'utf8');
  if(!routes.includes("function normalizeNav(){if(window.__ct0997StablePrimary137Loaded&&parseRoute().kind==='primary')return;"))routes=routes.replace('function normalizeNav(){',"function normalizeNav(){if(window.__ct0997StablePrimary137Loaded&&parseRoute().kind==='primary')return;");
  if(!routes.includes('async function renderPrimary(key){if(window.__ct0997StablePrimary137Loaded)return false;'))routes=routes.replace('async function renderPrimary(key){','async function renderPrimary(key){if(window.__ct0997StablePrimary137Loaded)return false;');
  if(!routes.includes("function normalizeNav(){if(window.__ct0997StablePrimary137Loaded&&parseRoute().kind==='primary')return;")||!routes.includes('async function renderPrimary(key){if(window.__ct0997StablePrimary137Loaded)return false;'))throw new Error('r137: r134c primary yield failed');
  await writeFile(routesPath,routes,'utf8');

  // r135/r136 authority runtimes are intentionally not executed anymore. Their build
  // transforms still expose helpers used by r137, but only r137 owns the primary UI.
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  for(const old of ['patch-v135-v0997-final-primary-authority.js','patch-v136-v0997-direct-primary.js'])html=html.replaceAll(`<script src="/${old}"></script>`,'');
  const tag=`<script src="/${name}"></script>`;
  html=html.replaceAll(tag,'').replace('</body>',`${tag}</body>`);
  await writeFile(indexPath,html,'utf8');

  execFileSync(process.execPath,['--check',r137Path],{stdio:'pipe'});
}

console.log('WEB_R137_APPLIED single-primary legacy-prime=off v120/v124/v126=yield r131/r134=nonautonomous r134c=details-only');
await import('./test-web-v0997-r137-single-authority.mjs');
