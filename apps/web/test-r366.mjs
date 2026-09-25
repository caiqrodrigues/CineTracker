import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R366_SKIP_BUILD!=='1')await import('./build-r366.mjs');
const [js,html,release,runtime]=await Promise.all([
 readFile(resolve('dist/app-v366.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8').then(JSON.parse),
 readFile(resolve('runtime-r366-foryou-authoritative-actions.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
ok(html.includes('app-v366.js'),'index missing app-v366.js');
ok(release.version==='1.0.157'&&release.revision==='r366-official-1.0.157','release mismatch');
ok(runtime.includes("[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]"),'daily/fresh action contract missing');
ok(runtime.includes("b.disabled=false"),'swap/buttons must never be disabled by pool size');
ok(runtime.includes("window.__ctR363?.handle"),'swap must delegate to refill-capable owner');
ok(js.includes("window.__ctR366Marker='foryou-authoritative-action-rows+daily-swap-always-present+refill-on-demand'"),'r366 runtime not injected');
console.log('R366_STATIC_OK');
