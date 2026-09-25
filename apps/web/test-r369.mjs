import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R369_SKIP_BUILD!=='1')await import('./build-r369.mjs');
const [html,js,sw,rel]=await Promise.all([readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v369.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8')]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR369Marker='bounded-swap-no-observers+abort-3s+100ms-pick+sports-zero-refresh'","REQUEST_TIMEOUT_MS=3000","PICK_BUDGET_MS=100","new AbortController()","activeController?.abort()","MAX_SCAN=240"])ok(js.includes(x),'missing '+x);
ok(!js.includes("while(out.size<count)"),'blocking random while still shipped');
ok(!js.includes("const mo=new MutationObserver(()=>queueMicrotask(ensureAll));"),'r367 global observer still shipped');
ok(!js.includes("setTimeout(()=>{armAll();bind();warmAll()},0);"),'r363 observer boot still shipped');
for(const marker of ["source:'r296'","source:'r299'","source:'r301'"])ok(js.includes(marker),'safe sports patch missing '+marker);
const r299Start=js.indexOf('async function saveSport299('),r299End=js.indexOf('\n\n/* This listener',r299Start),r299Body=js.slice(r299Start,r299End);
ok(!r299Body.includes("render()")&&!r299Body.includes("cinetracker:data-changed"),'r299 still refreshes globally');
for(const forbidden of [
 "try{sport255.payload=null;sport255.at=0;await loadSports255(true);if(String(route())==='sports')paintSports255()}catch{}",
 "document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r296-sports-watch'}}))",
 "document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r299-stadium-simple'}}))",
 "await loadF1History301(true);closeF1Modal301();await decorateF1Calendar301(false)"
])ok(!js.includes(forbidden),'forbidden sports refresh remains: '+forbidden);
ok(html.includes('app-v369.js')&&sw.includes('ct-web-1.0.160-r369'),'asset identity');
ok(r.version==='1.0.160'&&r.revision==='r369-official-1.0.160','release identity');
console.log('WEB_R369_TEST_OK');