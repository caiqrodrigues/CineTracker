import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r262-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v262.js'),'utf8'),
  readFile(resolve(dist,'app-v262.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r263-home-list-discover-f1-watched.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r263 missing '+label)};
for(const x of[
  "window.__ctR262='real-video-regressions-horizontal-series-sports'",
  "const REVISION='r262-official-1.0.53';",
  "window.__ctWebBuild='1.0.53';window.__ctOfficialVersion='1.0.53';",
  'function armHome262()'
])must(js,x,x);
for(const x of[
  "window.__ctR263='approved-home-list-discover-intelligence-f1-watched'",
  "window.__ctR263Home='vertical-list+hidden-history+no-home-carousel'",
  "window.__ctR263Discover='nine-tabs-local-rails+personal-exclusions+top10-streaming'",
  "window.__ctR263Sports='f1-db-events+mark-unmark-watched'",
  "window.__ctR263Horizontal='document-fixed+component-local-only'",
  'function restoreHomeList263',
  'function pickProviders263',
  'cinetracker_sport_mark_watched_v1',
  'function f1Rows263'
])must(runtime,x,x);

/* r262's Home armer is the direct regression: it turns every vertical .stack into an x-rail.
   Retire only that armer while preserving the r262 Raw/SmackDown audit, series detail recovery,
   Discover containment and Sports reconciliation. */
const armHome262=/function armHome262\(\)\{[\s\S]*?\n\}\nfunction armDiscover262\(\)\{/;
if(!armHome262.test(js))throw new Error('r263 could not retire r262 Home carousel authority');
js=js.replace(armHome262,'function armHome262(){return;}\nfunction armDiscover262(){');
if(!js.includes('\nboot();'))throw new Error('r263 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r262-official-1.0.53';","const REVISION='r263-official-1.0.54';")
 .replace("window.__ctWebBuild='1.0.53';window.__ctOfficialVersion='1.0.53';","window.__ctWebBuild='1.0.54';window.__ctOfficialVersion='1.0.54';")
 .replaceAll('CineTracker • v1.0.53','CineTracker • v1.0.54')
 .replaceAll("JSON.stringify({version:'1.0.53',revision:REVISION","JSON.stringify({version:'1.0.54',revision:REVISION");

css+=`
/* CineTracker Web 1.0.54 r263 — approved Home list + complete Discover + F1 watched controls. */
html,body,#app{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
#app,.app,.content,.page,[data-home],[data-discover],[data-sports]{min-width:0!important;max-width:100%!important}

/* Home is a vertical list. r262 x-rail classes are neutralized as a second line of defense. */
[data-home] .home-section .stack,[data-home-view] .home-section .stack,[data-home-view] .stack,
[data-home] .home-section .stack.ct262-xrail,[data-home-view] .stack.ct262-xrail,
[data-home] .home-section .stack.ct262-home-rail,[data-home-view] .stack.ct262-home-rail{
 display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-flow:row!important;align-items:stretch!important;
 gap:10px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important;overflow-y:visible!important;
 scroll-snap-type:none!important;overscroll-behavior-x:auto!important;touch-action:pan-y!important;padding-bottom:0!important
}
[data-home] .home-section .stack>* ,[data-home-view] .stack>*{
 box-sizing:border-box!important;display:block;flex:none!important;width:100%!important;max-width:100%!important;min-width:0!important;margin-left:0!important;margin-right:0!important;scroll-snap-align:none!important
}

/* Discover tabs and every media collection scroll locally, never the page. */
.ct263-discover-tabs,.ct263-discover-types,.ct263-media-rail,.ct263-f1-watch-rail{
 box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;width:100%!important;max-width:100%!important;min-width:0!important;
 overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;
 scrollbar-width:thin!important;scrollbar-gutter:stable!important
}
.ct263-discover-tabs,.ct263-discover-types{gap:8px!important;padding:2px 0 9px!important}
.ct263-discover-tabs>* ,.ct263-discover-types>*{flex:0 0 auto!important;white-space:nowrap!important}
.ct263-media-rail{gap:14px!important;padding:3px 2px 10px!important;align-items:flex-start!important;scroll-snap-type:x proximity!important}
.ct263-media-card{display:block!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:auto!important;border:1px solid rgba(49,95,120,.78)!important;border-radius:14px!important;background:#071721!important;overflow:hidden!important;scroll-snap-align:start!important;box-shadow:0 8px 24px rgba(0,0,0,.16)!important}
.ct263-media-card>button{display:flex!important;flex-direction:column!important;align-items:stretch!important;width:100%!important;height:auto!important;min-height:344px!important;padding:0!important;border:0!important;background:transparent!important;color:inherit!important;text-align:left!important;white-space:normal!important;cursor:pointer!important}
.ct263-media-poster{display:block!important;flex:0 0 264px!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:2/3!important;object-fit:cover!important;background:#0b2634!important}
.ct263-poster-empty{display:grid!important;place-items:center!important;color:#7595a5!important;font-size:10px!important}
.ct263-media-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:5px!important;width:100%!important;min-height:80px!important;padding:9px!important;white-space:normal!important}
.ct263-media-copy b{font-size:14px!important;line-height:1.25!important;white-space:normal!important}.ct263-media-copy small{font-size:10px!important;color:#8ea8b5!important;line-height:1.35!important;white-space:normal!important}.ct263-media-copy>span{font-size:10px!important;color:#b9d9e8!important}
.ct263-discover-block{display:grid!important;gap:9px!important;margin:0 0 18px!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}.ct263-discover-block .panel-head{margin:0!important}.ct263-loading{min-height:82px!important;display:grid!important;place-items:center!important;color:#86a5b5!important}
.ct263-streaming{display:flex!important;flex-wrap:wrap!important;gap:5px!important;width:100%!important;margin-top:3px!important;color:#8eafbf!important;font-size:9px!important}.ct263-streaming>span{display:flex!important;align-items:center!important;gap:4px!important;max-width:100%!important;border:1px solid rgba(72,130,160,.35)!important;border-radius:999px!important;padding:3px 5px!important;background:#0b2532!important}.ct263-streaming img{display:block!important;width:17px!important;height:17px!important;border-radius:4px!important;object-fit:cover!important}.ct263-streaming i{font-style:normal!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:112px!important}.ct263-streaming.pending,.ct263-streaming.empty-provider{display:block!important;color:#7898a8!important}

/* Formula 1 watch history/control lives inside the F1 Hub and uses canonical sports events. */
.ct263-f1-watch-panel{display:grid!important;gap:10px!important;margin:12px 0!important;padding:12px!important;border:1px solid rgba(70,144,181,.42)!important;border-radius:14px!important;background:#071c27!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}
.ct263-f1-watch-head{display:flex!important;justify-content:space-between!important;align-items:flex-end!important;gap:12px!important}.ct263-f1-watch-head>div{display:grid!important;gap:3px!important}.ct263-f1-watch-head small,.ct263-f1-watch-head span{color:#8caaba!important;font-size:9px!important}.ct263-f1-watch-head b{font-size:13px!important}.ct263-f1-watch-rail{gap:9px!important;padding:2px 0 8px!important}
.ct263-f1-event{display:grid!important;gap:6px!important;flex:0 0 260px!important;width:260px!important;min-width:260px!important;max-width:260px!important;padding:11px!important;border:1px solid #254e64!important;border-radius:12px!important;background:#0a202c!important;white-space:normal!important}.ct263-f1-event.watched{border-color:#3b765d!important}.ct263-f1-event small,.ct263-f1-event span{color:#91adbb!important;font-size:9px!important}.ct263-f1-event b{font-size:11px!important;line-height:1.3!important}.ct263-f1-watch-btn{width:100%!important;border:1px solid #2f6886!important;background:#0b2b3d!important;color:#b9deef!important;border-radius:10px!important;padding:8px 9px!important;font:inherit!important;font-size:9px!important;cursor:pointer!important}.ct263-f1-watch-btn.on{border-color:#c8aa55!important;color:#efd98b!important;background:#28210f!important}.ct263-f1-watch-btn:disabled{opacity:.55!important;cursor:default!important}

.ct263-discover-tabs::-webkit-scrollbar,.ct263-discover-types::-webkit-scrollbar,.ct263-media-rail::-webkit-scrollbar,.ct263-f1-watch-rail::-webkit-scrollbar{height:7px!important}.ct263-discover-tabs::-webkit-scrollbar-thumb,.ct263-discover-types::-webkit-scrollbar-thumb,.ct263-media-rail::-webkit-scrollbar-thumb,.ct263-f1-watch-rail::-webkit-scrollbar-thumb{background:rgba(92,184,232,.62)!important;border-radius:999px!important}.ct263-discover-tabs::-webkit-scrollbar-track,.ct263-discover-types::-webkit-scrollbar-track,.ct263-media-rail::-webkit-scrollbar-track,.ct263-f1-watch-rail::-webkit-scrollbar-track{background:rgba(5,22,31,.65)!important;border-radius:999px!important}
@media(max-width:700px){
 .ct263-media-card{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important}.ct263-media-card>button{min-height:306px!important}.ct263-media-poster{flex-basis:231px!important;width:154px!important;min-width:154px!important;max-width:154px!important;height:231px!important;min-height:231px!important;max-height:231px!important}.ct263-media-copy{min-height:75px!important;padding:8px!important}.ct263-media-copy b{font-size:12px!important}.ct263-f1-event{flex-basis:min(82vw,280px)!important;width:min(82vw,280px)!important;min-width:min(82vw,280px)!important;max-width:min(82vw,280px)!important}.ct263-f1-watch-head{display:grid!important;align-items:start!important}
}
`;

html=html.replaceAll('r262-official-1.0.53','r263-official-1.0.54').replace(/app-v262\.js/g,'app-v263.js').replace(/app-v262\.css/g,'app-v263.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r263 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.54-r263';").replace(/app-v262\.js/g,'app-v263.js').replace(/app-v262\.css/g,'app-v263.css');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v263.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v263.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.54',revision:'r263-official-1.0.54',base:'r262-official-1.0.53',scope:'approved-home-list-discover-intelligence-f1-watched',home:'vertical-list+hidden-history+no-home-carousel',discover:'nine-tabs-local-rails+personal-exclusions+top10-streaming',sports:'f1-db-events+mark-unmark-watched',horizontal:'document-fixed+component-local-only',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v262.js'),{force:true}),rm(resolve(dist,'app-v262.css'),{force:true})]);
console.log('WEB_1_0_54_READY r263 Home list Discover intelligence Top10 streaming F1 watched');
