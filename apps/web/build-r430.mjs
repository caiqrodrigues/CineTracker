import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r429.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v429.js'),'utf8'),
 readFile(resolve(dist,'app-v429.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r430-discover-foryou-single-renderer.js'),'utf8')
]);
const removeRuntime=(source,startMarker,nextMarker)=>{
 const start=source.indexOf(startMarker);if(start<0)return source;
 const end=nextMarker?source.indexOf(nextMarker,start+startMarker.length):source.length;
 if(end<0)return source;
 return source.slice(0,start)+source.slice(end);
};
js=removeRuntime(js,'/* CineTracker Web 1.0.202 r411','/* CineTracker Web 1.0.203 r412');
js=removeRuntime(js,'/* CineTracker Web 1.0.218 r427','/* CineTracker Web 1.0.219 r428');
js=removeRuntime(js,'/* CineTracker Web 1.0.219 r428','/* CineTracker Web 1.0.220 r429');
js=removeRuntime(js,'/* CineTracker Web 1.0.220 r429',null);
js=js.replaceAll('1.0.220','1.0.221').replaceAll('r429-official-1.0.220','r430-official-1.0.221')+'\n'+runtime+'\n';
html=html.replaceAll('app-v429.js','app-v430.js').replaceAll('app-v429.css','app-v430.css').replaceAll('v1.0.220','v1.0.221').replaceAll('r429-official-1.0.220','r430-official-1.0.221');
sw=sw.replaceAll('ct-web-1.0.220-r429','ct-web-1.0.221-r430').replaceAll('app-v429.js','app-v430.js').replaceAll('app-v429.css','app-v430.css');
css+='\n/* CineTracker Web 1.0.221 r430 — Pra Você single renderer r309. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.221',revision:'r430-official-1.0.221',base:'r429+r430-single-foryou-renderer',scope:'discover-foryou-only',discover_foryou:'r309 is the sole renderer and action owner; r411/r427/r428/r429 recovery owners removed from the assembled web bundle',discover_actions:'Watchlist/Visto/Trocar rendered by r309',home:'unchanged-r429',profile:'unchanged-r429',sports:'unchanged-r429',android:'unchanged'};
await Promise.all([
 writeFile(resolve(dist,'app-v430.js'),js),
 writeFile(resolve(dist,'app-v430.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v429.js'),{force:true}),rm(resolve(dist,'app-v429.css'),{force:true})]);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r430 forbidden '+bad);
for(const need of ['window.__ctR430','window.__ctR309','ct309-swap','r309-single-renderer-no-recovery-loop'])if(!js.includes(need))throw new Error('r430 missing '+need);
for(const retired of ['/* CineTracker Web 1.0.202 r411','/* CineTracker Web 1.0.218 r427','/* CineTracker Web 1.0.219 r428','/* CineTracker Web 1.0.220 r429'])if(js.includes(retired))throw new Error('r430 retired runtime remains '+retired);
console.log('WEB_R430_READY');