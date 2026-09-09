import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r227.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v227.js'),'utf8'),readFile(resolve(dist,'app-v227.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r229-v122-web-consolidated.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.22 r229 expected one ${label}, found ${n}`);return s.replace(a,b)};
if(!patch.includes("window.__ctR229V122='final-web-authority-discover-sports-profile-no-legends'"))throw new Error('r229 marker missing');
if(!js.includes("const REVISION='r227-official-1.0.21';"))throw new Error('r229 requires r227 base');
// Keep r227 transport/auth functions, disable its recurring DOM authority completely.
const oldSync="let timer=0;function sync121(){clearTimeout(timer);timer=setTimeout(()=>{void syncWlCounts121();discover121();statsToggle121();sports121()},45)}";
if(js.includes(oldSync))js=js.replace(oldSync,"let timer=0;function sync121(){}");
js=once(js,"const REVISION='r227-official-1.0.21';","const REVISION='r229-official-1.0.22';",'revision');
js=once(js,"window.__ctWebBuild='1.0.21';window.__ctOfficialVersion='1.0.21';","window.__ctWebBuild='1.0.22';window.__ctOfficialVersion='1.0.22';",'identity');
js=js.replaceAll('CineTracker • v1.0.21','CineTracker • v1.0.22').replaceAll("JSON.stringify({version:'1.0.21',revision:REVISION","JSON.stringify({version:'1.0.22',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r229 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r227-official-1.0.21','r229-official-1.0.22').replaceAll('app-v227.js','app-v229.js').replaceAll('app-v227.css','app-v229.css');
sw=sw.replace(/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/,"const CACHE='ct-web-1.0.22-r229';").replaceAll('app-v227.js','app-v229.js').replaceAll('app-v227.css','app-v229.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v229.js'),js,'utf8'),writeFile(resolve(dist,'app-v229.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.22',revision:'r229-official-1.0.22',base:'r227-official-1.0.21',authority:'single-consolidated-web',discover:'aligned-cards+metadata+no-legends',sports:'single-actionbar',profile:'exact-watchlist+complete-modal',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v227.js'),{force:true}),rm(resolve(dist,'app-v227.css'),{force:true})]);
console.log('WEB_1_0_22_R229_READY authority=single discover=aligned+metadata sports=single-actionbar profile=exact+complete legends=removed');