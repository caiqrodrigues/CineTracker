import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R306_SKIP_BUILD!=='1')await import('./build-r306.mjs');
const [js,css,releaseRaw,html,sw,runtime,build,rootPkg,webPkg]=await Promise.all([
 readFile(resolve('dist/app-v306.js'),'utf8'),readFile(resolve('dist/app-v306.css'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('runtime-r306-final.js'),'utf8'),readFile(resolve('build-r306.mjs'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),must=(ok,msg)=>{if(!ok)throw new Error('R306 '+msg)};
must(js.includes("window.__ctWebBuild='1.0.97';window.__ctOfficialVersion='1.0.97';"),'version');
must(js.includes("const REVISION='r306-official-1.0.97';"),'revision');
must(js.includes('window.__ctR306={')&&!js.includes("window.__ctR305Final='canonical-first-paint+overlay-hit-actions+provider-sync+stable-profile'"),'single final authority');
must(runtime.includes('.ct169-related-card')&&runtime.includes('openMedia306')&&runtime.includes('openPerson306'),'related/actor click authority');
must(runtime.includes('persistAction306')&&runtime.includes("typeof addWatchlist==='function'")&&runtime.includes("typeof markSeen==='function'")&&runtime.includes('[data-detail-watchlist],[data-detail-seen]'),'Watchlist/Visto async authority');
must(runtime.includes('ct306-top10')&&runtime.includes('padding-top:4px')&&runtime.includes('margin-top:0'),'Top 10 compact viewport');
must(runtime.includes('removeDrivers306')&&!runtime.includes("['drivers','Pilotos']"),'Pilotos removed');
must(runtime.includes('Grid de Largada')&&runtime.includes('Resultado de Chegada')&&runtime.includes('api.jolpi.ca/ergast/f1/'),'past F1 details');
must(runtime.includes("const desired=['next','previous','favorites','watched']"),'sports order');
must(runtime.includes('ct306-sports-sync')&&runtime.includes("edge('ct-sports-sync'")&&runtime.includes('force:true'),'sports provider resync');
must(runtime.includes("const header=$(':scope > .header',content)")&&runtime.includes('b.header.appendChild(btn)'),'sports refresh header placement');
must(runtime.includes("if(b.tabs?.contains(btn)){b.header.appendChild(btn)}"),'refresh cannot remain inside submenu');
must(runtime.includes('ct306-profile-stable')&&runtime.includes('ct306-actor-card')&&runtime.includes('height:178px')&&runtime.includes('overflow-x:auto'),'stable profile actor rail');
must(build.includes('r299_delayed_profile_rewrite:false')&&build.includes("queueMicrotask(reconcile299)"),'no delayed Profile version/layout swapping');
must(css.includes('.ct305-sports-refresh{display:none!important}'),'retire old submenu refresh');
must(html.includes('app-v306.js')&&html.includes('app-v306.css'),'html assets');
must(sw.includes('ct-web-1.0.97-r306')&&sw.includes('app-v306.js'),'service worker');
for(const k of['related_titles_open','related_watchlist_action','related_seen_action','actors_open','main_modal_watchlist_seen','top10_viewport_compact','f1_calendar_interactive','f1_grid_start','f1_finish_result','sports_menu_below_f1','sports_manual_refresh','sports_refresh_in_header','sports_provider_resync','profile_stats_preserved','profile_actor_cards_uniform','profile_actor_scroll_local','r305_runtime_removed','r306_pre_boot'])must(release[k]===true,'release flag '+k);
for(const k of['f1_drivers_tab','profile_layout_switching','profile_watchlist_open_signal','r299_delayed_profile_rewrite'])must(release[k]===false,'release false flag '+k);
must(release.version==='1.0.97'&&release.revision==='r306-official-1.0.97','release identity');
must(JSON.parse(rootPkg).version==='1.0.97'&&JSON.parse(webPkg).version==='1.0.97','package versions');
console.log('R306_STATIC_OK canonical interactions + F1 grid/results + Sports sync placement + Profile stability');
