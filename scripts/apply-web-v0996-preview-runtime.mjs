import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patch='patch-v118-v0996-preview-runtime.js';
const source=resolve(root,'apps/web',patch);
const anchor='<script src="/patch-v117-v0996-final.js"></script>';

for(const dir of dirs){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${patch.replaceAll('.','\\.')}"></script>`,'g'),'');
  if(!html.includes(anchor))throw new Error(`0.99.6 preview: v117 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patch}"></script>`);
  await writeFile(indexPath,html,'utf8');
}

console.log('CineTracker 0.99.6 preview runtime emitted after v117.');
