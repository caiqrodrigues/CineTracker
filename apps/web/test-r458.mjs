import {readFile} from 'node:fs/promises';
if(process.env.CT_R458_SKIP_BUILD!=='1')await import('./build-r458.mjs');
const [js,html,sw,rel,pkg,rootPkg,r457,r458]=await Promise.all([
 readFile('dist/app-v458.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),readFile('package.json','utf8'),readFile('../../package.json','utf8'),
 readFile('runtime-r457-final-stability.js','utf8'),readFile('runtime-r458-video-ground-truth.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R458 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.248'&&r.revision==='r458-official-1.0.248','release');
ok(p.version==='1.0.248'&&rp.version==='1.0.248','versions');
ok(html.includes('app-v458.js')&&!html.includes('app-v457.js'),'html');
ok(sw.includes('app-v458.js')&&sw.includes('ct-web-1.0.248-r458'),'sw');
ok(!r457.includes("setHomeKind457('movies');void window.__ctR456?.loadMovies"),'recursive home movie timer');
for(const need of [
 "window.__ctR458Marker='finite-home-tabs+foryou-7-swap+profile-13-half+f1-75-of-77+daily-undo'",
 'data-ct457-action="swap"','const PROFILE_LIMIT_457=13','cinetracker_f1_progress_v426',
 'data-ct426-undo','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'
])ok(js.includes(need),'missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!r458.includes(bad),'forbidden '+bad);
console.log('R458_STATIC_OK');