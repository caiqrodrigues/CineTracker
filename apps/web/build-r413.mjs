import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r412.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v412.js'),'utf8'),
 readFile(resolve(dist,'app-v412.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r413-home-foryou-reality.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r413 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r413 forbidden runtime pattern: '+bad);
for(const need of ['REALITY_GENRE_ID=10764','reality','ct413HomeEntering','data-ct411-action="swap"','↻ Trocar'])if(!runtime.includes(need))throw new Error('r413 runtime missing '+need);

js=js.replaceAll('cinetracker_discover_watch_unseen_v412','cinetracker_discover_watch_unseen_v413');
js=js.replaceAll('cinetracker_discover_fresh_v412','cinetracker_discover_fresh_v413');
js=js.replaceAll('cinetracker_home_series_v412','cinetracker_home_series_v413');
js=js.replaceAll('window.__ctR412Eligibility.filterRows','window.__ctR413Eligibility.filterRows');

js=once(js,
 "window.__ctWebBuild='1.0.203';window.__ctOfficialVersion='1.0.203';",
 "window.__ctWebBuild='1.0.204';window.__ctOfficialVersion='1.0.204';",
 'version'
);
js=once(js,"const REVISION='r412-official-1.0.203';","const REVISION='r413-official-1.0.204';",'revision');
js=once(js,"const version='1.0.203',revision='r412-official-1.0.203';","const version='1.0.204',revision='r413-official-1.0.204';",'footer');
js=once(js,'boot();',runtime+'\nboot();','r413 runtime');

html=html.replaceAll('app-v412.js','app-v413.js').replaceAll('app-v412.css','app-v413.css').replaceAll('v1.0.203','v1.0.204').replaceAll('r412-official-1.0.203','r413-official-1.0.204');
sw=sw.replaceAll('ct-web-1.0.203-r412','ct-web-1.0.204-r413').replaceAll('app-v412.js','app-v413.js').replaceAll('app-v412.css','app-v413.css');
css+='\n/* CineTracker Web 1.0.204 r413 — Home no-history flash + complete Pra Voce actions. */\nhtml[data-ct413-home-entering="1"] [data-home]{visibility:hidden!important}\n[data-ct411-foryou] .ct411-actions{display:grid!important;visibility:visible!important;opacity:1!important;overflow:visible!important;max-height:none!important;min-height:32px!important}\n[data-ct411-foryou] .ct411-actions.three{grid-template-columns:repeat(3,minmax(0,1fr))!important}\n[data-ct411-foryou] .ct411-actions.two{grid-template-columns:repeat(2,minmax(0,1fr))!important}\n[data-ct411-foryou] .ct411-action,[data-ct411-foryou] [data-ct411-action="swap"]{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:relative!important;z-index:5!important;min-width:0!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.204',revision:'r413-official-1.0.204',base:'r412+r413-home-entry-foryou-reality',scope:'home-entry+recommendation-discovery+foryou-actions',recommendation_rules:'r412 strict minimum 40m + YouTube/web + novelas preserved; Reality genre 10764/text now blocked globally',discover_foryou:'strict v413 pools + r411 canonical owner + bounded final repair + complete Trocar actions',discover_public:'r319 personal blocklist followed by r413 eligibility; invalid candidates replaced in order',home:'series authority v413; Home canvas hidden only during entry alignment so History never flashes before Assistir a seguir',backend:'v413 eligibility + fresh/watch/home-series RPCs',android:'unchanged-1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v413.js'),js),writeFile(resolve(dist,'app-v413.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v412.js'),{force:true}),rm(resolve(dist,'app-v412.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v413.js'),'utf8');
for(const need of [
 "window.__ctR413Marker='no-history-flash+7-swap-owner+reality-10764+strict-r412-preserved'",
 'cinetracker_discover_watch_unseen_v413','cinetracker_discover_fresh_v413','cinetracker_home_series_v413',
 'window.__ctR413Eligibility.filterRows(personalCandidates',
 'window.__ctR413Eligibility.filterRows(rawList',
 'data-ct411-action="swap"'
])if(!built.includes(need))throw new Error('r413 built missing '+need);
if(built.includes('window.__ctR412Eligibility.filterRows(personalCandidates'))throw new Error('r413 public discovery still using r412 filter');
console.log('WEB_R413_READY Home no-history flash + 7 Trocar + Reality exclusion + r412 strict rules preserved');
