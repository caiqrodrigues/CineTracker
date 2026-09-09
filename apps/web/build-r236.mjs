import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r235.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v235.js'),'utf8'),
 readFile(resolve(dist,'app-v235.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r236-current-video-scope.js'),'utf8')
]);
for(const marker of [
 "window.__ctR236='current-video-scope-authority'",
 "window.__ctR236Home='generic-aired-unwatched-hydration-no-title-hardcode'",
 "window.__ctR236Discover='restore-approved-layout-stable-routes'",
 "window.__ctR236Sports='standard-card-assistido-only'",
 "window.__ctR236F1='overview-calendar-next-drivers-constructors-last'"
])if(!patch.includes(marker))throw new Error('Web 1.0.28 patch missing '+marker);
for(const forbidden of ['Stuart','Lioness','WWE Raw'])if(patch.includes(forbidden))throw new Error('Web 1.0.28 Home cannot hardcode '+forbidden);
if(!js.includes("const REVISION='r235-official-1.0.27';"))throw new Error('Web 1.0.28 requires r235 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.28 boot point missing');
js=js.replace("const REVISION='r235-official-1.0.27';","const REVISION='r236-official-1.0.28';")
     .replace("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';","window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';")
     .replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
     .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r235-official-1.0.27','r236-official-1.0.28').replaceAll('app-v235.js','app-v236.js').replaceAll('app-v235.css','app-v236.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.28-r236';").replaceAll('app-v235.js','app-v236.js').replaceAll('app-v235.css','app-v236.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v236.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v236.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.28',revision:'r236-official-1.0.28',base:'r235-official-1.0.27',home:'generic-aired-unwatched-hydration-no-title-hardcode',discover:'restore-approved-layout-stable-routes',sports:'standard-card-assistido-only',f1:'overview-calendar-next-drivers-constructors-last',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v235.js'),{force:true}),rm(resolve(dist,'app-v235.css'),{force:true})]);
console.log('WEB_1_0_28_READY r236 current-video-scope');