import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R362_SKIP_BUILD!=='1')await import('./build-r362.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v362.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r362-foryou-click-owner.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R362_STATIC '+m)};
ok(r.version==='1.0.153'&&r.revision==='r362-official-1.0.153','identity');
ok(html.includes('app-v362.js')&&html.includes('app-v362.css'),'assets');
ok(js.includes("window.__ctR362Marker='foryou-real-click-owner+dom-key-fallback+clicked-slot-only'"),'marker');
ok(runtime.includes('window.__ctR358Early=early')&&runtime.includes('window.__ctR359Early=early')&&runtime.includes('window.__ctR336EarlyHandle=early'),'historical click pointers not unified');
ok(runtime.includes("validKey(q('[data-media]',slot)?.dataset?.media)"),'DOM open-button key fallback missing');
ok(runtime.includes('itemKeyFromState'),'state key fallback missing');
ok(runtime.includes("window.__ctR360?.handle?.(m)")&&runtime.includes("window.__ctR359?.handleAction?.(m)"),'current direct action paths missing');
ok(r.discover_foryou_click_owner==='r362-all-historical-pointers+dom-driven','release owner contract');
ok(r.discover_foryou_actions==='real-click+clicked-slot-only+background-persist','release action contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R362_STATIC_OK');