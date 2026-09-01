import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r178.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v178.js'),'utf8'),
  readFile(resolve(dist,'app-v178.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r179.js'),'utf8')
]);
if(!js.includes("const REVISION='r178-stable-home-dom';"))throw new Error('r179 requires r178 base');
if(!js.includes("window.__ctR178='stable-home-dom-no-repaint-loop';"))throw new Error('r179 requires r178 runtime');
if(!js.includes('\nboot();'))throw new Error('r179 insertion point missing');
js=js.replace("const REVISION='r178-stable-home-dom';","const REVISION='r179-home-target-card';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r178-stable-home-dom','r179-home-target-card').replaceAll('app-v178.js','app-v179.js').replaceAll('app-v178.css','app-v179.css');
sw=sw.replaceAll('r178-stable-home-dom','r179-home-target-card').replaceAll('app-v178.js','app-v179.js').replaceAll('app-v178.css','app-v179.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v179.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v179.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r179-home-target-card',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v178.js'),{force:true}),rm(resolve(dist,'app-v178.css'),{force:true})]);
console.log('WEB_R179_READY next-card=media-id history-duplicate-safe');
