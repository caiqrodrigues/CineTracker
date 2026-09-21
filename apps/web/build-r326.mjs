import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r325.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v325.js'),'utf8'),
 readFile(resolve(dist,'app-v325.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r326-home-discover-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r326 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r326 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.116';window.__ctOfficialVersion='1.0.116';",
 "const REVISION='r325-official-1.0.116';",
 "const version='1.0.116',revision='r325-official-1.0.116';",
 "cinetracker_discover_filter_v324",
 "async function loadForYou321(force=false){",
 "async function tmdbPage321(path,params,type){",
 "window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR326Marker='home-history-scroll-up+discover-compact-actions+strict-v326'",
 "restoreHomeHistory326",
 "compactDiscoverActions326",
 "data-ct326-fy-filtering"
])must(runtime,x);

js=js.replaceAll('cinetracker_discover_filter_v324','cinetracker_discover_filter_v326');

const fyStart=js.indexOf('async function loadForYou321(force=false){');
const fyEnd=js.indexOf('async function tmdbPage321(path,params,type){',fyStart);
if(fyStart<0||fyEnd<0)throw new Error('r326 ForYou anchors missing');
const fyFn=[
"async function loadForYou321(force=false){",
" const token=++loadToken;loading321('Montando recomendações…');document.documentElement.dataset.ct326FyFiltering='1';",
" try{",
"  if(!window.__ctR309?.buildForYou||!window.__ctR309Test?.composeForYou)throw new Error('Recomendações indisponíveis.');",
"  if(force||!window.__ctR309Test.state)await window.__ctR309.buildForYou(!!force);",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  const base=window.__ctR309Test.state;if(!base)throw new Error('Recomendações indisponíveis.');",
"  const flatten=(obj)=>['movie','series','anime'].flatMap(k=>rows(obj?.[k]));",
"  let watch=dedupe321(flatten(base.watchPools));",
"  let fresh=dedupe321([...flatten(base.freshPools),...rows(base.dailyPool)]);",
"  let a=await exact321([...watch,...fresh]);",
"  watch=watch.filter(x=>{const k=keyOf(x);return a.watch.has(k)&&!a.seen.has(k)&&!a.notInterested.has(k)});",
"  fresh=fresh.filter(x=>!a.blocked.has(keyOf(x)));",
"  const cat=x=>{try{return window.__ctR309Test.category(x)}catch{return typeOf(x)==='movie'?'movie':'series'}};",
"  const enough=()=>{const c={movie:0,series:0,anime:0};for(const x of fresh)c[cat(x)]=(c[cat(x)]||0)+1;return c.movie>=5&&c.series>=3&&c.anime>=3};",
"  for(let page=1;page<=5&&!enough();page++){",
"   const parts=await Promise.all([",
"    tmdbPage321('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':40,'primary_release_date.lte':new Date().toISOString().slice(0,10)},'movie'),",
"    tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':35,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'),",
"    tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_origin_country:'JP','vote_average.gte':7,'vote_count.gte':20,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv')",
"   ]);",
"   const batch=dedupe321(parts.flat());if(!batch.length)continue;",
"   const ba=await exact321(batch);",
"   fresh=dedupe321([...fresh,...batch.filter(x=>!ba.blocked.has(keyOf(x)))]);",
"  }",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  const draft=window.__ctR309Test.composeForYou(watch,fresh,{}, {trust:true});",
"  window.__ctR309Test.setForYouState(draft);",
"  discover.forYou={watch:Object.values(draft.initial.watch).filter(Boolean),fresh:Object.values(draft.initial.fresh).filter(Boolean),picks:draft.initial.daily?[draft.initial.daily]:[]};",
"  await window.__ctR309.buildForYou(false);",
"  O.applyForYouFilter?.();loaded321();return draft.complete;",
" }catch(e){",
"  if(token===loadToken){const h=host();if(h)h.innerHTML='<div class=\"empty\">'+esc(e?.message||'Não foi possível montar as recomendações agora.')+'<br><button class=\"chip\" type=\"button\" data-ct321-retry>Tentar novamente</button></div>';loaded321()}",
"  return false;",
" }finally{delete document.documentElement.dataset.ct326FyFiltering}",
"}",
""
].join('\n');
js=js.slice(0,fyStart)+fyFn+js.slice(fyEnd);

const marker="window.__ctR326Build='strict-discover+scroll-history';";
js=once(js,"window.__ctWebBuild='1.0.116';window.__ctOfficialVersion='1.0.116';",marker+"window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';",'web version');
js=once(js,"const REVISION='r325-official-1.0.116';","const REVISION='r326-official-1.0.117';",'revision');
js=once(js,"const version='1.0.116',revision='r325-official-1.0.116';","const version='1.0.117',revision='r326-official-1.0.117';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v325.js','app-v326.js').replaceAll('app-v325.css','app-v326.css').replaceAll('v1.0.116','v1.0.117').replaceAll('r325-official-1.0.116','r326-official-1.0.117');
sw=sw.replaceAll('ct-web-1.0.116-r325','ct-web-1.0.117-r326').replaceAll('app-v325.js','app-v326.js').replaceAll('app-v325.css','app-v326.css');
css+='\n/* CineTracker Web 1.0.117 r326 — Home history scroll-up + strict Discover + compact actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.117',
 revision:'r326-official-1.0.117',
 base:'r325-production',
 scope:'home-history-scroll-behavior+discover-strict-rules+foryou-actions',
 home_history_behavior:'always-rendered-scroll-oldest-top-newest-bottom-auto-bottom',
 home_history_toggle:false,
 home_history_authority:'cinetracker_home_history_v324',
 home_series_watch_state:'cinetracker_home_series_watch_state_v2',
 home_episode_live_reconcile:'r325-preserved',
 discover_filter_authority:'cinetracker_discover_filter_v326',
 discover_filter_match:'all-user-media-tmdb-or-localized-original-title-year',
 discover_foryou:'exact-watchlist-unseen+strict-fresh-refill-before-paint',
 discover_foryou_actions:'watchlist+seen+swap-one-row-compact',
 discover_public_actions:'watchlist+seen-one-row-compact',
 discover_top10:'fill-to-ten-after-v326-exclusions-up-to-five-pages',
 discover_calendar:'watchlist-exception-preserved',
 profile_watchlist_counts:'r324-preserved-exact',
 web_version_ui:'1.0.117+r326-official-1.0.117',
 sports_changes:'none-r326',
 f1_changes:'none-r326',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r326 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v326.js'),js),
 writeFile(resolve(dist,'app-v326.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v325.js'),{force:true}),rm(resolve(dist,'app-v325.css'),{force:true})]);
console.log('WEB_R326_READY Home history scroll + strict Discover + compact actions');
