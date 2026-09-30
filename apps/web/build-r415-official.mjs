import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r415.mjs');
const [app,html,css,sw,pkg,rootPkg,releaseRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v415.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v415.css'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r415-home-foryou-profile-stability.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const need of ['ct415HomeEntering','data-ct415-swap','↻ Trocar','cinetracker_profile_v380'])ok(runtime.includes(need),'runtime '+need);
ok(app.includes("window.__ctWebBuild='1.0.206'")&&app.includes("const REVISION='r415-official-1.0.206'"),'identity');
ok(app.includes("window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile'"),'r415 marker');
ok(css.includes('.ct415-actions')&&css.includes('.ct415-swap'),'r415 css');
ok(html.includes('app-v415.js')&&!html.includes('app-v414.js'),'html asset');
ok(sw.includes('ct-web-1.0.206-r415')&&sw.includes('app-v415.js'),'sw');
ok(JSON.parse(pkg).version==='1.0.206'&&JSON.parse(rootPkg).version==='1.0.206','packages');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.206'&&rel.revision==='r415-official-1.0.206','release');
console.log('WEB_R415_OFFICIAL_OK');