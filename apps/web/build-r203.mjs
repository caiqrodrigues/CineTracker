import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r202.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v202.js'),'utf8'),readFile(resolve(dist,'app-v202.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r203-discover-filter-search-row.js'),'utf8')
]);
if(!js.includes("const REVISION='r202-sports-single-filter';"))throw new Error('r203 requires r202 base');
for(const m of [
  "window.__ctR203Web='discover-filter-search-right-authoritative';",
  "window.__ctR203Discover='single-filter-trigger-right-of-search-no-orphan';",
  'ct203-discover-search-row','ct203-discover-filter-button','data-ct203-filter','row.appendChild(trigger)'
])if(!patch.includes(m))throw new Error('r203 patch missing '+m);
if(!js.includes('\nboot();'))throw new Error('r203 insertion point missing');
js=js.replace("const REVISION='r202-sports-single-filter';","const REVISION='r203-discover-filter-search-right';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r202-sports-single-filter','r203-discover-filter-search-right').replaceAll('app-v202.js','app-v203.js').replaceAll('app-v202.css','app-v203.css');
sw=sw.replaceAll('r202-sports-single-filter','r203-discover-filter-search-right').replaceAll('app-v202.js','app-v203.js').replaceAll('app-v202.css','app-v203.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v203.js'),js,'utf8'),writeFile(resolve(dist,'app-v203.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r203-discover-filter-search-right',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v202.js'),{force:true}),rm(resolve(dist,'app-v202.css'),{force:true})]);
console.log('WEB_R203_READY discover=filter-right-of-search sports=r202-preserved');
