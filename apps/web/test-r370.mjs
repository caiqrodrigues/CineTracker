import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R370_SKIP_BUILD!=='1')await import('./build-r370.mjs');
const [html,js,sw,rel,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v370.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r370-prefilter-swap.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR370Marker='prefilter-direct-pick+sync-ref-lock+single-fetch-no-recursion'","const swapLockRef={current:false}","rows(candidatePool).filter","Math.floor(Math.random()*eligibleItems.length)","swapLockRef.current=true","swapLockRef.current=false","new AbortController()","REQUEST_TIMEOUT_MS=3000"])ok(src.includes(x),'missing '+x);
const start=src.indexOf('async function handleSwap('),end=src.indexOf('\nfunction meta(',start),body=src.slice(start,end);
ok(start>=0&&end>start,'handleSwap body unavailable');
ok(!/\bwhile\s*\(/.test(body),'while in handleSwap');
ok(!/\bdo\s*\{/.test(body),'do-while in handleSwap');
ok(!/handleSwap\s*\(/.test(body.replace('async function handleSwap(meta)','')),'recursive handleSwap');
ok(!/for\s*\(/.test(body),'explicit for-loop in handleSwap');
ok(html.includes('app-v370.js')&&sw.includes('ct-web-1.0.161-r370'),'asset identity');
ok(r.version==='1.0.161'&&r.revision==='r370-official-1.0.161','release identity');
console.log('WEB_R370_TEST_OK');