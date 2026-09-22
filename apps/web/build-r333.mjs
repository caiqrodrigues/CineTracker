import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r332.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v332.js'),'utf8'),
 readFile(resolve(dist,'app-v332.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r333-home-discover-sports.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r333 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r333 expected one '+l+', found '+n);return s.replace(a,b)};
const range=(s,start,end,next,label)=>{const a=s.indexOf(start),b=s.indexOf(end,a+start.length);if(a<0||b<0||b<=a)throw new Error('r333 range '+label+' missing');return s.slice(0,a)+next+'\n'+s.slice(b)};

for(const x of[
 "window.__ctWebBuild='1.0.123';window.__ctOfficialVersion='1.0.123';",
 "const REVISION='r332-official-1.0.123';",
 "const version='1.0.123',revision='r332-official-1.0.123';",
 "window.__ctR332Marker='home-anchor-settle+foryou-final-owner+discover-cache-safe+episode-pointer-repair'",
 "rpc('cinetracker_profile_home_payload_v0997_r6'",
 "cinetracker_discover_filter_v326",
 "async function topRaw321(provider,force=false){",
 "function card321(x,rank=0){",
 "loaded321();setTimeout(()=>void prefetchTop332(),120);return draft.complete;",
 "setTimeout(()=>void prefetchPublic332(),240);",
 "for(const ms of [0,60,180,420,850])",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR333Marker='home-v333+discover-direct-controls+top10-final-audit+sports-background-warmup'",
 "sports-background-warmup",
 "data-ct333-direct"
])must(runtime,x);

/* Home payload authority: logical series state + released/unseen movie Watchlist + canonical histories. */
js=once(js,"rpc('cinetracker_profile_home_payload_v0997_r6'","rpc('cinetracker_home_payload_v333'",'home v333 RPC');

/* All Discover audits use the v333 authority. */
js=js.replaceAll('cinetracker_discover_filter_v326','cinetracker_discover_filter_v333');

/* Top 10: progressive raw TMDB pages, audit each page, keep going until 10 eligible per rail. */
const topRaw333=[
"async function topRaw321(provider,force=false){",
" const key='r333:'+String(provider),hit=topCache.get(key);",
" if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;",
" const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};",
" const movies=[],series=[],seenM=new Set(),seenT=new Set();",
" for(let page=1;page<=8&&(movies.length<10||series.length<10);page++){",
"  let m=[],t=[];",
"  if(testBridge?.topPage){const d=await testBridge.topPage(provider,page);m=dedupe321(d?.movies||[]);t=dedupe321(d?.series||[]);}",
"  else{const parts=await Promise.all([movies.length<10?tmdbPage321('/discover/movie',{...common,page},'movie'):Promise.resolve([]),series.length<10?tmdbPage321('/discover/tv',{...common,page},'tv'):Promise.resolve([])]);m=dedupe321(parts[0]);t=dedupe321(parts[1]);}",
"  const batch=dedupe321([...m,...t]);if(!batch.length)continue;",
"  const a=await exact321(batch);",
"  if(movies.length<10)for(const x of m){const k=keyOf(x);if(a.blocked.has(k)||seenM.has(k))continue;seenM.add(k);movies.push(x);if(movies.length>=10)break}",
"  if(series.length<10)for(const x of t){const k=keyOf(x);if(a.blocked.has(k)||seenT.has(k))continue;seenT.add(k);series.push(x);if(series.length>=10)break}",
" }",
" const data={movies:movies.slice(0,10),series:series.slice(0,10)};topCache.set(key,{at:Date.now(),rows:data});return data;",
"}",
""
].join('\n');
js=range(js,'async function topRaw321(provider,force=false){','function card321(x,rank=0){',topRaw333,'Top10 progressive v333');

/* Avoid network storms/freezes while switching Discover tabs. Load on demand; keep request dedupe/cache. */
js=once(js,"loaded321();setTimeout(()=>void prefetchTop332(),120);return draft.complete;","loaded321();setTimeout(()=>window.__ctR333?.normalizeDiscover?.(),0);return draft.complete;",'ForYou no eager Top10 prefetch');
js=once(js,"setTimeout(()=>void prefetchPublic332(),240);","setTimeout(()=>window.__ctR333?.normalizeDiscover?.(),0);",'Discover no eager all-tab prefetch');

/* Home anchor: one short settle sequence; do not run a subtree observer that fights navigation/scroll. */
js=once(js,"for(const ms of [0,60,180,420,850])","for(const ms of [0,90])",'Home settle timers');
js=once(js,
 "if(app&&window.MutationObserver)new MutationObserver(muts=>{\n  if(routeNow()!=='home'||homeUserScroll||Date.now()>homeLockUntil)return;",
 "if(false&&app&&window.MutationObserver)new MutationObserver(muts=>{\n  if(routeNow()!=='home'||homeUserScroll||Date.now()>homeLockUntil)return;",
 'disable r332 Home observer'
);
js=js.replaceAll("setTimeout(()=>void repairVisibleEpisodes332(),80);","setTimeout(()=>void repairVisibleEpisodes332(),900);");
js=js.replaceAll("setTimeout(()=>void forceTvRefresh332(),900);","setTimeout(()=>void forceTvRefresh332(),1800);");
js=js.replace(
 "if(routeNow()==='home'){armHome332(activeHomeKind332());void repairVisibleEpisodes332();setTimeout(()=>void forceTvRefresh332(),1800)}",
 "if(routeNow()==='home'){armHome332(activeHomeKind332());setTimeout(()=>void repairVisibleEpisodes332(),900);setTimeout(()=>void forceTvRefresh332(),1800)}"
);

/* Expose final Top10 helper to the focused browser gate. */
js=once(js,
 "window.__ctR321={renderDiscover:renderDiscover321,loadDiscover:loadDiscover321,loadPublic:loadPublic321,loadForYou:loadForYou321,loadTop:loadTop321,source:source321,prefetchPublic:prefetchPublic332,prefetchTop:prefetchTop332,exact:exact321,hydrateProfile:hydrateProfile321,openDay:openDay321,version:'1.0.112'};",
 "window.__ctR321={renderDiscover:renderDiscover321,loadDiscover:loadDiscover321,loadPublic:loadPublic321,loadForYou:loadForYou321,loadTop:loadTop321,topRaw:topRaw321,source:source321,prefetchPublic:prefetchPublic332,prefetchTop:prefetchTop332,exact:exact321,hydrateProfile:hydrateProfile321,openDay:openDay321,version:'1.0.112'};",
 'r321 topRaw hook'
);

js=once(js,"window.__ctWebBuild='1.0.123';window.__ctOfficialVersion='1.0.123';","window.__ctR333Build='home-v333+discover-v333+no-eager-prefetch+sports-warmup';window.__ctWebBuild='1.0.124';window.__ctOfficialVersion='1.0.124';",'web version');
js=once(js,"const REVISION='r332-official-1.0.123';","const REVISION='r333-official-1.0.124';",'revision');
js=once(js,"const version='1.0.123',revision='r332-official-1.0.123';","const version='1.0.124',revision='r333-official-1.0.124';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v332.js','app-v333.js').replaceAll('app-v332.css','app-v333.css').replaceAll('v1.0.123','v1.0.124').replaceAll('r332-official-1.0.123','r333-official-1.0.124');
sw=sw.replaceAll('ct-web-1.0.123-r332','ct-web-1.0.124-r333').replaceAll('app-v332.js','app-v333.js').replaceAll('app-v332.css','app-v333.css');
css+='\n/* CineTracker Web 1.0.124 r333 — Home logical truth + direct Discover + Sports warmup. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.124',
 revision:'r333-official-1.0.124',
 base:'r332-production',
 scope:'home-logical-series+released-unseen-movies+discover-direct-controls+strict-top10+sports-warmup',
 home_payload:'cinetracker_home_payload_v333',
 home_history_behavior:'normal-flow-above-anchor+no-toggle+newest-nearest-anchor',
 home_series_logical_state:'v2-dedup-first-paint+no-stale-unseen-pointer',
 home_movie_watchlist:'released+unseen-only+fresh-watchlist-v119',
 home_navigation:'short-anchor-settle+no-subtree-scroll-observer',
 discover_filter_authority:'cinetracker_discover_filter_v333',
 discover_controls:'direct-inline-filters+no-prev-next-filter-trigger',
 discover_foryou_owner:'r329-after-v333-final-audit',
 discover_foryou_filters:'all+movies+series+anime-direct',
 discover_foryou_actions:'watchlist+seen+swap-three-compact-one-row',
 discover_prefetch:'on-demand-no-eager-network-storm',
 discover_top10:'progressive-eight-pages-until-ten+v333-audit',
 discover_top10_seen:'fresh-v333-final-audit-before-html',
 discover_top10_geometry:'raised-no-blank-title-band',
 sports_startup:'warm-payload+background-provider-sync-every-open',
 sports_startup_windows:'previous-3-days+today-next-2-days',
 profile_watchlist_counts:'r324-preserved-exact',
 web_version_ui:'1.0.124+r333-official-1.0.124',
 f1_changes:'none-r333',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r333 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v333.js'),js),
 writeFile(resolve(dist,'app-v333.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v332.js'),{force:true}),rm(resolve(dist,'app-v332.css'),{force:true})]);
console.log('WEB_R333_READY Home truth + Discover direct/final + Sports background warmup');
