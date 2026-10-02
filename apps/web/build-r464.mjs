import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r463.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v463.js'),'utf8'),readFile(resolve(dist,'app-v463.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r464-discover-foryou.js'),'utf8')
]);
const r449Click="if(tab&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const s=state();if(s){s.tab='foryou';s.type='all'}bind();void load(false)}";
if(!js.includes(r449Click))throw new Error('r464 missing r449 click owner');
js=js.replace(r449Click,"if(false&&tab&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const s=state();if(s){s.tab='foryou';s.type='all'}bind();void load(false)}");
const r461Click="if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterFY461();return}";
if(!js.includes(r461Click))throw new Error('r464 missing r461 click owner');
js=js.replace(r461Click,"if(false&&fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterFY461();return}");
const r461Auto="if(routeNow()==='discover'&&fyActive461())enterFY461();";
if(!js.includes(r461Auto))throw new Error('r464 missing r461 automatic owner');
js=js.replaceAll(r461Auto,"if(false&&routeNow()==='discover'&&fyActive461())enterFY461();");
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v463.js','app-v464.js').replaceAll('app-v463.css','app-v464.css').replaceAll('v1.0.253','v1.0.254').replaceAll('r463-official-1.0.253','r464-official-1.0.254');
sw=sw.replaceAll('app-v463.js','app-v464.js').replaceAll('app-v463.css','app-v464.css').replaceAll('ct-web-1.0.253-r463','ct-web-1.0.254-r464');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.254',revision:'r464-official-1.0.254',base:'r463+discover-foryou-visible-owner-v421',
 scope:'discover-foryou-only',
 discover_foryou:'r464 is the sole visible click/renderer owner; six v421 pools render seven slots with active Watchlist/Visto/Trocar actions; r449/r461 foryou re-entry is neutralized',
 home_series:'r463 unchanged',home_movies:'r463 unchanged',profile:'r463 unchanged',f1:'r463 unchanged',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v464.js'),js),writeFile(resolve(dist,'app-v464.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v463.js'),{force:true}),rm(resolve(dist,'app-v463.css'),{force:true})]);
for(const need of [
 "window.__ctR464Marker='discover-foryou-visible-owner-v421'",'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'data-ct464-action="swap"','+ Watchlist','✓ Visto','↻ Trocar',"scope:'discover-foryou-only'"
])if(!js.includes(need))throw new Error('r464 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r464 forbidden '+bad);
console.log('WEB_R464_READY');
