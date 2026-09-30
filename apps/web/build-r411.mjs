import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r410.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v410.js'),'utf8'),
 readFile(resolve(dist,'app-v410.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r411-discover-foryou-progressive.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r411 expected one '+l+', found '+n);return s.replace(a,b)};
const every=(s,a,b,l,min=1)=>{const n=s.split(a).length-1;if(n<min)throw new Error('r411 expected at least '+min+' '+l+', found '+n);return s.replaceAll(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r411 forbidden runtime pattern: '+bad);
if(runtime.includes('cinetracker_discover_foryou_v396'))throw new Error('r411 runtime must not call composite v396');

for(const n of ['396','397','398','399','400','401','402','403','404']){
 const a='async function loadForYou'+n+'(force=false){';
 const b=a+'if(window.__ctR411?.loadForYou)return window.__ctR411.loadForYou(force);';
 if(js.includes(a))js=js.replaceAll(a,b);
}
js=every(js,
 "async function loadForYou(force=false){if(!authReady()||routeNow()!=='discover')return false;",
 "async function loadForYou(force=false){if(window.__ctR411?.loadForYou)return window.__ctR411.loadForYou(force);if(!authReady()||routeNow()!=='discover')return false;",
 'r407/r408/r409 load owner',1
);
if(js.includes("async function loadForYou(force=false){if(!baseLoadForYou)return false;"))js=js.replaceAll(
 "async function loadForYou(force=false){if(!baseLoadForYou)return false;",
 "async function loadForYou(force=false){if(window.__ctR411?.loadForYou)return window.__ctR411.loadForYou(force);if(!baseLoadForYou)return false;"
);
js=once(js,
 "async function loadForYou(force=false){\n const o=owner();if(!o)return false;",
 "async function loadForYou(force=false){\n if(window.__ctR411?.loadForYou)return window.__ctR411.loadForYou(force);\n const o=owner();if(!o)return false;",
 'r410 load owner'
);
js=once(js,
 "window.__ctWebBuild='1.0.201';window.__ctOfficialVersion='1.0.201';",
 "window.__ctWebBuild='1.0.202';window.__ctOfficialVersion='1.0.202';",
 'version'
);
js=once(js,"const REVISION='r410-official-1.0.201';","const REVISION='r411-official-1.0.202';",'revision');
js=once(js,"const version='1.0.201',revision='r410-official-1.0.201';","const version='1.0.202',revision='r411-official-1.0.202';",'footer');
js=once(js,'boot();',runtime+'\nboot();','r411 runtime');

html=html.replaceAll('app-v410.js','app-v411.js').replaceAll('app-v410.css','app-v411.css').replaceAll('v1.0.201','v1.0.202').replaceAll('r410-official-1.0.201','r411-official-1.0.202');
sw=sw.replaceAll('ct-web-1.0.201-r410','ct-web-1.0.202-r411').replaceAll('app-v410.js','app-v411.js').replaceAll('app-v410.css','app-v411.css');
css+='\n/* CineTracker Web 1.0.202 r411 — Descobrir > Pra Você only. */\n[data-ct411-foryou] .ct411-actions{width:100%!important;max-width:100%!important;margin-top:8px!important;overflow:visible!important}\n[data-ct411-foryou] .ct411-actions.three{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important}\n[data-ct411-foryou] .ct411-actions.two{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important}\n[data-ct411-foryou] .ct411-action{display:flex!important;align-items:center!important;justify-content:center!important;pointer-events:auto!important;opacity:1!important;cursor:pointer!important;min-width:0!important;width:100%!important;padding:7px 2px!important;font-size:10px!important;white-space:nowrap!important;overflow:visible!important}\n[data-ct411-foryou] .ct411-action[aria-disabled="false"]{pointer-events:auto!important;opacity:1!important}\n';

const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.202',revision:'r411-official-1.0.202',base:'r410+r411-progressive-foryou',scope:'discover-foryou-only',discover_foryou:'six direct pools in parallel; 12s bounded timeout; progressive paint; composite v396 removed from active path',discover_actions:'daily/fresh Watchlist+Visto+Trocar; watch Visto+Trocar; local optimistic actions',home:'unchanged-r410',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',backend:'unchanged',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v411.js'),js),writeFile(resolve(dist,'app-v411.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v410.js'),{force:true}),rm(resolve(dist,'app-v410.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v411.js'),'utf8');
for(const need of [
 "window.__ctR411Marker='progressive-six-pools-12s-no-composite-complete-actions'",
 "cinetracker_discover_watch_unseen_v396",
 "cinetracker_discover_fresh_v387",
 "data-ct411-action",
 "↻ Trocar",
 "async function loadForYou396(force=false){if(window.__ctR411?.loadForYou)return window.__ctR411.loadForYou(force);"
])if(!built.includes(need))throw new Error('r411 missing '+need);
console.log('WEB_R411_READY discover Pra Voce progressive direct pools + complete active actions');
