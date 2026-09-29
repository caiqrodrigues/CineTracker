import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r408.mjs');
const [app,html,sw,pkg,rootPkg,releaseRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v407.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r408-home-discover-owner.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(app.includes("window.__ctWebBuild='1.0.199'")&&app.includes("const REVISION='r408-official-1.0.199'"),'identity');
ok(app.includes('queueMicrotask(()=>window.__ctR408?.enterHome?.(wanted,false))'),'Home tab handoff');
ok(app.includes('if(window.__ctR408?.alignHome)return window.__ctR408.alignHome(kind,true);'),'Home scroll owner');
ok(app.includes('if(window.__ctR408?.loadForYou)return window.__ctR408.loadForYou(force);'),'ForYou owner');
ok(!app.includes('[80,300,900,2200,5000,12000,30000,46000]'),'late owner burst');
ok(runtime.includes("[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']]"),'three actions');
ok(runtime.includes("?[['seen','✓ Visto'],['swap','↻ Trocar']]"),'watch actions');ok(runtime.includes('scheduleOwnerCheck'),'late painter recovery');ok(runtime.includes('baseLoadMovies'),'movie direct loader');
ok(html.includes('app-v407.js')&&!html.includes('app-v406.js'),'html');ok(sw.includes('ct-web-1.0.199-r408'),'sw');
ok(JSON.parse(pkg).version==='1.0.199'&&JSON.parse(rootPkg).version==='1.0.199','packages');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.199'&&rel.revision==='r408-official-1.0.199','release');
console.log('WEB_R408_OFFICIAL_OK');
