import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R419_SKIP_BUILD!=='1')await import('./build-r419.mjs');
const [js,html,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v419.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r419-f1-owner-bind.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R419 '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctWebBuild='1.0.210'")&&js.includes("const REVISION='r419-official-1.0.210'"),'identity');
ok(js.includes("window.__ctR418Marker='preboot-home-anchor+semantic-7-swap+profile-v418-stats+f1-hub-series-865'"),'r418 hard fixes retained');
ok(runtime.includes("toggleF1Session311=function(btn){return window.__ctR418?.toggleF1?.(btn)||false}")&&runtime.includes('openRace311=wrapped'),'legacy F1 capture rebound');
ok(html.includes('app-v419.js')&&!html.includes('app-v418.js'),'html');
ok(sw.includes('ct-web-1.0.210-r419'),'sw');
ok(JSON.parse(pkgRaw).version==='1.0.210'&&JSON.parse(rootPkgRaw).version==='1.0.210','versions');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.210'&&rel.revision==='r419-official-1.0.210','release');
console.log('R419_STATIC_OK');
