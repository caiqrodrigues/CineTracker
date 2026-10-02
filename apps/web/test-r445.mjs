import {readFile} from 'node:fs/promises';
if(process.env.CT_R445_SKIP_BUILD!=='1')await import('./build-r445.mjs');
const [js,html,sw,rel,pkg,rootPkg]=await Promise.all([
 readFile('dist/app-v445.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),readFile('package.json','utf8'),readFile('../../package.json','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R445 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.236'&&r.revision==='r445-official-1.0.236','release');
ok(p.version==='1.0.236'&&rp.version==='1.0.236','versions');
ok(html.includes('app-v445.js')&&!html.includes('app-v444.js'),'html');
ok(sw.includes('app-v445.js')&&sw.includes('ct-web-1.0.236-r445'),'sw');
ok(js.includes('window.__ctR445={version:\'1.0.236\''),'runtime');
ok(js.includes('singleFlight:true'),'single flight');
ok(js.includes('Date.now()-lastAt<15000'),'finite guard');
ok(js.includes("u.searchParams.has('ct_refresh')"),'refresh query cleanup');
ok(js.includes("history.replaceState(history.state,'',u.pathname"),'no reload cleanup');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden reload');
console.log('R445_STATIC_OK');