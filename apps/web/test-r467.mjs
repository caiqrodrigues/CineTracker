import {readFile} from 'node:fs/promises';
if(process.env.CT_R467_SKIP_BUILD!=='1')await import('./build-r467.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime,r399,r464,actorsSql,historySql]=await Promise.all([
 readFile('dist/app-v467.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r467-profile-history-recovery.js','utf8'),
 readFile('runtime-r399-startup-stability.js','utf8'),readFile('runtime-r464-discover-foryou.js','utf8'),
 readFile('../../supabase/migrations/20261002212000_r465_profile_actors_summary.sql','utf8'),
 readFile('../../supabase/migrations/20261001223000_r426_profile_history_f1_stability.sql','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R467 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.257'&&r.revision==='r467-official-1.0.257','release');
ok(p.version==='1.0.257'&&rp.version==='1.0.257','versions');
ok(html.includes('app-v467.js')&&!html.includes('app-v464.js')&&sw.includes('app-v467.js')&&sw.includes('ct-web-1.0.257-r467'),'assets');
ok(r399.includes('cinetracker_home_series_v452')&&r399.includes('cinetracker_home_movies_v405')&&r399.includes('waitAuth399'),'stable Home owner missing');
ok(r464.includes("window.__ctR464Marker='discover-foryou-visible-owner-v421'")&&r464.includes('cinetracker_discover_watch_unseen_v421')&&r464.includes('cinetracker_discover_fresh_v421'),'stable Pra Voce owner missing');
ok(!js.includes("window.__ctR465Marker='real-device-home-discover-profile-history'")&&!js.includes("window.__ctR466Marker='r465-recovery-build-fixed+uuid-history-undo'"),'broken r465/r466 owner still shipped');
for(const need of ["window.__ctR467Marker='restore-r464-home-foryou+profile-13-more+numeric-history-undo'",'const PROFILE_LIMIT=13','data-ct467-more','cinetracker_profile_actors_v465','p_limit:50','data-ct467-undo="1"','cinetracker_activity_items_by_day_v426','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'])ok(runtime.includes(need),'runtime missing '+need);
ok(actorsSql.includes("'count',(select count(*)::integer from src)")&&actorsSql.includes('where fa.user_id=auth.uid()'),'actor source does not expose authenticated real total');
ok(historySql.includes('cinetracker_unmark_history_item_v426(p_media_id bigint')&&runtime.includes('const mediaId=num(btn.dataset.mediaId),itemType=kind'),'history media_id type does not match bigint RPC');
ok(runtime.includes('if(row)row.remove()')&&runtime.includes('parent.insertBefore(row,next)'),'history undo is not optimistic with rollback');
ok(runtime.includes('.ct467-history-main{display:flex')&&runtime.includes('flex:0 0 28px'),'undo is not compact/same-row');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
console.log('R467_STATIC_OK');
