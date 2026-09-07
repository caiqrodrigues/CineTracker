import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r208.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v208.js'),'utf8'),
 readFile(resolve(dist,'app-v208.css'),'utf8'),
 readFile(resolve(root,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r209-v105-fixes.js'),'utf8')
]);
for(const m of ["window.__ctR209='v105-video-corrections'",'data-ct105-rewatch-movie','cinetracker-f1-v1','ct104PaintF1=async function','current105','refreshCounts105'])if(!patch.includes(m))throw new Error('Web 1.0.5 patch missing '+m);
if(!js.includes('\nboot();'))throw new Error('Web 1.0.5 insertion point missing');
js=js.replace("window.__ctOfficialVersion='1.0.4';","window.__ctOfficialVersion='1.0.5';");
js=js.replaceAll('r208-official-1.0.4','r209-official-1.0.5').replaceAll('CineTracker • v1.0.4','CineTracker • v1.0.5');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r208-official-1.0.4','r209-official-1.0.5').replaceAll('app-v208.js','app-v209.js').replaceAll('app-v208.css','app-v209.css');
const swVersion=/const\s+VERSION\s*=\s*['"][^'"]+['"]\s*;/;if(!swVersion.test(sw))throw new Error('SW VERSION missing');sw=sw.replace(swVersion,"const VERSION='ct-web-1.0.5-r209';");
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v209.js'),js,'utf8'),writeFile(resolve(dist,'app-v209.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.5',revision:'r209-official-1.0.5',base:'1.0.4',fixes:['visible-rewatch-controls','episode-counts','recommendation-current-session','f1-edge-v2','instant-route-feedback'],generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v208.js'),{force:true}),rm(resolve(dist,'app-v208.css'),{force:true})]);
console.log('WEB_1_0_5_READY revision=r209-official-1.0.5');
