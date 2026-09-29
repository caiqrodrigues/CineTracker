import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R406_SKIP_BUILD!=='1')await import('./build-r406.mjs');
const [runtime,app,html,sw,pkg,migration,releaseRaw]=await Promise.all([
 readFile(resolve('runtime-r406-home-discover-final.js'),'utf8'),readFile(resolve('dist/app-v406.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../supabase/migrations/20260930010000_r406_home_series_counts.sql'),'utf8'),readFile(resolve('dist/release.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(runtime.includes("rpcCall('cinetracker_home_series_v406'"),'series v406 authority');
ok(runtime.includes("rpcCall('cinetracker_home_movies_v405'"),'movie v405 authority');
ok(runtime.includes("if(sportsLike(x)&&avail>0&&next>0)return'continue'"),'Raw/SmackDown continue override');
ok(runtime.includes('repairForYouActions'),'Pra Voce action repair');
ok(runtime.includes("[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']]"),'daily/fresh actions');
ok(runtime.includes("[['seen','✓ Visto'],['swap','↻ Trocar']]"),'watch actions');
ok(migration.includes('cinetracker_home_series_v403')&&!migration.includes("'{available_episodes}'"),'migration must preserve recent count');
ok(app.includes("window.__ctWebBuild='1.0.197'")&&app.includes("const REVISION='r406-official-1.0.197'"),'identity');
ok(html.includes('app-v406.js')&&!html.includes('app-v405.js'),'html asset');
ok(sw.includes('ct-web-1.0.197-r406')&&sw.includes('app-v406.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.197','package version');
const release=JSON.parse(releaseRaw);ok(release.version==='1.0.197'&&release.revision==='r406-official-1.0.197','release identity');
console.log('R406_STATIC_OK');
