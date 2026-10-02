import {readFile} from 'node:fs/promises';
if(process.env.CT_R455_SKIP_BUILD!=='1')await import('./build-r455.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime]=await Promise.all([
 readFile('dist/app-v455.js','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8'),
 readFile('runtime-r455-profile-lists-history-undo.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R455 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.245'&&r.revision==='r455-official-1.0.245','release');
ok(p.version==='1.0.245'&&rp.version==='1.0.245','versions');
ok(html.includes('app-v455.js')&&!html.includes('app-v454.js'),'html asset');
ok(sw.includes('app-v455.js')&&sw.includes('ct-web-1.0.245-r455'),'service worker');
ok(js.includes("window.__ctR455={version:'1.0.245'"),'r455 marker');
ok(js.includes('const PROFILE_LIMIT=13'),'13 cards');
ok(js.includes("flex:0 0 75px!important"),'half-card more width');
ok(js.includes('data-ct455-more'),'more control');
ok(js.includes('data-ct426-undo')&&js.includes('data-ct426-undo-sport'),'daily undo buttons preserved');
ok(js.includes('cinetracker_unmark_history_item_v426')&&js.includes('cinetracker_unmark_sport_history_v426'),'exact unwatch RPCs preserved');
ok(js.includes('window.ct171OpenActivityDay=openDay455'),'daily modal owner rebound');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctR454Marker='boot-recovered-preserve-runtime'"),'r454 boot recovery preserved');
ok(js.includes("window.__ctR452Marker='f1-current-season-home+series-to-sports-database-sync'"),'r452 F1 preserved');
console.log('R455_STATIC_OK');
