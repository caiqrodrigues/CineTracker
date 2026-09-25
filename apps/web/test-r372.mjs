import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R372_SKIP_BUILD!=='1')await import('./build-r372.mjs');
const [html,js,sw,rel,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v372.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r372-foryou-layout-fresh-strict.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR372Marker='foryou-flex-controls+poster-overlay-z10+fresh-strict-seen-watch-authority'","display:'flex'","'flex-wrap':'nowrap'","'z-index':'10'","isBlockedKey(k,a)","window.__ctR319?.personal?.(!!force)","window.__ctR370.fetchOnceIfNeeded"])ok(src.includes(x),'missing '+x);
ok(!js.includes("styleRow(row,poster,expected);"),'legacy r348 geometry writer still active');
ok(html.includes('app-v372.js')&&sw.includes('ct-web-1.0.163-r372'),'asset identity');
ok(r.version==='1.0.163'&&r.revision==='r372-official-1.0.163','release identity');
console.log('WEB_R372_TEST_OK');