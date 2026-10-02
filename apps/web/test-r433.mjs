import {readFile} from 'node:fs/promises';
if(process.env.CT_R433_SKIP_BUILD!=='1')await import('./build-r433.mjs');
const [js,rel,pkg,rootPkg,html,sw]=await Promise.all([
 readFile('dist/app-v433.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R433 '+m)};
const r=JSON.parse(rel);
ok(r.version==='1.0.224'&&r.revision==='r433-official-1.0.224','release identity');
ok(JSON.parse(pkg).version==='1.0.224'&&JSON.parse(rootPkg).version==='1.0.224','versions');
ok(html.includes('app-v433.js')&&!html.includes('app-v432.js'),'html asset');
ok(sw.includes('ct-web-1.0.224-r433')&&sw.includes('app-v433.js'),'service worker asset');
ok(js.includes("window.__ctR433Marker='foryou-dynamic-discover-state'"),'marker');
ok(js.includes("const discover=dynamicProxy('__ctR288R263.discover263')"),'dynamic discover state');
ok(!js.includes('const discover=R.discover263;'),'static discover capture removed');
ok(js.includes('window.__ctR309')&&js.includes('data-ct309-swap'),'r309 owner/actions');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden refresh');
console.log('R433_STATIC_OK');
