import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r323.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v323.js'),'utf8'),
 readFile(resolve(dist,'app-v323.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r324-home-discover-profile.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r324 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r324 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.114';window.__ctOfficialVersion='1.0.114';",
 "const REVISION='r323-official-1.0.114';",
 "const version='1.0.114',revision='r323-official-1.0.114';",
 "cinetracker_discover_filter_v323",
 "window.__ctR323='home-movie-play-history+watchlist-sort+discover-legacy-alias'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR324Marker='home-history-collapsed+discover-actions-compact+watchlist-complete+legacy-alias-union'",
 "cinetracker_watchlist_full_v119",
 "Ver histórico",
 "grid-template-columns:repeat(3,minmax(0,1fr))"
])must(runtime,x);

js=js.replaceAll('cinetracker_discover_filter_v323','cinetracker_discover_filter_v324');
js=once(js,"window.__ctWebBuild='1.0.114';window.__ctOfficialVersion='1.0.114';","window.__ctWebBuild='1.0.115';window.__ctOfficialVersion='1.0.115';",'web version');
js=once(js,"const REVISION='r323-official-1.0.114';","const REVISION='r324-official-1.0.115';",'revision');
js=once(js,"const version='1.0.114',revision='r323-official-1.0.114';","const version='1.0.115',revision='r324-official-1.0.115';",'footer identity');
js=once(js,'boot();',runtime+'\\nboot();','runtime insertion');

html=html.replaceAll('app-v323.js','app-v324.js').replaceAll('app-v323.css','app-v324.css').replaceAll('v1.0.114','v1.0.115').replaceAll('r323-official-1.0.114','r324-official-1.0.115');
sw=sw.replaceAll('ct-web-1.0.114-r323','ct-web-1.0.115-r324').replaceAll('app-v323.js','app-v324.js').replaceAll('app-v323.css','app-v324.css');
css+='\n/* CineTracker Web 1.0.115 r324 — collapsed Home history, compact Discover actions, complete Watchlists, alias-safe Top 10. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.115',
 revision:'r324-official-1.0.115',
 base:'r323-production',
 scope:'home-history-collapse+discover-action-layout+profile-watchlist-completeness+top10-seen-alias',
 discover_filter_authority:'cinetracker_discover_filter_v324',
 discover_filter_match:'tmdb-direct-plus-legacy-original-title-year-union',
 discover_public_exclusion:'seen+episode-progress+up-to-date+completed+watchlist+watchlater+not-interested',
 discover_foryou_actions:'watchlist+seen+swap-single-row-compact',
 discover_top10:'fill-to-ten-after-v324-exclusions-up-to-five-pages',
 discover_top10_seen_legacy:'blocked-through-original-title-year-even-with-positive-direct-record',
 home_history_initial:'series+movies-preloaded-collapsed',
 home_movie_history:'cinetracker_home_movie_history_v323',
 profile_watchlist_source:'cinetracker_watchlist_full_v119-all-rows',
 profile_watchlist_counts:'rpc-exact-series+movie-counts',
 profile_watchlist_legacy_rows:'visible-without-positive-tmdb',
 web_version_ui:'1.0.115+r324-official-1.0.115',
 sports_changes:'none-r324',
 f1_changes:'none-r324',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r324 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v324.js'),js),
 writeFile(resolve(dist,'app-v324.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v323.js'),{force:true}),rm(resolve(dist,'app-v323.css'),{force:true})]);
console.log('WEB_R324_READY Home history collapsed + Discover compact + full Watchlists + alias-safe Top10');
