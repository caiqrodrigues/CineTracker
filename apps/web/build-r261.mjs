import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r260-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v260.js'),'utf8'),
  readFile(resolve(dist,'app-v260.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r261-video-ground-truth-series.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r261 missing '+label)};
for(const x of[
  "window.__ctR260='discover-standard-cards+home-first-page-cache+isolated-modal-rails'",
  "const REVISION='r260-official-1.0.51';",
  'const key=META260+String(path);'
])must(js,x,x);
for(const x of[
  "window.__ctR261='video-ground-truth-series-discover-detail'",
  "window.__ctR261Home='raw-smackdown-exact-frontier+special-series+persistent-home-cache'",
  "window.__ctR261Series='formula1-and-superbowl-first-class-imported-series'",
  "window.__ctR261Discover='button-height-reset+poster-2x3+native-drag-rails'",
  "window.__ctR261Detail='tmdb-cache-key-includes-params+nonblank-detail'",
  "window.__ctR261Horizontal='special-series+discover+native-detail-rails'",
  "ct-home-first-page-v261",
  "cinetracker_imported_series_state_v1",
  "const d=String(x?.air_date||x?.date||'').slice(0,10)",
  "function provisionalWeekly261(row)",
  "function armDiscover261()"
])must(runtime,x,x);
if(!js.includes('\nboot();'))throw new Error('r261 boot insertion point missing');

/* r260 keyed TV metadata only by path. Home could poison a richer series detail request.
   Distinguish cache entries by sorted params without destructive storage cleanup. */
js=js.replace('const key=META260+String(path);',"const key=META260+String(path)+'?'+Object.keys(params||{}).sort().map(k=>encodeURIComponent(k)+'='+encodeURIComponent(String(params[k]??''))).join('&');");
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r260-official-1.0.51';","const REVISION='r261-official-1.0.52';")
  .replace("window.__ctWebBuild='1.0.51';window.__ctOfficialVersion='1.0.51';","window.__ctWebBuild='1.0.52';window.__ctOfficialVersion='1.0.52';")
  .replaceAll('CineTracker • v1.0.51','CineTracker • v1.0.52')
  .replaceAll("JSON.stringify({version:'1.0.51',revision:REVISION","JSON.stringify({version:'1.0.52',revision:REVISION");

css+=`
/* CineTracker Web 1.0.52 r261 — real-device ground truth. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}

/* Discover: reset the full button box. The r260 video proved the inherited button height
   was still crushing the 2:3 poster into a narrow strip. */
.ct259-media-rail{align-items:flex-start!important;min-height:350px!important}
.ct259-media-card{display:block!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:auto!important;min-height:344px!important;max-height:none!important;overflow:visible!important}
.ct259-media-card>button{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;width:100%!important;height:auto!important;min-height:344px!important;max-height:none!important;overflow:visible!important;padding:0!important;white-space:normal!important;line-height:normal!important}
.ct259-media-poster{display:block!important;flex:0 0 264px!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:2/3!important;object-fit:cover!important;overflow:hidden!important;border-radius:12px!important}
.ct259-media-copy{display:flex!important;flex:1 0 auto!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;width:100%!important;height:auto!important;min-height:80px!important;max-height:none!important;overflow:visible!important;padding:9px 3px 0!important;white-space:normal!important}
.ct259-media-copy>*{display:block!important;visibility:visible!important;opacity:1!important;max-width:100%!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
.ct259-media-copy b{font-size:14px!important;line-height:1.25!important;margin-bottom:5px!important}
.ct259-media-copy small,.ct259-media-copy span{font-size:11px!important;line-height:1.3!important}
@media(max-width:700px){
 .ct259-media-rail{min-height:312px!important}
 .ct259-media-card{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important;min-height:306px!important}
 .ct259-media-card>button{min-height:306px!important}
 .ct259-media-poster{flex-basis:231px!important;width:154px!important;min-width:154px!important;max-width:154px!important;height:231px!important;min-height:231px!important;max-height:231px!important}
 .ct259-media-copy{min-height:75px!important}
}

/* Formula 1 / Super Bowl are media-series details, separate from Sports Hub. */
.ct261-special-series{display:grid!important;gap:14px!important;min-width:0!important;max-width:100%!important}
.ct261-back{justify-self:start!important}
.ct261-series-hero{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:18px!important}
.ct261-series-hero h2{margin:4px 0 8px!important;font-size:clamp(22px,3vw,36px)!important}
.ct261-series-hero p{margin:0!important;max-width:720px!important;color:#a9bdc8!important}
.ct261-series-status{display:grid!important;gap:4px!important;text-align:right!important;white-space:nowrap!important}
.ct261-series-status b{color:#7ed7a5!important}
.ct261-series-status small{color:#8298a4!important}
.ct261-season-rail,.ct261-episode-list{display:flex!important;flex-flow:row nowrap!important;gap:10px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;touch-action:pan-x pan-y!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;scrollbar-width:thin!important;padding-bottom:7px!important}
.ct261-season-rail>*{flex:0 0 auto!important}
.ct261-episode{display:grid!important;gap:7px!important;flex:0 0 250px!important;width:250px!important;min-width:250px!important;max-width:250px!important;min-height:142px!important;padding:13px!important;border:1px solid #174457!important;border-radius:13px!important;background:#08212c!important;white-space:normal!important}
.ct261-episode b{font-size:14px!important;line-height:1.25!important}
.ct261-episode small,.ct261-episode span{font-size:11px!important;color:#8fa7b4!important;white-space:normal!important}
.ct261-episode em{font-size:11px!important;font-style:normal!important;color:#d2a84c!important}
.ct261-episode.watched{border-color:#21604d!important}
.ct261-episode.watched em{color:#7ed7a5!important}
@media(max-width:700px){.ct261-series-hero{display:grid!important}.ct261-series-status{text-align:left!important}.ct261-episode{flex-basis:220px!important;width:220px!important;min-width:220px!important;max-width:220px!important}}
`;

html=html.replaceAll('r260-official-1.0.51','r261-official-1.0.52').replace(/app-v260\.js/g,'app-v261.js').replace(/app-v260\.css/g,'app-v261.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r261 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.52-r261';").replace(/app-v260\.js/g,'app-v261.js').replace(/app-v260\.css/g,'app-v261.css');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v261.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v261.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
  version:'1.0.52',revision:'r261-official-1.0.52',base:'r260-official-1.0.51',
  scope:'video-ground-truth-raw-f1-superbowl-discover-detail',
  home:'raw-smackdown-exact-frontier+special-series+persistent-home-cache',
  series:'formula1-and-superbowl-first-class-imported-series',
  discover:'button-height-reset+poster-2x3+native-drag-rails',
  detail:'tmdb-cache-key-includes-params+nonblank-detail',
  android:'unchanged-1.0.20',generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v260.js'),{force:true}),rm(resolve(dist,'app-v260.css'),{force:true})]);
console.log('WEB_1_0_52_READY r261 video-ground-truth series discover detail');
