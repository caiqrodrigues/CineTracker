import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R333_SKIP_BUILD!=='1')await import('./build-r333.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v333.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R333_STATIC '+m)};
ok(r.version==='1.0.124'&&r.revision==='r333-official-1.0.124','identity');
ok(html.includes('app-v333.js')&&html.includes('app-v333.css'),'assets');
ok(js.includes("window.__ctR333Marker='home-v333+discover-direct-controls+top10-final-audit+sports-background-warmup'"),'runtime marker');
ok(js.includes("rpc('cinetracker_home_payload_v333'"),'Home v333 RPC missing');
ok(!js.includes("rpc('cinetracker_profile_home_payload_v0997_r6'"),'old Home RPC still active');
ok(js.includes("rpc('cinetracker_discover_filter_v333'"),'Discover v333 RPC missing');
ok(!js.includes("rpc('cinetracker_discover_filter_v326'"),'old Discover filter still active');
ok(js.includes("for(let page=1;page<=8&&(movies.length<10||series.length<10);page++)"),'Top10 progressive fill missing');
ok(js.includes("data-ct319-prev],[data-ct319-next],[data-ct319-filter"),'obsolete Discover controls removal missing');
ok(js.includes("grid-template-columns:repeat(3,minmax(0,1fr))"),'three-button ForYou row missing');
ok(js.includes("ct-sports-sync"),'sports startup sync missing');
ok(js.includes("previous-3-days+today-next-2-days")===false,'release marker should not be in JS code assumptions');
ok(r.home_payload==='cinetracker_home_payload_v333','Home release authority');
ok(r.home_movie_watchlist==='released+unseen-only+fresh-watchlist-v119','movie Watchlist rule');
ok(r.home_navigation==='short-anchor-settle+no-subtree-scroll-observer','Home navigation rule');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v333','Discover authority');
ok(r.discover_controls==='direct-inline-filters+no-prev-next-filter-trigger','Discover controls release');
ok(r.discover_foryou_actions==='watchlist+seen+swap-three-compact-one-row','ForYou actions release');
ok(r.discover_prefetch==='on-demand-no-eager-network-storm','Discover prefetch release');
ok(r.discover_top10==='progressive-eight-pages-until-ten+v333-audit','Top10 release');
ok(r.sports_startup==='warm-payload+background-provider-sync-every-open','sports startup release');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R333_STATIC_OK');
