import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R428_SKIP_BUILD!=='1')await import('./build-r428.mjs');
const [js,runtime,releaseRaw,pkgRaw,rootPkgRaw,html,sw]=await Promise.all([
 readFile(resolve('dist/app-v428.js'),'utf8'),
 readFile(resolve('runtime-r427-discover-foryou-visible-owner.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R428 '+m)};
new Function(runtime);
for(const bad of["new MutationObserver","setInterval(","while(true)","window.location.reload(","router.refresh("])ok(!runtime.includes(bad),'forbidden '+bad);
ok(runtime.includes('data-ct388-foryou'),'recognizes live r388 renderer');
ok(runtime.includes('__ctR388LoadForYou'),'recovers r388 loader');
ok(runtime.includes("b.dataset.ct388Action==='swap'"),'recognizes native r388 swap');
ok(runtime.includes('ct428-action'),'reactivates visible swap');
ok(runtime.includes('aria-disabled'),'active button state');
ok(JSON.parse(pkgRaw).version==='1.0.219'&&JSON.parse(rootPkgRaw).version==='1.0.219','versions');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.219'&&rel.revision==='r428-official-1.0.219'&&rel.scope==='discover-foryou-only','release');
ok(html.includes('app-v428.js')&&!html.includes('app-v427.js'),'html');
ok(sw.includes('ct-web-1.0.219-r428')&&sw.includes('app-v428.js'),'service worker');
ok(js.includes('window.__ctR428')&&js.includes('data-ct388-foryou')&&js.includes('ct428-action'),'assembled runtime');
console.log('R428_STATIC_OK');
