import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R394_SKIP_BUILD!=='1')await import('./build-r394.mjs');
const [html,js,sw,rel,runtime,pkg,rootPkg]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v394.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r394-home-foryou-entrypoint-fix.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR394Marker='home-after-history-anchor+foryou-entrypoint-authority'"),'r394 marker missing');
ok(runtime.includes("'__ctR382LoadForYou'")&&runtime.includes('window[obj].loadForYou=load'),'legacy Pra Voce entrypoint rebind missing');
ok(runtime.includes('async function renderHome394')&&runtime.includes('finishHome394(activeHomeKind(),token)'),'post-history Home anchor missing');
ok(js.includes('hSeries=mergeLogicalSeries(cacheGet(HS,600000)||[])'),'Home session cache hydration missing');
ok(js.includes('cinetracker_discover_fresh_v387')&&js.includes('cinetracker_discover_filter_v391'),'strict DB-first Pra Voce source missing');
ok(!runtime.includes('window.location.reload()')&&!runtime.includes('router.refresh()'),'full page reload detected');
ok(!runtime.includes('while(true)'),'unbounded loop detected');
ok(html.includes('app-v394.js')&&html.includes('app-v394.css'),'r394 assets missing');
ok(sw.includes('ct-web-1.0.185-r394'),'service worker identity missing');
ok(r.version==='1.0.185'&&r.revision==='r394-official-1.0.185'&&r.scope==='home+discover-foryou-only','release identity');
ok(p.version==='1.0.185'&&rp.version==='1.0.185','package version');
console.log('WEB_R394_TEST_OK');
