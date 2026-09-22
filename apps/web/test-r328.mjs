import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R328_SKIP_BUILD!=='1')await import('./build-r328.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v328.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R328_STATIC '+m)};
ok(r.version==='1.0.119'&&r.revision==='r328-official-1.0.119','identity');
ok(html.includes('app-v328.js')&&html.includes('app-v328.css'),'assets');
ok(js.includes("window.__ctR328Marker='r276-home-anchor+owned-foryou-one-row+visible-filters+strict-discover'"),'r328 marker');
ok(js.includes("window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'"),'r325 episode sync lost');
ok(js.includes("rpc('cinetracker_discover_filter_v326'"),'strict v326 authority lost');
ok(js.includes("window.__ctR328?.paintForYou?.()"),'owned ForYou paint not wired into loader');
ok(js.includes("data-ct328-fy-kind"),'always-visible ForYou filters missing');
ok(js.includes("class=\"ct328-actions\""),'owned three-button action row missing');
ok(js.includes("grid-template-columns:repeat(3,minmax(0,1fr))"),'three-button/card grid missing');
ok(js.includes("window.scrollTo({top,left:0,behavior:'auto'})"),'r276-style exact Home anchor missing');
ok(js.includes("wanted=kind==='movies'?'Assistir a seguir / Watchlist':'Assistir a seguir'"),'exact Home anchor titles missing');
ok(js.includes("await consume([1,2])")&&js.includes("await consume([3])")&&js.includes("await consume([4,5])"),'progressive Top10 fetch missing');
ok(js.includes("if(String(discover?.tab)!=='top10')return false"),'stale Top10 cancellation guard missing');
ok(r.home_history_behavior==='r276-history-above-initial-viewport-newest-nearest-content','Home history contract');
ok(r.home_initial_anchor==='series-assistir-a-seguir+movies-assistir-a-seguir-watchlist','Home exact anchor release');
ok(r.discover_foryou_renderer==='r328-owned-no-legacy-action-layout','ForYou renderer release');
ok(r.discover_foryou_filters==='always-visible-all+movies+series+anime','ForYou filters release');
ok(r.discover_foryou_actions==='watchlist+seen+swap-single-row-3-columns','ForYou action release');
ok(r.discover_public_exclusion.includes('seen+progress')&&r.discover_filter_authority==='cinetracker_discover_filter_v326','Discover rules release');
ok(r.discover_navigation==='stale-top10-stops-before-refill','navigation release');
ok(r.home_episode_live_reconcile==='r325-preserved','episode sync lost');
ok(r.profile_watchlist_counts==='r324-preserved-exact'&&r.profile_watchlist_sort==='r324-preserved','profile fixes lost');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R328_STATIC_OK');
