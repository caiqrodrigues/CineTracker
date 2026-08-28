import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patch='patch-v126-v0997-video3124-recovery.js';
const source=resolve(root,'apps/web',patch);
for(const dir of dirs){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${patch.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v125-v0997-restore-foryou-contract.js"></script>';
  if(!html.includes(anchor))throw new Error(`Video3124 recovery: v125 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patch}"></script>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7: video 1001713124 surgical recovery emitted after v125.');
