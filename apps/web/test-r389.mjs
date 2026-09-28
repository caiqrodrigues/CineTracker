import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R389_SKIP_BUILD!=='1')await import('./build-r389.mjs');
const [html,js,sw,rel,src,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v389.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r388-home-foryou-final.js'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260928203000_r389_home_foryou_fast_authorities.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["cinetracker_home_series_v389","HSP='ct389:series:persistent'","cinetracker_discover_filter_v389","cinetracker_discover_watch_v389","validated=new Set()","Promise.allSettled(['movie','series','anime'].map(k=>ensureFresh(k,false)))"])ok(src.includes(x),'missing '+x);
ok(!src.includes("src.slice(0,60)"),'Fresh cache audit still capped at 60');
ok(!src.includes("for(let i=0;i<all.length;i+=160"),'ForYou still scans full Watchlist');
ok(js.includes("if(window.__ctR389HomeOwner)return;try{localStorage.removeItem(HOME_KEY)"),'r379 late Home writer not retired');
ok(js.includes("if(window.__ctR389HomeOwner)return;if(routeNow()!=='home')return;homeSeriesAt"),'r385 late Home writer not retired');
ok(mig.includes('cinetracker_home_series_v389')&&mig.includes('cinetracker_discover_filter_v389')&&mig.includes('cinetracker_discover_watch_v389'),'r389 DB migration incomplete');
ok(html.includes('app-v389.js')&&sw.includes('ct-web-1.0.180-r389'),'asset identity');
ok(r.version==='1.0.180'&&r.revision==='r389-official-1.0.180'&&r.scope==='home+discover-foryou-only','release identity');
console.log('WEB_R389_TEST_OK');
