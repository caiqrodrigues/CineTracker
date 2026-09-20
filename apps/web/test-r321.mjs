import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R321_SKIP_BUILD!=='1')await import('./build-r321.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v321.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R321_STATIC '+m)};
ok(r.version==='1.0.112'&&r.revision==='r321-official-1.0.112','identity');
ok(html.includes('app-v321.js')&&html.includes('app-v321.css'),'assets');
ok(js.includes("window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity'"),'runtime marker');
ok(js.indexOf('window.__ctR321EarlyCapture=true')<js.indexOf('window.__ctR319EarlyCapture=true'),'r321 capture must be first');
ok(js.includes("rpc('cinetracker_discover_filter_v320'"),'exact RPC missing');
ok(js.includes("rpc('cinetracker_activity_items_by_day_v320'"),'profile history RPC missing');
ok(!js.includes('[data-ct319-item]:not([data-ct320-validated])'),'r320 hidden item gate leaked into bundle');
ok(!js.includes('[data-ct309-foryou]:not([data-ct320-validated])'),'r320 hidden foryou gate leaked into bundle');
ok(r.discover_validation==='server-before-paint','release validation mode');
ok(r.discover_loading==='visible-loader-no-hidden-content-gate','release loading mode');
ok(r.profile_activity_source==='watch_history-same-as-home','profile history source');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R321_STATIC_OK');
