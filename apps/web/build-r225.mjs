import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r224.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v224.js'),'utf8'),readFile(resolve(dist,'app-v224.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r225-v119-watchlist-sports-ui.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.19 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR225V119='watchlist-authoritative-sort-details-sports-controls'",'full-rpc-counts-sort-detail-open','three-column-single-actionbar-no-duplicates','minimal-consistent-controls','cinetracker_watchlist_full_v119','data-ct119-watch-media'])if(!patch.includes(must))throw new Error('Web 1.0.19 patch missing '+must);
if(!js.includes("const REVISION='r224-official-1.0.18';"))throw new Error('Web 1.0.19 requires r224 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.19 boot point missing');
js=once(js,"const REVISION='r224-official-1.0.18';","const REVISION='r225-official-1.0.19';",'revision');
js=once(js,"window.__ctWebBuild='1.0.18';window.__ctOfficialVersion='1.0.18';","window.__ctWebBuild='1.0.19';window.__ctOfficialVersion='1.0.19';",'identity');
js=js.replaceAll('CineTracker • v1.0.18','CineTracker • v1.0.19').replaceAll("JSON.stringify({version:'1.0.18',revision:REVISION","JSON.stringify({version:'1.0.19',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r224-official-1.0.18','r225-official-1.0.19').replaceAll('app-v224.js','app-v225.js').replaceAll('app-v224.css','app-v225.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.19-r225';").replaceAll('app-v224.js','app-v225.js').replaceAll('app-v224.css','app-v225.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v225.js'),js,'utf8'),writeFile(resolve(dist,'app-v225.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.19',revision:'r225-official-1.0.19',base:'r224-official-1.0.18',watchlist:'authoritative-full-rpc-counts-sort-detail-open',sports:'web-three-column-single-actionbar-no-duplicates',buttons:'minimal-consistent-controls',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v224.js'),{force:true}),rm(resolve(dist,'app-v224.css'),{force:true})]);
console.log('WEB_1_0_19_READY watchlist=full-counts-sort-details sports=organized-buttons');
