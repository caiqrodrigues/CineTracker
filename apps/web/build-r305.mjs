import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r304.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,oldRuntime,newRuntime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v304.js'),'utf8'),readFile(resolve(dist,'app-v304.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r304-final.js'),'utf8'),readFile(resolve(root,'runtime-r305-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw Error('r305 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.95';window.__ctOfficialVersion='1.0.95';","const REVISION='r304-official-1.0.95';",oldRuntime,'\nboot();'])must(js,x);
for(const x of["window.__ctR305Final='persistent-movie-actions+top10+f1+sports+profile-stable'",'MutationObserver','handleMovieClick','ensureSportsRefresh','stableProfile'])must(newRuntime,x);
js=js.replace(oldRuntime,'');
if(js.includes("window.__ctR304Final='canonical-clicks+f1-drivers-calendar+sports-sync-order+profile-layout-only'"))throw Error('r305 failed to remove r304 runtime');
js=js.replace("window.__ctWebBuild='1.0.95';window.__ctOfficialVersion='1.0.95';","window.__ctWebBuild='1.0.96';window.__ctOfficialVersion='1.0.96';")
 .replace("const REVISION='r304-official-1.0.95';","const REVISION='r305-official-1.0.96';")
 .replace('\nboot();','\nboot();\n'+newRuntime);
css+=String.raw`
/* CineTracker Web 1.0.96 r305 — stable post-boot interactions/layout. */
.ct305-sports-refresh{margin-left:auto!important;flex:0 0 auto!important;display:inline-flex!important;align-items:center!important;gap:6px!important;white-space:nowrap!important;cursor:pointer!important}.ct305-sports-refresh.busy{opacity:.65;pointer-events:none!important}
.ct305-discover-compact{padding-top:0!important}.ct305-top10-section{margin-top:0!important;padding-top:0!important;margin-bottom:4px!important}.top10-placement-wrap,[data-ct-top10]{margin-top:0!important;padding-top:0!important;margin-bottom:4px!important}
.ct305-watchlist-clean .profile-card-arrow,.ct305-watchlist-clean [data-profile-open-icon]{display:none!important}
.ct305-profile-actors{overflow:hidden!important}.ct305-actor-rail{display:flex!important;flex-wrap:nowrap!important;gap:12px!important;overflow-x:auto!important;overflow-y:hidden!important;max-width:100%!important;padding-bottom:8px!important;-webkit-overflow-scrolling:touch}.ct305-actor-card{box-sizing:border-box!important;flex:0 0 132px!important;width:132px!important;min-width:132px!important;max-width:132px!important;align-self:stretch!important}.ct305-actor-card img{display:block!important;width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important}
.actor-link,.js-person,[data-person-id],[data-person],.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],[data-ct301-f1-event],[data-f1-event]{pointer-events:auto!important}.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],[data-ct301-f1-event],[data-f1-event]{cursor:pointer!important}
@media(max-width:760px){.ct305-actor-rail{gap:10px!important}.ct305-actor-card{flex-basis:112px!important;width:112px!important;min-width:112px!important;max-width:112px!important}}
`;
html=html.replaceAll('app-v304.js','app-v305.js').replaceAll('app-v304.css','app-v305.css').replaceAll('CineTracker • v1.0.95','CineTracker • v1.0.96');
sw=sw.replaceAll('ct-web-1.0.95-r304','ct-web-1.0.96-r305').replaceAll('app-v304.js','app-v305.js').replaceAll('app-v304.css','app-v305.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.96',revision:'r305-official-1.0.96',base:'r304-production',scope:'persistent-real-interactions-and-stable-layout-web-only',related_titles_open:true,related_watchlist_action:true,related_seen_action:true,actors_open:true,top10_viewport_compact:true,f1_drivers_tab:true,f1_calendar_interactive:true,sports_menu_below_f1:true,sports_manual_refresh:true,profile_stats_preserved:true,profile_watchlist_open_signal:false,profile_actor_cards_uniform:true,profile_actor_scroll_local:true,r304_runtime_removed:true,r305_post_boot:true,r305_mutation_reconcile:true,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v305.js'),js),writeFile(resolve(dist,'app-v305.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v304.js'),{force:true}),rm(resolve(dist,'app-v304.css'),{force:true})]);
console.log('WEB_R305_READY persistent interactions + stable rerender-safe layout');
