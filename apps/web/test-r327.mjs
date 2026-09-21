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
ok(js.includes("window.__ctR327Marker='home-r276-anchor+foryou-flex-actions+hard-filters+discover-v327'"),'runtime marker');
ok(js.indexOf('window.__ctR327EarlyCapture=true')<js.indexOf('window.__ctR321EarlyCapture=true'),'r327 capture must be first');
ok(js.includes("rpc('cinetracker_discover_filter_v327'"),'v327 Discover RPC missing');
ok(!js.includes("rpc('cinetracker_discover_filter_v326'"),'v326 Discover RPC still active');
ok(js.includes("max-height:none!important;height:auto!important;overflow:visible!important"),'natural Home history CSS missing');
ok(js.includes("window.scrollTo({top:top,left:0,behavior:'auto'})"),'Home initial anchor missing');
ok(js.includes("swap.classList.remove('ct309-swap')"),'swap legacy class removal missing');
ok(js.includes("row.style.setProperty('display','flex','important')"),'hard flex action layout missing');
ok(js.includes("st.fyKind=String(fy.dataset.ct319FyKind||'all')"),'hard ForYou filter click missing');
ok(r.home_history_behavior==='r276-full-history-above-initial-viewport-oldest-top-newest-bottom','Home release');
ok(r.home_history_toggle===false&&r.home_history_inner_scroll===false,'Home hidden history contract');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v327','Discover authority release');
ok(r.discover_foryou_filter_ui==='hard-capture-todos+filmes+series+animes','ForYou filter release');
ok(r.discover_foryou_actions==='watchlist+seen+swap-flex-one-row-25px','ForYou action release');
ok(r.home_episode_live_reconcile==='r325-preserved','episode sync regression');
ok(r.profile_watchlist_counts==='r324-preserved-exact','Watchlist regression');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R327_STATIC_OK');
