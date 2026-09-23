import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R344_SKIP_BUILD!=='1')await import('./build-r344.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v344.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r344-foryou-meta-top10.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R344_STATIC '+m)};
ok(r.version==='1.0.135'&&r.revision==='r344-official-1.0.135','identity');
ok(html.includes('app-v344.js')&&html.includes('app-v344.css'),'assets');
ok(js.includes("window.__ctR344Marker='foryou-primary-genre+canonical-actions+top10-ten-up'"),'runtime marker');
ok(!js.includes("setInterval(sync,1200);sync();window.__ctV122MetadataSync=sync;"),'legacy metadata interval alive');
ok(js.includes("window.__ctV122MetadataSync=()=>{};window.__ctV122MetadataRun=()=>{};window.__ctV122MetadataDecorate=()=>{};"),'legacy metadata retirement missing');
ok(js.includes("applyForYouFilter336();window.__ctR344?.decorateForYou?.();return true;"),'r336 synchronous decoration missing');
ok(runtime.includes("return named[0]")&&runtime.includes("ids.map(id=>G[id]).find(Boolean)"),'single primary genre missing');
ok(runtime.includes("swap.textContent='↻ Trocar'"),'Trocar canonical action missing');
ok(runtime.includes("grid-template-columns:repeat(10,minmax(0,1fr))"),'ten-up Top10 CSS missing');
ok(r.discover_foryou_genres==='exactly-one-primary-genre','release genre contract');
ok(r.discover_foryou_actions==='canonical-r336-watchlist-seen-swap+swap-always-visible','release action contract');
ok(r.discover_top10_geometry==='desktop-ten-equal-columns-visible-in-viewport','release Top10 contract');
ok(r.home_startup==='fresh-payload+history+live-reconcile+metadata-hydrate-before-reveal','Home r343 changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R344_STATIC_OK');
