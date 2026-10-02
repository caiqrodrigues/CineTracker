import {readFile} from 'node:fs/promises';
if(process.env.CT_R444_SKIP_BUILD!=='1')await import('./build-r444.mjs');
const [js,rel,pkg,rootPkg,html,sw]=await Promise.all([
 readFile('dist/app-v444.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),
 readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R444 '+m)};
const r=JSON.parse(rel),local=JSON.parse(pkg),root=JSON.parse(rootPkg);
ok(r.version==='1.0.235'&&r.revision==='r444-official-1.0.235','release identity');
ok(local.version==='1.0.235'&&root.version==='1.0.235','versions');
ok(html.includes('app-v444.js')&&!html.includes('app-v437.js'),'html asset');
ok(sw.includes('ct-web-1.0.235-r444')&&sw.includes('app-v444.js'),'service worker asset');
for(const marker of ['r395','r396','r397','r398','r399','r400','r401','r402','r403','r406','r407','r408','r410'])ok(!js.includes('CineTracker Web 1.0.'+marker),'legacy runtime cutoff '+marker);
ok(js.includes('function isForYou(){return false}'),'r404 cutoff');
ok(js.includes('loadForYou(force=false){return Promise.resolve(window.__ctR309?.buildForYou?.(!!force)??false)}'),'r405 loader');
ok(js.includes('renderForYou(){return Promise.resolve(window.__ctR309?.buildForYou?.(false)??false)}'),'r405 renderer');
ok(js.includes('data-ct309-swap'),'Trocar');
ok(js.includes('window.__ctR309'),'r309 owner');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden refresh');
console.log('R444_STATIC_OK');
