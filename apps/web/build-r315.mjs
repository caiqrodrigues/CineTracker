import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r314.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v314.js'),'utf8'),
  readFile(resolve(dist,'app-v314.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r315-regression-restore.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r315 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r315 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.105';window.__ctOfficialVersion='1.0.105';",
 "const REVISION='r314-official-1.0.105';",
 "const version='1.0.105',revision='r314-official-1.0.105';",
 "window.__ctR314='profile-live-static-watchlist+discover-nine-tabs-strict-cache+f1-race-details'",
 "window.__ctR288Top10='provider-specific-series+movies-real-rails'",
 "window.__ctR309='video-truth-discover-first-paint-f1-stable-profile'",
 "window.__ctR238='real-r180-profile-renderer'",
 "window.__ctR299='profile-sports-history-clickable+stadium-presence-only'",
 "\nboot();"
])must(js,x);
for(const x of[
 "window.__ctR315='restore-approved-discover+remove-legacy-f1+restore-profile-stat-contract'",
 "window.__ctR315Discover='r309-foryou-actions+r288-top10-two-rails+strict-six-dual-actions'",
 "cinetracker_sport_stats_v1",
 "window.__ctR288Test.loadTop10",
 "window.__ctR309.buildForYou",
 "[data-ct263-f1-watch-panel],.ct263-f1-watch-panel",
 "window.__ctV114SyncStats",
 "window.__ctR238ProfileStats"
])must(runtime,x);

const early315="(()=>{if(window.__ctR315EarlyCapture)return;window.__ctR315EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR315EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true);window.addEventListener('keydown',e=>{try{const t=e.target;if((e.key==='Enter'||e.key===' ')&&t?.closest?.('.ct315-watchlist-static,[data-ct117-watchlist-stat]')){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();";
js=once(js,"window.__ctWebBuild='1.0.105';window.__ctOfficialVersion='1.0.105';","window.__ctWebBuild='1.0.106';window.__ctOfficialVersion='1.0.106';",'web version');
js=once(js,"const REVISION='r314-official-1.0.105';","const REVISION='r315-official-1.0.106';",'revision');
js=once(js,"const version='1.0.105',revision='r314-official-1.0.105';","const version='1.0.106',revision='r315-official-1.0.106';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','runtime insertion');
js=early315+'\n'+js;

html=html.replaceAll('app-v314.js','app-v315.js').replaceAll('app-v314.css','app-v315.css').replaceAll('v1.0.105','v1.0.106').replaceAll('r314-official-1.0.105','r315-official-1.0.106');
sw=sw.replaceAll('ct-web-1.0.105-r314','ct-web-1.0.106-r315').replaceAll('app-v314.js','app-v315.js').replaceAll('app-v314.css','app-v315.css');
css+='\n/* CineTracker Web 1.0.106 r315 — restore approved Discover/F1/Profile contracts. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.106',
 revision:'r315-official-1.0.106',
 base:'r314-production',
 scope:'restore-approved-discover-top10-f1-profile-contracts-web-only',
 discover_tabs:9,
 discover_releases_restored:true,
 discover_foryou_owner:'r309-approved-actions',
 discover_foryou_actions:'watchlist+seen+swap',
 discover_top10:'all-providers+series+movies',
 discover_top10_owner:'r288-provider-specific-two-rails',
 discover_strict_tabs:'trending+popular+new+releases+anticipated+top',
 discover_public_exclusion:'seen+watchlist+alias-before-markup',
 discover_public_actions:'watchlist+seen',
 discover_cache:'5m+background-prefetch',
 f1_legacy_watch_panel:false,
 f1_detail:'qualifying+final+delta+dnf+fastest-lap',
 f1_session_watch_rpc:'cinetracker_f1_session_watch_set_v314',
 profile_renderer:'r315-live-supabase+r238-approved',
 profile_stats_order:'r238-approved',
 profile_sports_stats_source:'cinetracker_sport_stats_v1',
 profile_sports_time_live:true,
 profile_sports_history_actions:'events+stadium',
 profile_stats_collapse:'main+sports-unified',
 profile_watchlist_stats:'static-no-chevron-no-modal',
 profile_actors_scroll:'rail-only-equal-size',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r315 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v315.js'),js),
 writeFile(resolve(dist,'app-v315.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v314.js'),{force:true}),rm(resolve(dist,'app-v314.css'),{force:true})]);
console.log('WEB_R315_READY Discover approved + Top10 two rails + legacy F1 removed + Profile contract restored');
