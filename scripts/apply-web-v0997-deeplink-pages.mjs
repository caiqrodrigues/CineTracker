import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v132-v0997-deeplink-pages.js';
const source=resolve(root,'apps/web',patch);
const tail=resolve(root,'apps/web','r132-runtime-tail.js');
const runtime=`${await readFile(source,'utf8').then(x=>x.trimEnd())}\n${await readFile(tail,'utf8').then(x=>x.trim())}\n`;
if(!runtime.includes('v132-url-router-fullscreen-details-profile-10-more')||!runtime.includes('v132-single-runtime-nav-integrity'))throw new Error('Web r132: composed runtime markers missing.');

for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await writeFile(resolve(dir,patch),runtime,'utf8');
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${patch}"></script>`;
  const anchor='<script src="/patch-v131b-v0997-person-credit-bridge.js"></script>';
  html=html.replaceAll(tag,'');
  if(!html.includes(anchor))throw new Error(`Web r132: r131b anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}`);
  await writeFile(indexPath,html,'utf8');
}

console.log('CineTracker Web 0.99.7 r132: runtime único com rotas URL, detalhes full-page, navegação estável, 10 + Ver mais e favoritos emitido.');
