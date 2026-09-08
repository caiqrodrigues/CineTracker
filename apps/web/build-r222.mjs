import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r221.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v221.js'),'utf8'),readFile(resolve(dist,'app-v221.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r222-v116-final-dom-watchlist-f1-modal.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.16 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR222V116='final-dom-watchlist-direct-rpc-f1-favorite-modal'",'direct-auth-rpc-final-dom-no-old-filter-chain','ct165-favorite-modal-direct-f1-session-authority','cinetracker_watchlist_candidates_v116','data-ct116-f1'])if(!patch.includes(must)&&must!=='data-ct116-f1')throw new Error('Web 1.0.16 patch missing '+must);
if(!js.includes("const REVISION='r221-official-1.0.15';"))throw new Error('Web 1.0.16 requires r221 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.16 boot point missing');
js=once(js,"const REVISION='r221-official-1.0.15';","const REVISION='r222-official-1.0.16';",'revision');
js=once(js,"window.__ctWebBuild='1.0.15';window.__ctOfficialVersion='1.0.15';","window.__ctWebBuild='1.0.16';window.__ctOfficialVersion='1.0.16';",'identity');
js=js.replaceAll('CineTracker • v1.0.15','CineTracker • v1.0.16').replaceAll("JSON.stringify({version:'1.0.15',revision:REVISION","JSON.stringify({version:'1.0.16',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r221-official-1.0.15','r222-official-1.0.16').replaceAll('app-v221.js','app-v222.js').replaceAll('app-v221.css','app-v222.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.16-r222';").replaceAll('app-v221.js','app-v222.js').replaceAll('app-v221.css','app-v222.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v222.js'),js,'utf8'),writeFile(resolve(dist,'app-v222.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.16',revision:'r222-official-1.0.16',base:'r221-official-1.0.15',foryou:'direct-watchlist-rpc-final-dom',sports:'f1-favorite-modal-direct-session-authority',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v221.js'),{force:true}),rm(resolve(dist,'app-v221.css'),{force:true})]);
console.log('WEB_1_0_16_READY watchlist=final-dom-direct-rpc f1=favorite-modal-direct-sessions');
