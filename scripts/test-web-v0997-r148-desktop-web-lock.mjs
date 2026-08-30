import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('r148 test: '+msg)};
const index=await readFile(resolve(root,'dist/index.html'),'utf8');
const nav=await readFile(resolve(root,'dist/patch-v143-v0997-nav-gate.js'),'utf8');
const primary=await readFile(resolve(root,'dist/patch-v143-v0997-primary-router.js'),'utf8');
const chain=await readFile(resolve(root,'scripts/apply-web-v0997-rich-movie-discover.mjs'),'utf8');

must(!chain.includes("await import('./apply-web-v0997-r146-device-responsive.mjs')"),'r146 device responsive bridge is still active');
must(chain.includes("await import('./apply-web-v0997-r148-desktop-web-lock.mjs')"),'r148 desktop Web lock is not in build chain');
must(index.includes('id="ct-r148-web-pc-android"'),'Web PC platform bootstrap missing');
must(index.includes("window.__ctWebPlatform='web-pc'"),'Web is not explicitly identified as Web PC');
must(index.includes("m.setAttribute('content','width=1280')"),'Android browser is not forced to desktop viewport');
must(index.includes('.app{min-height:100vh;display:grid;grid-template-columns:180px 1fr}'),'desktop sidebar layout contract missing');
must(index.includes('.sidebar{background:#0d0d0d'),'desktop sidebar source styling missing');
must(index.includes('@media(max-width:850px){.app{grid-template-columns:1fr}'),'original responsive CSS was unexpectedly rewritten');
for(const text of [index,nav,primary])must(!text.includes('(max-device-width:'),'r146 device-width media query survived');
must(primary.includes("try{nextHome=normalizeHomePayload147(await loadHome('cinetracker_home_live_v0997_r2',{}))}catch{}"),'preload rejection catch missing');
must(primary.includes("try{nextHome=normalizeHomePayload147(await rawHome('cinetracker_home_live_v0997_r2',{}))}catch{}"),'raw RPC recovery catch missing');
for(const asset of ['patch-v1196-v0997-persistent-preload.js','patch-v134c-v0997-deeplink-details.js','patch-v143-v0997-nav-gate.js','patch-v143-v0997-primary-router.js'])must(index.includes(`${asset}?r148`),`r148 cache bust missing: ${asset}`);

console.log('WEB_R148_TEST_OK web-pc=true android=desktop sidebar=present r146=disabled home=fallback-safe layout-source=unchanged');
