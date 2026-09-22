import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R327_SKIP_BUILD!=='1')await import('./build-r327.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v327.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R327_STATIC '+m)};
ok(r.version==='1.0.118'&&r.revision==='r327-official-1.0.118','identity');
ok(html.includes('app-v327.js')&&html.includes('app-v327.css'),'assets');
ok(js.includes("window.__ctR327Marker='home-page-scroll-reset+foryou-flex-filters+top10-ten-grid+providers-clean+fast-nav'"),'runtime marker');
ok(js.includes("window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'"),'r325 episode sync lost');
ok(js.includes("rpc('cinetracker_discover_filter_v326'"),'strict v326 authority lost');
ok(js.includes("for(const page of [3,4])"),'ForYou single parallel refill missing');
ok(!js.includes("for(let page=1;page<=5&&!enough();page++)"),'old sequential ForYou refill still active');
ok(js.includes("await consume([1,2,3])")&&js.includes("await consume([4,5])"),'batched Top10 fetch missing');
ok(!js.includes("for(let page=1;page<=5&&(movies.length<10||series.length<10);page++)"),'old sequential Top10 loop still active');
ok(js.includes("filter(p=>!/(mubi|looke|loki)/i.test"),'Mubi/Looke filter missing');
ok(js.includes("grid-template-columns:repeat(10,minmax(0,1fr))"),'ten-card grid missing');
ok(js.includes("display:flex!important;flex-flow:row nowrap!important;grid-template-columns:none!important"),'ForYou flex-row actions missing');
ok(js.includes("scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})"),'Home outer-scroll reset missing');
ok(r.home_history_inner_scroll===false,'Home inner scroll not disabled');
ok(r.home_tab_switch==='reset-to-first-normal-section-every-series-movies-switch','Home tab reset release');
ok(r.discover_foryou_actions==='watchlist+seen+swap-flex-one-row-minimal','ForYou action release');
ok(r.discover_top10_layout==='10-cards-visible-grid','Top10 layout release');
ok(r.discover_top10_excluded_providers==='Mubi+Looke','provider exclusion release');
ok(r.profile_watchlist_counts==='r324-preserved-exact'&&r.profile_watchlist_sort==='r324-preserved','profile good fixes lost');
ok(r.home_episode_live_reconcile==='r325-preserved','episode sync release lost');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R327_STATIC_OK');
