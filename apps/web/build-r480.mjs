import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r479.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v479.js'),'utf8'),
 readFile(resolve(dist,'app-v479.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r480 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r480 invalid '+label+' bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r480 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}

js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 ["async function renderHome388(){\n const kind=activeKind();",
  "async function renderHome388(){\n if(!hSeries.length){const cached=localGet(HS,6*60*60*1000)||cacheGet(HS,6*60*60*1000);if(Array.isArray(cached)&&cached.length)hSeries=cached}\n if(!hHistory){const cached=localGet(HH,6*60*60*1000)||cacheGet(HH,6*60*60*1000);if(cached&&typeof cached==='object')hHistory=cached}\n const kind=activeKind();",
  "cached first paint"],
 ["hHistory=v;cacheSet(HH,v);",
  "hHistory=v;cacheSet(HH,v);localSet(HH,v);",
  "persist history cache"]
],"r388");

js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
 ["let series399=[],movies399=[],moviesTask=null,seriesTask=null,sportsTask=null,sportsRefreshedAt=0;",
  "const persistHome480=(key,data)=>{try{localStorage.setItem(key,JSON.stringify({at:Date.now(),data:data}))}catch{}};\nlet series399=[],movies399=[],moviesTask=null,seriesTask=null,sportsTask=null,sportsRefreshedAt=0;",
  "home cache writer"],
 ["if(fresh.length&&routeNow()==='home'){series399=fresh;renderSeries399();scheduleAlign399('series',false);document.documentElement.dataset.ct399SeriesAuthority='v452'}",
  "if(fresh.length){series399=fresh;persistHome480('ct392:series',series399);if(routeNow()==='home'){renderSeries399();scheduleAlign399('series',false);document.documentElement.dataset.ct399SeriesAuthority='v452'}}",
  "persist v452 series"],
 ["if(fresh.length&&routeNow()==='home'){series399=fresh;renderSeries399();scheduleAlign399('series',false)}return true;",
  "if(fresh.length){series399=fresh;persistHome480('ct392:series',series399);if(routeNow()==='home'){renderSeries399();scheduleAlign399('series',false)}}return true;",
  "persist refreshed sports series"],
 ["if(routeNow()==='home'){series399=[];movies399=[];if(movieFrame)cancelAnimationFrame(movieFrame);setTimeout(()=>{const kind=activeHome();if(kind==='movies')void ensureMovies399(true);else void refreshSeries399(true)},80)}",
  "if(routeNow()==='home'){series399=[];movies399=[];try{localStorage.removeItem('ct392:series');localStorage.removeItem('ct392:history')}catch{}if(movieFrame)cancelAnimationFrame(movieFrame);setTimeout(()=>{const kind=activeHome();if(kind==='movies')void ensureMovies399(true);else void refreshSeries399(true)},80)}",
  "invalidate bootstrap cache"]
],"r399");

const recentBlock=[
"const RECENT_KEY480='ct480:foryou:shown',RECENT_MS480=7*86400000;",
"function recentMap480(){try{const raw=JSON.parse(localStorage.getItem(RECENT_KEY480)||'{}'),now=Date.now(),out={};for(const [k,v] of Object.entries(raw||{})){const at=Number(v||0);if(at>0&&now-at<RECENT_MS480)out[k]=at}return out}catch{return{}}}",
"function saveRecent480(map){try{localStorage.setItem(RECENT_KEY480,JSON.stringify(map))}catch{}}",
"function itemKey480(x){return keyOf(x)}",
"function isRecent480(x){const k=itemKey480(x),map=recentMap480();return !!k&&!!map[k]}",
"function prioritize480(list){const map=recentMap480(),a=[],b=[];for(const x of rows(list)){const k=itemKey480(x);(k&&map[k]?b:a).push(x)}return a.concat(b)}",
"function remember480(items){const map=recentMap480(),now=Date.now();for(const x of rows(items)){const type=String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv',id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.id||0);if(id>0)map[type+':'+id]=now}const keep=Object.entries(map).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,240);saveRecent480(Object.fromEntries(keep));return keep.length}",
"let state=emptyState(),loadTask=null,loadToken=0;"
].join("\n");

js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 ["const name=group==='watch'?'cinetracker_discover_watch_smart_v479':'cinetracker_discover_fresh_v479';",
  "const name=group==='watch'?'cinetracker_discover_watch_smart_v480':'cinetracker_discover_fresh_v480';",
  "v480 pools"],
 ["let state=emptyState(),loadTask=null,loadToken=0;",recentBlock,"local exposure memory"],
 ["function chooseDaily(){\n const all=[...state.fresh.movie,...state.fresh.series,...state.fresh.anime].filter(x=>keyOf(x));\n if(!all.length){state.daily=[];return}\n const d=new Date(),seed=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));\n state.daily=[all[seed%all.length]];state.idx.daily=0;\n}",
  "function chooseDaily(){\n const all=[...state.fresh.movie,...state.fresh.series,...state.fresh.anime].filter(x=>keyOf(x));\n if(!all.length){state.daily=[];return}\n const unseen=all.filter(x=>!isRecent480(x)),pool=unseen.length?unseen:all;\n const d=new Date(),seed=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));\n state.daily=[pool[seed%pool.length]];state.idx.daily=0;\n}",
  "daily unseen preference"],
 ["if(token!==loadToken||routeNow()!=='discover')return false;state=next;chooseDaily();",
  "if(token!==loadToken||routeNow()!=='discover')return false;for(const k of ['movie','series','anime']){next.watch[k]=prioritize480(next.watch[k]);next.fresh[k]=prioritize480(next.fresh[k])}state=next;chooseDaily();",
  "prioritize unseen pools"],
 ["if(items.length)void rpcCall('cinetracker_record_recommendations_v479',{p_items:items}).catch(()=>{});",
  "if(items.length){remember480(items);void rpcCall('cinetracker_record_recommendations_v480',{p_items:items}).catch(()=>{})}",
  "record local and backend exposure"]
],"r464");

js=patchRuntime(js,"if(window.__ctR476?.version==='1.0.266')return;",[
 ["core.rpc('cinetracker_profile_lists_v479',{})","core.rpc('cinetracker_profile_lists_v480',{})","v480 pure profile source"]
],"r476");

js+="\n/* CineTracker Web 1.0.270 r480 — stable cached Home bootstrap, non-repeating strict Pra Você and pure Profile lists. */\n(()=>{\n'use strict';\nif(window.__ctR480?.version==='1.0.270')return;\nwindow.__ctR480Marker='home-cache-bootstrap+discover-v480-local-memory+profile-v480-pure-12+movies-history-watchlist';\nwindow.__ctR480={version:'1.0.270',scope:'home+discover-foryou+profile'};\n})();\n";

html=html.replaceAll('app-v479.js','app-v480.js').replaceAll('app-v479.css','app-v480.css').replaceAll('v1.0.269','v1.0.270').replaceAll('r479-official-1.0.269','r480-official-1.0.270');
css+='\n/* CineTracker Web 1.0.270 r480 — stable Home bootstrap, non-repeating strict recommendations, pure Profile. */\n';
sw=sw.replaceAll('app-v479.js','app-v480.js').replaceAll('app-v479.css','app-v480.css').replaceAll('ct-web-1.0.269-r479','ct-web-1.0.270-r480');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.270',
 revision:'r480-official-1.0.270',
 base:'r479+r480-stability',
 scope:'home-cached-first-paint+discover-strict-local-memory+profile-pure-12+movies-history-watchlist',
 home_series:'last known-good v452 Series and v391 History hydrate immediately for up to six hours; live RPC refresh remains authoritative and invalidates cache on mutations',
 home_movies:'r479/r399 v405 Watchlist preserved unchanged',
 discover_foryou:'v480 strict pools plus seven-day local exposure memory and backend shown_recommendations prevent repeat candidates between opens; seen/favorite/watchlist exclusions remain inherited from v476/v479',
 profile_lists:'v480 pure contract: Series/Movies are actual watch history only; favorites and actors stay category-pure; exactly 12 summary cards',
 profile_movies:'full Movies screen opens in History and keeps History/Watchlist selector at the top',
 sports:'r479 preserved unchanged',
 f1:'r479/r478/r477/r462 preserved',
 history:'daily v426 preserved',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v480.js'),js),writeFile(resolve(dist,'app-v480.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v479.js'),{force:true}),rm(resolve(dist,'app-v479.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r480 missing runtime '+anchor);return js.slice(start,close+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
if(!r388.includes('localGet(HS,6*60*60*1000)')||!r388.includes('localSet(HH,v)'))throw new Error('r480 Home bootstrap cache missing');
if(!r399.includes("persistHome480('ct392:series',series399)"))throw new Error('r480 live Series cache missing');
if(!r464.includes('cinetracker_discover_fresh_v480')||!r464.includes('cinetracker_discover_watch_smart_v480')||!r464.includes('RECENT_KEY480')||!r464.includes('remember480(items)')||!r464.includes('cinetracker_record_recommendations_v480'))throw new Error('r480 Discover memory missing');
if(!r476.includes("core.rpc('cinetracker_profile_lists_v480',{})")||!r476.includes('const LIMIT=12')||!r476.includes('data-ct478-movie-mode="history"')||!r476.includes('data-ct478-movie-mode="watchlist"'))throw new Error('r480 Profile contract missing');
if(!js.includes("window.__ctR480Marker='home-cache-bootstrap+discover-v480-local-memory+profile-v480-pure-12+movies-history-watchlist'"))throw new Error('r480 marker missing');
const r480=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.270 r480'));for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(r480.includes(bad))throw new Error('r480 forbidden '+bad);
console.log('WEB_R480_READY');
