import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r325-android-stable-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'Android signed release assets must contain r325');
const js=html.slice(start+tag.length,end);
new Function(js);
assert.ok(js.includes("const REVISION='r325-android-official-1.0';"));
assert.ok(js.includes('window.__ctAndroidOfficialCode=10126;'));
for(const name of ['window.__ctR306Home=','window.__ctR308Home=',
 'window.__ctR311Special=','window.__ctR312Transport=',
 'window.__ctR322Top10=','window.__ctR314ForYou=',
 'window.__ctR324Premieres=','window.__ctR325Series=',
 'window.__ctR325Profile=','cinetracker_foryou_payload_v498'])
 assert.ok(js.includes(name),'Preserved certified component '+name);
for(const file of ['apps/android/runtime-r325-series-single-owner.js',
 'apps/android/runtime-r325-profile-immediate-sync.js']){
 const patch=await readFile(file,'utf8');
 for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)'])
  assert.ok(!patch.includes(forbidden),'No full reload/unbounded loop in '+file);
}

const r306=js.indexOf('/* CineTracker Android 1.0 / r306 — one Home state reconciler */');
const r307=js.indexOf('/* CineTracker Android 1.0/r307: adaptive',r306);
assert.ok(r306>0&&r307>r306);
const homeModule=js.slice(r306,r307);
const id=312359;
const ep=(season,episode,air)=>({season_number:season,episode_number:episode,air_date:air,name:'Dragon Ball Super: Beerus '+episode});
const dragon={tmdb_id:id,media_id:9734,title:'Dragon Ball Super: Beerus',source_state:'InProgress',
 home_bucket:'continue',watched_episodes:2,released_episodes:3,
 next_season_number:1,next_episode_number:3,last_season_number:1,last_episode_number:2,
 last_watched_at:'2026-10-19T12:00:00Z',is_caught_up:false};
const hist=[{media_id:9734,tmdb_id:id,title:dragon.title,season_number:1,episode_number:3,
 watched_at:'2026-10-27T21:54:50Z'}];
const season={episodes:[ep(1,1,'2026-10-11'),ep(1,2,'2026-10-18'),
 ep(1,3,'2026-10-25'),ep(1,4,'2026-11-01')]};
let paints=0;
const listeners={window:new Map(),document:new Map()};
const on=(kind,event,fn)=>{const a=listeners[kind].get(event)||[];a.push(fn);listeners[kind].set(event,a)};
const ctx={
 window:{addEventListener:(event,fn)=>on('window',event,fn),dispatchEvent:()=>{},
  __ctR308Home:{blockedEpisode:()=>false}},
 document:{addEventListener:(event,fn)=>on('document',event,fn),hidden:false,
  querySelector:()=>null,documentElement:{dataset:{}}},
 session:{user:{id:'account-a'},access_token:'signed-in'},user:{id:'account-a'},
 route:()=> 'home',homeActiveTab158:'series',navSeq:1,
 homeCache:{series:[{...dragon}],history_episodes:hist},
 localDay:()=> '2026-10-27',renderHome:async()=>true,paintHome:()=>{paints++;return true},
 homeEpisodeHistory158:()=>'',ct174RefreshHome:async()=>true,tmdb:async(path)=>{
  if(path==='/tv/'+id+'/season/1')return season;
  if(path==='/tv/'+id)return{seasons:[{season_number:1,air_date:'2026-10-11'}],
   last_episode_to_air:ep(1,3,'2026-10-25')};
  return{};
 },
 rpc:async name=>{
  if(name==='cinetracker_home_series_v527')return{rows:[{...dragon}]};
  if(name==='cinetracker_home_history_v391')return{history_episodes:hist};
  if(name==='cinetracker_home_series_watch_state_v4')return[{tmdb_id:id,canonical_media_id:9734,
   watched_episodes:3,watched_keys:[{s:1,e:1},{s:1,e:2},{s:1,e:3}],
   last_season_number:1,last_episode_number:3,last_watched_at:'2026-10-27T21:54:50Z'}];
  throw Error('Unexpected Android RPC: '+name);
 },
 setTimeout,clearTimeout,queueMicrotask,requestAnimationFrame:f=>f(),CustomEvent:class{constructor(name,init){this.type=name;this.detail=init.detail}}
};
new Function('ctx','with(ctx){'+homeModule+'}')(ctx);
await ctx.window.__ctR325Series.refresh();
await new Promise(resolve=>setTimeout(resolve,120));
const row=ctx.homeCache.series.find(x=>x.tmdb_id===id);
assert.equal(row.watched_episodes,3,'DB-confirmed watched count wins over old Android cache');
assert.equal(row.home_bucket,'up_to_date','No released unwatched episode after S01E03');
assert.equal(row.next_episode_number,null,'Already watched E03 may never be the next episode');
assert.equal(ctx.window.__ctR325Series.stats().frontiers,1,'Aired season was checked');
const before=paints;
await ctx.window.__ctR325Series.refresh();
assert.ok(paints-before<=1,'Same authenticated list does not flicker/repaint repeatedly');

const prof=await readFile('apps/android/runtime-r325-profile-immediate-sync.js','utf8');
const pl=new Map();let writes=0,dayPaint=0,libraryPaint=0;
const profileCtx={
 window:{addEventListener:(name,fn)=>{const list=pl.get(name)||[];list.push(fn);pl.set(name,list)}},
 document:{addEventListener(){},hidden:false,querySelector:()=>null},
 session:ctx.session,user:ctx.user,route:()=> 'profile',homeCache:ctx.homeCache,
 profileCache:{stats:{episodes_watched:40,movies_watched:8},
  dashboard:[{media_id:9734,watched_episodes:2}],
  activity:[{day:'2026-10-27',count:2,episodes:2,movies:0,sports:0}]},
 ct163Read:()=>null,ct163Write:()=>{writes++},
 syncProfile263:()=>{libraryPaint++},ct169RenderActivity:()=>{dayPaint++},
 localDay:()=> '2026-10-27',fmtMinutes:n=>n+' min',tz:()=> 'America/Sao_Paulo',
 ct168MergeQuick:(base,quick)=>({...base,...quick}),
 rpc:async name=>{
  if(name==='cinetracker_profile_quick_stats_v1')return{stats:{episodes_watched:41,movies_watched:8}};
  if(name==='cinetracker_profile_media_dashboard_v0991')return[{media_id:9734,watched_episodes:3}];
  if(name==='cinetracker_activity_by_day_v1')return[{day:'2026-10-27',count:3,episodes:3,movies:0,sports:0}];
  throw Error('Unexpected Profile RPC: '+name);
 },
 setTimeout,clearTimeout
};
new Function('ctx','with(ctx){'+prof+'}')(profileCtx);
const change=pl.get('cinetracker:data-changed')[0];
change({detail:{source:'home-watch-r176',item_type:'episode',media_id:9734,
 season:1,episode:3,watched_at:'2026-10-27T21:54:50Z'}});
assert.equal(profileCtx.profileCache.stats.episodes_watched,41,'Profile stats updated locally before RPC');
assert.equal(profileCtx.profileCache.activity[0].count,3,'Daily graph updated locally before RPC');
assert.ok(writes>0,'Profile optimistic state persists in account-scoped cache');
await new Promise(resolve=>setTimeout(resolve,160));
assert.equal(profileCtx.profileCache.dashboard[0].watched_episodes,3,'Profile library reconciles');
assert.equal(profileCtx.profileCache.activity[0].episodes,3,'Daily graph reconciles');
assert.equal(profileCtx.window.__ctR325Profile.stats().failures,0);
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1\.0'/);
assert.match(gradle,/versionCode 10126/);
assert.match(gradle,/signingConfig signingConfigs\.official/);
console.log('CINETRACKER_ANDROID_1_0_R325_TEST_OK: Dragon Ball S01E03, Home no flicker, authenticated season, Profile optimistic totals/library/activity, Android signing configured; Web frozen.');
