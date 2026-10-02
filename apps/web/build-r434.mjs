import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r433.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v433.js'),'utf8'),
 readFile(resolve(dist,'app-v433.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r434-discover-foryou-entry.js'),'utf8')
]);
js+='\n'+runtime+'\n';
js=js.replaceAll('1.0.224','1.0.225').replaceAll('r433-official-1.0.224','r434-official-1.0.225');
html=html.replaceAll('app-v433.js','app-v434.js').replaceAll('app-v433.css','app-v434.css').replaceAll('v1.0.224','v1.0.225').replaceAll('r433-official-1.0.224','r434-official-1.0.225');
sw=sw.replaceAll('ct-web-1.0.224-r433','ct-web-1.0.225-r434').replaceAll('app-v433.js','app-v434.js').replaceAll('app-v433.css','app-v434.css');
css+='\n/* CineTracker Web 1.0.225 r434 — Pra Você first-click owner fix. */\n';
const prev=JSON.parse(releaseRaw);
const release={...prev,version:'1.0.225',revision:'r434-official-1.0.225',base:'r433+r434-first-click-owner',scope:'discover-foryou-only',discover_foryou:'first Pra Você click sets discover state before r309 render',discover_actions:'Watchlist/Visto/Trocar remain owned by r309',home:'unchanged',profile:'unchanged',sports:'unchanged',android:'unchanged'};
await Promise.all([
 writeFile(resolve(dist,'app-v434.js'),js),
 writeFile(resolve(dist,'app-v434.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v433.js'),{force:true}),rm(resolve(dist,'app-v433.css'),{force:true})]);
if(!js.includes("window.__ctR434={version:'1.0.225'"))throw new Error('r434 runtime missing');
if(!js.includes("s.tab='foryou';s.type='all'"))throw new Error('r434 first-click state transition missing');
if(js.includes('window.location.reload(')||js.includes('router.refresh('))throw new Error('r434 forbidden refresh survived');
console.log('WEB_R434_READY');