import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r483.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v483.js'),'utf8'),
 readFile(resolve(dist,'app-v483.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r484-final-authority.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r484 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r484 invalid '+label+' bounds');
 return{start,end:close+6};
}
function replaceNamedFunction(source,anchor,name,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end);
 const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(');
 const m=re.exec(region);if(!m)throw new Error('r484 missing '+label+' function '+name);
 const fnStart=m.index,open=region.indexOf('{',m.index+m[0].length);if(open<0)throw new Error('r484 missing '+label+' body '+name);
 let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){
  const c=region[i],n=region[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}
  if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}
  if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r484 unbalanced '+label+' function '+name);
 return source.slice(0,b.start)+region.slice(0,fnStart)+replacement+region.slice(i)+source.slice(b.end);
}
function replaceNamedFunctionOptional(source,anchor,name,replacement,label){
 try{return replaceNamedFunction(source,anchor,name,replacement,label)}
 catch(e){if(String(e?.message||e).includes('missing '+label+' function '+name))return source;throw e}
}
function patchRuntime(source,anchor,patches,label){
 const b=bounds(source,anchor,label);let region=source.slice(b.start,b.end);
 for(const p of patches){
  const needle=p[0],replacement=p[1],name=p[2],count=region.split(needle).length-1;
  if(count!==1)throw new Error('r484 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,b.start)+region+source.slice(b.end);
}

js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 [" if(!hSeries.length){const cached=localGet(HS,6*60*60*1000)||cacheGet(HS,6*60*60*1000);if(Array.isArray(cached)&&cached.length)hSeries=cached}\n if(!hHistory){const cached=localGet(HH,6*60*60*1000)||cacheGet(HH,6*60*60*1000);if(cached&&typeof cached==='object')hHistory=cached}\n"," /* r484: live Home data only; skeleton stays visible until current RPCs paint. */\n","stale Home bootstrap"]
],'r388');

const A459="window.__ctR459Marker='hard-home-tabs+watchlist-v405+foryou-v421+profile-13-half+daily-undo+f1-r423-r426';";
if(js.includes(A459)){
 js=replaceNamedFunctionOptional(js,A459,'scheduleSeries459',"function scheduleSeries459(){\n document.documentElement.removeAttribute('data-ct459-boot');\n try{return window.__ctR477?.bootHome?.('series')??window.__ctR399?.enterHome?.('series')??false}catch{return false}\n}",'r459');
 js=replaceNamedFunctionOptional(js,A459,'enterMovies459',"function enterMovies459(){\n document.documentElement.removeAttribute('data-ct459-boot');\n try{return window.__ctR477?.bootHome?.('movies')??window.__ctR399?.enterHome?.('movies')??false}catch{return false}\n}",'r459');
 js=replaceNamedFunctionOptional(js,A459,'enterForYou459',"function enterForYou459(){\n const s=fyState459();if(s){s.tab='foryou';s.type='all'}\n try{return window.__ctR464?.activate?.()??false}catch{return false}\n}",'r459');
 js=replaceNamedFunctionOptional(js,A459,'applyProfile459',"function applyProfile459(){try{return window.__ctR476?.paintProfile?.()??false}catch{return false}}",'r459');
 js=replaceNamedFunctionOptional(js,A459,'scheduleProfile459',"function scheduleProfile459(){\n if(routeNow()!=='profile')return false;bindHistory459();\n queueMicrotask(()=>{try{window.__ctR476?.paintProfile?.();void window.__ctR476?.loadProfile?.(true)}catch{}});\n return true\n}",'r459');
}
js=js.replaceAll('html[data-ct459-boot="1"] [data-home-view="series"]{visibility:hidden!important}','');

const A460="window.__ctR460Marker='movies-sticky+watchlist-v405+foryou-7-swap+profile-13-half+daily-undo+f1-75-of-77-no-reconcile';";
js=replaceNamedFunctionOptional(js,A460,'enterSeries460',"function enterSeries460(){try{return window.__ctR477?.bootHome?.('series')??window.__ctR399?.enterHome?.('series')??false}catch{return false}}",'r460');
js=replaceNamedFunctionOptional(js,A460,'enterMovies460',"function enterMovies460(){try{return window.__ctR477?.bootHome?.('movies')??window.__ctR399?.enterHome?.('movies')??false}catch{return false}}",'r460');
js=replaceNamedFunctionOptional(js,A460,'enterForYou460',"function enterForYou460(){\n const s=fyState460();if(s){s.tab='foryou';s.type='all'}\n try{return window.__ctR464?.activate?.()??false}catch{return false}\n}",'r460');
js=replaceNamedFunctionOptional(js,A460,'applyProfile460',"function applyProfile460(){try{return window.__ctR476?.paintProfile?.()??false}catch{return false}}",'r460');
js=replaceNamedFunctionOptional(js,A460,'scheduleProfile460',"function scheduleProfile460(){\n if(!isProfile())return false;\n queueMicrotask(()=>{try{window.__ctR476?.paintProfile?.();void window.__ctR476?.loadProfile?.(true)}catch{}});\n return true\n}",'r460');

const A457="window.__ctR457Marker='home-movies-sticky+foryou-v421-owner+profile-13-half+f1-v426-progress';";
js=replaceNamedFunctionOptional(js,A457,'enterMovies457',"function enterMovies457(){try{return window.__ctR477?.bootHome?.('movies')??window.__ctR399?.enterHome?.('movies')??false}catch{return false}}",'r457');
js=replaceNamedFunctionOptional(js,A457,'fyPaint457',"function fyPaint457(){try{return window.__ctR464?.render?.()??false}catch{return false}}",'r457');
js=replaceNamedFunctionOptional(js,A457,'fyLoad457',"async function fyLoad457(force=false){try{return await window.__ctR464?.load?.(!!force)??false}catch{return false}}",'r457');
js=replaceNamedFunctionOptional(js,A457,'fySwap457',"function fySwap457(n){try{return window.__ctR464?.swap?.(n)??false}catch{return false}}",'r457');
js=replaceNamedFunctionOptional(js,A457,'scheduleFY457',"function scheduleFY457(force=false){queueMicrotask(()=>{try{if(force)void window.__ctR464?.load?.(true);else window.__ctR464?.activate?.()}catch{}});return true}",'r457');
js=replaceNamedFunctionOptional(js,A457,'profileApply457',"function profileApply457(){try{return window.__ctR476?.paintProfile?.()??false}catch{return false}}",'r457');
js=replaceNamedFunctionOptional(js,A457,'scheduleProfile457',"function scheduleProfile457(){queueMicrotask(()=>{try{window.__ctR476?.paintProfile?.();void window.__ctR476?.loadProfile?.(true)}catch{}});return true}",'r457');

const A455="window.__ctR455={version:'1.0.245'";
js=replaceNamedFunctionOptional(js,A455,'applyProfile455',"function applyProfile455(){return false}",'r455');
js=replaceNamedFunctionOptional(js,A455,'scheduleProfile455',"function scheduleProfile455(){return false}",'r455');
js=replaceNamedFunctionOptional(js,"if(window.__ctR424?.version==='1.0.215')return;",'normalizeProfileLists424',"function normalizeProfileLists424(){return false}",'r424');

js=patchRuntime(js,"window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile';",[
 [" decorateProfileDom();return true;"," decorateProfileDom();try{window.__ctR476?.paintProfile?.()}catch{};queueMicrotask(()=>{try{void window.__ctR476?.loadProfile?.(true)}catch{}});return true;","canonical Profile convergence"]
],'r415');

const A464="window.__ctR464Marker='discover-foryou-visible-owner-v421';";
js=replaceNamedFunction(js,A464,'fetchPool',"async function fetchPool(group,kind){\n const primary=group==='watch'?'cinetracker_discover_watch_smart_v484':'cinetracker_discover_fresh_v484';\n const fallback=group==='watch'?'cinetracker_discover_watch_smart_v476':'cinetracker_discover_fresh_v476';\n const limit=group==='watch'?30:48;\n try{const items=rows(unwrap(await timeout(rpcCall(primary,{p_kind:kind,p_limit:limit}),4500)));if(items.length)return items}catch{}\n try{return rows(unwrap(await timeout(rpcCall(fallback,{p_kind:kind,p_limit:limit}),5500)))}catch{return[]}\n}",'r464');
js=patchRuntime(js,A464,[
 ["cinetracker_record_recommendations_v480","cinetracker_record_recommendations_v484","v484 exposure recorder"],
 [" const warm=['movie','series','anime'].some(k=>state.watch[k].length||state.fresh[k].length);if(warm)render();else renderLoading();void load(true);return true;"," renderLoading();void load(true);return true;","no stale warm repaint"]
],'r464');

js=patchRuntime(js,"if(window.__ctR476?.version==='1.0.266')return;",[
 ["core.rpc('cinetracker_profile_lists_v480',{})","core.rpc('cinetracker_profile_lists_v484',{})","v484 pure Profile source"]
],'r476');

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(runtime.includes(bad))throw new Error('r484 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replace("if(!localStorage.getItem('cinetracker_session'))return;","");
html=html.replaceAll('app-v483.js','app-v484.js').replaceAll('app-v483.css','app-v484.css').replaceAll('v0.3.10','v0.3.11').replaceAll('r483-official-0.3.10','r484-official-0.3.11');
css+='\n/* CineTracker Web 0.3.11 r484 — single visible owners, live strict recommendations and pure Profile lists. */\n';
sw=sw.replaceAll('app-v483.js','app-v484.js').replaceAll('app-v483.css','app-v484.css').replaceAll('ct-web-0.3.10-r483','ct-web-0.3.11-r484');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.11',revision:'r484-official-0.3.11',base:'r483+r484-final-authority',
 scope:'home-stable-live+discover-v484-strict-random+profile-v484-pure-12+movies-history-watchlist',
 home_series:'visible first paint; delayed legacy owners delegate to r477/r399; stale Series/History bootstrap removed',
 home_movies:'r399 v405 remains authority and legacy Home entrypoints converge to r477/r399',
 discover_foryou:'legacy entrypoints converge to r464; live v484 strict pools use v476 exclusion truth, exposure memory and per-open randomization; stale pool cache is never used',
 profile_lists:'r476/v484 is the single list authority: Series/Movies are watch history only; Favorites/Actors isolated; exactly 12 summary cards',
 profile_more:'minimal header Ver mais opens a freshly queried full screen; Movies defaults to History and keeps History/Watchlist tabs',
 sports:'r483/r481 stable counters preserved',f1:'r477/r462 preserved',history:'daily v426 preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v484.js'),js),writeFile(resolve(dist,'app-v484.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v483.js'),{force:true}),rm(resolve(dist,'app-v483.css'),{force:true})]);

const region=anchor=>{const b=bounds(js,anchor,anchor);return js.slice(b.start,b.end)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r457=region(A457),r459=js.includes(A459)?region(A459):'',r460=region(A460),r464=region(A464),r476=region("if(window.__ctR476?.version==='1.0.266')return;");
if(r388.includes('localGet(HS,6*60*60*1000)')||r388.includes('localGet(HH,6*60*60*1000)'))throw new Error('r484 stale Home bootstrap retained');
if(js.includes('html[data-ct459-boot="1"] [data-home-view="series"]{visibility:hidden!important}'))throw new Error('r484 r459 black gate retained');
for(const x of [r457,r459,r460])if(x.includes('enterForYou')&&!x.includes('__ctR464'))throw new Error('r484 legacy Discover owner not converged');
if(!r464.includes('cinetracker_discover_fresh_v484')||!r464.includes('cinetracker_discover_watch_smart_v484')||!r464.includes('cinetracker_record_recommendations_v484'))throw new Error('r484 Discover authority missing');
const fetchBlock=r464.slice(r464.indexOf('async function fetchPool'),r464.indexOf('function chooseDaily'));
if(fetchBlock.includes('readPool481(')||fetchBlock.includes('cinetracker_discover_fresh_v421'))throw new Error('r484 stale/weak Discover source retained');
for(const need of ["core.rpc('cinetracker_profile_lists_v484',{})",'const LIMIT=12','data-ct478-movie-mode="history"','data-ct478-movie-mode="watchlist"','ct476-header-more'])if(!r476.includes(need))throw new Error('r484 Profile missing '+need);
if(html.includes("if(!localStorage.getItem('cinetracker_session'))return;"))throw new Error('r484 preboot session gate retained');
if(!js.includes("window.__ctR484Marker='single-owners+home-live+discover-v484+profile-v484-12'"))throw new Error('r484 marker missing');
const latest=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.11 r484'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(latest.includes(bad))throw new Error('r484 forbidden '+bad);
console.log('WEB_R484_READY final authority stability');
