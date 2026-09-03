import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r198.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v198.js'),'utf8'),readFile(resolve(dist,'app-v198.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r199-rewatch-favorites-sports.js'),'utf8')
]);
if(!js.includes("const REVISION='r198-real-minimal-filters';"))throw new Error('r199 requires r198 base');
for(const m of [
  "window.__ctR199Web='rewatch-favorites-sports-navigation';",
  "window.__ctR199Rewatch='persistent-2x-3x-4x-no-disable';",
  "window.__ctR199Favorites='view-more-opens-movie-series-person';",
  "window.__ctR199Sports='remove-status-statistics-summary-card';",
  "window.__ctR199Discover='preserve-top10-own-renderer-horizontal-single-row';"
])if(!patch.includes(m))throw new Error('r199 patch missing '+m);
if(!js.includes('ctR180RenderTop10'))throw new Error('r199 requires isolated Top10 renderer');
if(!js.includes('\nboot();'))throw new Error('r199 insertion point missing');
js=js.replace("const REVISION='r198-real-minimal-filters';","const REVISION='r199-rewatch-favorites-sports';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r198-real-minimal-filters','r199-rewatch-favorites-sports').replaceAll('app-v198.js','app-v199.js').replaceAll('app-v198.css','app-v199.css');
sw=sw.replaceAll('r198-real-minimal-filters','r199-rewatch-favorites-sports').replaceAll('app-v198.js','app-v199.js').replaceAll('app-v198.css','app-v199.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v199.js'),js,'utf8'),writeFile(resolve(dist,'app-v199.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r199-rewatch-favorites-sports',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v198.js'),{force:true}),rm(resolve(dist,'app-v198.css'),{force:true})]);
console.log('WEB_R199_READY rewatch=unbounded-counter favorites=detail-navigation sports=status-card-removed discover=top10-isolated-horizontal');
