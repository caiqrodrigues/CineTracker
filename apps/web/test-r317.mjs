import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R317_SKIP_BUILD!=='1')await import('./build-r317.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v317.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R317_STATIC '+m)};
ok(r.version==='1.0.108'&&r.revision==='r317-official-1.0.108','identity');
ok(html.includes('app-v317.js')&&html.includes('app-v317.css'),'assets');
ok(js.includes("window.__ctR317='profile-watchlist-hard-click+exact-order-singular-alias'"),'runtime marker');
ok(js.indexOf('window.__ctR317EarlyCapture=true')<js.indexOf('window.__ctR316EarlyCapture=true'),'r317 capture must be first');
ok(js.includes("return l==='filmes watchlist'?'movie':l==='series watchlist'?'series':''"),'label-direct Watchlist resolver missing');
ok(js.includes('tempo de filme em watchlist'),'singular movie Watchlist time alias missing');
ok(js.includes("window.__ctR316.openWatchlist"),'full Watchlist opener missing');
ok(r.profile_stats_order==='r317-exact-ten-singular-plural-aliases','release order');
ok(r.profile_watchlist_stats==='clickable-by-label-first-capture','release Watchlist click contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R317_STATIC_OK movie Watchlist hard-click + exact order alias');
