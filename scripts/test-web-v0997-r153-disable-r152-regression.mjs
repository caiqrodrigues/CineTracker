import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Web r153 test: '+msg)};
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const sw=await readFile(resolve(root,'dist/service-worker.js'),'utf8');
const chain=await readFile(resolve(root,'scripts/apply-web-v0997-rich-movie-discover.mjs'),'utf8');
const runtime=await readFile(resolve(root,'dist/patch-v153-v0997-disable-r152-regression.js'),'utf8');

must(!html.includes('patch-v152-v0997-sports-hub.js'),'r152 still referenced by built index');
must(html.includes('<script src="/patch-v151-v0997-library-identity-reconcile.js?r151"></script><script src="/patch-v153-v0997-disable-r152-regression.js?r153"></script>'),'r153 not immediately after r151');
must(chain.includes("await import('./apply-web-v0997-r153-disable-r152-regression.mjs');"),'r153 chain missing');
must(!chain.includes("await import('./apply-web-v0997-r152-sports-hub.mjs');"),'r152 still active in chain');
must(runtime.includes("state?.observer?.disconnect"),'mixed-cache observer kill switch missing');
must(runtime.includes('[data-ct152-nav="sports"]'),'r152 nav cleanup missing');
must(html.includes('ct-r148-web-pc-android'),'Web PC lock missing');
must(sw.includes('ct-web-0.99.7-r153'),'service worker cache revision missing');

console.log('WEB_R153_TEST_OK r152=absent observer=neutralized r151=active r148=preserved cache=r153');
