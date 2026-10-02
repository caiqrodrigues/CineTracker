import {readFile} from 'node:fs/promises';
if(process.env.CT_R437_SKIP_BUILD!=='1')await import('./build-r437.mjs');
const [js,rel,pkg,rootPkg,html,sw]=await Promise.all([
 readFile('dist/app-v437.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R437 '+m)};
const r=JSON.parse(rel),local=JSON.parse(pkg),root=JSON.parse(rootPkg);
ok(r.version==='1.0.228'&&r.revision==='r437-official-1.0.228','release identity');
ok(local.version==='1.0.228'&&root.version==='1.0.228','versions');
ok(html.includes('app-v437.js')&&!html.includes('app-v435.js'),'html asset');
ok(sw.includes('ct-web-1.0.228-r437')&&sw.includes('app-v437.js'),'service worker asset');
ok(js.includes('h.__ctR437ForYouMarkup===next'),'stable DOM paint');
ok(js.includes("!h.querySelector('.ct309-loading')"),'loading guard');
ok(js.includes('data-ct309-swap'),'Trocar action');
ok(!js.includes('window.__ctR436ForYouBuildPromise'),'invalid r436 wrapper absent');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden refresh');
console.log('R437_STATIC_OK');
