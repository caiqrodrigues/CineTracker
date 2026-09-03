import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r199.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v199.js'),'utf8'),readFile(resolve(dist,'app-v199.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r200-sports-search-cleanup.js'),'utf8')
]);
if(!js.includes("const REVISION='r199-rewatch-favorites-sports';"))throw new Error('r200 requires r199 base');
for(const m of [
  "window.__ctR200Web='sports-search-filter-right-central-time-profile-only';",
  "window.__ctR200Sports='search-filter-same-row-remove-central-time-from-sports-only';",
  'data-ct200-sports-search-row',
  'ct200-sports-filter-button',
  'central esportiva',
  'tempo esportivo'
])if(!patch.includes(m))throw new Error('r200 patch missing '+m);
if(!js.includes('\nboot();'))throw new Error('r200 insertion point missing');
js=js.replace("const REVISION='r199-rewatch-favorites-sports';","const REVISION='r200-sports-search-cleanup';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r199-rewatch-favorites-sports','r200-sports-search-cleanup').replaceAll('app-v199.js','app-v200.js').replaceAll('app-v199.css','app-v200.css');
sw=sw.replaceAll('r199-rewatch-favorites-sports','r200-sports-search-cleanup').replaceAll('app-v199.js','app-v200.js').replaceAll('app-v199.css','app-v200.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v200.js'),js,'utf8'),writeFile(resolve(dist,'app-v200.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r200-sports-search-cleanup',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v199.js'),{force:true}),rm(resolve(dist,'app-v199.css'),{force:true})]);
console.log('WEB_R200_READY sports=filter-right central-time=profile-only');
