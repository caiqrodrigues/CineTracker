import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r492.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v492.js'),'utf8'),readFile(resolve(dist,'app-v492.css'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r495-final-authority.js'),'utf8')
]);
/* Boot-order guard: some preserved runtimes inspect r388 before its IIFE is evaluated. An empty namespace avoids a fatal property read; r388 later replaces it with the real owner. */
js="window.__ctR388=window.__ctR388||{};\n"+js;
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r495 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r495 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r495 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r495 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
function disableRuntime(source,anchor,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),needle="'use strict';",at=region.indexOf(needle);if(at<0)throw new Error('r495 missing strict '+label);const cut=at+needle.length;return source.slice(0,b.start)+region.slice(0,cut)+'\nreturn;\n'+region.slice(cut)+source.slice(b.end)}
const patch=(anchor,label,defs)=>{for(const [name,body] of defs)js=replaceNamed(js,anchor,name,body,label)};
patch("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",'r399',[
 ['settleRoute399',"function settleRoute399(){return false}"],['bootProbe399',"function bootProbe399(){return false}"]
]);
patch("if(window.__ctR413?.version==='1.0.204')return;",'r413',[
 ['beginHomeEntry',"function beginHomeEntry(){return false}"],['scheduleForYou',"function scheduleForYou(){return false}"],['probe',"function probe(){return false}"]
]);
patch("if(window.__ctR415?.version==='1.0.206')return;",'r415',[
 ['homeProbe',"function homeProbe(){return false}"],['beginSeriesEntry',"function beginSeriesEntry(){return false}"],['repairForYou',"function repairForYou(){return false}"],['scheduleForYouRepair',"function scheduleForYouRepair(){return false}"],['updateSportsProfile',"async function updateSportsProfile(){return false}"],['renderProfile415',"async function renderProfile415(){return false}"],['bootProbe',"function bootProbe(){return false}"]
]);
patch("window.__ctR416Marker='profile-persistent-first-paint+foryou-r411-final-owner+f1-series-optimistic-watch'",'r416',[
 ['ownFY',"function ownFY(){return false}"],['scheduleFY',"function scheduleFY(){return false}"],['pEnrich',"async function pEnrich(){return false}"],['renderProfile416',"async function renderProfile416(){return false}"],['probe',"function probe(){return false}"]
]);
patch("if(window.__ctR417?.version==='1.0.208')return;",'r417',[
 ['beginHome417',"function beginHome417(){return false}"],['repairForYou417',"function repairForYou417(){return false}"],['scheduleForYou417',"function scheduleForYou417(){return false}"],['loadProfileSports417',"async function loadProfileSports417(){return false}"]
]);
patch("if(window.__ctR418?.version==='1.0.209')return;",'r418',[
 ['startHome418',"function startHome418(){return false}"],['repairFY418',"function repairFY418(){return false}"],['scheduleFY418',"function scheduleFY418(){return false}"],['loadProfile418',"async function loadProfile418(){return false}"]
]);
patch("if(window.__ctR420?.version==='1.0.211')return;",'r420',[
 ['scheduleDiscover420',"function scheduleDiscover420(){return false}"],['loadProfile420',"async function loadProfile420(){return false}"]
]);
patch("if(window.__ctR421?.version==='1.0.212')return;",'r421',[
 ['scheduleForYouSanitize421',"function scheduleForYouSanitize421(){return false}"],['loadProfile421',"async function loadProfile421(){return false}"]
]);
patch("if(window.__ctR424?.version==='1.0.215')return;",'r424',[
 ['normalizeProfileLists424',"function normalizeProfileLists424(){return false}"],['loadProfile424',"async function loadProfile424(){return false}"],['gateHomeSeries424',"async function gateHomeSeries424(){return false}"]
]);
patch("function homeEntry425()",'r425',[
 ['homeEntry425',"function homeEntry425(){return false}"],['profileCanonical425',"function profileCanonical425(){return false}"]
]);
patch("function scheduleFY()",'r426-schedule',[['scheduleFY',"function scheduleFY(){return false}"]]);
patch("async function stabilizeProfile()",'r426-profile',[['stabilizeProfile',"async function stabilizeProfile(){return false}"]]);
patch("function wakeHome",'r471',[
 ['wakeHome',"function wakeHome(){releaseHomeGate();return true}"],['scheduleHome',"function scheduleHome(){releaseHomeGate();return true}"],
 ['loadMediaLists',"async function loadMediaLists(){return null}"],['loadActors',"async function loadActors(){return[]}"],
 ['applyProfile',"function applyProfile(){bindDailyAuthority();return false}"],['scheduleProfile',"function scheduleProfile(){bindDailyAuthority();return false}"]
]);
patch("function repairHome",'r472',[
 ['repairHome',"function repairHome(){return false}"],['scheduleHome',"function scheduleHome(){return false}"],['activateForYou',"function activateForYou(){return false}"],['scheduleForYou',"function scheduleForYou(){return false}"],
 ['loadMedia',"async function loadMedia(){return null}"],['loadActors',"async function loadActors(){return[]}"],['loadStadium',"async function loadStadium(){return null}"],
 ['applyProfile',"function applyProfile(){return false}"],['scheduleProfile',"function scheduleProfile(){return false}"]
]);
const A464="window.__ctR464Marker='discover-foryou-visible-owner-v421';";
patch(A464,'r464',[
 ['load',"async function load(force=false){\n setForYouState();if(routeNow()!=='discover')return false;if(loadTask)return loadTask;\n if(force&&document.documentElement.dataset.ct490ForYouReady==='1'){render();return true}\n const token=++loadToken;if(!q('[data-ct464-foryou]',root464()))renderLoading();\n loadTask=(async()=>{try{\n  const raw=unwrap(await timeout(rpcCall('cinetracker_foryou_payload_v490',{p_watch_limit:30,p_fresh_limit:48}),9000))||{},next=emptyState(),kinds=['movie','series','anime'];\n  for(const k of kinds){next.watch[k]=rows(raw?.watch?.[k]);next.fresh[k]=rows(raw?.fresh?.[k])}\n  if(!kinds.every(k=>next.watch[k].length&&next.fresh[k].length))throw new Error('v490 incomplete pools');\n  if(token!==loadToken||routeNow()!=='discover')return false;state=next;chooseDaily();\n  let cycle=1;try{cycle=(Number(sessionStorage.getItem('ct490:foryou-cycle')||0)+1)%100000;sessionStorage.setItem('ct490:foryou-cycle',String(cycle))}catch{cycle=Date.now()%100000}\n  kinds.forEach((k,i)=>{state.idx.watch[k]=(cycle+i*3)%state.watch[k].length;state.idx.fresh[k]=(cycle+i*5+1)%state.fresh[k].length});\n  render();document.documentElement.dataset.ct490ForYouReady='1';document.documentElement.dataset.ct490ForYou='compact-v490';\n  document.documentElement.dataset.ct464PoolCounts=JSON.stringify({watch:Object.fromEntries(kinds.map(k=>[k,state.watch[k].length])),fresh:Object.fromEntries(kinds.map(k=>[k,state.fresh[k].length]))});return true;\n }catch(e){if(token===loadToken){delete document.documentElement.dataset.ct490ForYouReady;document.documentElement.dataset.ct490ForYouError=String(e?.message||e);const root=root464();if(root)root.innerHTML='<div data-ct464-foryou><div class=\"panel\"><div class=\"empty\">Não foi possível carregar as indicações. <button type=\"button\" class=\"chip\" data-ct490-foryou-retry>Tentar novamente</button></div></div></div>'}return false}\n finally{if(token===loadToken)loadTask=null}})();return loadTask;\n}"],
 ['activate',"function activate(){\n setForYouState();qa('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]').forEach(b=>{if(isForYouControl(b))b.classList.add('active')});\n if(document.documentElement.dataset.ct490ForYouReady==='1'){render();return true}\n if(!q('[data-ct464-foryou]',root464()))renderLoading();void load(false);return true;\n}"]
]);

/* r385 is retired by r492. build-r385 left this assignment outside its runtime IIFE, so disabling the IIFE alone made boot dereference an undefined owner. Remove the orphan bridge entirely. */
js=js.replaceAll("window.__ctR385RenderHome=window.__ctR385.renderHome;","window.__ctR385RenderHome=undefined;");

const A388R495="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
patch(A388R495,'r388-r495',[
 ['renderHome388',"async function renderHome388(){\n const kind=activeKind();try{if(!q('[data-home]'))setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home></div>'))}catch{}\n paintFrame(kind);if(routeNow()!=='home')return false;\n if(kind==='series'){if(hSeries.length)renderSeries();if(hHistory)renderHistory('episodes');void loadSeries(false);void loadHistory(false)}else{if(hMovies.length)renderMoviesAll();if(hHistory)renderHistory('movies');void loadMovies(false);void loadHistory(false)}\n document.documentElement.dataset.ct388Home='r495-progressive';return true;\n}"]
]);
js=js.replaceAll('cinetracker_profile_screen_v491','cinetracker_profile_screen_v495');
js=js.replaceAll("document.documentElement.dataset.ct413HomeEntering='1';","delete document.documentElement.dataset.ct413HomeEntering;");
js=js.replaceAll("document.documentElement.dataset.ct415HomeEntering='series';","delete document.documentElement.dataset.ct415HomeEntering;");
js=js.replaceAll("document.documentElement.dataset.ct417HomeEntering='series';","delete document.documentElement.dataset.ct417HomeEntering;");
js=js.replaceAll("document.documentElement.dataset.ct418HomeEntering='series';","delete document.documentElement.dataset.ct418HomeEntering;");
const A321="window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity';";
patch(A321,'r321',[
 ['topRaw321',`async function topRaw321(provider,force=false){
  if(testBridge?.top)return testBridge.top(provider,force);
  const key=String(provider),hit=topCache.get(key);if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
  const storage='ct493:top10:'+String(typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10))+':'+key;
  if(!force)try{const c=JSON.parse(sessionStorage.getItem(storage)||'null');if(c?.movies&&c?.series){topCache.set(key,{at:Date.now(),rows:c});return c}}catch{}
  const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false,page:1};
  const [m1,t1]=await Promise.all([tmdbPage321('/discover/movie',common,'movie'),tmdbPage321('/discover/tv',common,'tv')]);
  const data={movies:dedupe321(m1),series:dedupe321(t1)};topCache.set(key,{at:Date.now(),rows:data});try{sessionStorage.setItem(storage,JSON.stringify(data))}catch{}return data;
 }`],
 ['paintTop321',`async function paintTop321(provider,token,force=false){
  const content=q('[data-ct321-top-content]');if(!content||token!==topToken||String(discover?.tab)!=='top10')return false;
  const renderClean=(raw,a)=>{
   if(token!==topToken||String(discover?.tab)!=='top10')return false;
   const movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10),series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);
   let name='Streaming';try{name=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider))?.provider_name||name}catch{}
   content.innerHTML='<div class="ct288-top-name"><b>'+esc(name)+'</b></div><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>'+series.length+'</small></div><div class="ct319-top-row">'+(series.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem séries elegíveis neste streaming.</div>')+'</div></section><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>'+movies.length+'</small></div><div class="ct319-top-row">'+(movies.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem filmes elegíveis neste streaming.</div>')+'</div></section>';
   loaded321();return{movies,series};
  };
  try{
   const raw=await topRaw321(provider,force),a=await exact321([...raw.movies,...raw.series]),shown=renderClean(raw,a);if(!shown)return false;
   if(shown.movies.length<10||shown.series.length<10)void (async()=>{try{
    const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false,page:2};
    const [m2,t2]=await Promise.all([tmdbPage321('/discover/movie',common,'movie'),tmdbPage321('/discover/tv',common,'tv')]);
    const merged={movies:dedupe321([...raw.movies,...m2]),series:dedupe321([...raw.series,...t2])},a2=await exact321([...merged.movies,...merged.series]);renderClean(merged,a2);
   }catch{}})();
   return true;
  }catch(e){content.innerHTML='<div class="empty">'+esc(e?.message||'Não foi possível carregar o Top 10 agora.')+'</div>';loaded321();return false}
 }`],
 ['loadTop321',`async function loadTop321(force=false){
  const h=host();if(!h)return false;const token=++topToken;loading321('Carregando Top 10…');
  h.innerHTML='<section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row" data-ct321-providers><div class="ct263-loading">Carregando streamings…</div></div><div data-ct321-top-content><div class="ct263-loading">Montando Top 10…</div></div></section>';
  if(!state.topProvider)state.topProvider=Number((typeof ct171TopProvider!=='undefined'&&ct171TopProvider)||8)||8;try{ct171TopProvider=state.topProvider}catch{}
  const paint=paintTop321(state.topProvider,token,force);
  void Promise.resolve(typeof ct171Providers==='function'?ct171Providers():[]).then(providers=>{
   if(token!==topToken||String(discover?.tab)!=='top10')return;
   const list=rows(providers),box=q('[data-ct321-providers]');
   if(box)box.innerHTML=list.map(p=>'<button type="button" class="ct288-provider '+(Number(p.provider_id)===Number(state.topProvider)?'active':'')+'" data-ct321-provider="'+Number(p.provider_id)+'">'+(p.logo_path?'<span><img alt="" src="'+img(p.logo_path,'w92')+'"></span>':'')+'<b>'+esc(p.provider_name||'Streaming')+'</b></button>').join('')||'<div class="empty">Nenhum streaming disponível.</div>';
  }).catch(()=>{});
  return paint;
 }`]
]);


js=js.replace(/const REVISION='[^']+';/,"const REVISION='r495-official-0.3.22';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.22 • ${REVISION}');
js=js.replace("navigator.serviceWorker.register('/service-worker.js')","navigator.serviceWorker.register('/service-worker.js',{updateViaCache:'none'})");
new Function(runtime);js+='\n'+runtime+'\n';
html=html.replaceAll('app-v489.js','app-v490.js').replaceAll('app-v489.css','app-v490.css').replaceAll('v0.3.16','v0.3.22').replaceAll('r489-official-0.3.16','r495-official-0.3.22');
html='<!doctype html><html lang="pt-BR"><head><meta name="ct-revision" content="r495-official-0.3.22"><meta charset="UTF-8"><meta name="viewport" content="width=1280,initial-scale=1"><meta name="theme-color" content="#041017"><meta name="color-scheme" content="dark"><title>CineTracker</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/app-v495.css?ct=r495-official-0.3.22"></head><body><div id="app"></div><script defer src="/app-v495.js?ct=r495-official-0.3.22"></script></body></html>';
css+='\n/* CineTracker Web 0.3.22 r495 — modern runtime recovery. */\n:root{--gold:#58afe0!important}\nhtml body [data-page="home"],html body [data-home]{visibility:visible!important;opacity:1!important}\nhtml body [data-home-view]:not(.hidden):not([hidden]){visibility:visible!important;opacity:1!important}\nhtml body [data-home-view="movies"] .ct489-movie-card .poster,html body [data-ct321-top-content] .ct288-poster{aspect-ratio:2/3!important;height:auto!important;object-fit:cover!important;background-size:cover!important;background-position:center!important}\n';
const sw=String.raw`const CT_MEDIA_CACHE='ct-media-r495';
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CT_MEDIA_CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;let url;try{url=new URL(req.url)}catch{return}if(!/image\.tmdb\.org$/.test(url.hostname))return;event.respondWith((async()=>{const cache=await caches.open(CT_MEDIA_CACHE),hit=await cache.match(req);const net=fetch(req).then(r=>{if(r&&r.ok)cache.put(req,r.clone());return r}).catch(()=>null);return hit||await net||Response.error()})())});
`;
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.22',revision:'r495-official-0.3.22',base:'r492+r495-modern-runtime-recovery',
 scope:'modern-blue-shell+legacy-owner-retirement+fast-profile-contract+progressive-home+top10',
 home_series:'r388 is the only visible Home data owner; r399/r413/r415/r417/r418/r424/r425/r468/r469/r471/r472/r476/r477/r481 wake/repaint paths are retired',
 home_movies:'native v405 2:3 grid remains the only movie Watchlist renderer; legacy Home wake paths are retired',
 discover_foryou:'cinetracker_foryou_payload_v490 is compact (about 49 KB vs 628 KB v489 in production verification) and r464 is the only visible Pra Você owner',
 profile_lists:'r491 renderer uses cinetracker_profile_screen_v495 fast contract; exactly 12 cards per summary and header-only Ver mais',
 profile_sports:'fast v495 contract merges quick stats and stadium v296; old r415-r426 profile writers retired',
 service_worker:'app shell and JS/CSS are network-owned; SW only caches TMDB images and deletes legacy caches on activation',
 top10:'strict 2:3 geometry enforced',f1:'preserved',sports:'sports route preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v495.js'),js),writeFile(resolve(dist,'app-v495.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v492.js'),{force:true}),rm(resolve(dist,'app-v492.css'),{force:true})]);
for(const need of ["window.__ctR495Marker='modern-runtime+old-owners-retired+progressive-home+fast-profile+strict-12'",'cinetracker_foryou_payload_v490','cinetracker_profile_screen_v495','cinetracker_profile_summary_v489','cinetracker_sports_stadium_summary_v296','r495-official-0.3.22'])if(!js.includes(need))throw new Error('r495 missing '+need);
console.log('WEB_R495_READY modern-runtime-recovered');