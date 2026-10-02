import {readFile} from 'node:fs/promises';
if(process.env.CT_R436_SKIP_BUILD!=='1')await import('./build-r436.mjs');
const [js,rel,pkg,rootPkg,html,sw]=await Promise.all([
 readFile('dist/app-v436.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R436 '+m)};
const r=JSON.parse(rel),local=JSON.parse(pkg),root=JSON.parse(rootPkg);
ok(r.version==='1.0.227'&&r.revision==='r436-official-1.0.227','release identity');
ok(local.version==='1.0.227'&&root.version==='1.0.227','versions');
ok(html.includes('app-v436.js')&&!html.includes('app-v435.js'),'html asset');
ok(sw.includes('ct-web-1.0.227-r436')&&sw.includes('app-v436.js'),'service worker asset');
ok(js.includes('window.__ctR436ForYouBuildPromise'),'single-flight build guard');
ok(js.includes('h.__ctR436ForYouMarkup===next'),'stable DOM paint');
ok(js.includes('data-ct309-swap'),'Trocar action');
ok(js.includes('Descobrir > Pra Você'),'scope marker');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden refresh');
console.log('R436_STATIC_OK');
