import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R388_SKIP_BUILD!=='1')await import('./build-r388.mjs');
const [html,js,sw,rel,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v388.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r388-home-foryou-final.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR388Marker='home-series-first-complete+movies-all-1381+foryou-direct-strict-no-empty-actions'","cinetracker_home_series_v385","cinetracker_home_active_v380","cinetracker_watchlist_full_v376","cinetracker_discover_filter_v385","cinetracker_discover_fresh_v387","data-ct388-foryou","ct388-actions"])ok(src.includes(x),'missing '+x);
ok(!src.includes('data-ct378-filter'),'duplicate local ForYou filter returned');
ok(html.includes('app-v388.js')&&sw.includes('ct-web-1.0.179-r388'),'asset identity');
ok(r.version==='1.0.179'&&r.revision==='r388-official-1.0.179'&&r.scope==='home+discover-foryou-only','release identity');
console.log('WEB_R388_TEST_OK');