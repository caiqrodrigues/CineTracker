import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r248-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,authority]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v248.js'),'utf8'),
 readFile(resolve(dist,'app-v248.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r249-single-authority.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r249 missing '+label)};
for(const m of [
 "window.__ctR248='current-following-complete-ui-authority'",
 "window.__ctR248Binding='sports-f1-current-runtime-binding'",
 "window.__ctR248Following='mixed-backlog-new-release-and-sports-series'",
 "window.__ctR248DiscoverFinal='content-only-tabs-stable-cards-personal-rules'"
])must(js,m,m);
for(const m of [
 "window.__ctR249='single-authority-current-ui'",
 "window.__ctR249Following='watched-frontier-new-release-wins'",
 "window.__ctR249Discover='atomic-latest-request-generation'",
 "window.__ctR249Sports='canonical-four-tabs-no-legacy-rpc'",
 "window.__ctR249Profile='single-statistics-owner'",
 "window.__ctR249Horizontal='local-x-only-global-x-clipped'"
])must(authority,m,m);

/* Keep the useful one-shot r248 setup/listeners, but do not attach either perpetual observer. */
const currentObserver='observer.observe(document.documentElement,{childList:true,subtree:true});';
const bindingObserver="let raf=0;new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(cleanLegacy)}).observe(document.documentElement,{subtree:true,childList:true});";
const r248At=js.indexOf("window.__ctR248='current-following-complete-ui-authority'");
if(r248At<0)throw new Error('r249 cannot locate r248 authority');
let before=js.slice(0,r248At),after=js.slice(r248At);
must(after,currentObserver,'r248 current-ui perpetual observer');
after=after.replace(currentObserver,"window.__ctR249LegacyCurrentObserverDisabled=true;");
must(after,bindingObserver,'r248 state-binding perpetual observer');
after=after.replace(bindingObserver,"let raf=0;window.__ctR249LegacyBindingObserverDisabled=true;");
js=before+after;

/* r247 captured the working pre-r247 Sports payload in legacyPayload247, but then replaced it
   with calls to an RPC that does not exist in production. Reconnect r247 to that captured
   canonical payload instead of renaming or hiding the invalid RPC. */
const r247Payload=/async function payload247\(\)\{[\s\S]*?\n\}\nfunction filtered247\(rows\)\{/;
if(!r247Payload.test(js))throw new Error('r249 cannot locate inherited r247 sports payload');
js=js.replace(r247Payload,`async function payload247(){
 let tab='next';try{tab=String(sportsState.tab||'next')}catch{}if(!sportKeys247.has(tab))tab='next';
 const legacyKey=({next:'today',previous:'recent',favorites:'favorites',watched:legacyWatchedKey247})[tab]||tab;
 return withLegacyPayload247(legacyKey);
}
function filtered247(rows){`);

/* Home sports-series bridge consumes the same current Sports authority. */
const followingRpc="typeof rpc==='function'?await rpc('cinetracker_sports_events_v0997',{p_scope:'month',p_limit:240,p_offset:0,p_favorite_only:false}):[]";
must(js,followingRpc,'r248 following sports RPC');
js=js.replace(followingRpc,"typeof window.__ctR249SportsRows==='function'?await window.__ctR249SportsRows():[]");
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('r249 legacy sports RPC survived');

js=js.replace("const REVISION='r248-official-1.0.39';","const REVISION='r249-official-1.0.40';")
 .replace("window.__ctWebBuild='1.0.39';window.__ctOfficialVersion='1.0.39';","window.__ctWebBuild='1.0.40';window.__ctOfficialVersion='1.0.40';")
 .replaceAll('CineTracker • v1.0.39','CineTracker • v1.0.40')
 .replaceAll("JSON.stringify({version:'1.0.39',revision:REVISION","JSON.stringify({version:'1.0.40',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r249 boot insertion point missing');
js=js.replace('\nboot();','\n'+authority+'\nboot();');

css+=`\n/* CineTracker Web 1.0.40 r249 — single owner, local horizontal overflow only */
html,body,#app{max-width:100%!important;overflow-x:clip!important}html,body{overflow-y:auto!important}
.ct249-xrail{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct249-xrail::-webkit-scrollbar{height:9px!important}.ct249-xrail::-webkit-scrollbar-thumb{background:rgba(139,199,230,.58)!important;border-radius:999px!important}.ct249-xrail::-webkit-scrollbar-track{background:rgba(8,28,39,.5)!important;border-radius:999px!important}
.ct249-sports-tabs{display:flex!important;gap:8px!important;overflow-x:auto!important;overflow-y:hidden!important;margin:8px 0 14px!important}.ct247-sport-tabs{display:none!important}
.ct249-discover-card{animation:none!important;transform:none!important;overflow-anchor:none!important}
`;

html=html.replaceAll('r248-official-1.0.39','r249-official-1.0.40').replace(/app-v\d+\.js/g,'app-v249.js').replace(/app-v\d+\.css/g,'app-v249.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r249 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.40-r249';").replace(/app-v\d+\.js/g,'app-v249.js').replace(/app-v\d+\.css/g,'app-v249.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v249.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v249.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({
  version:'1.0.40',revision:'r249-official-1.0.40',base:'r248-official-1.0.39',scope:'web-single-current-ui-authority',
  home:'watched-frontier+new-release-wins+historical-backlog-stays-unwatched',
  discover:'latest-request-generation+tab-type-owner+canonical-personal-exclusions+30-day-new',
  sports_tabs:['Próximos','Anteriores','Favoritos','Assistidos'],sports_rpc:'canonical-captured-payload-no-v0997-rpc',sports_next:'today-future-only',sports_previous:'D-1-through-D-3',sports_favorites:'favorite-only',sports_watched:'watched-only',
  f1:'six-tabs+Brasilia-time+persistent-user-collapse',profile:'single-statistics-owner',global_horizontal_scroll:'disabled',vertical_page_scroll:'preserved',local_horizontal_scrollbars:'visible',legacy_perpetual_observers:'disabled',android:'unchanged-1.0.20',generated_at:new Date().toISOString()
 },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v248.js'),{force:true}),rm(resolve(dist,'app-v248.css'),{force:true})]);
console.log('WEB_1_0_40_READY r249 single-authority android=unchanged');
