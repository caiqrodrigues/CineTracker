import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r200.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v200.js'),'utf8'),readFile(resolve(dist,'app-v200.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r201-sports-discover-filter.js'),'utf8')
]);
if(!js.includes("const REVISION='r200-sports-search-cleanup';"))throw new Error('r201 requires r200 base');
for(const m of [
  "window.__ctR201Web='sports-no-stats-no-empty-discover-filter-search-row';",
  "window.__ctR201Sports='remove-summary-time-empty-bars-profile-stats-only';",
  "window.__ctR201Discover='filter-trigger-right-of-global-search';",
  '.sports-summary-r159','[data-sports-time-banner]','ct201-discover-filter-button','search-global'
])if(!patch.includes(m))throw new Error('r201 patch missing '+m);
if(!js.includes('\nboot();'))throw new Error('r201 insertion point missing');
js=js.replace("const REVISION='r200-sports-search-cleanup';","const REVISION='r201-sports-discover-filter';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r200-sports-search-cleanup','r201-sports-discover-filter').replaceAll('app-v200.js','app-v201.js').replaceAll('app-v200.css','app-v201.css');
sw=sw.replaceAll('r200-sports-search-cleanup','r201-sports-discover-filter').replaceAll('app-v200.js','app-v201.js').replaceAll('app-v200.css','app-v201.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v201.js'),js,'utf8'),writeFile(resolve(dist,'app-v201.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r201-sports-discover-filter',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v200.js'),{force:true}),rm(resolve(dist,'app-v200.css'),{force:true})]);
console.log('WEB_R201_READY sports=no-stats-no-empty-bar discover=filter-right-of-search');
