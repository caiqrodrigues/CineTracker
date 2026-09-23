import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R350_SKIP_BUILD!=='1')await import('./build-r350.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v350.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r350-foryou-actions-direct.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R350_STATIC '+m)};
ok(r.version==='1.0.141'&&r.revision==='r350-official-1.0.141','identity');
ok(html.includes('app-v350.js')&&html.includes('app-v350.css'),'assets');
ok(js.includes("window.__ctR350Marker='foryou-direct-actions+optimistic-first+backend-second'"),'marker');
ok(runtime.includes("window.__ctR336EarlyHandle=earlyHandle350"),'early capture ownership');
ok(runtime.includes("next.dailyIndex=(normalizeIndex350(next.dailyIndex,pool.length)+1)%pool.length"),'daily direct swap');
ok(runtime.includes("next[bucket+'Index'][kind]=(normalizeIndex350(next[bucket+'Index'][kind],pool.length)+1)%pool.length"),'bucket direct swap');
ok(runtime.includes("next[bucket+'Pools'][kind]=removeKey350"),'seen direct removal');
ok(runtime.includes("next.freshPools[kind]=removeKey350"),'watchlist direct removal');
ok(runtime.includes("await addWatchlist(type,id)"),'real Watchlist persistence');
ok(runtime.includes("await markSeen(type,id)"),'real seen persistence');
ok(runtime.includes("installState350(before);repaint350(slotName)"),'failure rollback');
ok(runtime.includes("pointer-events:auto!important"),'clickable action overlay fix');
ok(r.discover_foryou_actions==='direct-state-mutation+optimistic-first+backend-second','action contract');
ok(r.discover_foryou_click_owner==='r350-via-r336-early-capture','click contract');
ok(r.discover_foryou_failure==='rollback+authoritative-refresh','rollback contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R350_STATIC_OK');