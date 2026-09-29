import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R403_SKIP_BUILD!=='1')await import('./build-r403.mjs');
const [runtime,build,app,html,sw,css,pkg]=await Promise.all([
 readFile(resolve('runtime-r403-home-discover-stable.js'),'utf8'),readFile(resolve('build-r403.mjs'),'utf8'),readFile(resolve('dist/app-v403.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/app-v403.css'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR403Marker='home-counts-authority+movies+live-foryou-owner+no-freeze'"),'marker');
ok(runtime.includes('session?.access_token')&&runtime.includes('authReady()'),'auth gate missing');
ok(runtime.includes('readyProbe')&&runtime.includes('attempt<60'),'bounded auth probe missing');
ok(runtime.includes('requestIdleCallback')&&runtime.includes('scheduleIdle(paint)'),'idle chunking missing');
ok(!runtime.includes('new MutationObserver'),'MutationObserver forbidden');
ok(!runtime.includes('setInterval('),'interval loop forbidden');
ok(!runtime.includes('while(true)'),'unbounded loop forbidden');
ok(!runtime.includes('window.location.reload(')&&!runtime.includes('router.refresh('),'full page reload forbidden');
ok(runtime.includes('cinetracker_home_series_v403'),'home series v403 missing');
ok(runtime.includes('cinetracker_home_movies_v402'),'light movie authority missing');
ok(runtime.includes('movieRows403')&&runtime.includes('scheduleMovieOwner403'),'movie recovery missing');
ok(runtime.includes("activeHome()!=='movies'")&&runtime.includes("activeHome()!=='series'"),'hidden-tab paint guard missing');
ok(runtime.includes("q('[data-home-tab].active,[data-home-tab][aria-pressed=\"true\"]')"),'DOM-first home tab missing');
ok(runtime.includes('cinetracker_discover_foryou_v396'),'foryou authority missing');
ok(runtime.includes("['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']"),'complete three actions missing');
ok(build.includes("await import('./build-r402.mjs')"),'r403 base mismatch');
ok(build.includes("r403 retired r402 runtime"),'r402 runtime retirement missing');
ok(app.includes("window.__ctWebBuild='1.0.194'")&&app.includes("const REVISION='r403-official-1.0.194'"),'identity');
ok(app.includes('r403 retired r402 runtime'),'retired r402 not present in built app');
ok(html.includes('app-v403.js')&&!html.includes('app-v402.js'),'html asset');
ok(sw.includes('ct-web-1.0.194-r403')&&sw.includes('app-v403.js'),'service worker');
ok(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'three-action CSS missing');
ok(JSON.parse(pkg).version==='1.0.194','web package');
console.log('R403_STATIC_OK');
