import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r474.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,profile475]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v474.js'),'utf8'),
 readFile(resolve(dist,'app-v474.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r475-profile-owner.js'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r475 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r475 invalid '+label+' runtime bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;if(count!==1)throw new Error('r475 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}

/* Home: r388 is only the frame/history source. Series and Movies data stay on r399. */
js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 [
  "const critical=[loadSeries(false),loadHistory(false)];if(kind==='movies')critical.push(loadMovies(false));",
  "const critical=[loadHistory(false)];",
  'retire legacy media fetches'
 ],
 [
  "renderSeries();if(hHistory){renderHistory('episodes');renderHistory('movies')}if(kind==='movies'&&hMovies.length)renderMoviesAll();scheduleHome393(kind,false);",
  "if(hHistory){renderHistory('episodes');renderHistory('movies')}scheduleHome393(kind,false);",
  'retire legacy media repaint'
 ],
 [
  "if(kind!=='movies'&&!hMovies.length)setTimeout(()=>{if(!hMovies.length)void loadMovies(false)},250);",
  "if(false&&kind!=='movies'&&!hMovies.length)setTimeout(()=>{if(!hMovies.length)void loadMovies(false)},250);",
  'retire delayed legacy movies'
 ],
 [
  "setTimeout(()=>{if(k==='movies'){if(hMovies.length)renderMoviesAll();else void loadMovies(false)}scheduleHome393(k,false)},0)",
  "setTimeout(()=>{scheduleHome393(k,false)},0)",
  'retire tab legacy movies'
 ],
 [
  "function afterDataChanged392(){const onHome=routeNow()==='home',kind=activeKind();invalidateHome392(!onHome);if(!onHome)return;setTimeout(()=>{if(routeNow()!=='home')return;void loadSeries(true);void loadHistory(true);if(kind==='movies')void loadMovies(true)},0)}",
  "function afterDataChanged392(){if(routeNow()!=='home')return;setTimeout(()=>{if(routeNow()==='home')void loadHistory(true)},0)}",
  'history-only data refresh'
 ],
 [
  "if(routeNow()==='home'){paintFrame(activeKind());void loadSeries(true);void loadHistory(true);if(activeKind()==='movies')void loadMovies(true)}",
  "if(routeNow()==='home'){paintFrame(activeKind());void loadHistory(true);setTimeout(()=>window.__ctR399?.settle?.(true),0)}",
  'writer rollback recovery'
 ]
],'r388');

/* r424 was still hiding Home Series and mutating Profile rows after the newer owners. */
js=patchRuntime(js,"window.__ctR424Marker='home-f1-guard+profile-stats-vertical-lists';",[
 [
  "function normalizeProfileLists424(){",
  "function normalizeProfileLists424(){return false}\nfunction normalizeProfileLists424Retired(){",
  'retire profile row normalizer'
 ],
 [
  "async function gateHomeSeries424(){",
  "async function gateHomeSeries424(){return false}\nasync function gateHomeSeries424Retired(){",
  'retire Home visibility gate'
 ]
],'r424');

/* r425 must not swallow Profile data-change events before the final r475 owner sees them. */
js=patchRuntime(js,"window.__ctR425Marker='home-no-blank+f1-1280+foryou-single-slot-optimistic+profile-sports-canonical';",[
 [
  "if(routeNow()==='profile'){e.stopImmediatePropagation();e.preventDefault();profileCanonical425()}",
  "if(routeNow()==='profile'){profileCanonical425();setTimeout(()=>window.__ctR475?.scheduleProfile?.(),0)}",
  'Profile event propagation'
 ]
],'r425');

/* Pra Você: one six-pool request wave only, with a realistic timeout. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 [
  "try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),7000)))}catch{return[]}",
  "try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),20000)))}catch{return[]}",
  'pool timeout'
 ],
 [
  "const kinds=['movie','series','anime'],specs=[...kinds.map(k=>['watch',k]),...kinds.map(k=>['fresh',k])];let next=emptyState();\n  for(const delay of [0,300,900]){\n   if(delay)await new Promise(r=>setTimeout(r,delay));if(token!==loadToken||routeNow()!=='discover')return false;\n   const settled=await Promise.allSettled(specs.map(([g,k])=>fetchPool(g,k)));next=emptyState();\n   settled.forEach((r,i)=>{if(r.status==='fulfilled')next[specs[i][0]][specs[i][1]]=rows(r.value)});\n   if(kinds.some(k=>next.watch[k].length||next.fresh[k].length))break;\n  }",
  "const kinds=['movie','series','anime'],specs=[...kinds.map(k=>['watch',k]),...kinds.map(k=>['fresh',k])],next=emptyState();\n  const settled=await Promise.allSettled(specs.map(([g,k])=>fetchPool(g,k)));if(token!==loadToken||routeNow()!=='discover')return false;\n  settled.forEach((r,i)=>{if(r.status==='fulfilled')next[specs[i][0]][specs[i][1]]=rows(r.value)});",
  'single request wave'
 ]
],'r464');

/* r472 can coordinate routing, but it cannot start repeated data fetches or repaint Profile itself. */
js=patchRuntime(js,"window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';",[
 [
  "function scheduleHome(kind,force=true){",
  "function scheduleHome(kind,force=true){const k=kind==='movies'?'movies':'series',token=++homeScheduleToken;releaseHomeGate();setHomeKind(k);void repairHome(k,force);bounded(()=>{if(token===homeScheduleToken&&routeNow()==='home'){releaseHomeGate();setHomeKind(k)}},[120,420,1000,2200]);return true}\nfunction scheduleHomeRetired472(kind,force=true){",
  'single Home load'
 ],
 [
  "function scheduleForYou(){",
  "function scheduleForYou(){if(routeNow()!=='discover')return false;void activateForYou(true);return true}\nfunction scheduleForYouRetired472(){",
  'single For You load'
 ],
 [
  "async function applyProfile(force=false){",
  "async function applyProfile(force=false){if(routeNow()!=='profile')return false;if(window.__ctR475?.applyProfile)return window.__ctR475.applyProfile(force);return true}\nasync function applyProfileRetired472(force=false){",
  'delegate Profile apply'
 ],
 [
  "function scheduleProfile(force=false){",
  "function scheduleProfile(force=false){if(routeNow()!=='profile')return false;window.__ctR475?.scheduleProfile?.(force);return true}\nfunction scheduleProfileRetired472(force=false){",
  'delegate Profile schedule'
 ]
],'r472');

new Function(profile475);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(profile475.includes(bad))throw new Error('r475 forbidden '+bad);
js+='\n'+profile475+'\n';

html=html.replaceAll('app-v474.js','app-v475.js').replaceAll('app-v474.css','app-v475.css').replaceAll('v1.0.264','v1.0.265').replaceAll('r474-official-1.0.264','r475-official-1.0.265');
css+='\n/* CineTracker Web 1.0.265 r475 — single Home/Discover fetch owners + canonical Profile lists. */\n';
sw=sw.replaceAll('app-v474.js','app-v475.js').replaceAll('app-v474.css','app-v475.css').replaceAll('ct-web-1.0.264-r474','ct-web-1.0.265-r475');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.265',revision:'r475-official-1.0.265',base:'r474+r475-stable-owners-profile-lists',
 scope:'home-v452-v405+history-v391+discover-v421-single-wave+profile-paged-v475+daily-v475',
 home_series:'r424 visibility gate retired; r388 paints frame/history only and r399 is the sole Series v452 data owner',
 home_movies:'r388 legacy movie loader retired; r399 is the sole paged v405 Watchlist owner',
 discover_foryou:'r464 performs one six-pool v421 wave with a 20s ceiling instead of three retry waves',
 profile_lists:'canonical paged v475 lists: Series history, Movie history, Series favorites, Movie favorites and Actors; 12 cards + 13th Ver mais opening a separate screen',
 profile_watchlist:'canonical v475 movie/series Watchlist counts and separate full-list screens',
 history:'daily detail uses v475 with 20s timeout and event_id for sport undo; v426 undo writers preserved',
 f1:'preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v475.js'),js),
 writeFile(resolve(dist,'app-v475.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v474.js'),{force:true}),rm(resolve(dist,'app-v474.css'),{force:true})]);

for(const need of [
 "window.__ctR475Marker='profile-v475-12+13th+watchlist-paged+daily-v475'",
 'cinetracker_profile_list_v475','cinetracker_activity_items_by_day_v475',
 'cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391',
 'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'function gateHomeSeries424(){return false}','function normalizeProfileLists424(){return false}',
 'function scheduleHomeRetired472','function scheduleForYouRetired472','function applyProfileRetired472'
])if(!js.includes(need))throw new Error('r475 missing '+need);
if(js.includes('for(const delay of [0,300,900])'))throw new Error('r475 retained For You retry storm');
if(!js.includes("const critical=[loadHistory(false)];"))throw new Error('r475 r388 still loads legacy media');
console.log('WEB_R475_READY canonical lists + single-flight Home/Discover');
