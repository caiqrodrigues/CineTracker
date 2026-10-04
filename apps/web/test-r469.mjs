import {readFile} from 'node:fs/promises';
if(process.env.CT_R469_SKIP_BUILD!=='1')await import('./build-r469.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime,r399,r464,r467]=await Promise.all([
 readFile('dist/app-v469.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r469-direct-current-runtime.js','utf8'),
 readFile('runtime-r399-startup-stability.js','utf8'),readFile('runtime-r464-discover-foryou.js','utf8'),readFile('runtime-r467-profile-history-recovery.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R469 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.259'&&r.revision==='r469-official-1.0.259','release');
ok(p.version==='1.0.259'&&rp.version==='1.0.259','versions');
ok(html.includes('app-v469.js')&&!html.includes('app-v468.js')&&sw.includes('app-v469.js')&&sw.includes('ct-web-1.0.259-r469'),'assets');
for(const need of ["window.__ctR469Marker='direct-ctSession-sbRpc-owner-hooks+profile-dedupe'",'typeof ctSession','typeof sbRpc','window.__ctR469Route=route469','window.__ctR469Rpc=rpc469'])ok(runtime.includes(need),'runtime missing '+need);
for(const src of [r399,r464,r467]){ok(src.includes("typeof window.__ctR469Route==='function'"),'route hook missing');ok(src.includes('window.__ctR469Rpc'),'rpc hook missing')}
ok(r399.includes('cinetracker_home_series_v452')&&r399.includes('cinetracker_home_movies_v405'),'Home authorities missing');
ok(r464.includes('cinetracker_discover_watch_unseen_v421')&&r464.includes('cinetracker_discover_fresh_v421'),'For You authorities missing');
for(const need of ['const PROFILE_LIMIT=13','cinetracker_profile_actors_v465',"qa('button',row)","headerMore.style.display='none'",'rpcCall467(\'cinetracker_activity_items_by_day_v426\'','rpcCall467(\'cinetracker_unmark_history_item_v426\'','data-ct467-undo="1"'])ok(r467.includes(need),'Profile/history behavior missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
console.log('R469_STATIC_OK');