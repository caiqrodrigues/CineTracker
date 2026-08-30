import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'apps/web/patch-v149-v0997-discover-contract.js');
const name='patch-v149-v0997-discover-contract.js';
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r149: '+msg)};

const sourceJs=await readFile(source,'utf8');
must(sourceJs.includes("['foryou','Pra você']"),'Pra você tab contract missing');
must(sourceJs.includes("const TYPES=[['all','Geral'],['movie','Filmes'],['tv','Séries']]"),'Geral/Filmes/Séries contract missing');
must(sourceJs.includes('stopImmediatePropagation()'),'single click authority missing');
execFileSync(process.execPath,['--check',source],{stdio:'pipe'});

for(const dir of dirs){
  const runtimePath=resolve(dir,name);
  await copyFile(source,runtimePath);
  execFileSync(process.execPath,['--check',runtimePath],{stdio:'pipe'});

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(/<script src="\/patch-v149-v0997-discover-contract\.js(?:\?r\d+)?"><\/script>/g,'');
  const tag='<script src="/patch-v149-v0997-discover-contract.js?r149"></script>';
  must(html.includes('</body>'),'index body anchor missing');
  html=html.replace('</body>',`${tag}</body>`);
  must(html.lastIndexOf(tag)>html.lastIndexOf('patch-v135-v0997-final-primary-authority.js'),'r149 must load after legacy Discover authority');
  must(html.includes('ct-r148-web-pc-android'),'r148 Web PC browser lock must survive');
  await writeFile(indexPath,html,'utf8');

  const swPath=resolve(dir,'service-worker.js');
  let sw=await readFile(swPath,'utf8');
  sw=sw.replace(/ct-web-0\.99\.7-r\d+/g,'ct-web-0.99.7-r149');
  await writeFile(swPath,sw,'utf8');
}

console.log('WEB_R149_APPLIED discover=single-authority foryou=daily+100%-new other-tabs=general+movies+series view=horizontal-carousel layout-outside-discover=unchanged');
await import('./test-web-v0997-r149-discover-contract.mjs');
