import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r319.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v319.js'),'utf8'),
 readFile(resolve(dist,'app-v319.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r321-discover-profile-history.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r321 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r321 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.110';window.__ctOfficialVersion='1.0.110';",
 "const REVISION='r319-official-1.0.110';",
 "const version='1.0.110',revision='r319-official-1.0.110';",
 "window.__ctR319='discover-canonical-blocklist+fail-closed+fresh-every-tab'",
 "\nboot();"
])must(js,x);
for(const x of[
 "window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity'",
 "cinetracker_discover_filter_v320",
 "cinetracker_activity_by_day_v320",
 "cinetracker_activity_items_by_day_v320",
 "no-hidden-post-render-gate+exact-before-paint"
])must(runtime,x);

const early=`(()=>{if(window.__ctR321EarlyCapture)return;window.__ctR321EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR321EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true);window.addEventListener('keydown',e=>{try{if(e.key==='Escape'&&document.querySelector('[data-ct321-activity]'))document.querySelector('[data-ct321-activity]')?.remove()}catch{}},true)})();`;
js=once(js,"window.__ctWebBuild='1.0.110';window.__ctOfficialVersion='1.0.110';","window.__ctWebBuild='1.0.112';window.__ctOfficialVersion='1.0.112';",'web version');
js=once(js,"const REVISION='r319-official-1.0.110';","const REVISION='r321-official-1.0.112';",'revision');
js=once(js,"const version='1.0.110',revision='r319-official-1.0.110';","const version='1.0.112',revision='r321-official-1.0.112';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','runtime insertion');
js=early+'\n'+js;

html=html.replaceAll('app-v319.js','app-v321.js').replaceAll('app-v319.css','app-v321.css').replaceAll('v1.0.110','v1.0.112').replaceAll('r319-official-1.0.110','r321-official-1.0.112');
sw=sw.replaceAll('ct-web-1.0.110-r319','ct-web-1.0.112-r321').replaceAll('app-v319.js','app-v321.js').replaceAll('app-v319.css','app-v321.css');
css+='\n/* CineTracker Web 1.0.112 r321 — pre-render exact Discover filter, no hidden gate. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.112',
 revision:'r321-official-1.0.112',
 base:'r319-production',
 scope:'rollback-r320-hidden-gate+discover-pre-render-exact-filter+profile-home-history-parity',
 discover_filter_authority:'cinetracker_discover_filter_v320',
 discover_validation:'server-before-paint',
 discover_loading:'visible-loader-no-hidden-content-gate',
 discover_public_exclusion:'seen+progress+up-to-date+completed+watchlist+watchlater+not-interested',
 discover_top10:'provider-series+movies+exact-filter-before-paint',
 discover_foryou:'watchlist-only-unseen+fresh-unblocked+working-kind-filter',
 profile_activity_source:'watch_history-same-as-home',
 profile_activity_days_rpc:'cinetracker_activity_by_day_v320',
 profile_activity_items_rpc:'cinetracker_activity_items_by_day_v320',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r321 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v321.js'),js),
 writeFile(resolve(dist,'app-v321.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v319.js'),{force:true}),rm(resolve(dist,'app-v319.css'),{force:true})]);
console.log('WEB_R321_READY loading restored + exact filter before paint');
