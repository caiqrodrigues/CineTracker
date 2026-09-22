import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r331.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v331.js'),'utf8'),
 readFile(resolve(dist,'app-v331.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r332-home-discover-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r332 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r332 expected one '+l+', found '+n);return s.replace(a,b)};
const range=(s,start,end,next,label)=>{
 const a=s.indexOf(start),b=s.indexOf(end,a+start.length);
 if(a<0||b<0||b<=a)throw new Error('r332 range '+label+' missing');
 return s.slice(0,a)+next+'\n'+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.122';window.__ctOfficialVersion='1.0.122';",
 "const REVISION='r331-official-1.0.122';",
 "const version='1.0.122',revision='r331-official-1.0.122';",
 "window.__ctR331Marker='home-cache-first+history-natural-scroll+discover-foryou-final-guard'",
 "async function loadForYou321(force=false){",
 "async function source321(tab,force=false){",
 "async function loadPublic321(tab,force=false){",
 "function renderDiscover321(seq){",
 "sourceCache.clear();topCache.clear();",
 "window.__ctR321={renderDiscover:renderDiscover321",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR332Marker='home-anchor-settle+foryou-final-owner+discover-cache-safe+episode-pointer-repair'",
 "repairStaleNext332",
 "data-ct332-fy-auditing",
 "grid-template-columns:repeat(3,minmax(0,1fr))"
])must(runtime,x);

/* Raw TMDB discovery data is independent from personal Seen/Watchlist mutations.
   Keep it cached and deduplicate concurrent fetches so tab switches do not re-run the same remote calls. */
js=once(js,
 "let sourceCache=new Map(),topCache=new Map(),loadToken=0,topToken=0,testBridge=null;",
 "let sourceCache=new Map(),sourceTask332=new Map(),topCache=new Map(),loadToken=0,topToken=0,testBridge=null;",
 'source task cache declaration'
);
const sourceFn=[
"async function source321(tab,force=false){",
" if(testBridge?.source)return dedupe321(await testBridge.source(tab,force));",
" const key=String(tab),hit=sourceCache.get(key);",
" if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;",
" if(sourceTask332.has(key))return sourceTask332.get(key);",
" const task=(async()=>{",
"  const raw=typeof B.sourceNetwork319==='function'?await B.sourceNetwork319(tab):[];",
"  const clean=dedupe321(raw);sourceCache.set(key,{at:Date.now(),rows:clean});return clean;",
" })().finally(()=>sourceTask332.delete(key));",
" sourceTask332.set(key,task);return task;",
"}",
"async function prefetchPublic332(){",
" if(routeNow()!=='discover')return false;",
" for(const tab of ['trending','popular','new','releases','anticipated','top']){",
"  if(routeNow()!=='discover')break;",
"  try{await source321(tab,false)}catch{}",
"  await new Promise(r=>setTimeout(r,90));",
" }",
" return true;",
"}",
"async function prefetchTop332(){",
" if(routeNow()!=='discover')return false;",
" try{",
"  const providers=typeof ct171Providers==='function'?await ct171Providers():[];",
"  const provider=Number(state.topProvider||ct171TopProvider||providers?.[0]?.provider_id||0);",
"  if(provider>0)await topRaw321(provider,false);",
"  return provider>0;",
" }catch{return false}",
"}",
""
].join('\n');
js=range(js,'async function source321(tab,force=false){','async function loadPublic321(tab,force=false){',sourceFn,'cache-safe source');

/* The old r309 producer is allowed to build candidate pools, but never owns the final audited DOM.
   r329 is the only final renderer after v326 has removed Seen/Watchlist/progress rows. */
const fyFn=[
"async function loadForYou321(force=false){",
" const token=++loadToken;loading321('Montando recomendações…');document.documentElement.dataset.ct326FyFiltering='1';document.documentElement.dataset.ct332FyAuditing='1';",
" try{",
"  if(!window.__ctR309?.buildForYou||!window.__ctR309Test?.composeForYou)throw new Error('Recomendações indisponíveis.');",
"  if(force||!window.__ctR309Test.state)await window.__ctR309.buildForYou(!!force);",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  const base=window.__ctR309Test.state;if(!base)throw new Error('Recomendações indisponíveis.');",
"  const flatten=(obj)=>['movie','series','anime'].flatMap(k=>rows(obj?.[k]));",
"  let watch=dedupe321(flatten(base.watchPools));",
"  let fresh=dedupe321([...flatten(base.freshPools),...rows(base.dailyPool)]);",
"  const initialAuthority=await exact321([...watch,...fresh]);",
"  watch=watch.filter(x=>{const k=keyOf(x);return initialAuthority.watch.has(k)&&!initialAuthority.seen.has(k)&&!initialAuthority.notInterested.has(k)});",
"  fresh=fresh.filter(x=>!initialAuthority.blocked.has(keyOf(x)));",
"  const cat=x=>{try{return window.__ctR309Test.category(x)}catch{return typeOf(x)==='movie'?'movie':'series'}};",
"  const enough=()=>{const c={movie:0,series:0,anime:0};for(const x of fresh)c[cat(x)]=(c[cat(x)]||0)+1;return c.movie>=5&&c.series>=3&&c.anime>=3};",
"  for(let page=1;page<=5&&!enough();page++){",
"   const parts=await Promise.all([",
"    tmdbPage321('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':40,'primary_release_date.lte':new Date().toISOString().slice(0,10)},'movie'),",
"    tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':35,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'),",
"    tmdbPage321('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_origin_country:'JP','vote_average.gte':7,'vote_count.gte':20,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv')",
"   ]);",
"   const batch=dedupe321(parts.flat());if(!batch.length)continue;",
"   const a=await exact321(batch);fresh=dedupe321([...fresh,...batch.filter(x=>!a.blocked.has(keyOf(x)))]);",
"  }",
"  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
"  const finalAuthority=await exact321([...watch,...fresh]);",
"  watch=watch.filter(x=>{const k=keyOf(x);return finalAuthority.watch.has(k)&&!finalAuthority.seen.has(k)&&!finalAuthority.notInterested.has(k)});",
"  fresh=fresh.filter(x=>!finalAuthority.blocked.has(keyOf(x)));",
"  const draft=window.__ctR309Test.composeForYou(watch,fresh,{}, {trust:true});",
"  window.__ctR309Test.setForYouState(draft);",
"  discover.forYou={watch:Object.values(draft.initial.watch).filter(Boolean),fresh:Object.values(draft.initial.fresh).filter(Boolean),picks:draft.initial.daily?[draft.initial.daily]:[]};",
"  if(window.__ctR329?.paintForYou){window.__ctR329.ensureFilters?.();window.__ctR329.paintForYou();window.__ctR329.applyFilter?.()}",
"  else if(window.__ctR328?.paintForYou){window.__ctR328.ensureFilters?.();window.__ctR328.paintForYou();window.__ctR328.applyFilter?.()}",
"  else{await window.__ctR309.buildForYou(false);O.applyForYouFilter?.()}",
"  loaded321();setTimeout(()=>void prefetchTop332(),120);return draft.complete;",
" }catch(e){",
"  if(token===loadToken){const h=host();if(h)h.innerHTML='<div class=\"empty\">'+esc(e?.message||'Não foi possível montar as recomendações agora.')+'<br><button class=\"chip\" type=\"button\" data-ct321-retry>Tentar novamente</button></div>';loaded321()}",
"  return false;",
" }finally{delete document.documentElement.dataset.ct326FyFiltering;delete document.documentElement.dataset.ct332FyAuditing}",
"}",
""
].join('\n');
js=range(js,'async function loadForYou321(force=false){','async function tmdbPage321(path,params,type){',fyFn,'audited ForYou final owner');

/* Entering Discover starts raw-source prefetch after the active tab is already interactive. */
const renderStart=js.indexOf('function renderDiscover321(seq){');
const renderEnd=js.indexOf('try{renderDiscover=renderDiscover321}catch{}',renderStart);
if(renderStart<0||renderEnd<0)throw new Error('r332 renderDiscover range missing');
const renderFn=[
"function renderDiscover321(seq){",
" setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',typeof B.shell319==='function'?B.shell319():''));",
" if(seq!==navSeq||routeNow()!=='discover')return;sync321();void loadDiscover321(discover?.tab||'foryou',false);",
" setTimeout(()=>void prefetchPublic332(),240);",
"}",
""
].join('\n');
js=js.slice(0,renderStart)+renderFn+js.slice(renderEnd);

/* Personal state changes require a new v326 audit, not a new TMDB network fetch. */
js=once(js,
 "window.addEventListener('cinetracker:data-changed',()=>{sourceCache.clear();topCache.clear();if(routeNow()==='discover')setTimeout(()=>void loadDiscover321(String(discover?.tab||'foryou'),true),80);if(routeNow()==='profile')setTimeout(()=>void hydrateProfile321(),80)});",
 "window.addEventListener('cinetracker:data-changed',()=>{topCache.clear();if(routeNow()==='discover')setTimeout(()=>void loadDiscover321(String(discover?.tab||'foryou'),false),50);if(routeNow()==='profile')setTimeout(()=>void hydrateProfile321(),80)});",
 'preserve raw Discover cache on personal changes'
);

/* Expose the cache-safe internals to the r332 focused browser gate. */
js=once(js,
 "window.__ctR321={renderDiscover:renderDiscover321,loadDiscover:loadDiscover321,loadPublic:loadPublic321,loadForYou:loadForYou321,loadTop:loadTop321,exact:exact321,hydrateProfile:hydrateProfile321,openDay:openDay321,version:'1.0.112'};",
 "window.__ctR321={renderDiscover:renderDiscover321,loadDiscover:loadDiscover321,loadPublic:loadPublic321,loadForYou:loadForYou321,loadTop:loadTop321,source:source321,prefetchPublic:prefetchPublic332,prefetchTop:prefetchTop332,exact:exact321,hydrateProfile:hydrateProfile321,openDay:openDay321,version:'1.0.112'};",
 'r321 cache-safe hooks'
);

/* Failed TV refreshes must remain retryable instead of poisoning the 15-minute session throttle. */
js=js.replace(
 " try{sessionStorage.setItem(key,String(now))}catch{}\n refreshBusy=(async()=>{",
 " refreshBusy=(async()=>{"
);
js=js.replace(
 "   return out||{};\n  }catch{return{failed:true}}finally{refreshBusy=null}",
 "   try{sessionStorage.setItem(key,String(Date.now()))}catch{}\n   return out||{};\n  }catch{try{sessionStorage.removeItem(key)}catch{}return{failed:true}}finally{refreshBusy=null}"
);

js=once(js,"window.__ctWebBuild='1.0.122';window.__ctOfficialVersion='1.0.122';","window.__ctR332Build='foryou-final-owner+cache-safe-discover+home-anchor-settle+episode-pointer';window.__ctWebBuild='1.0.123';window.__ctOfficialVersion='1.0.123';",'web version');
js=once(js,"const REVISION='r331-official-1.0.122';","const REVISION='r332-official-1.0.123';",'revision');
js=once(js,"const version='1.0.122',revision='r331-official-1.0.122';","const version='1.0.123',revision='r332-official-1.0.123';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v331.js','app-v332.js').replaceAll('app-v331.css','app-v332.css').replaceAll('v1.0.122','v1.0.123').replaceAll('r331-official-1.0.122','r332-official-1.0.123');
sw=sw.replaceAll('ct-web-1.0.122-r331','ct-web-1.0.123-r332').replaceAll('app-v331.js','app-v332.js').replaceAll('app-v331.css','app-v332.css');
css+='\n/* CineTracker Web 1.0.123 r332 — stable Home anchor + audited ForYou owner + cache-safe Discover. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.123',
 revision:'r332-official-1.0.123',
 base:'r331-production',
 scope:'home-history-anchor+discover-final-owner+tab-speed+episode-pointer-consistency',
 home_history_behavior:'normal-flow-above-anchor+zero-history-sliver-at-entry+newest-nearest-anchor',
 home_history_toggle:false,
 home_anchor:'settle-under-home-tabs+cancel-on-user-scroll',
 home_episode_watch_state:'r325-v2-before-pointer-display',
 home_episode_pointer:'never-before-last-watched+background-current-tmdb-reconcile',
 home_tv_refresh:'retry-on-failure+forced-once-background',
 discover_filter_authority:'cinetracker_discover_filter_v326',
 discover_foryou_owner:'r329-after-final-v326-audit-only',
 discover_foryou_filters:'all+movies+series+anime-r329-final',
 discover_foryou_actions:'watchlist+seen+swap-three-compact-one-row',
 discover_public_source_cache:'preserved-across-personal-data-changes+dedup-concurrent',
 discover_public_prefetch:'background-after-discover-first-paint',
 discover_top10:'r330-progressive-fill-ten+v326-final-audit+first-provider-prefetch',
 discover_top10_seen:'v326-final-audit-before-html',
 profile_watchlist_counts:'r324-preserved-exact',
 web_version_ui:'1.0.123+r332-official-1.0.123',
 sports_changes:'none-r332',
 f1_changes:'none-r332',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r332 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v332.js'),js),
 writeFile(resolve(dist,'app-v332.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v331.js'),{force:true}),rm(resolve(dist,'app-v331.css'),{force:true})]);
console.log('WEB_R332_READY audited ForYou + cache-safe Discover + exact Home anchor + episode pointer repair');
