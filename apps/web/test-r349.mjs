import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R349_SKIP_BUILD!=='1')await import('./build-r349.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v349.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r349-foryou-actions-compact.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R349_STATIC '+m)};
ok(r.version==='1.0.140'&&r.revision==='r349-official-1.0.140','identity');
ok(html.includes('app-v349.js')&&html.includes('app-v349.css'),'assets');
ok(js.includes("window.__ctR349Marker='foryou-actions-live+compact-cards+heart-inside-poster'"),'marker');
ok(runtime.includes("window.__ctR336EarlyHandle=earlyHandle349"),'early capture ownership missing');
ok(runtime.includes("window.__ctR336?.swapForYou?.(name)"),'Trocar action missing');
ok(runtime.includes("window.__ctR336?.persistForYou?.(action)"),'persist action missing');
ok(js.includes("await addWatchlist(type,id)"),'Watchlist backend persistence missing');
ok(js.includes("await markSeen(type,id)"),'Seen backend persistence missing');
ok(js.includes("optimisticRotate336(action,media)"),'optimistic rotation missing');
ok(runtime.includes("gap','6px")&&runtime.includes("flex-basis',w"),'compact spacing missing');
ok(runtime.includes("top','8px")&&runtime.includes("right','8px")&&runtime.includes("bottom','auto"),'heart inside poster missing');
ok(r.discover_foryou_actions==='early-capture-owned+optimistic-immediate+backend-persist','action contract');
ok(r.discover_foryou_spacing==='slot-width-equals-poster+6px-gap','spacing contract');
ok(r.discover_foryou_heart==='inside-poster-top-right','heart contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R349_STATIC_OK');