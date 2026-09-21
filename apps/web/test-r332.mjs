import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R332_SKIP_BUILD!=='1')await import('./build-r332.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v332.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R332_STATIC '+m)};
ok(r.version==='1.0.123'&&r.revision==='r332-official-1.0.123','identity');
ok(html.includes('app-v332.js')&&html.includes('app-v332.css'),'assets');
ok(js.includes("window.__ctR332Marker='home-v332-watchlist+natural-history+foryou-compact+top10-ten-grid-no-looke-mubi'"),'runtime marker');
ok(js.includes("rpc('cinetracker_home_payload_v332'"),'Home v332 payload missing');
ok(js.includes("rpc('cinetracker_discover_filter_v327'"),'v327 Discover authority missing');
ok(!js.includes("rpc('cinetracker_discover_filter_v326'"),'v326 Discover authority still active');
ok(js.includes("testBridge?.watchRows"),'Pra voce canonical Watchlist testable owner missing');
ok(js.includes("testBridge?.freshPage"),'Pra voce fresh-page owner missing');
ok(js.includes("token===loadToken&&routeNow()==='discover'&&String(discover?.tab)==='foryou'"),'Pra voce navigation abort missing');
ok(js.includes("routeNow()==='discover'&&String(discover?.tab)==='top10'"),'Top10 navigation abort missing');
ok(js.includes("window.__ctR332?.settleForYou"),'swap final layout settle missing');
ok(js.includes("['looke','mubi']"),'Looke/Mubi provider exclusion missing');
ok(js.includes("grid-template-columns:repeat(10,minmax(0,1fr))"),'Top10 ten-column desktop layout missing');
ok(js.includes("width:var(--ct-media-card-w,158px)"),'Pra voce action width lock missing');
ok(js.includes("flex-flow:row nowrap"),'Pra voce nowrap layout missing');
ok(r.home_payload==='cinetracker_home_payload_v332','Home payload release');
ok(r.home_movie_watchlist==='watchlist-full-v119-latest-added','Home Watchlist release');
ok(r.home_history_behavior==='natural-page-above-initial-viewport-oldest-top-newest-nearest-anchor','Home history release');
ok(r.home_history_toggle===false&&r.home_history_inner_scroll===false,'Home history contract');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v327','Discover authority release');
ok(r.discover_foryou_filter_ui==='always-visible-todos+filmes+series+animes','Pra voce filters release');
ok(r.discover_foryou_actions==='three-compact-buttons-card-width-one-row','Pra voce actions release');
ok(r.discover_top10_providers==='without-looke+mubi','Top10 providers release');
ok(r.discover_top10_layout==='ten-columns-no-horizontal-scroll-desktop','Top10 layout release');
ok(r.home_episode_live_reconcile==='r325-preserved','episode sync regression');
ok(r.profile_watchlist_counts==='r324-preserved-exact','Profile Watchlist regression');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R332_STATIC_OK');
