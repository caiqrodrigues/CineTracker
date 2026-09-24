import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r363.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v363.js'),'utf8'),
 readFile(resolve(dist,'app-v363.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r364-foryou-no-freeze.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r364 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.154';window.__ctOfficialVersion='1.0.154';",
 "const REVISION='r363-official-1.0.154';",
 "const version='1.0.154',revision='r363-official-1.0.154';",
 "window.__ctR363Marker='foryou-pool-refill+actions-never-die+persist-even-at-last-item'",
 "boot();"
])if(!js.includes(x))throw new Error('r364 missing '+x);
for(const x of[
 "window.__ctR364Marker='foryou-single-click-owner+legacy-observers-retired+no-freeze'",
 "window.__ctR358Early=early",
 "function warmOnce()"
])if(!runtime.includes(x))throw new Error('r364 runtime missing '+x);

function retireBind(marker,name){
 const p=js.indexOf(marker),a=js.lastIndexOf("(()=>{",p),z=js.indexOf("})();",p);
 if(p<0||a<0||z<0)throw new Error('r364 segment missing '+marker);
 let seg=js.slice(a,z+5);
 const needle='function '+name+'(){';
 if(!seg.includes(needle))throw new Error('r364 bind missing '+marker+' '+name);
 seg=seg.replace(needle,'function '+name+'(){return false;/* r364 retired observer */');
 js=js.slice(0,a)+seg+js.slice(z+5);
}
retireBind("window.__ctR348Marker='foryou-buttons-only+direct-children+no-stray-swap'",'bind');
retireBind("window.__ctR349Marker='foryou-actions-live+compact-cards+heart-inside-poster'",'bind349');
retireBind("window.__ctR360Marker='foryou-repeat-clicks+dom-state-resync+slot-stays-live'",'bind');
retireBind("window.__ctR361Marker='foryou-rearm-after-every-repaint+repeat-click-live'",'bind');
retireBind("window.__ctR362Marker='foryou-real-click-owner+dom-key-fallback+clicked-slot-only'",'bind');
retireBind("window.__ctR363Marker='foryou-pool-refill+actions-never-die+persist-even-at-last-item'",'bind');

js=once(js,"window.__ctWebBuild='1.0.154';window.__ctOfficialVersion='1.0.154';","window.__ctWebBuild='1.0.155';window.__ctOfficialVersion='1.0.155';",'version');
js=once(js,"const REVISION='r363-official-1.0.154';","const REVISION='r364-official-1.0.155';",'revision');
js=once(js,"const version='1.0.154',revision='r363-official-1.0.154';","const version='1.0.155',revision='r364-official-1.0.155';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v363.js','app-v364.js').replaceAll('app-v363.css','app-v364.css').replaceAll('v1.0.154','v1.0.155').replaceAll('r363-official-1.0.154','r364-official-1.0.155');
sw=sw.replaceAll('ct-web-1.0.154-r363','ct-web-1.0.155-r364').replaceAll('app-v363.js','app-v364.js').replaceAll('app-v363.css','app-v364.css');
css+='\n/* CineTracker Web 1.0.155 r364 — one Pra Você click owner; legacy action observers retired. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.155',revision:'r364-official-1.0.155',base:'r363-production',
 scope:'discover-foryou-no-freeze-only',
 discover_foryou_click_owner:'r364-single-physical-owner',
 discover_foryou_observers:'r348+r349+r360+r361+r362+r363-action-observers-retired',
 discover_foryou_actions:'r363-targeted-state+single-slot-render+background-persist',
 discover_foryou_refill:'startup-once+targeted-after-action',
 discover_foryou_stability:'no-observer-storm+repeat-click-watchdog',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r364 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v364.js'),js),writeFile(resolve(dist,'app-v364.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v363.js'),{force:true}),rm(resolve(dist,'app-v363.css'),{force:true})]);
console.log('WEB_R364_READY single Pra Você action owner; observer storm retired');