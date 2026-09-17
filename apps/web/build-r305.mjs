import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r304.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,oldRuntime,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v304.js'),'utf8'),readFile(resolve(dist,'app-v304.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r304-final.js'),'utf8'),readFile(resolve(root,'runtime-r305-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r305 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.95';window.__ctOfficialVersion='1.0.95';","const REVISION='r304-official-1.0.95';",oldRuntime,'function styleWatchlistStats300(){','function enforceSportsTabs300(activateNext=true){','function stabilizeProfile301(){','\nboot();'])must(js,x);
for(const x of["window.__ctR305Final='canonical-first-paint+overlay-hit-actions+provider-sync+stable-profile'","window.__ctR305Lifecycle='pre-boot+renderer-hooks+no-mutation-observer+no-delayed-reconcile'",'elementsFromPoint','refreshSports305','stableProfile305','normalizeSportsModel305'])must(runtime,x);
if(runtime.includes('MutationObserver')||runtime.includes('setTimeout(')||runtime.includes('setInterval('))throw new Error('r305 runtime must not reconcile after paint');

/* r304 was a finite post-render repair. r305 replaces it with the final pre-boot owner. */
js=js.replace(oldRuntime,'');
if(js.includes("window.__ctR304Final='canonical-clicks+f1-drivers-calendar+sports-sync-order+profile-layout-only'"))throw new Error('r305 failed to retire r304 runtime');

/* Retire the legacy delayed Profile/Sports authorities that caused the UI to visibly change after first paint. */
js=js.replace('function styleWatchlistStats300(){','function styleWatchlistStats300(){return false}\nfunction styleWatchlistStats300LegacyR305(){');
js=js.replace('function enforceSportsTabs300(activateNext=true){','function enforceSportsTabs300(activateNext=true){return true}\nfunction enforceSportsTabs300LegacyR305(activateNext=true){');
js=js.replace('function stabilizeProfile301(){','function stabilizeProfile301(){return false}\nfunction stabilizeProfile301LegacyR305(){');
js=js.replace("const SPORTS_ORDER=['next','previous','watched','favorites'];","const SPORTS_ORDER=['next','previous','favorites','watched'];");
for(const x of['function styleWatchlistStats300(){return false}','function enforceSportsTabs300(activateNext=true){return true}','function stabilizeProfile301(){return false}',"const SPORTS_ORDER=['next','previous','favorites','watched'];"])must(js,x);

js=js.replace("window.__ctWebBuild='1.0.95';window.__ctOfficialVersion='1.0.95';","window.__ctWebBuild='1.0.96';window.__ctOfficialVersion='1.0.96';")
 .replace("const REVISION='r304-official-1.0.95';","const REVISION='r305-official-1.0.96';")
 .replace('\nboot();','\n'+runtime+'\nboot();');

css+=String.raw`
/* CineTracker Web 1.0.96 r305 — first-paint stable layout + real interaction hit targets. */
.ct305-sports-refresh{margin-left:auto!important;flex:0 0 auto!important;display:inline-flex!important;align-items:center!important;gap:6px!important;white-space:nowrap!important;cursor:pointer!important}.ct305-sports-refresh.busy{opacity:.62!important;pointer-events:none!important}.ct255-sports-tabs{align-items:center!important}
.ct305-top10-active .content>.header{margin-bottom:0!important;padding-top:4px!important;padding-bottom:4px!important}.ct305-top10-active .content>.header .h1{margin-top:0!important;margin-bottom:2px!important;font-size:clamp(20px,2vw,28px)!important}.ct305-top10-active .content>.header .subtitle{margin-top:0!important;margin-bottom:0!important}.ct305-top10-section{margin-top:-6px!important;padding-top:0!important}.ct305-top10-active [data-discover]{padding-top:0!important}
.ct305-watchlist-stat-clean{cursor:default!important}.ct305-watchlist-stat-clean::before,.ct305-watchlist-stat-clean::after{content:none!important;display:none!important}.ct305-watchlist-stat-clean .profile-card-arrow,.ct305-watchlist-stat-clean [data-profile-open-icon]{display:none!important}
.ct305-profile-actors{overflow:hidden!important}.ct305-actor-rail{box-sizing:border-box!important;display:flex!important;flex-wrap:nowrap!important;gap:12px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 10px!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important}.ct305-actor-card{box-sizing:border-box!important;flex:0 0 132px!important;width:132px!important;min-width:132px!important;max-width:132px!important;align-self:stretch!important}.ct305-actor-card img,.ct305-actor-card [style*="background-image"]{display:block!important;width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}.ct305-profile-actors>:not(.ct305-actor-rail){overflow-x:visible!important}
.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],.ct169-person-card [data-person],.ct170-person-card [data-person],[data-ct301-f1-event]{pointer-events:auto!important}.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],[data-ct301-f1-event]{cursor:pointer!important}
html,body,#app,.app,.content{max-width:100%!important;overflow-x:clip!important}
@media(max-width:760px){.ct305-actor-rail{gap:10px!important}.ct305-actor-card{flex-basis:112px!important;width:112px!important;min-width:112px!important;max-width:112px!important}}
`;

html=html.replaceAll('app-v304.js','app-v305.js').replaceAll('app-v304.css','app-v305.css').replaceAll('CineTracker • v1.0.95','CineTracker • v1.0.96');
sw=sw.replaceAll('ct-web-1.0.95-r304','ct-web-1.0.96-r305').replaceAll('app-v304.js','app-v305.js').replaceAll('app-v304.css','app-v305.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.96',revision:'r305-official-1.0.96',base:'r304-production',scope:'canonical-first-paint-real-interactions-provider-sync-stable-profile-web-only',related_titles_open:true,related_watchlist_action:true,related_seen_action:true,actors_open:true,interaction_overlay_hit_test:true,top10_viewport_compact:true,f1_drivers_tab:true,f1_calendar_interactive:true,sports_tabs:'next+previous+favorites+watched',sports_menu_below_f1:true,sports_manual_refresh:true,sports_provider_resync:true,profile_stats_preserved:true,profile_legacy_delayed_overwrite:false,profile_watchlist_open_signal:false,profile_actor_cards_uniform:true,profile_actor_scroll_local:true,r304_runtime_removed:true,r305_pre_boot:true,r305_mutation_observer:false,r305_delayed_reconcile:false,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v305.js'),js),writeFile(resolve(dist,'app-v305.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v304.js'),{force:true}),rm(resolve(dist,'app-v304.css'),{force:true})]);
console.log('WEB_R305_READY canonical first-paint interactions + provider sync + stable Profile; Android preserved');
