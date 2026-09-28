import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R392_SKIP_BUILD!=='1')await import('./build-r392.mjs');
const [html,js,sw,rel,src,owner]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v392.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r388-home-foryou-final.js'),'utf8'),readFile(resolve('runtime-r392-home-hard-authority.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(src.includes("rpc('cinetracker_home_series_v391'"),'series authority missing');
ok(!src.includes("rpc('cinetracker_home_active_v380'"),'stale active v380 still used by Home');
ok(!src.includes("typeof ct276EpisodeCard==='function'"),'legacy async episode card still owns Home');
ok(src.includes('function markWatched392')&&src.includes("source:'r392-watch'"),'optimistic watched owner missing');
ok(src.includes("window.addEventListener('cinetracker:data-changed',afterDataChanged392)"),'route-independent Home invalidation missing');
ok(src.includes("p_limit:100")&&src.includes('hHistoryRun'),'history generation/limit hardening missing');
ok(src.includes("if(kind==='movies')void loadMovies(false)"),'movie watchlist still blocks Series Home');
ok(src.includes('validateCachedForYou392')&&src.includes('strict-cache-first'),'Pra Voce cached strict audit missing');
ok(!src.includes('while(true)'),'unbounded loop detected');
ok(!src.includes('window.location.reload()')&&!src.includes('router.refresh()'),'full page reload detected in scoped owner');
ok(owner.includes("window.__ctR392Marker='home-authority-only+optimistic-watch+history-route-invalidation+foryou-cache-audit'"),'r392 marker source');
ok(js.includes("window.__ctR392Marker='home-authority-only+optimistic-watch+history-route-invalidation+foryou-cache-audit'"),'r392 marker bundle');
ok(html.includes('app-v392.js')&&sw.includes('ct-web-1.0.183-r392'),'asset identity');
ok(r.version==='1.0.183'&&r.revision==='r392-official-1.0.183'&&r.scope==='home+discover-foryou-only','release identity');
console.log('WEB_R392_TEST_OK');
