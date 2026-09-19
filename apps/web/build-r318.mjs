import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r317.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v317.js'),'utf8'),
 readFile(resolve(dist,'app-v317.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r318-discover-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r318 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r318 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.108';window.__ctOfficialVersion='1.0.108';",
 "const REVISION='r317-official-1.0.108';",
 "const version='1.0.108',revision='r317-official-1.0.108';",
 "window.__ctR317='profile-watchlist-hard-click+exact-order-singular-alias'",
 "\nboot();"
])must(js,x);
for(const x of[
 "window.__ctR318='discover-foryou-filters+strict-all-public+strict-top10'",
 "['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']",
 "cinetracker_watchlist_full_v119",
 "cinetracker_profile_media_dashboard_v0991",
 "STRICT=new Set(['trending','popular','new','releases','anticipated','top'])",
 "Top 10 Séries",
 "Top 10 Filmes"
])must(runtime,x);

const early=`(()=>{if(window.__ctR318EarlyCapture)return;window.__ctR318EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR318EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true)})();`;
js=once(js,"window.__ctWebBuild='1.0.108';window.__ctOfficialVersion='1.0.108';","window.__ctWebBuild='1.0.109';window.__ctOfficialVersion='1.0.109';",'web version');
js=once(js,"const REVISION='r317-official-1.0.108';","const REVISION='r318-official-1.0.109';",'revision');
js=once(js,"const version='1.0.108',revision='r317-official-1.0.108';","const version='1.0.109',revision='r318-official-1.0.109';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','runtime insertion');
js=early+'\n'+js;

html=html.replaceAll('app-v317.js','app-v318.js').replaceAll('app-v317.css','app-v318.css').replaceAll('v1.0.108','v1.0.109').replaceAll('r317-official-1.0.108','r318-official-1.0.109');
sw=sw.replaceAll('ct-web-1.0.108-r317','ct-web-1.0.109-r318').replaceAll('app-v317.js','app-v318.js').replaceAll('app-v317.css','app-v318.css');
css+='\n/* CineTracker Web 1.0.109 r318 — Discover-only final authority. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.109',
 revision:'r318-official-1.0.109',
 base:'r317-production',
 scope:'discover-only-foryou-filters-strict-exclusions',
 discover_tabs:9,
 discover_foryou_filters:'all+movies+series+anime',
 discover_foryou_rules:'watchlist-unseen+fresh-score7.5-year1990-no-wwe-no-pure-drama-doc+weekly-rotation',
 discover_top10:'providers+series+movies+strict-personal-exclusion',
 discover_public_exclusion:'seen+watchlist+progress+up-to-date+alias-before-markup',
 discover_public_actions:'watchlist+seen-remove-immediately',
 discover_new_window:'today-minus-30d',
 discover_releases_window:'today-minus-7d-to-plus-30d',
 discover_anticipated_window:'tomorrow-to-plus-365d',
 discover_calendar:'watchlist-exception-preserved',
 discover_cache:'5m+background-prefetch',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r318 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v318.js'),js),
 writeFile(resolve(dist,'app-v318.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v317.js'),{force:true}),rm(resolve(dist,'app-v317.css'),{force:true})]);
console.log('WEB_R318_READY Discover filters + strict personal exclusions + filtered Top10');
