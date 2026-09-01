import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r185c.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch186,patch189]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v185c.js'),'utf8'),
  readFile(resolve(dist,'app-v185c.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r186-shared.js'),'utf8'),
  readFile(resolve(root,'runtime-r189-web.js'),'utf8')
]);
if(!js.includes("const REVISION='r185c-profile-discover-polish';"))throw new Error('r189 requires r185C Web base');
if(!js.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse';"))throw new Error('r189 requires r185C performance');
if(!js.includes("window.__ctR184GapPrompt='detect-skipped-released-episodes-before-manual-watch';"))throw new Error('r189 must preserve r184 gap prompt');
if(!patch186.includes("window.__ctR186='foryou-strict-quality-year-history-realtime';"))throw new Error('r189 requires r186 strict authority');
if(!patch189.includes("window.__ctR189Web = 'state-authority-cache-first-actions';"))throw new Error('r189 patch marker missing');
if(!js.includes('\nboot();'))throw new Error('r189 insertion point missing');
js=js.replace("const REVISION='r185c-profile-discover-polish';","const REVISION='r189-cache-first-actions';");
js=js.replace('\nboot();','\n'+patch186+'\n'+patch189+'\nboot();');
html=html.replaceAll('r185c-profile-discover-polish','r189-cache-first-actions').replaceAll('app-v185c.js','app-v189.js').replaceAll('app-v185c.css','app-v189.css');
sw=sw.replaceAll('r185c-profile-discover-polish','r189-cache-first-actions').replaceAll('app-v185c.js','app-v189.js').replaceAll('app-v185c.css','app-v189.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v189.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v189.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r189-cache-first-actions',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v185c.js'),{force:true}),rm(resolve(dist,'app-v185c.css'),{force:true})]);
console.log('WEB_R189_READY navigation=cache-first foryou=local-actions history=ttl-authority sports=stable-search');
