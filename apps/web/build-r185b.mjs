import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r185a.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v185a.js'),'utf8'),
  readFile(resolve(dist,'app-v185a.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r185b-web.js'),'utf8')
]);
if(!js.includes("const REVISION='r185a-instant-cache';"))throw new Error('r185B requires r185A base');
if(!js.includes("window.__ctR185A='instant-visual-cache-safe-revalidate';"))throw new Error('r185B requires r185A cache');
if(!js.includes("window.__ctR184GapPrompt='detect-skipped-released-episodes-before-manual-watch';"))throw new Error('r185B must preserve r184');
if(!js.includes('\nboot();'))throw new Error('r185B insertion point missing');
js=js.replace("const REVISION='r185a-instant-cache';","const REVISION='r185b-web-prefetch';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r185a-instant-cache','r185b-web-prefetch').replaceAll('app-v185a.js','app-v185b.js').replaceAll('app-v185a.css','app-v185b.css');
sw=sw.replaceAll('r185a-instant-cache','r185b-web-prefetch').replaceAll('app-v185a.js','app-v185b.js').replaceAll('app-v185a.css','app-v185b.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v185b.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v185b.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r185b-web-prefetch',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v185a.js'),{force:true}),rm(resolve(dist,'app-v185a.css'),{force:true})]);
console.log('WEB_R185B_READY cached-shell=before-loader prefetch=profile-quick+sports+discover android=unchanged');
