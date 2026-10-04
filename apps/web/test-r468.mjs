import {readFile} from 'node:fs/promises';
if(process.env.CT_R468_SKIP_BUILD!=='1')await import('./build-r468.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime,r467,source]=await Promise.all([
 readFile('dist/app-v468.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r468-canonical-runtime-bridge.js','utf8'),
 readFile('runtime-r467-profile-history-recovery.js','utf8'),readFile('index.html','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R468 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.258'&&r.revision==='r468-official-1.0.258','release');
ok(p.version==='1.0.258'&&rp.version==='1.0.258','versions');
ok(html.includes('app-v468.js')&&!html.includes('app-v467.js')&&sw.includes('app-v468.js')&&sw.includes('ct-web-1.0.258-r468'),'assets');
ok(source.includes('let ctSession = null;')&&source.includes('async function sbRpc(name, body = {})'),'canonical source contract changed');
for(const need of ["window.__ctR468Marker='canonical-ctSession-sbRpc-route-bridge'",'typeof ctSession','typeof sbRpc',"window.rpc=rpc468","window.route=route468","Object.defineProperty(window,'session'",'window.__ctR399?.settle?.(true)','window.__ctR464?.activate?.()','window.__ctR467?.applyProfile?.()'])ok(runtime.includes(need),'bridge missing '+need);
for(const need of ['const PROFILE_LIMIT=13','cinetracker_profile_actors_v465','data-ct467-undo="1"','cinetracker_activity_items_by_day_v426','cinetracker_unmark_history_item_v426','parent.insertBefore(row,next)'])ok(r467.includes(need),'r467 behavior missing '+need);
ok(runtime.includes("if(norm(b.textContent).includes('ver mais'))b.style.display='none'"),'native profile header more not suppressed');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'target loaders missing from final bundle');
console.log('R468_STATIC_OK');
