import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r226.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v226.js'),'utf8'),readFile(resolve(dist,'app-v226.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r227-v121-stable-web-authority.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.21 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR227V121='stable-web-authority-auth-refresh-no-premature-empty'",'no-premature-empty-final-settle','direct-grid-children-canonical-actions','icon-only-stable-after-legacy-toggle','jwt-refresh-retry-dashboard-fallback'])if(!patch.includes(must))throw new Error('Web 1.0.21 patch missing '+must);
if(!js.includes("const REVISION='r226-official-1.0.20';"))throw new Error('Web 1.0.21 requires r226 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.21 boot point missing');
js=once(js,"const REVISION='r226-official-1.0.20';","const REVISION='r227-official-1.0.21';",'revision');
js=once(js,"window.__ctWebBuild='1.0.20';window.__ctOfficialVersion='1.0.20';","window.__ctWebBuild='1.0.21';window.__ctOfficialVersion='1.0.21';",'identity');
js=js.replaceAll('CineTracker • v1.0.20','CineTracker • v1.0.21').replaceAll("JSON.stringify({version:'1.0.20',revision:REVISION","JSON.stringify({version:'1.0.21',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r226-official-1.0.20','r227-official-1.0.21').replaceAll('app-v226.js','app-v227.js').replaceAll('app-v226.css','app-v227.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.21-r227';").replaceAll('app-v226.js','app-v227.js').replaceAll('app-v226.css','app-v227.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v227.js'),js,'utf8'),writeFile(resolve(dist,'app-v227.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.21',revision:'r227-official-1.0.21',base:'r226-official-1.0.20',watchlist:'auth-refresh-retry-fallback',sports:'direct-grid-final-actions',stats:'stable-icon-toggle',foryou:'no-premature-empty',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v226.js'),{force:true}),rm(resolve(dist,'app-v226.css'),{force:true})]);
console.log('WEB_1_0_21_READY auth=refresh-retry sports=canonical stats=icon-only foryou=no-premature-empty');
