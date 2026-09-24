import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R363_SKIP_BUILD!=='1')await import('./build-r363.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v363.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r363-foryou-pool-refill.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R363_STATIC '+m)};
ok(r.version==='1.0.154'&&r.revision==='r363-official-1.0.154','identity');
ok(html.includes('app-v363.js')&&html.includes('app-v363.css'),'assets');
ok(js.includes("window.__ctR363Marker='foryou-pool-refill+actions-never-die+persist-even-at-last-item'"),'marker');
ok(runtime.includes("const refillTasks=new Map()"),'refill task dedupe missing');
ok(runtime.includes("pageCursor={movie:3,series:3,anime:3}"),'next-page refill cursor missing');
ok(runtime.includes("blocked.add(key)"),'session blocklist missing');
ok(runtime.includes("void persist(m.action,m.key)"),'persistence path missing');
ok(runtime.includes("void refill(m.name,{force:true})"),'exhausted-slot refill missing');
ok(runtime.includes("window.__ctR358Early=early")&&runtime.includes("window.__ctR336EarlyHandle=early"),'click ownership missing');
ok(!runtime.includes('paintForYou(')&&!runtime.includes('renderDiscover('),'global repaint forbidden');
ok(r.discover_foryou_pool_liveness==='targeted-background-refill+no-exhaustion-deadlock','pool contract');
ok(r.discover_foryou_last_item==='persist-action+same-slot-refill+no-global-repaint','last-item contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R363_STATIC_OK');