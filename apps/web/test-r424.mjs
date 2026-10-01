import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R424_SKIP_BUILD!=='1')await import('./build-r424.mjs');
const [js,html,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw,migration]=await Promise.all([
 readFile(resolve('dist/app-v424.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r424-home-profile.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20261001235000_r424_home_profile_f1.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R424 '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes('cinetracker_home_series_v424'),'Home series authority');
ok(!js.includes('cinetracker_home_series_v391'),'legacy Home series RPC removed from final bundle');
ok(js.includes("window.__ctWebBuild='1.0.215'")&&js.includes("const REVISION='r424-official-1.0.215'"),'identity');
ok(runtime.includes("window.__ctR424={version:'1.0.215'"),'r424 runtime');
ok(runtime.includes('cinetracker_profile_stats')&&runtime.includes('cinetracker_sport_stats_v421'),'Profile canonical time sources');
ok(runtime.includes('ct424-profile-list')&&runtime.includes('overflow-x:visible'),'Profile vertical list owner');
ok(runtime.includes("more.textContent='Ver mais'"),'Profile Ver mais');
ok(runtime.includes('window.__ctR399?.refreshSeries?.(true)'),'Home first-paint gate');
ok(migration.includes('cinetracker_home_series_v424')&&migration.includes('home_bucket')&&migration.includes('865'),'F1 recurring Home rule');
ok(JSON.parse(pkgRaw).version==='1.0.215'&&JSON.parse(rootPkgRaw).version==='1.0.215','versions');
ok(html.includes('app-v424.js')&&!html.includes('app-v423.js'),'html asset');
ok(sw.includes('ct-web-1.0.215-r424'),'service worker');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.215'&&rel.revision==='r424-official-1.0.215','release');
console.log('R424_STATIC_OK');