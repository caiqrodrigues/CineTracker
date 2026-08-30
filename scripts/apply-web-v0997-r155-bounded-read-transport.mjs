import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const epochName='patch-v155-v0997-runtime-epoch.js';
const boundedName='patch-v155-v0997-bounded-read-transport.js';
const guardName='patch-v155-v0997-final-guard.js';
const epochSource=resolve(root,'apps/web',epochName);
const boundedSource=resolve(root,'apps/web',boundedName);
const guardSource=resolve(root,'apps/web',guardName);
const must=(ok,msg)=>{if(!ok)throw new Error('r155: '+msg)};

for(const file of [epochSource,boundedSource,guardSource])execFileSync(process.execPath,['--check',file],{stdio:'pipe'});

for(const dir of dirs){
  const historicalPreload=resolve(dir,'patch-v1196-v0997-persistent-preload.js');
  await copyFile(boundedSource,historicalPreload);
  await copyFile(epochSource,resolve(dir,epochName));
  await copyFile(guardSource,resolve(dir,guardName));
  for(const file of [historicalPreload,resolve(dir,epochName),resolve(dir,guardName)])execFileSync(process.execPath,['--check',file],{stdio:'pipe'});

  const preload=await readFile(historicalPreload,'utf8');
  must(preload.includes("__ct0997BoundedRead155='r155-direct-bounded-memory-only'"),'bounded read marker missing');
  must(preload.includes('const TIMEOUT_MS=5500'),'direct timeout missing');
  must(preload.includes('const FALLBACK_MS=2200'),'legacy fallback timeout missing');
  must(preload.includes('/rest/v1/rpc/'),'direct REST RPC path missing');
  must(preload.includes("window.__ct0997PersistentPreloadWarm=()=>Promise.resolve(false)"),'automatic warm must be disabled');
  must(!preload.includes('indexedDB.open'),'IndexedDB cannot be on the read path');
  must(!preload.includes('setInterval('),'polling warm loop survived');

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  for(const old of ['patch-v154-v0997-runtime-epoch.js','patch-v154-v0997-runtime-final.js',epochName,guardName]){
    const escaped=old.replaceAll('.','\\.');
    html=html.replace(new RegExp(`<script src="/${escaped}(?:\\?[^\"]*)?"></script>`,'g'),'');
  }
  must(html.includes('<body>'),'body anchor missing');
  html=html.replace('<body>',`<body><script src="/${epochName}"></script>`);
  html=html.replace('</body>',`<script src="/${guardName}"></script></body>`);

  html=html.replace(/(<script\b[^>]*\bsrc=")\/(?!\/)([^"?#]+\.js)(?:[?#][^"]*)?(")/gi,'$1/$2?ct=r155$3');
  html=html.replace(/(<link\b[^>]*\bhref=")\/(?!\/)([^"?#]+\.(?:css|webmanifest))(?:[?#][^"]*)?(")/gi,'$1/$2?ct=r155$3');

  const localScripts=[...html.matchAll(/<script\b[^>]*\bsrc="\/(?!\/)([^"]+\.js(?:\?[^"]*)?)"/gi)].map(m=>m[1]);
  must(localScripts.length>10,'unexpectedly few local scripts');
  must(localScripts.every(x=>x.endsWith('?ct=r155')),'a local JS asset escaped r155 epoch');
  must(html.includes(`${epochName}?ct=r155`),'r155 epoch not emitted');
  must(html.includes(`${guardName}?ct=r155`),'r155 final guard not emitted');
  must(!html.includes('patch-v154-v0997-runtime-epoch.js'),'r154 epoch tag survived');
  must(!html.includes('patch-v154-v0997-runtime-final.js'),'r154 final marker survived');
  must(!html.includes('patch-v152-v0997-sports-hub.js'),'r152 must remain disabled');
  must(html.includes('patch-v153-v0997-disable-r152-regression.js?ct=r155'),'r153 rollback missing');
  must(html.includes('ct-r148-web-pc-android'),'r148 Web PC lock missing');
  await writeFile(indexPath,html,'utf8');

  const swPath=resolve(dir,'service-worker.js');
  let sw=await readFile(swPath,'utf8');
  sw=sw.replace(/ct-web-0\.99\.7-r(?:\d+\w*)/g,'ct-web-0.99.7-r155');
  must(sw.includes("VERSION='ct-web-0.99.7-r155'"),'service worker epoch missing');
  await writeFile(swPath,sw,'utf8');
}

console.log('WEB_R155_APPLIED read=direct+bounded preload=memory-only warm=off watchdog=nav-scoped epoch=r155 layout=unchanged');
await import('./test-web-v0997-r155-bounded-read-transport.mjs');
