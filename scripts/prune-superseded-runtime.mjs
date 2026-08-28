import { readFile, writeFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const SUPERSEDED=new Set([
  // Already superseded / dead in emitted 0.99.7 artifact.
  'patch-v111-v0994-global-search.js',
  'patch-v114-v0994-universal-detail.js',
  'patch-v115-v0995-favorites-profile-discover.js',
  'patch-v116-v0996-authoritative.js',
  'patch-v117-v0996-final.js',
  // Verified legacy UI authorities that actively fight v118/v120:
  // v042 old Settings authority; v043 extra Tempo de Tela/Histórico;
  // v044 extra hourly activity chart + old Settings;
  // v045 permanent 3s metadata/poster scanner; v046 old full Web UI/navigation.
  'patch-v042.js',
  'patch-v043.js',
  'patch-v044.js',
  'patch-v045.js',
  'patch-v046.js'
]);

for(const dir of dirs){
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  let bytes=0,removed=0;
  const found=[];
  html=html.replace(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi,(full,src)=>{
    const name=String(src).split('/').pop();
    if(!SUPERSEDED.has(name)) return full;
    found.push(name); removed++; return '';
  });
  for(const name of new Set(found)){try{bytes+=(await stat(resolve(dir,name))).size}catch{}}
  await writeFile(indexPath,html,'utf8');
  console.log(`RUNTIME_PRUNE ${JSON.stringify({dir,removed_tags:removed,removed_execution_bytes:bytes,files:[...new Set(found)]})}`);
}
