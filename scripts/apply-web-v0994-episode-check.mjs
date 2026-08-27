import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const layer='patch-v110-v0994-episode-check.js';
const tag=`<script src="/${layer}"></script>`;
const after='<script src="/patch-v109-v0994-settings-web.js"></script>';
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

for(const target of targets){
  const indexPath=resolve(target,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.split(tag).join('');
  if(!html.includes(after))throw new Error(`0.99.4 episode check: v109 layer missing in ${indexPath}`);
  html=html.replace(after,`${after}${tag}`);
  await writeFile(indexPath,html,'utf8');
  await copyFile(resolve(root,'apps/web',layer),resolve(target,layer));
}

console.log('CineTracker Web 0.99.4: check canônico de episódios e sincronização da Home aplicados.');
