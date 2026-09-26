import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R382_SKIP_BUILD!=='1')await import('./build-r382.mjs');
const [html,js,sw,rel,r382,r313,r321,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v382.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r382-baseline-restore.js'),'utf8'),readFile(resolve('runtime-r313-discover-sports-profile.js'),'utf8'),readFile(resolve('runtime-r321-discover-profile-history.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260926114500_r382_home_original_buckets_first_paint.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(js.includes("cinetracker_home_payload_v382"),'v382 Home payload missing');
ok(!js.includes("window.__ctR380Marker")&&!js.includes("window.__ctR381Marker"),'regressive r380/r381 bundle survived');
ok(r313.includes("rpc313('cinetracker_profile_v380'"),'Profile fast data source missing');
ok(r313.includes("ct168PaintProfile"),'original Profile painter missing');
ok(r321.includes("window.__ctR382LoadForYou"),'r321 does not delegate to r382');
for(const x of ["window.__ctR382Marker='baseline-r376-home-profile+home-v382-first-paint+fresh-v381-audit+actions-3-2-3'","cinetracker_discover_filter_v381","grid-template-columns:repeat(3","grid-template-columns:repeat(2"])ok(r382.includes(x),'r382 missing '+x);
ok(mig.includes("__ct_home_authority','home-v382-full-original-buckets-first-paint'"),'migration authority missing');
ok(html.includes('app-v382.js')&&sw.includes('ct-web-1.0.173-r382'),'asset identity');
ok(r.version==='1.0.173'&&r.revision==='r382-official-1.0.173'&&r.base==='r376-baseline','release identity');
console.log('WEB_R382_TEST_OK');
