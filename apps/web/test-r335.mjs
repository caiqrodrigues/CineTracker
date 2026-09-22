import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R335_SKIP_BUILD!=='1')await import('./build-r335.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v335.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r335-home-discover-final.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R335_STATIC '+m)};
ok(r.version==='1.0.126'&&r.revision==='r335-official-1.0.126','identity');
ok(html.includes('app-v335.js')&&html.includes('app-v335.css'),'assets');
ok(js.includes("window.__ctR335Marker='home-single-anchor-tab-lock+discover-no-top-filters+foryou-final-r329'"),'runtime marker');
ok(js.includes("function armHome332(kind=activeHomeKind332()){return false}"),'r332 repeated Home anchor still active');
ok(js.includes("const lock=window.__ctR335HomeTabLock;"),'original Home tab authority does not honor r335 lock');
ok(js.includes("function scheduleHome334(kind){return false}"),'r334 Home scheduler still active');
ok(js.includes("types.innerHTML='';types.hidden=true"),'top filter removal missing');
ok(js.includes("window.__ctR329?.paintForYou?.()"),'final r329 ForYou owner missing');
ok(js.includes("data-ct329-swap"),'Trocar action contract missing');
ok(js.includes("rpc('cinetracker_discover_filter_v333'"),'strict v333 authority missing');
ok(js.includes("for(let page=1;page<=8&&(movies.length<10||series.length<10);page++)"),'Top10 progressive refill missing');
ok((runtime.match(/MutationObserver/g)||[]).length===0,'r335 introduced a mutation observer');
ok(r.home_history_behavior==='normal-flow-above-anchor+oldest-up+newest-near-anchor+no-button+no-inner-scroll','Home history release');
ok(r.home_navigation==='r335-single-anchor+tab-lock+no-settle-loop','Home navigation release');
ok(r.discover_controls==='top-filter-strip-removed-pending-new-placement','Discover top filters release');
ok(r.discover_foryou_owner==='r329-after-v333-final-audit','ForYou owner release');
ok(r.discover_foryou_filters==='removed-from-top+all-state','ForYou hidden filter state release');
ok(r.discover_foryou_actions==='watchlist+seen+swap-three-compact-one-row','ForYou actions release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v333','Discover authority release');
ok(r.discover_top10_seen==='v333-final-audit-blocks-history+play-events+progress','Top10 seen release');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R335_STATIC_OK');
