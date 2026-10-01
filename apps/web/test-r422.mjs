import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R422_SKIP_BUILD!=='1')await import('./build-r422.mjs');
const [js,html,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw,migration]=await Promise.all([
 readFile(resolve('dist/app-v422.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r422-f1-dual-sync.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('../../supabase/migrations/20261001210000_r422_f1_dual_series_sports_sync.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R422 '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctWebBuild='1.0.213'")&&js.includes("const REVISION='r422-official-1.0.213'"),'identity');
ok(js.includes("window.__ctR422Marker='f1-series-865+sport-history-dual-sync+series-sports-f1hub-three-way'"),'runtime marker');
ok(runtime.includes("String(path)==='rpc/cinetracker_sports_watch_set_v296'")&&runtime.includes("rawApi422('rpc/cinetracker_f1_watch_sync_v422'"),'Sports F1 interception');
ok(runtime.includes('ct285Mark=markSeriesF1422')&&runtime.includes('ct284Mark=markSeriesF1422'),'Series F1 owner');
ok(runtime.includes('window.__ctR421.toggleF1=toggleF1Hub422'),'F1 Hub owner');
ok(runtime.includes('const F1_MEDIA_ID_422=865'),'F1 series id');
ok(migration.includes('cinetracker_f1_episode_watch_set_v421')&&migration.includes('cinetracker_sport_mark_watched_v1'),'atomic dual persistence');
ok(migration.includes("sport_slug='formula_1'")&&migration.includes("'f1-dual-r422'"),'sports F1 mirror');
ok(/create or replace function public\.cinetracker_sport_stats_v421\(\)[\s\S]*where wh\.profile_id=auth\.uid\(\);/.test(migration)&&!migration.match(/cinetracker_sport_stats_v421\(\)[\s\S]{0,700}<>\s*'formula_1'/),'sports totals include F1');
ok(JSON.parse(pkgRaw).version==='1.0.213'&&JSON.parse(rootPkgRaw).version==='1.0.213','versions');
ok(html.includes('app-v422.js')&&!html.includes('app-v421.js'),'html asset');
ok(sw.includes('ct-web-1.0.213-r422'),'service worker');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.213'&&rel.revision==='r422-official-1.0.213','release');
console.log('R422_STATIC_OK');
