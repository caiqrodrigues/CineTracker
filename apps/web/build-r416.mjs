import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r415.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v415.js'),'utf8'),readFile(resolve(dist,'app-v415.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r416-profile-foryou-f1.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r416 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r416 forbidden runtime pattern: '+bad);
for(const need of ['window.__ctR416Marker','data-ct411-action="swap"','cinetracker_profile_v380','ct:r416:profile:','cinetracker_mark_watch_v0994','cinetracker_f1_session_watch_set_v314','p_released_episodes'])if(!runtime.includes(need))throw new Error('r416 runtime missing '+need);
js=once(js,"window.__ctWebBuild='1.0.206';window.__ctOfficialVersion='1.0.206';","window.__ctWebBuild='1.0.207';window.__ctOfficialVersion='1.0.207';",'version');
js=once(js,"const REVISION='r415-official-1.0.206';","const REVISION='r416-official-1.0.207';",'revision');
js=once(js,"const version='1.0.206',revision='r415-official-1.0.206';","const version='1.0.207',revision='r416-official-1.0.207';",'footer');
js=once(js,'boot();',runtime+'\nboot();','r416 runtime');
html=html.replaceAll('app-v415.js','app-v416.js').replaceAll('app-v415.css','app-v416.css').replaceAll('v1.0.206','v1.0.207').replaceAll('r415-official-1.0.206','r416-official-1.0.207');
sw=sw.replaceAll('ct-web-1.0.206-r415','ct-web-1.0.207-r416').replaceAll('app-v415.js','app-v416.js').replaceAll('app-v415.css','app-v416.css');
css+='\n/* CineTracker Web 1.0.207 r416 — final r411 Pra Voce actions + instant Profile snapshot + F1 imported-series watch. */\n[data-ct411-foryou] .ct411-actions{display:grid!important;width:100%!important;max-width:100%!important;overflow:visible!important;visibility:visible!important;opacity:1!important}\n[data-ct411-foryou] .ct411-actions.three{grid-template-columns:repeat(3,minmax(0,1fr))!important}\n[data-ct411-foryou] .ct411-actions.two{grid-template-columns:repeat(2,minmax(0,1fr))!important}\n[data-ct411-foryou] [data-ct411-action="swap"]{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:static!important;min-width:0!important;width:100%!important;max-width:100%!important;z-index:auto!important}\n.ct416-watched{transition:opacity .12s ease,border-color .12s ease}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.207',revision:'r416-official-1.0.207',base:'r415+r416-profile-foryou-f1',scope:'profile-fast-first-paint+discover-foryou-r411-final-owner+f1-series-watch',discover_foryou:'r411 final renderer is re-bound on entry and all seven populated slots expose the native swap action; no synthetic legacy swap owner',profile:'same canonical v380 visual renderer; durable per-user snapshot paints synchronously and live v380 refresh replaces it in background',f1:'Formula 1 imported-series episode watch is optimistic, persists through cinetracker_mark_watch_v0994 with released-episode context, mirrors canonical F1 session state and invalidates Home/Profile without reload',home:'unchanged-r415',backend:'existing-r314-f1-rpcs',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v416.js'),js),writeFile(resolve(dist,'app-v416.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v415.js'),{force:true}),rm(resolve(dist,'app-v415.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v416.js'),'utf8');
for(const need of ["window.__ctR416Marker='profile-persistent-first-paint+foryou-r411-final-owner+f1-series-optimistic-watch'","window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile'",'cinetracker_f1_session_watch_set_v314','p_released_episodes','data-ct411-action="swap"'])if(!built.includes(need))throw new Error('r416 built missing '+need);
console.log('WEB_R416_READY profile instant snapshot + Pra Voce final swap + F1 series watch');
