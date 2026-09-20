import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r321.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v321.js'),'utf8'),
 readFile(resolve(dist,'app-v321.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r322 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r322 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.112';window.__ctOfficialVersion='1.0.112';",
 "const REVISION='r321-official-1.0.112';",
 "const version='1.0.112',revision='r321-official-1.0.112';",
 "window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity'",
 "cinetracker_discover_filter_v320",
 "async function topRaw321(provider,force=false){",
 "function card321(x,rank=0){"
])must(js,x);

js=js.replaceAll('cinetracker_discover_filter_v320','cinetracker_discover_filter_v322');

const topStart=js.indexOf('async function topRaw321(provider,force=false){');
const topEnd=js.indexOf('function card321(x,rank=0){',topStart);
if(topStart<0||topEnd<0)throw new Error('r322 topRaw321 anchors missing');
const fastTop=[
 "async function topRaw321(provider,force=false){",
 " if(testBridge?.top)return testBridge.top(provider,force);",
 " const key=String(provider),hit=topCache.get(key);",
 " if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;",
 " let data=null;",
 " if(typeof ct171TopRows==='function'){data=await ct171TopRows(Number(provider));}",
 " else{const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};const [m,t]=await Promise.all([tmdbPage321('/discover/movie',{...common,page:1},'movie'),tmdbPage321('/discover/tv',{...common,page:1},'tv')]);data={movies:m.slice(0,10),series:t.slice(0,10)};}",
 " const out={movies:dedupe321(data?.movies||[]),series:dedupe321(data?.series||[])};",
 " topCache.set(key,{at:Date.now(),rows:out});return out;",
 "}",
 ""
].join('\n');
js=js.slice(0,topStart)+fastTop+js.slice(topEnd);

const marker="window.__ctR322='discover-indexed-user-filter+fast-top10';window.__ctR322Discover='exact-logical-key+before-paint+ct171-top-cache';window.__ctR322Scope='discover-only';";
js=once(js,"window.__ctWebBuild='1.0.112';window.__ctOfficialVersion='1.0.112';",marker+"window.__ctWebBuild='1.0.113';window.__ctOfficialVersion='1.0.113';",'web version');
js=once(js,"const REVISION='r321-official-1.0.112';","const REVISION='r322-official-1.0.113';",'revision');
js=once(js,"const version='1.0.112',revision='r321-official-1.0.112';","const version='1.0.113',revision='r322-official-1.0.113';",'footer identity');

html=html.replaceAll('app-v321.js','app-v322.js').replaceAll('app-v321.css','app-v322.css').replaceAll('v1.0.112','v1.0.113').replaceAll('r321-official-1.0.112','r322-official-1.0.113');
sw=sw.replaceAll('ct-web-1.0.112-r321','ct-web-1.0.113-r322').replaceAll('app-v321.js','app-v322.js').replaceAll('app-v321.css','app-v322.css');
css+='\n/* CineTracker Web 1.0.113 r322 — Discover-only indexed user filter + fast Top 10. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.113',
 revision:'r322-official-1.0.113',
 base:'r321-production',
 scope:'discover-only-indexed-filter-performance-and-rules',
 discover_filter_authority:'cinetracker_discover_filter_v322',
 discover_filter_match:'indexed-logical-tmdb-key',
 discover_validation:'server-before-paint',
 discover_public_exclusion:'seen+episode-progress+up-to-date+completed+watchlist+watchlater+not-interested',
 discover_top10_source:'ct171TopRows-session-cache',
 discover_top10_filter:'same-v322-before-paint',
 discover_foryou:'watchlist-only-unseen+fresh-unblocked+working-kind-filter',
 discover_calendar:'watchlist-exception-preserved',
 profile_changes:'none-r322',
 sports_changes:'none-r322',
 f1_changes:'none-r322',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r322 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v322.js'),js),
 writeFile(resolve(dist,'app-v322.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([
 rm(resolve(dist,'app-v321.js'),{force:true}),
 rm(resolve(dist,'app-v321.css'),{force:true})
]);
console.log('WEB_R322_READY Discover-only indexed filter + fast Top 10');
