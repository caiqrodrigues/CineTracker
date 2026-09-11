import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r250-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v250.js'),'utf8'),
 readFile(resolve(dist,'app-v250.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const authority=(await Promise.all(Array.from({length:5},(_,i)=>readFile(resolve(root,`runtime-r251-real-source.part${String(i).padStart(2,'0')}.js`),'utf8')))).join('');
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r251 missing '+label)};
for(const m of [
 "window.__ctR250='source-aligned-deterministic-ui'",
 "window.__ctR249='single-authority-current-ui'",
 "window.__ctR248='current-following-complete-ui-authority'",
 "window.__ctR247='black-screen-recovery-current-runtime-authority'"
])must(js,m,m);
for(const m of [
 "window.__ctR251='real-source-ui-authority'",
 "window.__ctR251Home='progressive-tmdb-frontier-current-release'",
 "window.__ctR251Discover='strict-personal-rules-wwe-weekly-no-duplicates'",
 "window.__ctR251Sports='canonical-four-tabs-source-renderer'",
 "window.__ctR251F1='single-source-hub-six-sections-persistent-collapse'",
 "window.__ctR251Profile='single-collapsible-statistics-source-renderer'",
 "window.__ctR251Horizontal='local-rails-no-page-x'",
 "window.__ctR251Detail='immediate-shell-progressive-metadata'",
 "cinetracker_recent_recommendations_v1",
 "cinetracker_mark_recommendation_shown_v1",
 "cinetracker_sports_payload_v1",
 "cinetracker_sport_mark_watched_v1"
])must(authority,m,m);

/* Disable the proven competing UI authorities before the browser executes them. */
const disable=[
 ["if(window.__ctR247)return;","window.__ctR251LegacyR247Disabled=true;return;"],
 ["if(window.__ctR248)return;","window.__ctR251LegacyR248Disabled=true;return;"],
 ["if(window.__ctR248Binding)return;window.__ctR248Binding='sports-f1-current-runtime-binding';","window.__ctR251LegacyR248BindingDisabled=true;return;"],
 ["if(window.__ctR248Following)return;","window.__ctR251LegacyR248FollowingDisabled=true;return;"],
 ["if(window.__ctR248DiscoverFinal)return;","window.__ctR251LegacyR248DiscoverDisabled=true;return;"],
 ["if(window.__ctR249)return;","window.__ctR251LegacyR249Disabled=true;return;"],
 ["if(window.__ctR250)return;","window.__ctR251LegacyR250Disabled=true;return;"]
];
for(const [from,to] of disable){must(js,from,'legacy authority guard '+from);js=js.replace(from,to)}

js=js.replace("const REVISION='r250-official-1.0.41';","const REVISION='r251-official-1.0.42';")
 .replace("window.__ctWebBuild='1.0.41';window.__ctOfficialVersion='1.0.41';","window.__ctWebBuild='1.0.42';window.__ctOfficialVersion='1.0.42';")
 .replaceAll('CineTracker • v1.0.41','CineTracker • v1.0.42')
 .replaceAll("JSON.stringify({version:'1.0.41',revision:REVISION","JSON.stringify({version:'1.0.42',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r251 boot insertion point missing');
js=js.replace('\nboot();','\n'+authority+'\nboot();');
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('r251 final bundle must not call legacy sports RPC');
for(const marker of ['__ctR251LegacyR247Disabled','__ctR251LegacyR248Disabled','__ctR251LegacyR248BindingDisabled','__ctR251LegacyR248FollowingDisabled','__ctR251LegacyR248DiscoverDisabled','__ctR251LegacyR249Disabled','__ctR251LegacyR250Disabled'])must(js,marker,marker);

css+=`\n/* CineTracker Web 1.0.42 r251 — real source ownership + polish */
html,body,#app{width:100%!important;max-width:100%!important;overflow-x:clip!important}html,body{overflow-y:auto!important}.app,.content,.page{min-width:0!important;max-width:100%!important}
.ct251-xrail{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct251-xrail::-webkit-scrollbar{height:8px!important}.ct251-xrail::-webkit-scrollbar-thumb{background:rgba(148,199,225,.52)!important;border-radius:999px!important}.ct251-xrail::-webkit-scrollbar-track{background:rgba(255,255,255,.04)!important;border-radius:999px!important}
.ct251-cardrail{display:flex!important;gap:12px!important;padding:4px 2px 10px!important}.ct251-cardrail>.card,.ct251-cardrail>.ct251-movie-card{flex:0 0 176px!important}
.ct251-follow-card{display:grid!important;grid-template-columns:minmax(0,1fr) 40px!important;align-items:center!important;gap:12px!important;padding:12px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:16px!important;background:rgba(255,255,255,.025)!important;cursor:pointer!important}.ct251-follow-main{display:grid!important;grid-template-columns:58px minmax(0,1fr)!important;align-items:center!important;gap:12px!important;min-width:0!important;text-align:left!important}.ct251-follow-poster{width:58px!important;height:82px!important;border-radius:12px!important;background-size:cover!important;background-position:center!important;background-color:rgba(255,255,255,.04)!important}.ct251-follow-copy{min-width:0!important}.ct251-follow-copy b{display:block!important;color:#fff!important;font-size:1rem!important;font-weight:600!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.ct251-follow-copy small{display:block!important;color:rgba(226,232,240,.82)!important;font-size:.82rem!important;margin-top:4px!important}.ct251-follow-check{width:40px!important;height:40px!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.1)!important;background:rgba(255,255,255,.05)!important;color:#fff!important;font-weight:800!important;transition:all .2s ease!important}.ct251-follow-check:hover{background:rgba(16,185,129,.2)!important;border-color:rgba(16,185,129,.4)!important}
.ct251-movie-card{min-width:0!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:16px!important;padding:10px!important;background:rgba(255,255,255,.025)!important}.ct251-movie-poster{aspect-ratio:2/3!important;border-radius:12px!important;background-size:cover!important;background-position:center!important;margin-bottom:8px!important}.ct251-movie-card b{display:block!important;color:#fff!important}.ct251-movie-card small{color:rgba(226,232,240,.78)!important}
.ct251-sports-tabs{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;margin-bottom:14px!important}.ct247-sport-tabs,.ct248-sports-tabs,.ct249-sports-tabs,.ct250-sports-tabs{display:none!important}.ct247-f1hub,.ct248-f1hub,.ct249-f1hub,.ct250-f1hub,[data-f1-hub]:not(.ct251-f1hub),[data-ct236-f1-card]{display:none!important}.ct251-f1hub{display:block!important;max-width:100%!important;overflow:hidden!important}.ct251-f1body[hidden]{display:none!important}.ct251-f1-table{display:flex!important;gap:10px!important;padding-bottom:8px!important}.ct251-f1-table article{flex:0 0 220px!important;padding:12px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:14px!important}.ct251-f1-table article>*{display:block!important}.ct251-f1-standings{min-width:0!important}.ct251-f1-standings>div{display:grid!important;grid-template-columns:42px minmax(180px,1fr) 90px!important;gap:10px!important;padding:8px!important;border-bottom:1px solid rgba(255,255,255,.07)!important}.ct251-f1-overview{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}
.ct251-watch-btn,.ct251-follow-check{will-change:transform}.ct251-watch-pop{animation:ct251WatchPop .42s ease!important}@keyframes ct251WatchPop{0%{transform:scale(1)}38%{transform:scale(.92)}72%{transform:scale(1.04)}100%{transform:scale(1)}}
.ct251-profile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}.ct251-stat{background:rgba(255,255,255,.02)!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:16px!important;padding:16px!important}.ct251-profile-grid[hidden]{display:none!important}.ct251-cardrail .poster{border-radius:12px!important;box-shadow:0 14px 30px rgba(0,0,0,.5)!important}.ct251-cardrail .card{transition:transform .2s ease,box-shadow .2s ease!important}.ct251-cardrail .card:hover{transform:translateY(-4px)!important;box-shadow:0 12px 30px rgba(34,211,238,.08)!important}
[data-configs] input,[data-configs] select,[data-configs] textarea,.settings-grid input,.settings-grid select,.settings-grid textarea{background:rgba(255,255,255,.03)!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:12px!important;padding:9px 16px!important;color:#fff!important;outline:none!important;transition:border-color .2s ease!important}[data-configs] input:focus,[data-configs] select:focus,[data-configs] textarea:focus{border-color:rgba(6,182,212,.5)!important}[data-configs] .btn,.settings-grid .btn{border-radius:12px!important;padding:9px 15px!important;transition:all .2s ease!important}
.sidebar{border-right:1px solid rgba(255,255,255,.1)!important;background:rgba(0,0,0,.4)!important;backdrop-filter:blur(12px)!important}.panel{border-color:rgba(255,255,255,.09)!important;background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(255,255,255,.012))!important}
.ct251-detail-shell{min-height:240px!important}.ct251-skeleton{background:linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.09),rgba(255,255,255,.04))!important;background-size:220% 100%!important;animation:ct251Skeleton 1.2s linear infinite!important}@keyframes ct251Skeleton{to{background-position:-220% 0}}
@media(max-width:760px){.ct251-sports-tabs{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct251-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct251-f1-overview{grid-template-columns:1fr!important}.ct251-cardrail>.card,.ct251-cardrail>.ct251-movie-card{flex-basis:158px!important}}
`;

html=html.replaceAll('r250-official-1.0.41','r251-official-1.0.42').replace(/app-v\d+\.js/g,'app-v251.js').replace(/app-v\d+\.css/g,'app-v251.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r251 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.42-r251';").replace(/app-v\d+\.js/g,'app-v251.js').replace(/app-v\d+\.css/g,'app-v251.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v251.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v251.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
  version:'1.0.42',revision:'r251-official-1.0.42',base:'r250-official-1.0.41',scope:'web-real-source-ownership',
  home:'progressive-tmdb-metadata+watched-frontier+historical-backlog-preserved+movie-ratings+sports-series',
  discover:'strict-score-year-genre-wwe-exclusions+seven-day-shown-history+three-block-foryou+atomic-tabs+no-duplicates',
  sports_rpc:'cinetracker_sports_payload_v1',sports_tabs:['Próximos','Anteriores','Favoritos','Assistidos'],sports_previous:'rolling-72h',sports_watched:'canonical-toggle+microinteraction',
  f1:'one-source-hub+six-sections+persistent-user-collapse',profile:'one-collapsible-general-and-sports-statistics',detail:'immediate-shell+cached-progressive-metadata',
  global_horizontal_scroll:'disabled',vertical_page_scroll:'preserved',local_horizontal_scrollbars:'explicit',legacy_ui_authorities:'r247+r248+r249+r250-disabled-before-execution',
  recommendations_backend:'shown_recommendations+authenticated-rpc',android:'unchanged-1.0.20',generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v250.js'),{force:true}),rm(resolve(dist,'app-v250.css'),{force:true})]);
console.log('WEB_1_0_42_READY r251 real-source-ui android=unchanged');
