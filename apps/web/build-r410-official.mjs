import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r410.mjs');
const [app,html,sw,pkg,rootPkg,releaseRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v410.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r410-discover-foryou-owner.js'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(app.includes("window.__ctWebBuild='1.0.201'")&&app.includes("const REVISION='r410-official-1.0.201'"),'identity');
ok(app.includes("async function loadForYou319(force=false){\n if(window.__ctR410?.loadForYou)return window.__ctR410.loadForYou(force);"),'r319 local load owner');
ok(app.includes("async function buildForYou(force=false){\n if(window.__ctR410?.loadForYou)return window.__ctR410.loadForYou(force);"),'r309 local build owner');
ok(app.includes("function paintForYou(){\n if(window.__ctR410?.renderForYou)return window.__ctR410.renderForYou();"),'r309 local paint blocked');
ok(app.includes('class="chip ct410-action"')&&app.includes('↻ Trocar'),'active complete actions');
ok(app.includes('cinetracker_discover_foryou_v396')&&app.includes('cinetracker_discover_watch_unseen_v396')&&app.includes('cinetracker_discover_fresh_v387'),'canonical sources');
ok(html.includes('app-v410.js')&&!html.includes('app-v409.js'),'html');
ok(sw.includes('ct-web-1.0.201-r410')&&sw.includes('app-v410.js'),'sw');
ok(JSON.parse(pkg).version==='1.0.201'&&JSON.parse(rootPkg).version==='1.0.201','packages');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.201'&&rel.revision==='r410-official-1.0.201'&&rel.scope==='discover-foryou-only','release');
console.log('WEB_R410_OFFICIAL_OK');