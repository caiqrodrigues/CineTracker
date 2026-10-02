import {readFile} from 'node:fs/promises';
if(process.env.CT_R465_SKIP_BUILD!=='1')await import('./build-r465.mjs');
const [js,html,sw,rel,pkg,rootPkg,migration,...runtimeParts]=await Promise.all([
 readFile('dist/app-v465.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('../../supabase/migrations/20261002212000_r465_profile_actors_summary.sql','utf8'),
 ...Array.from({length:7},(_,i)=>readFile(`runtime-r465-part${i+1}.inc`,'utf8'))
]);
const runtime=runtimeParts.join('');
const ok=(v,m)=>{if(!v)throw new Error('R465 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.255'&&r.revision==='r465-official-1.0.255','release');
ok(p.version==='1.0.255'&&rp.version==='1.0.255','versions');
ok(html.includes('app-v465.js')&&sw.includes('app-v465.js')&&sw.includes('ct-web-1.0.255-r465'),'assets');
for(const need of [
 "window.__ctR465Marker='real-device-home-discover-profile-history'",'waitAuth','cinetracker_home_movies_v405','cinetracker_home_series_v452',
 'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct465-fy-action="swap"','↻ Trocar',
 'PROFILE_LIMIT=13','cinetracker_profile_actors_v465','data-ct465-more','data-ct465-undo="1"',
 'cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'
])ok(runtime.includes(need),'runtime missing '+need);
ok(runtime.includes("visibleOne('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]')"),'Pra Voce does not target visible host');
ok(runtime.includes("for(const ms of [0,100,250,500,900,1500,2400,3600])"),'auth recovery is not finite');
ok(runtime.includes("for(const delay of [0,350,900])"),'Pra Voce data recovery is not finite');
ok(runtime.includes("for(let step=1;step<=pool.length;step++)"),'Trocar is not bounded');
ok(runtime.includes("if(kind==='sport')")&&runtime.includes("p_event_id:eventId"),'sport undo does not use sport RPC');
ok(runtime.includes("p_item_type:itemType")&&runtime.includes("p_season_number:itemType==='episode'"),'media undo arguments incomplete');
ok(runtime.includes("if(row)row.remove()")&&runtime.includes("parent.insertBefore(row,next)"),'undo is not optimistic with rollback');
ok(migration.includes('security invoker')&&migration.includes('fa.user_id=auth.uid()')&&migration.includes("revoke all on function public.cinetracker_profile_actors_v465(integer) from public,anon")&&migration.includes('grant execute on function public.cinetracker_profile_actors_v465(integer) to authenticated'),'actor RPC security');
for(const owner of [
 "async function loadMovies456(force=false){if(window.__ctR465?.enterHome)",
 "async function loadFY456(force=false){if(window.__ctR465?.loadForYou)",
 "function enterMovies457(){if(window.__ctR465?.enterHome)",
 "async function fyLoad457(force=false){if(window.__ctR465?.loadForYou)",
 "function scheduleSeries458(){if(window.__ctR465?.enterHome)",
 "function ensureForYou458(){if(window.__ctR465?.loadForYou)",
 "function enterMovies460(){if(window.__ctR465?.enterHome)",
 "function enterSeries460(){if(window.__ctR465?.enterHome)",
 "async function loadForYou460(force=false){if(window.__ctR465?.loadForYou)",
 "function enterSeries461(){if(window.__ctR465?.enterHome)",
 "function enterMovies461(){if(window.__ctR465?.enterHome)",
 "async function loadFY461(force=false){if(window.__ctR465?.loadForYou)"
])ok(js.includes(owner),'live owner does not converge: '+owner);
const r464=js.indexOf("window.__ctR464Marker='discover-foryou-visible-owner-v421'");
ok(r464>=0&&js.indexOf("async function load(force=false){if(window.__ctR465?.loadForYou)",r464)>r464,'r464 load does not converge');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
console.log('R465_STATIC_OK');
