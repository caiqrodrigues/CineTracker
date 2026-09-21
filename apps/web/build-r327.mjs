import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r326.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v326.js'),'utf8'),
 readFile(resolve(dist,'app-v326.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r327-home-discover-truth.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r327 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r327 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';",
 "const REVISION='r326-official-1.0.117';",
 "const version='1.0.117',revision='r326-official-1.0.117';",
 "cinetracker_discover_filter_v326",
 "window.__ctR326Marker='home-history-scroll-up+discover-compact-actions+strict-v326'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR327Marker='home-r276-anchor+foryou-flex-actions+hard-filters+discover-v327'",
 "anchorHome327",
 "compactActions327",
 "handleDiscover327"
])must(runtime,x);

js=js.replaceAll('cinetracker_discover_filter_v326','cinetracker_discover_filter_v327');
js=once(js,"window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';","window.__ctWebBuild='1.0.118';window.__ctOfficialVersion='1.0.118';",'web version');
js=once(js,"const REVISION='r326-official-1.0.117';","const REVISION='r327-official-1.0.118';",'revision');
js=once(js,"const version='1.0.117',revision='r326-official-1.0.117';","const version='1.0.118',revision='r327-official-1.0.118';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

const early="(()=>{if(window.__ctR327EarlyCapture)return;window.__ctR327EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR327EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true)})();";
js=early+'\n'+js;

html=html.replaceAll('app-v326.js','app-v327.js').replaceAll('app-v326.css','app-v327.css').replaceAll('v1.0.117','v1.0.118').replaceAll('r326-official-1.0.117','r327-official-1.0.118');
sw=sw.replaceAll('ct-web-1.0.117-r326','ct-web-1.0.118-r327').replaceAll('app-v326.js','app-v327.js').replaceAll('app-v326.css','app-v327.css');
css+='\n/* CineTracker Web 1.0.118 r327 — r276 Home anchor + hard ForYou filters/actions + v327 history authority. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.118',
 revision:'r327-official-1.0.118',
 base:'r326-production',
 scope:'home-r276-history-position+discover-rules-filters-actions',
 home_history_behavior:'r276-full-history-above-initial-viewport-oldest-top-newest-bottom',
 home_history_toggle:false,
 home_history_inner_scroll:false,
 home_history_initial_anchor:'first-non-history-section',
 home_history_authority:'cinetracker_home_history_v324',
 home_episode_live_reconcile:'r325-preserved',
 discover_filter_authority:'cinetracker_discover_filter_v327',
 discover_filter_match:'tmdb+server-candidate-aliases+all-user-aliases+watch-play-events',
 discover_foryou:'watchlist-unseen+fresh-unblocked+hard-kind-filter',
 discover_foryou_filter_ui:'hard-capture-todos+filmes+series+animes',
 discover_foryou_actions:'watchlist+seen+swap-flex-one-row-25px',
 discover_public_actions:'watchlist+seen-flex-one-row-25px',
 discover_top10:'fill-to-ten-after-v327-exclusions-up-to-five-pages',
 discover_calendar:'watchlist-exception-preserved',
 profile_watchlist_counts:'r324-preserved-exact',
 web_version_ui:'1.0.118+r327-official-1.0.118',
 sports_changes:'none-r327',
 f1_changes:'none-r327',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r327 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v327.js'),js),
 writeFile(resolve(dist,'app-v327.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v326.js'),{force:true}),rm(resolve(dist,'app-v326.css'),{force:true})]);
console.log('WEB_R327_READY r276 Home + hard ForYou filters/actions + v327 rules');
