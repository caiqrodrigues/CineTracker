import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r261-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v261.js'),'utf8'),
  readFile(resolve(dist,'app-v261.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r262-real-video-regressions.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r262 missing '+label)};
for(const x of[
  "window.__ctR261='video-ground-truth-series-discover-detail'",
  "const REVISION='r261-official-1.0.52';",
  "window.__ctWebBuild='1.0.52';window.__ctOfficialVersion='1.0.52';"
])must(js,x,x);
for(const x of[
  "window.__ctR262='real-video-regressions-horizontal-series-sports'",
  "window.__ctR262Home='local-horizontal-buckets+recent-weekly-frontier'",
  "window.__ctR262Discover='standard-2x3-local-rails+resilient-personal-state'",
  "window.__ctR262Sports='page-x-contained+local-match-f1-rails'",
  "window.__ctR262Detail='nonblank-series-recovery'",
  "window.__ctR262Horizontal='page-fixed-component-local-x'",
  'function sanitizeWeekly262(row)',
  'function computeWeekly262(row,episodes',
  'function recoverSeriesDetail262(id)',
  'function armHome262()',
  'function armDiscover262()',
  'function armSports262()'
])must(runtime,x,x);
if(!js.includes('\nboot();'))throw new Error('r262 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r261-official-1.0.52';","const REVISION='r262-official-1.0.53';")
  .replace("window.__ctWebBuild='1.0.52';window.__ctOfficialVersion='1.0.52';","window.__ctWebBuild='1.0.53';window.__ctOfficialVersion='1.0.53';")
  .replaceAll('CineTracker • v1.0.52','CineTracker • v1.0.53')
  .replaceAll("JSON.stringify({version:'1.0.52',revision:REVISION","JSON.stringify({version:'1.0.53',revision:REVISION");

css+=`
/* CineTracker Web 1.0.53 r262 — real-device horizontal containment and card authority. */
html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
#app,.app,.content,main,.page,[data-home],[data-home-view],[data-discover],[data-page="discover"],[data-sports],[data-page="sports"],.ct262-sports-root{min-width:0!important;max-width:100%!important}
#app,.app,.content{overflow-x:clip!important}
.app{grid-template-columns:180px minmax(0,1fr)!important}
.app>* ,.content>*{min-width:0!important;max-width:100%!important}
@media(max-width:850px){.app{grid-template-columns:minmax(0,1fr)!important}}
.ct262-xrail{display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;gap:10px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;touch-action:pan-x pan-y!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:thin!important;scroll-snap-type:x proximity;padding-bottom:8px!important}
.ct262-xrail>*{scroll-snap-align:start}
.ct262-home-rail>.empty,.ct262-media-rail>.empty{flex:1 0 100%!important;min-width:0!important}
.ct262-home-rail>*:not(.empty){flex:0 0 clamp(286px,34vw,390px)!important;width:clamp(286px,34vw,390px)!important;min-width:286px!important;max-width:390px!important;margin:0!important}
.ct262-home-rail .card,.ct262-home-rail article,.ct262-home-rail .feature{height:auto!important;min-height:0!important}
@media(max-width:700px){.ct262-home-rail>*:not(.empty){flex-basis:min(84vw,340px)!important;width:min(84vw,340px)!important;min-width:min(84vw,340px)!important;max-width:min(84vw,340px)!important}}
.ct262-discover-rail,.ct262-media-rail{justify-content:flex-start!important}
.ct262-media-rail>.ct259-media-card,.ct262-media-rail>.ct255-media-card,.ct262-standard-media-card{display:block!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:auto!important;min-height:344px!important;max-height:none!important;overflow:visible!important}
.ct262-standard-media-card>button,.ct262-media-rail>.ct259-media-card>button,.ct262-media-rail>.ct255-media-card>button{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;width:100%!important;height:auto!important;min-height:344px!important;max-height:none!important;overflow:visible!important;padding:0!important;white-space:normal!important;text-align:left!important}
.ct262-standard-media-card .ct259-media-poster,.ct262-standard-media-card .ct255-media-poster,.ct262-media-rail .ct259-media-poster,.ct262-media-rail .ct255-media-poster{display:block!important;flex:0 0 264px!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:2/3!important;object-fit:cover!important;border-radius:12px!important;overflow:hidden!important}
.ct262-standard-media-card .ct259-media-copy,.ct262-standard-media-card .ct255-media-copy,.ct262-media-rail .ct259-media-copy,.ct262-media-rail .ct255-media-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;width:100%!important;min-height:80px!important;height:auto!important;padding:9px 3px 0!important;white-space:normal!important;overflow:visible!important}
.ct262-standard-media-card .ct259-media-copy>*,.ct262-standard-media-card .ct255-media-copy>*,.ct262-media-rail .ct259-media-copy>*,.ct262-media-rail .ct255-media-copy>*{display:block!important;visibility:visible!important;opacity:1!important;max-width:100%!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
.ct262-standard-media-card .ct259-media-copy b,.ct262-standard-media-card .ct255-media-copy b{font-size:14px!important;line-height:1.25!important;margin-bottom:5px!important}
.ct262-standard-media-card .ct259-media-copy small,.ct262-standard-media-card .ct259-media-copy span,.ct262-standard-media-card .ct255-media-copy small,.ct262-standard-media-card .ct255-media-copy span{font-size:11px!important;line-height:1.3!important}
@media(max-width:700px){.ct262-media-rail>.ct259-media-card,.ct262-media-rail>.ct255-media-card,.ct262-standard-media-card{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important;min-height:306px!important}.ct262-standard-media-card>button,.ct262-media-rail>.ct259-media-card>button,.ct262-media-rail>.ct255-media-card>button{min-height:306px!important}.ct262-standard-media-card .ct259-media-poster,.ct262-standard-media-card .ct255-media-poster,.ct262-media-rail .ct259-media-poster,.ct262-media-rail .ct255-media-poster{flex-basis:231px!important;width:154px!important;min-width:154px!important;max-width:154px!important;height:231px!important;min-height:231px!important;max-height:231px!important}}
.ct262-sports-root{overflow-x:clip!important}
.ct262-sports-tabs-rail>*{flex:0 0 auto!important;width:max-content!important;min-width:max-content!important}
.ct262-sports-rail:not(.ct262-sports-tabs-rail)>*:not(.empty){flex:0 0 clamp(280px,34vw,370px)!important;width:clamp(280px,34vw,370px)!important;min-width:280px!important;max-width:370px!important;margin:0!important}
.ct262-sports-root .event-grid,.ct262-sports-root .ct225-match-stack,.ct262-sports-root .ct225-match-scroll{grid-template-columns:none!important}
.ct262-sports-root .ct236-f1-shell,.ct262-sports-root [data-f1-body]{min-width:0!important;max-width:100%!important;overflow-x:auto!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important}
.ct262-sports-root img,.ct262-sports-root svg{max-width:100%!important}
@media(max-width:700px){.ct262-sports-rail:not(.ct262-sports-tabs-rail)>*:not(.empty){flex-basis:min(86vw,340px)!important;width:min(86vw,340px)!important;min-width:min(86vw,340px)!important;max-width:min(86vw,340px)!important}}
.ct262-series-detail{display:grid!important;gap:14px!important;min-width:0!important;max-width:100%!important}
.ct262-back{justify-self:start!important}
.ct262-series-hero{display:grid!important;grid-template-columns:160px minmax(0,1fr)!important;gap:18px!important;align-items:start!important}
.ct262-series-poster{display:block!important;width:160px!important;aspect-ratio:2/3!important;object-fit:cover!important;border-radius:14px!important}
.ct262-series-hero h2{margin:4px 0 8px!important;font-size:clamp(22px,3vw,36px)!important}
.ct262-series-hero p{margin:0 0 10px!important;line-height:1.55!important;color:#c3c9cc!important}
.ct262-detail-meta{display:flex!important;gap:8px!important;flex-wrap:wrap!important;color:#a9bdc8!important;font-size:12px!important}
.ct262-detail-meta span{border:1px solid #284452!important;border-radius:999px!important;padding:4px 8px!important}
.ct262-cast{display:block!important;margin-top:10px!important;color:#9fb0b8!important;line-height:1.45!important}
.ct262-detail-section{padding:14px!important;min-width:0!important;overflow:hidden!important}
.ct262-season-rail,.ct262-episode-list,.ct262-related-rail{display:flex!important;flex-flow:row nowrap!important;gap:10px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;touch-action:pan-x pan-y!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:thin!important;padding-bottom:8px!important}
.ct262-season-rail>*{flex:0 0 auto!important}
.ct262-episode{display:grid!important;gap:7px!important;flex:0 0 250px!important;width:250px!important;min-width:250px!important;max-width:250px!important;min-height:142px!important;padding:13px!important;border:1px solid #174457!important;border-radius:13px!important;background:#08212c!important;white-space:normal!important}
.ct262-episode b{font-size:14px!important;line-height:1.3!important}.ct262-episode small,.ct262-episode span{font-size:11px!important;color:#8fa7b4!important}.ct262-episode em{font-size:11px!important;font-style:normal!important;color:#d2a84c!important}.ct262-episode.watched{border-color:#21604d!important}.ct262-episode.watched em{color:#7ed7a5!important}
.ct262-related-card{flex:0 0 150px!important;width:150px!important;min-width:150px!important}.ct262-related-card button{display:grid!important;gap:7px!important;width:100%!important;text-align:left!important}.ct262-related-card img,.ct262-related-empty{display:block!important;width:150px!important;height:225px!important;object-fit:cover!important;border-radius:11px!important}.ct262-related-empty{place-items:center!important;background:#15232a!important;color:#78909c!important}.ct262-related-card b{font-size:12px!important;line-height:1.3!important;white-space:normal!important}
@media(max-width:700px){.ct262-series-hero{grid-template-columns:110px minmax(0,1fr)!important}.ct262-series-poster{width:110px!important}.ct262-episode{flex-basis:220px!important;width:220px!important;min-width:220px!important;max-width:220px!important}}
`;

html=html.replaceAll('r261-official-1.0.52','r262-official-1.0.53').replace(/app-v261\.js/g,'app-v262.js').replace(/app-v261\.css/g,'app-v262.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r262 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.53-r262';").replace(/app-v261\.js/g,'app-v262.js').replace(/app-v261\.css/g,'app-v262.css');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v262.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v262.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.53',revision:'r262-official-1.0.53',base:'r261-official-1.0.52',scope:'real-video-regressions-horizontal-series-sports',home:'local-horizontal-buckets+recent-weekly-frontier',discover:'standard-2x3-local-rails+resilient-personal-state',sports:'page-x-contained+local-match-f1-rails',detail:'nonblank-series-recovery',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v261.js'),{force:true}),rm(resolve(dist,'app-v261.css'),{force:true})]);
console.log('WEB_1_0_53_READY r262 real-video regressions horizontal series sports');
