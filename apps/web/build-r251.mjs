import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r250-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,authority]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v250.js'),'utf8'),
 readFile(resolve(dist,'app-v250.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r251-ground-truth.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r251 missing '+label)};
for(const m of[
 "window.__ctR250='source-aligned-deterministic-ui'",
 "window.__ctR250Discover='owned-tab-generation-and-personal-exclusions'",
 "window.__ctR250Sports='canonical-payload-v1-four-tabs'"
])must(js,m,m);
for(const m of[
 "window.__ctR251='video-ground-truth-direct-renderers'",
 "window.__ctR251Home='frontier-current-release-priority-fast-prime'",
 "window.__ctR251Discover='strict-three-block-recommendation-authority'",
 "window.__ctR251Sports='four-tabs-direct-renderer'",
 "window.__ctR251F1='single-owned-hub-persistent-collapse'",
 "window.__ctR251Profile='one-collapsible-statistics-block'",
 "shown_recommendations",
 "cinetracker_sports_payload_v1",
 "cinetracker_sport_mark_watched_v1"
])must(authority,m,m);

/* r251 owns all visible route renderers. Disable r250's delayed DOM reconciler entirely. */
const at=js.indexOf("window.__ctR250='source-aligned-deterministic-ui'");
if(at<0)throw new Error('r251 cannot locate r250 authority');
let before=js.slice(0,at),tail=js.slice(at);
for(const owner of[
 "window.addEventListener('pageshow',()=>later(reconcileAll));",
 "document.addEventListener('cinetracker:data-changed',()=>later(reconcileAll));",
 "document.addEventListener('visibilitychange',()=>{if(!document.hidden)later(reconcileAll)});"
]){
 must(tail,owner,'r250 reconcile owner '+owner);tail=tail.replace(owner,'/* r251 direct renderers own this event */');
}
must(tail,'\nlater(reconcileAll);\n})();','r250 initial reconcile');
tail=tail.replace('\nlater(reconcileAll);\n})();','\nwindow.__ctR251LegacyR250ReconcileDisabled=true;\n})();');
js=before+tail;

js=js.replace("const REVISION='r250-official-1.0.41';","const REVISION='r251-official-1.0.42';")
 .replace("window.__ctWebBuild='1.0.41';window.__ctOfficialVersion='1.0.41';","window.__ctWebBuild='1.0.42';window.__ctOfficialVersion='1.0.42';")
 .replaceAll('CineTracker • v1.0.41','CineTracker • v1.0.42')
 .replaceAll("JSON.stringify({version:'1.0.41',revision:REVISION","JSON.stringify({version:'1.0.42',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r251 boot insertion point missing');
js=js.replace('\nboot();','\n'+authority+'\nboot();');
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('r251 final bundle must not call legacy sports RPC');

css+=`\n/* CineTracker Web 1.0.42 r251 — user-video ground truth */
html,body,#app,.app,.content{box-sizing:border-box!important;max-width:100%!important;min-width:0!important}
html,body,#app{overflow-x:clip!important}html,body{overflow-y:auto!important}
.sidebar{border-right:1px solid rgba(255,255,255,.10)!important;background:rgba(0,0,0,.40)!important;backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important}
.page,.panel,[data-home],[data-discover],[data-sports],[data-profile],[data-configs]{min-width:0!important;max-width:100%!important}
.ct251-xrail{box-sizing:border-box!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct251-xrail::-webkit-scrollbar{height:8px!important}.ct251-xrail::-webkit-scrollbar-thumb{background:rgba(139,199,230,.55)!important;border-radius:999px!important}.ct251-xrail::-webkit-scrollbar-track{background:rgba(8,28,39,.42)!important;border-radius:999px!important}
.ct251-home-row{display:grid!important;grid-template-columns:72px minmax(0,1fr) 40px!important;align-items:center!important;gap:12px!important;padding:12px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:16px!important;background:rgba(255,255,255,.025)!important;cursor:pointer!important;min-width:0!important}
.ct251-home-thumb{width:72px!important;height:96px!important;border-radius:12px!important;background-size:cover!important;background-position:center!important;background-color:rgba(255,255,255,.04)!important;box-shadow:0 10px 22px rgba(0,0,0,.35)!important}
.ct251-home-copy{min-width:0!important;display:flex!important;flex-direction:column!important;gap:5px!important}.ct251-home-copy b{font-weight:600!important;color:#fff!important;font-size:1rem!important;line-height:1.25!important}.ct251-home-copy small{color:rgba(226,232,240,.86)!important;font-size:.82rem!important;line-height:1.35!important}
.ct251-episode-check{width:40px!important;height:40px!important;border-radius:12px!important;display:grid!important;place-items:center!important;border:1px solid rgba(255,255,255,.12)!important;background:rgba(255,255,255,.05)!important;color:#fff!important;font-size:1.15rem!important;transition:all .2s ease!important}.ct251-episode-check:hover{background:rgba(16,185,129,.20)!important;border-color:rgba(16,185,129,.40)!important}.ct251-episode-check.ct251-confirm{animation:ct251Confirm .42s ease!important;background:rgba(16,185,129,.22)!important;border-color:rgba(16,185,129,.55)!important}@keyframes ct251Confirm{0%{transform:scale(1)}42%{transform:scale(.88)}72%{transform:scale(1.08)}100%{transform:scale(1)}}
.ct251-home-arrow{justify-self:center!important;color:rgba(255,255,255,.55)!important;font-size:1.35rem!important}
.ct251-tabs,.ct251-sports-tabs{display:flex!important;gap:8px!important;width:100%!important;padding-bottom:6px!important;margin-bottom:12px!important}.ct251-tabs>* ,.ct251-sports-tabs>*{flex:0 0 auto!important}
.ct251-card-rail,.ct251-profile-rail{display:flex!important;gap:12px!important;width:100%!important;padding:4px 2px 10px!important}.ct251-card-rail>.card,.ct251-profile-rail>.card{flex:0 0 180px!important;min-width:180px!important;max-width:180px!important;animation:none!important;transform:none!important}
.ct251-discover-block{overflow:hidden!important}.ct251-discover-card{min-height:0!important;overflow-anchor:none!important}.ct251-refresh{margin-left:auto!important;border-radius:12px!important}
.ct251-f1hub{max-width:100%!important;min-width:0!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.10)!important;border-radius:18px!important;background:rgba(255,255,255,.025)!important;margin-bottom:14px!important}.ct251-f1head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:14px 16px!important}.ct251-f1head>div{display:flex!important;flex-direction:column!important;gap:2px!important}.ct251-f1head button{border-radius:12px!important}.ct251-f1body{padding:0 14px 14px!important}.ct251-f1body>nav{display:flex!important;gap:8px!important;padding-bottom:10px!important}.ct251-f1body>nav>button{flex:0 0 auto!important;border-radius:12px!important}.ct251-f1table{width:100%!important}.ct251-f1table>div{display:grid!important;grid-template-columns:64px minmax(180px,1fr) 100px!important;gap:10px!important;padding:8px!important;border-bottom:1px solid rgba(255,255,255,.06)!important;min-width:460px!important}.ct251-f1rail{display:flex!important;gap:10px!important}.ct251-f1rail>article{flex:0 0 260px!important;display:flex!important;flex-direction:column!important;gap:4px!important;padding:12px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:14px!important}.ct251-f1overview{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;margin-top:10px!important}.ct251-f1overview>div,.ct251-f1hero{padding:12px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:14px!important;background:rgba(255,255,255,.02)!important}
.ct251-sport-actions{display:flex!important;justify-content:flex-end!important;margin-top:10px!important}.ct251-watch-btn{border-radius:12px!important;padding:9px 13px!important;border:1px solid rgba(255,255,255,.12)!important;background:rgba(255,255,255,.04)!important;transition:transform .2s ease,background .2s ease,border-color .2s ease!important}.ct251-watch-btn.is-watched{background:rgba(16,185,129,.16)!important;border-color:rgba(16,185,129,.38)!important}.ct251-watch-btn.ct251-watch-pop{animation:ct251WatchPop .42s ease!important}@keyframes ct251WatchPop{0%{transform:scale(1)}42%{transform:scale(.9)}72%{transform:scale(1.06)}100%{transform:scale(1)}}
.ct251-statistics>summary{cursor:pointer!important;list-style:none!important}.ct251-statistics>summary::-webkit-details-marker{display:none!important}.ct251-profile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important;padding-top:12px!important}.ct251-stat{background:rgba(255,255,255,.02)!important;border:1px solid rgba(255,255,255,.10)!important;border-radius:16px!important;padding:16px!important;min-width:0!important}.ct251-profile-rail .poster{border-radius:12px!important;box-shadow:0 12px 28px rgba(0,0,0,.5)!important}.ct251-profile-rail .card{transition:transform .2s ease,box-shadow .2s ease!important}.ct251-profile-rail .card:hover{transform:translateY(-4px)!important;box-shadow:0 12px 30px rgba(6,182,212,.10)!important}
[data-configs] input,[data-configs] select,[data-configs] textarea,.settings-grid input,.settings-grid select,.settings-grid textarea{background:rgba(255,255,255,.03)!important;border:1px solid rgba(255,255,255,.10)!important;border-radius:12px!important;padding:10px 16px!important;color:#fff!important;transition:all .2s ease!important}.settings-grid input:focus,.settings-grid select:focus,.settings-grid textarea:focus{border-color:rgba(6,182,212,.5)!important;outline:none!important}.settings-grid button,[data-configs] button{border-radius:12px!important;padding:10px 14px!important;transition:all .2s ease!important}
@media(max-width:780px){.ct251-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct251-card-rail>.card,.ct251-profile-rail>.card{flex-basis:160px!important;min-width:160px!important;max-width:160px!important}.ct251-f1overview{grid-template-columns:1fr!important}}
@media(max-width:520px){.ct251-home-row{grid-template-columns:62px minmax(0,1fr) 40px!important;padding:10px!important;gap:10px!important}.ct251-home-thumb{width:62px!important;height:84px!important}.ct251-home-copy b{font-size:.95rem!important}.ct251-home-copy small{font-size:.76rem!important}}
`;

html=html.replaceAll('r250-official-1.0.41','r251-official-1.0.42').replace(/app-v\d+\.js/g,'app-v251.js').replace(/app-v\d+\.css/g,'app-v251.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r251 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.42-r251';").replace(/app-v\d+\.js/g,'app-v251.js').replace(/app-v\d+\.css/g,'app-v251.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v251.js'),js,'utf8'),writeFile(resolve(dist,'app-v251.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.42',revision:'r251-official-1.0.42',base:'r250-official-1.0.41',scope:'web-user-video-ground-truth',home:'direct-renderer+fast-canonical-prime+frontier-current-release+ratings',discover:'direct-renderer+three-for-you-blocks+tmdb-7.5+post1990+no-pure-drama-doc+no-wwe+seven-day-history+no-duplicates',sports:'direct-renderer+four-tabs+72h+canonical-watched-rpc',f1:'single-owned-six-section-hub+persistent-collapse',profile:'one-collapsible-statistics-block+sport-metric',global_horizontal_scroll:'disabled',local_horizontal_scroll:'isolated',visual_polish:'home-profile-settings-sidebar',legacy_r250_reconcile:'disabled',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v250.js'),{force:true}),rm(resolve(dist,'app-v250.css'),{force:true})]);
console.log('WEB_1_0_42_READY r251 video-ground-truth android=unchanged');