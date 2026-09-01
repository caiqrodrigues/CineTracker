import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r184.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,extraCss]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v184.js'),'utf8'),
  readFile(resolve(dist,'app-v184.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r185a-shared.js'),'utf8'),
  readFile(resolve(root,'r185a-shared.css'),'utf8')
]);
if(!js.includes("const REVISION='r184-favorites-gap-prompt';"))throw new Error('r185A requires r184 Web base');
if(!js.includes("window.__ctR184GapPrompt='detect-skipped-released-episodes-before-manual-watch';"))throw new Error('r185A requires r184 gap prompt');
if(!js.includes("window.__ctR183='web-clean-headers-profile-reflow';"))throw new Error('r185A Web must preserve r183 layout');
if(!js.includes('\nboot();'))throw new Error('r185A insertion point missing');
js=js.replace("const REVISION='r184-favorites-gap-prompt';","const REVISION='r185a-instant-cache';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+extraCss+'\n';
html=html.replaceAll('r184-favorites-gap-prompt','r185a-instant-cache').replaceAll('app-v184.js','app-v185a.js').replaceAll('app-v184.css','app-v185a.css');
sw=sw.replaceAll('r184-favorites-gap-prompt','r185a-instant-cache').replaceAll('app-v184.js','app-v185a.js').replaceAll('app-v184.css','app-v185a.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v185a.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v185a.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r185a-instant-cache',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v184.js'),{force:true}),rm(resolve(dist,'app-v184.css'),{force:true})]);
console.log('WEB_R185A_READY cache=visual-only stale-while-revalidate fallback=r184');
