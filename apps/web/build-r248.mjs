import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r247.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v247.js'),'utf8'),readFile(resolve(dist,'app-v247.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r248-current-following-ui.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r248 missing '+label)};
for(const m of ["const REVISION='r247-official-1.0.38';","window.__ctR247='black-screen-recovery-current-runtime-authority'","function ct245ApplyCanonical(mediaId,current)","function rememberDiscover240()","function restoreDiscover240()","window.__ctR245='real-horizontal-drag-and-started-series-authority'"])must(js,m,m);
for(const m of ["window.__ctR248='current-following-complete-ui-authority'","window.__ctR248Home='current-frontier-keeps-historical-backlog-unwatched'","window.__ctR248Sports='four-tabs-today-d3-favorites-watched'","window.__ctR248F1='jolpica-six-tabs-persistent-collapse'","window.__ctR248Profile='one-stable-statistics-group'","window.__ctR248Horizontal='dynamic-local-scrollbars-no-page-x'"])must(patch,m,m);

/* Faster canonical episode hydration. */
js=js.replace('const CT245_SERIES_MAX=6;','const CT245_SERIES_MAX=8;').replace('const CT245_PRIORITY_BATCH=24;','const CT245_PRIORITY_BATCH=40;').replace('setTimeout(ct245ReleaseMovies,500)','setTimeout(ct245ReleaseMovies,250)');

/* Current-following frontier: old holes before last/current watched position stay unwatched
   but no longer force the series out of Em dia. */
const oldApply=`function ct245ApplyCanonical(mediaId,current){\n  if(!current||!homeCache?.series)return false;\n  const row=(homeCache.series||[]).find(x=>ct245MediaId(x)===ct245Num(mediaId));\n  if(!row||!ct245Started(row))return false;\n  const changed=row.home_bucket!=='continue'||row.is_caught_up!==false||ct245Num(row.history_missing_episodes)<1;\n  row.home_bucket='continue';row.is_caught_up=false;row.history_missing_episodes=Math.max(1,ct245Num(row.history_missing_episodes));\n  if(changed&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint();\n  return changed;\n}`;
const newApply=`function ct245ApplyCanonical(mediaId,current){\n  if(!current||!homeCache?.series)return false;\n  const row=(homeCache.series||[]).find(x=>ct245MediaId(x)===ct245Num(mediaId));\n  if(!row||!ct245Started(row))return false;\n  const pos=x=>{const s=ct245Num(x?.season_number??x?.season??x?.s),e=ct245Num(x?.episode_number??x?.episode??x?.e);return s>0&&e>0?s*100000+e:0};\n  const frontier=Math.max(pos({season_number:row.last_season,episode_number:row.last_episode}),pos({season_number:row.current_season,episode_number:row.current_episode}),pos({season_number:row.last_watched_season,episode_number:row.last_watched_episode}),pos(row.last_watched_episode_data),pos(row.progress_episode));\n  const candidate=pos(current);\n  if(frontier>0&&candidate>0&&candidate<=frontier){\n    const changed=row.home_bucket!=='caught_up'||row.is_caught_up!==true||row._ctHomeForceContinue===true;\n    row.home_bucket='caught_up';row.is_caught_up=true;row._ctHomeForceContinue=false;row._ctHomeState='caught_up';row._ct248HistoricalBacklogPreserved=true;\n    if(changed&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint();\n    return changed;\n  }\n  const changed=row.home_bucket!=='continue'||row.is_caught_up!==false;\n  row.home_bucket='continue';row.is_caught_up=false;row.history_missing_episodes=Math.max(1,ct245Num(row.history_missing_episodes));\n  if(changed&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint();\n  return changed;\n}`;
must(js,oldApply,'r245 exact canonical apply');js=js.replace(oldApply,newApply);

/* Never blank/restore the whole Discover body between tabs. The old r240 semantic
   filters remain active, but the snapshot authority is neutralized. */
const rememberOld=`function rememberDiscover240(){const h=discoverContent240();if(h&&!loadingOnly240(h)&&h.innerHTML.trim())stableDiscover240=h.innerHTML}`;
const restoreOld=`function restoreDiscover240(){const h=discoverContent240();if(h&&loadingOnly240(h)&&stableDiscover240)h.innerHTML=stableDiscover240}`;
must(js,rememberOld,'r240 discover remember');must(js,restoreOld,'r240 discover restore');
js=js.replace(rememberOld,`function rememberDiscover240(){return false}`).replace(restoreOld,`function restoreDiscover240(){return false}`);
const clearDiscover=`['d-top10','d-trending','d-new','d-upcoming','d-rating','d-foryou','d-calendar'].forEach(id=>$(id).textContent='');`;
if(js.includes(clearDiscover))js=js.replace(clearDiscover,`/* r248 keeps existing Discover cards visible until replacement data is ready */`);

/* Stop r247's DOM reconciler from re-creating Sports/F1/Profile/scroll structures after
   the r248 authority paints them. Keep only its Home/Discover compatibility pass. */
const recOld=`function reconcile247(forceHome=false){if(reconciling247)return;reconciling247=true;try{home247(forceHome);discover247();sports247();applyF1247();profile247();horizontal247()}finally{reconciling247=false}}`;
const recNew=`function reconcile247(forceHome=false){if(reconciling247)return;reconciling247=true;try{home247(forceHome);discover247()}finally{reconciling247=false}}`;
must(js,recOld,'r247 reconciler');js=js.replace(recOld,recNew);

js=js.replace("const REVISION='r247-official-1.0.38';","const REVISION='r248-official-1.0.39';")
 .replace("window.__ctWebBuild='1.0.38';window.__ctOfficialVersion='1.0.38';","window.__ctWebBuild='1.0.39';window.__ctOfficialVersion='1.0.39';")
 .replaceAll('CineTracker • v1.0.38','CineTracker • v1.0.39')
 .replaceAll("JSON.stringify({version:'1.0.38',revision:REVISION","JSON.stringify({version:'1.0.39',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r248 boot insertion point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');

css+=`\n/* CineTracker Web 1.0.39 r248 */
html,body,#app{max-width:100%!important;overflow-x:clip!important}html,body{overflow-y:auto!important}
.ct248-xrail{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct248-xrail::-webkit-scrollbar{height:9px!important}.ct248-xrail::-webkit-scrollbar-thumb{background:rgba(139,199,230,.58)!important;border-radius:999px!important}.ct248-xrail::-webkit-scrollbar-track{background:rgba(8,28,39,.5)!important;border-radius:999px!important}
.ct248-discover-stable{overflow-anchor:none!important}.ct248-discover-card{animation:none!important;transform:none!important;overflow-anchor:none!important;transition:border-color .15s ease,background-color .15s ease,opacity .15s ease!important}.ct248-discover-loading{min-height:60vh!important}
.ct248-sports-tabs{display:flex!important;gap:8px!important;overflow-x:auto!important;margin:8px 0 14px!important}.ct247-sport-tabs{display:none!important}
.ct248-watch-btn.ct248-watch-pop{animation:ct248WatchPop .36s ease!important}@keyframes ct248WatchPop{0%{transform:scale(1)}45%{transform:scale(.92)}75%{transform:scale(1.045)}100%{transform:scale(1)}}
.ct248-f1hub{border:1px solid rgba(139,199,230,.22);border-radius:18px;padding:14px;margin:12px 0 18px;background:linear-gradient(145deg,rgba(7,25,35,.98),rgba(12,43,56,.93));max-width:100%;overflow:hidden}.ct248-f1head{display:flex;align-items:center;justify-content:space-between;gap:12px}.ct248-f1head>div{display:flex;gap:10px;align-items:baseline}.ct248-f1head button,.ct248-f1body nav button{border-radius:999px}.ct248-f1body nav{display:flex;gap:8px;overflow-x:auto;padding:12px 0}.ct248-f1body nav button.active{font-weight:800}.ct248-f1hero{display:grid;gap:5px;padding:12px;border-radius:14px;background:rgba(255,255,255,.04)}.ct248-f1overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}.ct248-f1overview>div{padding:10px;border-radius:12px;background:rgba(255,255,255,.04);display:grid;gap:3px}.ct248-f1rail{display:flex;gap:10px}.ct248-f1rail article{min-width:220px;display:grid;gap:4px;padding:10px;border-radius:12px;background:rgba(255,255,255,.04)}.ct248-f1table{display:grid;gap:5px}.ct248-f1table>div{display:grid;grid-template-columns:48px minmax(140px,1fr) auto;gap:8px;align-items:center;padding:7px 9px;border-radius:10px;background:rgba(255,255,255,.035)}
.ct248-profile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}.ct248-profile-grid>*{min-width:0!important}
@media(max-width:700px){.ct248-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct248-f1overview{grid-template-columns:1fr!important}}
`;

html=html.replaceAll('r247-official-1.0.38','r248-official-1.0.39').replace(/app-v\d+\.js/g,'app-v248.js').replace(/app-v\d+\.css/g,'app-v248.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r248 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.39-r248';").replace(/app-v\d+\.js/g,'app-v248.js').replace(/app-v\d+\.css/g,'app-v248.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v248.js'),js,'utf8'),writeFile(resolve(dist,'app-v248.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.39',revision:'r248-official-1.0.39',base:'r247-official-1.0.38',scope:'web-current-following-complete-ui',home:'current-following-frontier+8-workers+40-priority+250ms-secondary-failsafe',historical_backlog:'preserved-unwatched-behind-current-frontier',discover:'canonical-exclusions+stable-nonblank-tabs+no-html-snapshot-restore',sports_tabs:['Próximos','Anteriores','Favoritos','Assistidos'],sports_next:'today-future-only',sports_previous:'D-1-through-D-3',sports_favorites:'favorite-only',sports_watched:'canonical+click-animation',sports_events_action:'removed',f1:'jolpica-six-tabs+Brasilia-time+countdown+calendar+drivers+constructors+last-result+qualifying+persist-collapse',profile:'single-statistics-group',global_horizontal_scroll:'disabled',vertical_page_scroll:'preserved',local_horizontal_scrollbars:'dynamic-visible',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v247.js'),{force:true}),rm(resolve(dist,'app-v247.css'),{force:true})]);
console.log('WEB_1_0_39_READY r248 current-following complete-ui android=unchanged');
