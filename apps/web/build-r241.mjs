import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r239.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v239.js'),'utf8'),readFile(resolve(dist,'app-v239.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r241-home-fast-metadata.js'),'utf8')
]);
for(const marker of ["window.__ctR241Home='fast-first-paint-episode-and-movie-metadata'","window.__ctR241Scope='home-only'","await preloadHome241()","movieMeta241(x)"])if(!patch.includes(marker))throw new Error('r241 missing '+marker);
for(const forbidden of ['Stuart','Lioness','WWE Raw'])if(patch.includes(forbidden))throw new Error('r241 cannot hardcode '+forbidden);
if(!js.includes("const REVISION='r239-official-1.0.31';"))throw new Error('r241 requires restored r239 base');
if(!js.includes('\nboot();'))throw new Error('r241 boot point missing');
js=js.replace("const REVISION='r239-official-1.0.31';","const REVISION='r241-official-1.0.32';")
 .replace("window.__ctWebBuild='1.0.31';window.__ctOfficialVersion='1.0.31';","window.__ctWebBuild='1.0.32';window.__ctOfficialVersion='1.0.32';")
 .replaceAll('CineTracker • v1.0.31','CineTracker • v1.0.32')
 .replaceAll("JSON.stringify({version:'1.0.31',revision:REVISION","JSON.stringify({version:'1.0.32',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r239-official-1.0.31','r241-official-1.0.32').replaceAll('app-v239.js','app-v241.js').replaceAll('app-v239.css','app-v241.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.32-r241';").replaceAll('app-v239.js','app-v241.js').replaceAll('app-v239.css','app-v241.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v241.js'),js,'utf8'),writeFile(resolve(dist,'app-v241.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.32',revision:'r241-official-1.0.32',base:'r239-official-1.0.31',scope:'home-only',home:'metadata-before-first-paint',movie_cards:'runtime+year+genres',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v239.js'),{force:true}),rm(resolve(dist,'app-v239.css'),{force:true})]);
console.log('WEB_1_0_32_READY r241 home-only');