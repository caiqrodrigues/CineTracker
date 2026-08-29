import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  const js=await readFile(resolve(dir,'patch-v140-v0997-profile-discover-lock.js'),'utf8');
  const html=await readFile(resolve(dir,'index.html'),'utf8');
  const must=[
    'r140-profile-discover-lock',
    'flex-wrap:nowrap!important',
    'data-ct140-owned="discover"',
    "surfaceHostObserver=new MutationObserver(check)",
    "[data-ct120-slot=\"actors\"]",
    "[data-ct131-tab=\"new\"]",
    "[data-ct131d-calendar]"
  ];
  for(const s of must)if(!js.includes(s))throw new Error(`r140 gate missing: ${s}`);
  if(js.includes('for(const d of[300,900,1800,3600])'))throw new Error('r140: legacy delayed discover repaint survived');
  if(!html.includes('/patch-v140-v0997-profile-discover-lock.js'))throw new Error('r140 runtime not injected');
  if(html.includes('/patch-v139-v0997-cache-buttons.js'))throw new Error('r139 runtime still injected');
}
console.log('WEB_R140_OK actors=single-row-10+more discover=no-delayed-repaint profile+discover=host-locked');
