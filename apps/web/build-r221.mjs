import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r220.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v220.js'),'utf8'),readFile(resolve(dist,'app-v220.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r221-v115-watchlist-f1-sessions.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.15 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR221V115='watchlist-own-contract-f1-complete-sessions'","known-is-required-not-excluded-no-fresh-quality-memory-soft-fallback","practice+sprint+qualifying+race-merged-into-generic-sports",'window.__ctV115BuildWatchPools','window.__ctV115F1Sessions'])if(!patch.includes(must))throw new Error('Web 1.0.15 patch missing '+must);
if(!js.includes("const REVISION='r220-official-1.0.14';"))throw new Error('Web 1.0.15 requires r220 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.15 boot point missing');
js=once(js,"const REVISION='r220-official-1.0.14';","const REVISION='r221-official-1.0.15';",'revision');
js=once(js,"window.__ctWebBuild='1.0.14';window.__ctOfficialVersion='1.0.14';","window.__ctWebBuild='1.0.15';window.__ctOfficialVersion='1.0.15';",'identity');
js=js.replaceAll('CineTracker • v1.0.14','CineTracker • v1.0.15').replaceAll("JSON.stringify({version:'1.0.14',revision:REVISION","JSON.stringify({version:'1.0.15',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r220-official-1.0.14','r221-official-1.0.15').replaceAll('app-v220.js','app-v221.js').replaceAll('app-v220.css','app-v221.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.15-r221';").replaceAll('app-v220.js','app-v221.js').replaceAll('app-v220.css','app-v221.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v221.js'),js,'utf8'),writeFile(resolve(dist,'app-v221.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.15',revision:'r221-official-1.0.15',base:'r220-official-1.0.14',foryou:'watchlist-own-contract-known-allowed+soft-memory',sports:'generic-f1-weekend-sessions-practice-sprint-qualifying-race',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v220.js'),{force:true}),rm(resolve(dist,'app-v220.css'),{force:true})]);
console.log('WEB_1_0_15_READY watchlist=own-contract f1-sports=complete-weekend-sessions');
