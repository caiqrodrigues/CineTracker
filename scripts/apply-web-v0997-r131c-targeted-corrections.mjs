import { copyFile, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v131c-v0997-targeted-corrections.js';
const source=resolve(root,'apps/web',patch);
const tag=`<script src="/${patch}"></script>`;
const anchor='<script src="/patch-v131b-v0997-person-credit-bridge.js"></script>';

for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await mkdir(dir,{recursive:true});
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replaceAll(tag,'');
  if(!html.includes(anchor))throw new Error(`Web r131c: r131b anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}`);
  await writeFile(indexPath,html,'utf8');
}
console.log('WEB_R131C_APPLIED targeted=home+profile+calendar baseline=r131');
