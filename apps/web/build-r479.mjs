import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r478.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v478.js'),'utf8'),
 readFile(resolve(dist,'app-v478.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r479 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r479 invalid '+label+' bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r479 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}

/* PRA VOCE: v479 keeps v476 strict alias/state exclusion and adds seven-day exposure memory. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 ["const name=group==='watch'?'cinetracker_discover_watch_smart_v476':'cinetracker_discover_fresh_v476';",
  "const name=group==='watch'?'cinetracker_discover_watch_smart_v479':'cinetracker_discover_fresh_v479';",
  'v479 pool authorities'],
 [`  let cycle=1;try{cycle=(Number(sessionStorage.getItem('ct478:foryou-cycle')||0)+1)%100000;sessionStorage.setItem('ct478:foryou-cycle',String(cycle))}catch{cycle=Date.now()%100000}
  ['movie','series','anime'].forEach((k,i)=>{const w=rows(state.watch[k]),f=rows(state.fresh[k]);if(w.length)state.idx.watch[k]=(cycle+i*3)%w.length;if(f.length)state.idx.fresh[k]=(cycle+i*5+1)%f.length});
  render();`,
  `  ['movie','series','anime'].forEach(k=>{state.idx.watch[k]=0;state.idx.fresh[k]=0});
  const dailyKey=keyOf(current('daily'));
  for(const k of ['movie','series','anime']){const f=rows(state.fresh[k]);if(f.length>1&&keyOf(f[0])===dailyKey)state.idx.fresh[k]=1}
  render();void recordShown479();`,
  'backend ordered rotation'],
 ["const exclusion=slot=>{if(!excluded.has(slot))excluded.set(slot,new Set());return excluded.get(slot)};",
  `function recordShown479(){
 const slots=['daily','watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime'],items=[],seen=new Set();
 for(const slot of slots){
  const x=current(slot),id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.id||0),type=String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv';
  if(!(id>0))continue;const key=type+':'+id;if(seen.has(key))continue;seen.add(key);
  items.push({media_type:type,tmdb_id:id,title:titleOf(x)});
 }
 if(items.length)void rpcCall('cinetracker_record_recommendations_v479',{p_items:items}).catch(()=>{});
 return items.length;
}
const exclusion=slot=>{if(!excluded.has(slot))excluded.set(slot,new Set());return excluded.get(slot)};`,
  'shown memory recorder'],
 ["  render();return true;","  render();void recordShown479();return true;",'record swapped item'],
 [" removeKey(key,action);render();persist(action,key).catch(()=>{}).finally(()=>locks.delete(slot));return true;",
  " removeKey(key,action);render();void recordShown479();persist(action,key).catch(()=>{}).finally(()=>locks.delete(slot));return true;",
  'record replacement after action']
],'r464');

/* PROFILE: actual watch history only for Series/Movies; favorites and actors stay category-pure. */
js=patchRuntime(js,"if(window.__ctR476?.version==='1.0.266')return;",[
 ["core.rpc('cinetracker_profile_lists_v476',{})","core.rpc('cinetracker_profile_lists_v479',{})",'history-only profile RPC']
],'r476');

/* SPORTS: Web-only v479 wrappers remove age-group events while Android keeps legacy RPCs. */
for(const [oldName,newName] of [
 ['cinetracker_sports_payload_v1','cinetracker_sports_payload_v479'],
 ['cinetracker_sports_events_v0997','cinetracker_sports_events_v479'],
 ['cinetracker_sport_favorite_events_v2','cinetracker_sport_favorite_events_v479']
])js=js.replaceAll(oldName,newName);

/* HOME: show a stable first-paint skeleton immediately while the session is restored.
   This never hides the real Home and is replaced by the normal shell as soon as it paints. */
const mount='<body><div id="app"></div>';
if(html.split(mount).length-1!==1)throw new Error('r479 app mount not unique');
const preboot=`<script data-ct479-preboot>(function(){try{var p=String(location.pathname||'/').replace(/\\/+$/,'')||'/';if(p!=='/'&&p!=='/home')return;if(!localStorage.getItem('cinetracker_session'))return;var a=document.getElementById('app');if(!a||a.children.length)return;a.innerHTML='<div data-ct479-preboot-ui style="min-height:100vh;padding:24px;background:#090909;color:#f4f4f5;font-family:Inter,system-ui,sans-serif"><div style="font-size:18px;font-weight:800;letter-spacing:.08em"><span style="color:#d6b55b">CINE</span>TRACKER</div><div style="margin-top:30px;color:#d6b55b;font-size:12px;font-weight:700">HOME</div><h1 style="font-size:26px;margin:6px 0 18px">Sua biblioteca</h1><div style="display:grid;gap:12px;max-width:980px"><div style="height:72px;border:1px solid #292929;border-radius:14px;background:#111"></div><div style="height:126px;border:1px solid #292929;border-radius:14px;background:#111"></div><div style="height:126px;border:1px solid #292929;border-radius:14px;background:#111"></div></div><div style="margin-top:14px;color:#969696;font-size:12px">Carregando Home…</div></div>'}catch(e){}})();</script>`;
html=html.replace(mount,mount+preboot);

js+='\n'+`/* CineTracker Web 1.0.269 r479 — stable Home first paint, strict non-repeating recommendations, pure Profile history and professional Sports. */
(()=>{
'use strict';
if(window.__ctR479?.version==='1.0.269')return;
window.__ctR479Marker='home-visible-preboot+discover-v479-strict-memory+profile-v479-history-only+sports-professional-only';
window.__ctR479={version:'1.0.269',scope:'home+discover-foryou+profile+sports'};
})();
`+'\n';

html=html.replaceAll('app-v478.js','app-v479.js').replaceAll('app-v478.css','app-v479.css').replaceAll('v1.0.268','v1.0.269').replaceAll('r478-official-1.0.268','r479-official-1.0.269');
css+='\n/* CineTracker Web 1.0.269 r479 — visible Home boot, strict recommendations, pure Profile history and professional-only Sports. */\n';
sw=sw.replaceAll('app-v478.js','app-v479.js').replaceAll('app-v478.css','app-v479.css').replaceAll('ct-web-1.0.268-r478','ct-web-1.0.269-r479');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.269',
 revision:'r479-official-1.0.269',
 base:'r478+r479-strict-stability',
 scope:'home-visible-first-paint+discover-strict-memory+profile-history-pure+movies-history-watchlist-tabs+sports-professional-only',
 home_series:'visible preboot skeleton removes the empty black interval while r478/r399 v452 and r388 history settle without a page reload',
 home_movies:'r478/r399 v405 Watchlist preserved; first-paint shell remains stable',
 discover_foryou:'v479 wraps v476 strict ID/alias/history/favorite/watchlist exclusions and seven-day shown memory; rendered and swapped recommendations are persisted',
 profile_lists:'v479 Series/Movies are actual watch activity only; Favorites/Actors are category-pure; exactly 12 summary cards remain',
 profile_movies:'Movies full screen still defaults to History and can switch to Watchlist at the top',
 sports:'Web RPCs use v479 professional-only wrappers for U/Sub/Under age 14-23; professional club names such as Argentinos Juniors remain allowed',
 f1:'r478/r477/r462 preserved',
 history:'daily v426 preserved',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v479.js'),js),writeFile(resolve(dist,'app-v479.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v478.js'),{force:true}),rm(resolve(dist,'app-v478.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r479 missing runtime '+anchor);return js.slice(start,close+6)};
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
if(!html.includes('data-ct479-preboot')||!html.includes('Carregando Home'))throw new Error('r479 visible Home preboot missing');
if(!r464.includes('cinetracker_discover_watch_smart_v479')||!r464.includes('cinetracker_discover_fresh_v479')||!r464.includes('cinetracker_record_recommendations_v479')||!r464.includes('recordShown479'))throw new Error('r479 Discover authority missing');
if(!r476.includes("core.rpc('cinetracker_profile_lists_v479',{})")||!r476.includes('const LIMIT=12')||!r476.includes('data-ct478-movie-mode="history"')||!r476.includes('data-ct478-movie-mode="watchlist"'))throw new Error('r479 Profile authority missing');
for(const need of ['cinetracker_sports_payload_v479','cinetracker_sports_events_v479','cinetracker_sport_favorite_events_v479'])if(!js.includes(need))throw new Error('r479 Sports authority missing '+need);
if(js.includes('cinetracker_sports_payload_v1')||js.includes('cinetracker_sports_events_v0997')||js.includes('cinetracker_sport_favorite_events_v2'))throw new Error('r479 retained legacy Web Sports RPC');
const r479=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.269 r479'));for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(r479.includes(bad))throw new Error('r479 forbidden '+bad);
if(!js.includes("window.__ctR479Marker='home-visible-preboot+discover-v479-strict-memory+profile-v479-history-only+sports-professional-only'"))throw new Error('r479 marker missing');
console.log('WEB_R479_READY');
