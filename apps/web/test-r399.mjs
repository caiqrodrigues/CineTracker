import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R399_SKIP_BUILD!=='1')await import('./build-r399.mjs');
const [runtime,app,html,sw,pkg]=await Promise.all([
 readFile(resolve('runtime-r399-startup-stability.js'),'utf8'),readFile(resolve('dist/app-v399.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR399Marker='startup-no-global-mutation-loop+home+direct-foryou'"),'marker');
ok(!runtime.includes('new MutationObserver'),'global MutationObserver must not return');
ok(!runtime.includes('setInterval('),'startup runtime must not use interval paint loops');
ok(!runtime.includes('window.location.reload(')&&!runtime.includes('router.refresh('),'full page reload forbidden');
ok(runtime.includes('requestAnimationFrame(paint)'),'movies must paint frame-by-frame');
ok(runtime.includes('bootProbe399')&&runtime.includes('attempt<24'),'boot probe must be bounded');
ok(runtime.includes("window.addEventListener('click'"),'window capture owner missing');
ok(runtime.includes('cinetracker_discover_foryou_v396'),'canonical foryou payload missing');
ok(runtime.includes('cinetracker_home_series_v391'),'canonical home series missing');
ok(runtime.includes('cinetracker_watchlist_full_v376'),'movie fallback missing');
ok(app.includes("window.__ctWebBuild='1.0.190'"),'app version');
ok(app.includes("const REVISION='r399-official-1.0.190'"),'revision');
ok(html.includes('app-v399.js')&&!html.includes('app-v398.js'),'html asset');
ok(sw.includes('ct-web-1.0.190-r399')&&sw.includes('app-v399.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.190','web package version');
console.log('R399_STATIC_OK');
