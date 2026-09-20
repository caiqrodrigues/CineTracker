import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r322.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v322.js'),'utf8'),
 readFile(resolve(dist,'app-v322.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r323-home-discover-watchlist.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r323 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r323 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.113';window.__ctOfficialVersion='1.0.113';",
 "const REVISION='r322-official-1.0.113';",
 "const version='1.0.113',revision='r322-official-1.0.113';",
 "window.__ctR322='discover-indexed-user-filter+fast-top10'",
 "cinetracker_discover_filter_v322",
 "function candidatePayload321(list){",
 "async function topRaw321(provider,force=false){",
 "function card321(x,rank=0){",
 "\nboot();"
])must(js,x);
for(const x of[
 "window.__ctR323='home-movie-play-history+watchlist-sort+discover-legacy-alias'",
 "cinetracker_home_movie_history_v323",
 "Último adicionado",
 "window.__ctR316.openWatchlist=openWatch323"
])must(runtime,x);

js=js.replaceAll('cinetracker_discover_filter_v322','cinetracker_discover_filter_v323');

const candStart=js.indexOf('function candidatePayload321(list){');
const candEnd=js.indexOf('function auth321(payload){',candStart);
if(candStart<0||candEnd<0)throw new Error('r323 candidate payload anchors missing');
const candidateFn=[
"function candidatePayload321(list){",
" const out=[],seen=new Set();",
" for(const x of rows(list)){",
"  const key=x?.key||keyOf320?.(x)||keyOf(x);if(!validKey321?.(key)&&!validKey(key)){}",
"  const k=keyOf(x);if(!validKey(k)||seen.has(k))continue;seen.add(k);",
"  const [media_type,idRaw]=k.split(':');",
"  out.push({media_type,tmdb_id:Number(idRaw),title:x?.title||x?.media_title||x?.name||'',name:x?.name||'',original_title:x?.original_title||x?.raw_tmdb?.original_title||'',original_name:x?.original_name||x?.raw_tmdb?.original_name||'',release_year:Number(x?.release_year||String(x?.release_date||x?.first_air_date||'').slice(0,4))||null});",
" }",
" return out;",
"}",
""
].join('\n').replace("  const key=x?.key||keyOf320?.(x)||keyOf(x);if(!validKey321?.(key)&&!validKey(key)){}\n","");
js=js.slice(0,candStart)+candidateFn+js.slice(candEnd);

const topStart=js.indexOf('async function topRaw321(provider,force=false){');
const topEnd=js.indexOf('function card321(x,rank=0){',topStart);
if(topStart<0||topEnd<0)throw new Error('r323 topRaw321 anchors missing');
const topFn=[
"async function topRaw321(provider,force=false){",
" const key='r323:'+String(provider),hit=topCache.get(key);",
" if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;",
" const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};",
" const movies=[],series=[],seenM=new Set(),seenT=new Set();",
" for(let page=1;page<=5&&(movies.length<10||series.length<10);page++){",
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
js=js.slice(0,topStart)+topFn+js.slice(topEnd);

const testObj="window.__ctR321Test={auth321,candidatePayload321,dedupe321,activityHtml321,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}}};";
must(js,testObj);
js=js.replace(testObj,"window.__ctR321Test={auth321,candidatePayload321,dedupe321,topRaw321,activityHtml321,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}}};");

js=once(js,"window.__ctWebBuild='1.0.113';window.__ctOfficialVersion='1.0.113';","window.__ctWebBuild='1.0.114';window.__ctOfficialVersion='1.0.114';",'web version');
js=once(js,"const REVISION='r322-official-1.0.113';","const REVISION='r323-official-1.0.114';",'revision');
js=once(js,"const version='1.0.113',revision='r322-official-1.0.113';","const version='1.0.114',revision='r323-official-1.0.114';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v322.js','app-v323.js').replaceAll('app-v322.css','app-v323.css').replaceAll('v1.0.113','v1.0.114').replaceAll('r322-official-1.0.113','r323-official-1.0.114');
sw=sw.replaceAll('ct-web-1.0.113-r322','ct-web-1.0.114-r323').replaceAll('app-v322.js','app-v323.js').replaceAll('app-v322.css','app-v323.css');
css+='\n/* CineTracker Web 1.0.114 r323 — legacy alias exclusions, true Top 10, Home movie history, Watchlist sort. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.114',
 revision:'r323-official-1.0.114',
 base:'r322-production',
 scope:'discover-rules+home-movie-history+watchlist-sort+version',
 discover_filter_authority:'cinetracker_discover_filter_v323',
 discover_filter_match:'tmdb+legacy-original-title-year',
 discover_public_exclusion:'seen+episode-progress+up-to-date+completed+watchlist+watchlater+not-interested',
 discover_foryou:'watchlist-unseen+fresh-unblocked+legacy-alias-safe+working-kind-filter',
 discover_top10:'fill-to-ten-after-exclusions-up-to-five-pages',
 discover_calendar:'watchlist-exception-preserved',
 home_movie_history:'cinetracker_home_movie_history_v323',
 home_movie_history_source:'watch_play_events+legacy_watch_history',
 profile_watchlist_sort:'visible-last-added+first-added+az+za+year',
 web_version_ui:'1.0.114+r323-official-1.0.114',
 sports_changes:'none-r323',
 f1_changes:'none-r323',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r323 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v323.js'),js),
 writeFile(resolve(dist,'app-v323.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v322.js'),{force:true}),rm(resolve(dist,'app-v322.css'),{force:true})]);
console.log('WEB_R323_READY rules + true top10 + Home history + Watchlist sort');
