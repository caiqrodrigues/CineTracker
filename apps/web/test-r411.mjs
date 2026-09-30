import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R411_SKIP_BUILD!=='1')await import('./build-r411.mjs');
const [runtime,app,html,sw,pkg,rootPkg,releaseRaw]=await Promise.all([
 readFile(resolve('runtime-r411-discover-foryou-progressive.js'),'utf8'),readFile(resolve('dist/app-v411.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(!runtime.includes('cinetracker_discover_foryou_v396'),'r411 still calls composite v396');
for(const need of [
 "window.__ctR411Marker='progressive-six-pools-12s-no-composite-complete-actions'",
 "cinetracker_discover_watch_unseen_v396",
 "cinetracker_discover_fresh_v387",
 "timeout(rpcCall(name,{p_kind:type,p_limit:24}),12000)",
 "data-ct411-action",
 "↻ Trocar"
])ok(runtime.includes(need),'runtime missing '+need);
for(const n of ['396','397','398','399','400','401','402','403','404']){const raw='async function loadForYou'+n+'(force=false){',owned=raw+'if(window.__ctR411?.loadForYou)return window.__ctR411.loadForYou(force);';if(app.includes(raw))ok(app.includes(owned),'legacy '+n+' not delegated')}
ok(html.includes('app-v411.js')&&!html.includes('app-v410.js'),'html asset');
ok(sw.includes('ct-web-1.0.202-r411')&&sw.includes('app-v411.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.202'&&JSON.parse(rootPkg).version==='1.0.202','packages');
const rel=JSON.parse(releaseRaw);ok(rel.scope==='discover-foryou-only'&&rel.version==='1.0.202','release scope');
console.log('R411_STATIC_OK');
