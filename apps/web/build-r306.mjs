import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r305.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,oldRuntime,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v305.js'),'utf8'),readFile(resolve(dist,'app-v305.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r305-final.js'),'utf8'),readFile(resolve(root,'runtime-r306-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r306 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.96';window.__ctOfficialVersion='1.0.96';","const REVISION='r305-official-1.0.96';",oldRuntime,'\nboot();'])must(js,x);
for(const x of["window.__ctR306={",'Grid de Largada','Resultado de Chegada','ct306-sports-sync','removeDrivers306','stableProfile306','persistAction306'])must(runtime,x);

/* Remove the broken r305 authority entirely. */
js=js.replace(oldRuntime,'');
if(js.startsWith('(()=>{if(window.__ctR305EarlyCapture')){const end=js.indexOf('})();\n');if(end>=0)js=js.slice(end+5)}
if(js.includes("window.__ctR305Final='canonical-first-paint+overlay-hit-actions+provider-sync+stable-profile'"))throw new Error('r306 failed to retire r305 runtime');

/* r299 may decorate Profile once with the renderer, but delayed rewrites are forbidden in r306. */
js=js.replace('for(const ms of[160,420,900])setTimeout(decorateProfile299,ms);','queueMicrotask(decorateProfile299);');
js=js.replace('function reconcile299(){for(const ms of[0,180,500,1100,2200])setTimeout(()=>{decorateProfile299();scrubStadiumNames()},ms)}','function reconcile299(){decorateProfile299();scrubStadiumNames()}');
js=js.replace('for(const ms of[0,350,1200])setTimeout(reconcile299,ms);','queueMicrotask(reconcile299);');

/* Keep the already-retired legacy Profile authorities retired. */
for(const x of['function styleWatchlistStats300(){return false}','function stabilizeProfile301(){return false}','function enforceSportsTabs300(activateNext=true){return true}'])must(js,x);

/*
 * A dormant browser-test bridge is compiled into the exact production bundle.
 * It is inert unless a test explicitly calls setTestBridge(), so production
 * execution continues through the same canonical handlers and data functions.
 * This avoids mutating app-v306.js while Chromium is loading it.
 */
runtime=runtime
 .replace("if(typeof go==='function'){go(mediaRoute(m.type,m.id));return true}","if(typeof window.__ctR306TestBridge?.go==='function'){window.__ctR306TestBridge.go(mediaRoute(m.type,m.id));return true}\n    if(typeof go==='function'){go(mediaRoute(m.type,m.id));return true}")
 .replace("try{if(typeof go==='function'){go(`/person/${id}`);return true}history.pushState({},'',`/person/${id}`);window.dispatchEvent(new PopStateEvent('popstate'));return true}catch{return false}","try{if(typeof window.__ctR306TestBridge?.go==='function'){window.__ctR306TestBridge.go(`/person/${id}`);return true}if(typeof go==='function'){go(`/person/${id}`);return true}history.pushState({},'',`/person/${id}`);window.dispatchEvent(new PopStateEvent('popstate'));return true}catch{return false}")
 .replace("if(typeof addWatchlist==='function')await addWatchlist(m.type,m.id)","if(typeof window.__ctR306TestBridge?.addWatchlist==='function')await window.__ctR306TestBridge.addWatchlist(m.type,m.id)\n      else if(typeof addWatchlist==='function')await addWatchlist(m.type,m.id)")
 .replace("if(typeof markSeen==='function')await markSeen(m.type,m.id)","if(typeof window.__ctR306TestBridge?.markSeen==='function')await window.__ctR306TestBridge.markSeen(m.type,m.id)\n      else if(typeof markSeen==='function')await markSeen(m.type,m.id)")
 .replace("window.__ctR306={stabilize:stabilize306,openRace:openF1Race306,syncSports:syncSports306,version:'1.0.97',lifecycle:'pre-boot-renderer-hooks-no-delayed-reconcile'}","window.__ctR306={stabilize:stabilize306,openRace:openF1Race306,syncSports:syncSports306,openMedia:openMedia306,openPerson:openPerson306,persistAction:persistAction306,setTestBridge(bridge){window.__ctR306TestBridge=bridge&&typeof bridge==='object'?bridge:null},version:'1.0.97',lifecycle:'pre-boot-renderer-hooks-no-delayed-reconcile'}");
for(const x of['__ctR306TestBridge','setTestBridge(bridge)','openMedia:openMedia306','openPerson:openPerson306','persistAction:persistAction306'])must(runtime,x);

js=js.replace("window.__ctWebBuild='1.0.96';window.__ctOfficialVersion='1.0.96';","window.__ctWebBuild='1.0.97';window.__ctOfficialVersion='1.0.97';")
 .replace("const REVISION='r305-official-1.0.96';","const REVISION='r306-official-1.0.97';")
 .replace('\nboot();',()=>`\n${runtime}\nboot();`);

css+=String.raw`
/* CineTracker Web 1.0.97 r306 — canonical modal/F1/Sports/Profile authority. */
.ct305-sports-refresh{display:none!important}
`;
html=html.replaceAll('app-v305.js','app-v306.js').replaceAll('app-v305.css','app-v306.css').replaceAll('CineTracker • v1.0.96','CineTracker • v1.0.97');
sw=sw.replaceAll('ct-web-1.0.96-r305','ct-web-1.0.97-r306').replaceAll('app-v305.js','app-v306.js').replaceAll('app-v305.css','app-v306.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.97',revision:'r306-official-1.0.97',base:'r305-production',scope:'canonical-modal-f1-sports-profile-stability-web-only',related_titles_open:true,related_watchlist_action:true,related_seen_action:true,actors_open:true,main_modal_watchlist_seen:true,top10_viewport_compact:true,f1_drivers_tab:false,f1_calendar_interactive:true,f1_grid_start:true,f1_finish_result:true,sports_tabs:'next+previous+favorites+watched',sports_menu_below_f1:true,sports_manual_refresh:true,sports_refresh_in_header:true,sports_provider_resync:true,profile_stats_preserved:true,profile_layout_switching:false,profile_watchlist_open_signal:false,profile_actor_cards_uniform:true,profile_actor_scroll_local:true,r305_runtime_removed:true,r299_delayed_profile_rewrite:false,r306_pre_boot:true,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v306.js'),js),writeFile(resolve(dist,'app-v306.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v305.js'),{force:true}),rm(resolve(dist,'app-v305.css'),{force:true})]);
console.log('WEB_R306_READY canonical interactions + F1 grid/results + Sports header sync + stable Profile; Android preserved');
