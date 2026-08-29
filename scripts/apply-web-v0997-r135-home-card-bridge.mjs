import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  const path=resolve(dir,'patch-v134b-v0997-live-home-calendar.js');
  let js=await readFile(path,'utf8');
  const old="for(const row of $$('.ct992-row[data-ct994-open]',root)){const x=by.get(Number(row.dataset.ct994Open));";
  const fresh="for(const row of $$('.ct992-row[data-ct994-open],.ct992-row[data-ct120-open-local]',root)){const x=by.get(Number(row.dataset.ct994Open||row.dataset.ct120OpenLocal));";
  if(js.includes(old))js=js.replace(old,fresh);
  if(!js.includes(".ct992-row[data-ct120-open-local]")||!js.includes('row.dataset.ct994Open||row.dataset.ct120OpenLocal'))throw new Error('r135 Home card bridge transform failed');
  await writeFile(path,js,'utf8');
}
console.log('WEB_R135_HOME_BRIDGE_OK legacy-card-id + ct120-local-id => Home r2 canonical totals');
