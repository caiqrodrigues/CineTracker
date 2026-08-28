import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v133-v0997-primary-authority.js';
const source=resolve(root,'apps/web',patch);
const marker='v133-primary-single-authority-home-discover-profile';
const src=await readFile(source,'utf8');
if(!src.includes(marker))throw new Error('Web r133: source marker missing.');

for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${patch}"></script>`;
  const anchor='<script src="/patch-v132-v0997-deeplink-pages.js"></script>';
  html=html.replaceAll(tag,'');
  if(!html.includes(anchor))throw new Error(`Web r133: r132 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('CineTracker Web 0.99.7 r133: autoridade única Home/Descobrir/Perfil, estados lançados, histórico/watchlist e timeline emitidos.');
