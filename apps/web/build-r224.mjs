import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r223.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v223.js'),'utf8'),readFile(resolve(dist,'app-v223.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r224-v118-foryou-affinity-profile-watchlist.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.18 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR224V118='foryou-affinity-profile-watchlist-render-authority'",'recent-watched+watchlist-weighted-affinity-independent-kinds','direct-r180-stat-renderer-buttons','no-unrelated-popularity-fill','data-ct118-watchlist'])if(!patch.includes(must))throw new Error('Web 1.0.18 patch missing '+must);
if(!js.includes("const REVISION='r223-official-1.0.17';"))throw new Error('Web 1.0.18 requires r223 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.18 boot point missing');
js=once(js,"const REVISION='r223-official-1.0.17';","const REVISION='r224-official-1.0.18';",'revision');
js=once(js,"window.__ctWebBuild='1.0.17';window.__ctOfficialVersion='1.0.17';","window.__ctWebBuild='1.0.18';window.__ctOfficialVersion='1.0.18';",'identity');
js=js.replaceAll('CineTracker • v1.0.17','CineTracker • v1.0.18').replaceAll("JSON.stringify({version:'1.0.17',revision:REVISION","JSON.stringify({version:'1.0.18',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r223-official-1.0.17','r224-official-1.0.18').replaceAll('app-v223.js','app-v224.js').replaceAll('app-v223.css','app-v224.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.18-r224';").replaceAll('app-v223.js','app-v224.js').replaceAll('app-v223.css','app-v224.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v224.js'),js,'utf8'),writeFile(resolve(dist,'app-v224.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.18',revision:'r224-official-1.0.18',base:'r223-official-1.0.17',foryou:'recent-watched+watchlist-affinity-no-unrelated-fill',profile:'direct-watchlist-stat-buttons',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v223.js'),{force:true}),rm(resolve(dist,'app-v223.css'),{force:true})]);
console.log('WEB_1_0_18_READY foryou=affinity-recent+watchlist profile=direct-stat-buttons');
