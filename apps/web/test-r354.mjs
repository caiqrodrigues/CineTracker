import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R354_SKIP_BUILD!=='1')await import('./build-r354.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v354.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r354-foryou-actions-sports-sync.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R354_STATIC '+m)};
ok(r.version==='1.0.145'&&r.revision==='r354-official-1.0.145','identity');
ok(html.includes('app-v354.js')&&html.includes('app-v354.css'),'assets');
ok(js.includes("window.__ctR354Marker='foryou-actions-live-first-capture+sports-manual-sync+future-window'"),'marker');
ok(js.includes("const direct354=window.__ctR354DirectClick;"),'first capture not patched');
ok(runtime.includes("if(!btn.dataset.ct336Media&&key)btn.dataset.ct336Media=key"),'button metadata repair missing');
ok(runtime.includes("if(window.__ctR352?.action?.(btn))return true"),'r352 local action not preferred');
ok(runtime.includes("if(ok){event?.preventDefault?.();"),'unhandled click still consumed');
ok(js.includes("syncSportsWindow340(day340(3),day340(5))")&&js.includes("syncSportsWindow340(day340(6),day340(9))"),'every-open future window incomplete');
ok(runtime.includes("data-ct354-sports-sync")||runtime.includes("ct354SportsSync"),'manual sports button missing');
ok(runtime.includes("futureRanges354")&&runtime.includes("[[-3,-1],[0,2],[3,5],[6,9]]"),'sports ranges missing');
ok(r.discover_foryou_click_owner==='r354-first-branch-before-r351-r352','click owner contract');
ok(r.sports_manual_sync==='header-button-restored','sports button contract');
ok(r.sports_every_open_window==='past-3+future-9-days','sports window contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R354_STATIC_OK');