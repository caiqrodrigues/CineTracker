import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R324_SKIP_BUILD!=='1')await import('./build-r324.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v324.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R324_STATIC '+m)};
ok(r.version==='1.0.115'&&r.revision==='r324-official-1.0.115','identity');
ok(html.includes('app-v324.js')&&html.includes('app-v324.css'),'assets');
ok(js.includes("window.__ctR324Marker='home-history-collapsed+discover-actions-compact+watchlist-complete+legacy-alias-union'"),'runtime marker');
ok(js.includes("rpc('cinetracker_discover_filter_v324'"),'v324 Discover RPC missing');
ok(!js.includes("rpc('cinetracker_discover_filter_v323'"),'v323 Discover filter still active');
ok(js.includes("data-ct324-history-toggle"),'Home history toggle missing');
ok(js.includes("data-ct324-history=\"collapsed\"")||js.includes("data-ct324-history="), 'Home collapsed contract missing');
ok(js.includes("rpc('cinetracker_watchlist_full_v119'"),'full Watchlist RPC missing');
ok(js.includes("profile_watchlist_counts")===false,'release metadata leaked into runtime expectation');
ok(js.includes("grid-template-columns:repeat(3,minmax(0,1fr))"),'Pra voce three-action row missing');
ok(js.includes(".ct319-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))"),'public two-action row missing');
ok(r.discover_filter_match==='tmdb-direct-plus-legacy-original-title-year-union','legacy union release');
ok(r.discover_foryou_actions==='watchlist+seen+swap-single-row-compact','Pra voce action release');
ok(r.home_history_initial==='series+movies-preloaded-collapsed','Home history release');
ok(r.profile_watchlist_source==='cinetracker_watchlist_full_v119-all-rows','Watchlist source release');
ok(r.profile_watchlist_counts==='rpc-exact-series+movie-counts','Watchlist count release');
ok(r.discover_top10_seen_legacy==='blocked-through-original-title-year-even-with-positive-direct-record','Top10 legacy seen release');
ok(r.web_version_ui==='1.0.115+r324-official-1.0.115','web version release');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R324_STATIC_OK');
