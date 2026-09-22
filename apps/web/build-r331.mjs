import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r330.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v330.js'),'utf8'),
 readFile(resolve(dist,'app-v330.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r331-home-nav-discover.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r331 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r331 expected one '+l+', found '+n);return s.replace(a,b)};
const range=(s,start,end,next,label)=>{
 const a=s.indexOf(start),b=s.indexOf(end,a+start.length);
 if(a<0||b<0||b<=a)throw new Error('r331 range '+label+' missing');
 return s.slice(0,a)+next+'\n'+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.121';window.__ctOfficialVersion='1.0.121';",
 "const REVISION='r330-official-1.0.121';",
 "const version='1.0.121',revision='r330-official-1.0.121';",
 "window.__ctR330Marker='home-immediate-paint+cancel-stale-reconcile+discover-buttons-grid+top10-up-no-provider-duplicate'",
 "if(baseFetchHome325){",
 "async function ct274HydrateHome(){",
 "async function ct274RenderHome(seq){",
 "try{homeCache=null;window.__ct0997PreloadedHomeLive=null}catch{}",
 "setTimeout(()=>{if(routeNow()==='home')void refreshTv325(false)},1600);",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR331Marker='home-cache-first+history-natural-scroll+discover-foryou-final-guard'",
 "html[data-ct326-fy-filtering=\"1\"] [data-ct329-foryou]",
 "grid-template-columns:repeat(3,minmax(0,1fr))"
])must(runtime,x);

/* r325's second history RPC is useful for the 50-item history, but it must not block Home.
   First paint uses the r323/base payload; the expanded history is merged in the background. */
const fastHistory=[
"let ct331HistoryCache=null,ct331HistoryTask=null,ct331HistoryAt=0;",
"async function ct331RefreshHistory(force=false){",
" if(!force&&ct331HistoryCache&&Date.now()-ct331HistoryAt<60000)return ct331HistoryCache;",
" if(ct331HistoryTask&&!force)return ct331HistoryTask;",
" ct331HistoryTask=(async()=>{",
"  try{",
"   const h=testBridge?.homeHistory?await testBridge.homeHistory():(typeof rpc==='function'?await rpc('cinetracker_home_history_v324',{p_limit:50}):null);",
"   if(h&&typeof h==='object'){ct331HistoryCache=h;ct331HistoryAt=Date.now();window.__ctR331HomeHistoryAt=ct331HistoryAt}",
"   return h;",
"  }catch{return null}finally{ct331HistoryTask=null}",
" })();",
" return ct331HistoryTask;",
"}",
"if(baseFetchHome325){",
" ct274FetchHome=async function(){",
"  const data=await baseFetchHome325.apply(this,arguments);",
"  if(ct331HistoryCache)mergeHistory325(data,ct331HistoryCache);",
"  void ct331RefreshHistory(false).then(h=>{",
"   if(!h||!data)return;mergeHistory325(data,h);",
"   if(homeCache===data&&routeNow()==='home'){",
"    const oldAnchor=window.__ctR331?.homeAnchor?.()||window.__ctR328?.homeAnchorTarget?.();",
"    const before=oldAnchor?.getBoundingClientRect?.().top;",
"    try{ct275PaintHome()}catch{try{ct274PaintHome()}catch{}}",
"    const newAnchor=window.__ctR331?.homeAnchor?.()||window.__ctR328?.homeAnchorTarget?.();",
"    const after=newAnchor?.getBoundingClientRect?.().top;",
"    if(Number.isFinite(before)&&Number.isFinite(after)&&Math.abs(after-before)>1)window.scrollBy({top:after-before,left:0,behavior:'auto'});",
"   }",
"  });",
"  return data;",
" };",
"}",
""
].join('\n');
js=range(js,'if(baseFetchHome325){','/* One watch state for every duplicate/imported row',fastHistory,'nonblocking history');

/* Keep Home navigation cheap: only hydrate a small near-viewport sample. */
const lightHydrate=[
"async function ct274HydrateHome(){",
" if(route()!=='home')return;",
" const near=el=>{try{const r=el.getBoundingClientRect();return r.bottom>-300&&r.top<window.innerHeight*2.25}catch{return false}};",
" const eps=[...document.querySelectorAll('[data-home] [data-ct274-episode-card]')].filter(near).slice(0,12);",
" const movies=[...document.querySelectorAll('[data-home] [data-ct274-movie-card]')].filter(near).slice(0,8);",
" await Promise.all([ct274MapLimit(eps,3,ct274HydrateEpisodeCard),ct274MapLimit(movies,3,ct274HydrateMovieCard)]);",
"}",
""
].join('\n');
js=range(js,'async function ct274HydrateHome(){','async function ct274RenderHome(seq){',lightHydrate,'light home hydrate');

/* If Home already has a canonical payload, paint it immediately and refresh in the background.
   This prevents sidebar/Home-tab navigation from being held by a fresh network round trip. */
const cacheFirstRender=[
"async function ct274RenderHome(seq){",
" setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home>'+loading('Sincronizando Home...')+'</div>'));",
" window.__ctHomeHistoryPending=true;",
" const cached=ct274Payload();",
" const hasCached=!!(cached&&Array.isArray(cached.series)&&Array.isArray(cached.movie_watchlist)&&(cached.series.length||cached.movie_watchlist.length||cached.__ctHistoryAuthoritative));",
" if(hasCached){",
"  try{ct274PaintHome();window.__ctR331HomeCachePaintAt=Date.now();setTimeout(()=>window.__ctR331?.resetHome?.(),0)}catch{}",
"  void (async()=>{",
"   try{const data=await ct274FetchHome();if(seq!==navSeq||route()!=='home')return;homeCache=data;ct274PaintHome()}",
"   catch(e){if(seq!==navSeq||route()!=='home')return;try{toast('Home não pôde atualizar em segundo plano')}catch{}}",
"  })();",
"  return cached;",
" }",
" try{const data=await ct274FetchHome();if(seq!==navSeq||route()!=='home')return;homeCache=data;ct274PaintHome();setTimeout(()=>window.__ctR331?.resetHome?.(),0)}",
" catch(e){if(seq!==navSeq)return;const h=document.querySelector('[data-home]');if(h)h.innerHTML=fail('Falha ao sincronizar Home: '+(e?.message||e),'home')}",
"}",
"window.__ctR331RenderHomeTest=ct274RenderHome;",
"window.__ctR331SeedHomeTest=(p)=>{homeCache=p;ct274CanonicalHome=p;return ct274Payload()};",
""
].join('\n');
js=range(js,'async function ct274RenderHome(seq){',"async function ct274ReloadHome(source='r274'){",cacheFirstRender,'cache-first render');

/* A metadata refresh may invalidate server-side data, but the current Home snapshot stays visible until replacement arrives. */
js=once(js,
 "try{homeCache=null;window.__ct0997PreloadedHomeLive=null}catch{}",
 "try{window.__ct0997PreloadedHomeLive=null}catch{}",
 'preserve Home cache during TV refresh'
);
js=once(js,
 "setTimeout(()=>{if(routeNow()==='home')void refreshTv325(false)},1600);",
 "setTimeout(()=>{if(routeNow()!=='home')return;const run=()=>{if(routeNow()==='home')void refreshTv325(false)};if(typeof requestIdleCallback==='function')requestIdleCallback(run,{timeout:2500});else setTimeout(run,1200)},5000);",
 'defer TV refresh'
);

/* During r326 validation the final r329/r328 ForYou DOM must stay hidden as well, not just r309's old DOM. */
js=js.replace(
 "html[data-ct326-fy-filtering=\"1\"] [data-ct309-foryou]{visibility:hidden!important}",
 "html[data-ct326-fy-filtering=\"1\"] [data-ct309-foryou],html[data-ct326-fy-filtering=\"1\"] [data-ct328-foryou],html[data-ct326-fy-filtering=\"1\"] [data-ct329-foryou]{visibility:hidden!important}"
);

js=once(js,"window.__ctWebBuild='1.0.121';window.__ctOfficialVersion='1.0.121';","window.__ctR331Build='cache-first-home+stable-history+foryou-final-guard';window.__ctWebBuild='1.0.122';window.__ctOfficialVersion='1.0.122';",'web version');
js=once(js,"const REVISION='r330-official-1.0.121';","const REVISION='r331-official-1.0.122';",'revision');
js=once(js,"const version='1.0.121',revision='r330-official-1.0.121';","const version='1.0.122',revision='r331-official-1.0.122';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v330.js','app-v331.js').replaceAll('app-v330.css','app-v331.css').replaceAll('v1.0.121','v1.0.122').replaceAll('r330-official-1.0.121','r331-official-1.0.122');
sw=sw.replaceAll('ct-web-1.0.121-r330','ct-web-1.0.122-r331').replaceAll('app-v330.js','app-v331.js').replaceAll('app-v330.css','app-v331.css');
css+='\n/* CineTracker Web 1.0.122 r331 — cache-first Home navigation + natural history + final ForYou row. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.122',
 revision:'r331-official-1.0.122',
 base:'r330-production',
 scope:'home-navigation-freeze+history-natural-scroll+discover-foryou-final-guard',
 home_navigation:'cache-first-immediate-then-background-refresh',
 home_history_fetch:'base-first+expanded-50-background-cache',
 home_history_behavior:'normal-page-flow-above-anchor+newest-nearest-content+no-toggle+no-inner-scroll',
 home_hydration:'near-viewport-12-episodes+8-movies',
 home_tv_refresh:'idle-after-5s+preserve-visible-cache',
 discover_filter_authority:'cinetracker_discover_filter_v326',
 discover_foryou_filter_guard:'hide-r309+r328+r329-drafts-until-audit-finishes',
 discover_foryou_filters:'all+movies+series+anime-visible',
 discover_foryou_actions:'three-equal-compact-buttons-one-row',
 discover_top10:'r330-progressive-fill-ten+v326-final-audit-preserved',
 profile_watchlist_counts:'r324-preserved-exact',
 home_episode_live_reconcile:'r325-preserved',
 web_version_ui:'1.0.122+r331-official-1.0.122',
 sports_changes:'none-r331',
 f1_changes:'none-r331',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r331 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v331.js'),js),
 writeFile(resolve(dist,'app-v331.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v330.js'),{force:true}),rm(resolve(dist,'app-v330.css'),{force:true})]);
console.log('WEB_R331_READY cache-first Home + stable history + final ForYou');
