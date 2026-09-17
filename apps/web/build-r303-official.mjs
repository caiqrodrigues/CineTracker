import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r303.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v303.js'),'utf8'),
 readFile(resolve(dist,'app-v303.css'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve('runtime-r303-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r303 official missing '+x)};
for(const x of["window.__ctWebBuild='1.0.94';window.__ctOfficialVersion='1.0.94';","const REVISION='r303-official-1.0.94';","window.__ctR303Final='related+actors+top10+f1-drivers-calendar+sports-refresh+profile-finite'",'restoreDrivers','calendarClickable','ensureRefresh','refreshSports','activateRelated','activatePerson','top10','profile'])must(js,x);
if(runtime.includes('MutationObserver')||runtime.includes('setInterval('))throw new Error('r303 final runtime is not finite');
must(html,'app-v303.js');must(html,'app-v303.css');must(css,'1.0.94 r303');must(css,'.ct303-sports-refresh');must(sw,"const CACHE='ct-web-1.0.94-r303';");
const m=JSON.parse(release);
if(m.version!=='1.0.94'||m.revision!=='r303-official-1.0.94'||m.related_titles_open!==true||m.related_watchlist_action!==true||m.related_seen_action!==true||m.actors_open!==true||m.top10_viewport_compact!==true||m.sports_profile_global_observer!==false||m.sports_manual_refresh!==true||m.sports_menu_below_f1!==true||m.f1_drivers_tab!==true||m.f1_calendar_interactive!==true||m.profile_stats_stable!==true||m.profile_watchlist_open_signal!==false||m.android!=='1.0.20/10062')throw new Error('r303 release identity');
console.log('WEB_1_0_94_OFFICIAL_OK r303 related/actors + compact Top10 + F1 Drivers/calendar + Sports refresh/order + stable Profile; Android preserved');
