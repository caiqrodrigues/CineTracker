import {readFile} from 'node:fs/promises';
if(process.env.CT_R460_SKIP_BUILD!=='1')await import('./build-r460.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime]=await Promise.all([
 readFile('dist/app-v460.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r460-final-web.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R460 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.250'&&r.revision==='r460-official-1.0.250','release');ok(p.version==='1.0.250'&&rp.version==='1.0.250','versions');
ok(html.includes('app-v460.js')&&!html.includes('app-v459.js'),'html');ok(sw.includes('app-v460.js')&&sw.includes('ct-web-1.0.250-r460'),'sw');
for(const need of [
 "window.__ctR460Marker='movies-sticky+watchlist-v405+foryou-7-swap+profile-13-half+daily-undo+f1-75-of-77-no-reconcile'",
 'cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct457-action="swap"',
 'const PROFILE_LIMIT_460=13','data-ct460-more','data-ct171-activity-day','cinetracker_f1_watch_sync_v423','cinetracker_f1_progress_v426',
 'cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'
])ok(js.includes(need),'missing '+need);
ok(!runtime.includes('__ctR423?.reconcile'),'r460 must not auto-reconcile F1 at boot');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
console.log('R460_STATIC_OK');