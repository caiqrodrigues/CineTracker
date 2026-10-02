import {readFile} from 'node:fs/promises';
if(process.env.CT_R464_SKIP_BUILD!=='1')await import('./build-r464.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime]=await Promise.all([
 readFile('dist/app-v464.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r464-discover-foryou.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R464 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.254'&&r.revision==='r464-official-1.0.254','release');
ok(p.version==='1.0.254'&&rp.version==='1.0.254','versions');
ok(html.includes('app-v464.js')&&sw.includes('app-v464.js')&&sw.includes('ct-web-1.0.254-r464'),'assets');
for(const need of ["window.__ctR464Marker='discover-foryou-visible-owner-v421'",'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct464-action="swap"','+ Watchlist','✓ Visto','↻ Trocar','Promise.allSettled','p_kind:kind'])ok(runtime.includes(need),'runtime missing '+need);
ok(js.includes("const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(fy&&routeNow()==='discover'){return}"),'r399 click owner not neutralized');
ok(js.includes("if(false&&isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){"),'r399 settle owner not neutralized');
ok(js.includes("if(false&&isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}"),'r399 data owner not neutralized');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
ok((runtime.match(/\['↻ Trocar','swap'\]/g)||[]).length===2,'Trocar specs');
ok(runtime.includes("['movie','series','anime'].map(k=>slotHtml('watch:'+k))")&&runtime.includes("['movie','series','anime'].map(k=>slotHtml('fresh:'+k))"),'seven-slot composition');
console.log('R464_STATIC_OK');
