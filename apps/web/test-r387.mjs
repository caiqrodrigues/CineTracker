import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R387_SKIP_BUILD!=='1')await import('./build-r387.mjs');
const [html,js,sw,rel,owner,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v387.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r385-home-foryou-owner.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260928172000_r387_home_history_fresh_fallback.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR387Marker='home-semantic-hidden-history+full-history+foryou-single-action-row+fresh-db-fallback'","cinetracker_home_history_v387","cinetracker_discover_fresh_v387","function alignHome385","function syncAction385","[class*=\"actions\"]"])ok(js.includes(x)||owner.includes(x),'missing '+x);
ok(!owner.includes("rpc('cinetracker_home_history_v385',{p_limit:50})"),'old history limit still active');
ok(mig.includes('cinetracker_home_history_v387()')&&mig.includes('cinetracker_discover_fresh_v387'),'r387 migration missing');
ok(html.includes('app-v387.js')&&sw.includes('ct-web-1.0.178-r387'),'asset identity');
ok(r.version==='1.0.178'&&r.revision==='r387-official-1.0.178'&&r.scope==='home+discover-foryou-only','release identity');
console.log('WEB_R387_TEST_OK');
