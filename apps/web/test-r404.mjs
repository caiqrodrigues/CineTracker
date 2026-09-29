import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R404_SKIP_BUILD!=='1')await import('./build-r404.mjs');
const [runtime,build,app,html,sw,css,pkg,migration]=await Promise.all([
 readFile(resolve('runtime-r404-home-discover-final.js'),'utf8'),readFile(resolve('build-r404.mjs'),'utf8'),readFile(resolve('dist/app-v404.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/app-v404.css'),'utf8'),readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260929223000_r404_home_movies_paged_recurring_backlog.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
ok(runtime.includes("window.__ctR404Marker='home-counts-authority+movies+live-foryou-owner+no-freeze'"),'marker');
ok(runtime.includes('session?.access_token')&&runtime.includes('authReady()'),'auth gate missing');
ok(runtime.includes('readyProbe')&&runtime.includes('attempt<60'),'bounded auth probe missing');
ok(runtime.includes('requestIdleCallback')&&runtime.includes('scheduleIdle(paint)'),'idle chunking missing');
ok(!runtime.includes('new MutationObserver'),'MutationObserver forbidden');
ok(!runtime.includes('setInterval('),'interval loop forbidden');
ok(!runtime.includes('while(true)'),'unbounded loop forbidden');
ok(!runtime.includes('window.location.reload(')&&!runtime.includes('router.refresh('),'full page reload forbidden');
ok(runtime.includes('cinetracker_home_series_v404'),'home series v404 missing');
ok(runtime.includes('cinetracker_home_movies_v404'),'paged movie authority missing');
ok(runtime.includes('p_limit:limit,p_offset:offset')&&runtime.includes('for(let page=1;page<pageCount;page++)'),'bounded movie pagination missing');
ok(runtime.includes('moviesTotal404'),'exact movie total missing');
ok(runtime.includes('tabKind404')&&runtime.includes('.home-tabs .active'),'visible Home tab authority missing');
ok(runtime.includes('rootVisible404')&&runtime.includes('getClientRects'),'visible Discover root authority missing');
ok(runtime.includes('[0,80,250,600,1200,2500,5000,9000,15000,22000,30000,45000]'),'bounded late owner recovery missing');
ok(runtime.includes("['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']"),'complete three actions missing');
ok(runtime.includes("?[['✓ Visto','seen'],['↻ Trocar','swap']]"),'watchlist actions missing');
ok(migration.includes('recent_available_episodes')&&migration.includes('cinetracker_home_series_v404'),'recurring split missing');
ok(migration.includes('cinetracker_home_movies_v404')&&migration.includes('p_offset'),'movie paging migration missing');
ok(build.includes("await import('./build-r403.mjs')"),'r404 base mismatch');
ok(build.includes('r404 retired r403 runtime'),'r403 runtime retirement missing');
ok(app.includes("window.__ctWebBuild='1.0.195'")&&app.includes("const REVISION='r404-official-1.0.195'"),'identity');
ok(app.includes('r404 retired r403 runtime'),'retired r403 not present in built app');
ok(html.includes('app-v404.js')&&!html.includes('app-v403.js'),'html asset');
ok(sw.includes('ct-web-1.0.195-r404')&&sw.includes('app-v404.js'),'service worker');
ok(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'three-action CSS missing');
ok(JSON.parse(pkg).version==='1.0.195','web package');
console.log('R404_STATIC_OK');
