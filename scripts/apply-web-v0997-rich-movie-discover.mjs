import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v131-v0997-rich-movie-discover.js';
const source=resolve(root,'apps/web',patch);

for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${patch}"></script>`;
  html=html.replaceAll(tag,'');
  const anchor='<script src="/patch-v130-v0997-nav-footer-stability.js"></script>';
  if(!html.includes(anchor))throw new Error(`Web v131: v130 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7 r131: detalhe rico + Descobrir com 6 abas emitidos.');
