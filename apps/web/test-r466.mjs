import {readFile} from 'node:fs/promises';
if(process.env.CT_R466_SKIP_BUILD!=='1')await import('./build-r466.mjs');
const [js,html,sw,rel,pkg,rootPkg,migration]=await Promise.all([
 readFile('dist/app-v466.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('../../supabase/migrations/20261002212000_r465_profile_actors_summary.sql','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R466 '+m)};
const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.256'&&r.revision==='r466-official-1.0.256','release');
ok(p.version==='1.0.256'&&rp.version==='1.0.256','versions');
ok(html.includes('app-v466.js')&&sw.includes('app-v466.js')&&sw.includes('ct-web-1.0.256-r466'),'assets');
for(const need of [
 "window.__ctR466Marker='r465-recovery-build-fixed+uuid-history-undo'",'cinetracker_home_movies_v405','cinetracker_home_series_v452',
 'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct465-fy-action="swap"','↻ Trocar',
 'PROFILE_LIMIT=13','cinetracker_profile_actors_v465','data-ct465-more','data-ct465-undo="1"',
 'cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426',
 "const mediaId=String(btn.dataset.mediaId||'').trim(),itemType=kind;"
])ok(js.includes(need),'bundle missing '+need);
ok(js.includes("if(false&&home&&routeNow()==='home')"),'r461 Home click owner still active');
ok(js.includes("if(false&&routeNow()==='discover'&&isForYouControl(t))"),'r464 Pra Voce click owner still active');
ok(js.includes("for(const ms of [0,100,250,500,900,1500,2400,3600])"),'auth recovery is not finite');
ok(js.includes("for(const delay of [0,350,900])"),'Pra Voce data recovery is not finite');
ok(js.includes("for(let step=1;step<=pool.length;step++)"),'Trocar is not bounded');
ok(js.includes("id=String(x?.media_id||'')"),'history row still coerces UUID media_id');
ok(!js.includes("const mediaId=num(btn.dataset.mediaId),itemType=kind;"),'history undo still coerces media_id with Number()');
ok(migration.includes('security invoker')&&migration.includes('fa.user_id=auth.uid()'),'actor RPC security');
console.log('R466_STATIC_OK');
