import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r369.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v369.js'),'utf8'),readFile(resolve(dist,'app-v369.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r370-prefilter-swap.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r370 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.160';window.__ctOfficialVersion='1.0.160';","window.__ctWebBuild='1.0.161';window.__ctOfficialVersion='1.0.161';",'version');
js=once(js,"const REVISION='r369-official-1.0.160';","const REVISION='r370-official-1.0.161';",'revision');
js=once(js,"const version='1.0.160',revision='r369-official-1.0.160';","const version='1.0.161',revision='r370-official-1.0.161';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v369.js','app-v370.js').replaceAll('app-v369.css','app-v370.css').replaceAll('v1.0.160','v1.0.161').replaceAll('r369-official-1.0.160','r370-official-1.0.161');
sw=sw.replaceAll('ct-web-1.0.160-r369','ct-web-1.0.161-r370').replaceAll('app-v369.js','app-v370.js').replaceAll('app-v369.css','app-v370.css');
css+='\n/* CineTracker Web 1.0.161 r370 — direct pre-filter swap with synchronous ref lock. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.161',revision:'r370-official-1.0.161',base:'r369-production',scope:'prefilter-direct-pick-swap-only',discover_swap_algorithm:'candidatePool.filter+Math.random+single-fetch',discover_swap_loops:'no-while+no-do-while+no-recursion',discover_swap_lock:'swapLockRef.current-synchronous',discover_swap_request:'AbortController+3s-timeout',discover_swap_stress:'35-sequential+40-rapid-lock-clicks',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v370.js'),js),writeFile(resolve(dist,'app-v370.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v369.js'),{force:true}),rm(resolve(dist,'app-v369.css'),{force:true})]);
console.log('WEB_R370_READY direct pre-filter swap no loops/recursion');