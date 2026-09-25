import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R379_SKIP_BUILD!=='1')await import('./build-r379.mjs');
const [html,js,sw,rel,r321,r332,r378,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v379.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r321-discover-profile-history.js'),'utf8'),readFile(resolve('runtime-r332-home-discover-final.js'),'utf8'),readFile(resolve('runtime-r378-regression-rollback.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260925214500_r379_profile_fast_single_dashboard.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(js.includes("window.__ctR379Marker='home-stable-no-late-recompose+visible-meta-fast+fresh-v322-strict+profile-fast-cache'"),'marker');
ok(r321.includes("rpc('cinetracker_discover_filter_v322'"),'v322 personal filter missing');
ok(r332.includes("if(window.__ctR379HomeOwner)return false"),'r332 owner guard missing');
ok(r378.includes("stored-next-navigation")&&r378.includes("ct379:home-snapshot"),'stable Home snapshot behavior missing');
ok(mig.includes("with d as materialized")&&mig.includes("cinetracker_profile_fast_v379"),'fast profile migration missing');
ok(!js.includes("rpc('cinetracker_profile_payload_v0997',{p_tz:tz()})"),'legacy profile RPC still active in final bundle');
ok(html.includes('app-v379.js')&&sw.includes('ct-web-1.0.170-r379'),'asset identity');
ok(r.version==='1.0.170'&&r.revision==='r379-official-1.0.170','release identity');
console.log('WEB_R379_TEST_OK');