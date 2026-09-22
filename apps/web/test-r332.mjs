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
ok(js.includes("window.__ctR332Marker='home-anchor-settle+foryou-final-owner+discover-cache-safe+episode-pointer-repair'"),'runtime marker');
ok(js.includes("document.documentElement.dataset.ct332FyAuditing='1'"),'ForYou audit guard missing');
ok(js.includes("window.__ctR329.paintForYou()"),'r329 final ForYou owner missing');
ok(js.includes("const finalAuthority=await exact321([...watch,...fresh]);"),'final ForYou audit missing');
ok(js.includes("sourceTask332=new Map()"),'Discover source request dedupe missing');
ok(js.includes("prefetchPublic332"),'public background prefetch missing');
ok(js.includes("prefetchTop332"),'Top10 prefetch missing');
ok(!js.includes("window.addEventListener('cinetracker:data-changed',()=>{sourceCache.clear();topCache.clear();"),'personal change still clears raw source cache');
ok(js.includes("topCache.clear();if(routeNow()==='discover')setTimeout(()=>void loadDiscover321(String(discover?.tab||'foryou'),false),50)"),'personal change does not re-audit cache-safe');
ok(js.includes("repairStaleNext332"),'episode pointer repair missing');
ok(js.includes("sessionStorage.removeItem(key)"),'failed TV refresh remains throttled');
ok(js.includes("grid-template-columns:repeat(3,minmax(0,1fr))"),'three action row missing');
ok(r.home_history_behavior==='normal-flow-above-anchor+zero-history-sliver-at-entry+newest-nearest-anchor','Home history release');
ok(r.home_anchor==='settle-under-home-tabs+cancel-on-user-scroll','Home anchor release');
ok(r.home_episode_pointer==='never-before-last-watched+background-current-tmdb-reconcile','episode pointer release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v326','Discover authority changed');
ok(r.discover_foryou_owner==='r329-after-final-v326-audit-only','ForYou owner release');
ok(r.discover_public_source_cache==='preserved-across-personal-data-changes+dedup-concurrent','Discover cache release');
ok(r.discover_foryou_actions==='watchlist+seen+swap-three-compact-one-row','ForYou actions release');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R332_STATIC_OK');
