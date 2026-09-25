import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R378_SKIP_BUILD!=='1')await import('./build-r378.mjs');
const [html,js,sw,rel,r378,r377,r321,r376]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v378.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r378-regression-rollback.js'),'utf8'),readFile(resolve('runtime-r377-video-ground-truth.js'),'utf8'),readFile(resolve('runtime-r321-discover-profile-history.js'),'utf8'),readFile(resolve('runtime-r376-home-watchlist-foryou-final.js'),'utf8')
]);
const release=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(js.includes("rpc('cinetracker_home_payload_v359',{p_today:"),'v359 Home RPC not restored');
ok(!js.includes("rpc('cinetracker_home_payload_v334',{p_today:"),'r377 v334 Home regression still active');
for(const x of ["window.__ctR378Marker='home-v359-cache-first+semantic-anchor+foryou-isolated-dom-owner'","data-ct378-foryou","ct378-actions","snapshot-first","window.__ctR378LoadForYou=loadForYou"])ok(r378.includes(x),'r378 missing '+x);
ok(r377.includes('retiredInteractiveOwner:true'),'r377 interactive owner not retired');
ok(r321.includes("if(typeof window.__ctR378LoadForYou==='function')return window.__ctR378LoadForYou"),'r321 does not delegate');
ok(r376.includes("typeof window.__ctR378LoadForYou!=='function'"),'r376 startup still races r378');
ok(html.includes('app-v378.js')&&sw.includes('ct-web-1.0.169-r378'),'asset identity');
ok(release.version==='1.0.169'&&release.revision==='r378-official-1.0.169'&&release.home_payload==='cinetracker_home_payload_v359','release identity');
console.log('WEB_R378_TEST_OK');
