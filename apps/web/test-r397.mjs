import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R397_SKIP_BUILD!=='1')await import('./build-r397.mjs');
const [html,js,sw,rel,runtime,edge,pkg,rootPkg]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v397.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r397-home-discover-recovery.js'),'utf8'),readFile(resolve('../../supabase/functions/ct-refresh-tv-state-user/index.ts'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR397Marker='home-entry+movies-render+recurring-sports+foryou-entrypoint-recovery'"),'r397 marker missing');
ok(runtime.includes('function renderMovies397')&&runtime.includes('paintChunk(80)'),'defensive movie renderer missing');
ok(runtime.includes("sportsLike(x)&&Number(x?.next_episode_number||0)>0"),'recurring next episode renderer missing');
ok(runtime.includes('refreshTv(true)'),'forced TV refresh missing');
ok(runtime.includes("rpcCall('cinetracker_discover_foryou_v396'"),'canonical ForYou payload missing');
ok(runtime.includes("'__ctR395','__ctR396'"),'ForYou owner rebind missing');
ok(runtime.includes('MutationObserver'),'stuck placeholder recovery missing');
ok(!runtime.includes('window.location.reload()')&&!runtime.includes('router.refresh()'),'full page reload detected');
ok(!runtime.includes('while(true)'),'unbounded loop detected');
ok(edge.includes('tv-state-refresh-v3')&&edge.includes('currentSportsSeason')&&edge.includes('sportsRefreshed'),'recurring sports edge refresh missing');
ok(html.includes('app-v397.js')&&html.includes('app-v397.css'),'r397 assets missing');
ok(sw.includes('ct-web-1.0.188-r397'),'service worker identity missing');
ok(r.version==='1.0.188'&&r.revision==='r397-official-1.0.188'&&r.scope==='home+discover-foryou-only','release identity');
ok(p.version==='1.0.188'&&rp.version==='1.0.188','package version');
console.log('WEB_R397_TEST_OK');
