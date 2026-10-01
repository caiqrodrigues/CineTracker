import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r430.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v430.js'),'utf8'),
 readFile(resolve(dist,'app-v430.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r431-discover-foryou-stable.js'),'utf8')
]);
const start='/* CineTracker Web 1.0.221 r430';
const cut=js.indexOf(start);
if(cut<0)throw new Error('r431 missing r430 runtime');
js=js.slice(0,cut);
js=js.replace(/\\s*const recentP=Promise\\.resolve\\(S\\.loadRecent296\\?\\.\\(\\)\\)\\.catch\\(\\(\\)=>null\\);?/g,'');
js=js.replace(/const \\[a,fullWatch,freshParts\\]=await Promise\\.all\\(\\[authorityP,watchP,freshP,recentP\\.then\\(\\(\\)=>null\\)\\.then\\(\\)=>freshP\\]\\);/g,"const [a,fullWatch,freshParts]=await Promise.all([authorityP,watchP,freshP]);");
if(js.includes("const recentP=Promise.resolve(S.loadRecent296?.())"))throw new Error('r431 blocking recent promise survived');
js=js.replaceAll('1.0.220','1.0.222').replaceAll('r429-official-1.0.220','r431-official-1.0.222').replaceAll('1.0.221','1.0.222').replaceAll('r430-official-1.0.221','r431-official-1.0.222');
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v430.js','app-v431.js').replaceAll('app-v430.css','app-v431.css').replaceAll('v1.0.221','v1.0.222').replaceAll('r430-official-1.0.221','r431-official-1.0.222');
sw=sw.replaceAll('ct-web-1.0.221-r430','ct-web-1.0.222-r431').replaceAll('app-v430.js','app-v431.js').replaceAll('app-v430.css','app-v431.css');
css+='\n/* CineTracker Web 1.0.222 r431 — Pra Você stable owner; no automatic refresh. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.222',revision:'r431-official-1.0.222',base:'r430+r431-foryou-stable',scope:'discover-foryou-only',discover_foryou:'r309 sole renderer; loadRecent296 removed from blocking path; automatic data-changed/online refresh removed',discover_actions:'Watchlist/Visto/Trocar remain owned by r309',home:'unchanged-r430',profile:'unchanged-r430',sports:'unchanged-r430',android:'unchanged'};
await Promise.all([
 writeFile(resolve(dist,'app-v431.js'),js),
 writeFile(resolve(dist,'app-v431.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v430.js'),{force:true}),rm(resolve(dist,'app-v430.css'),{force:true})]);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r431 forbidden '+bad);
if(runtime.includes('cinetracker:data-changed')||runtime.includes("addEventListener('online'"))throw new Error('r431 automatic refresh survived');
for(const need of ['window.__ctR431','window.__ctR309','ct309-swap','r309-single-renderer-no-recovery-loop'])if(!js.includes(need))throw new Error('r431 missing '+need);
if(js.includes('window.__ctR430'))throw new Error('r430 owner survived');
console.log('WEB_R431_READY');
