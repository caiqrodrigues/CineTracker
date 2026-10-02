import {readFile} from 'node:fs/promises';
if(process.env.CT_R459_SKIP_BUILD!=='1')await import('./build-r459.mjs');
const [js,html,css,sw,rel,pkg,rootPkg,r459]=await Promise.all([
 readFile('dist/app-v459.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/app-v459.css','utf8'),readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r459-video-hard-owner.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R459 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.249'&&r.revision==='r459-official-1.0.249','release');
ok(p.version==='1.0.249'&&rp.version==='1.0.249','versions');
ok(html.includes('app-v459.js')&&!html.includes('app-v458.js')&&html.includes('data-ct459-preboot'),'html/preboot');
ok(css.includes('data-ct459-boot="1"'),'preboot css');ok(sw.includes('app-v459.js')&&sw.includes('ct-web-1.0.249-r459'),'sw');
for(const need of [
 "window.__ctR459Marker='hard-home-tabs+watchlist-v405+foryou-v421+profile-13-half+daily-undo+f1-r423-r426'",
 'cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct457-action="swap"',
 'const PROFILE_LIMIT_459=13','cinetracker_f1_watch_sync_v423','cinetracker_f1_progress_v426','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'
])ok(js.includes(need),'missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!r459.includes(bad),'forbidden '+bad);
console.log('R459_STATIC_OK');