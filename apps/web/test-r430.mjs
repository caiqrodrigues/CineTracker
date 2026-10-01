import {readFile} from 'node:fs/promises';
if(process.env.CT_R430_SKIP_BUILD!=='1')await import('./build-r430.mjs');
const [js,rt,rel,pkg,rootPkg,html,sw]=await Promise.all([
 readFile('dist/app-v430.js','utf8'),readFile('runtime-r430-discover-foryou-single-renderer.js','utf8'),
 readFile('dist/release.json','utf8'),readFile('package.json','utf8'),readFile('../../package.json','utf8'),
 readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R430 '+m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!rt.includes(bad),'forbidden '+bad);
ok(rt.includes("owner:'r309'")&&rt.includes('ct309-swap'),'r309 sole owner');
ok(!js.includes('1.0.202 r411')&&!js.includes('1.0.218 r427')&&!js.includes('1.0.219 r428')&&!js.includes('1.0.220 r429'),'retired owners absent');
ok(js.includes('window.__ctR430')&&js.includes('window.__ctR309'),'assembled owner');
ok(js.includes('data-ct309-swap'),'swap actions');
ok(JSON.parse(pkg).version==='1.0.221'&&JSON.parse(rootPkg).version==='1.0.221','versions');
const r=JSON.parse(rel);ok(r.version==='1.0.221'&&r.revision==='r430-official-1.0.221'&&r.scope==='discover-foryou-only','release');
ok(html.includes('app-v430.js')&&!html.includes('app-v429.js'),'html');
ok(sw.includes('ct-web-1.0.221-r430')&&sw.includes('app-v430.js'),'service worker');
console.log('R430_STATIC_OK');