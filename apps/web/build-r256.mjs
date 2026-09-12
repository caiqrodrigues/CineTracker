import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r256 keeps the r255 data/UI work and adds only the failures proven by the next user video. */
await import('./build-r255-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v255.js'),'utf8'),
  readFile(resolve(dist,'app-v255.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r256-video-ground-truth-scroll-cache.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r256 missing '+label)};
for(const x of[
  "window.__ctR255='discover-cards-home-buckets-sports-f1-profile-live'",
  "window.__ctR255Discover='poster-first-nine-tabs-full-watchlist-atomic'",
  "window.__ctR255Sports='five-tabs-dark-cards-f1-six-approved-tabs'",
  "window.__ctR255Profile='approved-layout-canonical-sports-values'",
  "const REVISION='r255-official-1.0.46';"
])must(js,x,x);
for(const x of[
  "window.__ctR256='video-ground-truth-scroll-discover-sports-profile-cache'",
  "window.__ctR256Home='missing-wins-caught-up+live-frontier+stale-while-revalidate'",
  "window.__ctR256Discover='r255-data+forced-visible-card-geometry+route-snapshot'",
  "window.__ctR256Sports='f1-first-then-global-filters+route-snapshot'",
  "window.__ctR256Profile='single-collapse-media-and-sports+route-snapshot'",
  "window.__ctR256Horizontal='persistent-childlist-episode-season-chart-related-cast'",
  "window.__ctR256Navigation='instant-top-page-snapshots+home-stale-while-revalidate'"
])must(runtime,x,x);
if(!js.includes('\nboot();'))throw new Error('r256 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r255-official-1.0.46';","const REVISION='r256-official-1.0.47';")
 .replace("window.__ctWebBuild='1.0.46';window.__ctOfficialVersion='1.0.46';","window.__ctWebBuild='1.0.47';window.__ctOfficialVersion='1.0.47';")
 .replaceAll('CineTracker • v1.0.46','CineTracker • v1.0.47')
 .replaceAll("JSON.stringify({version:'1.0.46',revision:REVISION","JSON.stringify({version:'1.0.47',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.47 r256 — user-video ground truth. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}
.ct256-local-x{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct256-local-x::-webkit-scrollbar{height:9px!important}.ct256-local-x::-webkit-scrollbar-thumb{background:rgba(92,184,232,.68)!important;border-radius:999px!important}.ct256-local-x::-webkit-scrollbar-track{background:rgba(5,22,31,.8)!important;border-radius:999px!important}
/* Loaded Discover cards must remain full poster cards; do not inherit any compact row/button height. */
.ct255-media-rail{display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;gap:12px!important;width:100%!important;max-width:100%!important;min-height:352px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:3px 2px 12px!important;scroll-snap-type:x proximity!important}
.ct255-media-card{box-sizing:border-box!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;min-height:344px!important;height:auto!important;max-height:none!important;align-self:stretch!important;overflow:hidden!important}
.ct255-media-card>button{box-sizing:border-box!important;display:grid!important;grid-template-rows:264px minmax(80px,auto)!important;align-content:start!important;width:100%!important;min-width:100%!important;height:100%!important;min-height:344px!important;max-height:none!important;overflow:visible!important;padding:0!important;margin:0!important;line-height:normal!important}
.ct255-media-card .ct255-media-poster{box-sizing:border-box!important;display:block!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:center!important;overflow:hidden!important}
.ct255-media-card .ct255-media-copy{box-sizing:border-box!important;display:grid!important;grid-template-rows:auto auto auto!important;align-content:start!important;gap:5px!important;width:100%!important;min-height:80px!important;height:auto!important;max-height:none!important;padding:10px!important;overflow:visible!important}
.ct255-media-card .ct255-media-copy b{display:block!important;min-height:30px!important;white-space:normal!important;overflow:visible!important}.ct255-media-card .ct255-media-copy small,.ct255-media-card .ct255-media-copy span{display:block!important;white-space:normal!important;overflow:visible!important}
.ct255-discover-block,.ct255-discover-results{min-height:0!important;max-height:none!important;overflow:hidden!important}
/* One Profile collapse authority: sports stats disappear together with media stats. */
[data-ct256-profile-sports].ct256-stats-collapsed{display:none!important}
@media(max-width:700px){.ct255-media-rail{min-height:316px!important}.ct255-media-card{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important;min-height:306px!important}.ct255-media-card>button{grid-template-rows:231px minmax(75px,auto)!important;min-height:306px!important}.ct255-media-card .ct255-media-poster{width:154px!important;min-width:154px!important;max-width:154px!important;height:231px!important;min-height:231px!important;max-height:231px!important}}
`;

html=html.replaceAll('r255-official-1.0.46','r256-official-1.0.47').replace(/app-v255\.js/g,'app-v256.js').replace(/app-v255\.css/g,'app-v256.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r256 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.47-r256';").replace(/app-v255\.js/g,'app-v256.js').replace(/app-v255\.css/g,'app-v256.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v256.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v256.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.47',revision:'r256-official-1.0.47',base:'r255-official-1.0.46',scope:'video-ground-truth-home-scroll-discover-sports-profile-navigation',home:'missing-wins-caught-up+live-frontier+stale-while-revalidate',discover:'r255-data+forced-visible-poster-cards+route-snapshot',sports_order:['F1 Hub','Próximos/Ao vivo/Anteriores/Favoritos/Assistidos','sport filters','event feed'],profile:'single-collapse-media-and-sports',horizontal:'persistent-local-episode-season-chart-related-cast',navigation:'instant-top-page-snapshots+background-refresh',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v255.js'),{force:true}),rm(resolve(dist,'app-v255.css'),{force:true})]);
console.log('WEB_1_0_47_READY r256 home-scroll-discover-sports-profile-cache');
