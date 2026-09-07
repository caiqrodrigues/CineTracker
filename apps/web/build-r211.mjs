import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r208.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch,rewatch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v208.js'),'utf8'),
 readFile(resolve(dist,'app-v208.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r211-v107-behavior.js'),'utf8'),
 readFile(resolve(root,'runtime-r212-v107-rewatch-authority.js'),'utf8')
]);
for(const m of ["window.__ctR211='v107-behavior-authority'",'cinetracker_mark_watch_v0994','cinetracker_recommendation_state_v107','data-ct107-rewatch','ct-f1-v107','ct107:snapshot:'])if(!patch.includes(m))throw new Error('Web 1.0.7 runtime missing '+m);
for(const m of ["window.__ctR212='v107-direct-rewatch-authority'",'data-ct212-bound','cinetracker_mark_watch_v0994'])if(!rewatch.includes(m))throw new Error('Web 1.0.7 replay authority missing '+m);
if(patch.includes('cinetracker_mark_episode_v0994')||rewatch.includes('cinetracker_mark_episode_v0994'))throw new Error('Web 1.0.7 new runtimes must not call nonexistent episode RPC');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.7 insertion point missing');
js=js.replaceAll('r208-official-1.0.4','r211-official-1.0.7').replaceAll('CineTracker • v1.0.4','CineTracker • v1.0.7').replaceAll("window.__ctOfficialVersion='1.0.4'","window.__ctOfficialVersion='1.0.7'").replaceAll("window.__ctWebBuild='1.0.4'","window.__ctWebBuild='1.0.7'");
js=js.replace('\nboot();','\n'+patch+'\n'+rewatch+'\nboot();');
html=html.replaceAll('r208-official-1.0.4','r211-official-1.0.7').replaceAll('app-v208.js','app-v211.js').replaceAll('app-v208.css','app-v211.css');
const swVersion=/const\s+VERSION\s*=\s*['"][^'"]+['"]\s*;/;if(!swVersion.test(sw))throw new Error('SW VERSION missing');sw=sw.replace(swVersion,"const VERSION='ct-web-1.0.7-r211';");
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v211.js'),js,'utf8'),writeFile(resolve(dist,'app-v211.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.7',revision:'r211-official-1.0.7',base:'1.0.4-r208',behavior:['canonical-episode-rewatch','direct-rewatch-authority','visible-history-rewatch','authoritative-recommendation-state','instant-route-snapshot','standalone-f1-hub','sports-summary-only-removal'],generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v208.js'),{force:true}),rm(resolve(dist,'app-v208.css'),{force:true})]);
console.log('WEB_1_0_7_READY revision=r211-official-1.0.7 rewatch=r212');
