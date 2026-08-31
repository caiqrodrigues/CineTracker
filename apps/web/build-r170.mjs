import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r169.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,style]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v169.js'),'utf8'),readFile(resolve(dist,'app-v169.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r170.js'),'utf8'),readFile(resolve(root,'r170.css'),'utf8')
]);
if(!js.includes("const REVISION='r169-detail-nav-discover-activity';"))throw new Error('r170 requires r169 base');
if(!js.includes("window.__ctR169='detail-related-season-drawer-nav-fast-discover-activity';"))throw new Error('r170 requires r169 runtime');
if(!js.includes('\nboot();'))throw new Error('r170 insertion point missing');
js=js.replace("const REVISION='r169-detail-nav-discover-activity';","const REVISION='r170-reliability-actions-search';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+style+'\n';
html=html.replaceAll('r169-detail-nav-discover-activity','r170-reliability-actions-search').replaceAll('app-v169.js','app-v170.js').replaceAll('app-v169.css','app-v170.css');
sw=sw.replaceAll('r169-detail-nav-discover-activity','r170-reliability-actions-search').replaceAll('app-v169.js','app-v170.js').replaceAll('app-v169.css','app-v170.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v170.js'),js,'utf8'),writeFile(resolve(dist,'app-v170.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r170-reliability-actions-search',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v169.js'),{force:true}),rm(resolve(dist,'app-v169.css'),{force:true})]);
console.log('WEB_R170_READY reliability=retry+coalesce watchlist=media-kind person=bio+split+favorite profile=more related=mixed+rich sports=global-search');
