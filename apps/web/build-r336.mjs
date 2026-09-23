import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r335.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v335.js'),'utf8'),
 readFile(resolve(dist,'app-v335.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r336-search-home-foryou.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r336 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r336 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.126';window.__ctOfficialVersion='1.0.126';",
 "const REVISION='r335-official-1.0.126';",
 "const version='1.0.126',revision='r335-official-1.0.126';",
 "window.__ctR335Marker='home-single-anchor-tab-lock+discover-no-top-filters+foryou-final-r329'",
 "cinetracker_discover_filter_v333",
 "Buscar filmes, séries e atores...",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR336Marker='episode-search+home-anchor-on-tab+foryou-actions-swap-immediate'",
 "cinetracker_episode_search_v336",
 "cinetracker_episode_search_targets_v336",
 "data-ct336-fy-kind",
 "optimisticRotate336"
])must(runtime,x);

/* r335 intentionally forced Pra você back to "all" every time it normalized the shell.
   r336 owns its filters inside Pra você, so retire every forced reset. */
const forced="const st=window.__ctR319Test?.state;if(st)st.fyKind='all';";
if(!js.includes(forced))throw new Error('r336 expected r335 forced fyKind reset');
js=js.replaceAll(forced,"const st=window.__ctR319Test?.state;");

/* Search copy now states the complete contract. */
js=js.replaceAll('Buscar filmes, séries e atores...','Buscar filmes, séries, episódios e atores...');

/* First capture owner: this is deliberately prepended before r287/r328/r335 listeners.
   It prevents the multi-listener tab freeze while letting all unrelated clicks pass through. */
const early=`(()=>{if(window.__ctR336EarlyCapture)return;window.__ctR336EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR336EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true)})();`;
js=early+'\n'+js;

js=once(js,"window.__ctWebBuild='1.0.126';window.__ctOfficialVersion='1.0.126';","window.__ctWebBuild='1.0.127';window.__ctOfficialVersion='1.0.127';",'web version');
js=once(js,"const REVISION='r335-official-1.0.126';","const REVISION='r336-official-1.0.127';",'revision');
js=once(js,"const version='1.0.126',revision='r335-official-1.0.126';","const version='1.0.127',revision='r336-official-1.0.127';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v335.js','app-v336.js').replaceAll('app-v335.css','app-v336.css').replaceAll('v1.0.126','v1.0.127').replaceAll('r335-official-1.0.126','r336-official-1.0.127');
sw=sw.replaceAll('ct-web-1.0.126-r335','ct-web-1.0.127-r336').replaceAll('app-v335.js','app-v336.js').replaceAll('app-v335.css','app-v336.css');
css+='\n/* CineTracker Web 1.0.127 r336 — episode search + deterministic Home tabs + final Pra você actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.127',
 revision:'r336-official-1.0.127',
 base:'r335-production',
 scope:'episode-search+home-deterministic-anchor+foryou-final-actions-filters',
 search_global:'movies+series+actors+episodes',
 search_episode_local:'cinetracker_episode_search_v336',
 search_episode_live:'recent-tracked-series-current-season-tmdb',
 search_episode_matching:'exact+substring+edit-distance-2',
 home_history_behavior:'normal-flow-above-anchor+oldest-up+newest-near-anchor+no-button+no-inner-scroll',
 home_navigation:'r336-first-capture-single-owner+tab-click-always-next-section',
 discover_filter_authority:'cinetracker_discover_filter_v333',
 discover_foryou_owner:'r336-after-v333-final-audit',
 discover_foryou_filters:'inside-foryou-all+movie+series+anime',
 discover_foryou_watch_actions:'seen+swap-no-watchlist',
 discover_foryou_fresh_actions:'watchlist+seen+swap',
 discover_foryou_daily_actions:'watchlist+seen+swap',
 discover_foryou_action_behavior:'optimistic-immediate-replacement',
 discover_foryou_layout:'single-row-no-wrap-card-width',
 discover_top10:'r335-preserved-progressive-eight-pages+v333-audit',
 profile_watchlist_counts:'r324-preserved-exact',
 episode_sync:'r325-preserved-live-tv-refresh+logical-watch-state',
 web_version_ui:'1.0.127+r336-official-1.0.127',
 f1_changes:'none-r336',
 sports_changes:'none-r336',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r336 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v336.js'),js),
 writeFile(resolve(dist,'app-v336.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v335.js'),{force:true}),rm(resolve(dist,'app-v335.css'),{force:true})]);
console.log('WEB_R336_READY episode search + Home single-owner tabs + final Pra você');
