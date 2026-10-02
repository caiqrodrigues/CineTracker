import {readFile} from 'node:fs/promises';
if(process.env.CT_R452_SKIP_BUILD!=='1')await import('./build-r452.mjs');
const [js,html,sw,rel,pkg,rootPkg,migration]=await Promise.all([
 readFile('dist/app-v452.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),readFile('package.json','utf8'),readFile('../../package.json','utf8'),
 readFile('../../supabase/migrations/20261002113000_r452_f1_true_series_sync.sql','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R452 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.242'&&r.revision==='r452-official-1.0.242','release');
ok(p.version==='1.0.242'&&rp.version==='1.0.242','versions');
ok(html.includes('app-v452.js')&&!html.includes('app-v451.js'),'html asset');
ok(sw.includes('app-v452.js')&&sw.includes('ct-web-1.0.242-r452'),'service worker');
ok(js.includes('cinetracker_home_series_v452')&&!js.includes('cinetracker_home_series_v425'),'Home F1 authority');
ok(js.includes('function normalizeF1Home425(){return false}'),'legacy 1280 runtime disabled');
ok(js.includes("window.__ctR452Marker='f1-current-season-home+series-to-sports-database-sync'"),'runtime marker');
ok(migration.includes('cinetracker_home_series_v452')&&migration.includes('trg_f1_series_to_sports_v452'),'migration authority');
ok(migration.includes("'f1-dual-r452'")&&migration.includes('on conflict(profile_id,event_id)'),'sports mirror');
ok(!js.includes('window.location.reload(')&&!js.includes('router.refresh('),'forbidden reload');
console.log('R452_STATIC_OK');
