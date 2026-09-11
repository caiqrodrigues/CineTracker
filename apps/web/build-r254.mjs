import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r254 deliberately rebuilds from r252, the last source-aligned visual baseline.
   r253 is not imported: the user's production video proved its renderer composition wrong. */
await import('./build-r252-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v252.js'),'utf8'),
 readFile(resolve(dist,'app-v252.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r254-video-ground-truth.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r254 missing '+label)};
for(const x of["window.__ctR252='source-ui-recovery-logic-only'","window.__ctR248='current-following-complete-ui-authority'","window.__ctR248F1='jolpica-six-tabs-persistent-collapse'","window.__ctR238='real-r180-profile-renderer'"])must(js,x,x);
for(const x of["window.__ctR254='video-ground-truth-home-discover-sports-scroll'","window.__ctR254Home='live-aired-frontier-nonlegacy+legacy-last-aired-only'","window.__ctR254Discover='atomic-tabs-cached-exclusions-time-bounded'","window.__ctR254Sports='inner-root-four-tabs-canonical-history'","window.__ctR254Horizontal='dynamic-local-rails-no-page-x'","window.__ctR254F1='r248-hub-relocated-inside-sports'"])must(runtime,x,x);

const r239Observer="try{new MutationObserver(queue239).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}";
const r247Observer="try{new MutationObserver(()=>queue247(false,35)).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}";
must(js,r239Observer,'r239 perpetual observer');must(js,r247Observer,'r247 perpetual observer');
js=js.replace(r239Observer,"window.__ctR254LegacyR239ObserverDisabled=true;").replace(r247Observer,"window.__ctR254LegacyR247ObserverDisabled=true;");

const r252QueueWrap="try{if(typeof ct176SetQueue==='function'){const base=ct176SetQueue;ct176SetQueue=function(mediaId,queue){const pair=base.apply(this,arguments);try{const row=(homeCache?.series||[]).find(x=>n(x?.media_id||x?.mediaId)===n(mediaId));if(row)classifySeries(row,pair||{queue},new Date())}catch(_){}return pair}}}catch(_){}";
const r252PaintWrap="try{if(typeof paintHome==='function'){const base=paintHome;paintHome=function(){reconcileHome252();return base.apply(this,arguments)}}}catch(_){}";
must(js,r252QueueWrap,'r252 queue classifier');must(js,r252PaintWrap,'r252 paint classifier');
js=js.replace(r252QueueWrap,"window.__ctR254R252QueueClassifierDisabled=true;").replace(r252PaintWrap,"window.__ctR254R252PaintClassifierDisabled=true;");

if(!js.includes('\nboot();'))throw new Error('r254 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r252-official-1.0.43';","const REVISION='r254-official-1.0.45';")
 .replace("window.__ctWebBuild='1.0.43';window.__ctOfficialVersion='1.0.43';","window.__ctWebBuild='1.0.45';window.__ctOfficialVersion='1.0.45';")
 .replaceAll('CineTracker • v1.0.43','CineTracker • v1.0.45')
 .replaceAll("JSON.stringify({version:'1.0.43',revision:REVISION","JSON.stringify({version:'1.0.45',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.45 r254 — video-ground-truth layout recovery. */
html,body,#app{max-width:100%!important;overflow-x:clip!important}
.ct254-xrail{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:auto!important;scrollbar-gutter:stable!important}
.ct254-xrail::-webkit-scrollbar{height:9px!important}.ct254-xrail::-webkit-scrollbar-thumb{background:rgba(139,199,230,.58)!important;border-radius:999px!important}.ct254-xrail::-webkit-scrollbar-track{background:rgba(8,28,39,.5)!important;border-radius:999px!important}
.ct254-sports-tabs,.ct254-discover-tabs{display:flex!important;gap:8px!important;max-width:100%!important;overflow-x:auto!important;white-space:nowrap!important}
.ct254-event-actions{margin-top:10px;display:flex;justify-content:flex-end}.ct254-event-actions .btn.on{opacity:.88}
.ct254-discover-status{margin-left:auto;color:#8cb0c2;font-size:9px;align-self:center}
[data-ct254-discover-content]{min-width:0;min-height:120px}[data-ct254-discover-content]>.row,[data-ct254-discover-content] .row{max-width:100%;overflow-x:auto!important}
[data-ct254-sports]{min-width:0!important;max-width:100%!important}[data-ct254-sports]>.ct248-f1hub{width:100%!important;max-width:100%!important;margin:0 0 14px!important}
.app[data-page="sports"]>.ct248-f1hub{display:none!important}
.ct169-season-chart-carousel.ct254-xrail>*,.ct169-chart-scroll.ct254-xrail>*,.ct244-chart-scroll.ct254-xrail>*,[data-chart].ct254-xrail>*,[data-episode-chart].ct254-xrail>*{flex-shrink:0}
`;
html=html.replaceAll('r252-official-1.0.43','r254-official-1.0.45').replace(/app-v252\.js/g,'app-v254.js').replace(/app-v252\.css/g,'app-v254.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r254 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.45-r254';").replace(/app-v252\.js/g,'app-v254.js').replace(/app-v252\.css/g,'app-v254.css');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v254.js'),js,'utf8'),writeFile(resolve(dist,'app-v254.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.45',revision:'r254-official-1.0.45',base:'r252-official-1.0.43',scope:'web-video-ground-truth-home-discover-sports-scroll',home:'initial-canonical+nonlegacy-live-last-episode-to-air+legacy-actual-aired-frontier-no-backlog',discover:'atomic-content-switch+cached-user-exclusions+bounded-requests+nine-tabs',sports:'inner-content-root+four-tabs+canonical-history+f1-relocated',sports_rpc:'cinetracker_sports_payload_v1',profile:'approved-layout+live-r2-payload+live-sports-stats',horizontal:'dynamic-local-rail-observer+page-x-clipped',disabled_authorities:['r239-perpetual-observer','r247-perpetual-observer','r252-age-home-classifier'],android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v252.js'),{force:true}),rm(resolve(dist,'app-v252.css'),{force:true})]);
console.log('WEB_1_0_45_READY r254 video-ground-truth android=unchanged');
