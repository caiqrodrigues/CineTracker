import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(process.cwd());
const patch='patch-v131e-v0997-enable-runtime.js';
const source=resolve(root,'apps/web',patch);
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${patch}"></script>`;
  html=html.replaceAll(tag,'');
  const anchor='<script src="/patch-v131d-v0997-real-data-path.js"></script>';
  if(!html.includes(anchor))throw new Error(`Web r131e: r131d anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}`);
  await writeFile(indexPath,html,'utf8');
}
console.log('WEB_R131E_APPLIED direct-rest nonstarving enabled');
