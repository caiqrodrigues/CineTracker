import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r303-official.mjs');
const [runtime,build,html,js,css,release,sw]=await Promise.all([
 readFile(resolve('runtime-r303-final.js'),'utf8'),
 readFile(resolve('build-r303.mjs'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/app-v303.js'),'utf8'),
 readFile(resolve('dist/app-v303.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r303 test missing '+x)};
for(const x of['addWatchlist','markSeen','activateRelated','activatePerson','data-ct303-sports-refresh','loadSports255(true)','data-ct301-f1-event','restoreDrivers',"['drivers','Pilotos']",'calendarClickable','top10','profile','stabilizeSports'])must(runtime,x);
if(runtime.includes('MutationObserver'))throw new Error('r303 reintroduced MutationObserver');
if(runtime.includes('setInterval('))throw new Error('r303 reintroduced polling loop');
for(const x of["version:'1.0.94'","revision:'r303-official-1.0.94'",'f1_drivers_tab:true','sports_manual_refresh:true','profile_watchlist_open_signal:false',"android:'1.0.20/10062'"])must(build,x);
for(const x of["window.__ctWebBuild='1.0.94';window.__ctOfficialVersion='1.0.94';","const REVISION='r303-official-1.0.94';",'openF1Modal301','data-ct301-f1-event',"window.__ctR303Final='related+actors+top10+f1-drivers-calendar+sports-refresh+profile-finite'"])must(js,x);
must(html,'app-v303.js');must(html,'app-v303.css');must(css,'.ct303-sports-refresh');must(sw,"const CACHE='ct-web-1.0.94-r303';");
const m=JSON.parse(release);
for(const [k,v] of Object.entries({related_titles_open:true,related_watchlist_action:true,related_seen_action:true,actors_open:true,top10_viewport_compact:true,sports_profile_global_observer:false,sports_manual_refresh:true,sports_menu_below_f1:true,f1_drivers_tab:true,f1_calendar_interactive:true,profile_stats_stable:true,profile_watchlist_open_signal:false}))if(m[k]!==v)throw new Error(`r303 release flag ${k}`);
if(m.android!=='1.0.20/10062')throw new Error('Android version changed');
console.log('WEB_R303_TEST_OK finite interactions + F1/Sports/Profile recovery + Android preserved');
