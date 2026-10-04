import {readFile} from 'node:fs/promises';

if(process.env.CT_R471_SKIP_BUILD!=='1')await import('./build-r471.mjs');

const [js,html,css,sw,rel,pkg,rootPkg,runtime,discover,actorsSql,historySql]=await Promise.all([
 readFile('dist/app-v471.js','utf8'),
 readFile('dist/index.html','utf8'),
 readFile('dist/app-v471.css','utf8'),
 readFile('dist/service-worker.js','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),
 readFile('../../package.json','utf8'),
 readFile('runtime-r471-closure-authority.js','utf8'),
 readFile('runtime-r464-discover-foryou.js','utf8'),
 readFile('../../supabase/migrations/20261002212000_r465_profile_actors_summary.sql','utf8'),
 readFile('../../supabase/migrations/20261001223000_r426_profile_history_f1_stability.sql','utf8')
]);

const ok=(v,m)=>{if(!v)throw new Error('R471 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);

ok(r.version==='1.0.261'&&r.revision==='r471-official-1.0.261','release');
ok(p.version==='1.0.261'&&rp.version==='1.0.261','versions');
ok(html.includes('app-v471.js')&&!html.includes('app-v464.js')&&sw.includes('app-v471.js')&&sw.includes('ct-web-1.0.261-r471'),'assets');

ok(js.includes('window.__ctCoreR471=Object.freeze'),'closure core bridge missing');
ok(js.includes("route:()=>route()")&&js.includes("authReady:()=>!!session?.access_token")&&js.includes("rpc:(name,args={})=>rpc(name,args)"),'core bridge is not inside lexical authority');
ok(!js.includes('data-ct461-preboot')&&!html.includes('data-ct461-preboot')&&!css.includes('data-ct461-series-gate'),'broken r461 Home visibility gate survived');
ok(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405'),'Home v452/v405 authority missing');

ok(js.includes("const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};"),'r464 route is not using core bridge');
ok(js.includes("window.__ctCoreR471?.authReady?.()")&&js.includes("window.__ctCoreR471.rpc(name,args)"),'r464 RPC is not using core bridge');
ok(js.includes("window.__ctR464Marker='discover-foryou-visible-owner-v421'"),'r464 visible owner missing');
ok(js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'v421 For You pools missing');
ok(js.includes("if(false&&isForYou()&&(q('[data-ct319-content]')"),'r399 automatic For You owner not retired');
ok(js.includes("if(false&&fy&&routeNow()==='discover')"),'r399 For You click owner not retired');
ok(js.includes("if(false&&isForYou()){fyRun++;fyTask=null;"),'r399 For You data repaint not retired');

for(const need of [
 "window.__ctR471Marker='closure-core+home-r399-visible+discover-r464-core+profile-dashboard-13+history-v426'",
 'const PROFILE_LIMIT=13',
 'cinetracker_profile_media_dashboard_v0991',
 'cinetracker_profile_actors_v465',
 'data-ct471-more',
 'cinetracker_activity_items_by_day_v426',
 'cinetracker_unmark_history_item_v426',
 'cinetracker_unmark_sport_history_v426',
 'data-ct471-undo'
])ok(runtime.includes(need),'runtime missing '+need);

ok(runtime.includes('data.slice(0,PROFILE_LIMIT)')&&runtime.includes("total>PROFILE_LIMIT?moreCard(key,total):''"),'Profile summary is not exactly 13 + one Ver mais');
ok(runtime.includes("const undoLocks=new WeakSet()")&&runtime.includes('if(row)row.remove()')&&runtime.includes('parent.insertBefore(row,next'), 'history undo lacks lock/optimistic rollback');
ok(runtime.includes('grid-template-columns:auto minmax(0,1fr) auto')&&runtime.includes('width:30px!important'),'history undo is not compact/same-row');
ok(runtime.includes('aspect-ratio:2/3!important')&&runtime.includes('text-overflow:ellipsis!important'),'Profile card geometry/title guard missing');

ok(actorsSql.includes("'count',(select count(*)::integer from src)")&&actorsSql.includes('where fa.user_id=auth.uid()'),'actor source does not expose authenticated total');
ok(historySql.includes('cinetracker_unmark_history_item_v426(p_media_id bigint'),'history bigint contract missing');

ok(!js.includes("window.__ctR468Marker='canonical-ctSession-sbRpc-route-bridge'")&&!js.includes("window.__ctR469Marker='direct-ctSession-sbRpc-owner-hooks+profile-dedupe'"),'retired global bridge runtime shipped');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval(']){
 ok(!runtime.includes(bad),'runtime forbidden '+bad);
 ok(!discover.includes(bad),'discover forbidden '+bad);
}

console.log('R471_STATIC_OK');
