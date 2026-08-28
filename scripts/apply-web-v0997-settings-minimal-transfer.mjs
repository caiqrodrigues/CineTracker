import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v128-v0997-settings-minimal-transfer.js';
const metadataPatch='patch-v129-v0997-settings-real-metadata-refresh.js';
const stabilityPatch='patch-v130-v0997-nav-footer-stability.js';
const source=resolve(root,'apps/web',patch);
const metadataSource=resolve(root,'apps/web',metadataPatch);
const stabilitySource=resolve(root,'apps/web',stabilityPatch);
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await copyFile(source,resolve(dir,patch));
  await copyFile(metadataSource,resolve(dir,metadataPatch));
  await copyFile(stabilitySource,resolve(dir,stabilityPatch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  for(const p of [patch,metadataPatch,stabilityPatch])html=html.replace(new RegExp(`<script src="/${p.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v127-v0997-settings-unified-data-hub.js"></script>';
  if(!html.includes(anchor))throw new Error(`Settings v128: v127 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patch}"></script><script src="/${metadataPatch}"></script><script src="/${stabilityPatch}"></script>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7: Settings v128 + metadata v129 + nav/footer stability v130 emitted after v127.');
