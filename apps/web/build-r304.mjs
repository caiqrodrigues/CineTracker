import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r303.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,badRuntime,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v303.js'),'utf8'),readFile(resolve(dist,'app-v303.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r303-final.js'),'utf8'),readFile(resolve(root,'runtime-r304-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r304 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.94';window.__ctOfficialVersion='1.0.94';","const REVISION='r303-official-1.0.94';",badRuntime,'data-media','data-person','watchlist','seen','function removeDrivers301','function removeDrivers302'])must(js,x);
for(const x of["window.__ctR304Final='canonical-clicks+f1-drivers-calendar+sports-sync-order+profile-layout-only'",'ensureDriversData304','ensureSportsRefresh304','refreshSports304','stabilizeProfile304'])must(runtime,x);

/* r303 captured related/person clicks before the canonical delegated handlers. Remove it completely. */
js=js.replace(badRuntime,'');
if(js.includes("window.__ctR303Final='related+actors+top10+f1-drivers-calendar+sports-refresh+profile-finite'"))throw new Error('r304 failed to remove r303 runtime');

/* r301/r302 may still reconcile Sports after render; make their old "remove Pilotos" helpers harmless. */
const r301=/function removeDrivers301\(\)\{[\s\S]*?\n\}\nfunction orderSports301/;
const r302=/function removeDrivers302\(\)\{[\s\S]*?\n\}\nfunction nodeSport302/;
if(!r301.test(js)||!r302.test(js))throw new Error('r304 could not locate legacy driver removers');
js=js.replace(r301,'function removeDrivers301(){return false}\nfunction orderSports301').replace(r302,'function removeDrivers302(){return false}\nfunction nodeSport302');

if(!js.includes('\nboot();'))throw new Error('r304 boot insertion missing');
js=js.replace("window.__ctWebBuild='1.0.94';window.__ctOfficialVersion='1.0.94';","window.__ctWebBuild='1.0.95';window.__ctOfficialVersion='1.0.95';")
 .replace("const REVISION='r303-official-1.0.94';","const REVISION='r304-official-1.0.95';")
 .replace('\nboot();','\n'+runtime+'\nboot();');

css+=String.raw`
/* CineTracker Web 1.0.95 r304 — canonical interactions + compact Discover + stable Profile. */
.ct304-sports-refresh{margin-left:auto!important;flex:0 0 auto!important;white-space:nowrap!important;display:inline-flex!important;align-items:center!important;gap:6px!important}
.ct304-sports-refresh.busy{opacity:.65;pointer-events:none}
.ct304-discover-compact{padding-top:4px!important}
.ct304-top10-section{margin-top:0!important;padding-top:0!important;margin-bottom:6px!important}
.top10-placement-wrap,[data-ct-top10]{margin-top:0!important;padding-top:0!important;margin-bottom:6px!important}
#profileWatchlistGrid .profile-card-arrow,#profileWatchlistGrid [data-profile-open-icon],[data-ct304-no-open-signal] .profile-card-arrow,[data-ct304-no-open-signal] [data-profile-open-icon]{display:none!important}
.ct304-profile-actors{overflow:hidden!important}
.ct304-actor-rail{display:flex!important;flex-wrap:nowrap!important;gap:12px!important;overflow-x:auto!important;overflow-y:hidden!important;max-width:100%!important;padding-bottom:8px!important;scrollbar-gutter:stable!important;-webkit-overflow-scrolling:touch}
.ct304-actor-card{box-sizing:border-box!important;flex:0 0 132px!important;width:132px!important;min-width:132px!important;max-width:132px!important;align-self:stretch!important}
.ct304-actor-card img{width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}
@media (max-width:760px){.ct304-actor-rail{gap:10px!important}.ct304-actor-card{flex-basis:112px!important;width:112px!important;min-width:112px!important;max-width:112px!important}}
`;
html=html.replaceAll('app-v303.js','app-v304.js').replaceAll('app-v303.css','app-v304.css').replaceAll('CineTracker • v1.0.94','CineTracker • v1.0.95');
sw=sw.replaceAll('ct-web-1.0.94-r303','ct-web-1.0.95-r304').replaceAll('app-v303.js','app-v304.js').replaceAll('app-v303.css','app-v304.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.95',revision:'r304-official-1.0.95',base:'r303-production',scope:'canonical-movie-actions-top10-f1-drivers-calendar-sports-sync-profile-layout-web-only',related_titles_open:true,related_watchlist_action:true,related_seen_action:true,actors_open:true,r303_capture_removed:true,top10_viewport_compact:true,sports_manual_refresh:true,sports_menu_below_f1:true,f1_drivers_tab:true,f1_calendar_interactive:true,profile_stats_preserved:true,profile_watchlist_open_signal:false,profile_actor_cards_uniform:true,profile_actor_scroll_local:true,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v304.js'),js),writeFile(resolve(dist,'app-v304.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v303.js'),{force:true}),rm(resolve(dist,'app-v303.css'),{force:true})]);
console.log('WEB_R304_READY canonical movie/person actions + compact Top10 + F1 Pilotos/calendar + Sports sync/order + preserved Profile stats/layout');
