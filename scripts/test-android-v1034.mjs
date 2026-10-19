import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r276-android-js">',start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
assert.ok(start>0&&end>start,'release script missing');
const app=html.slice(start+tag.length,end);
const patch=await readFile('apps/android/runtime-r276-v1034-wwe-releases.js','utf8');
new Function(app);new Function(patch);
assert.ok(html.includes('name="ct-official-version" content="1.0.34"'));
for(const marker of [
 "const REVISION='r276-android-official-1.0.34';",
 'window.__ctAndroidOfficialCode=10076',
 'window.__ctR276AndroidV1034',
 'window.__ctR275AndroidV1033',
 'window.__ctR273AndroidV1031',
 'window.__ctR271AndroidV1029',
 'window.__ctR270AndroidV1028',
 'cinetracker_home_movie_history_v323',
 'cinetracker_sport_mark_watched_v1',
 'cinetracker_recommendation_filter_v525',
 'ct275-foryou-only','data-ct275-seen',
 'cinetracker_f1_watch_sync_v462'
])assert.ok(app.includes(marker),'previous stable owner lost: '+marker);
assert.equal((app.match(/audit263\(fresh\.(?:movie|series|anime),'fresh',12\)/g)||[]).length,3,'full filtered recommendations altered');
assert.equal((app.match(/audit263\(watch\.(?:movie|series|anime),'watchlist',8\)/g)||[]).length,3,'personal Watchlist audits altered');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.equal(patch.includes(bad),false,bad+' forbidden');
let paints=0,network=[],events={},userId='viewer';
const show=(id,title,watchedSeason,watchedEpisode)=>({
 tmdb_id:id,title,media_type:'tv',watched_episodes:150,
 last_season_number:watchedSeason,last_episode_number:watchedEpisode,
 released_episodes:180,home_bucket:'up_to_date',is_caught_up:true,
 latest_released_season_number:watchedSeason,latest_released_episode_number:watchedEpisode
});
const smack=show(1549,'WWE Friday Night SmackDown',28,41);
const raw=show(4656,'Raw',34,41);
const arbitrary=show(989898,'Série Não WWE',3,5);
const existing=[smack,raw,arbitrary];
const env={
 window:{addEventListener(name,fn){events[name]=fn},Image:null},
 document:{querySelector:()=>null},
 console,session:{access_token:'test',user:{id:userId}},user:{id:userId},
 homeCache:{series:existing,history_movies:[{id:66}]},localDay:()=> '2026-10-18',
 route:()=> 'home',paintHome:()=>{paints++},paintDiscover:()=>{},
 discoverState:{tab:'foryou'},ct186ForYouData:null,mediaPoster:()=>null,img:()=>null,
 tmdb:async(path)=>{
  network.push(path);
  if(path==='/tv/1549/season/28')return{episodes:[
   {episode_number:40,air_date:'2026-10-02'},
   {episode_number:41,air_date:'2026-10-09'},
   {episode_number:42,air_date:'2026-10-16'},
   {episode_number:43,air_date:'2026-10-23'}]};
  if(path==='/tv/4656/season/34')return{episodes:[
   {episode_number:40,air_date:'2026-10-05'},
   {episode_number:41,air_date:'2026-10-12'},
   {episode_number:42,air_date:'2026-10-19'}]};
  throw Error('not expected '+path);
 },
 Date,Promise,Map,Set,Number,String,Array,setTimeout,queueMicrotask,
};
vm.createContext(env);vm.runInContext(patch,env,{timeout:1000});
assert.equal(env.window.__ctR276StartupError,undefined,'startup failure');
const test=env.window.__ctR276Test;
assert.ok(test&&typeof test.latestForShow==='function');
const confSmack={id:1549,season2026:28,verified:{season:28,episode:42,date:'2026-10-16'}};
const confRaw={id:4656,season2026:34,verified:{season:34,episode:41,date:'2026-10-12'}};
const latest42=test.latestForShow({season:28,episodes:[{episode_number:42,air_date:'2026-10-16'},{episode_number:43,air_date:'2026-10-23'}]},confSmack,'2026-10-18');
assert.equal(latest42.episode,42,'Oct23 future ep must not be listed');
const m={...smack};assert.equal(test.applyLatest(m,latest42,'2026-10-18'),true);
assert.equal(m.home_bucket,'continue','unwatched released SmackDown must be in Continuar');
assert.equal(m.is_caught_up,false);
const watched={...smack,last_episode_number:42};
test.applyLatest(watched,latest42,'2026-10-18');
assert.equal(watched.home_bucket,'up_to_date','watched Oct16 episode must return Em dia');
const rawLatest=test.latestForShow({season:34,episodes:[{episode_number:41,air_date:'2026-10-12'},{episode_number:42,air_date:'2026-10-19'}]},confRaw,'2026-10-18');
const r={...raw};test.applyLatest(r,rawLatest,'2026-10-18');
assert.equal(r.home_bucket,'up_to_date','future Oct19 Raw must NOT be treated as aired on Oct18');
const future=test.latestForShow({season:34,episodes:[{episode_number:42,air_date:'2026-10-19'}]},confRaw,'2026-10-19');
const r2={...raw};test.applyLatest(r2,future,'2026-10-19');
assert.equal(r2.home_bucket,'continue','Raw moves to Continuar only when 42 aired and remains unwatched');
const old={...arbitrary};assert.equal(test.applyLatest(old,{season:3,episode:6,date:'2026-10-20'},'2026-10-18'),false);
env.paintHome();await new Promise(resolve=>setTimeout(resolve,30));
assert.equal(smack.home_bucket,'continue');
assert.equal(raw.home_bucket,'up_to_date');
assert.equal(arbitrary.home_bucket,'up_to_date','other series untouched');
assert.deepEqual(network.slice().sort(),['/tv/1549/season/28','/tv/4656/season/34']);
assert.ok(paints<=3,'repaint loop detected');
assert.equal(env.homeCache.history_movies[0].id,66,'movie history accidentally mutated');
assert.equal(typeof events['cinetracker:data-changed'],'function');
console.log('ANDROID_1_0_34_TEST_OK: release-date-aware SmackDown/Raw, optimistic previous fixes intact, no loop/refetch/new-page-reload');
