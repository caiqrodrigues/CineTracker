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
 readFile(resolve(root,'runtime-r332-home-discover-stable.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r332 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r332 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';",
 "const REVISION='r326-official-1.0.117';",
 "const version='1.0.117',revision='r326-official-1.0.117';",
 "window.__ctR326Marker='home-history-scroll-up+discover-compact-actions+strict-v326'",
 "window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'",
 "cinetracker_discover_filter_v326",
 "async function loadForYou321(force=false){",
 "async function tmdbPage321(path,params,type){",
 "for(let page=1;page<=5&&(movies.length<10||series.length<10);page++){",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR332Marker='home-v332-watchlist+natural-history+foryou-compact+top10-ten-grid-no-looke-mubi'",
 "cinetracker_home_payload_v332",
 "filterProviders332",
 "version:'1.0.123'"
])must(runtime,x);

/* Use the strongest deployed personal exclusion authority, including watch-play history and aliases. */
js=js.replaceAll('cinetracker_discover_filter_v326','cinetracker_discover_filter_v327');

/* Replace Pra voce loader: canonical Watchlist RPC + exact v327 exclusion before composition. */
const fyStart=js.indexOf('async function loadForYou321(force=false){');
const fyEnd=js.indexOf('async function tmdbPage321(path,params,type){',fyStart);
if(fyStart<0||fyEnd<0)throw new Error('r332 ForYou anchors missing');
const fyFn=[
"async function loadForYou321(force=false){",
" const token=++loadToken;loading321('Montando recomendações…');",
" try{",
"  if(!window.__ctR309Test?.composeForYou)throw new Error('Recomendações indisponíveis.');",
"  const watchP=testBridge?.watchRows?Promise.resolve(testBridge.watchRows()):(typeof rpc==='function'?rpc('cinetracker_watchlist_full_v119',{}):Promise.resolve({rows:[]}));",
"  const freshPage=async(page)=>testBridge?.freshPage?Promise.resolve(testBridge.freshPage(page)):Promise.all([",
"   tmdbPage321('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,'primary_release_date.lte':new Date().toISOString().slice(0,10)},'movie'),",
"   tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':60,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'),",
"   tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5,'vote_count.gte':25,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv')",
"  ]);",
"  const [watchPayload,firstParts]=await Promise.all([watchP,freshPage(1)]);",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  const cat=x=>{try{return window.__ctR309Test.category(x)}catch{return typeOf(x)==='movie'?'movie':'series'}};",
"  const groups={movie:[],series:[],anime:[]};",
"  for(const x of dedupe321(rows(watchPayload?.rows||watchPayload))){const k=cat(x);if(groups[k]&&groups[k].length<40)groups[k].push(x)}",
"  let watch=dedupe321([...groups.movie,...groups.series,...groups.anime]);",
"  let fresh=dedupe321(firstParts.flat());",
"  let a=await exact321([...watch,...fresh]);",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  watch=watch.filter(x=>{const k=keyOf(x);return a.watch.has(k)&&!a.seen.has(k)&&!a.notInterested.has(k)});",
"  fresh=fresh.filter(x=>!a.blocked.has(keyOf(x)));",
"  const enough=()=>{const c={movie:0,series:0,anime:0};for(const x of fresh)c[cat(x)]=(c[cat(x)]||0)+1;return c.movie>=5&&c.series>=3&&c.anime>=3};",
"  for(let page=2;page<=5&&!enough()&&token===loadToken&&routeNow()==='discover'&&String(discover?.tab)==='foryou';page++){",
"   const parts=await freshPage(page);",
"   if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"   const batch=dedupe321(parts.flat());if(!batch.length)continue;",
"   const ba=await exact321(batch);",
"   if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"   fresh=dedupe321([...fresh,...batch.filter(x=>!ba.blocked.has(keyOf(x)))]);",
"  }",
"  const draft=window.__ctR309Test.composeForYou(watch,fresh,{}, {trust:true});",
"  window.__ctR309Test.setForYouState(draft);",
"  discover.forYou={watch:Object.values(draft.initial.watch).filter(Boolean),fresh:Object.values(draft.initial.fresh).filter(Boolean),picks:draft.initial.daily?[draft.initial.daily]:[]};",
"  await window.__ctR309.buildForYou(false);",
"  try{window.__ctR332?.settleForYou?.()}catch{}",
"  loaded321();return draft.complete;",
" }catch(e){",
"  if(token===loadToken){const h=host();if(h)h.innerHTML='<div class=\"empty\">'+esc(e?.message||'Não foi possível montar as recomendações agora.')+'<br><button class=\"chip\" type=\"button\" data-ct321-retry>Tentar novamente</button></div>';loaded321()}",
"  return false;",
" }",
"}",
""
].join('\n');
js=js.slice(0,fyStart)+fyFn+js.slice(fyEnd);

/* Long Top 10 fills stop instantly after navigation. */
js=js.replace(
 "for(let page=1;page<=5&&(movies.length<10||series.length<10);page++){",
 "for(let page=1;page<=5&&(movies.length<10||series.length<10)&&routeNow()==='discover'&&String(discover?.tab)==='top10';page++){"
);
js=js.replace(
 "  const batch=dedupe321([...m,...t]);if(!batch.length)continue;\n  const a=await exact321(batch);",
 "  if(routeNow()!=='discover'||String(discover?.tab)!=='top10')break;\n  const batch=dedupe321([...m,...t]);if(!batch.length)continue;\n  const a=await exact321(batch);"
);

/* Every swap repaints through the final r332 layout/filter owner. */
js=js.replace(
 "paintForYou();void recordVisible();return true;",
 "paintForYou();try{window.__ctR332?.settleForYou?.()}catch{}void recordVisible();return true;"
);

/* Retire broad DOM sweeps from r324/r326 that caused tab-switch contention. */
js=js.replaceAll("if(routeNow()==='home')requestAnimationFrame(()=>decorateHomeHistory324(false));","if(false&&routeNow()==='home')requestAnimationFrame(()=>decorateHomeHistory324(false));");
js=js.replaceAll("if(routeNow()==='home')decorateHomeHistory324(false)","if(false&&routeNow()==='home')decorateHomeHistory324(false)");
js=js.replaceAll("if(routeNow()==='home')scheduleHistory326();","if(false&&routeNow()==='home')scheduleHistory326();");
js=js.replaceAll("if(routeNow()==='discover')scheduleActions326();","if(false&&routeNow()==='discover')scheduleActions326();");
js=js.replaceAll("if(routeNow()==='home')setTimeout(scheduleHistory326,30);","if(false&&routeNow()==='home')setTimeout(scheduleHistory326,30);");
js=js.replaceAll("if(routeNow()==='discover')setTimeout(scheduleActions326,30);","if(false&&routeNow()==='discover')setTimeout(scheduleActions326,30);");

/* Version + final runtime. */
js=once(js,"window.__ctWebBuild='1.0.117';window.__ctOfficialVersion='1.0.117';","window.__ctWebBuild='1.0.123';window.__ctOfficialVersion='1.0.123';",'web version');
js=once(js,"const REVISION='r326-official-1.0.117';","const REVISION='r332-official-1.0.123';",'revision');
js=once(js,"const version='1.0.117',revision='r326-official-1.0.117';","const version='1.0.123',revision='r332-official-1.0.123';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v326.js','app-v332.js').replaceAll('app-v326.css','app-v332.css').replaceAll('v1.0.117','v1.0.123').replaceAll('r326-official-1.0.117','r332-official-1.0.123');
sw=sw.replaceAll('ct-web-1.0.117-r326','ct-web-1.0.123-r332').replaceAll('app-v326.js','app-v332.js').replaceAll('app-v326.css','app-v332.css');
css+='\n/* CineTracker Web 1.0.123 r332 — synced Home Watchlist + natural history + stable Discover. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.123',
 revision:'r332-official-1.0.123',
 base:'r326-last-green',
 scope:'home-watchlist-sync+history-natural-anchor+discover-v327+foryou-layout+top10-grid',
 home_payload:'cinetracker_home_payload_v332',
 home_movie_watchlist:'watchlist-full-v119-latest-added',
 home_history_behavior:'natural-page-above-initial-viewport-oldest-top-newest-nearest-anchor',
 home_history_toggle:false,
 home_history_inner_scroll:false,
 home_episode_live_reconcile:'r325-preserved',
 discover_filter_authority:'cinetracker_discover_filter_v327',
 discover_filter_match:'tmdb+catalog-aliases+all-user-aliases+watch-play-events',
 discover_foryou:'canonical-watchlist-unseen+strict-fresh-v327-before-compose',
 discover_foryou_filter_ui:'always-visible-todos+filmes+series+animes',
 discover_foryou_actions:'three-compact-buttons-card-width-one-row',
 discover_public_actions:'watchlist+seen-one-row-compact',
 discover_top10:'fill-to-ten+v327-before-paint+abort-on-navigation',
 discover_top10_providers:'without-looke+mubi',
 discover_top10_layout:'ten-columns-no-horizontal-scroll-desktop',
 discover_navigation:'finite-layout-settle+abortable-refills',
 profile_watchlist_counts:'r324-preserved-exact',
 sports_changes:'none-r332',
 f1_changes:'none-r332',
 web_version_ui:'1.0.123+r332-official-1.0.123',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r332 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v332.js'),js),
 writeFile(resolve(dist,'app-v332.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v326.js'),{force:true}),rm(resolve(dist,'app-v326.css'),{force:true})]);
console.log('WEB_R332_READY Home Watchlist synced + natural history + stable Discover');
