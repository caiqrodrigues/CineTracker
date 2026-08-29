import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v131d-v0997-real-data-path.js';
const source=resolve(root,'apps/web',patch);
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${patch}"></script>`;
  html=html.replaceAll(tag,'');
  const anchor='<script src="/patch-v131c-v0997-targeted-corrections.js"></script>';
  if(!html.includes(anchor))throw new Error(`Web r131d: r131c anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7 r131d: payload vivo + Perfil 10+ + Calendário emitidos.');
