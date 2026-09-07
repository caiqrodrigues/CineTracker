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
 readFile(resolve(root,'runtime-r210-v106-safe.js'),'utf8')
]);
for(const m of ["window.__ctR210='v106-scope-safe-runtime'",'data-ct106-rewatch-movie','data-ct106-rewatch-episode','data-ct106-history-rewatch','cinetracker-f1-v1','paintF1','ensureF1'])if(!patch.includes(m))throw new Error('Web 1.0.6 patch missing '+m);
for(const bad of ['ct104PaintF1=','ct104Blocked=','ct104MovieRewatch(','ct104EpisodeRewatch(','ct104Counts?.','ct104LoadCounts('])if(patch.includes(bad))throw new Error('Web 1.0.6 leaked private v104 symbol '+bad);
if(!js.includes('\nboot();'))throw new Error('Web 1.0.6 insertion point missing');
js=js.replace("window.__ctOfficialVersion='1.0.4';","window.__ctOfficialVersion='1.0.6';");
js=js.replaceAll('r208-official-1.0.4','r210-official-1.0.6').replaceAll('CineTracker • v1.0.4','CineTracker • v1.0.6');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r208-official-1.0.4','r210-official-1.0.6').replaceAll('app-v208.js','app-v210.js').replaceAll('app-v208.css','app-v210.css');
const swVersion=/const\s+VERSION\s*=\s*['"][^'"]+['"]\s*;/;if(!swVersion.test(sw))throw new Error('SW VERSION missing');sw=sw.replace(swVersion,"const VERSION='ct-web-1.0.6-r210';");
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v210.js'),js,'utf8'),writeFile(resolve(dist,'app-v210.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.6',revision:'r210-official-1.0.6',base:'1.0.4-r208',fixes:['scope-safe-boot','visible-rewatch-controls','f1-edge-v2','instant-route-feedback'],generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v208.js'),{force:true}),rm(resolve(dist,'app-v208.css'),{force:true})]);
console.log('WEB_1_0_6_READY revision=r210-official-1.0.6 base=r208 no-r209-overlay');