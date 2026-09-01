import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r176.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v176.js'),'utf8'),
  readFile(resolve(dist,'app-v176.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r177.js'),'utf8')
]);
if(!js.includes("const REVISION='r176-first-unwatched-gap';"))throw new Error('r177 requires r176 base');
if(!js.includes("window.__ctR176='first-released-unwatched-gap-authority';"))throw new Error('r177 requires r176 authority');
if(!js.includes('\nboot();'))throw new Error('r177 insertion point missing');
js=js.replace("const REVISION='r176-first-unwatched-gap';","const REVISION='r177-canonical-next-repaint';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r176-first-unwatched-gap','r177-canonical-next-repaint').replaceAll('app-v176.js','app-v177.js').replaceAll('app-v176.css','app-v177.css');
sw=sw.replaceAll('r176-first-unwatched-gap','r177-canonical-next-repaint').replaceAll('app-v176.js','app-v177.js').replaceAll('app-v176.css','app-v177.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v177.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v177.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r177-canonical-next-repaint',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v176.js'),{force:true}),rm(resolve(dist,'app-v176.css'),{force:true})]);
console.log('WEB_R177_READY canonical-next=repaint-after-queue drawer-home=shared-first-unwatched');
