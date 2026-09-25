import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R380_SKIP_BUILD!=='1')await import('./build-r380.mjs');
const [html,js,sw,rel,src,mig,r171,r291,r378]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v380.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r380-home-profile-discover.js'),'utf8'),readFile(resolve('../../supabase/migrations/20260925230000_r380_fast_home_profile_strict_discover.sql'),'utf8'),
 readFile(resolve('runtime-r171.js'),'utf8'),readFile(resolve('runtime-r291-discover-actions-favorites-scroll.js'),'utf8'),readFile(resolve('runtime-r378-regression-rollback.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR380Marker='home-active-first+watchlist-1382-sort+fresh-alias-seen+profile-direct+hearts-inside'","cinetracker_home_active_v380","cinetracker_profile_v380","cinetracker_discover_filter_v380","original_title","q('.ct378-filters',root)?.remove()","[['✓ Visto','seen'],['↻ Trocar','swap']]","[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]"])ok(src.includes(x),'r380 missing '+x);
ok(mig.includes('cinetracker_discover_filter_v380')&&mig.includes('cinetracker_profile_v380')&&mig.includes('cinetracker_home_active_v380')&&mig.includes('cinetracker_favorites_v380'),'migration incomplete');
ok(r171.includes("localStorage.getItem(key)")&&r171.includes("ct171ProviderList.slice(0,3)"),'Top10 cache/prefetch missing');
ok(r291.includes("rpc('cinetracker_favorites_v380',{})"),'favorite heart still uses heavy profile dashboard');
ok(r378.includes('__ctR380ForYouOwner'),'r378 does not delegate r380');
ok(js.includes("rpc('cinetracker_profile_v380'")&&!js.includes("rpc('cinetracker_profile_fast_v379'"),'old Profile fast RPC remains callable');
ok(html.includes('app-v380.js')&&sw.includes('ct-web-1.0.171-r380'),'asset identity');
ok(r.version==='1.0.171'&&r.revision==='r380-official-1.0.171','release identity');
console.log('WEB_R380_TEST_OK');