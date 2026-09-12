import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r257 composes the proven r256 layout/cache fixes and replaces only the remaining video-ground-truth semantics. */
await import('./build-r256-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v256.js'),'utf8'),
  readFile(resolve(dist,'app-v256.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r257-sequence-scroll-discover-f1-grid.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r257 missing '+label)};
for(const x of[
  "window.__ctR256='video-ground-truth-scroll-discover-sports-profile-cache'",
  "window.__ctR256Home='missing-wins-caught-up+live-frontier+stale-while-revalidate'",
  "window.__ctR256Horizontal='persistent-childlist-episode-season-chart-related-cast'",
  "const REVISION='r256-official-1.0.47';"
])must(js,x,x);
for(const x of[
  "window.__ctR257='exact-sequence-discover-personal-exclusions-horizontal-drag-f1-grid'",
  "window.__ctR257Home='exact-watched-set+next-aired-after-frontier+historic-holes-ignored'",
  "window.__ctR257Discover='fail-closed-personal-state+complete-public-pools+poster-cards'",
  "window.__ctR257Horizontal='persistent-rails+pointer-drag+discover-tabs-details-cast'",
  "window.__ctR257F1='weekend-sessions+next-qualifying-grid+previous-start-finish-grid'"
])must(runtime,x,x);
if(!js.includes('\nboot();'))throw new Error('r257 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r256-official-1.0.47';","const REVISION='r257-official-1.0.48';")
 .replace("window.__ctWebBuild='1.0.47';window.__ctOfficialVersion='1.0.47';","window.__ctWebBuild='1.0.48';window.__ctOfficialVersion='1.0.48';")
 .replaceAll('CineTracker • v1.0.47','CineTracker • v1.0.48')
 .replaceAll("JSON.stringify({version:'1.0.47',revision:REVISION","JSON.stringify({version:'1.0.48',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.48 r257 — exact sequence + Android horizontal drag + F1 race weekend. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}
.ct257-local-x,.ct257-drag-x{box-sizing:border-box!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important;cursor:grab!important}
.ct257-local-x.ct257-dragging,.ct257-drag-x.ct257-dragging{cursor:grabbing!important;user-select:none!important}
.ct257-local-x::-webkit-scrollbar,.ct257-drag-x::-webkit-scrollbar{height:9px!important}.ct257-local-x::-webkit-scrollbar-thumb,.ct257-drag-x::-webkit-scrollbar-thumb{background:rgba(92,184,232,.72)!important;border-radius:999px!important}.ct257-local-x::-webkit-scrollbar-track,.ct257-drag-x::-webkit-scrollbar-track{background:rgba(5,22,31,.82)!important;border-radius:999px!important}
.ct257-discover-tabs,.ct257-discover-types{display:flex!important;flex-flow:row nowrap!important;gap:8px!important;width:100%!important;padding-bottom:9px!important}.ct257-discover-tabs>* ,.ct257-discover-types>*{flex:0 0 auto!important;white-space:nowrap!important}
.ct257-loading-inline{position:absolute!important;right:18px!important;z-index:4!important;padding:5px 9px!important;border:1px solid #315f78!important;border-radius:999px!important;background:#0c2b3d!important;color:#9ed7f5!important;font-size:9px!important}.ct257-skeleton{padding:18px!important;color:#819dab!important}
/* r256 card geometry stays authoritative; r257 guarantees a horizontal rail containing all eligible rows. */
.ct257-media-rail{display:flex!important;flex-flow:row nowrap!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important}.ct257-media-card{flex:none!important}
.ct257-f1-overview{display:grid!important;gap:14px!important}.ct257-f1-section{display:grid!important;gap:9px!important;padding:12px!important;border-radius:14px!important;background:#081c27!important;border:1px solid rgba(66,132,166,.34)!important}.ct257-f1-section h3,.ct257-f1-section h4,.ct257-f1-section p{margin:0!important}.ct257-f1-section>small,.ct257-f1-section>p{color:#89aaba!important;font-size:10px!important}
.ct257-f1-sessions{display:flex!important;flex-flow:row nowrap!important;gap:8px!important;width:100%!important;padding:2px 0 9px!important}.ct257-f1-sessions article{flex:0 0 170px!important;padding:10px!important;border-radius:11px!important;background:#0a2735!important;display:grid!important;gap:5px!important}.ct257-f1-sessions small{color:#80a9bd!important}.ct257-f1-sessions b{font-size:10px!important}
.ct257-f1-grid{display:flex!important;flex-flow:row nowrap!important;gap:8px!important;width:100%!important;padding:3px 0 10px!important}.ct257-f1-grid article{flex:0 0 205px!important;min-width:205px!important;padding:10px!important;border-radius:11px!important;background:#0a2735!important;border:1px solid rgba(67,135,170,.28)!important;display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;gap:4px 8px!important;align-items:center!important}.ct257-f1-grid article>b{grid-row:1/4!important;font-size:12px!important;color:#8fd3f5!important}.ct257-f1-grid article>span{font-weight:800!important;font-size:10px!important}.ct257-f1-grid article>small{color:#8caaba!important;font-size:9px!important}.ct257-f1-grid article>em{font-style:normal!important;color:#dbeef7!important;font-size:9px!important}
@media(max-width:700px){.ct257-f1-sessions article{flex-basis:155px!important}.ct257-f1-grid article{flex-basis:190px!important;min-width:190px!important}}
`;

html=html.replaceAll('r256-official-1.0.47','r257-official-1.0.48').replace(/app-v256\.js/g,'app-v257.js').replace(/app-v256\.css/g,'app-v257.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r257 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.48-r257';").replace(/app-v256\.js/g,'app-v257.js').replace(/app-v256\.css/g,'app-v257.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v257.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v257.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.48',revision:'r257-official-1.0.48',base:'r256-official-1.0.47',scope:'exact-sequence-discover-personal-exclusions-horizontal-drag-f1-grid',home:'exact-watched-set+next-aired-after-frontier+historic-holes-ignored',discover:'fail-closed-personal-state+complete-multipage-public-pools+poster-cards',horizontal:'persistent-rails+pointer-drag+discover-tabs+details+cast',f1:'weekend-sessions+next-qualifying-grid+previous-start-finish-grid',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v256.js'),{force:true}),rm(resolve(dist,'app-v256.css'),{force:true})]);
console.log('WEB_1_0_48_READY r257 exact-sequence discover-scroll f1-grid');
