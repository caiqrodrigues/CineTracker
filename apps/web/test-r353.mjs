import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R353_SKIP_BUILD!=='1')await import('./build-r353.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v353.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r353-smart-watchlist.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R353_STATIC '+m)};
ok(r.version==='1.0.144'&&r.revision==='r353-official-1.0.144','identity');
ok(html.includes('app-v353.js')&&html.includes('app-v353.css'),'assets');
ok(js.includes("window.__ctR353Marker='watchlist-smart-weighted-random+history-affinity+recent-memory'"),'marker');
ok(js.includes("window.__ctR353PrepareWatchState?.(draft,a)||draft"),'initial smart prepare missing');
ok(js.includes("bucket==='watch'&&window.__ctR353SmartWatchIndex"),'watch swap still sequential');
ok(js.includes("next.watchIndex[kind]=window.__ctR353SmartWatchIndex?.("),'restored watchlist still index zero');
ok(runtime.includes("Math.pow(Math.max(.15,base),1.55)"),'weighted random missing');
ok(runtime.includes("historyRows353")&&runtime.includes("watchRows353"),'history/watchlist affinity missing');
ok(runtime.includes("ct:r353:watch-recent:"),'recent memory missing');
ok(r.discover_watchlist_selection==='weighted-random+history-affinity+watchlist-affinity+quality','selection contract');
ok(r.discover_watchlist_order==='not-list-order+not-index-plus-one','order contract');
ok(r.discover_watchlist_initial==='smart-weighted-random','initial contract');
ok(r.discover_watchlist_swap==='smart-weighted-random-same-kind','swap contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R353_STATIC_OK');