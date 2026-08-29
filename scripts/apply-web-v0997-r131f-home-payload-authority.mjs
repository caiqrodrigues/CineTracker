import {copyFile,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd()),patch='patch-v131f-v0997-home-payload-authority.js',source=resolve(root,'apps/web',patch);
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${patch}"></script>`,anchor='<script src="/patch-v131e-v0997-enable-runtime.js"></script>';
  html=html.replaceAll(tag,'');
  if(!html.includes(anchor))throw new Error(`r131f: r131e anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}`);
  await writeFile(indexPath,html,'utf8');
}
console.log('WEB_R131F_APPLIED home-source=live preload=fresh renderer=r131');
