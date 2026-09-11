import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r245.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,semanticPatch,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v245.js'),'utf8'),
 readFile(resolve(dist,'app-v245.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r240-user-video-semantics.js'),'utf8'),
 readFile(resolve(root,'runtime-r247-black-screen-recovery.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r247 missing '+label)};
for(const marker of [
 "const REVISION='r245-official-1.0.36';",
 "window.__ctR239='production-video-ground-truth'",
 "window.__ctR243='home-interaction-bounded-metadata-canonical-catchup'",
 "window.__ctR245='real-horizontal-drag-and-started-series-authority'",
 "const CT245_SERIES_MAX=4;","const CT245_PRIORITY_BATCH=12;","setTimeout(ct245ReleaseMovies,1400)"
])must(js,marker,marker);
for(const marker of [
 "window.__ctR240='user-video-semantic-authority'","window.__ctR240Home='follow-first-history-hidden'",
 "window.__ctR240Discover='canonical-exclusions-atomic-switch'","window.__ctR240Sports='search-focus-caret-stable'",
 "blockedState240","exclusionContext158()","restoreDiscover240","captureSports240","setSelectionRange"
])must(semanticPatch,marker,'r240 semantics '+marker);
semanticPatch=semanticPatch
 .replace("if(window.__ctR240)return;\nwindow.__ctR240='user-video-semantic-authority';","if(window.__ctR240Semantic)return;\nwindow.__ctR240Semantic='user-video-semantic-authority';")
 .replace("window.__ctR240Sports='search-focus-caret-stable';","window.__ctR240SportsSearch='search-focus-caret-stable';");
for(const marker of [
 "window.__ctR247='black-screen-recovery-current-runtime-authority'",
 "window.__ctR247Sports='safe-four-tabs-current-runtime'","typeof sportsPayload==='function'","typeof sportsFiltered==='function'",
 "window.__ctR247F1='persistent-collapse-six-tabs'","window.__ctR247Profile='single-statistics-group'",
 "window.__ctR247Horizontal='local-scrollbars-no-page-x'","window.__ctR239SetF1Open=setF1Open247"
])must(patch,marker,marker);
if(patch.includes('sportsTabs=function()'))throw new Error('r247 must not assign legacy sportsTabs');

js=js.replace('const CT245_SERIES_MAX=4;','const CT245_SERIES_MAX=6;')
 .replace('const CT245_PRIORITY_BATCH=12;','const CT245_PRIORITY_BATCH=24;')
 .replace('setTimeout(ct245ReleaseMovies,1400)','setTimeout(ct245ReleaseMovies,500)');
const startedOld="return ['continue','up_to_date','completed'].includes(String(x.home_bucket||''));";
const startedNew="return ['continue','up_to_date','completed'].includes(String(x.home_bucket||''))||x?.is_caught_up===true||['inprogress','in_progress','watching','started'].includes(String(x?.user_state||x?.state||'').toLowerCase());";
must(js,startedOld,'r245 started predicate');js=js.replace(startedOld,startedNew);
js=js.replace("window.addEventListener('pageshow',()=>queueMicrotask(()=>ct245Kick(false)));","window.addEventListener('pageshow',()=>queueMicrotask(()=>ct245Kick(true)));")
 .replace("document.addEventListener('visibilitychange',()=>{if(!document.hidden)queueMicrotask(()=>ct245Kick(false))});","document.addEventListener('visibilitychange',()=>{if(!document.hidden)queueMicrotask(()=>ct245Kick(true))});");

js=js.replace("const REVISION='r245-official-1.0.36';","const REVISION='r247-official-1.0.38';")
 .replace("window.__ctWebBuild='1.0.36';window.__ctOfficialVersion='1.0.36';","window.__ctWebBuild='1.0.38';window.__ctOfficialVersion='1.0.38';")
 .replaceAll('CineTracker • v1.0.36','CineTracker • v1.0.38')
 .replaceAll("JSON.stringify({version:'1.0.36',revision:REVISION","JSON.stringify({version:'1.0.38',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r247 boot insertion point missing');
/* Critical r247 rule: the legacy r240 Sports runtime is NOT injected. It assumes
   sportsTabs exists and caused the 1.0.37 production black screen. */
js=js.replace('\nboot();','\n'+semanticPatch+'\n'+patch+'\nboot();');

css+=`\n/* CineTracker Web 1.0.38 r247 — black-screen recovery + local overflow. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}
html,body{overflow-y:auto!important}
.ct236-home-episode-pending[data-ct247-episode-visible="1"]{display:revert!important;visibility:visible!important;opacity:1!important}
.ct247-local-track{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:auto!important;scrollbar-gutter:stable!important}
.ct247-local-track::-webkit-scrollbar{height:9px!important}.ct247-local-track::-webkit-scrollbar-thumb{background:rgba(139,199,230,.48)!important;border-radius:999px!important}.ct247-local-track::-webkit-scrollbar-track{background:rgba(8,28,39,.45)!important;border-radius:999px!important}
.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct-r244-horizontal-scroll{touch-action:pan-x pan-y!important;scrollbar-width:auto!important;scrollbar-gutter:stable!important}
[data-page="discover"],[data-discover]{max-width:100%!important;overflow-x:hidden!important}
[data-discover-content].ct247-discover-content{min-height:min(620px,70vh)!important;overflow-anchor:none!important;contain:layout style!important}
[data-discover-content] .ct247-discover-track{animation:none!important;transform:none!important;scroll-behavior:auto!important;align-items:stretch!important}
[data-discover-content] .ct247-discover-track:not(.foryou-grid){grid-auto-columns:minmax(172px,190px)!important;gap:12px!important}
[data-discover-content] .ct247-discover-card{box-sizing:border-box!important;transform:none!important;animation:none!important;transition:border-color .16s ease,background-color .16s ease,opacity .16s ease!important;overflow-anchor:none!important}
[data-sports] .ct247-sport-watch{transform:translateZ(0);transition:transform .16s ease,filter .16s ease,border-color .16s ease!important}
[data-sports] .ct247-sport-watch.ct247-watch-pop{animation:ct247WatchPop .34s ease!important}
@keyframes ct247WatchPop{0%{transform:scale(1)}45%{transform:scale(.94)}75%{transform:scale(1.035)}100%{transform:scale(1)}}
[data-profile] .ct247-profile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}[data-profile] .ct247-profile-grid>.stat{min-width:0!important}[data-profile] .ct247-profile-grid>.ct247-sport-stat{grid-column:span 1!important}
@media(max-width:700px){[data-profile] .ct247-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}[data-discover-content] .ct247-discover-track:not(.foryou-grid){grid-auto-columns:minmax(158px,174px)!important}}
`;

html=html.replaceAll('r245-official-1.0.36','r247-official-1.0.38').replace(/app-v\d+\.js/g,'app-v247.js').replace(/app-v\d+\.css/g,'app-v247.css');
must(html,'app-v247.js');must(html,'app-v247.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r247 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.38-r247';").replace(/app-v\d+\.js/g,'app-v247.js').replace(/app-v\d+\.css/g,'app-v247.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v247.js'),js,'utf8'),writeFile(resolve(dist,'app-v247.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
  version:'1.0.38',revision:'r247-official-1.0.38',base:'r245-official-1.0.36',scope:'web-black-screen-recovery',
  boot:'exact-final-bundle-browser-proven',black_screen:'remove-unsafe-r240-sportsTabs-assignment',
  home:'eager-canonical-series-refresh-6-workers-500ms-secondary-failsafe',discover:'canonical-user-state-exclusions+atomic-stable-r239-foryou',
  sports_tabs:['Próximos','Anteriores','Favoritos','Assistidos'],sports_runtime:'conditional-hooks-current-bundle-only',sports_next:'today-future-only',sports_previous:'previous-three-calendar-days-only',sports_favorites:'favorite-only',sports_events_action:'removed',sports_watched:'canonical+click-animation',
  f1:'persistent-collapse+six-canonical-tabs',profile:'single-statistics-group',global_horizontal_scroll:'disabled',vertical_page_scroll:'preserved',local_horizontal_scrollbars:'visible',android:'unchanged-1.0.20',generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v245.js'),{force:true}),rm(resolve(dist,'app-v245.css'),{force:true})]);
console.log('WEB_1_0_38_READY r247 black-screen=recovered exact-bundle-required android=unchanged');
