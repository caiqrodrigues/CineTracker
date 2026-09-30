import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r411.mjs');
const [app,html,sw,pkg,rootPkg,releaseRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v411.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r411-discover-foryou-progressive.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(!runtime.includes('cinetracker_discover_foryou_v396'),'composite v396 active in r411 runtime');
ok(runtime.includes("window.__ctR411Marker='progressive-six-pools-12s-no-composite-complete-actions'"),'r411 marker');
ok(runtime.includes("timeout(rpcCall(name,{p_kind:type,p_limit:24}),12000)"),'bounded 12s direct pools');
ok(app.includes("window.__ctWebBuild='1.0.202'")&&app.includes("const REVISION='r411-official-1.0.202'"),'identity');
for(const n of ['396','397','398','399','400','401','402','403','404']){const raw='async function loadForYou'+n+'(force=false){',owned=raw+'if(window.__ctR411?.loadForYou)return window.__ctR411.loadForYou(force);';if(app.includes(raw))ok(app.includes(owned),'legacy '+n+' not delegated')}
ok(app.includes('data-ct411-action')&&app.includes('↻ Trocar'),'complete actions');
ok(html.includes('app-v411.js')&&!html.includes('app-v410.js'),'html');
ok(sw.includes('ct-web-1.0.202-r411')&&sw.includes('app-v411.js'),'sw');
ok(JSON.parse(pkg).version==='1.0.202'&&JSON.parse(rootPkg).version==='1.0.202','packages');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.202'&&rel.revision==='r411-official-1.0.202'&&rel.scope==='discover-foryou-only','release');
console.log('WEB_R411_OFFICIAL_OK');
