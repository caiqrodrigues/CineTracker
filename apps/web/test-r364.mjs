import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R364_SKIP_BUILD!=='1')await import('./build-r364.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v364.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r364-foryou-no-freeze.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R364_STATIC '+m)};
ok(r.version==='1.0.155'&&r.revision==='r364-official-1.0.155','identity');
ok(html.includes('app-v364.js')&&html.includes('app-v364.css'),'assets');
ok(js.includes("window.__ctR364Marker='foryou-single-click-owner+legacy-observers-retired+no-freeze'"),'marker');
ok((js.match(/r364 retired observer/g)||[]).length===6,'expected six retired action observers');
ok(runtime.includes("window.__ctR358Early=early")&&runtime.includes("window.__ctR359Early=early")&&runtime.includes("window.__ctR336EarlyHandle=early"),'single owner aliases missing');
ok(!runtime.includes('MutationObserver'),'r364 must not add observer');
ok(r.discover_foryou_click_owner==='r364-single-physical-owner','owner contract');
ok(r.discover_foryou_observers==='r348+r349+r360+r361+r362+r363-action-observers-retired','observer contract');
ok(r.discover_foryou_refill==='startup-once+targeted-after-action','refill contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R364_STATIC_OK');