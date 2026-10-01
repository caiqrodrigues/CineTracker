import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R429_SKIP_BUILD!=='1')await import('./build-r429.mjs');
const [js,runtime,releaseRaw,pkgRaw,rootPkgRaw,html,sw]=await Promise.all([
 readFile(resolve('dist/app-v429.js'),'utf8'),
 readFile(resolve('runtime-r429-discover-foryou-single-owner.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R429 '+m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh(','location.assign(','location.replace('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(runtime.includes('window.__ctR411')&&runtime.includes("owner:'r411'"),'r411 sole owner');
ok(!runtime.includes('setTimeout('),'no recovery timers');
ok(JSON.parse(pkgRaw).version==='1.0.220'&&JSON.parse(rootPkgRaw).version==='1.0.220','versions');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.220'&&rel.revision==='r429-official-1.0.220'&&rel.scope==='discover-foryou-only','release');
ok(html.includes('app-v429.js')&&!html.includes('app-v426.js'),'html');
ok(sw.includes('ct-web-1.0.220-r429')&&sw.includes('app-v429.js'),'service worker');
ok(js.includes('window.__ctR429')&&js.includes('window.__ctR411'),'assembled owner');
ok(!js.includes('ct428-action')&&!js.includes('data-ct428-action-count'),'retired r428 runtime absent');
console.log('R429_STATIC_OK');