import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r431.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v431.js'),'utf8'),
 readFile(resolve(dist,'app-v431.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r432-discover-foryou-stable.js'),'utf8')
]);
const strip=(source,start,next)=>{
 const a=source.indexOf(start);if(a<0)return source;
 const b=source.indexOf(next,a+start.length);if(b<0)throw new Error('r432 missing end marker '+start);
 return source.slice(0,a)+source.slice(b);
};
const replaceRequired=(source,from,to)=>source.includes(from)?source.replace(from,to):source;
js=strip(js,'/* CineTracker Web 1.0.177 r386','/* CineTracker Web 1.0.184 r393');
js=replaceRequired(js,`const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(fy){try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}setTimeout(()=>enterForYou403(false),40);`,`const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(false){`, 'r403 for-you click');
js=replaceRequired(js,`const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(fy){try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}setTimeout(()=>enterForYou404(false),40);`,`const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(false){`, 'r404 for-you click');
js=replaceRequired(js,`const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(fy)for(const ms of [80,300,900,2200,5000,12000,30000,46000])setTimeout(()=>{bind();void loadForYou(false)},ms)`,`const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(false)for(const ms of [80,300,900,2200,5000,12000,30000,46000])setTimeout(()=>{bind();void loadForYou(false)},ms)`, 'r406 for-you timers');
js=replaceRequired(js,`const f=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(f)for(const ms of [0,100])setTimeout(()=>{bind();if(routeNow()==='discover')enterForYou(false)},ms)`,`const f=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(false)for(const ms of [0,100])setTimeout(()=>{bind();if(routeNow()==='discover')enterForYou(false)},ms)`, 'r407/r408 for-you click');
js=replaceRequired(js,`const fy=t.closest('[data-ct319-tab="foryou"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterForYou397()}`,`const fy=t.closest('[data-ct319-tab="foryou"]');if(false){`, 'r397 for-you click');
js=replaceRequired(js,`if(isForYou()&&q('[data-ct388-foryou]')&&!q('[data-ct388-foryou] [data-media]')&&document.documentElement.dataset.ct397ForYou!=='loading')void loadForYou397(false)`,`if(false&&isForYou()&&q('[data-ct388-foryou]')&&!q('[data-ct388-foryou] [data-media]')&&document.documentElement.dataset.ct397ForYou!=='loading')void loadForYou397(false)`, 'r397 observer');
js+='\n'+runtime+'\n';
js=js.replaceAll('1.0.222','1.0.223').replaceAll('r431-official-1.0.222','r432-official-1.0.223');
html=html.replaceAll('app-v431.js','app-v432.js').replaceAll('app-v431.css','app-v432.css').replaceAll('v1.0.222','v1.0.223').replaceAll('r431-official-1.0.222','r432-official-1.0.223');
sw=sw.replaceAll('ct-web-1.0.222-r431','ct-web-1.0.223-r432').replaceAll('app-v431.js','app-v432.js').replaceAll('app-v431.css','app-v432.css');
css+='\\n/* CineTracker Web 1.0.223 r432 — Pra Você single owner; legacy refresh paths removed. */\\n';
const prev=JSON.parse(releaseRaw);
const release={...prev,version:'1.0.223',revision:'r432-official-1.0.223',base:'r431+r432-foryou-refresh-removal',scope:'discover-foryou-only',discover_foryou:'r309 sole renderer; obsolete refresh and legacy repaint paths removed',discover_actions:'Watchlist/Visto/Trocar owned by r309',home:'unchanged-r431',profile:'unchanged-r431',sports:'unchanged-r431',android:'unchanged'};
await Promise.all([writeFile(resolve(dist,'app-v432.js'),js),writeFile(resolve(dist,'app-v432.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v431.js'),{force:true}),rm(resolve(dist,'app-v431.css'),{force:true})]);
if(js.includes('location.reload(')||js.includes('router.refresh('))throw new Error('r432 forbidden page refresh survived');
for(const need of ['window.__ctR432','window.__ctR309','data-ct309-swap'])if(!js.includes(need))throw new Error('r432 missing '+need);
console.log('WEB_R432_READY');