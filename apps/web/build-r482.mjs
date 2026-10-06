import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r481.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v481.js'),'utf8'),
 readFile(resolve(dist,'app-v481.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r482-targeted.js'),'utf8')
]);

function runtimeBounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r482 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r482 invalid '+label+' bounds');
 return{start,end:close+6};
}
function patchRuntime(source,anchor,patches,label){
 const {start,end}=runtimeBounds(source,anchor,label);let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r482 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}
function replaceFunction(source,anchor,name,replacement,label){
 const {start,end}=runtimeBounds(source,anchor,label),region=source.slice(start,end);
 const re=new RegExp('function\\s+'+name+'\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}','m');
 const found=region.match(re);
 if(!found)throw new Error('r482 missing '+label+' function '+name);
 const next=region.replace(re,replacement);
 return source.slice(0,start)+next+source.slice(end);
}

/* HOME SERIES/HISTORY: retire every delayed automatic anchor/re-entry writer.
   Data authorities remain r399/v452 and r388/v391. */
js=replaceFunction(
 js,
 "window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",
 'scheduleHome393',
 `function scheduleHome393(kind=activeKind(),fresh=false){
 if(fresh){homeAnchorToken393++;homeUserMoved393=false}
 return homeAnchorToken393
}`,
 'r388'
);
js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 ["renderHistory('episodes');renderHistory('movies');scheduleHome393(activeKind(),false);setTimeout(()=>{try{window.__ctR399?.enterHome?.(activeKind())}catch{}},0)",
  "renderHistory('episodes');renderHistory('movies')",
  'history repaint without primary repaint'],
 ["window.__ctCoreR471?.homeMovieCard?.(y)","window.__ctCoreR471?.homeMovieRow?.(y)",'compact movie row'],
 ["stack.replaceChildren();stack.classList.add('ct476-movie-grid');stack.style.display='grid';stack.style.flexDirection='';const frag=document.createDocumentFragment()",
  "stack.replaceChildren();stack.classList.remove('ct476-movie-grid');stack.style.display='flex';stack.style.flexDirection='column';const frag=document.createDocumentFragment()",
  'compact movie stack']
],'r388');

js=replaceFunction(
 js,
 "window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",
 'scheduleAlign399',
 `function scheduleAlign399(kind=activeHome(),fresh=true){
 if(fresh){alignToken++;userMoved=false}
 return alignToken
}`,
 'r399'
);
js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
 ["window.__ctCoreR471?.homeMovieCard?.(y)","window.__ctCoreR471?.homeMovieRow?.(y)",'compact movie row'],
 ["stack.replaceChildren();stack.classList.add('ct476-movie-grid');stack.style.display='grid';stack.style.flexDirection='';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",
  "stack.replaceChildren();stack.classList.remove('ct476-movie-grid');stack.style.display='flex';stack.style.flexDirection='column';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",
  'compact movie stack']
],'r399');

js=patchRuntime(js,"window.__ctR475HomeAnchor={version:'1.0.265',schedule};",[
 [`const schedule=kind=>{
 const wanted=kind==='movies'?'movies':'series',run=++token;userMoved=false;
 for(const ms of [80,260,620,980,1380])setTimeout(()=>{
  if(run!==token||userMoved||routeNow()!=='home')return;
  try{window.__ctR399?.enterHome?.(wanted)}catch{}
 },ms);
 return run;
};`,
  `const schedule=kind=>{userMoved=false;return ++token};`,
  'retire delayed Home re-entry']
],'r475');

js=replaceFunction(
 js,
 "if(window.__ctR476?.version==='1.0.266')return;",
 'primeHome',
 `function primeHome(kind='series'){
 if(routeNow()!=='home')return false;
 const k=kind==='movies'?'movies':'series';homeUserMoved=false;++homeToken;
 try{if(!q('[data-home]'))core.ensureHomeShell?.()}catch{}
 try{if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]'))void window.__ctR388?.renderHome?.()}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 return true
}`,
 'r476'
);

/* HOME MOVIES: r481 loading becomes compact rows, not poster-sized blocks. */
js=replaceFunction(
 js,
 "window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only';",
 'paintMovieSkeleton',
 `function paintMovieSkeleton(){
 const stack=q('[data-home-view="movies"] [data-ct388-movie-watch] .ct388-movie-stack');if(!stack||moviesReady())return false;
 stack.classList.add('ct481-movie-skeleton');stack.innerHTML=skeletonRows(5);return true
}`,
 'r481'
);
js=replaceFunction(
 js,
 "window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only';",
 'prime',
 `function prime(kind='series'){
 const k=kind==='movies'?'movies':'series',now=Date.now();
 if(window.__ctR482PrimeKind===k&&now-Number(window.__ctR482PrimeAt||0)<500)return true;
 window.__ctR482PrimeKind=k;window.__ctR482PrimeAt=now;
 if(!(routeNow()==='home'||homeLocation()))return false;
 try{core.ensureHomeShell?.()}catch{}
 try{window.__ctR477?.bootHome?.(k)}catch{}
 if(k==='movies')paintMovieSkeleton();else paintSeriesSkeleton();
 setTimeout(clearSkeletons,700);
 return true
}`,
 'r481'
);

/* DISCOVER: strict v480 remains primary. v421 is a bounded, tested fallback
   when the strict query hits statement_timeout, so Daily never collapses to empty. */
js=replaceFunction(
 js,
 "window.__ctR464Marker='discover-foryou-visible-owner-v421';",
 'fetchPool',
 `async function fetchPool(group,kind){
 const primary=group==='watch'?'cinetracker_discover_watch_smart_v480':'cinetracker_discover_fresh_v480';
 const fallback=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';
 const limit=group==='watch'?30:48,fallbackLimit=group==='watch'?18:24,cached=readPool481(group,kind);
 const live=timeout(rpcCall(primary,{p_kind:kind,p_limit:limit}),2200).then(v=>rows(unwrap(v)));
 if(cached.length){void live.then(items=>{if(items.length)savePool481(group,kind,items)}).catch(()=>{});return cached}
 try{const items=await live;if(items.length){savePool481(group,kind,items);return items}}catch{}
 try{
  const items=rows(unwrap(await timeout(rpcCall(fallback,{p_kind:kind,p_limit:fallbackLimit}),7000)));
  if(items.length)savePool481(group,kind,items);
  return items
 }catch{return[]}
}`,
 'r464'
);

/* PROFILE: cache the last complete list payload, show 12 cards + one 13th More,
   and keep the existing separate full-screen viewer. */
js=patchRuntime(js,"if(window.__ctR476?.version==='1.0.266')return;",[
 ["async function loadProfile(force=false){",
  `const PROFILE_CACHE482='ct482:profile-lists';
function readProfile482(){try{const x=JSON.parse(localStorage.getItem(PROFILE_CACHE482)||'null');return x&&x.data&&Date.now()-Number(x.at||0)<12*60*60*1000?x.data:null}catch{return null}}
function saveProfile482(data){try{localStorage.setItem(PROFILE_CACHE482,JSON.stringify({at:Date.now(),data}))}catch{}}
function fallbackProfile482(){try{const r=core.profileRows?.()||{},d=core.profileData?.()||{};return{series:rows(r.series),movies:rows(r.movies),series_favorites:rows(r.seriesFav),movie_favorites:rows(r.movieFav),actors:rows(d.favorite_actors)}}catch{return null}}
async function loadProfile(force=false){`,
  'profile cache helpers']
],'r476');
js=replaceFunction(
 js,
 "if(window.__ctR476?.version==='1.0.266')return;",
 'loadProfile',
 `async function loadProfile(force=false){
 if(profileTask)return profileTask;
 if(!profile){const cached=readProfile482();if(cached){profile=cached;paintProfile()}}
 if(profile&&!force){paintProfile();return profile}
 profileTask=(async()=>{try{
  const raw=await Promise.race([core.rpc('cinetracker_profile_lists_v480',{}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('profile-timeout')),6500))]);
  if(raw&&typeof raw==='object'&&!Array.isArray(raw)){profile=raw;saveProfile482(raw)}
  if(!profile)profile=fallbackProfile482();
  paintProfile();return profile
 }catch(e){
  if(!profile)profile=fallbackProfile482();
  paintProfile();document.documentElement.dataset.ct476ProfileError=String(e?.message||e);return profile
 }finally{profileTask=null}})();
 return profileTask
}`,
 'r476'
);
js=replaceFunction(
 js,
 "if(window.__ctR476?.version==='1.0.266')return;",
 'ensureHeaderMore',
 `function ensureHeaderMore(panel,key,total){
 const head=q('.panel-head',panel)||panel;
 const b=qa('button,a,[role="button"]',head).find(x=>norm(x.textContent).includes('ver mais'))||null;
 if(b){b.dataset.ct476HeaderMore=key;b.hidden=true;b.style.display='none';b.setAttribute('aria-hidden','true');b.tabIndex=-1}
 return b
}`,
 'r476'
);
js=patchRuntime(js,"if(window.__ctR476?.version==='1.0.266')return;",[
 ["function renderPanel(key){",
  `function summaryMoreCard(key,total){
 const remaining=Math.max(0,total-LIMIT);
 return '<article class="card ct482-profile-more"><button type="button" data-ct476-header-more="'+esc(key)+'" aria-label="'+esc(moreLabels[key])+'"><div class="poster"><span>＋'+remaining.toLocaleString('pt-BR')+'</span></div><div class="card-body"><b>Ver mais</b><small>'+total.toLocaleString('pt-BR')+' no total</small></div></button></article>';
}
function renderPanel(key){`,
  'summary More helper']
],'r476');
js=replaceFunction(
 js,
 "if(window.__ctR476?.version==='1.0.266')return;",
 'renderPanel',
 `function renderPanel(key){
 const panel=panelFor(key);if(!panel)return false;
 const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [class*="rail"],:scope > [class*="row"]',panel);if(!row)return false;
 const data=listFor(key);removeLargeMore(panel);
 const summary=data.slice(0,LIMIT).map(x=>renderCard(key,x)).join('');
 row.innerHTML=(summary+(data.length>LIMIT?summaryMoreCard(key,data.length):''))||'<div class="empty">Nenhum item nesta seção.</div>';
 row.dataset.ct476ProfileRow=key;
 const count=q('.panel-head small',panel);if(count)count.textContent=data.length.toLocaleString('pt-BR');
 ensureHeaderMore(panel,key,data.length);return true
}`,
 'r476'
);

js=patchRuntime(js,"if(window.__ctR477?.version==='1.0.267')return;",[
 ["'[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13){display:none!important}',",
  "'[data-profile] [data-ct476-profile-row]>.card:nth-child(n+14){display:none!important}',",
  'allow 13th More']
],'r477');

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(runtime.includes(bad))throw new Error('r482 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v481.js','app-v482.js').replaceAll('app-v481.css','app-v482.css').replaceAll('v0.3.8','v0.3.9').replaceAll('r481-official-0.3.8','r482-official-0.3.9');
css+='\n/* CineTracker Web 0.3.9 r482 — stable Home history, compact Movie rows, Daily fallback, Profile 12+More. */\n';
sw=sw.replaceAll('app-v481.js','app-v482.js').replaceAll('app-v481.css','app-v482.css').replaceAll('ct-web-0.3.8-r481','ct-web-0.3.9-r482');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.9',
 revision:'r482-official-0.3.9',
 base:'r481+r482-targeted-ui-stability',
 scope:'home-series-history-stable+movies-compact-rows+discover-daily-fallback+profile-12-plus-more',
 home_series:'removed delayed automatic scroll/re-entry writers; v452/v391 data authorities unchanged',
 home_movies:'v405 data unchanged; rich row renderer restored with compact thumbnail layout',
 discover_foryou:'v480 remains strict primary; v421 bounded fallback supplies Daily and slots when v480 times out',
 profile_lists:'exactly 12 media/actor cards plus one 13th Ver mais card; full list continues to open separately',
 sports:'unchanged-r481',f1:'unchanged-r481/r462',history:'daily-v426-unchanged',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v482.js'),js),writeFile(resolve(dist,'app-v482.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v481.js'),{force:true}),rm(resolve(dist,'app-v481.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r482 missing runtime '+anchor);return js.slice(start,close+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");
const r481=region("window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only';");
if(r388.includes('scheduleHome393(activeKind(),false)')||r388.includes("homeMovieCard?.(y)")||r399.includes("homeMovieCard?.(y)"))throw new Error('r482 retained Home repaint/card owner');
if(!r388.includes("classList.remove('ct476-movie-grid')")||!r399.includes("classList.remove('ct476-movie-grid')"))throw new Error('r482 compact movie stack missing');
if(r476.includes('[0,70,180,360,650,1000]'))throw new Error('r482 retained r476 Home anchor loop');
if(!r464.includes('cinetracker_discover_fresh_v421')||!r464.includes('cinetracker_discover_watch_unseen_v421'))throw new Error('r482 Discover fallback missing');
if(!r476.includes('summaryMoreCard')||!r476.includes('ct482-profile-more')||!r476.includes('const LIMIT=12')||!r476.includes('PROFILE_CACHE482'))throw new Error('r482 Profile 12+More/cache missing');
if(!r477.includes('nth-child(n+14)'))throw new Error('r482 13th More hidden');
if(!r481.includes('skeletonRows(5)')||r481.includes('for(const ms of [0,20,60,140])'))throw new Error('r482 Home/Movies r481 patch missing');
if(!js.includes("window.__ctR482Marker='home-no-anchor-churn+movies-compact-rows+discover-v421-fallback+profile-12-plus-more'"))throw new Error('r482 marker missing');
console.log('WEB_R482_READY targeted fixes');
