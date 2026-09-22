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
 readFile(resolve(root,'runtime-r327-home-discover-stable.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r327 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r327 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';",
 "const REVISION='r326-official-1.0.117';",
 "const version='1.0.117',revision='r326-official-1.0.117';",
 "cinetracker_discover_filter_v326",
 "async function loadForYou321(force=false){",
 "async function tmdbPage321(path,params,type){",
 "async function topRaw321(provider,force=false){",
 "function card321(x,rank=0){",
 "async function paintTop321(provider,token,force=false){",
 "async function loadTop321(force=false){",
 "window.__ctR326Marker='home-history-scroll-up+discover-compact-actions+strict-v326'",
 "window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR327Marker='home-page-scroll-reset+foryou-flex-filters+top10-ten-grid+providers-clean+fast-nav'",
 "resetHomePosition327",
 "applyForYouFilter327",
 "providerAllowed327",
 "grid-template-columns:repeat(10,minmax(0,1fr))"
])must(runtime,x);

const fyStart=js.indexOf('async function loadForYou321(force=false){');
const fyEnd=js.indexOf('async function tmdbPage321(path,params,type){',fyStart);
if(fyStart<0||fyEnd<0)throw new Error('r327 ForYou anchors missing');
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
"  watch=watch.filter(x=>{const k=keyOf(x);return a.watch.has(k)&&!a.seen.has(k)&&!a.notInterested.has(k)});",
"  fresh=fresh.filter(x=>!a.blocked.has(keyOf(x)));",
"  const cat=x=>{try{return window.__ctR309Test.category(x)}catch{return typeOf(x)==='movie'?'movie':'series'}};",
"  const counts=()=>{const c={movie:0,series:0,anime:0};for(const x of fresh){const k=cat(x);c[k]=(c[k]||0)+1}return c};",
"  const c=counts(),missing=['movie','series','anime'].filter(k=>c[k]<(k==='movie'?4:2));",
"  if(missing.length){",
"   const jobs=[];",
"   for(const k of missing)for(const page of [3,4]){",
"    if(k==='movie')jobs.push(tmdbPage321('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':40,'primary_release_date.lte':new Date().toISOString().slice(0,10)},'movie'));",
"    else if(k==='anime')jobs.push(tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_origin_country:'JP','vote_average.gte':7,'vote_count.gte':20,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'));",
"    else jobs.push(tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':35,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'));",
"   }",
"   const extra=dedupe321((await Promise.all(jobs)).flat());",
"   if(extra.length){const ea=await exact321(extra);fresh=dedupe321([...fresh,...extra.filter(x=>!ea.blocked.has(keyOf(x)))])}",
"  }",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  const draft=window.__ctR309Test.composeForYou(watch,fresh,{}, {trust:true});",
"  window.__ctR309Test.setForYouState(draft);",
"  discover.forYou={watch:Object.values(draft.initial.watch).filter(Boolean),fresh:Object.values(draft.initial.fresh).filter(Boolean),picks:draft.initial.daily?[draft.initial.daily]:[]};",
"  await window.__ctR309.buildForYou(false);",
"  window.__ctR327?.applyForYouFilter?.();loaded321();return draft.complete;",
" }catch(e){",
"  if(token===loadToken){const h=host();if(h)h.innerHTML='<div class=\"empty\">'+esc(e?.message||'Não foi possível montar as recomendações agora.')+'<br><button class=\"chip\" type=\"button\" data-ct321-retry>Tentar novamente</button></div>';loaded321()}",
"  return false;",
" }",
"}",
""
].join('\n');
js=js.slice(0,fyStart)+fyFn+js.slice(fyEnd);

const topStart=js.indexOf('async function topRaw321(provider,force=false){');
const topEnd=js.indexOf('function card321(x,rank=0){',topStart);
if(topStart<0||topEnd<0)throw new Error('r327 TopRaw anchors missing');
const topFn=[
"async function topRaw321(provider,force=false){",
" const key='r327:'+String(provider),hit=topCache.get(key);",
" if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;",
" const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};",
" const movies=[],series=[],seenM=new Set(),seenT=new Set();",
" const consume=async pages=>{",
"  const pageRows=await Promise.all(pages.map(async page=>{",
"   if(testBridge?.topPage){const d=await testBridge.topPage(provider,page);return{m:dedupe321(d?.movies||[]),t:dedupe321(d?.series||[])}}",
"   const [m,t]=await Promise.all([tmdbPage321('/discover/movie',{...common,page},'movie'),tmdbPage321('/discover/tv',{...common,page},'tv')]);",
"   return{m:dedupe321(m),t:dedupe321(t)};",
"  }));",
"  const batch=dedupe321(pageRows.flatMap(x=>[...x.m,...x.t]));if(!batch.length)return;",
"  const a=await exact321(batch);",
"  for(const x of pageRows){",
"   for(const m of x.m){const k=keyOf(m);if(movies.length>=10)break;if(a.blocked.has(k)||seenM.has(k))continue;seenM.add(k);movies.push(m)}",
"   for(const t of x.t){const k=keyOf(t);if(series.length>=10)break;if(a.blocked.has(k)||seenT.has(k))continue;seenT.add(k);series.push(t)}",
"  }",
" };",
" await consume([1,2,3]);",
" if(movies.length<10||series.length<10)await consume([4,5]);",
" const data={movies:movies.slice(0,10),series:series.slice(0,10)};topCache.set(key,{at:Date.now(),rows:data});return data;",
"}",
""
].join('\n');
js=js.slice(0,topStart)+topFn+js.slice(topEnd);

const paintStart=js.indexOf('async function paintTop321(provider,token,force=false){');
const paintEnd=js.indexOf('async function loadTop321(force=false){',paintStart);
if(paintStart<0||paintEnd<0)throw new Error('r327 PaintTop anchors missing');
const paintFn=[
"async function paintTop321(provider,token,force=false){",
" const content=q('[data-ct321-top-content]');if(!content||token!==topToken||String(discover?.tab)!=='top10')return false;",
" content.innerHTML='<div class=\"ct263-loading\">Montando Top 10…</div>';",
" try{",
"  const raw=await topRaw321(provider,force);",
"  if(token!==topToken||String(discover?.tab)!=='top10')return false;",
"  const movies=raw.movies.slice(0,10),series=raw.series.slice(0,10);",
"  let name='Streaming';try{name=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider))?.provider_name||name}catch{}",
"  content.innerHTML='<div class=\"ct288-top-name\"><b>'+esc(name)+'</b></div>'+",
"   '<section class=\"panel ct288-top-section\"><div class=\"panel-head\"><h2>Top 10 Séries</h2><small>'+series.length+'</small></div><div class=\"ct319-top-row\">'+(series.map((x,i)=>card321(x,i+1)).join('')||'<div class=\"empty\">Sem séries elegíveis neste streaming.</div>')+'</div></section>'+",
"   '<section class=\"panel ct288-top-section\"><div class=\"panel-head\"><h2>Top 10 Filmes</h2><small>'+movies.length+'</small></div><div class=\"ct319-top-row\">'+(movies.map((x,i)=>card321(x,i+1)).join('')||'<div class=\"empty\">Sem filmes elegíveis neste streaming.</div>')+'</div></section>';",
"  loaded321();return true;",
" }catch(e){content.innerHTML='<div class=\"empty\">'+esc(e?.message||'Não foi possível carregar o Top 10 agora.')+'</div>';loaded321();return false}",
"}",
""
].join('\n');
js=js.slice(0,paintStart)+paintFn+js.slice(paintEnd);

const providersOld="const providers=typeof ct171Providers==='function'?await ct171Providers():[];";
const loadTopStart=js.indexOf('async function loadTop321(force=false){');
const providerAt=js.indexOf(providersOld,loadTopStart);
if(loadTopStart<0||providerAt<0)throw new Error('r327 Top10 provider anchor missing');
const providersNew="const providers=(typeof ct171Providers==='function'?await ct171Providers():[]).filter(p=>!/(mubi|looke|loki)/i.test(String(p?.provider_name||'')));";
js=js.slice(0,providerAt)+providersNew+js.slice(providerAt+providersOld.length);

const marker="window.__ctR327Build='home-page-scroll+fast-discover+ten-grid';";
js=once(js,"window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';",marker+"window.__ctWebBuild='1.0.118';window.__ctOfficialVersion='1.0.118';",'web version');
js=once(js,"const REVISION='r326-official-1.0.117';","const REVISION='r327-official-1.0.118';",'revision');
js=once(js,"const version='1.0.117',revision='r326-official-1.0.117';","const version='1.0.118',revision='r327-official-1.0.118';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v326.js','app-v327.js').replaceAll('app-v326.css','app-v327.css').replaceAll('v1.0.117','v1.0.118').replaceAll('r326-official-1.0.117','r327-official-1.0.118');
sw=sw.replaceAll('ct-web-1.0.117-r326','ct-web-1.0.118-r327').replaceAll('app-v326.js','app-v327.js').replaceAll('app-v326.css','app-v327.css');
css+='\n/* CineTracker Web 1.0.118 r327 — Home reveal-by-page-scroll + fast Discover + 10-up Top10. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.118',
 revision:'r327-official-1.0.118',
 base:'r326-production',
 scope:'preserve-r324-r326+home-page-scroll+discover-performance-layout',
 home_history_behavior:'normal-document-flow-history-above-content-newest-nearest-anchor',
 home_history_toggle:false,
 home_history_inner_scroll:false,
 home_tab_switch:'reset-to-first-normal-section-every-series-movies-switch',
 home_history_authority:'cinetracker_home_history_v324',
 home_episode_live_reconcile:'r325-preserved',
 discover_filter_authority:'cinetracker_discover_filter_v326',
 discover_filter_match:'authenticated-all-user-media-tmdb-or-localized-original-title-year',
 discover_foryou:'single-authority-pass+one-parallel-refill+direct-working-filters',
 discover_foryou_actions:'watchlist+seen+swap-flex-one-row-minimal',
 discover_public_actions:'watchlist+seen-one-row-compact',
 discover_top10:'ten-eligible-after-v326-batched-pages',
 discover_top10_layout:'10-cards-visible-grid',
 discover_top10_excluded_providers:'Mubi+Looke',
 discover_calendar:'watchlist-exception-preserved',
 profile_watchlist_counts:'r324-preserved-exact',
 profile_watchlist_sort:'r324-preserved',
 navigation_performance:'remove-sequential-five-pass-foryou-and-top10-rpc-loop',
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
console.log('WEB_R327_READY Home page-scroll + fast Discover + ten-grid Top10');
