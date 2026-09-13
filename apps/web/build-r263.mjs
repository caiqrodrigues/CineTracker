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
  readFile(resolve(root,'runtime-r263-user-ground-truth.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r263 missing '+label)};
for(const x of[
  "window.__ctR262='real-video-regressions-horizontal-series-sports'",
  "const REVISION='r262-official-1.0.53';",
  "window.__ctWebBuild='1.0.53';window.__ctOfficialVersion='1.0.53';"
])must(js,x,x);
for(const x of[
  "window.__ctR263='user-ground-truth-home-list-detail-discover-sports-f1'",
  "window.__ctR263Home='vertical-list-only-no-carousel'",
  "window.__ctR263Detail='local-x-seasons-season-graphs-similar-only'",
  "window.__ctR263Discover='all-tabs-local-x-standard-2x3'",
  "window.__ctR263Sports='canonical-watch-rpc+fresh-f1-jolpica-sync'",
  'function enforceHomeList263()',
  'function armDetail263()',
  'function armDiscover263()',
  'async function syncF1263()'
])must(runtime,x,x);
const oldKey="key=String(e?.provider_event_id||e?.event_id||e?.id||'')";
const oldToggle="async function toggleSport255(btn){const provider=btn.dataset.provider,id=btn.dataset.ct255Watch,watched=btn.dataset.watched==='1';await rpc('cinetracker_sport_mark_watched_v1',{p_provider:provider,p_provider_event_id:id,p_watched:!watched,p_watched_at:new Date().toISOString(),p_duration_minutes:null});";
must(js,oldKey,'legacy sports watch key');must(js,oldToggle,'legacy sports watch rpc signature');
js=js.replace(oldKey,"key=String(e?.id||e?.event_id||'')")
  .replace(oldToggle,"async function toggleSport255(btn){const id=Number(btn.dataset.ct255Watch||0),watched=btn.dataset.watched==='1';if(!id)throw new Error('SPORT_EVENT_NOT_FOUND');await rpc('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:!watched,p_watched_at:new Date().toISOString(),p_duration_minutes:null});");
if(!js.includes('\nboot();'))throw new Error('r263 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r262-official-1.0.53';","const REVISION='r263-official-1.0.54';")
  .replace("window.__ctWebBuild='1.0.53';window.__ctOfficialVersion='1.0.53';","window.__ctWebBuild='1.0.54';window.__ctOfficialVersion='1.0.54';")
  .replaceAll('CineTracker • v1.0.53','CineTracker • v1.0.54')
  .replaceAll("JSON.stringify({version:'1.0.53',revision:REVISION","JSON.stringify({version:'1.0.54',revision:REVISION");

css+=`
/* CineTracker Web 1.0.54 r263 — exact user-requested horizontal scope. */
html,body,#app,.app,.content,main,.page{max-width:100%!important;min-width:0!important}
html,body,#app,.app,.content{overflow-x:hidden!important}
/* Home is a vertical list. r262 Home carousel is explicitly neutralized. */
[data-home] .home-section .stack,[data-home-view] .home-section .stack,.ct263-home-list,.ct262-home-rail.ct263-home-list{display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;grid-template-columns:none!important;grid-auto-flow:unset!important;grid-auto-columns:unset!important;gap:8px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important;overflow-y:visible!important;scroll-snap-type:none!important;padding-bottom:0!important}
[data-home] .home-section .stack>*:not(.empty),[data-home-view] .home-section .stack>*:not(.empty),.ct263-home-list>*:not(.empty){flex:0 0 auto!important;width:100%!important;min-width:0!important;max-width:100%!important;margin-left:0!important;margin-right:0!important;scroll-snap-align:none!important}
/* Details: only the requested local horizontal surfaces. */
.ct263-local-x,.ct262-season-rail,.ct244-seasons-scroll,.season-tabs,.season-list,.season-row,[data-seasons],.ct169-season-row,.ct244-chart-scroll,.ct169-season-chart-carousel,.ct169-chart-scroll,.episode-graph,.graph-shell,.chart-wrap,.chart-scroll,[data-chart],[data-episode-chart],.ct262-related-rail,.related-scroll,.related-grid,.related-row,[data-related],.similar-scroll,.similar-grid,.similar-row,[data-similar]{max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important}
.ct262-season-rail,.ct263-detail-rail.season-tabs,.ct263-detail-rail.season-list,.ct263-detail-rail.season-row,.ct262-related-rail,.ct263-detail-rail.related-scroll,.ct263-detail-rail.related-row,.ct263-detail-rail.similar-scroll,.ct263-detail-rail.similar-row{display:flex!important;flex-flow:row nowrap!important}
.ct262-season-rail>*,.ct262-related-rail>*{flex:0 0 auto!important}
/* Discover tabs and every card rail are always local horizontal rails. */
[data-discover] .ct259-discover-tabs,[data-discover] .ct259-discover-types,[data-discover] .ct257-discover-tabs,[data-discover] .ct257-discover-types,[data-discover] .ct255-discover-tabs,[data-discover] .ct255-discover-types,.ct263-discover-tabs-rail{display:flex!important;flex-flow:row nowrap!important;justify-content:flex-start!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important}
[data-discover] .ct259-discover-tabs>*,[data-discover] .ct259-discover-types>*,[data-discover] .ct257-discover-tabs>*,[data-discover] .ct257-discover-types>*,[data-discover] .ct255-discover-tabs>*,[data-discover] .ct255-discover-types>*{flex:0 0 auto!important;width:max-content!important}
[data-discover] .ct259-media-rail,[data-discover] .ct257-media-rail,[data-discover] .ct255-media-rail,.ct263-discover-rail{display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;justify-content:flex-start!important;gap:14px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;padding-bottom:8px!important}
[data-discover] .ct259-media-card,[data-discover] .ct257-media-card,[data-discover] .ct255-media-card,.ct263-discover-card{display:block!important;flex:0 0 176px!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:auto!important;min-height:344px!important;overflow:visible!important}
[data-discover] .ct259-media-card>button,[data-discover] .ct257-media-card>button,[data-discover] .ct255-media-card>button,.ct263-discover-card>button{display:flex!important;flex-direction:column!important;align-items:stretch!important;width:100%!important;height:auto!important;min-height:344px!important;padding:0!important;overflow:visible!important;text-align:left!important;white-space:normal!important}
[data-discover] .ct259-media-poster,[data-discover] .ct257-media-poster,[data-discover] .ct255-media-poster,.ct263-discover-card .ct259-media-poster,.ct263-discover-card .ct257-media-poster,.ct263-discover-card .ct255-media-poster{display:block!important;flex:0 0 264px!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:2/3!important;object-fit:cover!important;border-radius:12px!important;overflow:hidden!important}
[data-discover] .ct259-media-copy,[data-discover] .ct257-media-copy,[data-discover] .ct255-media-copy{display:flex!important;flex-direction:column!important;width:100%!important;min-height:80px!important;height:auto!important;padding:9px 3px 0!important;white-space:normal!important;overflow:visible!important}
@media(max-width:700px){[data-discover] .ct259-media-card,[data-discover] .ct257-media-card,[data-discover] .ct255-media-card,.ct263-discover-card{flex-basis:154px!important;width:154px!important;min-width:154px!important;max-width:154px!important;min-height:306px!important}[data-discover] .ct259-media-card>button,[data-discover] .ct257-media-card>button,[data-discover] .ct255-media-card>button,.ct263-discover-card>button{min-height:306px!important}[data-discover] .ct259-media-poster,[data-discover] .ct257-media-poster,[data-discover] .ct255-media-poster{flex-basis:231px!important;width:154px!important;min-width:154px!important;max-width:154px!important;height:231px!important;min-height:231px!important;max-height:231px!important}}
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
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.54',revision:'r263-official-1.0.54',base:'r262-official-1.0.53',scope:'user-ground-truth-home-detail-discover-sports-f1',home:'vertical-list-only-no-carousel',detail:'local-x-seasons-season-graphs-similar-only',discover:'all-tabs-local-x-standard-2x3',sports:'canonical-watch-rpc+fresh-f1-jolpica-sync',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v262.js'),{force:true}),rm(resolve(dist,'app-v262.css'),{force:true})]);
console.log('WEB_1_0_54_READY r263 user ground truth home detail discover sports f1');
