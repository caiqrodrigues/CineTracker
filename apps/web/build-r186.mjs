import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r185c.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch186,patch190,patch190b,patch191]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v185c.js'),'utf8'),
  readFile(resolve(dist,'app-v185c.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r186-shared.js'),'utf8'),
  readFile(resolve(root,'runtime-r190-web.js'),'utf8'),
  readFile(resolve(root,'runtime-r190b-web.js'),'utf8'),
  readFile(resolve(root,'runtime-r191-web.js'),'utf8')
]);
if(!js.includes("const REVISION='r185c-profile-discover-polish';"))throw new Error('r191 requires r185C Web base');
if(!js.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse';"))throw new Error('r191 requires r185C performance');
if(!js.includes("window.__ctR184GapPrompt='detect-skipped-released-episodes-before-manual-watch';"))throw new Error('r191 must preserve r184 gap prompt');
if(!patch186.includes("window.__ctR186='foryou-strict-quality-year-history-realtime';"))throw new Error('r191 requires r186 strict authority');
if(!patch190.includes("window.__ctR190Web = 'fast-state-actions-sports-profile';"))throw new Error('r191 requires r190 UI fixes');
if(!patch190b.includes("window.__ctR190BWeb='sports-only-global-search-guard';"))throw new Error('r191 requires r190b search guard');
if(!patch191.includes("window.__ctR191Web='nonblocking-authority-alias-filter-actions';"))throw new Error('r191 patch marker missing');
if(!js.includes('\nboot();'))throw new Error('r191 insertion point missing');
js=js.replace("const REVISION='r185c-profile-discover-polish';","const REVISION='r191-nonblocking-authority';");
js=js.replace('\nboot();','\n'+patch186+'\n'+patch190+'\n'+patch190b+'\n'+patch191+'\nboot();');
html=html.replaceAll('r185c-profile-discover-polish','r191-nonblocking-authority').replaceAll('app-v185c.js','app-v191.js').replaceAll('app-v185c.css','app-v191.css');
sw=sw.replaceAll('r185c-profile-discover-polish','r191-nonblocking-authority').replaceAll('app-v185c.js','app-v191.js').replaceAll('app-v185c.css','app-v191.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v191.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v191.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r191-nonblocking-authority',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v185c.js'),{force:true}),rm(resolve(dist,'app-v185c.css'),{force:true})]);
console.log('WEB_R191_READY r189=removed navigation=nonblocking foryou=alias-strict watchlist=seen+swap sports=isolated profile=fast detail=persisted-state');
