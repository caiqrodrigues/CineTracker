import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r249-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,authority]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v249.js'),'utf8'),
 readFile(resolve(dist,'app-v249.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r250-source-aligned.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r250 missing '+label)};
for(const m of [
 "window.__ctR249='single-authority-current-ui'",
 "window.__ctR249Following='watched-frontier-new-release-wins'",
 "window.__ctR249Discover='atomic-latest-request-generation'",
 "window.__ctR249Sports='canonical-four-tabs-no-legacy-rpc'"
])must(js,m,m);
for(const m of [
 "window.__ctR250='source-aligned-deterministic-ui'",
 "window.__ctR250Home='watched-frontier-released-newer-only'",
 "window.__ctR250Discover='owned-tab-generation-and-personal-exclusions'",
 "window.__ctR250Sports='canonical-payload-v1-four-tabs'",
 "window.__ctR250F1='single-hub-persistent-user-collapse'",
 "window.__ctR250Profile='single-merged-statistics'",
 "window.__ctR250Horizontal='local-x-rails-page-y-only'",
 "cinetracker_sports_payload_v1",
 "cinetracker_sport_mark_watched_v1"
])must(authority,m,m);

/* r250 is the only final UI reconciler. Disable r249's repeated event reconciliation while
   keeping its one-time compatibility hooks in the inherited bundle. */
const at=js.indexOf("window.__ctR249='single-authority-current-ui'");
if(at<0)throw new Error('r250 cannot locate r249 authority');
let before=js.slice(0,at),tail=js.slice(at);
const owners=[
 "window.addEventListener('pageshow',()=>later(reconcileAll));",
 "document.addEventListener('cinetracker:data-changed',()=>later(reconcileAll));",
 "document.addEventListener('click',()=>later(reconcileAll),true);",
 "document.addEventListener('visibilitychange',()=>{if(!document.hidden)later(reconcileAll)});"
];
for(const owner of owners){must(tail,owner,'r249 repeated owner '+owner);tail=tail.replace(owner,'/* r250 owns this event */')}
must(tail,'\nlater(reconcileAll);\n})();','r249 initial repeated reconcile');
tail=tail.replace('\nlater(reconcileAll);\n})();','\nwindow.__ctR250LegacyR249EventsDisabled=true;\n})();');
js=before+tail;

js=js.replace("const REVISION='r249-official-1.0.40';","const REVISION='r250-official-1.0.41';")
 .replace("window.__ctWebBuild='1.0.40';window.__ctOfficialVersion='1.0.40';","window.__ctWebBuild='1.0.41';window.__ctOfficialVersion='1.0.41';")
 .replaceAll('CineTracker • v1.0.40','CineTracker • v1.0.41')
 .replaceAll("JSON.stringify({version:'1.0.40',revision:REVISION","JSON.stringify({version:'1.0.41',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r250 boot insertion point missing');
js=js.replace('\nboot();','\n'+authority+'\nboot();');
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('r250 final bundle must not call legacy sports RPC');

css+=`\n/* CineTracker Web 1.0.41 r250 — deterministic current UI */
html,body,#app{max-width:100%!important;overflow-x:clip!important}html,body{overflow-y:auto!important}
.ct250-xrail{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct250-xrail::-webkit-scrollbar{height:9px!important}.ct250-xrail::-webkit-scrollbar-thumb{background:rgba(139,199,230,.58)!important;border-radius:999px!important}.ct250-xrail::-webkit-scrollbar-track{background:rgba(8,28,39,.5)!important;border-radius:999px!important}
.ct250-sports-tabs{display:flex!important;gap:8px!important;margin:8px 0 14px!important}.ct247-sport-tabs,.ct248-sports-tabs,.ct249-sports-tabs{display:none!important}
.ct250-watch-btn.ct250-watch-pop{animation:ct250WatchPop .4s ease!important}@keyframes ct250WatchPop{0%{transform:scale(1)}42%{transform:scale(.91)}72%{transform:scale(1.05)}100%{transform:scale(1)}}
.ct250-discover-card,.ct250-home-card{box-sizing:border-box!important;animation:none!important;transform:none!important;overflow-anchor:none!important}
.ct250-home-card.thumbCard{width:190px!important;max-width:190px!important}.ct250-rating{display:inline-flex!important;align-items:center!important;gap:3px!important;margin-left:6px!important;font-weight:800!important;white-space:nowrap!important}
.ct250-profile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}.ct250-profile-grid>*{min-width:0!important}
.ct250-f1hub{max-width:100%!important;overflow:hidden!important}
[data-page="discover"],[data-discover],#p-discover,[data-page="sports"],[data-sports],#p-sports,[data-profile],#p-profile,[data-home],#p-home{min-width:0!important;max-width:100%!important}
@media(max-width:700px){.ct250-home-card.thumbCard{width:168px!important;max-width:168px!important}.ct250-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
`;

html=html.replaceAll('r249-official-1.0.40','r250-official-1.0.41').replace(/app-v\d+\.js/g,'app-v250.js').replace(/app-v\d+\.css/g,'app-v250.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r250 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.41-r250';").replace(/app-v\d+\.js/g,'app-v250.js').replace(/app-v\d+\.css/g,'app-v250.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v250.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v250.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
  version:'1.0.41',revision:'r250-official-1.0.41',base:'r249-official-1.0.40',scope:'web-deterministic-current-ui',
  home:'released-newer-than-watched-frontier-only+historical-gaps-preserved+tmdb-rating',
  discover:'owned-tab-clicks+generation-race-guard+personal-exclusions+stable-cards',
  sports_rpc:'cinetracker_sports_payload_v1',sports_legacy_rpc:'server-compatibility-only',sports_tabs:['Próximos','Anteriores','Favoritos','Assistidos'],sports_next:'today-future-only',sports_previous:'D-1-through-D-3',sports_favorites:'favorite-only',sports_watched:'watched-only+canonical-toggle',
  f1:'single-hub+six-sections+persistent-user-collapse',profile:'single-merged-statistics',global_horizontal_scroll:'disabled',vertical_page_scroll:'preserved',local_horizontal_scrollbars:'visible',legacy_r249_reconcile_events:'disabled',android:'unchanged-1.0.20',generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v249.js'),{force:true}),rm(resolve(dist,'app-v249.css'),{force:true})]);
console.log('WEB_1_0_41_READY r250 deterministic-current-ui android=unchanged');
