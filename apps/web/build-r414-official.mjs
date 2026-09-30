import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r414.mjs');
const [app,html,css,sw,pkg,rootPkg,releaseRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v414.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v414.css'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r414-foryou-swap-only.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const need of ['data-ct414-swap','↻ Trocar','discover-foryou-swap-only','__ctR411','legacy-dom-repair'])ok(runtime.includes(need),'runtime '+need);
ok(app.includes("window.__ctWebBuild='1.0.205'")&&app.includes("const REVISION='r414-official-1.0.205'"),'identity');
ok(app.includes("window.__ctR414Marker='foryou-swap-only-visible-functional-legacy-dom-repair'"),'r414 marker');
ok(app.includes("window.__ctR413Marker='no-history-flash+7-swap-owner+reality-10764+strict-r412-preserved'"),'r413 preservation');
ok(app.includes('cinetracker_discover_watch_unseen_v413')&&app.includes('cinetracker_discover_fresh_v413')&&app.includes('cinetracker_home_series_v413'),'r413 authorities changed');
ok(app.includes('REALITY_GENRE_ID=10764'),'reality rule changed');
ok(css.includes('.ct414-swap')&&css.includes('[data-ct414-actions="3"]')&&css.includes('[data-ct414-actions="2"]'),'swap css');
ok(html.includes('app-v414.js')&&!html.includes('app-v413.js'),'html asset');
ok(sw.includes('ct-web-1.0.205-r414')&&sw.includes('app-v414.js'),'sw');
ok(JSON.parse(pkg).version==='1.0.205'&&JSON.parse(rootPkg).version==='1.0.205','packages');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.205'&&rel.revision==='r414-official-1.0.205'&&rel.scope==='discover-foryou-swap-only','release');
console.log('WEB_R414_OFFICIAL_OK');
