import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r329.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v329.js'),'utf8'),
 readFile(resolve(dist,'app-v329.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r330-recovery.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r330 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r330 expected one '+l+', found '+n);return s.replace(a,b)};
const between=(s,a,b,repl,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r330 missing '+l+' start');const j=s.indexOf(b,i+a.length);if(j<0)throw new Error('r330 missing '+l+' end');return s.slice(0,i)+repl+s.slice(j)};

for(const x of[
 "window.__ctWebBuild='1.0.120';window.__ctOfficialVersion='1.0.120';",
 "const REVISION='r329-official-1.0.120';",
 "const version='1.0.120',revision='r329-official-1.0.120';",
 "window.__ctR329Marker='discover-cache-first-tabs+idle-prefetch+compact-foryou-cards'",
 "window.__ctR328Marker='single-home-rpc+cache-first-nav+natural-history+watched-date'",
 "window.__ctR327Marker='home-r276-anchor+foryou-flex-actions+hard-filters+discover-v327'",
 "const recentP=Promise.resolve(S.loadRecent296?.()).catch(()=>null);",
 "async function topRaw321(provider,force=false){",
 "function card321(x,rank=0){",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR330Marker='home-r274-scroll+discover-demand-only+foryou-actions-owned'",
 "window.__ctR330EnsureForYouActions=ensureForYouActions330",
 "max-height:min(55vh,520px)",
 "version:'1.0.121'"
])must(runtime,x);

/* 1) Stop r310 from deleting Pra voce action rows. */
const clearOld="qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions,.ct309-actions',root).forEach(x=>x.remove());";
must(js,clearOld);
js=js.replace(clearOld,"qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions',root).forEach(x=>x.remove());");

/* 2) Do not block Pra voce on unrelated recent-loading work. */
const slowForYou="const recentP=Promise.resolve(S.loadRecent296?.()).catch(()=>null);\n  const freshP=Promise.all([freshKind('movie'),freshKind('series'),freshKind('anime')]);\n  const [a,fullWatch,freshParts]=await Promise.all([authorityP,watchP,freshP,recentP.then(()=>null).then(()=>freshP)]);";
must(js,slowForYou);
js=js.replace(slowForYou,"void Promise.resolve(S.loadRecent296?.()).catch(()=>null);\n  const freshP=Promise.all([freshKind('movie'),freshKind('series'),freshKind('anime')]);\n  const [a,fullWatch,freshParts]=await Promise.all([authorityP,watchP,freshP]);");

/* 3) Replace r327/r328 natural page-history normalizers with the r330 nested-scroll owner. */
js=between(js,'function normalizeHomeHistory327(){','function homeAnchorTarget327(){',
 "function normalizeHomeHistory327(){return window.__ctR330NormalizeHomeHistory?.()||false}\n",
 'r327 Home normalizer');
js=between(js,'function anchorHome327(){','function scheduleHomeAnchor327(){',
 "function anchorHome327(){return window.__ctR330NormalizeHomeHistory?.()||false}\n",
 'r327 Home anchor');
js=between(js,'function normalizeHistory328(){','function homeTab328(){',
 "function normalizeHistory328(){return window.__ctR330NormalizeHomeHistory?.()||false}\n",
 'r328 Home normalizer');
js=between(js,'function anchorHome328(){','function scheduleAnchor328(){',
 "function anchorHome328(){return window.__ctR330NormalizeHomeHistory?.()||false}\n",
 'r328 Home anchor');

/* Disable older mutation sweeps/toggle re-injection. */
js=js.replaceAll("if(routeNow()==='home')requestAnimationFrame(()=>decorateHomeHistory324(false));","if(false&&routeNow()==='home')requestAnimationFrame(()=>decorateHomeHistory324(false));");
js=js.replaceAll("if(routeNow()==='home')decorateHomeHistory324(false)","if(false&&routeNow()==='home')decorateHomeHistory324(false)");
js=js.replaceAll("if(routeNow()==='home')scheduleHistory326();","if(false&&routeNow()==='home')scheduleHistory326();");
js=js.replaceAll("if(routeNow()==='discover')scheduleActions326();","if(false&&routeNow()==='discover')scheduleActions326();");
js=js.replaceAll("if(routeNow()==='home')normalizeHomeHistory327();","if(false&&routeNow()==='home')normalizeHomeHistory327();");
js=js.replaceAll("if(e.target?.closest?.('[data-home-tab]'))setTimeout(()=>scheduleHomeAnchor327(),0);","if(false&&e.target?.closest?.('[data-home-tab]'))setTimeout(()=>scheduleHomeAnchor327(),0);");
js=js.replaceAll("if(changed){normalizeHistory328();setTimeout(()=>fixHistoryDates328(),0)}","if(false&&changed){normalizeHistory328();setTimeout(()=>fixHistoryDates328(),0)}");
js=js.replaceAll("if(!e.target?.closest?.('[data-home-tab]'))return;\n setTimeout(()=>scheduleAnchor328(),0);","if(!e.target?.closest?.('[data-home-tab]'))return;");

/* 4) Demand-only navigation: no six-tab background source prefetch while user navigates. */
const prefetchCallCount=js.split('schedulePrefetch329();').length-1;
if(prefetchCallCount<3)throw new Error('r330 expected r329 prefetch calls, found '+prefetchCallCount);
js=js.replaceAll('schedulePrefetch329();','void 0;');

/* 5) Pra voce settles through the r330 action owner before r329 layout/cache. */
const settleOld="syncShell329();compactForYou329(document);compactPublic329(document);cacheCurrent329();return true;";
must(js,settleOld);
js=js.replace(settleOld,"syncShell329();window.__ctR330EnsureForYouActions?.(document);compactForYou329(document);compactPublic329(document);cacheCurrent329();return true;");

/* 6) Top 10: two concurrent waves, one personal-filter RPC per wave, no second filter after topRaw. */
const topStart=js.indexOf('async function topRaw321(provider,force=false){');
const topEnd=js.indexOf('function card321(x,rank=0){',topStart);
if(topStart<0||topEnd<0)throw new Error('r330 Top10 anchors missing');
const topFn=[
"async function topRaw321(provider,force=false){",
" const key='r330:'+String(provider),hit=topCache.get(key);",
" if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;",
" const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};",
" const movies=[],series=[],seenM=new Set(),seenT=new Set();",
" async function wave(pages){",
"  const packs=await Promise.all(pages.map(async page=>{",
"   if(testBridge?.topPage){const d=await testBridge.topPage(provider,page);return{page,m:dedupe321(d?.movies||[]),t:dedupe321(d?.series||[])};}",
"   const [m,t]=await Promise.all([tmdbPage321('/discover/movie',{...common,page},'movie'),tmdbPage321('/discover/tv',{...common,page},'tv')]);",
"   return{page,m:dedupe321(m),t:dedupe321(t)};",
"  }));",
"  packs.sort((a,b)=>a.page-b.page);",
"  const batch=dedupe321(packs.flatMap(p=>[...p.m,...p.t]));if(!batch.length)return;",
"  const a=await exact321(batch);",
"  for(const p of packs){",
"   if(movies.length<10)for(const x of p.m){const k=keyOf(x);if(a.blocked.has(k)||seenM.has(k))continue;seenM.add(k);movies.push(x);if(movies.length>=10)break}",
"   if(series.length<10)for(const x of p.t){const k=keyOf(x);if(a.blocked.has(k)||seenT.has(k))continue;seenT.add(k);series.push(x);if(series.length>=10)break}",
"  }",
" }",
" await wave([1,2,3]);",
" if(movies.length<10||series.length<10)await wave([4,5]);",
" const data={movies:movies.slice(0,10),series:series.slice(0,10)};topCache.set(key,{at:Date.now(),rows:data});return data;",
"}",
""
].join('\n');
js=js.slice(0,topStart)+topFn+js.slice(topEnd);

const paintOld="const raw=await topRaw321(provider,force),a=await exact321([...raw.movies,...raw.series]);\n  if(token!==topToken||String(discover?.tab)!=='top10')return false;\n  const movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10),series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);";
must(js,paintOld);
js=js.replace(paintOld,"const raw=await topRaw321(provider,force);\n  if(token!==topToken||String(discover?.tab)!=='top10')return false;\n  const movies=raw.movies.slice(0,10),series=raw.series.slice(0,10);");

/* Expose optimized Top10 for focused browser tests. */
const r321Test="window.__ctR321Test={auth321,candidatePayload321,dedupe321,topRaw321,activityHtml321,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}}};";
must(js,r321Test);

/* Version + runtime. */
js=once(js,"window.__ctWebBuild='1.0.120';window.__ctOfficialVersion='1.0.120';","window.__ctWebBuild='1.0.121';window.__ctOfficialVersion='1.0.121';",'web version');
js=once(js,"const REVISION='r329-official-1.0.120';","const REVISION='r330-official-1.0.121';",'revision');
js=once(js,"const version='1.0.120',revision='r329-official-1.0.120';","const version='1.0.121',revision='r330-official-1.0.121';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v329.js','app-v330.js').replaceAll('app-v329.css','app-v330.css').replaceAll('v1.0.120','v1.0.121').replaceAll('r329-official-1.0.120','r330-official-1.0.121');
sw=sw.replaceAll('ct-web-1.0.120-r329','ct-web-1.0.121-r330').replaceAll('app-v329.js','app-v330.js').replaceAll('app-v329.css','app-v330.css');
css+='\n/* CineTracker Web 1.0.121 r330 — restore r274 history + demand-only Discover + owned ForYou actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.121',
 revision:'r330-official-1.0.121',
 base:'r329-production',
 scope:'performance-recovery+home-history-contract+foryou-action-ownership',
 home_history:'preloaded-internal-scroll-oldest-top-newest-bottom',
 home_history_toggle:false,
 home_history_page_anchor:false,
 home_navigation:'r328-cache-first-preserved',
 home_episode_live_reconcile:'r325-preserved',
 discover_navigation:'cache-first-demand-only',
 discover_prefetch:'disabled-on-navigation',
 discover_foryou_recent_load:'off-critical-path',
 discover_foryou_actions:'owned-rebuilt-3-buttons-one-row',
 discover_foryou_filters:'visible-local-all+movie+series+anime',
 discover_filter_authority:'cinetracker_discover_filter_v327',
 discover_top10:'two-wave-concurrent+max-two-filter-rpcs+fill-ten',
 profile_watchlist_counts:'r324-preserved-exact',
 sports_changes:'none-r330',
 f1_changes:'none-r330',
 web_version_ui:'1.0.121+r330-official-1.0.121',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r330 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v330.js'),js),
 writeFile(resolve(dist,'app-v330.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v329.js'),{force:true}),rm(resolve(dist,'app-v329.css'),{force:true})]);
console.log('WEB_R330_READY performance recovery + Home history + ForYou actions');
