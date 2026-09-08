import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r219.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v219.js'),'utf8'),readFile(resolve(dist,'app-v219.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r220-v114-watchlist-stats-icons.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.14 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR220V114='watchlist-enrichment-inplace-add-stats-unified-icons'","tmdb-enriched-before-strict-filter","fresh-card-add-replaces-in-place-like-swap","web-main-plus-sports-collapse-together-icon-only","icon-only-collapse-preserve-grid",'cinetracker_recommendation_record_v113','data-ct114-stats-group','ct114-collapse-icon'])if(!patch.includes(must))throw new Error('Web 1.0.14 patch missing '+must);
if(!js.includes("const REVISION='r219-official-1.0.13';"))throw new Error('Web 1.0.14 requires r219 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.14 boot point missing');
js=once(js,"const REVISION='r219-official-1.0.13';","const REVISION='r220-official-1.0.14';",'revision');
js=once(js,"window.__ctWebBuild='1.0.13';window.__ctOfficialVersion='1.0.13';","window.__ctWebBuild='1.0.14';window.__ctOfficialVersion='1.0.14';",'identity');
js=js.replaceAll('CineTracker • v1.0.13','CineTracker • v1.0.14').replaceAll("JSON.stringify({version:'1.0.13',revision:REVISION","JSON.stringify({version:'1.0.14',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r219-official-1.0.13','r220-official-1.0.14').replaceAll('app-v219.js','app-v220.js').replaceAll('app-v219.css','app-v220.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.14-r220';").replaceAll('app-v219.js','app-v220.js').replaceAll('app-v219.css','app-v220.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v220.js'),js,'utf8'),writeFile(resolve(dist,'app-v220.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.14',revision:'r220-official-1.0.14',base:'r219-official-1.0.13',foryou:'watchlist-tmdb-enrichment+immediate-fresh-replacement',profile:'web-stats+sports-stats-unified-collapse',controls:'icon-only-stats+f1',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v219.js'),{force:true}),rm(resolve(dist,'app-v219.css'),{force:true})]);
console.log('WEB_1_0_14_READY watchlist=enriched+replace stats=unified-icons f1=icon-only');
