import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R385_SKIP_BUILD!=='1')await import('./build-r385.mjs');
const [html,js,sw,rel,src,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v385.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r385-home-foryou-owner.js'),'utf8'),readFile(resolve('../../supabase/migrations/20260928110000_r385_home_discover_authority.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR385Marker='home-independent-series-history-movies+foryou-v385-strict+actions-final'","cinetracker_home_series_v385","cinetracker_home_history_v385","cinetracker_watchlist_full_v376","cinetracker_discover_filter_v385","ct385-actions"])ok(js.includes(x)||mig.includes(x),'missing '+x);
ok(mig.includes("p.sports_like and e.air_date")&&mig.includes("watched_keys"),'series authority incomplete');
ok(html.includes('app-v385.js')&&sw.includes('ct-web-1.0.176-r385'),'asset identity');
ok(r.version==='1.0.176'&&r.revision==='r385-official-1.0.176'&&r.scope==='home+discover-foryou-only','release identity');
ok(r.profile==='untouched'&&r.sports==='untouched'&&r.top10==='untouched'&&r.settings==='untouched','scope leak');
console.log('WEB_R385_TEST_OK');