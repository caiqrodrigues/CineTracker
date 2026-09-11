import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/* r252 intentionally starts at the last approved source-aligned UI (r248).
   r249/r250/r251 are not imported because they replaced major renderers/markup. */
await import('./build-r248-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v248.js'),'utf8'),
 readFile(resolve(dist,'app-v248.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r252-source-ui-recovery.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r252 missing '+label)};
for(const x of[
 "window.__ctR248='current-following-complete-ui-authority'",
 "window.__ctR248Binding='sports-f1-current-runtime-binding'",
 "window.__ctR248Following='mixed-backlog-new-release-and-sports-series'",
 "window.__ctR248DiscoverFinal='content-only-tabs-stable-cards-personal-rules'"
])must(js,x,x);
for(const x of[
 "window.__ctR252='source-ui-recovery-logic-only'",
 "window.__ctR252UI='r248-native-structure-preserved'",
 "window.__ctR252Home='native-home+30-day-dust+recent-release-priority+legacy-frontier'",
 "window.__ctR252Discover='native-cards+strict-three-block-rules+seven-day-history'",
 "window.__ctR252F1='r248-dark-six-tab-hub'",
 "window.__ctR252Profile='r248-established-stat-order'",
 "window.__ctR252Configs='immediate-shell-background-profile'"
])must(runtime,x,x);

/* Keep the one-shot r248 cleanup but remove both perpetual DOM observers. They were a major
   source of route churn and repeated work while navigating between screens. */
const currentObserver='observer.observe(document.documentElement,{childList:true,subtree:true});';
const bindingObserver="let raf=0;new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(cleanLegacy)}).observe(document.documentElement,{subtree:true,childList:true});";
const r248At=js.indexOf("window.__ctR248='current-following-complete-ui-authority'");
if(r248At<0)throw new Error('r252 cannot locate r248 authority');
let before=js.slice(0,r248At),after=js.slice(r248At);
must(after,currentObserver,'r248 current-ui observer');after=after.replace(currentObserver,"window.__ctR252LegacyCurrentObserverDisabled=true;");
must(after,bindingObserver,'r248 binding observer');after=after.replace(bindingObserver,"let raf=0;window.__ctR252LegacyBindingObserverDisabled=true;");
js=before+after;

/* r248 Home sports-series helper used an RPC retired from production. Keep its established
   renderer but feed it from the canonical r252 payload helper. */
const oldSportsSeries="typeof rpc==='function'?await rpc('cinetracker_sports_events_v0997',{p_scope:'month',p_limit:240,p_offset:0,p_favorite_only:false}):[]";
must(js,oldSportsSeries,'r248 sports-series RPC');
js=js.replace(oldSportsSeries,"typeof window.__ctR252SportsEvents==='function'?await window.__ctR252SportsEvents():[]");
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('retired sports events RPC survived r252 build');

js=js.replace("const REVISION='r248-official-1.0.39';","const REVISION='r252-official-1.0.43';")
 .replace("window.__ctWebBuild='1.0.39';window.__ctOfficialVersion='1.0.39';","window.__ctWebBuild='1.0.43';window.__ctOfficialVersion='1.0.43';")
 .replaceAll('CineTracker • v1.0.39','CineTracker • v1.0.43')
 .replaceAll("JSON.stringify({version:'1.0.39',revision:REVISION","JSON.stringify({version:'1.0.43',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r252 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');

/* No card/grid/F1/Profile redesign is added here. r248 CSS remains authoritative. */
css+='\n/* CineTracker Web 1.0.43 r252 — source UI preserved; logic-only recovery. */\n';
html=html.replaceAll('r248-official-1.0.39','r252-official-1.0.43').replace(/app-v\d+\.js/g,'app-v252.js').replace(/app-v\d+\.css/g,'app-v252.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r252 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.43-r252';").replace(/app-v\d+\.js/g,'app-v252.js').replace(/app-v\d+\.css/g,'app-v252.css');

await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v252.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v252.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
  version:'1.0.43',revision:'r252-official-1.0.43',base:'r248-official-1.0.39',scope:'web-source-ui-recovery',
  ui_authority:'r248-native-structure',direct_renderer_replacement:false,
  home:'native-layout+hidden-history-preserved+30-day-dust+recent-new-priority+legacy-frontier',
  legacy_series:['WWE Raw','WWE SmackDown','Formula 1','Super Bowl'],
  discover:'native-cards+nine-tabs+strict-filters+three-for-you-blocks+seven-day-history+no-reload-refresh',
  sports_tabs:['Próximos','Anteriores','Favoritos','Assistidos'],sports_rpc:'cinetracker_sports_payload_v1',
  f1:'r248-dark-six-tabs+persistent-user-collapse',profile:'r248-established-order',configs:'immediate-no-blocking-profile-fetch',
  global_horizontal_scroll:'disabled',local_horizontal_scrollbars:'r248',legacy_perpetual_observers:'disabled',android:'unchanged-1.0.20',generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v248.js'),{force:true}),rm(resolve(dist,'app-v248.css'),{force:true})]);
console.log('WEB_1_0_43_READY r252 source-ui-recovery android=unchanged');
