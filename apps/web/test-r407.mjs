import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R407_SKIP_BUILD!=='1')await import('./build-r407.mjs');
const [runtime,app,html,sw,pkg,rootPkg,releaseRaw]=await Promise.all([
 readFile(resolve('runtime-r407-home-discover-owner.js'),'utf8'),
 readFile(resolve('dist/app-v407.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const required of [
 "rpcCall('cinetracker_discover_foryou_v396'",
 "history.scrollRestoration='manual'",
 "[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']]",
 "[['seen','✓ Visto'],['swap','↻ Trocar']]",
 "for(const ms of [0,80,220,520,1000])",
 "const locks=new Set()"
])ok(runtime.includes(required),'runtime missing '+required);
ok(app.includes("rpcCall('cinetracker_home_series_v406'")||app.includes("'cinetracker_home_series_v406'"),'series authority missing');
ok(app.includes("rpcCall('cinetracker_home_movies_v405'")||app.includes("'cinetracker_home_movies_v405'"),'movie authority missing');
ok(app.includes("window.__ctWebBuild='1.0.198'")&&app.includes("const REVISION='r407-official-1.0.198'"),'identity');
ok(app.includes('queueMicrotask(()=>window.__ctR407?.enterHome?.(wanted,false))'),'r374 private click handoff');
ok(app.includes('if(window.__ctR407?.alignHome)return window.__ctR407.alignHome(kind,true);'),'r374 scroll handoff');
ok(app.includes('if(window.__ctR407?.loadForYou)return window.__ctR407.loadForYou(force);'),'legacy ForYou delegation');
ok(!app.includes('[80,300,900,2200,5000,12000,30000,46000]'),'late ForYou burst removed');
ok(html.includes('app-v407.js')&&!html.includes('app-v406.js'),'html asset');
ok(sw.includes('ct-web-1.0.198-r407')&&sw.includes('app-v407.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.198','web package version');
ok(JSON.parse(rootPkg).version==='1.0.198','root package version');
const release=JSON.parse(releaseRaw);ok(release.version==='1.0.198'&&release.revision==='r407-official-1.0.198','release identity');
console.log('R407_STATIC_OK');
