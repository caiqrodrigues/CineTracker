import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r203.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v203.js'),'utf8'),
  readFile(resolve(dist,'app-v203.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);

const once=(source,from,to,label)=>{
  const count=source.split(from).length-1;
  if(count!==1)throw new Error(`Web 1.0.0 expected exactly one ${label}, found ${count}`);
  return source.replace(from,to);
};

if(!js.includes("const REVISION='r203-discover-filter-search-right';"))throw new Error('Web 1.0.0 requires r203 functional base');
for(const preserved of ['single-filter-trigger-right-of-search-no-orphan','persistent-2x-3x-4x-no-disable','view-more-opens-movie-series-person','remove-standalone-duplicate-filter-events-up'])
  if(!js.includes(preserved))throw new Error('Web 1.0.0 lost preserved behavior '+preserved);

js=once(js,"const REVISION='r203-discover-filter-search-right';","const REVISION='r204-official-1.0.0';",'revision');
js=once(js,"window.__ctWebBuild='0.99.7';","window.__ctWebBuild='1.0.0';window.__ctOfficialVersion='1.0.0';",'Web build identity');
js=once(js,'CineTracker • v0.99.7 • ${REVISION}','CineTracker • v1.0.0 • ${REVISION}','visible footer version');
js=once(js,"JSON.stringify({version:'0.99.7',revision:REVISION","JSON.stringify({version:'1.0.0',revision:REVISION",'snapshot version');

html=html.replaceAll('r203-discover-filter-search-right','r204-official-1.0.0').replaceAll('app-v203.js','app-v204.js').replaceAll('app-v203.css','app-v204.css');
sw=sw.replaceAll('r203-discover-filter-search-right','r204-official-1.0.0').replaceAll('app-v203.js','app-v204.js').replaceAll('app-v203.css','app-v204.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v204.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v204.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.0',revision:'r204-official-1.0.0',runtime:'single-clean-runtime',base:'r203-discover-filter-search-right',status:'official',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v203.js'),{force:true}),rm(resolve(dist,'app-v203.css'),{force:true})]);
console.log('WEB_1_0_0_READY base=r203 identity=1.0.0 revision=r204-official-1.0.0');
