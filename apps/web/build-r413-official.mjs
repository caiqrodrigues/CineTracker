import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r413.mjs');
const [app,html,sw,pkg,rootPkg,releaseRaw,runtime,migration]=await Promise.all([
 readFile(resolve('dist/app-v413.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r413-home-foryou-reality.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260930170000_r413_reality_home_entry_foryou_actions.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(runtime.includes('REALITY_GENRE_ID=10764')&&/reality/i.test(runtime),'Reality filter missing');
ok(runtime.includes('ct413HomeEntering')&&runtime.includes('alignHomeNow'),'Home entry guard missing');
ok(runtime.includes('data-ct411-action="swap"')&&runtime.includes('↻ Trocar'),'Trocar repair missing');
ok(app.includes("window.__ctWebBuild='1.0.204'")&&app.includes("const REVISION='r413-official-1.0.204'"),'identity');
ok(app.includes('cinetracker_discover_watch_unseen_v413')&&app.includes('cinetracker_discover_fresh_v413'),'strict ForYou v413 RPCs');
ok(app.includes('cinetracker_home_series_v413'),'Home v413 RPC');
ok(app.includes('window.__ctR413Eligibility.filterRows(personalCandidates'),'public discovery r413 filter');
ok(app.includes('window.__ctR413Eligibility.filterRows(rawList'),'ForYou r413 client filter');
ok(html.includes('app-v413.js')&&!html.includes('app-v412.js'),'html asset');
ok(sw.includes('ct-web-1.0.204-r413')&&sw.includes('app-v413.js'),'sw');
ok(JSON.parse(pkg).version==='1.0.204'&&JSON.parse(rootPkg).version==='1.0.204','packages');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.204'&&rel.revision==='r413-official-1.0.204','release');
for(const need of ['cinetracker_recommendation_eligible_v413','10764','reality','cinetracker_discover_fresh_v413','cinetracker_discover_watch_unseen_v413','cinetracker_home_series_v413'])ok(migration.toLowerCase().includes(need.toLowerCase()),'migration missing '+need);
console.log('WEB_R413_OFFICIAL_OK');
