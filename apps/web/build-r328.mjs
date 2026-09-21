import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r327.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v327.js'),'utf8'),
 readFile(resolve(dist,'app-v327.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r328-home-history-performance.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r328 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r328 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.118';window.__ctOfficialVersion='1.0.118';",
 "const REVISION='r327-official-1.0.118';",
 "const version='1.0.118',revision='r327-official-1.0.118';",
 "window.__ctR327Marker='home-r276-anchor+foryou-flex-actions+hard-filters+discover-v327'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR328Marker='single-home-rpc+cache-first-nav+natural-history+watched-date'",
 "cinetracker_home_payload_v328",
 "normalizeHistory328",
 "fixHistoryDates328",
 "renderHome328"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.118';window.__ctOfficialVersion='1.0.118';","window.__ctWebBuild='1.0.119';window.__ctOfficialVersion='1.0.119';",'web version');
js=once(js,"const REVISION='r327-official-1.0.118';","const REVISION='r328-official-1.0.119';",'revision');
js=once(js,"const version='1.0.118',revision='r327-official-1.0.118';","const version='1.0.119',revision='r328-official-1.0.119';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v327.js','app-v328.js').replaceAll('app-v327.css','app-v328.css').replaceAll('v1.0.118','v1.0.119').replaceAll('r327-official-1.0.118','r328-official-1.0.119');
sw=sw.replaceAll('ct-web-1.0.118-r327','ct-web-1.0.119-r328').replaceAll('app-v327.js','app-v328.js').replaceAll('app-v327.css','app-v328.css');
css+='\n/* CineTracker Web 1.0.119 r328 — single Home RPC, cache-first navigation, natural history and watched-date truth. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.119',
 revision:'r328-official-1.0.119',
 base:'r327-production',
 scope:'home-history-correctness+home-navigation-performance',
 home_payload_source:'cinetracker_home_payload_v328-single-rpc',
 home_payload_previous_parallel_rpcs:false,
 home_navigation:'cache-first-immediate+background-refresh-after-60s',
 home_first_load_timeout_ms:5000,
 home_history_behavior:'full-history-above-initial-viewport-page-scroll-only',
 home_history_inner_scroll:false,
 home_history_order:'oldest-top+newest-nearest-main-content',
 home_history_episode_date:'watched_at-not-air-date',
 home_history_movie_date:'watched_at-visible',
 home_history_authority:'cinetracker_home_history_v324-via-v328',
 home_episode_live_reconcile:'r325-preserved',
 discover:'r327-preserved',
 profile_watchlist_counts:'r324-preserved-exact',
 sports_changes:'none-r328',
 f1_changes:'none-r328',
 web_version_ui:'1.0.119+r328-official-1.0.119',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r328 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v328.js'),js),
 writeFile(resolve(dist,'app-v328.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v327.js'),{force:true}),rm(resolve(dist,'app-v327.css'),{force:true})]);
console.log('WEB_R328_READY Home fast + history truth');
