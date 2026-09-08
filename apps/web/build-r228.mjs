import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r227.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v227.js'),'utf8'),readFile(resolve(dist,'app-v227.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r228-v122-web-final-feedback.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.22 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR228V122='discover-metadata-series-settle-sports-source-counts-exact'",'css-loading-preserves-empty-authority+year-genres','global-grid-direct-children-two-actions','exact-renderable-watchlist-counts'])if(!patch.includes(must))throw new Error('Web 1.0.22 patch missing '+must);
if(!js.includes("const REVISION='r227-official-1.0.21';"))throw new Error('Web 1.0.22 requires r227 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.22 boot point missing');
js=once(js,"const REVISION='r227-official-1.0.21';","const REVISION='r228-official-1.0.22';",'revision');
js=once(js,"window.__ctWebBuild='1.0.21';window.__ctOfficialVersion='1.0.21';","window.__ctWebBuild='1.0.22';window.__ctOfficialVersion='1.0.22';",'identity');
js=js.replaceAll('CineTracker • v1.0.21','CineTracker • v1.0.22').replaceAll("JSON.stringify({version:'1.0.21',revision:REVISION","JSON.stringify({version:'1.0.22',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r227-official-1.0.21','r228-official-1.0.22').replaceAll('app-v227.js','app-v228.js').replaceAll('app-v227.css','app-v228.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.22-r228';").replaceAll('app-v227.js','app-v228.js').replaceAll('app-v227.css','app-v228.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v228.js'),js,'utf8'),writeFile(resolve(dist,'app-v228.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.22',revision:'r228-official-1.0.22',base:'r227-official-1.0.21',discover:'metadata+semantic-loading',sports:'global-final-two-actions',profile:'exact-renderable-watchlist-counts',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v227.js'),{force:true}),rm(resolve(dist,'app-v227.css'),{force:true})]);
console.log('WEB_1_0_22_READY discover=metadata+series-settle sports=two-actions profile=exact-counts');
