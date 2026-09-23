import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R351_SKIP_BUILD!=='1')await import('./build-r351.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v351.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r351-foryou-click-watchlist.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R351_STATIC '+m)};
ok(r.version==='1.0.142'&&r.revision==='r351-official-1.0.142','identity');
ok(html.includes('app-v351.js')&&html.includes('app-v351.css'),'assets');
ok(js.includes("window.__ctR351Marker='foryou-first-capture-direct+watchlist-source-restore'"),'runtime marker');
ok(js.includes("const direct=window.__ctR351DirectClick;if(typeof direct==='function'&&direct(e.target,e))"),'earliest capture not patched');
ok(runtime.includes("window.__ctR351DirectClick=directClick351"),'direct click export missing');
ok(runtime.includes("cinetracker_watchlist_full_v119"),'watchlist source missing');
ok(runtime.includes("cinetracker_discover_filter_v320"),'watchlist eligibility filter missing');
ok(runtime.includes("window.__ctR350?.action?.(action)"),'direct action missing');
ok(runtime.includes("window.__ctR350?.swap?.(name)"),'direct swap missing');
ok(r.discover_foryou_click_owner==='r351-direct-first-branch-inside-r336-earliest-capture','click contract');
ok(r.discover_foryou_watch_section==='restore-from-authoritative-watchlist-when-missing','watch section contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R351_STATIC_OK');