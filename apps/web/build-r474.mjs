import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r473.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v473.js'),'utf8'),
  readFile(resolve(dist,'app-v473.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
  const at=source.indexOf(anchor);
  if(at<0)throw new Error('r474 missing '+label+' anchor');
  const start=source.lastIndexOf('(()=>{',at);
  const close=source.indexOf('\n})();',at);
  if(start<0||close<0)throw new Error('r474 invalid '+label+' runtime bounds');
  const end=close+6;
  let region=source.slice(start,end);
  for(const [needle,replacement,name] of patches){
    const count=region.split(needle).length-1;
    if(count!==1)throw new Error('r474 expected one '+label+' '+name+', found '+count);
    region=region.replace(needle,replacement);
  }
  return source.slice(0,start)+region+source.slice(end);
}
function patchGlobal(source,needle,replacement,label){
  const count=source.split(needle).length-1;
  if(count!==1)throw new Error('r474 expected one '+label+', found '+count);
  return source.replace(needle,replacement);
}


/* Home frame/history: paint immediately and keep the active primary section anchored
   after the asynchronous History repaint. */
js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
  [
    "if(v&&typeof v==='object'){hHistory=v;cacheSet(HH,v);if(routeNow()==='home'){renderHistory('episodes');renderHistory('movies')}}return hHistory",
    "if(v&&typeof v==='object'){hHistory=v;cacheSet(HH,v);if(routeNow()==='home'){renderHistory('episodes');renderHistory('movies');scheduleHome393(activeKind(),false)}}return hHistory",
    'history repaint re-anchor'
  ]
],'r388');

js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
  [
    "function settleRoute399(force=false){\n const r=routeNow();\n if(r==='home'&&q('[data-home]')){const kind=activeHome(),sig='home:'+kind;if(!force&&sig===lastRouteSig)return true;lastRouteSig=sig;return enterHome399(kind)}",
    "function settleRoute399(force=false){\n const r=routeNow();\n if(r==='home'&&!q('[data-home]')){lastRouteSig='home:frame';try{void window.__ctR388?.renderHome?.()}catch{}return true}\n if(r==='home'&&q('[data-home]')){const kind=activeHome(),sig='home:'+kind;if(!force&&sig===lastRouteSig)return true;lastRouteSig=sig;return enterHome399(kind)}",
    'immediate Home frame'
  ],
  [
    "setTimeout(()=>settleRoute399(false),0);setTimeout(()=>settleRoute399(false),80);",
    "for(const ms of [0,60,160,360,700])setTimeout(()=>settleRoute399(false),ms);",
    'bounded nav settle'
  ]
],'r399');

/* Pra Você: always target the visible Discover host and never start overlapping pool loads. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
  [
    "const root464=()=>q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]')||q('[data-discover-content]');",
    "const root464=()=>{const all=qa('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]');return all.find(el=>!el.hidden&&el.getAttribute('aria-hidden')!=='true'&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden')||all[0]||null};",
    'visible host'
  ],
  [
    "const token=++loadToken;if(!q('[data-ct464-foryou]',root464()))renderLoading();",
    "if(loadTask)return loadTask;const token=++loadToken;if(!q('[data-ct464-foryou]',root464()))renderLoading();",
    'single flight load'
  ]
],'r464');

/* r472 remains the final visible owner, but must not race itself. Profile summaries
   paint from the already-loaded profile cache immediately, then hydrate from canonical RPCs. */
js=patchGlobal(
  js,
  "const k=kind==='movies'?'movies':'series';if(routeNow()!=='home')return false;if(homeTasks[k]&&!force)return homeTasks[k];",
  "const k=kind==='movies'?'movies':'series';if(routeNow()!=='home')return false;if(homeTasks[k])return homeTasks[k];",
  'r472 Home single flight'
);
js=patchGlobal(js,"if(mediaTask&&!force)return mediaTask;","if(mediaTask)return mediaTask;",'r472 media single flight');
js=patchGlobal(js,"if(actorTask&&!force)return actorTask;","if(actorTask)return actorTask;",'r472 actors single flight');
js=patchGlobal(
  js,
  "function nativeMore(panel){return qa('button',panel).find(b=>!b.dataset.ct472More&&norm(b.textContent).includes('ver mais'))||null}",
  "function nativeMore(panel){return qa('button,a,[role=\\\"button\\\"]',panel).find(b=>!b.dataset.ct472More&&norm(b.textContent).includes('ver mais'))||null}",
  'r472 native more selector'
);
js=patchGlobal(js,"if(stadiumTask&&!force)return stadiumTask;","if(stadiumTask)return stadiumTask;",'r472 stadium single flight');
js=patchGlobal(
  js,
  "async function applyProfile(force=false){\n if(routeNow()!=='profile')return false;\n await Promise.allSettled([loadMedia(force),loadActors(force),loadStadium(force)]);if(routeNow()!=='profile')return false;\n for(const key of ['series','movies','seriesFav','movieFav','actors'])renderSummary(key);\n try{window.__ctR471?.openDay&&core.setActivityOpen?.(window.__ctR471.openDay)}catch{}\n const root=q('[data-profile]');if(root)root.dataset.ct472Profile='12+separate-more';return true;\n}",
  "async function applyProfile(force=false){\n if(routeNow()!=='profile')return false;\n for(const key of ['series','movies','seriesFav','movieFav','actors'])renderSummary(key);\n const stadiumPromise=loadStadium(force);\n await Promise.allSettled([loadMedia(force),loadActors(force)]);if(routeNow()!=='profile')return false;\n for(const key of ['series','movies','seriesFav','movieFav','actors'])renderSummary(key);\n void stadiumPromise;\n try{window.__ctR471?.openDay&&core.setActivityOpen?.(window.__ctR471.openDay)}catch{}\n const root=q('[data-profile]');if(root)root.dataset.ct472Profile='12+separate-more';return true;\n}",
  'r472 nonblocking Profile summary'
);
js=patchGlobal(
  js,
  "bounded(()=>{if(token!==profileToken||routeNow()!=='profile')return;void applyProfile(force)},[80,220,520,1100,2200,4200,7000,10000]);",
  "bounded(()=>{if(token!==profileToken||routeNow()!=='profile')return;void applyProfile(force)},[40,120,280,600,1200,2400,4200,7000,10000,13000,16000]);",
  'r472 Profile bounded reassert'
);

/* Retire the legacy r455 list limiter only. Its daily-history bridge stays active. */
js=patchGlobal(
  js,
  "function applyProfile455(){\n if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root)return false;\n let changed=false;for(const panel of qa('section.panel,.panel',root)){if(applyPanel455(panel))changed=true}\n root.dataset.ct455ProfileLists='13+half-more';return changed;\n}",
  "function applyProfile455(){return false}",
  'r455 list limiter'
);

js+='\nwindow.__ctR474Marker=\'home-immediate+history-anchor+foryou-visible-singleflight+profile-12-13\';\n';

html=html.replaceAll('app-v473.js','app-v474.js').replaceAll('app-v473.css','app-v474.css').replaceAll('v1.0.263','v1.0.264').replaceAll('r473-official-1.0.263','r474-official-1.0.264');
css+='\n/* CineTracker Web 1.0.264 r474 — immediate Home, stable Pra Você and single Profile summary owner. */\n';
sw=sw.replaceAll('app-v473.js','app-v474.js').replaceAll('app-v473.css','app-v474.css').replaceAll('ct-web-1.0.263-r473','ct-web-1.0.264-r474');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
  version:'1.0.264',
  revision:'r474-official-1.0.264',
  base:'r473+r474-visible-runtime-stability',
  scope:'home-immediate+movie-watchlist-anchor+discover-visible-host+profile-12-plus-13th',
  home_series:'Home frame starts immediately; v452 owner remains r399 and History v391 repaint re-anchors the active Series section',
  home_movies:'v405 Watchlist remains visible after delayed History repaint instead of being pushed out of the viewport',
  discover_foryou:'r464 targets the visible Discover host and uses one in-flight v421 pool load at a time',
  profile_lists:'r472 is sole summary owner; exactly 12 cards plus one 13th Ver mais, native header Ver mais hidden even when rendered as link/role button',
  history:'daily-history/undo authority preserved',
  f1:'preserved',
  android:'unchanged-1.0.20/10062'
});

await Promise.all([
  writeFile(resolve(dist,'app-v474.js'),js),
  writeFile(resolve(dist,'app-v474.css'),css),
  writeFile(resolve(dist,'index.html'),html),
  writeFile(resolve(dist,'service-worker.js'),sw),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v473.js'),{force:true}),rm(resolve(dist,'app-v473.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r474 missing runtime '+anchor);return js.slice(start,close+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r472=js;
const r455=js;
if(!r388.includes("renderHistory('movies');scheduleHome393(activeKind(),false)"))throw new Error('r474 Home history anchor missing');
if(!r399.includes("if(r==='home'&&!q('[data-home]'))")||!r399.includes("[0,60,160,360,700]"))throw new Error('r474 immediate Home missing');
if(!r464.includes("getComputedStyle(el).display!=='none'")||!r464.includes('if(loadTask)return loadTask;'))throw new Error('r474 For You visible/singleflight missing');
for(const need of ['if(homeTasks[k])return homeTasks[k]','if(mediaTask)return mediaTask','if(actorTask)return actorTask','if(stadiumTask)return stadiumTask','button,a,[role="button"]','[40,120,280,600,1200,2400,4200,7000,10000,13000,16000]'])if(!r472.includes(need))throw new Error('r474 r472 missing '+need);
if(!r455.includes('function applyProfile455(){return false}'))throw new Error('r474 legacy Profile limiter still active');
if(js.split('const PROFILE_LIMIT=12;').length-1<2||js.includes('const PROFILE_LIMIT=13;'))throw new Error('r474 Profile limit regression');
for(const need of ['cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct472-all-screen'])if(!js.includes(need))throw new Error('r474 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])if(r472.includes(bad)||r464.includes(bad)||r399.includes(bad))throw new Error('r474 forbidden '+bad);
console.log('WEB_R474_READY immediate Home + stable PraVoce + Profile 12+13');
