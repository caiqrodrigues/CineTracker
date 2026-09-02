import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r197.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v197.js'),'utf8'),readFile(resolve(dist,'app-v197.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r198-minimal-filters-real.js'),'utf8')
]);
if(!js.includes("const REVISION='r197-minimal-filters';"))throw new Error('r198 requires r197 base');
for(const m of ["window.__ctR198Web='deterministic-real-filter-groups';",'tune-button-hides-real-filter-options','data-ct198-filter'])if(!patch.includes(m))throw new Error('r198 patch missing '+m);
if(!js.includes('\nboot();'))throw new Error('r198 insertion point missing');
js=js.replace("const REVISION='r197-minimal-filters';","const REVISION='r198-real-minimal-filters';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r197-minimal-filters','r198-real-minimal-filters').replaceAll('app-v197.js','app-v198.js').replaceAll('app-v197.css','app-v198.css');
sw=sw.replaceAll('r197-minimal-filters','r198-real-minimal-filters').replaceAll('app-v197.js','app-v198.js').replaceAll('app-v197.css','app-v198.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v198.js'),js,'utf8'),writeFile(resolve(dist,'app-v198.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r198-real-minimal-filters',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v197.js'),{force:true}),rm(resolve(dist,'app-v197.css'),{force:true})]);
console.log('WEB_R198_READY filters=real-groups-hidden-behind-tune stats-mode=not-added');
