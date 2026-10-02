import {readFile} from 'node:fs/promises';
if(process.env.CT_R434_SKIP_BUILD!=='1')await import('./build-r434.mjs');
const [js,rel,pkg,rootPkg,html,sw]=await Promise.all([
 readFile('dist/app-v434.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),
 readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R434 '+m)};
const r=JSON.parse(rel),local=JSON.parse(pkg),root=JSON.parse(rootPkg);
ok(r.version==='1.0.225'&&r.revision==='r434-official-1.0.225','release identity');
ok(local.version==='1.0.225'&&root.version==='1.0.225','versions');
ok(html.includes('app-v434.js')&&!html.includes('app-v433.js'),'html asset');
ok(sw.includes('ct-web-1.0.225-r434')&&sw.includes('app-v434.js'),'service worker asset');
ok(js.includes("window.__ctR434={version:'1.0.225'"),'r434 marker');
ok(js.includes("s.tab='foryou';s.type='all'"),'first-click state');
ok(js.includes("window.__ctR309")&&js.includes('data-ct309-swap'),'r309 owner/actions');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden refresh');
console.log('R434_STATIC_OK');