import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r201.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v201.js'),'utf8'),readFile(resolve(dist,'app-v201.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r202-sports-single-filter.js'),'utf8')
]);
if(!js.includes("const REVISION='r201-sports-discover-filter';"))throw new Error('r202 requires r201 base');
for(const m of [
  "window.__ctR202Web='sports-single-filter-lift-events';",
  "window.__ctR202Sports='remove-standalone-duplicate-filter-events-up';",
  'ct200-sports-filter-button','ct202-events-up','panel.remove();','btn.remove();'
])if(!patch.includes(m))throw new Error('r202 patch missing '+m);
if(!js.includes('\nboot();'))throw new Error('r202 insertion point missing');
js=js.replace("const REVISION='r201-sports-discover-filter';","const REVISION='r202-sports-single-filter';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r201-sports-discover-filter','r202-sports-single-filter').replaceAll('app-v201.js','app-v202.js').replaceAll('app-v201.css','app-v202.css');
sw=sw.replaceAll('r201-sports-discover-filter','r202-sports-single-filter').replaceAll('app-v201.js','app-v202.js').replaceAll('app-v201.css','app-v202.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v202.js'),js,'utf8'),writeFile(resolve(dist,'app-v202.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r202-sports-single-filter',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v201.js'),{force:true}),rm(resolve(dist,'app-v201.css'),{force:true})]);
console.log('WEB_R202_READY sports=single-filter events=lifted');
