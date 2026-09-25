import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R377_SKIP_BUILD!=='1')await import('./build-r377.mjs');
const [html,js,sw,rel,r376,r321]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v377.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r376-home-watchlist-foryou-final.js'),'utf8'),readFile(resolve('runtime-r321-discover-profile-history.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR377Marker='native-watch-sort+rich-movie-meta+home-timeout-cache-fallback+foryou-physical-owner'","rpc('cinetracker_home_payload_v334'","Home mantida em cache","app-v377.js"])ok(js.includes(x)||html.includes(x),'missing '+x);
for(const x of ["data-ct376-sort-native","ct274MovieMeta","IntersectionObserver","Promise.all(kinds.map","window.addEventListener('pointerdown'"])ok(r376.includes(x),'r376 missing '+x);
ok(r321.includes("hasExisting=allFy321(existing).length>0"),'r321 still erases valid Pra Voce');
ok(js.includes("rpc('cinetracker_home_payload_v334',{p_today"),'r377 Home v334 RPC missing');
ok(!js.includes("rpc('cinetracker_home_payload_v359',{p_today"),'slow v359 Home RPC still active');
ok(js.includes("document.documentElement.dataset.ct377HomeFallback='cache'"),'cached Home failure fallback missing');
ok(sw.includes('ct-web-1.0.168-r377'),'service worker identity');
ok(r.version==='1.0.168'&&r.revision==='r377-official-1.0.168','release identity');
console.log('WEB_R377_TEST_OK');