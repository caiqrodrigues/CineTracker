import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R391_SKIP_BUILD!=='1')await import('./build-r391.mjs');
const [html,js,sw,rel,src,m1,m2,m3]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v391.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r388-home-foryou-final.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260928223425_r391_home_foryou_fast_authorities.sql'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260928223916_r391_filter_alias_all_duplicates.sql'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260928224049_r391_history_recent_fast.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["cinetracker_home_series_v391","cinetracker_home_history_v391","cinetracker_discover_filter_v391","cinetracker_discover_watch_v391","function normalizeBucket391","setTimeout(()=>void refreshTv391(false),80)"])ok(src.includes(x),'missing '+x);
ok(!/loadSeries[\s\S]{0,5000}enrichSeries\(/.test(src),'client episode enrichment still blocks Home first paint');
ok(!src.includes("rpc('cinetracker_discover_fresh_v387'")&&!src.includes("rpc('cinetracker_discover_fresh_v389'"),'slow DB Fresh path still active');
ok(m1.includes("show_tmdb_id,season_number,episode_number")&&m1.includes("287620,1,10"),'Stuart S1E10 catalog seed missing');
ok(m2.includes("select * from exact_match union select * from alias_match"),'Harry alias duplicate union missing');
ok(m3.includes("ep_canonical as materialized")&&!m3.includes("left join lateral"),'history fast canonicalization missing');
ok(js.includes("window.__ctR391Marker='home-first-paint-authority+history-fast+foryou-strict-fast'"),'r391 marker');
ok(html.includes('app-v391.js')&&sw.includes('ct-web-1.0.182-r391'),'asset identity');
ok(r.version==='1.0.182'&&r.revision==='r391-official-1.0.182'&&r.scope==='home+discover-foryou-only','release identity');
console.log('WEB_R391_TEST_OK');