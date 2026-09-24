import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R359_SKIP_BUILD!=='1')await import('./build-r359.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v359.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r359-home-cache-actions-direct.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R359_STATIC '+m)};
ok(r.version==='1.0.150'&&r.revision==='r359-official-1.0.150','identity');
ok(html.includes('app-v359.js')&&html.includes('app-v359.css'),'assets');
ok(js.includes("window.__ctR359Marker='home-v359-cache-first+foryou-single-slot-direct-actions'"),'runtime marker');
ok(js.includes("const h=window.__ctR359Early||window.__ctR358Early;"),'physical first capture not r359');
ok(js.includes("cinetracker_home_payload_v359"),'Home v359 RPC missing');
ok(!js.includes("await primeTvState();"),'Home still blocks on TV refresh');
ok(!js.includes("await waitHomeReady({timeout:12000});"),'Home still blocks on late hydration');
ok(js.includes("void window.__ctR359?.backgroundTvRefresh?.();"),'background TV refresh missing');
ok(runtime.includes("window.__ctR359Early=early359"),'direct action owner missing');
ok(runtime.includes("renderSlot359(meta.name,{animate:true})"),'clicked-slot renderer missing');
ok(!runtime.includes("cinetracker:library-change"),'global library-change repaint event returned');
ok(runtime.includes("cinetracker_recommendation_record_v113"),'Trocar discard memory missing');
ok(runtime.includes("window.__ctR343.prepareHomePayload=fastPrepareHome359"),'fast Home prepare hook missing');
ok(runtime.includes("window.__ctR343.hydrateHomeDom=noHydrate359"),'live Home hydration still active');
ok(r.home_payload==='cinetracker_home_payload_v359','release Home payload');
ok(r.discover_foryou_repaint==='clicked-slot-only-no-library-change-event','release local repaint');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R359_STATIC_OK');
