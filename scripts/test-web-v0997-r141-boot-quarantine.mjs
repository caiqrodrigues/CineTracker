import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const gateName='patch-v141-v0997-boot-gate.js';

for(const dir of dirs){
  const gate=await readFile(resolve(dir,gateName),'utf8');
  const html=await readFile(resolve(dir,'index.html'),'utf8');
  const primary=await readFile(resolve(dir,'patch-v140-v0997-profile-discover-lock.js'),'utf8');

  for(const marker of [
    'window.__ctPrimaryBootQuarantine=true',
    'window.__ct0997StablePrimary137Loaded=true',
    "return /^r\\d{3}$/i.test(h.get('X-CT-Primary')||'')",
    "'cinetracker_home_live_v0997_r2'"
  ])if(!gate.includes(marker))throw new Error(`r141: gate marker missing ${marker}`);

  if(!primary.includes("'X-CT-Primary':'r140'"))throw new Error('r141: r140 primary header missing');
  const tag=`<script src="/${gateName}"></script>`;
  if(!html.includes(tag))throw new Error('r141: physical gate tag missing');
  if(html.includes('<script src="/patch-v138-v0997-network-gate.js"></script>'))throw new Error('r141: old gate still executed');
  const bodyAt=html.indexOf('<body>'),gateAt=html.indexOf(tag),appAt=html.indexOf('<div id="app"');
  if(bodyAt<0||gateAt<bodyAt||appAt<0||gateAt>appAt)throw new Error('r141: gate must execute before app/bootstrap');

  for(const file of ['patch-v120-v0997-structural-authority.js','patch-v124-v0997-video-smoke-authority.js','patch-v126-v0997-video3124-recovery.js']){
    const js=await readFile(resolve(dir,file),'utf8');
    if(!js.includes('__ct0997StablePrimary137Loaded'))throw new Error(`r141: ${file} has no compatibility yield guard`);
  }
}

console.log('WEB_R141_OK home-r140=bypassed legacy-primary=prearmed gate=before-bootstrap physical-cache-bust');
