import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R414_SKIP_BUILD!=='1')await import('./build-r414.mjs');
const [runtime,app,css,html,sw,pkg,rootPkg,releaseRaw]=await Promise.all([
 readFile(resolve('runtime-r414-foryou-swap-only.js'),'utf8'),readFile(resolve('dist/app-v414.js'),'utf8'),readFile(resolve('dist/app-v414.css'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const need of [
 "window.__ctR414Marker='foryou-swap-only-visible-functional-legacy-dom-repair'",
 "scope:'discover-foryou-swap-only'",
 'data-ct414-swap','↻ Trocar',
 "name.startsWith('watch:')?'2':'3'",
 "owner=window.__ctR411",
 "owner.swap(name)",
 "window.__ctR363.handle({action:'swap',name})",
 "name.replace(/^watch:/,'watchIndex:').replace(/^fresh:/,'freshIndex:')"
])ok(runtime.includes(need),'runtime missing '+need);
ok(app.includes("window.__ctR413Marker='no-history-flash+7-swap-owner+reality-10764+strict-r412-preserved'"),'r413 marker lost');
ok(app.includes('cinetracker_discover_watch_unseen_v413')&&app.includes('cinetracker_discover_fresh_v413')&&app.includes('cinetracker_home_series_v413'),'r413 RPCs lost');
ok(app.includes('REALITY_GENRE_ID=10764'),'reality filter lost');
ok(css.includes('.ct414-swap')&&css.includes('[data-ct414-actions="3"]')&&css.includes('[data-ct414-actions="2"]'),'swap layout css');
ok(html.includes('app-v414.js')&&!html.includes('app-v413.js'),'html');
ok(sw.includes('ct-web-1.0.205-r414'),'sw');
ok(JSON.parse(pkg).version==='1.0.205'&&JSON.parse(rootPkg).version==='1.0.205','packages');
const rel=JSON.parse(releaseRaw);ok(rel.scope==='discover-foryou-swap-only'&&rel.home==='unchanged-r413'&&rel.backend==='unchanged-v413','scope drift');
console.log('R414_STATIC_OK only missing Trocar repair; Home/backend/r413 preserved');
