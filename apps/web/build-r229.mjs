import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r228.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v228.js'),'utf8'),
 readFile(resolve(dist,'app-v228.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r229-v123-sports-card-authority.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.23 expected one ${label}, found ${n}`);return s.replace(a,b)};
if(!patch.includes("window.__ctR229V123='sports-card-single-action-zone-no-floating-actions'"))throw new Error('Web 1.0.23 runtime marker missing');
if(!js.includes("const REVISION='r228-official-1.0.22';"))throw new Error('Web 1.0.23 requires r228 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.23 boot point missing');
const oldSports="function sports(){for(const grid of qa('.event-grid')){grid.classList.add('ct122-grid');for(const c of [...grid.children])card(c)}}";
if(!js.includes(oldSports))throw new Error('Web 1.0.23 could not neutralize r228 Sports authority');
js=js.replace(oldSports,'function sports(){}');
js=once(js,"const REVISION='r228-official-1.0.22';","const REVISION='r229-official-1.0.23';",'revision');
js=once(js,"window.__ctWebBuild='1.0.22';window.__ctOfficialVersion='1.0.22';","window.__ctWebBuild='1.0.23';window.__ctOfficialVersion='1.0.23';",'identity');
js=js.replaceAll('CineTracker • v1.0.22','CineTracker • v1.0.23').replaceAll("JSON.stringify({version:'1.0.22',revision:REVISION","JSON.stringify({version:'1.0.23',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r228-official-1.0.22','r229-official-1.0.23').replaceAll('app-v228.js','app-v229.js').replaceAll('app-v228.css','app-v229.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.23-r229';").replaceAll('app-v228.js','app-v229.js').replaceAll('app-v228.css','app-v229.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v229.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v229.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.23',revision:'r229-official-1.0.23',base:'r228-official-1.0.22',sports:'single-action-zone-no-floating-actions',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v228.js'),{force:true}),rm(resolve(dist,'app-v228.css'),{force:true})]);
console.log('WEB_1_0_23_READY sports=single-action-zone no-floating-actions r228-sports=neutralized');
