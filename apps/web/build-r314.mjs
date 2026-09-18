import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';

await import('./build-r313.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtimeEncoded]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v313.js'),'utf8'),
  readFile(resolve(dist,'app-v313.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r314-profile-discover-f1.js.gz.b64'),'utf8')
]);
const runtime=gunzipSync(Buffer.from(runtimeEncoded.trim(),'base64')).toString('utf8');

const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error('r314 expected one '+label+', found '+n);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r314 missing '+x)};

for(const x of[
  "window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';",
  "const REVISION='r313-official-1.0.104';",
  "window.__ctR313='discover-approved-card+hidden-filter+sports-producer-filter+profile-single-render'",
  "window.__ctR313EarlyCapture=true",
  "const version='1.0.104',revision='r313-official-1.0.104';",
  "\nboot();"
])must(js,x);

const early314=String.raw`(()=>{if(window.__ctR314EarlyCapture)return;window.__ctR314EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR314EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();`;
js=once(js,"const version='1.0.104',revision='r313-official-1.0.104';","const version='1.0.105',revision='r314-official-1.0.105';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r314 insertion');
js=early314+'\n'+js;
js=once(js,"window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';","window.__ctWebBuild='1.0.105';window.__ctOfficialVersion='1.0.105';",'Web version');
js=once(js,"const REVISION='r313-official-1.0.104';","const REVISION='r314-official-1.0.105';",'revision');

html=html.replaceAll('app-v313.js','app-v314.js').replaceAll('app-v313.css','app-v314.css').replaceAll('v1.0.104','v1.0.105').replaceAll('r313-official-1.0.104','r314-official-1.0.105');
sw=sw.replaceAll('ct-web-1.0.104-r313','ct-web-1.0.105-r314').replaceAll('app-v313.js','app-v314.js').replaceAll('app-v313.css','app-v314.css');
css+='\n/* CineTracker Web 1.0.105 r314 — profile, strict Discover cache/filter and F1 race detail authority. */\n';

const prev=JSON.parse(releaseRaw),release={
  ...prev,
  version:'1.0.105',
  revision:'r314-official-1.0.105',
  base:'r313-production',
  scope:'profile-layout+discover-strict-nine-tabs-cache+f1-race-details-web-only',
  discover_tabs:9,
  discover_releases_restored:true,
  discover_public_tabs:'trending+popular+new+releases+anticipated+top',
  discover_public_exclusion:'seen+watchlist+alias-before-markup-strict',
  discover_calendar_exclusion_exception:true,
  discover_watchlist_button:'minimal-overlay-plus',
  discover_source_stale_ms:300000,
  discover_personal_stale_ms:90000,
  discover_background_prefetch:true,
  discover_tab_snapshot_cache:true,
  discover_foryou_layout:'compact-three-up-2:3',
  profile_renderer:'r314-live-supabase-single-paint',
  profile_cached_fallback:false,
  profile_stats_position:'fixed-top-general-then-sports',
  profile_watchlist_stats:'static-no-arrow-no-modal-trigger',
  profile_actor_rail:'single-horizontal-scroll-uniform-132x198',
  f1_detail_owner:'r314-calendar+overview-drawer',
  f1_detail_grid:'selected-round-qualifying-grid',
  f1_detail_results:'selected-round-final+delta+dnf+fastest-lap',
  f1_session_watch_rpc:'cinetracker_f1_watch_set_v314',
  android:'1.0.20/10062'
};

for(const x of[
  "window.__ctR314='profile-static-stats+discover-strict-nine-tabs-stale-cache+f1-race-details'",
  "window.__ctR314EarlyCapture=true",
  "['releases','Lançamentos']",
  "const PUBLIC=new Set(['trending','popular','new','releases','anticipated','top'])",
  "cinetracker_watchlist_full_v119",
  "function strictFilter314",
  "function renderProfile314",
  "ct314-watchlist-static",
  "function openRace314",
  "cinetracker_f1_watch_set_v314",
  "Volta mais rápida",
  "const version='1.0.105',revision='r314-official-1.0.105';"
])must(js,x);
if(!js.startsWith(early314+'\n'))throw new Error('r314 capture is not first');
if(release.android!=='1.0.20/10062')throw new Error('r314 Android baseline changed');

await Promise.all([
  writeFile(resolve(dist,'app-v314.js'),js),
  writeFile(resolve(dist,'app-v314.css'),css),
  writeFile(resolve(dist,'index.html'),html),
  writeFile(resolve(dist,'service-worker.js'),sw),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v313.js'),{force:true}),rm(resolve(dist,'app-v313.css'),{force:true})]);
console.log('WEB_R314_READY profile + strict Discover + F1 race details; Android preserved');
