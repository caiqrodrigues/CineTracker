import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r168.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch,style]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v168.js'),'utf8'),
  readFile(resolve(dist,'app-v168.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r169.js'),'utf8'),
  readFile(resolve(root,'r169.css'),'utf8')
]);

if(!js.includes("const REVISION='r168-profile-discover-sports-watched';"))throw new Error('r169 requires r168 base');
if(!js.includes("window.__ctR168='profile-resilient-discover-auth-sports-watched';"))throw new Error('r169 requires r168 runtime');
if(!js.includes('function ct166WatchlistPools'))throw new Error('r169 requires r166 Pra voce runtime');
if(!js.includes('\nboot();'))throw new Error('r169 insertion point missing');

js=js.replace("const REVISION='r168-profile-discover-sports-watched';","const REVISION='r169-detail-nav-discover-activity';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
css+='\n'+style+'\n';
html=html.replaceAll('r168-profile-discover-sports-watched','r169-detail-nav-discover-activity').replaceAll('app-v168.js','app-v169.js').replaceAll('app-v168.css','app-v169.css');
sw=sw.replaceAll('r168-profile-discover-sports-watched','r169-detail-nav-discover-activity').replaceAll('app-v168.js','app-v169.js').replaceAll('app-v168.css','app-v169.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v169.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v169.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r169-detail-nav-discover-activity',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v168.js'),{force:true}),rm(resolve(dist,'app-v168.css'),{force:true})]);
console.log('WEB_R169_READY detail=rich+related+season-drawer+graphs nav=back discover=preload profile=combined-15d sports=filter-ui');
