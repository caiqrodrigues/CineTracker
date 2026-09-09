import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r237.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v237.js'),'utf8'),
  readFile(resolve(dist,'app-v237.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r238-real-profile-renderer.js'),'utf8')
]);
if(!js.includes("const REVISION='r237-official-1.0.29';"))throw new Error('r238 requires r237 base');
if(!js.includes('function ctR180ProfileStats'))throw new Error('r238 requires the real r180 Profile producer');
for(const marker of ["window.__ctR238='real-r180-profile-renderer'","ctR180ProfileStats=ctR238ProfileStats","profile237=function(){}","panel.dataset.ct238ProfileOrder="])if(!patch.includes(marker))throw new Error('r238 missing '+marker);
const sourceOrder=["ctR180StatCard('Episódios'","ctR180StatCard('Filmes'","ctR180StatCard('Séries Watchlist'","ctR180StatCard('Filmes Watchlist'","ctR180StatCard('Tempo em Séries'","ctR180StatCard('Tempo em Filmes'","ctR180StatCard('Tempo de série em Watchlist'","ctR180StatCard('Tempo de filme em Watchlist'","ctR180StatCard('Tempo total de tela'","ctR180StatCard('Tempo total em Watchlist'"];
let pos=-1;for(const token of sourceOrder){const next=patch.indexOf(token,pos+1);if(next<0)throw new Error('r238 physical Profile order missing '+token);pos=next}
js=js.replace("const REVISION='r237-official-1.0.29';","const REVISION='r238-official-1.0.30';")
     .replace("window.__ctWebBuild='1.0.29';window.__ctOfficialVersion='1.0.29';","window.__ctWebBuild='1.0.30';window.__ctOfficialVersion='1.0.30';")
     .replaceAll('CineTracker • v1.0.29','CineTracker • v1.0.30')
     .replaceAll("JSON.stringify({version:'1.0.29',revision:REVISION","JSON.stringify({version:'1.0.30',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r238 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r237-official-1.0.29','r238-official-1.0.30').replaceAll('app-v237.js','app-v238.js').replaceAll('app-v237.css','app-v238.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.30-r238';").replaceAll('app-v237.js','app-v238.js').replaceAll('app-v237.css','app-v238.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v238.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v238.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.30',revision:'r238-official-1.0.30',base:'r237-official-1.0.29',profile:'real-r180-producer-physical-order',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v237.js'),{force:true}),rm(resolve(dist,'app-v237.css'),{force:true})]);
console.log('WEB_1_0_30_READY r238 profile=real-r180-producer-physical-order');