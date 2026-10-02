import {readFile} from 'node:fs/promises';
if(process.env.CT_R451_SKIP_BUILD!=='1')await import('./build-r451.mjs');
const [js,html,sw,rel,pkg,rootPkg]=await Promise.all([
 readFile('dist/app-v451.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),readFile('package.json','utf8'),readFile('../../package.json','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R451 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.241'&&r.revision==='r451-official-1.0.241','release');
ok(p.version==='1.0.241'&&rp.version==='1.0.241','versions');
ok(html.includes('app-v451.js')&&!html.includes('app-v450.js'),'html asset');
ok(sw.includes('app-v451.js')&&sw.includes('ct-web-1.0.241-r451'),'service worker');
ok(html.indexOf("u.searchParams.has('ct_refresh')")<html.indexOf('app-v451.js'),'cleanup must run before app asset');
ok(js.includes("u.searchParams.delete('ct_refresh')"),'query removal');
ok(js.includes('history.pushState=')&&js.includes('history.replaceState='),'history navigation guard');
ok(js.includes("window.__ctR451={version:'1.0.241'"),'runtime');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden reload');
console.log('R451_STATIC_OK');
