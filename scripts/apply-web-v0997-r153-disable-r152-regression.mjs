import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const name='patch-v153-v0997-disable-r152-regression.js';
const source=resolve(root,'apps/web',name);
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r153: '+msg)};

for(const dir of dirs){
  await copyFile(source,resolve(dir,name));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(/<script src="\/patch-v152-v0997-sports-hub\.js(?:\?r\w+)?"><\/script>/g,'');
  html=html.replace(/<script src="\/patch-v153-v0997-disable-r152-regression\.js(?:\?r\w+)?"><\/script>/g,'');
  const anchor='<script src="/patch-v151-v0997-library-identity-reconcile.js?r151"></script>';
  const tag='<script src="/patch-v153-v0997-disable-r152-regression.js?r153"></script>';
  must(html.includes(anchor),'r151 anchor missing');
  html=html.replace(anchor,`${anchor}${tag}`);
  must(!html.includes('patch-v152-v0997-sports-hub.js'),'r152 script survived');
  must(html.includes('ct-r148-web-pc-android'),'r148 Web PC lock missing');
  await writeFile(indexPath,html,'utf8');

  const swPath=resolve(dir,'service-worker.js');
  let sw=await readFile(swPath,'utf8');
  sw=sw.replace(/ct-web-0\.99\.7-r(?:\d+\w*)/g,'ct-web-0.99.7-r153');
  await writeFile(swPath,sw,'utf8');
}

console.log('WEB_R153_APPLIED r152=disabled r151=restored sports-backend=preserved layout=unchanged cache=r153');
await import('./test-web-v0997-r153-disable-r152-regression.mjs');
