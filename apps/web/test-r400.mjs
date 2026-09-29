import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R400_SKIP_BUILD!=='1')await import('./build-r400.mjs');
const [runtime,build,app,html,sw,pkg]=await Promise.all([
 readFile(resolve('runtime-r400-auth-ready-home-foryou.js'),'utf8'),readFile(resolve('build-r400.mjs'),'utf8'),readFile(resolve('dist/app-v400.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR400Marker='auth-ready-home+movies+foryou+recurring-tv'"),'marker');
ok(runtime.includes('session?.access_token')&&runtime.includes('authReady()'),'auth gate missing');
ok(runtime.includes('readyProbe')&&runtime.includes('attempt<60'),'bounded auth probe missing');
ok(!runtime.includes('new MutationObserver'),'MutationObserver forbidden');
ok(!runtime.includes('setInterval('),'interval loop forbidden');
ok(!runtime.includes('window.location.reload(')&&!runtime.includes('router.refresh('),'full page reload forbidden');
ok(runtime.includes('requestAnimationFrame(paint)'),'chunk paint missing');
ok(runtime.includes('cinetracker_home_series_v391'),'home authority missing');
ok(runtime.includes('cinetracker_watchlist_full_v376'),'movie authority missing');
ok(runtime.includes('cinetracker_discover_foryou_v396'),'foryou authority missing');
ok(runtime.includes("edge('ct-refresh-tv-state-user'"),'authenticated TV refresh missing');
ok(build.includes("await import('./build-r396.mjs')")&&!build.includes("build-r399.mjs"),'r400 must exclude r397-r399 observer chain');
ok(!app.includes("window.__ctR399Marker='startup-no-global-mutation-loop+home+direct-foryou'"),'r399 runtime leaked');
ok(app.includes("window.__ctWebBuild='1.0.191'")&&app.includes("const REVISION='r400-official-1.0.191'"),'identity');
ok(html.includes('app-v400.js')&&!html.includes('app-v399.js'),'html asset');
ok(sw.includes('ct-web-1.0.191-r400')&&sw.includes('app-v400.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.191','web package');
console.log('R400_STATIC_OK');