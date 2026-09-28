import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R390_SKIP_BUILD!=='1')await import('./build-r390.mjs');
const [html,js,sw,rel,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v390.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r388-home-foryou-final.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["function mergeLogicalSeries","cinetracker_home_active_v380","cinetracker_home_series_v389","dataset.ct390SeriesFirst='active-complete'","cinetracker_discover_fresh_v387","cinetracker_discover_filter_v389","cinetracker_discover_watch_v389"])ok(src.includes(x),'missing '+x);
ok(!src.includes("rpc('cinetracker_discover_fresh_v389'"),'slow fresh_v389 entered runtime path');
ok(js.includes("window.__ctR390Marker='home-active-first-complete+movies-1382-six-sort+foryou-fast-strict-harry-block'"),'r390 marker');
ok(html.includes('app-v390.js')&&sw.includes('ct-web-1.0.181-r390'),'asset identity');
ok(r.version==='1.0.181'&&r.revision==='r390-official-1.0.181'&&r.scope==='home+discover-foryou-only','release identity');
console.log('WEB_R390_TEST_OK');