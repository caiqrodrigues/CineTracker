import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r174.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,style]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v174.js'),'utf8'),
  readFile(resolve(dist,'app-v174.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r175.js'),'utf8'),
  readFile(resolve(root,'r175.css'),'utf8')
]);
if(!js.includes("const REVISION='r174-instant-optimistic-motion';"))throw new Error('r175 requires r174 base');
if(!js.includes("window.__ctR174='optimistic-instant-motion-episode-toggle';"))throw new Error('r175 requires r174 authority');
if(!js.includes('\nboot();'))throw new Error('r175 insertion point missing');
js=js.replace("const REVISION='r174-instant-optimistic-motion';","const REVISION='r175-bingers-next-episode';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+style+'\n';
html=html.replaceAll('r174-instant-optimistic-motion','r175-bingers-next-episode').replaceAll('app-v174.js','app-v175.js').replaceAll('app-v174.css','app-v175.css');
sw=sw.replaceAll('r174-instant-optimistic-motion','r175-bingers-next-episode').replaceAll('app-v174.js','app-v175.js').replaceAll('app-v174.css','app-v175.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v175.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v175.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r175-bingers-next-episode',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v174.js'),{force:true}),rm(resolve(dist,'app-v174.css'),{force:true})]);
console.log('WEB_R175_READY motion=optimistic next=current+successor-prewarmed unwatch=true');
