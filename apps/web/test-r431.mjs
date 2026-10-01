import {readFile} from 'node:fs/promises';
if(process.env.CT_R431_SKIP_BUILD!=='1')await import('./build-r431.mjs');
const [js,rt,rel,pkg,rootPkg,html,sw]=await Promise.all([
 readFile('dist/app-v431.js','utf8'),
 readFile('runtime-r431-discover-foryou-stable.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R431 '+m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh(']) ok(!rt.includes(bad),'forbidden '+bad);
ok(!rt.includes('cinetracker:data-changed')&&!rt.includes("addEventListener('online'"),'automatic refresh triggers removed');
ok(rt.includes("owner:'r309'")&&rt.includes('ct309-swap'),'r309 sole owner');
ok(!js.includes('window.__ctR430')&&!js.includes('const recentP=Promise.resolve(S.loadRecent296?.())'),'retired r430/recent blocker absent');
ok(js.includes('window.__ctR431')&&js.includes('window.__ctR309'),'assembled owner');
ok(js.includes('data-ct309-swap'),'swap actions');
ok(JSON.parse(pkg).version==='1.0.222'&&JSON.parse(rootPkg).version==='1.0.222','versions');
const r=JSON.parse(rel);ok(r.version==='1.0.222'&&r.revision==='r431-official-1.0.222'&&r.scope==='discover-foryou-only','release');
ok(html.includes('app-v431.js')&&!html.includes('app-v430.js'),'html');
ok(sw.includes('ct-web-1.0.222-r431')&&sw.includes('app-v431.js'),'service worker');
console.log('R431_STATIC_OK');
