import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r370.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v370.js'),'utf8'),readFile(resolve(dist,'app-v370.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r371-home-tab-owner.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r371 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,
 "let homeLockUntil=0,homeUserScroll=false,homeTimers=[],episodeRun=0;",
 "let homeLockUntil=0,homeUserScroll=false,homeTimers=[],episodeRun=0;window.__ctR332CancelHomeAsync=()=>{episodeRun++;cancelHomeTimers332();return episodeRun};",
 'r332 async cancel hook');
js=once(js,"window.__ctWebBuild='1.0.161';window.__ctOfficialVersion='1.0.161';","window.__ctWebBuild='1.0.162';window.__ctOfficialVersion='1.0.162';",'version');
js=once(js,"const REVISION='r370-official-1.0.161';","const REVISION='r371-official-1.0.162';",'revision');
js=once(js,"const version='1.0.161',revision='r370-official-1.0.161';","const version='1.0.162',revision='r371-official-1.0.162';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v370.js','app-v371.js').replaceAll('app-v370.css','app-v371.css').replaceAll('v1.0.161','v1.0.162').replaceAll('r370-official-1.0.161','r371-official-1.0.162');
sw=sw.replaceAll('ct-web-1.0.161-r370','ct-web-1.0.162-r371').replaceAll('app-v370.js','app-v371.js').replaceAll('app-v370.css','app-v371.css');
css+='\n/* CineTracker Web 1.0.162 r371 — Home tab belongs only to explicit user selection. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.162',revision:'r371-official-1.0.162',base:'r370-production',scope:'home-tab-user-owned',home_tab_owner:'r371-user-click-only',home_tab_repaint:'preserve-user-selection-after-paintHome+ct275PaintHome+renderHome',home_tab_async_cancel:'AbortController+generation+r332-episodeRun-invalidation',home_tab_reset:'forbidden-after-user-selection',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v371.js'),js),writeFile(resolve(dist,'app-v371.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v370.js'),{force:true}),rm(resolve(dist,'app-v370.css'),{force:true})]);
console.log('WEB_R371_READY Home movies tab preserved across stale async repaints');