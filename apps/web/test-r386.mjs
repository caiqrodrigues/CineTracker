import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R386_SKIP_BUILD!=='1')await import('./build-r386.mjs');
const [html,js,sw,rel,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v386.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r386-home-discover-fresh-client.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR386Marker='home-discover-fresh-client+release-check+sw-update'","fetch('/release.json?ct='","navigator.serviceWorker.getRegistration()","location.reload()"])ok(src.includes(x),'missing '+x);
for(const x of ["cinetracker_home_series_v385","cinetracker_watchlist_full_v376","cinetracker_discover_filter_v385","data-ct385-action"])ok(js.includes(x),'r385 owner missing '+x);
ok(html.includes('app-v386.js')&&sw.includes('ct-web-1.0.177-r386'),'asset identity');
ok(r.version==='1.0.177'&&r.revision==='r386-official-1.0.177'&&r.home_owner==='r385-preserved'&&r.discover_foryou_owner==='r385-preserved','release identity');
console.log('WEB_R386_TEST_OK');
