import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R383_SKIP_BUILD!=='1')await import('./build-r383.mjs');
const [html,js,sw,rel,src,r328s,r332s,r382s,r376s,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v383.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r383-home-foryou-authority.js'),'utf8'),readFile(resolve('runtime-r328-home-discover-authority.js'),'utf8'),readFile(resolve('runtime-r332-home-discover-final.js'),'utf8'),readFile(resolve('runtime-r382-baseline-restore.js'),'utf8'),readFile(resolve('runtime-r376-home-watchlist-foryou-final.js'),'utf8'),readFile(resolve('../../supabase/migrations/20260926123000_r383_home_series_first_paint.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR383Marker='home-fast-series-firstpaint+movies-full-owner+foryou-own-actions+fresh-final-state-check'","cinetracker_home_series_v383","cinetracker_media_state_v1","ct383-actions","window.__ctR383HomeOwner=true","window.__ctR383ForYouOwner=true"])ok(js.includes(x)||src.includes(x),'missing '+x);
ok(js.includes("function paintForYou328(){if(window.__ctR383ForYouOwner)return false;"),'final bundle did not retire r328 paint');
ok(js.includes("function ensureForYouFilters328(){if(window.__ctR383ForYouOwner)return false;"),'final bundle did not retire duplicate r328 filter');
ok(js.includes("window.__ctR379HomeOwner||window.__ctR383HomeOwner"),'final bundle did not retire r332 late Home writers');
ok(js.includes("function normalizeForYou332(){\n if(window.__ctR383ForYouOwner)return false;"),'final bundle did not retire r332 ForYou writer');
ok(r382s.includes("window.__ctR383ForYouOwner&&typeof window.__ctR383LoadForYou==='function'"),'r382 does not delegate');
ok(r376s.includes('window.__ctR376Test={homeRows,sortHome,setHomeSort,renderAllHomeRows'), 'r376 test bridge cannot complete movie Watchlist DOM');
ok(mig.includes("create or replace function public.cinetracker_home_series_v383"),'migration missing');
ok(!src.includes('renderProfile')&&!src.includes('profile_v380'),'r383 touched Profile');
ok(html.includes('app-v383.js')&&sw.includes('ct-web-1.0.174-r383'),'asset identity');
ok(r.version==='1.0.174'&&r.revision==='r383-official-1.0.174'&&r.profile==='untouched-r382-baseline','release identity');
console.log('WEB_R383_TEST_OK');
