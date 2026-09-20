import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R320_SKIP_BUILD!=='1')await import('./build-r320.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v320.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R320_STATIC '+m)};
ok(r.version==='1.0.111'&&r.revision==='r320-official-1.0.111','identity');
ok(html.includes('app-v320.js')&&html.includes('app-v320.css'),'assets');
ok(js.includes("window.__ctR320='discover-exact-candidate-filter+profile-home-history-parity'"),'runtime marker');
ok(js.indexOf('window.__ctR320EarlyCapture=true')<js.indexOf('window.__ctR319EarlyCapture=true'),'r320 capture must be first');
ok(js.includes("rpc('cinetracker_discover_filter_v320'"),'exact candidate RPC missing');
ok(js.includes("rpc('cinetracker_activity_by_day_v320'"),'activity days RPC missing');
ok(js.includes("rpc('cinetracker_activity_items_by_day_v320'"),'activity items RPC missing');
ok(js.includes('[data-ct319-item]:not([data-ct320-validated])'),'hidden-until-validated barrier missing');
ok(r.discover_validation==='each-rendered-candidate-before-visible','discover validation release');
ok(r.profile_activity_source==='watch_history-same-as-home','profile history source release');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R320_STATIC_OK exact Discover filter + Profile history parity');
