import {readFile} from 'node:fs/promises';
if(process.env.CT_R454_SKIP_BUILD!=='1')await import('./build-r454.mjs');

const [js,html,sw,rel,pkg,rootPkg]=await Promise.all([
 readFile('dist/app-v454.js','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8')
]);

const ok=(v,m)=>{if(!v)throw new Error('R454 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);

ok(r.version==='1.0.244'&&r.revision==='r454-official-1.0.244','release');
ok(p.version==='1.0.244'&&rp.version==='1.0.244','versions');
ok(html.includes('app-v454.js')&&!html.includes('app-v453.js'),'html asset');
ok(sw.includes('app-v454.js')&&sw.includes('ct-web-1.0.244-r454'),'service worker');
ok(js.includes('async function checkRelease161('),'release checker preserved');
ok(js.includes('async function globalSearch('),'globalSearch preserved');
ok(!js.includes("__ctR453ReleaseGuard"),'destructive r453 guard removed');
for(const hook of ["checkRelease161('focus')","checkRelease161('visible')","checkRelease161('navigation')","checkRelease161('interval')","checkRelease161('boot')"])ok(!js.includes(hook),'automatic hook removed '+hook);
ok(!js.includes('location.replace(u.toString())'),'release location.replace removed');
ok(js.includes("window.__ctR454Marker='boot-recovered-preserve-runtime'"),'r454 marker');
ok(js.includes("window.__ctR452Marker='f1-current-season-home+series-to-sports-database-sync'"),'r452 F1 preserved');
ok(js.includes('cinetracker_home_series_v452'),'r452 Home/F1 authority preserved');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden reload');
console.log('R454_STATIC_OK');
