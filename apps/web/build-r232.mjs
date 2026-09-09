import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r229.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v229.js'),'utf8'),
 readFile(resolve(dist,'app-v229.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r232-v124-web-final.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.24 expected one ${label}, found ${n}`);return s.replace(a,b)};
if(!patch.includes("window.__ctR232V124='final-web-consolidation-preserve-v123-sports'"))throw new Error('Web 1.0.24 runtime marker missing');
if(!js.includes("const REVISION='r229-official-1.0.23';"))throw new Error('Web 1.0.24 requires r229/1.0.23 base');
if(!js.includes("window.__ctR229V123='sports-card-single-action-zone-no-floating-actions'"))throw new Error('Web 1.0.24 must preserve 1.0.23 Sports authority');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.24 boot point missing');
const oldWatchSelector="e.target.closest?.('[data-ct122-watchlist]')";
if((js.split(oldWatchSelector).length-1)!==1)throw new Error('Web 1.0.24 expected one legacy Watchlist click selector');
js=js.replace(oldWatchSelector,"e.target.closest?.('[data-ct122-watchlist-disabled]')");
js=once(js,"const REVISION='r229-official-1.0.23';","const REVISION='r232-official-1.0.24';",'revision');
js=once(js,"window.__ctWebBuild='1.0.23';window.__ctOfficialVersion='1.0.23';","window.__ctWebBuild='1.0.24';window.__ctOfficialVersion='1.0.24';",'identity');
js=js.replaceAll('CineTracker • v1.0.23','CineTracker • v1.0.24').replaceAll("JSON.stringify({version:'1.0.23',revision:REVISION","JSON.stringify({version:'1.0.24',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r229-official-1.0.23','r232-official-1.0.24').replaceAll('app-v229.js','app-v232.js').replaceAll('app-v229.css','app-v232.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.24-r232';").replaceAll('app-v229.js','app-v232.js').replaceAll('app-v229.css','app-v232.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v232.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v232.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.24',revision:'r232-official-1.0.24',base:'r229-official-1.0.23',discover:'semantic-empty+year-genres+stable-actions',profile:'same-renderable-rows-for-count-and-modal',sports:'preserve-v123-single-action-zone',authority:'final-web-consolidation-preserve-v123-sports',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v229.js'),{force:true}),rm(resolve(dist,'app-v229.css'),{force:true})]);
console.log('WEB_1_0_24_READY discover=semantic+metadata profile=exact+complete-modal sports=v123-preserved');
