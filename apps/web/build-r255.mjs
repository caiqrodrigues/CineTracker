import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r255 deliberately composes from r252, the last approved source-aligned visual baseline.
   r253/r254 direct renderers are not imported; r255 owns only the corrected surfaces. */
await import('./build-r252-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v252.js'),'utf8'),
  readFile(resolve(dist,'app-v252.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r255-discover-cards-home-sports-profile.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r255 missing '+label)};
for(const x of[
  "window.__ctR252='source-ui-recovery-logic-only'",
  "window.__ctR248='current-following-complete-ui-authority'",
  "window.__ctR248F1='jolpica-six-tabs-persistent-collapse'",
  "window.__ctR238='real-r180-profile-renderer'"
])must(js,x,x);
for(const x of[
  "window.__ctR255='discover-cards-home-buckets-sports-f1-profile-live'",
  "window.__ctR255Home='backend-buckets-conservative-live-release+rich-movies'",
  "window.__ctR255Discover='poster-first-nine-tabs-full-watchlist-atomic'",
  "window.__ctR255Sports='five-tabs-dark-cards-f1-six-approved-tabs'",
  "window.__ctR255Profile='approved-layout-canonical-sports-values'"
])must(runtime,x,x);

/* Retire the remaining perpetual r239 DOM authority and the two r252 age-only Home wrappers. */
const r239Observer="try{new MutationObserver(queue239).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}";
const r252QueueWrap="try{if(typeof ct176SetQueue==='function'){const base=ct176SetQueue;ct176SetQueue=function(mediaId,queue){const pair=base.apply(this,arguments);try{const row=(homeCache?.series||[]).find(x=>n(x?.media_id||x?.mediaId)===n(mediaId));if(row)classifySeries(row,pair||{queue},new Date())}catch(_){}return pair}}}catch(_){}";
const r252PaintWrap="try{if(typeof paintHome==='function'){const base=paintHome;paintHome=function(){reconcileHome252();return base.apply(this,arguments)}}}catch(_){}";
must(js,r239Observer,'r239 observer');must(js,r252QueueWrap,'r252 queue classifier');must(js,r252PaintWrap,'r252 paint classifier');
js=js.replace(r239Observer,"window.__ctR255LegacyR239ObserverDisabled=true;")
     .replace(r252QueueWrap,"window.__ctR255R252QueueClassifierDisabled=true;")
     .replace(r252PaintWrap,"window.__ctR255R252PaintClassifierDisabled=true;");

if(!js.includes('\nboot();'))throw new Error('r255 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r252-official-1.0.43';","const REVISION='r255-official-1.0.46';")
 .replace("window.__ctWebBuild='1.0.43';window.__ctOfficialVersion='1.0.43';","window.__ctWebBuild='1.0.46';window.__ctOfficialVersion='1.0.46';")
 .replaceAll('CineTracker • v1.0.43','CineTracker • v1.0.46')
 .replaceAll("JSON.stringify({version:'1.0.43',revision:REVISION","JSON.stringify({version:'1.0.46',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.46 r255 — video-ground-truth visual + data authority. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}body,.app,.content,.page,[data-home],[data-discover],[data-sports],[data-profile]{min-width:0!important;max-width:100%!important}
.ct248-sports-tabs,.ct247-sport-tabs,.ct248-f1hub{display:none!important}
.ct255-local-x{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct255-local-x::-webkit-scrollbar{height:8px!important}.ct255-local-x::-webkit-scrollbar-thumb{background:rgba(88,175,224,.58)!important;border-radius:999px!important}.ct255-local-x::-webkit-scrollbar-track{background:rgba(6,25,35,.72)!important;border-radius:999px!important}
.ct255-media-rail{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:minmax(148px,176px)!important;gap:12px!important;align-items:stretch!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 10px!important;scroll-snap-type:x proximity!important}
.ct255-media-card{min-width:0!important;border:1px solid rgba(49,95,120,.78)!important;background:#071721!important;border-radius:14px!important;overflow:hidden!important;scroll-snap-align:start!important;box-shadow:0 8px 24px rgba(0,0,0,.16)!important}
.ct255-media-card>button{display:block!important;width:100%!important;border:0!important;padding:0!important;background:transparent!important;color:#eef8fc!important;text-align:left!important;cursor:pointer!important}
.ct255-media-poster{display:block!important;width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important;background:#0b1e29!important}.ct255-poster-empty{display:grid!important;place-items:center!important;color:#648496!important;font-size:10px!important}
.ct255-media-copy{padding:10px!important;display:grid!important;gap:5px!important}.ct255-media-copy b{font-size:12px!important;line-height:1.28!important}.ct255-media-copy small{color:#88a7b8!important;font-size:9px!important;line-height:1.35!important;min-height:24px!important}.ct255-media-copy span{color:#80c7ee!important;font-size:9px!important;font-weight:800!important}
.ct255-discover-block{overflow:hidden!important}.ct255-discover-tabs,.ct255-discover-types{scrollbar-width:thin!important}.ct255-loading-inline{position:absolute!important;right:18px!important;margin-top:4px!important;z-index:3!important;padding:5px 9px!important;border-radius:999px!important;background:#0c2b3d!important;border:1px solid #315f78!important;color:#9ed7f5!important;font-size:9px!important}.ct255-skeleton-rail{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:minmax(148px,176px)!important;gap:12px!important;overflow:hidden!important}.ct255-skeleton-card{aspect-ratio:2/3!important;border-radius:14px!important;background:linear-gradient(110deg,#081923 25%,#102d3d 42%,#081923 58%)!important;background-size:220% 100%!important;animation:ct255Shimmer 1.3s linear infinite!important}@keyframes ct255Shimmer{to{background-position:-220% 0}}
.ct255-home-movie-card{width:100%!important;max-width:100%!important;min-width:0!important;border:1px solid #214b62!important;background:#071721!important;border-radius:14px!important;overflow:hidden!important}.ct255-home-movie-card>button{display:grid!important;grid-template-columns:72px minmax(0,1fr) auto!important;gap:12px!important;align-items:center!important;width:100%!important;max-width:100%!important;border:0!important;background:transparent!important;color:#eef8fc!important;text-align:left!important;padding:9px!important}.ct255-home-movie-card img,.ct255-home-movie-poster{display:block!important;width:72px!important;height:104px!important;border-radius:9px!important;object-fit:cover!important;background:#0b1e29!important}.ct255-home-movie-card b{display:block!important;font-size:12px!important;margin-bottom:7px!important}.ct255-home-movie-card small{display:block!important;color:#8ba8b7!important;font-size:9px!important;line-height:1.5!important}.ct255-home-movie-card>button>span{color:#71c5ef!important;font-size:20px!important}
.ct255-sports-tabs{display:flex!important;gap:8px!important;width:100%!important;overflow-x:auto!important;padding:2px 0 9px!important}.ct255-sports-tab,.ct255-f1-tab,.ct255-watch,.ct255-f1-head button{border:1px solid #2f6886!important;background:#081923!important;color:#b9deef!important;border-radius:11px!important;padding:8px 12px!important;white-space:nowrap!important;cursor:pointer!important}.ct255-sports-tab.active,.ct255-f1-tab.active{background:#0d3c58!important;border-color:#59b5e6!important;color:#fff!important;box-shadow:inset 0 0 0 1px rgba(89,181,230,.18)!important}.ct255-sport-filters{display:flex!important;gap:7px!important;overflow-x:auto!important;padding:0 0 12px!important}
.ct255-f1hub{border:1px solid rgba(70,144,181,.42)!important;border-radius:18px!important;padding:14px!important;background:linear-gradient(145deg,#06141d,#0a2533)!important;overflow:hidden!important}.ct255-f1-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important}.ct255-f1-head>div{display:flex!important;align-items:baseline!important;gap:9px!important}.ct255-f1-head span{font-size:17px!important}.ct255-f1-head b{font-size:14px!important}.ct255-f1-tabs{display:flex!important;gap:8px!important;overflow-x:auto!important;padding:13px 0!important}.ct255-f1-content{min-height:110px!important}.ct255-f1-hero{padding:14px!important;border-radius:14px!important;background:#0a202c!important;display:grid!important;gap:6px!important}.ct255-f1-hero h3{margin:0!important;font-size:18px!important}.ct255-f1-hero p{margin:0!important;color:#9bb9c9!important}.ct255-f1-summary{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:9px!important;margin-top:10px!important}.ct255-f1-summary>div{padding:10px!important;border-radius:12px!important;background:#0a202c!important;display:grid!important;gap:4px!important}.ct255-f1-summary small{color:#8caaba!important}.ct255-f1-list{display:flex!important;gap:10px!important;overflow-x:auto!important}.ct255-f1-list article{min-width:220px!important;padding:11px!important;border-radius:12px!important;background:#0a202c!important;display:grid!important;gap:5px!important}.ct255-f1-list span,.ct255-f1-list small{color:#9ab4c3!important}.ct255-f1-table{display:grid!important;gap:6px!important}.ct255-f1-table>div{display:grid!important;grid-template-columns:52px minmax(150px,1fr) auto!important;gap:8px!important;padding:8px 10px!important;border-radius:10px!important;background:#0a202c!important}.ct255-f1-two{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}.ct255-f1-two section{background:#0a202c!important;border-radius:12px!important;padding:11px!important}.ct255-f1-two h3{margin-top:0!important}.ct255-f1-two p{display:grid!important;grid-template-columns:26px minmax(0,1fr) auto!important;gap:5px!important;margin:5px 0!important;font-size:10px!important}
.ct255-sports-feed{overflow:hidden!important}.ct255-sport-grid{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:minmax(280px,340px)!important;gap:11px!important;width:100%!important;overflow-x:auto!important;padding:2px 2px 10px!important}.ct255-sport-card{border:1px solid #254e64!important;background:#071721!important;border-radius:15px!important;padding:13px!important;display:grid!important;gap:10px!important}.ct255-sport-card.live{border-color:#a64d64!important}.ct255-sport-top{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:8px!important;color:#8eacbb!important;font-size:9px!important}.ct255-sport-top b{border:1px solid #315f78!important;border-radius:999px!important;padding:4px 7px!important;color:#a9d9f0!important}.ct255-match{display:grid!important;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)!important;gap:9px!important;align-items:center!important}.ct255-match>div{text-align:center!important;min-width:0!important}.ct255-match img{display:block!important;width:48px!important;height:48px!important;object-fit:contain!important;margin:0 auto 6px!important}.ct255-match strong{font-size:11px!important}.ct255-match em{font-style:normal!important;font-size:20px!important;font-weight:900!important}.ct255-sport-card>small{color:#819dab!important}.ct255-watch{width:100%!important;margin-top:4px!important;background:#0b2b3d!important}.ct255-watch.on{border-color:#c8aa55!important;color:#efd98b!important;background:#28210f!important}
@media(max-width:700px){.ct255-media-rail,.ct255-skeleton-rail{grid-auto-columns:minmax(142px,158px)!important}.ct255-f1-summary{grid-template-columns:1fr!important}.ct255-f1-two{grid-template-columns:1fr!important}.ct255-sport-grid{grid-auto-columns:minmax(270px,88vw)!important}.ct255-home-movie-card>button{grid-template-columns:66px minmax(0,1fr) auto!important}.ct255-home-movie-card img,.ct255-home-movie-poster{width:66px!important;height:98px!important}}
`;

html=html.replaceAll('r252-official-1.0.43','r255-official-1.0.46').replace(/app-v252\.js/g,'app-v255.js').replace(/app-v252\.css/g,'app-v255.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r255 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.46-r255';").replace(/app-v252\.js/g,'app-v255.js').replace(/app-v252\.css/g,'app-v255.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v255.js'),js,'utf8'),writeFile(resolve(dist,'app-v255.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.46',revision:'r255-official-1.0.46',base:'r252-official-1.0.43',scope:'video-ground-truth-discover-home-sports-profile',home:'backend-buckets+conservative-live-release+movie-metadata',discover:'poster-first-nine-tabs+full-watchlist+atomic-content',sports_tabs:['Próximos','Ao vivo','Anteriores','Favoritos','Assistidos'],f1_tabs:['Visão geral','Calendário','Classificações','Pilotos','Equipes','Circuitos'],profile:'approved-layout+canonical-sport-stats',horizontal:'component-only',disabled_authorities:['r239-perpetual-observer','r252-age-only-home-classifier'],android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v252.js'),{force:true}),rm(resolve(dist,'app-v252.css'),{force:true})]);
console.log('WEB_1_0_46_READY r255 discover-cards home-buckets sports-f1 profile-live');
