import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r245.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,sportsPatch,semanticPatch,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v245.js'),'utf8'),
  readFile(resolve(dist,'app-v245.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r240-sports-four-tabs.js'),'utf8'),
  readFile(resolve(root,'runtime-r240-user-video-semantics.js'),'utf8'),
  readFile(resolve(root,'runtime-r246-complete-ui-authority.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r246 missing '+label)};
for(const marker of [
  "const REVISION='r245-official-1.0.36';",
  "window.__ctR239='production-video-ground-truth'",
  "window.__ctR243='home-interaction-bounded-metadata-canonical-catchup'",
  "window.__ctR245='real-horizontal-drag-and-started-series-authority'",
  "const CT245_SERIES_MAX=4;",
  "const CT245_PRIORITY_BATCH=12;",
  "setTimeout(ct245ReleaseMovies,1400)"
])must(js,marker,marker);
for(const marker of [
  "window.__ctR240='sports-four-data-authority'",
  "window.__ctR240Sports='next-today-only+previous-last-3-days+favorites-only+watched'",
  "sportsTabs=function()","sportsPayload=async function()","sportsFiltered=function(rows)",
  "p_scope:'today'","p_favorite_only:true","r240Shift(now,-3)"
])must(sportsPatch,marker,'r240 sports '+marker);
for(const marker of [
  "window.__ctR240='user-video-semantic-authority'",
  "window.__ctR240Home='follow-first-history-hidden'",
  "window.__ctR240Discover='canonical-exclusions-atomic-switch'",
  "window.__ctR240Sports='search-focus-caret-stable'",
  "blockedState240","exclusionContext158()","restoreDiscover240","captureSports240","setSelectionRange"
])must(semanticPatch,marker,'r240 semantics '+marker);
semanticPatch=semanticPatch
  .replace("if(window.__ctR240)return;\nwindow.__ctR240='user-video-semantic-authority';","if(window.__ctR240Semantic)return;\nwindow.__ctR240Semantic='user-video-semantic-authority';")
  .replace("window.__ctR240Sports='search-focus-caret-stable';","window.__ctR240SportsSearch='search-focus-caret-stable';");
for(const marker of [
  "window.__ctR246='complete-ui-authority'",
  "window.__ctR246Home='eager-canonical-series-refresh'",
  "window.__ctR246Discover='stable-canonical-r239-r240'",
  "window.__ctR246Sports='four-tabs-no-events-animated-watched'",
  "window.__ctR246F1='persistent-collapse-six-tabs'",
  "window.__ctR246Profile='single-statistics-group'",
  "window.__ctR246Horizontal='local-scrollbars-no-page-x'",
  "window.__ctR239SetF1Open=setF1Open246",
  "window.__ctR245AuditStarted",
  "ct246-local-track"
])must(patch,marker,marker);

/* Home freshness/performance: increase the existing canonical r245 worker instead
   of stacking another network authority. Also treat a tracked caught-up/manual
   in-progress TV item as started so event-series follow the same episode rule. */
js=js.replace('const CT245_SERIES_MAX=4;','const CT245_SERIES_MAX=6;')
  .replace('const CT245_PRIORITY_BATCH=12;','const CT245_PRIORITY_BATCH=24;')
  .replace('setTimeout(ct245ReleaseMovies,1400)','setTimeout(ct245ReleaseMovies,500)');
const startedOld="return ['continue','up_to_date','completed'].includes(String(x.home_bucket||''));";
const startedNew="return ['continue','up_to_date','completed'].includes(String(x.home_bucket||''))||x?.is_caught_up===true||['inprogress','in_progress','watching','started'].includes(String(x?.user_state||x?.state||'').toLowerCase());";
must(js,startedOld,'r245 started predicate');js=js.replace(startedOld,startedNew);
js=js.replace("window.addEventListener('pageshow',()=>queueMicrotask(()=>ct245Kick(false)));","window.addEventListener('pageshow',()=>queueMicrotask(()=>ct245Kick(true)));")
     .replace("document.addEventListener('visibilitychange',()=>{if(!document.hidden)queueMicrotask(()=>ct245Kick(false))});","document.addEventListener('visibilitychange',()=>{if(!document.hidden)queueMicrotask(()=>ct245Kick(true))});");

js=js.replace("const REVISION='r245-official-1.0.36';","const REVISION='r246-official-1.0.37';")
  .replace("window.__ctWebBuild='1.0.36';window.__ctOfficialVersion='1.0.36';","window.__ctWebBuild='1.0.37';window.__ctOfficialVersion='1.0.37';")
  .replaceAll('CineTracker • v1.0.36','CineTracker • v1.0.37')
  .replaceAll("JSON.stringify({version:'1.0.36',revision:REVISION","JSON.stringify({version:'1.0.37',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r246 boot insertion point missing');
js=js.replace('\nboot();','\n'+sportsPatch+'\n'+semanticPatch+'\n'+patch+'\nboot();');

css+=`\n/* CineTracker Web 1.0.37 r246 — local overflow + stable UI authority. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}
html,body{overflow-y:auto!important}
.ct236-home-episode-pending[data-ct246-episode-visible="1"]{display:revert!important;visibility:visible!important;opacity:1!important}
.ct246-local-track{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:auto!important;scrollbar-gutter:stable!important}
.ct246-local-track::-webkit-scrollbar{height:9px!important}
.ct246-local-track::-webkit-scrollbar-thumb{background:rgba(139,199,230,.48)!important;border-radius:999px!important}
.ct246-local-track::-webkit-scrollbar-track{background:rgba(8,28,39,.45)!important;border-radius:999px!important}
.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct-r244-horizontal-scroll{touch-action:pan-x pan-y!important;scrollbar-width:auto!important;scrollbar-gutter:stable!important}
[data-page="discover"],[data-discover]{max-width:100%!important;overflow-x:hidden!important}
[data-discover-content].ct246-discover-content{min-height:min(620px,70vh)!important;overflow-anchor:none!important;contain:layout style!important}
[data-discover-content] .ct246-discover-track{animation:none!important;transform:none!important;scroll-behavior:auto!important;align-items:stretch!important}
[data-discover-content] .ct246-discover-track:not(.foryou-grid){grid-auto-columns:minmax(172px,190px)!important;gap:12px!important}
[data-discover-content] .ct246-discover-card{box-sizing:border-box!important;transform:none!important;animation:none!important;transition:border-color .16s ease,background-color .16s ease,opacity .16s ease!important;overflow-anchor:none!important}
[data-discover-content] .ct246-discover-track:not(.foryou-grid)>.ct246-discover-card{width:100%!important;min-width:0!important;max-width:none!important}
[data-sports] .ct246-sport-watch{transform:translateZ(0);transition:transform .16s ease,filter .16s ease,border-color .16s ease!important}
[data-sports] .ct246-sport-watch.ct246-watch-pop{animation:ct246WatchPop .34s ease!important}
@keyframes ct246WatchPop{0%{transform:scale(1)}45%{transform:scale(.94)}75%{transform:scale(1.035)}100%{transform:scale(1)}}
[data-profile] .ct246-profile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}
[data-profile] .ct246-profile-grid>.stat{min-width:0!important}
[data-profile] .ct246-profile-grid>.ct246-sport-stat{grid-column:span 1!important}
@media(max-width:700px){[data-profile] .ct246-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}[data-discover-content] .ct246-discover-track:not(.foryou-grid){grid-auto-columns:minmax(158px,174px)!important}}
`;

html=html.replaceAll('r245-official-1.0.36','r246-official-1.0.37')
  .replace(/app-v\d+\.js/g,'app-v246.js')
  .replace(/app-v\d+\.css/g,'app-v246.css');
must(html,'app-v246.js','generated index app-v246.js');must(html,'app-v246.css','generated index app-v246.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r246 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.37-r246';")
  .replace(/app-v\d+\.js/g,'app-v246.js')
  .replace(/app-v\d+\.css/g,'app-v246.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v246.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v246.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({
    version:'1.0.37',revision:'r246-official-1.0.37',base:'r245-official-1.0.36',scope:'web-complete-ui-authority',
    home:'eager-canonical-series-refresh-6-workers-500ms-secondary-failsafe',
    discover:'r240-canonical-user-state-exclusions+atomic-stable-r239-foryou',
    sports_tabs:['Próximos','Anteriores','Favoritos','Assistidos'],sports_next:'today-future-only',sports_previous:'previous-three-calendar-days-only',sports_favorites:'favorite-only',sports_events_action:'removed',sports_watched:'canonical+click-animation',
    f1:'persistent-collapse+six-canonical-tabs',profile:'single-statistics-group',
    global_horizontal_scroll:'disabled',vertical_page_scroll:'preserved',local_horizontal_scrollbars:'visible-on-detail-and-discover-tracks',
    android:'unchanged-1.0.20',generated_at:new Date().toISOString()
  },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v245.js'),{force:true}),rm(resolve(dist,'app-v245.css'),{force:true})]);
console.log('WEB_1_0_37_READY r246 complete-ui-authority r240=restored android=unchanged');
