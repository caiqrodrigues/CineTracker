import {readFile} from 'node:fs/promises';
if(process.env.CT_R453_SKIP_BUILD!=='1')await import('./build-r453.mjs');

const [js,html,sw,rel,pkg,rootPkg]=await Promise.all([
 readFile('dist/app-v453.js','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8')
]);

const ok=(v,m)=>{if(!v)throw new Error('R453 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);

ok(r.version==='1.0.243'&&r.revision==='r453-official-1.0.243','release');
ok(p.version==='1.0.243'&&rp.version==='1.0.243','versions');
ok(html.includes('app-v453.js')&&!html.includes('app-v452.js'),'html asset');
ok(sw.includes('app-v453.js')&&sw.includes('ct-web-1.0.243-r453'),'service worker');
ok(js.includes("async function checkRelease161(reason='manual'){return false}"),'release checker inert');
ok(js.includes("window.__ctR453Marker='legacy-release-location-replace-disabled'"),'marker');
ok(!js.includes("u.searchParams.set('ct_refresh'"),'ct_refresh setter removed');
ok(!js.includes("location.replace(u.toString())"),'release location.replace removed');
for(const hook of ["checkRelease161('focus')","checkRelease161('visible')","checkRelease161('navigation')","checkRelease161('interval')","checkRelease161('boot')"])ok(!js.includes(hook),'automatic hook removed '+hook);
ok(js.includes("window.__ctR452Marker='f1-current-season-home+series-to-sports-database-sync'"),'r452 F1 preserved');
ok(js.includes('cinetracker_home_series_v452'),'r452 Home/F1 authority preserved');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden reload');
console.log('R453_STATIC_OK');
