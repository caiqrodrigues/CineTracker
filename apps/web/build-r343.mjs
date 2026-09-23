import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r342.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v342.js'),'utf8'),
 readFile(resolve(dist,'app-v342.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r343-discover-home-ready.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r343 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r343 expected one '+l+', found '+n);return s.replace(a,b)};
const range=(s,start,end,next,label)=>{
 const a=s.indexOf(start),b=s.indexOf(end,a+start.length);
 if(a<0||b<0||b<=a)throw new Error('r343 range '+label+' missing');
 return s.slice(0,a)+next+'\n'+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.133';window.__ctOfficialVersion='1.0.133';",
 "const REVISION='r342-official-1.0.133';",
 "const version='1.0.133',revision='r342-official-1.0.133';",
 "window.__ctR342Marker='discover-buttons-single-owner+no-jitter+poster-width-freeze'",
 "function paintForYou(){",
 "function paintForYou328(){",
 "function paintForYou329(){",
 "async function ct274RenderHome(seq){",
 "let ct331HistoryCache=null,ct331HistoryTask=null,ct331HistoryAt=0;",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR343Marker='discover-final-dom-owner+home-enriched-before-first-paint'",
 "prepareHomePayload343",
 "hydrateHomeDom343",
 "paintForYou263"
])must(runtime,x);

/* Discover: no older renderer may touch Pra Você after the final r336 owner exists. */
js=once(js,
 "function paintForYou(){\n const h=host();",
 "function paintForYou(){\n if(window.__ctR336?.paintForYou)return false;\n const h=host();",
 'block late r309 paint'
);
js=once(js,
 "function paintForYou328(){\n if(routeNow()!=='discover')return false;",
 "function paintForYou328(){\n if(window.__ctR336?.paintForYou)return false;\n if(routeNow()!=='discover')return false;",
 'block late r328 paint'
);
js=once(js,
 "function paintForYou329(){\n if(routeNow()!=='discover')return false;",
 "function paintForYou329(){\n if(window.__ctR336?.paintForYou)return false;\n if(routeNow()!=='discover')return false;",
 'block late r329 paint'
);
js=js.replace(
 "if(token===fyToken&&h)h.innerHTML='<div class=\"empty ct309-fy-error\">",
 "if(token===fyToken&&h&&!window.__ctR336?.paintForYou)h.innerHTML='<div class=\"empty ct309-fy-error\">"
);

/* Home history is part of the first complete payload; never repaint it later in the background. */
const history343=[
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
"  const history=await ct331RefreshHistory(false);",
"  if(history)mergeHistory325(data,history);",
"  return data;",
" };",
"}"
].join('\n');
js=range(js,
 "let ct331HistoryCache=null,ct331HistoryTask=null,ct331HistoryAt=0;",
 "/* One watch state for every duplicate/imported row",
 history343,
 'await Home history before first paint'
);

/* Home: keep the loading shell until the fresh payload, live episode pointer/metadata and DOM metadata are complete. */
const home343=[
"async function ct274RenderHome(seq){",
" setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home>'+loading('Carregando Home completa...')+'</div>'));",
" window.__ctHomeHistoryPending=true;",
" document.documentElement.dataset.ct343HomeLoading='1';",
" delete document.documentElement.dataset.ct343HomeReady;",
" delete document.documentElement.dataset.ct343HomeIncomplete;",
" try{",
"  const data=await ct274FetchHome();",
"  if(seq!==navSeq||route()!=='home')return;",
"  homeCache=data;",
"  if(window.__ctR343?.prepareHomePayload)await window.__ctR343.prepareHomePayload(data,seq);",
"  if(seq!==navSeq||route()!=='home')return;",
"  if(typeof ct275PaintHome==='function')ct275PaintHome();else ct274PaintHome();",
"  if(window.__ctR343?.hydrateHomeDom)await window.__ctR343.hydrateHomeDom();",
"  if(seq!==navSeq||route()!=='home')return;",
"  document.documentElement.dataset.ct343HomeReady='1';",
"  delete document.documentElement.dataset.ct343HomeLoading;",
"  setTimeout(()=>window.__ctR331?.resetHome?.(),0);",
"  return data;",
" }catch(e){",
"  if(seq!==navSeq)return;",
"  delete document.documentElement.dataset.ct343HomeLoading;",
"  const h=document.querySelector('[data-home]');if(h)h.innerHTML=fail('Falha ao sincronizar Home: '+(e?.message||e),'home');",
" }",
"}",
"window.__ctR331RenderHomeTest=ct274RenderHome;",
"window.__ctR331SeedHomeTest=(p)=>{homeCache=p;ct274CanonicalHome=p;return ct274Payload()};"
].join('\n');
js=range(js,
 "async function ct274RenderHome(seq){",
 "async function ct274ReloadHome(source='r274'){",
 home343,
 'Home ready before reveal'
);

/* The live reconcile above is already current TMDB data. Do not trigger delayed startup repaints after Home is visible. */
js=once(js,
 "setTimeout(()=>{if(routeNow()!=='home')return;const run=()=>{if(routeNow()==='home')void refreshTv325(false)};if(typeof requestIdleCallback==='function')requestIdleCallback(run,{timeout:2500});else setTimeout(run,1200)},5000);",
 "setTimeout(()=>{},5000);",
 'retire delayed r325 startup refresh'
);
js=js.replaceAll("setTimeout(()=>void repairVisibleEpisodes332(),80);","setTimeout(()=>{},80);");
js=js.replaceAll("setTimeout(()=>void forceTvRefresh332(),900);","setTimeout(()=>{},900);");
js=js.replace(
 "if(routeNow()==='home'){armHome332(activeHomeKind332());void repairVisibleEpisodes332();setTimeout(()=>{},900)}",
 "if(routeNow()==='home'){armHome332(activeHomeKind332())}"
);

js=once(js,"window.__ctWebBuild='1.0.133';window.__ctOfficialVersion='1.0.133';","window.__ctWebBuild='1.0.134';window.__ctOfficialVersion='1.0.134';",'web version');
js=once(js,"const REVISION='r342-official-1.0.133';","const REVISION='r343-official-1.0.134';",'revision');
js=once(js,"const version='1.0.133',revision='r342-official-1.0.133';","const version='1.0.134',revision='r343-official-1.0.134';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v342.js','app-v343.js').replaceAll('app-v342.css','app-v343.css').replaceAll('v1.0.133','v1.0.134').replaceAll('r342-official-1.0.133','r343-official-1.0.134');
sw=sw.replaceAll('ct-web-1.0.133-r342','ct-web-1.0.134-r343').replaceAll('app-v342.js','app-v343.js').replaceAll('app-v342.css','app-v343.css');
css+='\n/* CineTracker Web 1.0.134 r343 — final Discover DOM owner + Home ready before real cards are revealed. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.134',revision:'r343-official-1.0.134',base:'r342-production',
 scope:'discover-final-dom-owner+home-ready-before-first-paint',
 discover_foryou_owner:'r336-only-no-legacy-late-dom-repaint',
 discover_foryou_late_paints:'r309+r328+r329-blocked-after-r336',
 discover_action_authority:'r342-single-owner',
 home_startup:'fresh-payload+history+live-reconcile+metadata-hydrate-before-reveal',
 home_cache_first:false,
 home_history_first_paint:'awaited-authoritative-history',
 home_episode_first_paint:'watch-state+live-tmdb-reconcile+season-hydrate',
 home_delayed_metadata_repaint:false,
 sports_startup:'every-open-warm+force-provider-sync+auth-retry+refresh-payload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r343 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v343.js'),js),writeFile(resolve(dist,'app-v343.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v342.js'),{force:true}),rm(resolve(dist,'app-v342.css'),{force:true})]);
console.log('WEB_R343_READY Discover final renderer cannot be replaced late; Home waits for enriched episode metadata before first paint');
