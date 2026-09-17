import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r302-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v302.js'),'utf8'),readFile(resolve(dist,'app-v302.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r303-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r303 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.93';window.__ctOfficialVersion='1.0.93';","const REVISION='r302-official-1.0.93';","window.__ctR302='discover-watched-watchlist-block+foryou-authority+finite-sports-profile'",'ensureSportsFilters302','buildForYou301'])must(js,x);
for(const x of["window.__ctR303Final='related+actors+top10+f1-drivers-calendar+sports-refresh+profile-finite'","window.__ctR303='movie-actions+top10+f1-drivers-calendar+sports-refresh-order+profile-stable'",'restoreDrivers','calendarClickable','ensureRefresh','refreshSports','activateRelated','activatePerson','top10','profile'])must(runtime,x);
if(runtime.includes('MutationObserver')||runtime.includes('setInterval('))throw new Error('r303 runtime must remain finite');
if(!js.includes('\nboot();'))throw new Error('r303 boot insertion missing');
js=js.replace("window.__ctWebBuild='1.0.93';window.__ctOfficialVersion='1.0.93';","window.__ctWebBuild='1.0.94';window.__ctOfficialVersion='1.0.94';")
 .replace("const REVISION='r302-official-1.0.93';","const REVISION='r303-official-1.0.94';")
 .replace('\nboot();','\n'+runtime+'\nboot();');
css+=String.raw`
/* CineTracker Web 1.0.94 r303 — finite regression recovery. */
.ct303-sports-refresh{margin-left:auto!important;flex:0 0 auto!important;white-space:nowrap!important}
.top10-placement-wrap,[data-ct-top10]{margin-top:4px!important;padding-top:0!important;margin-bottom:8px!important}
#profileWatchlistGrid .profile-card-arrow,#profileWatchlistGrid [data-profile-open-icon]{display:none!important}
`;
html=html.replaceAll('app-v302.js','app-v303.js').replaceAll('app-v302.css','app-v303.css').replaceAll('CineTracker • v1.0.93','CineTracker • v1.0.94');
sw=sw.replaceAll('ct-web-1.0.93-r302','ct-web-1.0.94-r303').replaceAll('app-v302.js','app-v303.js').replaceAll('app-v302.css','app-v303.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.94',revision:'r303-official-1.0.94',base:'r302-production',scope:'movie-related-actors-top10-f1-drivers-calendar-sports-refresh-profile-stable-web-only',related_titles_open:true,related_watchlist_action:true,related_seen_action:true,actors_open:true,top10_viewport_compact:true,sports_profile_global_observer:false,sports_manual_refresh:true,sports_menu_below_f1:true,f1_drivers_tab:true,f1_calendar_interactive:true,profile_stats_stable:true,profile_watchlist_open_signal:false,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v303.js'),js),writeFile(resolve(dist,'app-v303.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v302.js'),{force:true}),rm(resolve(dist,'app-v302.css'),{force:true})]);
console.log('WEB_R303_READY related/actors actions + compact Top10 + F1 Drivers/calendar + Sports refresh/order + stable Profile; Android preserved');
