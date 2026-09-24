import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R360_SKIP_BUILD!=='1')await import('./build-r360.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v360.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r360-foryou-repeat-clicks.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R360_STATIC '+m)};
ok(r.version==='1.0.151'&&r.revision==='r360-official-1.0.151','identity');
ok(html.includes('app-v360.js')&&html.includes('app-v360.css'),'assets');
ok(js.includes("window.__ctR360Marker='foryou-repeat-clicks+dom-state-resync+slot-stays-live'"),'marker');
ok(runtime.includes('window.__ctR359Early=early'),'physical-first hook not replaced');
ok(runtime.includes('syncVisible(name,beforeKey)'),'DOM/state resync missing');
ok(runtime.includes("z-index','30'")&&runtime.includes("pointer-events','auto'"),'post-repaint clickability missing');
ok(r.discover_foryou_actions==='repeat-click-safe+dom-state-resync+clicked-slot-only+background-persist','action contract');
ok(r.discover_foryou_repaint==='same-slot-rebind+pointer-live+no-global-reload','repaint contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R360_STATIC_OK');