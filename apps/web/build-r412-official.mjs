import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r412.mjs');
const [app,html,sw,pkg,rootPkg,releaseRaw,runtime,migration]=await Promise.all([
 readFile(resolve('dist/app-v412.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r412-global-recommendation-eligibility.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260930143000_r412_global_recommendation_eligibility.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(runtime.includes('const MIN_RUNTIME=40'),'40m threshold missing');
ok(/youtube originals/i.test(runtime)&&/10766/.test(runtime)&&/novela/i.test(runtime),'origin/novela filters missing');
ok(app.includes("window.__ctWebBuild='1.0.203'")&&app.includes("const REVISION='r412-official-1.0.203'"),'identity');
ok(app.includes('cinetracker_discover_watch_unseen_v412')&&app.includes('cinetracker_discover_fresh_v412'),'strict ForYou RPCs');
ok(app.includes('cinetracker_home_series_v412'),'strict Home series RPC');
ok(app.includes('window.__ctR412Eligibility.filterRows(personalCandidates'),'public discovery strict filter');
ok(app.includes('data-ct411-action="swap"')&&runtime.includes('swaps<7'),'Trocar repair missing');
ok(html.includes('app-v412.js')&&!html.includes('app-v411.js'),'html asset');
ok(sw.includes('ct-web-1.0.203-r412')&&sw.includes('app-v412.js'),'sw');
ok(JSON.parse(pkg).version==='1.0.203'&&JSON.parse(rootPkg).version==='1.0.203','packages');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.203'&&rel.revision==='r412-official-1.0.203','release');
for(const need of ['cinetracker_recommendation_eligible_v412','p_require_movie_runtime','runtime_minutes<40','youtube','10766','novela'])ok(migration.toLowerCase().includes(need.toLowerCase()),'migration missing '+need);
console.log('WEB_R412_OFFICIAL_OK');
