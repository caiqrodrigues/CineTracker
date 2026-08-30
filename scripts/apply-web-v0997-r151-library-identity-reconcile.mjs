import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
const root=resolve(process.cwd()),source=resolve(root,'apps/web/patch-v151-v0997-library-identity-reconcile.js'),name='patch-v151-v0997-library-identity-reconcile.js',dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r151: '+msg)};
const js=await readFile(source,'utf8');
for(const marker of['ct-reconcile-library-user','requested_media_ids','tmdb-proxy','Sincronizar pendentes','Revalidar tudo'])must(js.includes(marker),`runtime marker missing ${marker}`);
execFileSync(process.execPath,['--check',source],{stdio:'pipe'});
for(const dir of dirs){
  await copyFile(source,resolve(dir,name));execFileSync(process.execPath,['--check',resolve(dir,name)],{stdio:'pipe'});
  const indexPath=resolve(dir,'index.html');let html=await readFile(indexPath,'utf8');
  html=html.replace(/<script src="\/patch-v151-v0997-library-identity-reconcile\.js(?:\?r\w+)?"><\/script>/g,'');
  const anchor='<script src="/patch-v150b-v0997-realtime-sync.js?r150b"></script>',tag='<script src="/patch-v151-v0997-library-identity-reconcile.js?r151"></script>';
  must(html.includes(anchor),'r150b anchor missing');html=html.replace(anchor,`${anchor}${tag}`);must(html.indexOf(tag)>html.indexOf(anchor),'r151 order invalid');await writeFile(indexPath,html,'utf8');
  const swPath=resolve(dir,'service-worker.js');let sw=await readFile(swPath,'utf8');sw=sw.replace(/ct-web-0\.99\.7-r(?:\d+\w*)/g,'ct-web-0.99.7-r151');await writeFile(swPath,sw,'utf8');
}
console.log('WEB_R151_APPLIED scope=seen+watchlist identity=safe-search cover=repair surrogate=blocked background=checkpointed');
await import('./test-web-v0997-r151-library-identity-reconcile.mjs');
