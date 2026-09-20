import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R322_SKIP_BUILD!=='1')await import('./build-r322.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v322.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R322_STATIC '+m)};
ok(r.version==='1.0.113'&&r.revision==='r322-official-1.0.113','identity');
ok(html.includes('app-v322.js')&&html.includes('app-v322.css'),'assets');
ok(js.includes("window.__ctR322='discover-indexed-user-filter+fast-top10'"),'runtime marker');
ok(js.includes("rpc('cinetracker_discover_filter_v322'"),'indexed RPC missing');
ok(!js.includes("rpc('cinetracker_discover_filter_v320'"),'slow v320 RPC leaked');
ok(js.includes("if(typeof ct171TopRows==='function')"),'fast Top 10 source missing');
ok(js.includes("rpc('cinetracker_activity_items_by_day_v320'"),'profile history RPC missing');
ok(!js.includes('[data-ct319-item]:not([data-ct320-validated])'),'r320 hidden item gate leaked into bundle');
ok(!js.includes('[data-ct309-foryou]:not([data-ct320-validated])'),'r320 hidden foryou gate leaked into bundle');
ok(r.discover_validation==='server-before-paint','release validation mode');
ok(r.discover_loading==='visible-loader-no-hidden-content-gate','release loading mode');
ok(r.scope==='discover-only-indexed-filter-performance-and-rules','Discover-only scope');
ok(r.discover_filter_match==='indexed-logical-tmdb-key','indexed logical key');
ok(r.discover_top10_source==='ct171TopRows-session-cache','Top 10 source');
ok(r.profile_changes==='none-r322'&&r.sports_changes==='none-r322'&&r.f1_changes==='none-r322','non-Discover scope changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R322_STATIC_OK');
