import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r217.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v217.js'),'utf8'),readFile(resolve(dist,'app-v217.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r218-v112-foryou-f1-profile.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.12 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of [
 "window.__ctR217Consolidated='v111-r204-r243-single-release-authority'",
 "window.__ctR218V112='foryou-strict-f1-cors-profile-three-cards'",
 "window.__ctV112ForYou='fresh-never-known-never-repeat-watchlist-not-started-30d'",
 "window.__ctV112F1='browser-cors-preflight-v5'",
 "window.__ctV112Profile='three-complete-cards-mobile'",
 'cinetracker_recommendation_memory_v101','cinetracker_recommendation_record_v101','grid-auto-columns:calc((100% - 16px)/3)'
])if(!(js+patch).includes(must))throw new Error('Web 1.0.12 missing '+must);
if(!js.includes("const REVISION='r217-official-1.0.11';"))throw new Error('Web 1.0.12 requires r217/1.0.11 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.12 boot insertion point missing');
js=once(js,"const REVISION='r217-official-1.0.11';","const REVISION='r218-official-1.0.12';",'revision');
js=once(js,"window.__ctWebBuild='1.0.11';window.__ctOfficialVersion='1.0.11';window.__ctRelease111='consolidated-from-r204';","window.__ctWebBuild='1.0.12';window.__ctOfficialVersion='1.0.12';window.__ctRelease111='consolidated-from-r204';window.__ctRelease112='foryou-f1-profile';",'identity');
js=once(js,'CineTracker • v1.0.11 • ${REVISION}','CineTracker • v1.0.12 • ${REVISION}','footer');
if(js.includes("JSON.stringify({version:'1.0.0',revision:REVISION"))js=once(js,"JSON.stringify({version:'1.0.0',revision:REVISION","JSON.stringify({version:'1.0.12',revision:REVISION",'snapshot identity');
else if(js.includes("JSON.stringify({version:'1.0.11',revision:REVISION"))js=once(js,"JSON.stringify({version:'1.0.11',revision:REVISION","JSON.stringify({version:'1.0.12',revision:REVISION",'snapshot identity');
else throw new Error('Web 1.0.12 snapshot identity missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r217-official-1.0.11','r218-official-1.0.12').replaceAll('app-v217.js','app-v218.js').replaceAll('app-v217.css','app-v218.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('Web 1.0.12 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.12-r218';").replaceAll('app-v217.js','app-v218.js').replaceAll('app-v217.css','app-v218.css').replaceAll('r217-official-1.0.11','r218-official-1.0.12');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v218.js'),js,'utf8'),writeFile(resolve(dist,'app-v218.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.12',revision:'r218-official-1.0.12',base:'r217-official-1.0.11',foryou:'strict-library-exclusions+fresh-never-repeat+watchlist-30d',f1:'edge-v5-browser-cors',profile:'3-complete-cards-mobile',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v217.js'),{force:true}),rm(resolve(dist,'app-v217.css'),{force:true})]);
console.log('WEB_1_0_12_READY base=r217 foryou=strict f1=cors-v5 profile=three-complete');
