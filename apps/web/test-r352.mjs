import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R352_SKIP_BUILD!=='1')await import('./build-r352.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v352.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R352_STATIC '+m)};
ok(r.version==='1.0.143'&&r.revision==='r352-official-1.0.143','identity');
ok(html.includes('app-v352.js')&&html.includes('app-v352.css'),'assets');
ok(js.includes("window.__ctR352Marker='foryou-seen-watchlist-single-slot+no-post-success-global-restore'"),'marker');
ok(js.includes("function afterAction351(ok){return ok!==false;}"),'success still triggers global restore');
ok(!js.includes("function afterAction351(ok){\n if(ok!==false)void restoreWatchlist351(true);\n}"),'old afterAction survived');
ok(js.includes("await addWatchlist(type,id)"),'Watchlist backend persistence missing');
ok(js.includes("await markSeen(type,id)"),'Seen backend persistence missing');
ok(js.includes("const before=rotateAction350(action,media,slotName)"),'optimistic clicked-slot rotation missing');
ok(r.discover_foryou_actions==='clicked-slot-optimistic+single-backend-call+no-global-success-reload','release action contract');
ok(r.discover_foryou_watch_section==='startup-restore-only-when-missing','watch section contract');
ok(r.discover_foryou_swap==='unchanged-r351','Trocar changed unexpectedly');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R352_STATIC_OK');