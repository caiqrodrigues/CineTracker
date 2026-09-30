import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R410_SKIP_BUILD!=='1')await import('./build-r410.mjs');
const [runtime,app,html,sw,pkg,rootPkg,releaseRaw]=await Promise.all([
 readFile(resolve('runtime-r410-discover-foryou-owner.js'),'utf8'),readFile(resolve('dist/app-v410.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const need of [
 "window.__ctR410Marker='r319-local-closure+legacy-painter-block+active-complete-actions'",
 "async function loadForYou319(force=false){\n if(window.__ctR410?.loadForYou)return window.__ctR410.loadForYou(force);",
 "async function buildForYou(force=false){\n if(window.__ctR410?.loadForYou)return window.__ctR410.loadForYou(force);",
 "function paintForYou(){\n if(window.__ctR410?.renderForYou)return window.__ctR410.renderForYou();",
 "class=\"chip ct410-action\"",
 "aria-disabled=\"false\"",
 "cinetracker_discover_foryou_v396",
 "cinetracker_discover_watch_unseen_v396",
 "cinetracker_discover_fresh_v387",
 "↻ Trocar"
])ok(app.includes(need),'missing '+need);
ok(html.includes('app-v410.js')&&!html.includes('app-v409.js'),'html asset');
ok(sw.includes('ct-web-1.0.201-r410')&&sw.includes('app-v410.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.201'&&JSON.parse(rootPkg).version==='1.0.201','packages');
const rel=JSON.parse(releaseRaw);ok(rel.scope==='discover-foryou-only'&&rel.version==='1.0.201','release scope');
console.log('R410_STATIC_OK');