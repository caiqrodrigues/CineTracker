import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R330_SKIP_BUILD!=='1')await import('./build-r330.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v330.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R330_STATIC '+m)};
ok(r.version==='1.0.121'&&r.revision==='r330-official-1.0.121','identity');
ok(html.includes('app-v330.js')&&html.includes('app-v330.css'),'assets');
ok(js.includes("window.__ctR330Marker='home-r274-scroll+discover-demand-only+foryou-actions-owned'"),'runtime marker');
ok(js.includes("window.__ctR330EnsureForYouActions=ensureForYouActions330"),'ForYou action owner missing');
ok(js.includes("max-height:min(55vh,520px)"),'r274 history viewport missing');
ok(js.includes("overflow-y:auto"),'history internal scroll missing');
ok(!js.includes("recentP.then(()=>null).then(()=>freshP)"),'Pra voce still waits for unrelated recent loader');
ok(!js.includes("qa('.ct291-card-footer,.ct295-card-footer,.ct288-state,.ct301-watch-action,.ct308-actions,.ct309-actions',root).forEach(x=>x.remove());"),'r310 still deletes ForYou actions');
ok((js.split('schedulePrefetch329();').length-1)===0,'r329 background prefetch calls still active');
ok(js.includes("await wave([1,2,3])")&&js.includes("await wave([4,5])"),'Top10 two-wave loader missing');
ok(!js.includes("const raw=await topRaw321(provider,force),a=await exact321([...raw.movies,...raw.series])"),'Top10 still double-filters after fill');
ok(js.includes("rpc('cinetracker_discover_filter_v324'"),'v324 personal exclusion authority missing');
ok(js.includes("function normalizeHomeHistory327(){return window.__ctR330NormalizeHomeHistory?.()||false}"),'r327 Home normalizer still owns layout');
ok(js.includes("function normalizeHistory328(){return window.__ctR330NormalizeHomeHistory?.()||false}"),'r328 Home normalizer still owns layout');
ok(r.home_history==='preloaded-internal-scroll-oldest-top-newest-bottom','Home history release');
ok(r.home_history_toggle===false&&r.home_history_page_anchor===false,'Home history toggle/anchor release');
ok(r.discover_navigation==='cache-first-demand-only'&&r.discover_prefetch==='disabled-on-navigation','Discover demand-only release');
ok(r.discover_foryou_actions==='owned-rebuilt-3-buttons-one-row','ForYou actions release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v324','filter authority release');
ok(r.discover_top10==='two-wave-concurrent+max-two-filter-rpcs+fill-ten','Top10 release');
ok(r.profile_watchlist_counts==='r324-preserved-exact','Profile Watchlist regression');
ok(r.home_episode_live_reconcile==='r325-preserved','episode sync regression');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R330_STATIC_OK');
