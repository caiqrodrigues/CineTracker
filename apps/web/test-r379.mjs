import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R379_SKIP_BUILD!=='1')await import('./build-r379.mjs');
const [html,js,sw,rel,r379,r325,r332,r199,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v379.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r379-stable-home-fresh-profile.js'),'utf8'),readFile(resolve('runtime-r325-home-episode-sync.js'),'utf8'),readFile(resolve('runtime-r332-home-discover-final.js'),'utf8'),readFile(resolve('runtime-r199-rewatch-favorites-sports.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260925213000_r379_strict_fresh_fast_profile.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR379Marker='home-persistent-v359-no-late-buckets+fresh-server-exact-known+profile-quick-first'","cinetracker_discover_filter_v379","cinetracker_profile_quick_stats_v1","cinetracker_profile_landing_v379","HOME_KEY='ct:home:v359:r379'"])ok(r379.includes(x),'r379 missing '+x);
ok(r325.includes("if(window.__ctR379HomeOwner)return{skipped:true,owner:'r379'}"),'r325 late refresh not guarded');
ok((r332.match(/if\(window\.__ctR379HomeOwner\)return false;/g)||[]).length>=2,'r332 late repaint not guarded');
ok(!r199.includes("/\\bvisto\\b|assistido/i.test"),'detail false watched text heuristic remains');
ok(mig.includes("mo.state='Liked'")&&/is_known\s+(?:as\s+)?is_blocked/.test(mig),'strict known filter missing');
ok(html.includes('app-v379.js')&&sw.includes('ct-web-1.0.170-r379'),'asset identity');
ok(r.version==='1.0.170'&&r.revision==='r379-official-1.0.170','release identity');
console.log('WEB_R379_TEST_OK');
