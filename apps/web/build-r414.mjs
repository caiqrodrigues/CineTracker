import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r413.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v413.js'),'utf8'),
 readFile(resolve(dist,'app-v413.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r414-foryou-swap-only.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r414 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r414 forbidden runtime pattern: '+bad);
for(const need of ['data-ct414-swap','↻ Trocar','discover-foryou-swap-only','__ctR411','legacy-dom-repair'])if(!runtime.includes(need))throw new Error('r414 runtime missing '+need);

js=once(js,
 "window.__ctWebBuild='1.0.204';window.__ctOfficialVersion='1.0.204';",
 "window.__ctWebBuild='1.0.205';window.__ctOfficialVersion='1.0.205';",
 'version'
);
js=once(js,"const REVISION='r413-official-1.0.204';","const REVISION='r414-official-1.0.205';",'revision');
js=once(js,"const version='1.0.204',revision='r413-official-1.0.204';","const version='1.0.205',revision='r414-official-1.0.205';",'footer');
js=once(js,'boot();',runtime+'\nboot();','r414 runtime');

html=html.replaceAll('app-v413.js','app-v414.js').replaceAll('app-v413.css','app-v414.css').replaceAll('v1.0.204','v1.0.205').replaceAll('r413-official-1.0.204','r414-official-1.0.205');
sw=sw.replaceAll('ct-web-1.0.204-r413','ct-web-1.0.205-r414').replaceAll('app-v413.js','app-v414.js').replaceAll('app-v413.css','app-v414.css');
css+='\n/* CineTracker Web 1.0.205 r414 — ONLY Descobrir > Pra Você missing Trocar repair. */\n.ct414-actions{display:grid!important;width:100%!important;max-width:100%!important;gap:5px!important;margin-top:8px!important;overflow:visible!important;visibility:visible!important;opacity:1!important}\n.ct414-actions[data-ct414-actions="3"]{grid-template-columns:repeat(3,minmax(0,1fr))!important}\n.ct414-actions[data-ct414-actions="2"]{grid-template-columns:repeat(2,minmax(0,1fr))!important}\n.ct414-swap{display:flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:relative!important;z-index:8!important;min-width:0!important;width:100%!important;min-height:30px!important;padding:6px 3px!important;white-space:nowrap!important;cursor:pointer!important}\n';

const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.205',revision:'r414-official-1.0.205',base:'r413+r414-foryou-swap-only',scope:'discover-foryou-swap-only',discover_foryou:'r413 data/filter behavior preserved; r414 only repairs missing visible ↻ Trocar buttons on canonical or legacy visible DOM and delegates swap to r411',home:'unchanged-r413',profile:'unchanged',sports:'unchanged',top10:'unchanged',settings:'unchanged',backend:'unchanged-v413',android:'unchanged-1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v414.js'),js),writeFile(resolve(dist,'app-v414.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v413.js'),{force:true}),rm(resolve(dist,'app-v413.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v414.js'),'utf8');
for(const need of [
 "window.__ctR414Marker='foryou-swap-only-visible-functional-legacy-dom-repair'",
 "window.__ctR413Marker='no-history-flash+7-swap-owner+reality-10764+strict-r412-preserved'",
 'cinetracker_discover_watch_unseen_v413','cinetracker_discover_fresh_v413','cinetracker_home_series_v413',
 'data-ct414-swap','↻ Trocar','REALITY_GENRE_ID=10764'
])if(!built.includes(need))throw new Error('r414 built missing '+need);
console.log('WEB_R414_READY only Pra Voce Trocar repair; r413 behavior preserved');
