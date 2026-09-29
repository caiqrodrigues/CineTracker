import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R395_SKIP_BUILD!=='1')await import('./build-r395.mjs');
const [html,js,sw,rel,runtime,pkg,rootPkg]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v395.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r395-discover-foryou-owner.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR395Marker='discover-foryou-r388-single-route-owner+legacy-v333-bypass'"),'r395 marker missing');
ok(runtime.includes('window.__ctR321EarlyHandle=early321395')&&runtime.includes('window.__ctR336EarlyHandle=early336395'),'Pra Voce tab owners not rebound');
ok(runtime.includes('window.__ctR336.switchDiscover=switchDiscover395')&&runtime.includes('window.__ctR288LoadDiscover=loadDiscover395'),'Discover entrypoints not rebound');
ok(runtime.includes("for(const name of ['__ctR378LoadForYou'")&&runtime.includes("'__ctR388LoadForYou'"),'legacy loader aliases not retired');
ok(js.includes('cinetracker_discover_watch_v391')&&js.includes('cinetracker_discover_fresh_v387')&&js.includes('cinetracker_discover_filter_v391'),'r388 strict data sources missing');
ok(!runtime.includes('cinetracker_discover_filter_v333'),'r395 references legacy v333 audit');
ok(!runtime.includes('window.location.reload()')&&!runtime.includes('router.refresh()'),'full page reload detected');
ok(!runtime.includes('while(true)'),'unbounded loop detected');
ok(html.includes('app-v395.js')&&html.includes('app-v395.css'),'r395 assets missing');
ok(sw.includes('ct-web-1.0.186-r395'),'service worker identity missing');
ok(r.version==='1.0.186'&&r.revision==='r395-official-1.0.186'&&r.scope==='discover-foryou-only','release identity');
ok(p.version==='1.0.186'&&rp.version==='1.0.186','package version');
console.log('WEB_R395_TEST_OK');
