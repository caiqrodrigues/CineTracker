import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const epochName='patch-v154-v0997-runtime-epoch.js';
const finalName='patch-v154-v0997-runtime-final.js';
const intentSource=resolve(root,'apps/web/patch-v154-v0997-intent-preload.js');
const persistentSource=resolve(root,'apps/web/patch-v154-v0997-persistent-preload.js');
const epochSource=resolve(root,'apps/web',epochName);
const finalSource=resolve(root,'apps/web',finalName);
const must=(ok,msg)=>{if(!ok)throw new Error('r154: '+msg)};

for(const file of [intentSource,persistentSource,epochSource,finalSource])execFileSync(process.execPath,['--check',file],{stdio:'pipe'});

for(const dir of dirs){
  // Keep the historical filenames referenced by the old build, but replace their
  // physical runtime with one r154 implementation. This avoids another wrapper
  // layer while preserving the proven HTML/build anchors.
  const intentPath=resolve(dir,'patch-v1195-v0997-route-preload-core.js');
  const persistentPath=resolve(dir,'patch-v1196-v0997-persistent-preload.js');
  await copyFile(intentSource,intentPath);
  await copyFile(persistentSource,persistentPath);
  await copyFile(epochSource,resolve(dir,epochName));
  await copyFile(finalSource,resolve(dir,finalName));
  for(const file of [intentPath,persistentPath,resolve(dir,epochName),resolve(dir,finalName)])execFileSync(process.execPath,['--check',file],{stdio:'pipe'});

  const intent=await readFile(intentPath,'utf8');
  const persistent=await readFile(persistentPath,'utf8');
  must(intent.includes("__ct0997IntentPreload154='r154-intent-only'"),'intent preloader marker missing');
  must(!intent.includes('scheduleBackgroundWarm'),'legacy background Discover warmer survived');
  must(!intent.includes('window.fetch='),'intent preloader must not wrap fetch');
  must(!intent.includes('window.sbRpc='),'intent preloader must not wrap sbRpc');
  must(persistent.includes("DB_NAME='cinetracker-preload-r154'"),'r154 IndexedDB namespace missing');
  must(persistent.includes('SNAPSHOT_MAX_AGE=120000'),'bounded snapshot TTL missing');
  must(persistent.includes("HOME_R3='cinetracker_home_live_v0997_r3'"),'canonical Home r3 missing');
  must(persistent.includes('p_today:localDay()'),'local-day Home cache key missing');
  must(!persistent.includes("DB_NAME='cinetracker-preload-v1'"),'old IndexedDB namespace survived');
  must(!persistent.includes('24*60*60*1000'),'24h persistent cache survived');
  must(!persistent.includes('window.sbRpc=rpc1196'),'legacy sbRpc wrapper survived');
  must(!persistent.includes('for(const d of [0,120,420,900,1800,3200])'),'legacy six-stage warm survived');

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${epochName.replaceAll('.','\\.')}(?:\\?[^\"]*)?"></script>`,'g'),'');
  html=html.replace(new RegExp(`<script src="/${finalName.replaceAll('.','\\.')}(?:\\?[^\"]*)?"></script>`,'g'),'');
  must(html.includes('<body>'),'body anchor missing');
  html=html.replace('<body>',`<body><script src="/${epochName}"></script>`);
  html=html.replace('</body>',`<script src="/${finalName}"></script></body>`);

  // One physical epoch for every local runtime asset. Patches are transformed at
  // build time, therefore stable URLs are unsafe even when the semantic filename
  // did not change.
  html=html.replace(/(<script\b[^>]*\bsrc=")\/(?!\/)([^"?#]+\.js)(?:[?#][^"]*)?(")/gi,'$1/$2?ct=r154$3');
  html=html.replace(/(<link\b[^>]*\bhref=")\/(?!\/)([^"?#]+\.(?:css|webmanifest))(?:[?#][^"]*)?(")/gi,'$1/$2?ct=r154$3');

  const localScripts=[...html.matchAll(/<script\b[^>]*\bsrc="\/(?!\/)([^"]+\.js(?:\?[^"]*)?)"/gi)].map(m=>m[1]);
  must(localScripts.length>10,'unexpectedly few local scripts after build');
  must(localScripts.every(x=>x.endsWith('?ct=r154')),'a local JS asset escaped the r154 epoch');
  must(html.includes(`${epochName}?ct=r154`),'epoch gate not cache-busted');
  must(html.includes(`${finalName}?ct=r154`),'final marker not cache-busted');
  must(html.indexOf(`${epochName}?ct=r154`)<html.indexOf('patch-v143-v0997-nav-gate.js?ct=r154'),'epoch gate must run before navigation gate');
  must(!html.includes('patch-v152-v0997-sports-hub.js'),'r152 must remain disabled');
  must(html.includes('patch-v153-v0997-disable-r152-regression.js?ct=r154'),'r153 rollback must remain in chain');
  must(html.includes('ct-r148-web-pc-android'),'r148 Web PC lock missing');
  await writeFile(indexPath,html,'utf8');

  const swPath=resolve(dir,'service-worker.js');
  let sw=await readFile(swPath,'utf8');
  sw=sw.replace(/ct-web-0\.99\.7-r(?:\d+\w*)/g,'ct-web-0.99.7-r154');
  must(sw.includes("VERSION='ct-web-0.99.7-r154'"),'service worker epoch missing');
  must(!sw.includes("pathname.endsWith('.js')"),'service worker must not cache application JS');
  await writeFile(swPath,sw,'utf8');
}

console.log('WEB_R154_APPLIED epoch=all-local-assets preload=single+canonical snapshot<=2m background-warmer=off r153=preserved layout=unchanged');
await import('./test-web-v0997-r154-runtime-epoch-preload.mjs');
