import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r324-android-stable-js">';
const start=html.indexOf(marker),end=start<0?-1:html.indexOf('</script>',start+marker.length);
assert.ok(start>=0&&end>start,'Android APK must contain r324');
const js=html.slice(start+marker.length,end);
new Function(js);
assert.ok(js.includes("const REVISION='r324-android-official-1.0';"));
assert.ok(js.includes('window.__ctAndroidOfficialCode=10125;'));
for(const marker of [
 'window.__ctR306Home=','window.__ctR308Home=',
 'window.__ctR311Special=','window.__ctR312Transport=',
 'window.__ctR322Top10=','window.__ctR314ForYou=',
 'window.__ctR324Premieres=','cinetracker_foryou_payload_v498'
]) assert.ok(js.includes(marker),'Preserved certified module: '+marker);
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)']){
 assert.ok(!js.slice(js.indexOf('const ct324Day='),js.indexOf('const formerRender=renderHome;')).includes(banned));
}
const r306=js.indexOf('/* CineTracker Android 1.0 / r306 — one Home state reconciler */');
const r307=js.indexOf('/* CineTracker Android 1.0/r307: adaptive',r306);
assert.ok(r306>0&&r307>r306,'r324 must live only inside r306 Home');
const module=js.slice(r306,r307);
const cases=[
 [96677,'Lupin','UpToDate','up_to_date',17,3,7,3,7,'2023-10-05','2026-10-23',4,8],
 [10,'Antiga','InProgress','dust',4,1,4,1,7,'2026-07-01','2026-07-01',1,7],
 [11,'Futura','UpToDate','up_to_date',21,3,7,3,7,'2026-08-02','2026-10-24',4,1],
 [12,'Em dia','UpToDate','up_to_date',28,4,8,4,8,'2026-08-02','2026-10-23',4,8],
 [4656,'Raw','UpToDate','up_to_date',120,5,3,5,3,'2026-09-30','2026-10-23',5,4],
 [13,'Poeira antiga','InProgress','dust',1,1,1,1,8,'2025-01-01','2026-10-23',2,1],
 [14,'Concluída importada','Completed','completed',0,0,0,0,0,'2026-08-01','2026-10-23',4,8],
 [15,'Reassistida','Completed','completed',21,3,7,3,7,'2026-10-23','2026-10-23',4,8]
];
const rows=cases.map(x=>({
 tmdb_id:x[0],media_id:x[0],title:x[1],source_state:x[2],
 home_bucket:x[3],is_caught_up:x[3]==='up_to_date',watched_episodes:x[4],
 last_season_number:x[5],last_episode_number:x[6],
 latest_released_season_number:x[7],latest_released_episode_number:x[8],
 last_watched_at:x[9],state_updated_at:x[9]
}));
const data=new Map(cases.map(x=>[x[0],{
 last_episode_to_air:{season_number:x[11],episode_number:x[12],
  air_date:x[10],name:'Episode'},number_of_episodes:38
}]));
// Lupin catalogue can lag behind streaming release: the announced season
// is confirmed via its actual aired episode dates, never season count alone.
data.set(96677,{
 last_episode_to_air:{season_number:3,episode_number:7,
  air_date:'2023-10-05',name:'Part 3 final'},
 seasons:[{season_number:4,air_date:'2026-10-23'}],
 number_of_episodes:38
});
const ctx={
 window:{addEventListener(){}},
 document:{addEventListener(){},querySelector(){return null},documentElement:{dataset:{}}},
 session:{user:{id:'account-a'},access_token:'authenticated'},
 user:{id:'account-a'},route:()=> 'home',homeActiveTab158:'series',
 localDay:()=> '2026-10-23',navSeq:1,
 renderHome:async()=>true,paintHome:()=>{ctx.paints++},
 homeCache:{series:rows,history_episodes:[]},
 paints:0,tmdbCalls:[],
 rpc:async name=>name==='cinetracker_home_series_v527'?{rows}:
  name==='cinetracker_home_history_v391'?{history_episodes:[]}:null,
 tmdb:async path=>{
  ctx.tmdbCalls.push(path);
  if(path==='/tv/96677/season/4')return{episodes:Array.from({length:8},(_,i)=>({
   episode_number:i+1,air_date:'2026-10-23',name:'Part 4 E'+(i+1)
  }))};
  return data.get(Number(path.split('/').at(-1)))||{};
 },
 setTimeout,clearTimeout,queueMicrotask
};
new Function('ctx','with(ctx){'+module+'}')(ctx);
await ctx.window.__ctR306Home.refresh(true);
await ctx.window.__ctR324Premieres.refresh(true);
await new Promise(resolve=>setTimeout(resolve,220));
const byName=name=>ctx.homeCache.series.find(x=>x.title===name);
assert.equal(byName('Lupin').home_bucket,'continue');
assert.equal(byName('Lupin').next_season_number,4);
assert.equal(byName('Lupin').next_episode_number,1);
assert.equal(byName('Lupin').latest_released_episode_number,8);
assert.equal(byName('Antiga').home_bucket,'dust');
assert.equal(byName('Futura').home_bucket,'up_to_date');
assert.equal(byName('Em dia').home_bucket,'up_to_date');
assert.equal(byName('Raw').home_bucket,'up_to_date');
assert.equal(byName('Poeira antiga').home_bucket,'dust');
assert.equal(byName('Concluída importada').home_bucket,'continue');
assert.equal(byName('Reassistida').home_bucket,'continue');
assert.ok(ctx.tmdbCalls.includes('/tv/96677/season/4'),'Premiere fallback loads only aired episodes');
assert.ok(!ctx.tmdbCalls.includes('/tv/4656'),'Legacy WWE remains under its dedicated rule');
// A current watched frontier defeats stale premiere evidence after marking
// the newly released season as watched.
const lupin=byName('Lupin');
lupin.last_season_number=4;lupin.last_episode_number=8;
lupin.is_caught_up=true;lupin.home_bucket='up_to_date';
lupin.last_watched_at='2026-10-23T21:00:00Z';
ctx.window.__ctR306Home.normalize();
assert.equal(byName('Lupin').home_bucket,'up_to_date');
assert.ok(ctx.paints<=2,'No full-Home repaint loop');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1\.0'/);
assert.match(gradle,/versionCode 10125/);
assert.match(gradle,/signingConfig signingConfigs\.official/);
console.log('CINETRACKER_ANDROID_1_0_R324_TEST_OK: live new season, TMDB fallback, completed import, old dust, future, WWE, watched rollback; Web frozen.');
