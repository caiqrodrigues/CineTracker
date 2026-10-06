import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r482.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v482.js'),'utf8'),
  readFile(resolve(dist,'app-v482.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);

function runtimeBounds(source,anchor,label){
  const at=source.indexOf(anchor);if(at<0)throw new Error('r483 missing '+label+' anchor');
  const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
  if(start<0||close<0)throw new Error('r483 invalid '+label+' bounds');
  return{start,end:close+6};
}
function replaceFunction(source,anchor,name,replacement,label){
  const {start,end}=runtimeBounds(source,anchor,label),region=source.slice(start,end);
  const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\([^\\{]*\\)\\s*\\{[\\s\\S]*?\\n\\}','m');
  if(!re.test(region))throw new Error('r483 missing '+label+' function '+name);
  return source.slice(0,start)+region.replace(re,replacement)+source.slice(end);
}
function removeFunction(source,anchor,name,label){
  const {start,end}=runtimeBounds(source,anchor,label),region=source.slice(start,end);
  const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\([^\\{]*\\)\\s*\\{[\\s\\S]*?\\n\\}\\n?','m');
  if(!re.test(region))throw new Error('r483 missing '+label+' function '+name);
  return source.slice(0,start)+region.replace(re,'')+source.slice(end);
}
function patchRuntime(source,anchor,patches,label){
  const {start,end}=runtimeBounds(source,anchor,label);let region=source.slice(start,end);
  for(const [needle,replacement,name] of patches){
    const count=region.split(needle).length-1;
    if(count!==1)throw new Error('r483 expected one '+label+' '+name+', found '+count);
    region=region.replace(needle,replacement);
  }
  return source.slice(0,start)+region+source.slice(end);
}
function replaceBlock(source,anchor,startNeedle,endNeedle,replacement,label){
  const {start,end}=runtimeBounds(source,anchor,label),region=source.slice(start,end);
  const a=region.indexOf(startNeedle);if(a<0)throw new Error('r483 missing '+label+' block start');
  const b=region.indexOf(endNeedle,a);if(b<0)throw new Error('r483 missing '+label+' block end');
  const next=region.slice(0,a)+replacement+region.slice(b+endNeedle.length);
  return source.slice(0,start)+next+source.slice(end);
}

/* DISCOVER — preserve strict personal exclusions in every path.
   v480 remains primary and v476 is the only bounded fallback because it enforces
   seen/watchlist/favorite aliases plus the global WWE/NXT exclusion. */
js=replaceFunction(
  js,
  "window.__ctR464Marker='discover-foryou-visible-owner-v421';",
  'fetchPool',
  `async function fetchPool(group,kind){
 const primary=group==='watch'?'cinetracker_discover_watch_smart_v480':'cinetracker_discover_fresh_v480';
 const fallback=group==='watch'?'cinetracker_discover_watch_smart_v476':'cinetracker_discover_fresh_v476';
 const limit=group==='watch'?30:48,cached=readPool481(group,kind);
 const refresh=async()=>{
  try{
   const items=rows(unwrap(await timeout(rpcCall(primary,{p_kind:kind,p_limit:limit}),2400)));
   if(items.length){savePool481(group,kind,items);return items}
  }catch{}
  try{
   const items=rows(unwrap(await timeout(rpcCall(fallback,{p_kind:kind,p_limit:limit}),4500)));
   if(items.length)savePool481(group,kind,items);
   return items
  }catch{return[]}
 };
 if(cached.length){void refresh();return cached}
 return refresh()
}`,
  'r464'
);

/* PROFILE — exactly 12 summary cards. No 13th large More card.
   Only the minimal header action remains, and it opens the existing separate screen. */
js=replaceFunction(
  js,
  "if(window.__ctR476?.version==='1.0.266')return;",
  'ensureHeaderMore',
  `function ensureHeaderMore(panel,key,total){
 const head=q('.panel-head',panel)||panel;
 let b=qa('button,a,[role="button"]',head).find(x=>norm(x.textContent).includes('ver mais'))||null;
 if(!b){b=document.createElement('button');b.type='button';b.className='chip ct476-header-more';head.appendChild(b)}
 const show=Number(total)>LIMIT;
 b.dataset.ct476HeaderMore=key;b.textContent=moreLabels[key];b.hidden=!show;
 if(show){b.style.removeProperty('display');b.removeAttribute('aria-hidden');b.tabIndex=0}
 else{b.style.display='none';b.setAttribute('aria-hidden','true');b.tabIndex=-1}
 b.setAttribute('aria-label',moreLabels[key]);return b
}`,
  'r476'
);
js=removeFunction(js,"if(window.__ctR476?.version==='1.0.266')return;",'summaryMoreCard','r476');
js=replaceFunction(
  js,
  "if(window.__ctR476?.version==='1.0.266')return;",
  'renderPanel',
  `function renderPanel(key){
 const panel=panelFor(key);if(!panel)return false;
 const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [class*="rail"],:scope > [class*="row"]',panel);if(!row)return false;
 const data=listFor(key);removeLargeMore(panel);
 row.innerHTML=data.slice(0,LIMIT).map(x=>renderCard(key,x)).join('')||'<div class="empty">Nenhum item nesta seção.</div>';
 row.dataset.ct476ProfileRow=key;
 const count=q('.panel-head small',panel);if(count)count.textContent=data.length.toLocaleString('pt-BR');
 ensureHeaderMore(panel,key,data.length);return true
}`,
  'r476'
);

/* Reassert the summary hard cap even if an older profile owner repaints later. */
js=patchRuntime(js,"if(window.__ctR477?.version==='1.0.267')return;",[
  ["'[data-profile] [data-ct476-profile-row]>.card:nth-child(n+14){display:none!important}',",
   "'[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13){display:none!important}',",
   '12-card hard cap']
],'r477');

/* r482 introduced two visual regressions against the v0.3.8 specification:
   compact row Movies and the large Profile More card. Remove that style authority;
   r481's later 2:3 Movie grid and r476's header-only Profile styling remain active. */
js=replaceBlock(
  js,
  "window.__ctR482Marker='home-no-anchor-churn+movies-compact-rows+discover-v421-fallback+profile-12-plus-more';",
  "const style=document.createElement('style');",
  "if(!q('#ct482-style'))document.head.appendChild(style);",
  "q('#ct482-style')?.remove();",
  'r482 style authority'
);

js+=`
/* CineTracker Web 0.3.10 r483 — final v0.3.8 specification authority. */
(()=>{
'use strict';
if(window.__ctR483?.version==='0.3.10')return;
window.__ctR483Marker='spec038-final+home-skeleton+movie-2x3+discover-strict-only+profile-12-header-only+stable-sports';
window.__ctR483={version:'0.3.10',scope:'home+f1+discover+profile+sports'};
})();
`;

html=html.replaceAll('app-v482.js','app-v483.js').replaceAll('app-v482.css','app-v483.css').replaceAll('v0.3.9','v0.3.10').replaceAll('r482-official-0.3.9','r483-official-0.3.10');
css+='\n/* CineTracker Web 0.3.10 r483 — finaliza a especificação v0.3.8 sem regressões r482. */\n';
sw=sw.replaceAll('app-v482.js','app-v483.js').replaceAll('app-v482.css','app-v483.css').replaceAll('ct-web-0.3.9-r482','ct-web-0.3.10-r483');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.10',
 revision:'r483-official-0.3.10',
 base:'r482+r483-spec038-final',
 scope:'home-fast-skeleton+f1-optimistic+movies-2x3+discover-strict-smart+profile-pure-12-header-more+stable-sports',
 specification:'v0.3.8 finalized on top of current 0.3.9 main without version downgrade',
 home_series:'instant skeleton and cached first paint preserved; v452 Series and v391 History remain live authorities without delayed anchor churn',
 home_movies:'v405 paging preserved; Watchlist restored to standardized compact 2:3 poster cards with truncated titles',
 f1:'Home check uses cinetracker_f1_watch_sync_v462 with optimistic state, lock and no page reload',
 discover_foryou:'v480 strict pools primary; v476 strict-only fallback; seen/watchlist/favorites and WWE/NXT never bypassed by fallback; cached fast path and weighted random swap preserved',
 profile_lists:'v480 history/favorites/actors remain isolated; exactly 12 summary cards; only minimal header Ver mais remains',
 profile_more:'full DB refresh before separate full-screen render; Movies keeps History/Watchlist toggle and paged v405 Watchlist',
 sports:'last valid TV/Stadium counters remain cached and stable during v296 refresh',
 history:'daily v426 unchanged',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v483.js'),js),writeFile(resolve(dist,'app-v483.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v482.js'),{force:true}),rm(resolve(dist,'app-v482.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r483 missing runtime '+anchor);return js.slice(start,close+6)};
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");
const r481=region("window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only';");
const r482=region("window.__ctR482Marker='home-no-anchor-churn+movies-compact-rows+discover-v421-fallback+profile-12-plus-more';");

for(const need of ['cinetracker_home_series_v452','cinetracker_home_history_v391','cinetracker_home_movies_v405','cinetracker_f1_watch_sync_v462'])if(!js.includes(need))throw new Error('r483 missing '+need);
for(const need of ['cinetracker_discover_fresh_v480','cinetracker_discover_watch_smart_v480','cinetracker_discover_fresh_v476','cinetracker_discover_watch_smart_v476','POOL_CACHE_TTL481','Math.pow(Math.random(),2)'])if(!r464.includes(need))throw new Error('r483 Discover missing '+need);
if(/cinetracker_discover_(fresh|watch_unseen)_v421/.test(r464.slice(r464.indexOf('async function fetchPool'),r464.indexOf('function chooseDaily'))))throw new Error('r483 weak v421 fallback retained');
for(const need of ['const LIMIT=12','async function openAll(key)','await loadProfile(true)','data-ct478-movie-mode="history"','data-ct478-movie-mode="watchlist"'])if(!r476.includes(need))throw new Error('r483 Profile missing '+need);
if(r476.includes('summaryMoreCard')||r476.includes('ct482-profile-more'))throw new Error('r483 large Profile More retained');
if(!r476.includes('Number(total)>LIMIT'))throw new Error('r483 header More threshold missing');
if(!r477.includes('nth-child(n+13)'))throw new Error('r483 12-card cap missing');
if(!r481.includes('aspect-ratio:2/3')||!r481.includes('[data-home-view="movies"] .ct388-movie-stack:not(.ct481-movie-skeleton){display:grid!important'))throw new Error('r483 Movies 2:3 grid missing');
if(r482.includes("style.id='ct482-style'"))throw new Error('r483 conflicting r482 style retained');
if(!js.includes('SPORTS_CACHE481')||!js.includes('saveSports481(next)'))throw new Error('r483 stable sports missing');
if(!js.includes("window.__ctR483Marker='spec038-final+home-skeleton+movie-2x3+discover-strict-only+profile-12-header-only+stable-sports'"))throw new Error('r483 marker missing');
const latest=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.10 r483'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(latest.includes(bad))throw new Error('r483 forbidden '+bad);
console.log('WEB_R483_READY specification v0.3.8 finalized');
