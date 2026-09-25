import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r376.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v376.js'),'utf8'),readFile(resolve(dist,'app-v376.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r377-video-ground-truth.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r377 expected one '+l+', found '+n);return s.replace(a,b)};

const oldFetch="async function ct274FetchHome(){return ct274NormalizeHomePayload(await rpc('cinetracker_home_payload_v359',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10),p_history_limit:20,p_series_limit:120,p_movie_limit:120}))}";
const newFetch="async function ct274FetchHome(){return ct274NormalizeHomePayload(await rpc('cinetracker_home_payload_v334',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10),p_history_limit:50,p_series_limit:120,p_movie_limit:240}))}";
js=once(js,oldFetch,newFetch,'legacy Home timeout RPC');

const renderStart="async function ct274RenderHome(seq){";
const renderEnd="window.__ctR331RenderHomeTest=ct274RenderHome;";
const a=js.indexOf(renderStart),z=js.indexOf(renderEnd,a);
if(a<0||z<0||js.indexOf(renderStart,a+1)>=0)throw new Error('r377 current Home renderer not uniquely found');
const currentRender=js.slice(a,z+renderEnd.length);
const newRender=[
"async function ct274RenderHome(seq){",
" setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home>'+loading('Carregando Home completa...')+'</div>'));",
" window.__ctHomeHistoryPending=true;",
" document.documentElement.dataset.ct343HomeLoading='1';",
" delete document.documentElement.dataset.ct343HomeReady;",
" delete document.documentElement.dataset.ct343HomeIncomplete;",
" const cached=ct274Payload(),usable=cached&&['series','movie_watchlist','history_episodes','history_movies'].every(k=>Array.isArray(cached[k]));",
" if(usable&&seq===navSeq&&route()==='home'){",
"  homeCache=cached;",
"  try{if(typeof ct275PaintHome==='function')ct275PaintHome();else ct274PaintHome()}catch{}",
"  document.documentElement.dataset.ct343HomeReady='1';",
"  delete document.documentElement.dataset.ct343HomeLoading;",
" }",
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
"  if(seq!==navSeq||route()!=='home')return;",
"  delete document.documentElement.dataset.ct343HomeLoading;",
"  if(usable){",
"   homeCache=cached;",
"   try{if(typeof ct275PaintHome==='function')ct275PaintHome();else ct274PaintHome()}catch{}",
"   document.documentElement.dataset.ct343HomeReady='1';",
"   document.documentElement.dataset.ct377HomeFallback='cache';",
"   try{toast('Home mantida em cache; atualização não concluiu.')}catch{}",
"   return cached;",
"  }",
"  const h=document.querySelector('[data-home]');if(h)h.innerHTML=fail('Falha ao sincronizar Home: '+(e?.message||e),'home');",
" }",
"}",
"window.__ctR331RenderHomeTest=ct274RenderHome;"
].join('\n');
js=js.slice(0,a)+newRender+js.slice(z+renderEnd.length);


js=once(js,"window.__ctWebBuild='1.0.167';window.__ctOfficialVersion='1.0.167';","window.__ctWebBuild='1.0.168';window.__ctOfficialVersion='1.0.168';",'version');
js=once(js,"const REVISION='r376-official-1.0.167';","const REVISION='r377-official-1.0.168';",'revision');
js=once(js,"const version='1.0.167',revision='r376-official-1.0.167';","const version='1.0.168',revision='r377-official-1.0.168';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v376.js','app-v377.js').replaceAll('app-v376.css','app-v377.css').replaceAll('v1.0.167','v1.0.168').replaceAll('r376-official-1.0.167','r377-official-1.0.168');
sw=sw.replaceAll('ct-web-1.0.167-r376','ct-web-1.0.168-r377').replaceAll('app-v376.js','app-v377.js').replaceAll('app-v376.css','app-v377.css');
css+='\n/* CineTracker Web 1.0.168 r377 — native Home sort, rich metadata, cached Home fallback, physical ForYou owner. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.168',revision:'r377-official-1.0.168',base:'r376-production',scope:'video-ground-truth-home+foryou',home_watchlist_sort_control:'native-select-over-compact-icon-no-click-through',home_watchlist_metadata:'ct274-rich-row+lazy-tmdb-visible-enrichment',home_return_rpc:'cinetracker_home_payload_v334',home_return_failure:'keep-cached-home-no-red-replacement',discover_foryou_refresh:'keep-visible-state+parallel-fresh-fill',discover_foryou_physical_actions:'window-capture+34px-hit-area+no-card-navigation',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v377.js'),js),writeFile(resolve(dist,'app-v377.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v376.js'),{force:true}),rm(resolve(dist,'app-v376.css'),{force:true})]);
console.log('WEB_R377_READY video-ground-truth Home + Pra Voce');