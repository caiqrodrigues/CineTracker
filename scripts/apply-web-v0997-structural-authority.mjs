import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patch='patch-v120-v0997-structural-authority.js';
const source=resolve(root,'apps/web',patch);

for(const dir of dirs){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${patch.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v119-v0997-real-smoke-hotfix.js"></script>';
  if(!html.includes(anchor))throw new Error(`0.99.7 structural authority: v119 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patch}"></script>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7: structural authority v120 emitted after v119.');
