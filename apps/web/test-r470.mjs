import {readFile} from 'node:fs/promises';

if(process.env.CT_R470_SKIP_BUILD!=='1')await import('./build-r470.mjs');

const [js,html,sw,rel,pkg,rootPkg,runtime,actorsSql,historySql]=await Promise.all([
 readFile('dist/app-v470.js','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8'),
 readFile('runtime-r470-stable-recovery.js','utf8'),
 readFile('../../supabase/migrations/20261002212000_r465_profile_actors_summary.sql','utf8'),
 readFile('../../supabase/migrations/20261001223000_r426_profile_history_f1_stability.sql','utf8')
]);

const ok=(v,m)=>{if(!v)throw new Error('R470 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);

ok(r.version==='1.0.260'&&r.revision==='r470-official-1.0.260','release');
ok(p.version==='1.0.260'&&rp.version==='1.0.260','versions');
ok(html.includes('app-v470.js')&&!html.includes('app-v469.js')&&sw.includes('app-v470.js')&&sw.includes('ct-web-1.0.260-r470'),'assets');
ok(js.includes("window.__ctR464Marker='discover-foryou-visible-owner-v421'"),'stable r464 For You owner missing');
ok(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405'),'stable Home owners missing');
ok(js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'v421 pools missing');
ok(!js.includes("window.__ctR468Marker='canonical-ctSession-sbRpc-route-bridge'")&&!js.includes("window.__ctR469Marker='direct-ctSession-sbRpc-owner-hooks+profile-dedupe'"),'broken r468/r469 runtime still shipped');
ok(js.includes("if(stats&&typeof stats==='object')patchProfileStats461(stats,sports&&typeof sports==='object'?sports:null)"),'Profile zero guard missing');
ok(!js.includes('patchProfileStats461(stats||{},sports||{})'),'Profile can still paint failed RPCs as zero');
for(const need of [
 "window.__ctR470Marker='stable-r464-aliases+profile-stats-nonzero+13-more+actors-v465+history-v426'",
 'const PROFILE_LIMIT=13',
 'data-ct470-more',
 'cinetracker_profile_actors_v465',
 'p_limit:50',
 'data-ct470-undo="1"',
 'cinetracker_activity_items_by_day_v426',
 'cinetracker_unmark_history_item_v426',
 'cinetracker_unmark_sport_history_v426'
])ok(runtime.includes(need),'runtime missing '+need);
ok(actorsSql.includes("'count',(select count(*)::integer from src)")&&actorsSql.includes('where fa.user_id=auth.uid()'),'actor source does not expose authenticated total');
ok(historySql.includes('cinetracker_unmark_history_item_v426(p_media_id bigint'),'history bigint contract missing');
ok(runtime.includes('if(row)row.remove()')&&runtime.includes('parent.insertBefore(row,next)'),'history undo is not optimistic with rollback');
ok(runtime.includes('.ct470-history-main{display:flex')&&runtime.includes('flex:0 0 28px'),'undo is not compact/same-row');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);

console.log('R470_STATIC_OK');
