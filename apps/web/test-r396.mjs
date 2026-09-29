import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R396_SKIP_BUILD!=='1')await import('./build-r396.mjs');
const [html,js,sw,rel,runtime,migration,pkg,rootPkg]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v396.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r396-discover-foryou-fast.js'),'utf8'),readFile(resolve('../../supabase/migrations/20260929101500_r396_discover_foryou_single_payload.sql'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR396Marker='discover-foryou-single-canonical-payload-v396'"),'r396 marker missing');
ok(runtime.includes("rpcCall('cinetracker_discover_foryou_v396'"),'single payload RPC missing');
ok(!runtime.includes('cinetracker_discover_filter_v391')&&!runtime.includes('cinetracker_discover_filter_v333'),'client audit returned');
ok(runtime.includes("a.loadForYou=loadForYou396"),'r388 loader not replaced');
ok(runtime.includes("['__ctR378LoadForYou'")&&runtime.includes("'__ctR388LoadForYou'"),'legacy aliases not rebound');
ok(!runtime.includes('window.location.reload()')&&!runtime.includes('router.refresh()'),'full page reload detected');
ok(!runtime.includes('while(true)'),'unbounded loop detected');
ok(migration.includes('cinetracker_discover_watch_unseen_v396')&&migration.includes('cinetracker_discover_foryou_v396'),'r396 migration missing');
ok(migration.includes("sx.state in ('AlreadySeen','Completed','InProgress','UpToDate')"),'watch unseen barrier missing');
ok(html.includes('app-v396.js')&&html.includes('app-v396.css'),'r396 assets missing');
ok(sw.includes('ct-web-1.0.187-r396'),'service worker identity missing');
ok(r.version==='1.0.187'&&r.revision==='r396-official-1.0.187'&&r.scope==='discover-foryou-only','release identity');
ok(p.version==='1.0.187'&&rp.version==='1.0.187','package version');
console.log('WEB_R396_TEST_OK');
