import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r222.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v222.js'),'utf8'),readFile(resolve(dist,'app-v222.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r223-v117-profile-watchlist-sports-ui.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.17 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR223V117='profile-watchlist-drilldown-sports-organized-ui'",'stats-click-complete-watchlist-modal','four-column-structured-single-actionbar-deduped','cinetracker_profile_payload_v0997','ct117-event-actions'])if(!patch.includes(must))throw new Error('Web 1.0.17 patch missing '+must);
if(!js.includes("const REVISION='r222-official-1.0.16';"))throw new Error('Web 1.0.17 requires r222 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.17 boot point missing');
js=once(js,"const REVISION='r222-official-1.0.16';","const REVISION='r223-official-1.0.17';",'revision');
js=once(js,"window.__ctWebBuild='1.0.16';window.__ctOfficialVersion='1.0.16';","window.__ctWebBuild='1.0.17';window.__ctOfficialVersion='1.0.17';",'identity');
js=js.replaceAll('CineTracker • v1.0.16','CineTracker • v1.0.17').replaceAll("JSON.stringify({version:'1.0.16',revision:REVISION","JSON.stringify({version:'1.0.17',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r222-official-1.0.16','r223-official-1.0.17').replaceAll('app-v222.js','app-v223.js').replaceAll('app-v222.css','app-v223.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.17-r223';").replaceAll('app-v222.js','app-v223.js').replaceAll('app-v222.css','app-v223.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v223.js'),js,'utf8'),writeFile(resolve(dist,'app-v223.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.17',revision:'r223-official-1.0.17',base:'r222-official-1.0.16',profile:'watchlist-stats-click-complete-list',sports:'web-organized-four-column-single-actionbar-deduped',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v222.js'),{force:true}),rm(resolve(dist,'app-v222.css'),{force:true})]);
console.log('WEB_1_0_17_READY profile=watchlist-complete-drilldown sports=organized-single-actionbar');
