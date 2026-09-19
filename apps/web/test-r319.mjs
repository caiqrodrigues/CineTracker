import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R319_SKIP_BUILD!=='1')await import('./build-r319.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v319.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R319_STATIC '+m)};
ok(r.version==='1.0.110'&&r.revision==='r319-official-1.0.110','identity');
ok(html.includes('app-v319.js')&&html.includes('app-v319.css'),'assets');
ok(js.includes("window.__ctR319='discover-canonical-blocklist+fail-closed+fresh-every-tab'"),'runtime marker');
ok(js.indexOf('window.__ctR319EarlyCapture=true')<js.indexOf('window.__ctR318EarlyCapture=true'),'r319 capture must be first');
ok(js.includes("rpc('cinetracker_discover_blocked_v319',{})"),'canonical RPC missing');
ok(js.includes("if(!p?.ready)return[]"),'fail-closed strict missing');
ok(js.includes("personal319(true)"),'fresh personal load missing');
ok(r.discover_personal_authority==='cinetracker_discover_blocked_v319','release personal authority');
ok(r.discover_public_fail_mode==='fail-closed-no-personal-list-no-results','release fail mode');
ok(r.discover_calendar==='watchlist-exception-preserved','calendar exception');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R319_STATIC_OK canonical blocklist + fail-closed');
