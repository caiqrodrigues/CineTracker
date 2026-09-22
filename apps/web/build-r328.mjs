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
 readFile(resolve(root,'runtime-r328-home-discover-authority.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r328 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r328 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.118';window.__ctOfficialVersion='1.0.118';",
 "const REVISION='r327-official-1.0.118';",
 "const version='1.0.118',revision='r327-official-1.0.118';",
 "cinetracker_discover_filter_v326",
 "async function loadForYou321(force=false){",
 "async function tmdbPage321(path,params,type){",
 "async function topRaw321(provider,force=false){",
 "window.__ctR327Marker='home-page-scroll-reset+foryou-flex-filters+top10-ten-grid+providers-clean+fast-nav'",
 "window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR328Marker='r276-home-anchor+owned-foryou-one-row+visible-filters+strict-discover'",
 "homeAnchor328",
 "paintForYou328",
 "data-ct328-fy-kind",
 "grid-template-columns:repeat(3,minmax(0,1fr))"
])must(runtime,x);

/* Replace Pra Voce producer: candidates are still built by r309 and validated by v326,
   but the final paint is owned by r328, so no legacy action layout can repaint it. */
const fyStart=js.indexOf('async function loadForYou321(force=false){');
const fyEnd=js.indexOf('async function tmdbPage321(path,params,type){',fyStart);
if(fyStart<0||fyEnd<0)throw new Error('r328 ForYou anchors missing');
const fyFn=[
"async function loadForYou321(force=false){",
" const token=++loadToken;loading321('Montando recomendações…');",
" try{",
"  if(!window.__ctR309?.buildForYou||!window.__ctR309Test?.composeForYou)throw new Error('Recomendações indisponíveis.');",
"  if(force||!window.__ctR309Test.state)await window.__ctR309.buildForYou(!!force);",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  const base=window.__ctR309Test.state;if(!base)throw new Error('Recomendações indisponíveis.');",
"  const flatten=obj=>['movie','series','anime'].flatMap(k=>rows(obj?.[k]));",
"  let watch=dedupe321(flatten(base.watchPools));",
"  let fresh=dedupe321([...flatten(base.freshPools),...rows(base.dailyPool)]);",
"  const a=await exact321([...watch,...fresh]);",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  watch=watch.filter(x=>{const k=keyOf(x);return a.watch.has(k)&&!a.seen.has(k)&&!a.notInterested.has(k)});",
"  fresh=fresh.filter(x=>!a.blocked.has(keyOf(x)));",
"  const cat=x=>{try{return window.__ctR309Test.category(x)}catch{return typeOf(x)==='movie'?'movie':'series'}};",
"  const counts=()=>{const c={movie:0,series:0,anime:0};for(const x of fresh){const k=cat(x);c[k]=(c[k]||0)+1}return c};",
"  const c=counts(),missing=['movie','series','anime'].filter(k=>c[k]<(k==='movie'?4:2));",
"  if(missing.length&&token===loadToken){",
"   const jobs=[];",
"   for(const k of missing){",
"    const page=3;",
"    if(k==='movie')jobs.push(tmdbPage321('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':40,'primary_release_date.lte':new Date().toISOString().slice(0,10)},'movie'));",
"    else if(k==='anime')jobs.push(tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_origin_country:'JP','vote_average.gte':7,'vote_count.gte':20,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'));",
"    else jobs.push(tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':35,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'));",
"   }",
"   const extra=dedupe321((await Promise.all(jobs)).flat());",
"   if(extra.length&&token===loadToken){const ea=await exact321(extra);fresh=dedupe321([...fresh,...extra.filter(x=>!ea.blocked.has(keyOf(x)))])}",
"  }",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  const draft=window.__ctR309Test.composeForYou(watch,fresh,{}, {trust:true});",
"  window.__ctR309Test.setForYouState(draft);",
"  discover.forYou={watch:Object.values(draft.initial.watch).filter(Boolean),fresh:Object.values(draft.initial.fresh).filter(Boolean),picks:draft.initial.daily?[draft.initial.daily]:[]};",
"  if(!window.__ctR328?.paintForYou?.())throw new Error('Renderer final do Pra você indisponível.');",
"  window.__ctR328.ensureFilters?.();loaded321();return draft.complete;",
" }catch(e){",
"  if(token===loadToken){const h=host();if(h)h.innerHTML='<div class="empty">'+esc(e?.message||'Não foi possível montar as recomendações agora.')+'<br><button class="chip" type="button" data-ct321-retry>Tentar novamente</button></div>';loaded321()}",
"  return false;",
" }",
"}",
""
].join('\n');
js=js.slice(0,fyStart)+fyFn+js.slice(fyEnd);

/* Top 10 keeps strict v326 validation but avoids six simultaneous TMDB calls on entry.
   Pages 1-2 first; only fetch more while the user is still on Top 10 and fewer than ten survived. */
const topStart=js.indexOf('async function topRaw321(provider,force=false){');
const topEnd=js.indexOf('function card321(x,rank=0){',topStart);
if(topStart<0||topEnd<0)throw new Error('r328 TopRaw anchors missing');
const topFn=[
"async function topRaw321(provider,force=false){",
" const key='r328:'+String(provider),hit=topCache.get(key);",
" if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;",
" const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};",
" const movies=[],series=[],seenM=new Set(),seenT=new Set();",
" const consume=async pages=>{",
"  if(String(discover?.tab)!=='top10')return false;",
"  const pageRows=await Promise.all(pages.map(async page=>{",
"   if(testBridge?.topPage){const d=await testBridge.topPage(provider,page);return{m:dedupe321(d?.movies||[]),t:dedupe321(d?.series||[])}}",
"   const [m,t]=await Promise.all([tmdbPage321('/discover/movie',{...common,page},'movie'),tmdbPage321('/discover/tv',{...common,page},'tv')]);",
"   return{m:dedupe321(m),t:dedupe321(t)};",
"  }));",
"  if(String(discover?.tab)!=='top10')return false;",
"  const batch=dedupe321(pageRows.flatMap(x=>[...x.m,...x.t]));if(!batch.length)return true;",
"  const a=await exact321(batch);if(String(discover?.tab)!=='top10')return false;",
"  for(const x of pageRows){",
"   for(const m of x.m){const k=keyOf(m);if(movies.length>=10)break;if(a.blocked.has(k)||seenM.has(k))continue;seenM.add(k);movies.push(m)}",
"   for(const t of x.t){const k=keyOf(t);if(series.length>=10)break;if(a.blocked.has(k)||seenT.has(k))continue;seenT.add(k);series.push(t)}",
"  }",
"  return true;",
" };",
" await consume([1,2]);",
" if(String(discover?.tab)==='top10'&&(movies.length<10||series.length<10))await consume([3]);",
" if(String(discover?.tab)==='top10'&&(movies.length<10||series.length<10))await consume([4,5]);",
" const data={movies:movies.slice(0,10),series:series.slice(0,10)};",
" if(String(discover?.tab)==='top10')topCache.set(key,{at:Date.now(),rows:data});",
" return data;",
"}",
""
].join('\n');
js=js.slice(0,topStart)+topFn+js.slice(topEnd);

js=once(js,"window.__ctWebBuild='1.0.118';window.__ctOfficialVersion='1.0.118';","window.__ctR328Build='r276-home-anchor+owned-foryou+strict-v326';window.__ctWebBuild='1.0.119';window.__ctOfficialVersion='1.0.119';",'web version');
js=once(js,"const REVISION='r327-official-1.0.118';","const REVISION='r328-official-1.0.119';",'revision');
js=once(js,"const version='1.0.118',revision='r327-official-1.0.118';","const version='1.0.119',revision='r328-official-1.0.119';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v327.js','app-v328.js').replaceAll('app-v327.css','app-v328.css').replaceAll('v1.0.118','v1.0.119').replaceAll('r327-official-1.0.118','r328-official-1.0.119');
sw=sw.replaceAll('ct-web-1.0.118-r327','ct-web-1.0.119-r328').replaceAll('app-v327.js','app-v328.js').replaceAll('app-v327.css','app-v328.css');
css+='\n/* CineTracker Web 1.0.119 r328 — r276 Home anchor + owned Pra Voce renderer + strict Discover. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.119',
 revision:'r328-official-1.0.119',
 base:'r327-production',
 scope:'home-r276-anchor+owned-foryou-layout+visible-filters+strict-discover+faster-tab-switch',
 home_history_behavior:'r276-history-above-initial-viewport-newest-nearest-content',
 home_history_toggle:false,
 home_history_inner_scroll:false,
 home_initial_anchor:'series-assistir-a-seguir+movies-assistir-a-seguir-watchlist',
 home_tab_switch:'window-scroll-reset-to-exact-tab-anchor',
 home_episode_live_reconcile:'r325-preserved',
 discover_filter_authority:'cinetracker_discover_filter_v326',
 discover_foryou_renderer:'r328-owned-no-legacy-action-layout',
 discover_foryou_filters:'always-visible-all+movies+series+anime',
 discover_foryou_actions:'watchlist+seen+swap-single-row-3-columns',
 discover_foryou_cards:'equal-2x3-max-154px',
 discover_public_exclusion:'v326-seen+progress+up-to-date+completed+watchlist+watchlater+not-interested-before-paint',
 discover_top10:'v326-filtered-fill-to-ten-progressive-pages',
 discover_navigation:'stale-top10-stops-before-refill',
 discover_calendar:'watchlist-exception-preserved',
 profile_watchlist_counts:'r324-preserved-exact',
 profile_watchlist_sort:'r324-preserved',
 web_version_ui:'1.0.119+r328-official-1.0.119',
 sports_changes:'none-r328',
 f1_changes:'none-r328',
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
console.log('WEB_R328_READY exact Home anchor + owned Pra Voce + strict Discover');
