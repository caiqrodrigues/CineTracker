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

function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r482 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r482 invalid '+label+' bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r482 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}

/* Home: no delayed automatic scroll/re-anchor after History/Series repaint. */
js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 [`function scheduleHome393(kind=activeKind(),fresh=false){
 if(fresh){homeAnchorToken393++;homeUserMoved393=false}const token=homeAnchorToken393;
 queueMicrotask(()=>alignHome393(kind,token));requestAnimationFrame(()=>alignHome393(kind,token));for(const ms of [40,140,360,760,1400])setTimeout(()=>alignHome393(kind,token),ms);return token
}`,
  `function scheduleHome393(kind=activeKind(),fresh=false){
 if(fresh){homeAnchorToken393++;homeUserMoved393=false}
 return homeAnchorToken393
}`,
  'disable delayed history anchors']
],'r388');

js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
 [`function scheduleAlign399(kind=activeHome(),fresh=true){
 if(fresh){alignToken++;userMoved=false}const token=alignToken;
 requestAnimationFrame(()=>alignHome399(kind,token));
 for(const ms of [120,420])setTimeout(()=>alignHome399(kind,token),ms);
 return token;
}`,
  `function scheduleAlign399(kind=activeHome(),fresh=true){
 if(fresh){alignToken++;userMoved=false}
 return alignToken;
}`,
  'disable delayed series/movie anchors']
],'r399');

js=patchRuntime(js,"if(window.__ctR476?.version==='1.0.266')return;",[
 [`function primeHome(kind='series'){
 if(routeNow()!=='home')return false;
 const k=kind==='movies'?'movies':'series';homeUserMoved=false;const token=++homeToken;
 try{if(!q('[data-home]'))core.ensureHomeShell?.()}catch{}
 try{if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]'))void window.__ctR388?.renderHome?.()}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 for(const ms of [0,70,180,360,650,1000])setTimeout(()=>anchorHome(k,token),ms);
 return true;
}`,
  `function primeHome(kind='series'){
 if(routeNow()!=='home')return false;
 const k=kind==='movies'?'movies':'series';homeUserMoved=false;++homeToken;
 try{if(!q('[data-home]'))core.ensureHomeShell?.()}catch{}
 try{if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]'))void window.__ctR388?.renderHome?.()}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 return true;
}`,
  'remove Home scroll loop'],
 [`function ensureHeaderMore(panel,key,total){
 const head=q('.panel-head',panel)||panel;
 let b=qa('button,a,[role="button"]',head).find(x=>norm(x.textContent).includes('ver mais'))||null;
 if(!b){b=document.createElement('button');b.type='button';b.className='chip ct476-header-more';head.appendChild(b)}
 b.dataset.ct476HeaderMore=key;b.textContent=moreLabels[key];b.hidden=total===0;b.style.removeProperty('display');b.removeAttribute('aria-hidden');b.tabIndex=0;b.setAttribute('aria-label',moreLabels[key]);return b;
}`,
  `function ensureHeaderMore(panel,key,total){
 const head=q('.panel-head',panel)||panel;
 const b=qa('button,a,[role="button"]',head).find(x=>norm(x.textContent).includes('ver mais'))||null;
 if(b){b.dataset.ct476HeaderMore=key;b.hidden=true;b.style.display='none';b.setAttribute('aria-hidden','true');b.tabIndex=-1}
 return b;
}
function summaryMoreCard(key,total){
 const remaining=Math.max(0,total-LIMIT);
 return '<article class="card ct482-profile-more"><button type="button" data-ct476-header-more="'+esc(key)+'" aria-label="'+esc(moreLabels[key])+'"><div class="poster"><span>＋'+remaining.toLocaleString('pt-BR')+'</span></div><div class="card-body"><b>Ver mais</b><small>'+total.toLocaleString('pt-BR')+' no total</small></div></button></article>';
}`,
  'restore 13th More card'],
 [` row.innerHTML=data.slice(0,LIMIT).map(x=>renderCard(key,x)).join('')||'<div class="empty">Nenhum item nesta seção.</div>';`,
  ` const summary=data.slice(0,LIMIT).map(x=>renderCard(key,x)).join('');
 row.innerHTML=(summary+(data.length>LIMIT?summaryMoreCard(key,data.length):''))||'<div class="empty">Nenhum item nesta seção.</div>';`,
  '12 plus 13th More']
],'r476');

js=patchRuntime(js,"if(window.__ctR477?.version==='1.0.267')return;",[
 ["'[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13){display:none!important}',",
  "'[data-profile] [data-ct476-profile-row]>.card:nth-child(n+14){display:none!important}',",
  'allow 13th More']
],'r477');

/* r481 boot only primes once; Movies loading uses compact rows instead of giant cards. */
js=patchRuntime(js,"window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only';",[
 [`function paintMovieSkeleton(){
 const stack=q('[data-home-view="movies"] [data-ct388-movie-watch] .ct388-movie-stack');if(!stack||moviesReady())return false;
 stack.classList.add('ct481-movie-skeleton');stack.innerHTML=skeletonCards(6);return true;
}`,
  `function paintMovieSkeleton(){
 const stack=q('[data-home-view="movies"] [data-ct388-movie-watch] .ct388-movie-stack');if(!stack||moviesReady())return false;
 stack.classList.add('ct481-movie-skeleton');stack.innerHTML=skeletonRows(5);return true;
}`,
  'compact movie loading'],
 [`function prime(kind='series'){
 const k=kind==='movies'?'movies':'series';
 for(const ms of [0,20,60,140]){
  setTimeout(()=>{
   if(!(routeNow()==='home'||homeLocation()))return;
   try{core.ensureHomeShell?.()}catch{}
   try{window.__ctR477?.bootHome?.(k)}catch{}
   if(k==='movies')paintMovieSkeleton();else paintSeriesSkeleton();
  },ms);
 }
 for(const ms of [220,420,800,1400,2400,4000])setTimeout(clearSkeletons,ms);
 return true;
}`,
  `let primeKind='',primeAt=0;
function prime(kind='series'){
 const k=kind==='movies'?'movies':'series',now=Date.now();
 if(primeKind===k&&now-primeAt<500)return true;
 primeKind=k;primeAt=now;
 if(!(routeNow()==='home'||homeLocation()))return false;
 try{core.ensureHomeShell?.()}catch{}
 try{window.__ctR477?.bootHome?.(k)}catch{}
 if(k==='movies')paintMovieSkeleton();else paintSeriesSkeleton();
 setTimeout(clearSkeletons,700);
 return true;
}`,
  'single Home prime']
],'r481');

/* Discover: strict v480 remains primary; proven-fast v421 is the bounded fallback.
   This prevents an empty Daily card when v480 hits statement_timeout. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 [`async function fetchPool(group,kind){
 const name=group==='watch'?'cinetracker_discover_watch_smart_v480':'cinetracker_discover_fresh_v480';
 const limit=group==='watch'?30:48,cached=readPool481(group,kind);
 const live=timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),2500).then(v=>rows(unwrap(v)));
 if(cached.length){void live.then(items=>{if(items.length)savePool481(group,kind,items)}).catch(()=>{});return cached}
 try{const items=await live;if(items.length)savePool481(group,kind,items);return items}catch{return cached}
}`,
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
  return items;
 }catch{return[]}
}`,
  'v421 fallback']
],'r464');

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
 home_series:'removed delayed automatic scroll anchors and repeated prime passes; v452/v391 authorities unchanged',
 home_movies:'v405 data unchanged; visual restored to compact row layout with small 2:3 thumbnail',
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
if(r388.includes('[40,140,360,760,1400]')||r399.includes('[120,420]')||r476.includes('[0,70,180,360,650,1000]'))throw new Error('r482 retained Home anchor churn');
if(!r464.includes('cinetracker_discover_fresh_v421')||!r464.includes('cinetracker_discover_watch_unseen_v421'))throw new Error('r482 Discover fallback missing');
if(!r476.includes('summaryMoreCard')||!r476.includes('ct482-profile-more')||!r476.includes('const LIMIT=12'))throw new Error('r482 Profile 12+More missing');
if(!r477.includes('nth-child(n+14)'))throw new Error('r482 13th More hidden');
if(!r481.includes('skeletonRows(5)')||r481.includes('for(const ms of [0,20,60,140])'))throw new Error('r482 Home/Movies r481 patch missing');
if(!js.includes("window.__ctR482Marker='home-no-anchor-churn+movies-compact-rows+discover-v421-fallback+profile-12-plus-more'"))throw new Error('r482 marker missing');
console.log('WEB_R482_READY targeted fixes');
