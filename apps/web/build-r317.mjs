import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r316.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v316.js'),'utf8'),
 readFile(resolve(dist,'app-v316.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r317-profile-watchlist-click.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r317 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r317 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.107';window.__ctOfficialVersion='1.0.107';",
 "const REVISION='r316-official-1.0.107';",
 "const version='1.0.107',revision='r316-official-1.0.107';",
 "window.__ctR316='profile-r237-order+watchlist-open+f1-incomplete-schedule-truth'",
 "\nboot();"
])must(js,x);
for(const x of[
 "window.__ctR317='profile-watchlist-hard-click+exact-order-singular-alias'",
 "tempo de filme em watchlist",
 "window.__ctR316.openWatchlist",
 "ct317Watchlist"
])must(runtime,x);

const early=`(()=>{if(window.__ctR317EarlyCapture)return;window.__ctR317EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR317EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true);window.addEventListener('keydown',e=>{try{if((e.key==='Enter'||e.key===' ')&&e.target?.closest?.('.stat,[data-stat],.stat-card,.profile-stat')){const fn=window.__ctR317EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}}catch{}},true)})();`;
js=once(js,"window.__ctWebBuild='1.0.107';window.__ctOfficialVersion='1.0.107';","window.__ctWebBuild='1.0.108';window.__ctOfficialVersion='1.0.108';",'web version');
js=once(js,"const REVISION='r316-official-1.0.107';","const REVISION='r317-official-1.0.108';",'revision');
js=once(js,"const version='1.0.107',revision='r316-official-1.0.107';","const version='1.0.108',revision='r317-official-1.0.108';",'footer identity');
js=once(js,'\nboot();','\n'+runtime+'\nboot();','runtime insertion');
js=early+'\n'+js;

html=html.replaceAll('app-v316.js','app-v317.js').replaceAll('app-v316.css','app-v317.css').replaceAll('v1.0.107','v1.0.108').replaceAll('r316-official-1.0.107','r317-official-1.0.108');
sw=sw.replaceAll('ct-web-1.0.107-r316','ct-web-1.0.108-r317').replaceAll('app-v316.js','app-v317.js').replaceAll('app-v316.css','app-v317.css');
css+='\n/* CineTracker Web 1.0.108 r317 — hard Profile Watchlist click capture and exact order. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.108',
 revision:'r317-official-1.0.108',
 base:'r316-production',
 scope:'profile-watchlist-hard-click-and-order-alias-web-only',
 profile_stats_order:'r317-exact-ten-singular-plural-aliases',
 profile_watchlist_stats:'clickable-by-label-first-capture',
 profile_watchlist_source:'cinetracker_watchlist_full_v119',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r317 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v317.js'),js),
 writeFile(resolve(dist,'app-v317.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v316.js'),{force:true}),rm(resolve(dist,'app-v316.css'),{force:true})]);
console.log('WEB_R317_READY movie+series Watchlist stats hard-click + exact order');
