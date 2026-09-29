import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R393_SKIP_BUILD!=='1')await import('./build-r393.mjs');
const [html,js,sw,rel,src,marker,pkg,migration]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v393.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r388-home-foryou-final.js'),'utf8'),
 readFile(resolve('runtime-r393-home-foryou-video-fix.js'),'utf8'),readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260929002751_home_movies_v393_lightweight.sql'),'utf8')
]);
const r=JSON.parse(rel),p=JSON.parse(pkg),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(src.includes('function scheduleHome393')&&src.includes('function alignHome393'),'hidden-history anchor owner missing');
ok(src.includes("rpc('cinetracker_home_movies_v393'")&&src.includes("rpc('cinetracker_watchlist_full_v376'"),'movie-only RPC/fallback missing');
ok(src.includes('function dbFresh393')&&src.includes("rpc('cinetracker_discover_fresh_v387'"),'DB-first Pra Voce missing');
ok(src.includes("p_limit:24")&&src.includes("cinetracker_discover_filter_v391"),'bounded strict Fresh audit missing');
ok(src.includes("for(const ev of ['wheel','touchmove'])"),'manual-scroll protection missing');
ok(!src.includes('while(true)'),'unbounded loop detected');
ok(!src.includes('window.location.reload()')&&!src.includes('router.refresh()'),'full page reload detected');
ok(src.includes("window.__ctR388={version:'1.0.184'"),'owner version missing');
ok(marker.includes("window.__ctR393Marker='hidden-history-anchor+lightweight-movies+foryou-db-first-bounded'"),'r393 marker source');
ok(js.includes("window.__ctR393Marker='hidden-history-anchor+lightweight-movies+foryou-db-first-bounded'"),'r393 marker bundle');
ok(js.includes("rpc('cinetracker_home_movies_v393'")&&js.includes('function dbFresh393'),'r393 fixes missing from bundle');
ok(migration.includes('cinetracker_home_movies_v393')&&migration.includes("'media_type','movie'"),'r393 movie migration missing');
ok(html.includes('app-v393.js')&&sw.includes('ct-web-1.0.184-r393'),'asset identity');
ok(r.version==='1.0.184'&&r.revision==='r393-official-1.0.184'&&r.scope==='home+discover-foryou-only','release identity');
ok(p.version==='1.0.184','package version');
console.log('WEB_R393_TEST_OK');
