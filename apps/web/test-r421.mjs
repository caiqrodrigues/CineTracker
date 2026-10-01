import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R421_SKIP_BUILD!=='1')await import('./build-r421.mjs');
const [js,html,css,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw,migration]=await Promise.all([
 readFile(resolve('dist/app-v421.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v421.css'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r421-standup-f1-profile.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('../../supabase/migrations/20261001200000_r421_standup_f1_profile.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R421 '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctWebBuild='1.0.212'")&&js.includes("const REVISION='r421-official-1.0.212'"),'identity');
ok(js.includes("window.__ctR421Marker='standup-detail-filter+f1-media-865-only+profile-watchlist-nonzero+profile-full-rails'"),'runtime marker');
ok(js.includes("window.__ctR421?.toggleF1?.(watch)")&&!js.includes("window.__ctR420?.toggleF1?.(watch)"),'F1 click owner');
ok(js.includes("const hist=[];")&&!js.includes("const hist=await loadF1History311(false);"),'F1 does not paint generic sports history');
ok(js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'Pra Voce v421 pools');
ok(runtime.includes('sanitizeForYou421')&&runtime.includes('filterRecommendations421'),'Pra Voce deep standup sanitizer');
ok(css.includes('[data-profile] .panel>.row')&&css.includes('overflow-x:auto'),'profile full rails');
ok(html.includes('app-v421.js')&&!html.includes('app-v420.js'),'html asset');
ok(sw.includes('ct-web-1.0.212-r421'),'service worker');
ok(JSON.parse(pkgRaw).version==='1.0.212'&&JSON.parse(rootPkgRaw).version==='1.0.212','versions');
for(const need of ['cinetracker_recommendation_eligible_v421','cinetracker_discover_fresh_v421','cinetracker_discover_watch_unseen_v421','cinetracker_profile_watchlist_runtime_v421','cinetracker_sport_stats_v421','cinetracker_f1_episode_watch_set_v421'])ok(migration.includes(need),'migration '+need);
ok(/stand\[ -\]\?up|stand-up|comedy special/i.test(migration),'stand-up SQL rule');
ok(migration.includes("v_media_id bigint:=865")&&!migration.includes("cinetracker_sports_watch_set_v296"),'F1 series-only SQL');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.212'&&rel.revision==='r421-official-1.0.212','release');
console.log('R421_STATIC_OK');
