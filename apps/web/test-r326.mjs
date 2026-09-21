import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R326_SKIP_BUILD!=='1')await import('./build-r326.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v326.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R326_STATIC '+m)};
ok(r.version==='1.0.117'&&r.revision==='r326-official-1.0.117','identity');
ok(html.includes('app-v326.js')&&html.includes('app-v326.css'),'assets');
ok(js.includes("window.__ctR326Marker='home-history-scroll-up+discover-compact-actions+strict-v326'"),'runtime marker');
ok(js.includes("rpc('cinetracker_discover_filter_v326'"),'v326 Discover RPC missing');
ok(!js.includes("rpc('cinetracker_discover_filter_v324'"),'v324 Discover RPC still active');
ok(js.includes("c.movie>=5&&c.series>=3&&c.anime>=3"),'Pra voce refill threshold missing');
ok(js.includes("window.__ctR309Test.composeForYou(watch,fresh,{}, {trust:true})"),'Pra voce recomposition missing');
ok(js.includes("html[data-ct326-fy-filtering=\"1\"] [data-ct309-foryou]"),'forbidden-draft flash guard missing');
ok(js.includes("[data-home] [data-ct275-history-toggle]"),'old Home history toggle suppression missing');
ok(js.includes("stack.scrollTop=stack.scrollHeight"),'Home history auto-bottom missing');
ok(js.includes("grid-template-columns','repeat(3,minmax(0,1fr))"),'Pra voce inline 3-column force missing');
ok(r.home_history_behavior==='always-rendered-scroll-oldest-top-newest-bottom-auto-bottom','Home history release');
ok(r.home_history_toggle===false,'Home history toggle release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v326','Discover authority release');
ok(r.discover_foryou==='exact-watchlist-unseen+strict-fresh-refill-before-paint','Pra voce release');
ok(r.discover_foryou_actions==='watchlist+seen+swap-one-row-compact','Pra voce action release');
ok(r.home_episode_live_reconcile==='r325-preserved','episode sync regression');
ok(r.profile_watchlist_counts==='r324-preserved-exact','Watchlist regression');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R326_STATIC_OK');
