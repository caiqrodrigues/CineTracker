import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r185c.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v185c.js'),'utf8'),
  readFile(resolve(dist,'app-v185c.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r186-shared.js'),'utf8')
]);
if(!js.includes("const REVISION='r185c-profile-discover-polish';"))throw new Error('r186 requires r185C Web base');
if(!js.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse';"))throw new Error('r186 requires r185C performance');
if(!js.includes("window.__ctR184GapPrompt='detect-skipped-released-episodes-before-manual-watch';"))throw new Error('r186 must preserve r184 gap prompt');
if(!js.includes('\nboot();'))throw new Error('r186 insertion point missing');
js=js.replace("const REVISION='r185c-profile-discover-polish';","const REVISION='r186-foryou-strict-realtime';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r185c-profile-discover-polish','r186-foryou-strict-realtime').replaceAll('app-v185c.js','app-v186.js').replaceAll('app-v185c.css','app-v186.css');
sw=sw.replaceAll('r185c-profile-discover-polish','r186-foryou-strict-realtime').replaceAll('app-v185c.js','app-v186.js').replaceAll('app-v185c.css','app-v186.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v186.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v186.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r186-foryou-strict-realtime',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v185c.js'),{force:true}),rm(resolve(dist,'app-v185c.css'),{force:true})]);
console.log('WEB_R186_READY foryou=strict score=7.5 year=1991 history=watch_history realtime=watch_history+media_overrides');
