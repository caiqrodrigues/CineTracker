import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patch='patch-v118-v0997-authoritative.js';
const source=resolve(root,'apps/web',patch);
const obsolete=[
  'patch-v111-v0994-global-search.js',
  'patch-v114-v0994-universal-detail.js',
  'patch-v115-v0995-favorites-profile-discover.js',
  'patch-v116-v0996-authoritative.js',
  'patch-v117-v0996-final.js'
];

for(const dir of dirs){
  await copyFile(source,resolve(dir,patch));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  for(const name of [...obsolete,patch]){
    html=html.replace(new RegExp(`<script src="/${name.replaceAll('.','\\.')}"></script>`,'g'),'');
  }
  const anchor='<script src="/patch-v113-v0994-fluidity.js"></script>';
  if(!html.includes(anchor))throw new Error(`0.99.7: v113 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patch}"></script>`);
  await writeFile(indexPath,html,'utf8');
  const swPath=resolve(dir,'service-worker.js');
  try{let sw=await readFile(swPath,'utf8');sw=sw.replace(/ct-web-0\.99\.[0-9]+/g,'ct-web-0.99.7');await writeFile(swPath,sw,'utf8')}catch{}
}
console.log('CineTracker Web 0.99.7: autoridade única de Perfil, Descobrir, detalhes, atores, gráficos e capas emitida.');
