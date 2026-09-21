import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r324.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v324.js'),'utf8'),
 readFile(resolve(dist,'app-v324.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r325-home-episode-sync.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r325 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r325 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.115';window.__ctOfficialVersion='1.0.115';",
 "const REVISION='r324-official-1.0.115';",
 "const version='1.0.115',revision='r324-official-1.0.115';",
 "window.__ctR324Marker='home-history-collapsed+discover-actions-compact+watchlist-complete+legacy-alias-union'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'",
 "cinetracker_home_history_v324",
 "cinetracker_home_series_watch_state_v2",
 "ct-refresh-tv-state-user",
 " · NOVO"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.115';window.__ctOfficialVersion='1.0.115';","window.__ctWebBuild='1.0.116';window.__ctOfficialVersion='1.0.116';",'web version');
js=once(js,"const REVISION='r324-official-1.0.115';","const REVISION='r325-official-1.0.116';",'revision');
js=once(js,"const version='1.0.115',revision='r324-official-1.0.115';","const version='1.0.116',revision='r325-official-1.0.116';",'footer identity');
const NL=String.fromCharCode(10);
js=once(js,'boot();',runtime+NL+'boot();','runtime insertion');

html=html.replaceAll('app-v324.js','app-v325.js').replaceAll('app-v324.css','app-v325.css').replaceAll('v1.0.115','v1.0.116').replaceAll('r324-official-1.0.115','r325-official-1.0.116');
sw=sw.replaceAll('ct-web-1.0.115-r324','ct-web-1.0.116-r325').replaceAll('app-v324.js','app-v325.js').replaceAll('app-v324.css','app-v325.css');
css+='\n/* CineTracker Web 1.0.116 r325 — authoritative hidden Home history + logical series state + live episode refresh. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.116',
 revision:'r325-official-1.0.116',
 base:'r324-production',
 scope:'home-history-authority+series-watch-state+live-episode-release-sync',
 home_history_authority:'cinetracker_home_history_v324',
 home_history_preload:'episodes+movies-before-paint',
 home_series_watch_state:'cinetracker_home_series_watch_state_v2',
 home_series_duplicates:'tmdb-logical-union-count+last-season+last-episode',
 home_episode_metadata_refresh:'ct-refresh-tv-state-user',
 home_episode_live_reconcile:'tmdb-show+season-current-date',
 home_new_episode_badge:'released-unseen-within-14d',
 discover_filter_authority:'cinetracker_discover_filter_v324',
 discover_foryou_actions:'watchlist+seen+swap-single-row-compact',
 discover_top10:'fill-to-ten-after-v324-exclusions-up-to-five-pages',
 profile_watchlist_counts:'rpc-exact-series+movie-counts',
 web_version_ui:'1.0.116+r325-official-1.0.116',
 sports_changes:'none-r325',
 f1_changes:'none-r325',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r325 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v325.js'),js),
 writeFile(resolve(dist,'app-v325.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v324.js'),{force:true}),rm(resolve(dist,'app-v324.css'),{force:true})]);
console.log('WEB_R325_READY Home history authority + live episode sync');
