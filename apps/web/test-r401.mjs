import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R401_SKIP_BUILD!=='1')await import('./build-r401.mjs');
const [runtime,build,app,html,sw,pkg]=await Promise.all([
 readFile(resolve('runtime-r401-auth-ready-home-foryou.js'),'utf8'),readFile(resolve('build-r401.mjs'),'utf8'),readFile(resolve('dist/app-v401.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR401Marker='home-counts+light-movies+foryou-owner+no-freeze'"),'marker');
ok(runtime.includes('session?.access_token')&&runtime.includes('authReady()'),'auth gate missing');
ok(runtime.includes('readyProbe')&&runtime.includes('attempt<60'),'bounded auth probe missing');
ok(runtime.includes('requestIdleCallback')&&runtime.includes('scheduleIdle(paint)'),'idle chunking missing');
ok(!runtime.includes('new MutationObserver'),'MutationObserver forbidden');
ok(!runtime.includes('setInterval('),'interval loop forbidden');
ok(!runtime.includes('while(true)'),'unbounded loop forbidden');
ok(!runtime.includes('window.location.reload(')&&!runtime.includes('router.refresh('),'full page reload forbidden');
ok(runtime.includes('cinetracker_home_series_v401'),'home series authority missing');
ok(runtime.includes('cinetracker_home_movies_v401'),'light movie authority missing');
ok(!runtime.includes("rpcCall('cinetracker_watchlist_full_v376'"),'heavy movie RPC leaked');
ok(runtime.includes('cinetracker_discover_foryou_v396'),'foryou authority missing');
ok(runtime.includes("q('[data-discover-content]')"),'base discover root fallback missing');
ok(runtime.includes('window.__ctR388.renderForYou=renderForYou401'),'legacy renderer ownership missing');
ok(runtime.includes("for(const ms of [0,120,400,900,1800,3600,6000])"),'bounded foryou ownership burst missing');
ok(runtime.includes("edge('ct-refresh-tv-state-user'"),'TV refresh missing');
ok(build.includes("await import('./build-r396.mjs')")&&!build.includes("build-r400.mjs"),'r401 must derive from safe r396 base');
ok(!app.includes("window.__ctR400Marker='auth-ready-home+movies+foryou+recurring-tv'"),'r400 runtime leaked');
ok(app.includes("window.__ctWebBuild='1.0.192'")&&app.includes("const REVISION='r401-official-1.0.192'"),'identity');
ok(html.includes('app-v401.js')&&!html.includes('app-v400.js'),'html asset');
ok(sw.includes('ct-web-1.0.192-r401')&&sw.includes('app-v401.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.192','web package');
console.log('R401_STATIC_OK');
