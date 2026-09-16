import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r299-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v299.js'),'utf8'),readFile(resolve(dist,'app-v299.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r300-discover-sports-profile-watchlist.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r300 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.90';window.__ctOfficialVersion='1.0.90';","const REVISION='r299-official-1.0.90';","window.__ctR299='profile-sports-history-clickable+stadium-presence-only'",'window.__ctR298ForYou'])must(js,x);
for(const x of["window.__ctR300='discover-bounded-recovery+four-sports-tabs+watchlist-stat-style'","window.__ctR300Discover='browse-tabs-no-infinite-loading'","window.__ctR300Sports='next+previous+watched+favorites-no-live'","window.__ctR300Profile='series-watchlist+movies-watchlist-match-clickable-style'",'SPORTS_ORDER','data-ct255-sport-tab="live"','buildBrowse300','Séries Watchlist','Filmes Watchlist'])must(runtime,x);
if(!js.includes('\nboot();'))throw new Error('r300 boot insertion missing');
js=js.replace("window.__ctWebBuild='1.0.90';window.__ctOfficialVersion='1.0.90';","window.__ctWebBuild='1.0.91';window.__ctOfficialVersion='1.0.91';")
 .replace("const REVISION='r299-official-1.0.90';","const REVISION='r300-official-1.0.91';")
 .replace('\nboot();','\n'+runtime+'\nboot();');
css+=String.raw`
/* CineTracker Web 1.0.91 r300 — four Sports tabs, bounded Discover recovery and Watchlist stat parity. */
[data-ct255-sport-tab="live"],[data-ct247-sport-tab="live"],[data-ct248-sport-tab="live"]{display:none!important}.ct300-watchlist-stat{cursor:pointer}
`;
html=html.replaceAll('app-v299.js','app-v300.js').replaceAll('app-v299.css','app-v300.css').replaceAll('CineTracker • v1.0.90','CineTracker • v1.0.91');
sw=sw.replaceAll('ct-web-1.0.90-r299','ct-web-1.0.91-r300').replaceAll('app-v299.js','app-v300.js').replaceAll('app-v299.css','app-v300.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.91',revision:'r300-official-1.0.91',base:'r299-production',scope:'discover-bounded-recovery-four-sports-tabs-profile-watchlist-style-web-only',sports_tabs:'next+previous+watched+favorites',sports_live_tab:false,discover_browse_guard:true,profile_watchlist_stat_style:'matches-clickable-sports',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v300.js'),js),writeFile(resolve(dist,'app-v300.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v299.js'),{force:true}),rm(resolve(dist,'app-v299.css'),{force:true})]);
console.log('WEB_R300_READY Discover bounded recovery + four Sports tabs + Watchlist stat parity; Android preserved');
