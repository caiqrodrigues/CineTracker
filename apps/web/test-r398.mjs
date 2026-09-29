import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R398_SKIP_BUILD!=='1')await import('./build-r398.mjs');
const [html,js,sw,rel,runtime,pkg,rootPkg]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v398.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r398-production-hard-fix.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR398Marker='home-anchor+movie-watchlist+live-sports+direct-foryou'"),'r398 marker');
ok(runtime.includes("rpcCall('cinetracker_watchlist_full_v376'"),'movie watchlist direct source');
ok(runtime.includes("rpcCall('cinetracker_home_series_v391'"),'series authority');
ok(runtime.includes("refreshTv?.(true)"),'forced recurring refresh');
ok(runtime.includes("rpcCall('cinetracker_discover_foryou_v396'"),'ForYou canonical payload');
ok(runtime.includes('data-ct398-action')&&runtime.includes('fyLocks'),'local optimistic actions/lock');
ok(!runtime.includes('window.location.reload()')&&!runtime.includes('router.refresh()'),'full page reload detected');
ok(!runtime.includes('while(true)'),'unbounded loop detected');
ok(html.includes('app-v398.js')&&html.includes('app-v398.css'),'r398 assets');
ok(sw.includes('ct-web-1.0.189-r398'),'service worker identity');
ok(r.version==='1.0.189'&&r.revision==='r398-official-1.0.189','release identity');
ok(p.version==='1.0.189'&&rp.version==='1.0.189','package version');
console.log('WEB_R398_TEST_OK');