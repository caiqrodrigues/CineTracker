import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r225.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v225.js'),'utf8'),readFile(resolve(dist,'app-v225.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r226-v120-final-authority-ui.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.20 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR226V120='final-dom-authority-no-legacy-listeners'",'exclusive-stat-selector-authoritative-modal','canonical-card-no-legacy-event-class','web-android-icon-only-equal-actions','data-ct120-watchlist','data-ct120-sort'])if(!patch.includes(must))throw new Error('Web 1.0.20 patch missing '+must);
if(!js.includes("const REVISION='r225-official-1.0.19';"))throw new Error('Web 1.0.20 requires r225 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.20 boot point missing');
js=once(js,"const REVISION='r225-official-1.0.19';","const REVISION='r226-official-1.0.20';",'revision');
js=once(js,"window.__ctWebBuild='1.0.19';window.__ctOfficialVersion='1.0.19';","window.__ctWebBuild='1.0.20';window.__ctOfficialVersion='1.0.20';",'identity');
js=js.replaceAll('CineTracker • v1.0.19','CineTracker • v1.0.20').replaceAll("JSON.stringify({version:'1.0.19',revision:REVISION","JSON.stringify({version:'1.0.20',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r225-official-1.0.19','r226-official-1.0.20').replaceAll('app-v225.js','app-v226.js').replaceAll('app-v225.css','app-v226.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.20-r226';").replaceAll('app-v225.js','app-v226.js').replaceAll('app-v225.css','app-v226.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v226.js'),js,'utf8'),writeFile(resolve(dist,'app-v226.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.20',revision:'r226-official-1.0.20',base:'r225-official-1.0.19',watchlist:'exclusive-final-authority',sports:'canonical-final-authority-web-android',foryou_buttons:'icon-only-equal-web-android',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v225.js'),{force:true}),rm(resolve(dist,'app-v225.css'),{force:true})]);
console.log('WEB_1_0_20_READY authority=final watchlist=exclusive sports=canonical foryou=icon-only');
