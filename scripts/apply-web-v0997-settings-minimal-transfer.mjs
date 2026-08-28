import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v128-v0997-settings-minimal-transfer.js';
const metadataPatch='patch-v129-v0997-settings-real-metadata-refresh.js';
const stabilityPatch='patch-v130-v0997-nav-footer-stability.js';
const source=resolve(root,'apps/web',patch);
const metadataSource=resolve(root,'apps/web',metadataPatch);
const stabilitySource=resolve(root,'apps/web',stabilityPatch);
const settingsLayoutCss=`\n@media (min-width:1100px){.ct91-settings.ct109-settings{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.ct109-account,.ct109-maintenance{width:100%!important;max-width:none!important;min-width:0!important;box-sizing:border-box!important}}\n`;
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  const patchOut=resolve(dir,patch);
  await copyFile(source,patchOut);
  await copyFile(metadataSource,resolve(dir,metadataPatch));
  await copyFile(stabilitySource,resolve(dir,stabilityPatch));
  let settingsJs=await readFile(patchOut,'utf8');
  const styleAnchor='document.getElementById(css128.id)?.remove();document.head.appendChild(css128);';
  if(!settingsJs.includes(styleAnchor))throw new Error(`Settings v128: style anchor missing in ${patchOut}`);
  settingsJs=settingsJs.replace(styleAnchor,`css128.textContent+=${JSON.stringify(settingsLayoutCss)};\n${styleAnchor}`);
  await writeFile(patchOut,settingsJs,'utf8');
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  for(const p of [patch,metadataPatch,stabilityPatch])html=html.replace(new RegExp(`<script src="/${p.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v127-v0997-settings-unified-data-hub.js"></script>';
  if(!html.includes(anchor))throw new Error(`Settings v128: v127 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patch}"></script><script src="/${metadataPatch}"></script><script src="/${stabilityPatch}"></script>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7: Settings v128 minimal + cards superiores equilibrados + metadata/nav stability.');
