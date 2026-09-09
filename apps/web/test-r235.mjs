import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,release,runtime]=await Promise.all([
 readFile(resolve(dist,'app-v235.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r235-v127-live-authority.js'),'utf8')
]);
const must=[
 "const REVISION='r235-official-1.0.27';",
 "window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';",
 "window.__ctR235V127='single-live-dom-authority'",
 "window.__ctV127Home='aired-unwatched-never-up-to-date'",
 "window.__ctV127Discover='stable-content-no-legends-uniform-cards-top10-safe'",
 "window.__ctV127Sports='single-action-zone-live-reconcile+provider-dedupe'",
 "window.__ctV127Watchlist='rpc-full-universe-count-modal-identical'",
 "new MutationObserver(queue127)",
 "rpc('cinetracker_watchlist_full_v119',{})",
 "window.__ctV123SportsNow?.()",
 "window.__ctV124Discover?.()",
 "data-ct127-watchlist",
 "data-ct127-watch-modal",
 ".ct127-discover-card",
 ".ct127-sports-actions"
];
for(const x of must)if(!js.includes(x))throw new Error('missing '+x);
const banned=[
 "window.__ctR234V126='real-regressions-baseline-preserving-authority'",
 'setInterval(sync,700)','new MutationObserver(sync121)','new MutationObserver(sync119)','new MutationObserver(sync117)',
 'setInterval(sync,350)','setInterval(sync,1200)','setInterval(queue,1200)','setInterval(guard,500)',
 "setInterval(()=>void sync(false).catch(()=>{}),1500)"
];
for(const x of banned)if(js.includes(x))throw new Error('legacy competing authority survived: '+x);
const observerCount=(js.match(/new MutationObserver\(/g)||[]).length;
if(observerCount!==1)throw new Error(`expected exactly one MutationObserver in final bundle, found ${observerCount}`);
const rowsStart=runtime.indexOf('function rowsWatch127');const rowsEnd=runtime.indexOf('\n}',rowsStart);const rowsBody=runtime.slice(rowsStart,rowsEnd+2);
if(rowsStart<0||/mediaId127\(x\)\s*>\s*0|tmdb_id\s*>\s*0/.test(rowsBody))throw new Error('Watchlist modal still drops local/no-TMDB rows');
if(!runtime.includes("if(row.home_bucket==='up_to_date'){row.home_bucket='continue'"))throw new Error('Home up_to_date correction missing');
if(!runtime.includes("ev.textContent='Ver eventos'"))throw new Error('Sports canonical event action missing');
if(!runtime.includes("'✓ Marcar como assistido'"))throw new Error('Sports canonical watched action missing');
if(!runtime.includes('hadUsable&&fresh&&fresh.querySelector(\'.loader\')'))throw new Error('Discover anti-flicker preservation missing');
if(!html.includes('app-v235.js')||html.includes('app-v232.js'))throw new Error('HTML asset identity mismatch');
if(!sw.includes("const CACHE='ct-web-1.0.27-r235';"))throw new Error('SW identity mismatch');
const r=JSON.parse(release);if(r.version!=='1.0.27'||r.revision!=='r235-official-1.0.27')throw new Error('release identity mismatch');
console.log('TEST_R235_OK one-live-observer home discover sports watchlist');