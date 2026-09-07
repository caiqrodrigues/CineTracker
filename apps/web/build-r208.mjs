import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r205.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v205.js'),'utf8'),readFile(resolve(dist,'app-v205.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r208-v104-core.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.4 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const m of ["window.__ctR208='v104-authoritative-internal-runtime'",'cinetracker_rewatch_counts_v104','cinetracker_recommendation_memory_v101','cinetracker_recommendation_record_v101','cinetracker-f1-v1','ct104DecorateHistory','ct104EpisodeRewatch','ct104EnsureF1','ct104ScanShown'])if(!patch.includes(m))throw new Error('Web 1.0.4 core missing '+m);
if(!js.includes('\nboot();'))throw new Error('Web 1.0.4 internal insertion point missing');
js=once(js,"const REVISION='r205-official-1.0.1';","const REVISION='r208-official-1.0.4';",'revision');
js=once(js,"window.__ctWebBuild='1.0.1';window.__ctOfficialVersion='1.0.1';window.__ctRelease101='rewatch-movie-episode-plus-sports-summary-removal';","window.__ctWebBuild='1.0.4';window.__ctOfficialVersion='1.0.4';window.__ctRelease104='authoritative-internal-runtime';",'build identity');
js=once(js,'CineTracker • v1.0.1 • ${REVISION}','CineTracker • v1.0.4 • ${REVISION}','footer');
js=once(js,"JSON.stringify({version:'1.0.1',revision:REVISION","JSON.stringify({version:'1.0.4',revision:REVISION",'snapshot');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r205-official-1.0.1','r208-official-1.0.4').replaceAll('app-v205.js','app-v208.js').replaceAll('app-v205.css','app-v208.css');
const swVersion=/const\s+VERSION\s*=\s*['"][^'"]+['"]\s*;/;
if(!swVersion.test(sw))throw new Error('Web 1.0.4 service worker VERSION declaration missing');
sw=sw.replace(swVersion,"const VERSION='ct-web-1.0.4-r208';").replaceAll('r205-official-1.0.1','r208-official-1.0.4').replaceAll('app-v205.js','app-v208.js').replaceAll('app-v205.css','app-v208.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v208.js'),js,'utf8'),writeFile(resolve(dist,'app-v208.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.4',revision:'r208-official-1.0.4',runtime:'authoritative-internal-before-boot',rewatch:'history+movie+episode-shared-counts',recommendations:'persistent-no-repeat+watchlist-30d',sports:'f1-hub+summary-cleanup',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v205.js'),{force:true}),rm(resolve(dist,'app-v205.css'),{force:true})]);
console.log('WEB_1_0_4_READY runtime=internal-before-boot revision=r208-official-1.0.4 sw=ct-web-1.0.4-r208');
