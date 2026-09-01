import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r175.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v175.js'),'utf8'),
  readFile(resolve(dist,'app-v175.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r176.js'),'utf8')
]);
if(!js.includes("const REVISION='r175-bingers-next-episode';"))throw new Error('r176 requires r175 base');
if(!js.includes("window.__ctR175='bingers-next-episode-instant-handoff';"))throw new Error('r176 requires r175 authority');
if(!js.includes('\nboot();'))throw new Error('r176 insertion point missing');
js=js.replace("const REVISION='r175-bingers-next-episode';","const REVISION='r176-first-unwatched-gap';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r175-bingers-next-episode','r176-first-unwatched-gap').replaceAll('app-v175.js','app-v176.js').replaceAll('app-v175.css','app-v176.css');
sw=sw.replaceAll('r175-bingers-next-episode','r176-first-unwatched-gap').replaceAll('app-v175.js','app-v176.js').replaceAll('app-v175.css','app-v176.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v176.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v176.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r176-first-unwatched-gap',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v175.js'),{force:true}),rm(resolve(dist,'app-v175.css'),{force:true})]);
console.log('WEB_R176_READY next=first-released-unwatched gap-safe=true unwatch=rewind queue=6');
