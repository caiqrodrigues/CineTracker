import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R371_SKIP_BUILD!=='1')await import('./build-r371.mjs');
const [html,js,sw,rel,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v371.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r371-home-tab-owner.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR371Marker='home-tab-user-only+repaint-preserved+async-generation-cancel'","const tabRef={current:'series'}","tabController=new AbortController()","window.__ctR332CancelHomeAsync?.()","const base=paintHome","const base=ct275PaintHome"])ok(src.includes(x),'missing '+x);
ok(js.includes("window.__ctR332CancelHomeAsync=()=>{episodeRun++;cancelHomeTimers332();return episodeRun}"),'r332 cancel hook missing');
ok(html.includes('app-v371.js')&&sw.includes('ct-web-1.0.162-r371'),'asset identity');
ok(r.version==='1.0.162'&&r.revision==='r371-official-1.0.162','release identity');
console.log('WEB_R371_TEST_OK');