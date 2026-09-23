import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R352_SKIP_BUILD!=='1')await import('./build-r352.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v352.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r352-local-card-actions.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R352_STATIC '+m)};
ok(r.version==='1.0.143'&&r.revision==='r352-official-1.0.143','identity');
ok(html.includes('app-v352.js')&&html.includes('app-v352.css'),'assets');
ok(js.includes("window.__ctR352Marker='local-card-swap+no-global-repaint+optimistic-background-persist'"),'marker');
for(const forbidden of ['location.reload','window.location.reload','router.refresh','router.push','renderDiscover','loadForYou','paintForYou336'])
 ok(!runtime.includes(forbidden),'forbidden global refresh path '+forbidden);
ok(runtime.includes("event?.preventDefault?.()")&&runtime.includes("event?.stopPropagation?.()")&&runtime.includes("event?.stopImmediatePropagation?.()"),'event prevention missing');
ok(runtime.includes("renderSlot352(slotName,{animate:true})"),'local slot render missing');
ok(runtime.includes("persist352(action,type,id).then"),'background persistence missing');
ok(runtime.includes("installState352(tx.before);renderSlot352(slotName,{animate:true})"),'local rollback missing');
ok(runtime.includes("'transition-opacity','duration-300','ease-in-out'"),'transition utility classes missing');
ok(r.discover_card_actions==='local-slot-only+prevent-default+stop-propagation','local action contract');
ok(r.discover_foryou_reload==='forbidden-no-paintForYou-no-loadForYou-no-renderDiscover','no reload contract');
ok(r.discover_public_watchlist==='instant-saved-state+background-persist+no-card-swap','public Watchlist contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R352_STATIC_OK');