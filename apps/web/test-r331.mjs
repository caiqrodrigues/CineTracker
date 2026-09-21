import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R331_SKIP_BUILD!=='1')await import('./build-r331.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v331.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R331_STATIC '+m)};
ok(r.version==='1.0.122'&&r.revision==='r331-official-1.0.122','identity');
ok(html.includes('app-v331.js')&&html.includes('app-v331.css'),'assets');
ok(js.includes("window.__ctR331Marker='home-history-above-viewport+foryou-owned-actions-filters+discover-v327'"),'runtime marker');
ok(js.includes("rpc('cinetracker_discover_filter_v327'"),'v327 Discover authority missing');
ok(!js.includes("rpc('cinetracker_discover_filter_v326'"),'v326 Discover authority still active');
ok(!js.includes("qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions,.ct309-actions',root).forEach(x=>x.remove());"),'r310 still removes Pra voce actions');
ok(!js.includes(",[data-ct310-owned] .ct309-actions{display:none!important}"),'r310 still hides Pra voce actions');
ok(js.includes("for(let page=1;page<=5&&!enough()&&token===loadToken&&routeNow()==='discover'&&String(discover?.tab)==='foryou';page++){"),'ForYou loop is not navigation-bounded');
ok(js.includes("for(let page=1;page<=5&&(movies.length<10||series.length<10)&&routeNow()==='discover'&&String(discover?.tab)==='top10';page++){"),'Top10 loop is not navigation-bounded');
ok(js.includes("sort((a,b)=>new Date(b?.last_watched_at||0).getTime()-new Date(a?.last_watched_at||0).getTime()).slice(0,40)"),'recent-series reconciliation priority missing');
ok(js.includes("recentEpisode325(show?.last_episode_to_air?.air_date||unseen.air_date)"),'latest-release NOVO badge missing');
ok(js.includes("data-ct331-fy-kind"),'always-visible Pra voce filter controls missing');
ok(js.includes("flex-flow','row nowrap'"),'Pra voce no-wrap action owner missing');
ok(r.home_history_behavior==='natural-page-above-initial-viewport-oldest-top-newest-nearest-anchor','Home history contract');
ok(r.home_history_initial_anchor==='first-non-history-section-series-default','Home initial anchor contract');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v327','release Discover authority');
ok(r.discover_foryou_filter_ui==='always-visible-todos+filmes+series+animes','release filters');
ok(r.discover_foryou_actions==='owned-watchlist+seen+swap-flex-one-row-25px','release actions');
ok(r.discover_navigation==='no-background-dom-sweeps+bounded-refill-loops','release navigation');
ok(r.home_episode_live_reconcile==='recently-watched-first+latest-release-new-badge','episode sync release');
ok(r.profile_watchlist_counts==='r324-preserved-exact','Profile Watchlist regression');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R331_STATIC_OK');
