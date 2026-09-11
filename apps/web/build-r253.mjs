import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r252-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v252.js'),'utf8'),
 readFile(resolve(dist,'app-v252.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r253-single-authority-live-data.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r253 missing '+label)};
for(const x of[
 "window.__ctR252='source-ui-recovery-logic-only'",
 "window.__ctR248='current-following-complete-ui-authority'",
 "window.__ctR238='real-r180-profile-renderer'",
 "window.__ctR248F1='jolpica-six-tabs-persistent-collapse'"
])must(js,x,x);
for(const x of[
 "window.__ctR253='single-authority-live-data'",
 "window.__ctR253Home='live-payload-native-ui-no-age-only-dust'",
 "window.__ctR253Discover='single-renderer-nine-tabs-generation-safe'",
 "window.__ctR253Sports='single-renderer-four-tabs-canonical-history'",
 "window.__ctR253Profile='approved-layout-live-data-patch'",
 "window.__ctR253F1='r248-approved-hub-single-instance'"
])must(runtime,x,x);

/* Disable the r239 observer that kept re-applying old DOM authorities after every paint. */
const r239Observer="try{new MutationObserver(queue239).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}";
must(js,r239Observer,'r239 perpetual observer');
js=js.replace(r239Observer,"window.__ctR253LegacyR239ObserverDisabled=true;");

/* r252's age-only Home wrapper is the regression that moved caught-up rows to dust.
   r253 gets the canonical bucket from the live RPC and paints it without this classifier. */
const r252QueueWrap="try{if(typeof ct176SetQueue==='function'){const base=ct176SetQueue;ct176SetQueue=function(mediaId,queue){const pair=base.apply(this,arguments);try{const row=(homeCache?.series||[]).find(x=>n(x?.media_id||x?.mediaId)===n(mediaId));if(row)classifySeries(row,pair||{queue},new Date())}catch(_){}return pair}}}catch(_){}";
const r252PaintWrap="try{if(typeof paintHome==='function'){const base=paintHome;paintHome=function(){reconcileHome252();return base.apply(this,arguments)}}}catch(_){}";
must(js,r252QueueWrap,'r252 queue classifier wrapper');must(js,r252PaintWrap,'r252 paint classifier wrapper');
js=js.replace(r252QueueWrap,"window.__ctR253R252QueueClassifierDisabled=true;").replace(r252PaintWrap,"window.__ctR253R252PaintClassifierDisabled=true;");

/* Inject the single authorities after all inherited runtime layers and immediately before boot. */
if(!js.includes('\nboot();'))throw new Error('r253 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');

js=js.replace("const REVISION='r252-official-1.0.43';","const REVISION='r253-official-1.0.44';")
 .replace("window.__ctWebBuild='1.0.43';window.__ctOfficialVersion='1.0.43';","window.__ctWebBuild='1.0.44';window.__ctOfficialVersion='1.0.44';")
 .replaceAll('CineTracker • v1.0.43','CineTracker • v1.0.44')
 .replaceAll("JSON.stringify({version:'1.0.43',revision:REVISION","JSON.stringify({version:'1.0.44',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.44 r253 — single authority, existing visual system preserved. */
.ct253-sports-tabs,.ct253-discover-tabs{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin}
.ct253-event-actions{margin-top:10px;display:flex;justify-content:flex-end}
.ct253-event-actions .btn.on{opacity:.88}
[data-ct253-discover-content]>.row{max-width:100%;overflow-x:auto;scrollbar-width:thin}
`;
html=html.replaceAll('r252-official-1.0.43','r253-official-1.0.44').replace(/app-v252\.js/g,'app-v253.js').replace(/app-v252\.css/g,'app-v253.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r253 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.44-r253';").replace(/app-v252\.js/g,'app-v253.js').replace(/app-v252\.css/g,'app-v253.css');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v253.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v253.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
  version:'1.0.44',revision:'r253-official-1.0.44',base:'r252-official-1.0.43',scope:'web-single-authority-live-data',
  home:'canonical-live-payload+native-ui+hidden-history+no-age-only-dust',
  discover:'single-renderer+nine-tabs+generation-guard+native-cards+strict-three-blocks+seven-day-history',
  sports:'single-renderer+four-tabs+canonical-events-and-watch-history',sports_rpc:'cinetracker_sports_payload_v1',sports_watch_rpc:'cinetracker_sport_mark_watched_v1',
  profile:'approved-r238-order+fresh-r2-payload+live-sports-stats',f1:'approved-r248-dark-six-tabs-single-instance',
  disabled_authorities:['r239-perpetual-observer','r252-age-only-home-classifier'],
  android:'unchanged-1.0.20',generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v252.js'),{force:true}),rm(resolve(dist,'app-v252.css'),{force:true})]);
console.log('WEB_1_0_44_READY r253 single-authority-live-data android=unchanged');
