import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r173.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,style]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v173.js'),'utf8'),
  readFile(resolve(dist,'app-v173.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r174.js'),'utf8'),
  readFile(resolve(root,'r174.css'),'utf8')
]);
if(!js.includes("const REVISION='r173-detail-left-window';"))throw new Error('r174 requires r173 base');
if(!js.includes("window.__ctR173='detail-left-windowed-hero';"))throw new Error('r174 requires r173 authority');
if(!js.includes('\nboot();'))throw new Error('r174 insertion point missing');
js=js.replace("const REVISION='r173-detail-left-window';","const REVISION='r174-instant-optimistic-motion';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+style+'\n';
html=html.replaceAll('r173-detail-left-window','r174-instant-optimistic-motion').replaceAll('app-v173.js','app-v174.js').replaceAll('app-v173.css','app-v174.css');
sw=sw.replaceAll('r173-detail-left-window','r174-instant-optimistic-motion').replaceAll('app-v173.js','app-v174.js').replaceAll('app-v173.css','app-v174.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v174.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v174.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r174-instant-optimistic-motion',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v173.js'),{force:true}),rm(resolve(dist,'app-v173.css'),{force:true})]);
console.log('WEB_R174_READY optimistic=ui-first motion=flip episode-toggle=watched-unwatched');
