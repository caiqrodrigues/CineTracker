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
 readFile(resolve(root,'runtime-r484-final-fixes.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r484 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r484 invalid '+label+' bounds');
 return{start,end:close+6};
}
function patchRuntime(source,anchor,patches,label){
 const {start,end}=bounds(source,anchor,label);let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r484 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}
function replaceRuntimeBlock(source,anchor,startNeedle,endNeedle,replacement,label){
 const {start,end}=bounds(source,anchor,label),region=source.slice(start,end);
 const a=region.indexOf(startNeedle);if(a<0)throw new Error('r484 missing '+label+' block start');
 const b=region.indexOf(endNeedle,a+startNeedle.length);if(b<0)throw new Error('r484 missing '+label+' block end');
 const next=region.slice(0,a)+replacement+region.slice(b);
 return source.slice(0,start)+next+source.slice(end);
}
function replaceAllInRuntime(source,anchor,needle,replacement,label,min=1){
 const {start,end}=bounds(source,anchor,label);let region=source.slice(start,end);
 const count=region.split(needle).length-1;if(count<min)throw new Error('r484 missing '+label+' '+needle);
 region=region.replaceAll(needle,replacement);
 return source.slice(0,start)+region+source.slice(end);
}

/* HOME + F1: use the trusted v484 Series map, excluding uncorroborated current-season sessions. */
js=replaceAllInRuntime(
 js,
 "window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",
 'cinetracker_home_series_v452',
 'cinetracker_home_series_v484',
 'r399 Home Series',
 2
);

js=patchRuntime(js,"window.__ctR423Marker='f1-hard-owner-series+sports+f1hub+dual-time+direct-lexical-delegation';",[
 ["function runtime423(ep){return ep?.kind==='race'?120:60}",
  "function runtime423(ep){return num423(ep?.runtime_minutes)||(ep?.kind==='race'?120:60)}",
  'trusted runtime'],
 ["function canonical423(ep){return\`f1:\${ep.season}:\${ep.round}:\${ep.kind}\`}",
  "function canonical423(ep){return String(ep?.canonical_provider_event_id||\`f1:\${ep.season}:\${ep.round}:\${ep.kind}\`)}",
  'trusted canonical id']
],'r423');

js=replaceRuntimeBlock(
 js,
 "window.__ctR423Marker='f1-hard-owner-series+sports+f1hub+dual-time+direct-lexical-delegation';",
 "async function map423(season,force=false){",
 "\nfunction runtime423(ep)",
 `async function map423(season,force=false){
 season=num423(season);if(!season)throw new Error('F1_SEASON_REQUIRED');
 if(!force&&maps423.has(season))return maps423.get(season);
 const task=(async()=>{
  try{
   const raw=await window.__ctCoreR471?.rpc?.('cinetracker_f1_map_v484',{p_season:season}),list=rows423(raw?.data??raw);
   if(list.length){
    const labels={fp1:'Practice 1',fp2:'Practice 2',fp3:'Practice 3',sprint_qualifying:'Sprint Qualifying',sprint:'Sprint Race',qualifying:'Qualifying',race:'Race'};
    return list.map(x=>{
     const date=new Date(x?.starts_at),ms=date.getTime(),kind=String(x?.session_kind||'');
     return{kind,label:labels[kind]||kind,round:num423(x?.round),date,ms,raceName:String(x?.title||'Formula 1').replace(/\\s*\\([^)]*\\)\\s*$/,''),season:num423(x?.season)||season,episode:num423(x?.episode_number),released:Number.isFinite(ms)&&ms<=Date.now(),title:String(x?.title||'Formula 1'),runtime_minutes:num423(x?.runtime_minutes),canonical_provider_event_id:String(x?.canonical_provider_event_id||''),__ct484_server:true};
    }).filter(x=>x.episode>0&&Number.isFinite(x.ms));
   }
  }catch{}
  const all=[];
  for(const race of rows423(await races423(season)))all.push(...defs423(race));
  all.sort((a,b)=>a.ms-b.ms);
  return all.map((x,i)=>({...x,season,episode:i+1,released:x.ms<=Date.now(),title:\`\${x.raceName} (\${x.label})\`}));
 })();
 maps423.set(season,task);
 try{return await task}catch(e){maps423.delete(season);throw e}
}`,
 'r423 map'
);

js=replaceRuntimeBlock(
 js,
 "window.__ctR423Marker='f1-hard-owner-series+sports+f1hub+dual-time+direct-lexical-delegation';",
 "async function persistMap423(map,force=false){",
 "\nasync function reconcile423",
 `async function persistMap423(map,force=false){
 const season=num423(map?.[0]?.season);if(!season||!map?.length)return false;
 if(map.every(x=>x?.__ct484_server===true)){persisted423.set(season,Promise.resolve(true));return true}
 if(!force&&persisted423.has(season))return persisted423.get(season);
 const task=rpc('cinetracker_f1_map_replace_v423',{p_rows:mapPayload423(map)}).then(()=>true);
 persisted423.set(season,task);
 try{return await task}catch(e){persisted423.delete(season);throw e}
}`,
 'r423 persistence'
);

js=replaceAllInRuntime(
 js,
 "if(window.__ctR462?.version==='1.0.252')return;",
 'cinetracker_f1_progress_v426',
 'cinetracker_f1_progress_v484',
 'r462 F1 progress'
);

/* DISCOVER: the strict DB pools are non-empty; stop timing them out at 2.4s and stop launching retry storms. */
js=replaceRuntimeBlock(
 js,
 "window.__ctR464Marker='discover-foryou-visible-owner-v421';",
 "async function fetchPool(group,kind){",
 "\nfunction chooseDaily(){",
 `async function fetchPool(group,kind){
 const primary=group==='watch'?'cinetracker_discover_watch_smart_v480':'cinetracker_discover_fresh_v480';
 const fallback=group==='watch'?'cinetracker_discover_watch_smart_v476':'cinetracker_discover_fresh_v476';
 const limit=group==='watch'?30:48,cached=readPool481(group,kind);
 const fetchStrict=async(name,ms)=>rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),ms)));
 if(cached.length){
  void fetchStrict(primary,9000).then(items=>{if(items.length)savePool481(group,kind,items)}).catch(()=>{});
  return cached;
 }
 try{const items=await fetchStrict(primary,9000);if(items.length){savePool481(group,kind,items);return items}}catch{}
 try{const items=await fetchStrict(fallback,9000);if(items.length)savePool481(group,kind,items);return items}catch{return[]}
}`,
 'r464 fetchPool'
);

js=replaceRuntimeBlock(
 js,
 "window.__ctR464Marker='discover-foryou-visible-owner-v421';",
 "async function load(force=false){",
 "\nconst exclusion=slot=>",
 `async function load(force=false){
 setForYouState();if(routeNow()!=='discover')return false;if(loadTask)return loadTask;
 const token=++loadToken;if(!q('[data-ct464-foryou]',root464()))renderLoading();
 loadTask=(async()=>{
  const kinds=['movie','series','anime'],specs=[...kinds.map(k=>['watch',k]),...kinds.map(k=>['fresh',k])],next=emptyState();
  const settled=await Promise.allSettled(specs.map(([g,k])=>fetchPool(g,k)));
  settled.forEach((r,i)=>{if(r.status==='fulfilled')next[specs[i][0]][specs[i][1]]=rows(r.value)});
  if(token!==loadToken||routeNow()!=='discover')return false;
  for(const k of kinds){next.watch[k]=prioritize480(next.watch[k]);next.fresh[k]=prioritize480(next.fresh[k])}
  state=next;chooseDaily();
  ['movie','series','anime'].forEach(k=>{state.idx.watch[k]=0;state.idx.fresh[k]=0});
  const dailyKey=keyOf(current('daily'));
  for(const k of kinds){const f=rows(state.fresh[k]);if(f.length>1&&keyOf(f[0])===dailyKey)state.idx.fresh[k]=1}
  render();void recordShown479();
  const counts={watch:Object.fromEntries(kinds.map(k=>[k,state.watch[k].length])),fresh:Object.fromEntries(kinds.map(k=>[k,state.fresh[k].length]))};
  document.documentElement.dataset.ct464PoolCounts=JSON.stringify(counts);
  const any=kinds.some(k=>state.watch[k].length||state.fresh[k].length);
  document.documentElement.dataset.ct464ForYou=any?'ready':'empty';
  return any;
 })().catch(e=>{if(token===loadToken){document.documentElement.dataset.ct464ForYou='error';document.documentElement.dataset.ct484ForYouError=String(e?.message||e)}return false}).finally(()=>{if(token===loadToken)loadTask=null});
 return loadTask;
}`,
 'r464 load'
);

/* SPORTS: professional-only RPCs also reject Junior/Juniores competition categories. */
for(const [oldName,newName] of [
 ['cinetracker_sports_payload_v479','cinetracker_sports_payload_v484'],
 ['cinetracker_sports_events_v479','cinetracker_sports_events_v484'],
 ['cinetracker_sport_favorite_events_v479','cinetracker_sport_favorite_events_v484']
])js=js.replaceAll(oldName,newName);

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(runtime.includes(bad))throw new Error('r484 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v483.js','app-v484.js').replaceAll('app-v483.css','app-v484.css').replaceAll('v0.3.10','v0.3.11').replaceAll('r483-official-0.3.10','r484-official-0.3.11');
css+='\n/* CineTracker Web 0.3.11 r484 — compact Movies, exact Profile 12, strict Discover recovery, trusted F1 and no junior Sports. */\n';
sw=sw.replaceAll('app-v483.js','app-v484.js').replaceAll('app-v483.css','app-v484.css').replaceAll('ct-web-0.3.10-r483','ct-web-0.3.11-r484');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.11',
 revision:'r484-official-0.3.11',
 base:'r483+r484-current-ui-data-stability',
 scope:'profile-exact12+sports-no-junior+discover-strict-single-pass+home-fast-f1-trusted+movies-compact',
 profile_lists:'five requested summary lists are forced back through v480 and render exactly 12 content cards; Ver mais remains the separate full-list header action',
 sports:'Web uses v484 professional-only wrappers; U/Sub/Under 14-23 and Junior/Juniores competition categories are excluded while professional club names such as Argentinos Juniors remain allowed',
 discover_foryou:'strict v480/v476 pools use a 9s bounded window and one six-pool load instead of short 2.4s timeouts plus repeated waves; cached strict pools remain instant',
 home_series:'r399 uses cinetracker_home_series_v484; bounded visible bootstrap retained without delayed scroll churn',
 f1:'current-season Series/detail/progress use provider-corroborated v484 map; uncorroborated bogus recent sessions are excluded without rewriting watched history',
 home_movies:'v405 Watchlist data unchanged; final r484 style restores compact rich rows with 44x66 2:3 thumbnails and truncated titles',
 history:'v391/v426 preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v484.js'),js),writeFile(resolve(dist,'app-v484.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v483.js'),{force:true}),rm(resolve(dist,'app-v483.css'),{force:true})]);

const region=anchor=>{const {start,end}=bounds(js,anchor,anchor);return js.slice(start,end)};
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r423=region("window.__ctR423Marker='f1-hard-owner-series+sports+f1hub+dual-time+direct-lexical-delegation';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r462=region("if(window.__ctR462?.version==='1.0.252')return;");
if(!r399.includes('cinetracker_home_series_v484')||r399.includes('cinetracker_home_series_v452'))throw new Error('r484 Home Series authority invalid');
for(const need of ['cinetracker_f1_map_v484','__ct484_server','canonical_provider_event_id'])if(!r423.includes(need))throw new Error('r484 F1 map missing '+need);
if(!r462.includes('cinetracker_f1_progress_v484'))throw new Error('r484 F1 progress missing');
for(const need of ['cinetracker_discover_watch_smart_v480','cinetracker_discover_fresh_v480','cinetracker_discover_watch_smart_v476','cinetracker_discover_fresh_v476','9000','Promise.allSettled(specs.map'])if(!r464.includes(need))throw new Error('r484 Discover missing '+need);
if(r464.includes('cinetracker_discover_watch_unseen_v421')||r464.includes('cinetracker_discover_fresh_v421'))throw new Error('r484 weak Discover fallback retained');
if(!r476.includes('const LIMIT=12'))throw new Error('r484 Profile limit missing');
for(const need of ['cinetracker_sports_payload_v484','cinetracker_sports_events_v484','cinetracker_sport_favorite_events_v484'])if(!js.includes(need))throw new Error('r484 Sports missing '+need);
if(!js.includes("window.__ctR484Marker='home-v484-f1+discover-single-pass+profile-exact12+movies-compact+sports-no-junior'"))throw new Error('r484 runtime marker missing');
console.log('WEB_R484_READY');
