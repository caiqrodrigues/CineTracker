import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r172.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,style]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v172.js'),'utf8'),
  readFile(resolve(dist,'app-v172.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r173.js'),'utf8'),
  readFile(resolve(root,'r173.css'),'utf8')
]);
if(!js.includes("const REVISION='r172-home-episode-streaming-clean';"))throw new Error('r173 requires r172 base');
if(!js.includes("window.__ctR172='home-episode-meta-logical-seen-canonical-streamings-detail-frame';"))throw new Error('r173 requires r172 runtime');
if(!js.includes('\nboot();'))throw new Error('r173 insertion point missing');
js=js.replace("const REVISION='r172-home-episode-streaming-clean';","const REVISION='r173-watch-left-window';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+style+'\n';
html=html.replaceAll('r172-home-episode-streaming-clean','r173-watch-left-window').replaceAll('app-v172.js','app-v173.js').replaceAll('app-v172.css','app-v173.css');
sw=sw.replaceAll('r172-home-episode-streaming-clean','r173-watch-left-window').replaceAll('app-v172.js','app-v173.js').replaceAll('app-v172.css','app-v173.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v173.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v173.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r173-watch-left-window',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v172.js'),{force:true}),rm(resolve(dist,'app-v172.css'),{force:true})]);
console.log('WEB_R173_READY watch=left-window-under-poster');
