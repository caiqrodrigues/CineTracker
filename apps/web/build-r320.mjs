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
 readFile(resolve(root,'runtime-r320-discover-profile-history.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r320 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r320 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.110';window.__ctOfficialVersion='1.0.110';",
 "const REVISION='r319-official-1.0.110';",
 "const version='1.0.110',revision='r319-official-1.0.110';",
 "window.__ctR319='discover-canonical-blocklist+fail-closed+fresh-every-tab'",
 "\nboot();"
])must(js,x);
for(const x of[
 "window.__ctR320='discover-exact-candidate-filter+profile-home-history-parity'",
 "cinetracker_discover_filter_v320",
 "cinetracker_activity_by_day_v320",
 "cinetracker_activity_items_by_day_v320",
 "[data-ct319-item]:not([data-ct320-validated])"
])must(runtime,x);

const early=`(()=>{if(window.__ctR320EarlyCapture)return;window.__ctR320EarlyCapture=true;window.addEventListener('click',e=>{try{window.__ctR320EarlyPre?.(e.target,e);const fn=window.__ctR320EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true)})();`;
js=once(js,"window.__ctWebBuild='1.0.110';window.__ctOfficialVersion='1.0.110';","window.__ctWebBuild='1.0.111';window.__ctOfficialVersion='1.0.111';",'web version');
js=once(js,"const REVISION='r319-official-1.0.110';","const REVISION='r320-official-1.0.111';",'revision');
js=once(js,"const version='1.0.110',revision='r319-official-1.0.110';","const version='1.0.111',revision='r320-official-1.0.111';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','runtime insertion');
js=early+'\n'+js;

html=html.replaceAll('app-v319.js','app-v320.js').replaceAll('app-v319.css','app-v320.css').replaceAll('v1.0.110','v1.0.111').replaceAll('r319-official-1.0.110','r320-official-1.0.111');
sw=sw.replaceAll('ct-web-1.0.110-r319','ct-web-1.0.111-r320').replaceAll('app-v319.js','app-v320.js').replaceAll('app-v319.css','app-v320.css');
css+='\n/* CineTracker Web 1.0.111 r320 — exact Discover validation + Profile/Home history parity. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.111',
 revision:'r320-official-1.0.111',
 base:'r319-production',
 scope:'discover-exact-candidate-filter-and-profile-home-history-parity',
 discover_filter_authority:'cinetracker_discover_filter_v320',
 discover_validation:'each-rendered-candidate-before-visible',
 discover_fail_mode:'hidden-until-server-validated',
 discover_foryou_validation:'watchlist-must-be-watch-and-unseen+fresh-must-be-unblocked',
 profile_activity_source:'watch_history-same-as-home',
 profile_activity_days_rpc:'cinetracker_activity_by_day_v320',
 profile_activity_items_rpc:'cinetracker_activity_items_by_day_v320',
 profile_activity_metadata:'season+episode+episode-title+rating+date+remaining+plays',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r320 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v320.js'),js),
 writeFile(resolve(dist,'app-v320.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v319.js'),{force:true}),rm(resolve(dist,'app-v319.css'),{force:true})]);
console.log('WEB_R320_READY exact Discover validation + Profile/Home history parity');
