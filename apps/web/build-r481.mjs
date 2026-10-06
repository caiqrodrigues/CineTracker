import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r480.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v480.js'),'utf8'),
 readFile(resolve(dist,'app-v480.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r481-spec038.js'),'utf8')
]);

const once=(source,needle,replacement,label)=>{
 const count=source.split(needle).length-1;
 if(count!==1)throw new Error('r481 expected one '+label+', found '+count);
 return source.replace(needle,replacement);
};
function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r481 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r481 invalid '+label+' bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r481 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}

/* The closure bridge now exposes only a shell constructor, not auth/session internals. */
js=once(js,
 "toast:message=>{try{if(typeof toast==='function')toast(message)}catch{}}\n});",
 "toast:message=>{try{if(typeof toast==='function')toast(message)}catch{}},\n ensureHomeShell:()=>{try{if(!document.querySelector('[data-home]'))setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home></div>'));return document.querySelector('[data-home]')}catch{return null}}\n});",
 'core Home shell bridge'
);

/* Discover: fast pool cache, strict v480 backend, smart random swap among best-ranked candidates. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 ["async function fetchPool(group,kind){",
  `const POOL_CACHE_TTL481=15*60*1000;
function poolKey481(group,kind){return 'ct481:foryou:'+group+':'+kind}
function readPool481(group,kind){try{const x=JSON.parse(localStorage.getItem(poolKey481(group,kind))||'null');return x&&Date.now()-Number(x.at||0)<POOL_CACHE_TTL481&&Array.isArray(x.items)?x.items:[]}catch{return[]}}
function savePool481(group,kind,items){try{localStorage.setItem(poolKey481(group,kind),JSON.stringify({at:Date.now(),items:rows(items)}))}catch{}}
function clearPool481(){for(const g of ['watch','fresh'])for(const k of ['movie','series','anime'])try{localStorage.removeItem(poolKey481(g,k))}catch{}}
async function fetchPool(group,kind){`,
  'pool cache helpers'],
 [" const limit=group==='watch'?30:48;",
  " const limit=group==='watch'?30:48,cached=readPool481(group,kind);",
  'cached pool read'],
 [" try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),7000)))}catch{return[]}",
  " const live=timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),2500).then(v=>rows(unwrap(v)));if(cached.length){void live.then(items=>{if(items.length)savePool481(group,kind,items)}).catch(()=>{});return cached}try{const items=await live;if(items.length)savePool481(group,kind,items);return items}catch{return cached}",
  'fast cached pools'],
 ["const item=eligible[Math.floor(Math.random()*eligible.length)],key=keyOf(item);",
  "const smart=eligible.slice(0,Math.min(8,eligible.length)),item=smart[Math.floor(Math.random()*smart.length)],key=keyOf(item);",
  'smart randomized swap'],
 ["window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>{if(isForYou())void load(true)},0));",
  "window.addEventListener('cinetracker:data-changed',()=>{clearPool481();setTimeout(()=>{if(isForYou())void load(true)},0)});",
  'pool cache invalidation']
],'r464');

/* Profile full-screen always re-queries the full DB payload before painting. */
js=patchRuntime(js,"if(window.__ctR476?.version==='1.0.266')return;",[
 ["function openAll(key){\n const data=listFor(key);closeAll();",
  "async function openAll(key){\n await loadProfile(true);const data=listFor(key);closeAll();",
  'fresh full-list query'],
 ["if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openAll(String(b.dataset.ct476HeaderMore||''));return}",
  "if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void openAll(String(b.dataset.ct476HeaderMore||''));return}",
  'async full-list click']
],'r476');

/* Sports counters retain the last valid value and never blink to zero/hidden during repaint. */
js=patchRuntime(js,"if(window.__ctR477?.version==='1.0.267')return;",[
 ["let sportsSeq=0,sportsTask=null,sportsCache=null,profileSettleSeq=0;",
  "const SPORTS_CACHE481='ct481:profile:sports';\nfunction readSports481(){try{const x=JSON.parse(localStorage.getItem(SPORTS_CACHE481)||'null');return x&&Number.isFinite(Number(x.watched_events))&&Number.isFinite(Number(x.stadium_events))?x:null}catch{return null}}\nfunction saveSports481(v){try{localStorage.setItem(SPORTS_CACHE481,JSON.stringify(v))}catch{}}\nlet sportsSeq=0,sportsTask=null,sportsCache=readSports481(),profileSettleSeq=0;",
  'sports cache'],
 ["const seq=++sportsSeq;hideSports();",
  "const seq=++sportsSeq;if(sportsCache)paintSports(sportsCache);",
  'no hidden sports flash'],
 ["sportsCache=next;paintSports(next);return next;",
  "sportsCache=next;saveSports481(next);paintSports(next);return next;",
  'persist sports'],
 [`  try{window.__ctR476?.paintProfile?.()}catch{}
  if(ms<160)hideSports();else if(sportsCache)paintSports(sportsCache);
  if(ms===160)void loadSports(force);`,
  `  try{window.__ctR476?.paintProfile?.()}catch{}
  if(sportsCache)paintSports(sportsCache);
  if(ms===0)void loadSports(force);`,
  'stable settle'],
 [`if(e.target?.closest?.('[data-nav="profile"]')){sportsCache=null;setTimeout(()=>settleProfile(true),0)}`,
  `if(e.target?.closest?.('[data-nav="profile"]')){sportsCache=readSports481()||sportsCache;setTimeout(()=>settleProfile(true),0)}`,
  'preserve cached sports on navigation']
],'r477');

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(runtime.includes(bad))throw new Error('r481 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v480.js','app-v481.js').replaceAll('app-v480.css','app-v481.css').replaceAll('v1.0.270','v0.3.8').replaceAll('r480-official-1.0.270','r481-official-0.3.8');
css+='\n/* CineTracker Web v0.3.8 r481 — Home skeletons, compact 2:3 Movies, stable Profile sports. */\n';
sw=sw.replaceAll('app-v480.js','app-v481.js').replaceAll('app-v480.css','app-v481.css').replaceAll('ct-web-1.0.270-r480','ct-web-0.3.8-r481');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.8',
 revision:'r481-official-0.3.8',
 base:'r480+r481-spec-0.3.8',
 scope:'home-skeleton-f1+movie-2x3+discover-strict-smart-cache+profile-pure-12-header-more+stable-sports',
 home_series:'instant skeleton/last-known-good paint; v452 remains live authority and Home history remains v391',
 home_movies:'v405 Watchlist preserved; cards standardized to compact 2:3 poster cards',
 f1:'Home check remains asynchronous through cinetracker_f1_watch_sync_v462 with optimistic local state and no reload',
 discover_foryou:'strict v480 pools exclude seen/watchlist/favorites from Fresh/Daily and WWE/NXT globally; cached fast fallback plus smart randomized swap among preference-ranked candidates',
 profile_lists:'history/favorites/actors remain category-pure from v480; exactly 12 summary cards; only minimal header Ver mais remains; full list re-queries DB',
 profile_movies:'full Movies screen keeps History/Watchlist toggle and loads Watchlist through paged v405',
 sports:'last valid TV/Stadium counters are cached and repainted synchronously; live v296 refresh never clears them first',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v481.js'),js),writeFile(resolve(dist,'app-v481.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v480.js'),{force:true}),rm(resolve(dist,'app-v480.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r481 missing runtime '+anchor);return js.slice(start,close+6)};
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");
if(!js.includes("ensureHomeShell:()=>"))throw new Error('r481 Home shell bridge missing');
for(const need of ['POOL_CACHE_TTL481','cinetracker_discover_fresh_v480','cinetracker_discover_watch_smart_v480','Math.min(8,eligible.length)','clearPool481()'])if(!r464.includes(need))throw new Error('r481 Discover missing '+need);
for(const need of ['const LIMIT=12','async function openAll(key)','await loadProfile(true)','data-ct478-movie-mode="history"','data-ct478-movie-mode="watchlist"'])if(!r476.includes(need))throw new Error('r481 Profile missing '+need);
for(const need of ['SPORTS_CACHE481','readSports481()','saveSports481(next)','if(sportsCache)paintSports(sportsCache)'])if(!r477.includes(need))throw new Error('r481 Sports missing '+need);
for(const need of ['cinetracker_f1_watch_sync_v462','cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391'])if(!js.includes(need))throw new Error('r481 missing '+need);
if(!js.includes("window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only'"))throw new Error('r481 marker missing');
console.log('WEB_R481_READY v0.3.8');
