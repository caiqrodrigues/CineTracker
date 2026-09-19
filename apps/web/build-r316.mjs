import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r315.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v315.js'),'utf8'),
 readFile(resolve(dist,'app-v315.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r316-profile-f1-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r316 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r316 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.106';window.__ctOfficialVersion='1.0.106';",
 "const REVISION='r315-official-1.0.106';",
 "const version='1.0.106',revision='r315-official-1.0.106';",
 "window.__ctR315='restore-approved-discover+remove-legacy-f1+restore-profile-stat-contract'",
 "window.__ctR237ProfileOrder=profile237",
 "window.__ctR299='profile-sports-history-clickable+stadium-presence-only'",
 "\nboot();"
])must(js,x);
for(const x of[
 "window.__ctR316='profile-r237-order+watchlist-open+f1-incomplete-schedule-truth'",
 "window.__ctR316Profile='r237-exact-order+watchlist-modal+live-sports+unified-collapse'",
 "window.__ctR316F1='four-tabs+no-legacy-panel+no-false-season-ended'",
 "window.__ctR237ProfileOrder",
 "data-ct316-watchlist",
 "cinetracker_watchlist_full_v119",
 "Agenda ainda não sincronizada"
])must(runtime,x);

const early=`(()=>{if(window.__ctR316EarlyCapture)return;window.__ctR316EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR316EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true);window.addEventListener('keydown',e=>{try{if((e.key==='Enter'||e.key===' ')&&e.target?.closest?.('[data-ct316-watchlist]')){const fn=window.__ctR316EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}if(e.key==='Escape'&&document.querySelector('[data-ct316-watch-modal]')){document.querySelector('[data-ct316-watch-close]')?.click()}}catch{}},true)})();`;
js=once(js,"window.__ctWebBuild='1.0.106';window.__ctOfficialVersion='1.0.106';","window.__ctWebBuild='1.0.107';window.__ctOfficialVersion='1.0.107';",'web version');
js=once(js,"const REVISION='r315-official-1.0.106';","const REVISION='r316-official-1.0.107';",'revision');
js=once(js,"const version='1.0.106',revision='r315-official-1.0.106';","const version='1.0.107',revision='r316-official-1.0.107';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','runtime insertion');
js=early+'\n'+js;

html=html.replaceAll('app-v315.js','app-v316.js').replaceAll('app-v315.css','app-v316.css').replaceAll('v1.0.106','v1.0.107').replaceAll('r315-official-1.0.106','r316-official-1.0.107');
sw=sw.replaceAll('ct-web-1.0.106-r315','ct-web-1.0.107-r316').replaceAll('app-v315.js','app-v316.js').replaceAll('app-v315.css','app-v316.css');
css+='\n/* CineTracker Web 1.0.107 r316 — exact Profile stat geometry, Watchlist buttons and truthful F1 overview. */\n';
const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.107',
 revision:'r316-official-1.0.107',
 base:'r315-production',
 scope:'profile-stat-buttons-order-and-f1-truth-web-only',
 profile_stats_order:'r237-requested-4col-two-wide-totals',
 profile_watchlist_stats:'clickable-open-full-list',
 profile_watchlist_source:'cinetracker_watchlist_full_v119',
 profile_sports_stats_source:'cinetracker_sport_stats_v1',
 profile_sports_history_actions:'events+stadium',
 profile_stats_collapse:'main+sports-unified',
 f1_legacy_watch_panel:false,
 f1_tabs:'overview+calendar+standings+circuits',
 f1_false_season_ended:false,
 f1_incomplete_schedule_label:'Agenda ainda não sincronizada',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r316 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v316.js'),js),
 writeFile(resolve(dist,'app-v316.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v315.js'),{force:true}),rm(resolve(dist,'app-v315.css'),{force:true})]);
console.log('WEB_R316_READY profile=r237-order+watchlist-open f1=no-false-season-ended');
