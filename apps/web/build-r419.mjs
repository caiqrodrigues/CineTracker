import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r418.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v418.js'),'utf8'),readFile(resolve(dist,'app-v418.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r419-f1-owner-bind.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r419 forbidden '+bad);
for(const need of ['window.__ctR419Marker','toggleF1Session311','openRace311','window.__ctR418?.toggleF1'])if(!runtime.includes(need))throw new Error('r419 missing '+need);
js=js.replace("window.__ctWebBuild='1.0.209';window.__ctOfficialVersion='1.0.209';","window.__ctWebBuild='1.0.210';window.__ctOfficialVersion='1.0.210';")
     .replace("const REVISION='r418-official-1.0.209';","const REVISION='r419-official-1.0.210';")
     .replace("const version='1.0.209',revision='r418-official-1.0.209';","const version='1.0.210',revision='r419-official-1.0.210';")
     .replace('boot();',runtime+'\nboot();');
html=html.replaceAll('app-v418.js','app-v419.js').replaceAll('app-v418.css','app-v419.css').replaceAll('v1.0.209','v1.0.210').replaceAll('r418-official-1.0.209','r419-official-1.0.210');
sw=sw.replaceAll('ct-web-1.0.209-r418','ct-web-1.0.210-r419').replaceAll('app-v418.js','app-v419.js').replaceAll('app-v418.css','app-v419.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.210',revision:'r419-official-1.0.210',base:'r418+r419-f1-owner-bind',scope:'r418-hard-fix+f1-legacy-capture-owner-bind',f1:'legacy r311 capture handler is rebound to the r418 media_id 865 series episode writer before user interaction',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v419.js'),js),writeFile(resolve(dist,'app-v419.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v418.js'),{force:true}),rm(resolve(dist,'app-v418.css'),{force:true})]);
console.log('WEB_R419_READY');
