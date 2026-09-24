import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R356_SKIP_BUILD!=='1')await import('./build-r356.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v356.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r356-actions-sports-payload.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R356_STATIC '+m)};
ok(r.version==='1.0.147'&&r.revision==='r356-official-1.0.147','identity');
ok(html.includes('app-v356.js')&&html.includes('app-v356.css'),'assets');
ok(js.includes("window.__ctR356Marker='foryou-actions-dom-key-fallback+sports-authoritative-payload-repaint'"),'marker');
ok(js.includes("window.__ctR356SportsBridge={state:sport255,load:loadSports255,paint:paintSports255,rows:sportRows255};"),'Sports bridge missing');
ok(runtime.includes("validKey(btn.dataset.ct336Media)||domKey(slot)||keyOf(slotStateItem(name))"),'DOM media fallback missing');
ok(runtime.includes("syncStateToVisible(name,key)"),'visible/state resync missing');
ok(runtime.includes("window.__ctR355DirectClick=directClick356"),'earliest dynamic click ownership missing');
ok(runtime.includes("b.state.payload=null;b.state.at=0"),'Sports cache reset missing');
ok(runtime.includes("const payload=await b.load(true)"),'Sports authoritative reload missing');
ok(runtime.includes("if(routeNow()==='sports')b.paint()"),'Sports repaint missing');
ok(r.discover_foryou_actions==='dom-key-fallback+state-resync+local-slot-only+background-persist','action contract');
ok(r.sports_payload==='r255-authoritative-bridge+forced-reload-after-sync','sports payload contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R356_STATIC_OK');