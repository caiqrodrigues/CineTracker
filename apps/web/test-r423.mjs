import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R423_SKIP_BUILD!=='1')await import('./build-r423.mjs');
const [js,html,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw,migration]=await Promise.all([
 readFile(resolve('dist/app-v423.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r423-f1-hard-sync.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20261001220000_r423_f1_hard_sync.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R423 '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctWebBuild='1.0.214'")&&js.includes("const REVISION='r423-official-1.0.214'"),'identity');
ok(js.includes("window.__ctR423Marker='f1-hard-owner-series+sports+f1hub+dual-time+direct-lexical-delegation'"),'runtime marker');
ok(js.includes("Number(btn?.dataset?.mediaId)===865&&window.__ctR423?.markSeriesF1"),'r285/r284 direct Series delegate');
ok(js.includes("window.__ctR423?.toggleF1Hub?.(watch)"),'F1 Hub direct click owner');
ok(js.includes("window.__ctR423?.scheduleF1Sync"),'F1 Hub direct state sync');
ok(js.includes('data-sport-slug=')&&js.includes('window.__ctR423?.ownsSport?.(btn)')&&js.includes('window.__ctR423.sportRpc(btn,args423)'),'Sports direct F1 delegate');
ok(!js.includes("ct285Mark=markSeriesF1422")&&!js.includes("ct285Mark=markF1417")&&!js.includes("ct285Mark=markF1"),'obsolete Series owner assignments removed');
ok(runtime.includes("rpc('cinetracker_f1_map_replace_v423'")&&runtime.includes("rpc('cinetracker_f1_watch_sync_v423'")&&runtime.includes("rpc('cinetracker_f1_reconcile_v423'"),'r423 RPCs');
ok(runtime.includes('const locks423=new WeakSet()'),'synchronous action lock');
ok(migration.includes('create table if not exists public.f1_episode_map_v423'),'server map');
ok(migration.includes('cinetracker_f1_map_replace_v423')&&migration.includes('cinetracker_f1_watch_sync_v423')&&migration.includes('cinetracker_f1_reconcile_v423'),'server authorities');
ok(migration.includes("if v_event.sport_slug='formula_1' then")&&migration.includes("return public.cinetracker_f1_watch_sync_v423("),'generic Sports provider route synchronizes F1');
ok(migration.includes('public.cinetracker_f1_episode_watch_set_v421')&&migration.includes('public.cinetracker_sport_mark_watched_v1('),'dual persistence');
ok(JSON.parse(pkgRaw).version==='1.0.214'&&JSON.parse(rootPkgRaw).version==='1.0.214','versions');
ok(html.includes('app-v423.js')&&!html.includes('app-v422.js'),'html asset');
ok(sw.includes('ct-web-1.0.214-r423'),'service worker');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.214'&&rel.revision==='r423-official-1.0.214','release');
console.log('R423_STATIC_OK');
