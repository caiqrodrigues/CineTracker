import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r414.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v414.js'),'utf8'),readFile(resolve(dist,'app-v414.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r415-home-foryou-profile-stability.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r415 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r415 forbidden runtime pattern: '+bad);
for(const need of ['ct415HomeEntering','data-ct415-swap','↻ Trocar','cinetracker_profile_v380','stable-series-entry+visible-functional-7-swap+single-v380-profile'])if(!runtime.includes(need))throw new Error('r415 runtime missing '+need);
js=once(js,"window.__ctWebBuild='1.0.205';window.__ctOfficialVersion='1.0.205';","window.__ctWebBuild='1.0.206';window.__ctOfficialVersion='1.0.206';",'version');
js=once(js,"const REVISION='r414-official-1.0.205';","const REVISION='r415-official-1.0.206';",'revision');
js=once(js,"const version='1.0.205',revision='r414-official-1.0.205';","const version='1.0.206',revision='r415-official-1.0.206';",'footer');
js=once(js,'boot();',runtime+'\nboot();','r415 runtime');
html=html.replaceAll('app-v414.js','app-v415.js').replaceAll('app-v414.css','app-v415.css').replaceAll('v1.0.205','v1.0.206').replaceAll('r414-official-1.0.205','r415-official-1.0.206');
sw=sw.replaceAll('ct-web-1.0.205-r414','ct-web-1.0.206-r415').replaceAll('app-v414.js','app-v415.js').replaceAll('app-v414.css','app-v415.css');
css+='\n/* CineTracker Web 1.0.206 r415 — stable Home series entry + actual visible Pra Voce action rows. */\nhtml[data-ct415-home-entering="series"] [data-home-view="series"]{visibility:hidden!important}\n.ct415-actions{display:grid!important;width:100%!important;max-width:100%!important;gap:4px!important;margin-top:6px!important;overflow:visible!important;visibility:visible!important;opacity:1!important}\n.ct415-actions[data-ct415-cols="3"]{grid-template-columns:repeat(3,minmax(0,1fr))!important}\n.ct415-actions[data-ct415-cols="2"]{grid-template-columns:repeat(2,minmax(0,1fr))!important}\n.ct415-actions>button{min-width:0!important;width:100%!important;max-width:100%!important;margin:0!important;box-sizing:border-box!important}\n.ct415-actions>.ct415-swap{display:flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:relative!important;z-index:80!important;min-width:0!important;width:100%!important;min-height:30px!important;height:30px!important;padding:4px 3px!important;white-space:nowrap!important;overflow:visible!important;cursor:pointer!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.206',revision:'r415-official-1.0.206',base:'r414+r415-stability',scope:'home-series-entry+discover-foryou-swap+profile-loading',home:'Series stays visually gated until Assistir a seguir geometry is stable, then aligns/reveals once; history remains above and accessible',discover_foryou:'repair uses the actual visible action rows and guarantees functional Trocar in all seven populated slots, delegating swap to current owner',profile:'visual renderer preserved; load owner uses one cinetracker_profile_v380 request with cache-first paint and bounded sports enrichment; legacy profile fan-out is bypassed',backend:'unchanged',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v415.js'),js),writeFile(resolve(dist,'app-v415.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v414.js'),{force:true}),rm(resolve(dist,'app-v414.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v415.js'),'utf8');
for(const need of ["window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile'","window.__ctR414Marker='foryou-swap-only-visible-functional-legacy-dom-repair'",'cinetracker_profile_v380','data-ct415-swap'])if(!built.includes(need))throw new Error('r415 built missing '+need);
console.log('WEB_R415_READY stable Home + visible Trocar + single-flight Profile');