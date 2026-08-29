import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const name='patch-v136-v0997-direct-primary.js';
const source=resolve(root,'apps/web',name);
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await copyFile(source,resolve(dir,name));
  const v120Path=resolve(dir,'patch-v120-v0997-structural-authority.js');
  let v120=await readFile(v120Path,'utf8');
  if(!v120.includes("window.__ct0997DirectPrimary136Loaded"))v120=v120.replace("function hardClean120(){const r=routeFromDom120();","function hardClean120(){const r=routeFromDom120();if(window.__ct0997DirectPrimary136Loaded&&['profile','discover','settings'].includes(r))return;");
  await writeFile(v120Path,v120,'utf8');
  const v126Path=resolve(dir,'patch-v126-v0997-video3124-recovery.js');
  let v126=await readFile(v126Path,'utf8');
  v126=v126.replace("function cleanupProfile(){","function cleanupProfile(){if(window.__ct0997DirectPrimary136Loaded)return;").replace("function cleanupDiscover(){","function cleanupDiscover(){if(window.__ct0997DirectPrimary136Loaded)return;");
  await writeFile(v126Path,v126,'utf8');
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${name}"></script>`;
  html=html.replaceAll(tag,'').replace('</body>',`${tag}</body>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('WEB_R136_APPLIED direct-primary=home+profile+discover settings=state-synced root-observer=shallow');
await import('./test-web-v0997-r136-direct-primary.mjs');
