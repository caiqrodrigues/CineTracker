import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R420_SKIP_BUILD!=='1')await import('./build-r420.mjs');
const [js,html,css,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw,migration]=await Promise.all([
 readFile(resolve('dist/app-v420.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v420.css'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r420-standup-f1-profile.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('../../supabase/migrations/20261001190000_r420_standup_f1_profile.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R420 '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctWebBuild='1.0.211'")&&js.includes("const REVISION='r420-official-1.0.211'"),'identity');
ok(js.includes("window.__ctR420Marker='no-standup+f1-series-865-no-sports-mirror+profile-watchlist-minutes+no-card-slice'"),'runtime marker');
ok(js.includes("window.__ctR420?.toggleF1?.(watch)")&&!js.includes("if(watch){void toggleF1Session311(watch);return true}"),'r311 lexical F1 capture replaced');
ok(js.includes("cinetracker_discover_watch_unseen_v420")&&js.includes("cinetracker_discover_fresh_v420"),'r411 v420 pools');
ok(!js.includes('rows.slice(0,10).map(mediaCard)'),'profile cards not sliced');
ok(css.includes('[data-page="profile"] .panel>.row>.card'),'profile full rail css');
ok(html.includes('app-v420.js')&&!html.includes('app-v419.js'),'html');
ok(sw.includes('ct-web-1.0.211-r420'),'sw');
ok(JSON.parse(pkgRaw).version==='1.0.211'&&JSON.parse(rootPkgRaw).version==='1.0.211','versions');
for(const need of ['cinetracker_recommendation_eligible_v420','cinetracker_discover_fresh_v420','cinetracker_discover_watch_unseen_v420','cinetracker_profile_watchlist_runtime_v420','cinetracker_sport_stats_v420','cinetracker_f1_episode_watch_set_v420'])ok(migration.includes(need),'migration '+need);
ok(/stand\[- \]\?up|stand\\s\*up|stand-up/i.test(migration),'stand-up SQL rule');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.211'&&rel.revision==='r420-official-1.0.211','release');
console.log('R420_STATIC_OK');
