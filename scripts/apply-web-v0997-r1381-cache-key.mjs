import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source='patch-v133-v0997-primary-authority.js';
const target='primary-authority-r138.js';
for(const base of ['dist','apps/web/dist']){
  const dir=resolve(root,base);
  const js=await readFile(resolve(dir,source),'utf8');
  if(!js.includes('r137-rpc-timeout-native-nav'))throw new Error(base+': r138.1 source is not the current r137 authority');
  await writeFile(resolve(dir,target),js,'utf8');
  const page=resolve(dir,'primary.html');
  let html=await readFile(page,'utf8');
  const old='/'+source;
  const fresh='/'+target;
  if(!html.includes(old))throw new Error(base+': old clean authority URL missing');
  html=html.replaceAll(old,fresh);
  if(html.includes(old))throw new Error(base+': stale authority URL survived');
  await writeFile(page,html,'utf8');
}
console.log('CineTracker Web 0.99.7 r138.1: clean runtime filename rotated; previously immutable cache cannot be reused.');
