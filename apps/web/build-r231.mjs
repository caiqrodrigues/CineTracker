import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r227.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v227.js'),'utf8'),readFile(resolve(dist,'app-v227.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r231-v122-web-final.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`r231 expected one ${l}, found ${n}`);return s.replace(a,b)};
if(!patch.includes("window.__ctR231V122 = 'final-web-only-authority'"))throw new Error('r231 marker missing');
const oldSync="let timer=0;function sync121(){clearTimeout(timer);timer=setTimeout(()=>{void syncWlCounts121();discover121();statsToggle121();sports121()},45)}";
if(js.includes(oldSync))js=js.replace(oldSync,"let timer=0;function sync121(){}");
js=once(js,"const REVISION='r227-official-1.0.21';","const REVISION='r231-official-1.0.22';",'revision');
js=once(js,"window.__ctWebBuild='1.0.21';window.__ctOfficialVersion='1.0.21';","window.__ctWebBuild='1.0.22';window.__ctOfficialVersion='1.0.22';",'identity');
js=js.replaceAll('CineTracker • v1.0.21','CineTracker • v1.0.22').replaceAll("JSON.stringify({version:'1.0.21',revision:REVISION","JSON.stringify({version:'1.0.22',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r227-official-1.0.21','r231-official-1.0.22').replaceAll('app-v227.js','app-v231.js').replaceAll('app-v227.css','app-v231.css');
sw=sw.replace(/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/,"const CACHE='ct-web-1.0.22-r231';").replaceAll('app-v227.js','app-v231.js').replaceAll('app-v227.css','app-v231.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'app-v231.js'),js),writeFile(resolve(dist,'app-v231.css'),css),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.22',revision:'r231-official-1.0.22',base:'r227-official-1.0.21',authority:'final-web-only-authority',generated_at:new Date().toISOString()},null,2))
]);
await Promise.all([rm(resolve(dist,'app-v227.js'),{force:true}),rm(resolve(dist,'app-v227.css'),{force:true})]);
console.log('WEB_1_0_22_R231_READY');