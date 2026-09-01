import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r177.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v177.js'),'utf8'),
  readFile(resolve(dist,'app-v177.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r178.js'),'utf8')
]);
if(!js.includes("const REVISION='r177-canonical-next-repaint';"))throw new Error('r178 requires r177 base');
if(!js.includes("window.__ctR177='canonical-next-episode-repaint';"))throw new Error('r178 requires r177 runtime');
if(!js.includes('\nboot();'))throw new Error('r178 insertion point missing');
js=js.replace("const REVISION='r177-canonical-next-repaint';","const REVISION='r178-stable-home-dom';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r177-canonical-next-repaint','r178-stable-home-dom').replaceAll('app-v177.js','app-v178.js').replaceAll('app-v177.css','app-v178.css');
sw=sw.replaceAll('r177-canonical-next-repaint','r178-stable-home-dom').replaceAll('app-v177.js','app-v178.js').replaceAll('app-v177.css','app-v178.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v178.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v178.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r178-stable-home-dom',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v177.js'),{force:true}),rm(resolve(dist,'app-v177.css'),{force:true})]);
console.log('WEB_R178_READY home=stable-dom global-repaint=false scroll-click-history=preserved');
