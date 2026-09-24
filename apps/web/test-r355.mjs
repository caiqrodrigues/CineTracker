import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R355_SKIP_BUILD!=='1')await import('./build-r355.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v355.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r355-actions-sync-hard-owner.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R355_STATIC '+m)};
ok(r.version==='1.0.146'&&r.revision==='r355-official-1.0.146','identity');
ok(html.includes('app-v355.js')&&html.includes('app-v355.css'),'assets');
ok(js.includes("window.__ctR355Marker='foryou-hard-click-owner+local-slot-only+sports-sync-always-visible'"),'marker');
ok(js.includes("const direct355=window.__ctR355DirectClick;if(typeof direct355==='function'&&direct355(t,e))return;const direct354="),'r355 not first capture');
ok(runtime.includes("window.__ctR352?.renderSlot?.(slotName,{animate:true})"),'local slot renderer missing');
ok(runtime.includes("persistBackend(action,type,id).catch"),'background persist missing');
ok(runtime.includes("install(tx.before);renderOnly(meta.name)"),'same-slot rollback missing');
ok(runtime.includes("ct355-sports-toolbar"),'sports toolbar missing');
ok(runtime.includes("data-ct355-sports-sync"),'sports sync control missing');
ok(r.discover_foryou_repaint==='clicked-slot-only','local repaint contract');
ok(r.sports_manual_sync==='dedicated-toolbar-always-visible','sports button contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R355_STATIC_OK');