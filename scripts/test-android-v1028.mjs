import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const start='<script data-ct-android="r270-android-js">',a=html.indexOf(start),b=html.indexOf('</script>',a+start.length);
assert.ok(a>=0&&b>a,'r270 Android script missing');
const js=html.slice(a+start.length,b);
new Function(js);
for(const check of [
 "const REVISION='r270-android-official-1.0.28'",
 'window.__ctAndroidOfficialCode=10070','window.__ctR270AndroidV1028=',
 "cinetracker_home_movie_history_v323","cinetracker_sport_mark_watched_v1",
 "window.__ctR269AndroidV1027=","window.__ctR268AndroidV1026=",
 "window.__ctR267AndroidV1025=","cinetracker_sports_stadium_summary_v296"
])assert.ok(js.includes(check),'missing '+check);
assert.ok(html.includes('name="ct-official-version" content="1.0.28"'));
const patch=await readFile('apps/android/runtime-r270-v1028-history-fast-optimistic.js','utf8');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(bad),'forbidden '+bad);
const portion=(start,end)=>{const a=js.indexOf(start),b=js.indexOf(end,a+start.length);assert.ok(a>=0&&b>a,'missing boundary '+start);return js.slice(a,b)};
const sports=portion('const sportLocks270=new Set();',"document.addEventListener('click',function r159SportsWatchClick");
assert.ok(!sports.includes('paintSports(')&&!sports.includes('sportsPayload('),'watched click must never redraw/refetch sports page');
const detail=portion('async function toggleSports263(btn){',"document.addEventListener('click',e=>{const close=e.target?.closest?.('[data-ct263-sports-close]')");
assert.ok(!detail.includes('renderSportsDetail263(')&&!detail.includes('dispatchEvent('),'sports modal must not reset its scroll');
const fresh=portion('async function ct186FreshPools(c){','function ct186WatchPools(c){');
assert.equal((fresh.match(/,'(movie|tv)',3\)/g)||[]).length,3,'initial recommendations must use three 3-page pools');
assert.ok(!fresh.includes(",'tv',6)")&&!fresh.includes(",'movie',6)"));
const rg=new RegExp('function combineMovies\\(base,extra\\)\\{[\\s\\S]*?\\n\\}');
const fun=patch.match(rg)?.[0];assert.ok(fun,'merge routine not present');
const env={Map,Date,String,Number,Array,console};
vm.createContext(env);
vm.runInContext('const arr=x=>Array.isArray(x)?x:[];'+fun,env);
const old=[
{id:1,media_id:300,title:'Filme antigo',watched_at:'2026-09-19T11:00:00Z',plays:1},
{id:2,media_id:400,title:'Filme velho',watched_at:'2026-08-22T10:00:00Z',plays:1}
];
const modern=[
{id:5,media_id:301,title:'Filme recente',poster_path:'/new.png',watched_at:'2026-10-13T22:24:30Z',plays:2},
{id:9,media_id:300,title:'Filme antigo atualizado',watched_at:'2026-10-11T22:00:00Z',plays:3}
];
const result=env.combineMovies(old,modern);
assert.equal(result.length,3);
assert.equal(result.at(-1).title,'Filme recente','missing October films');
assert.equal(result.at(-2).plays,3,'movie rewatch count must be respected');
assert.equal(result[0].title,'Filme velho','chronological order must be ascending');
const set=new Set(),btn={dataset:{watched:'0'},disabled:false,classList:{toggle(){}},hasAttribute:s=>s==='data-sport-watch',textContent:''};
let writes=0,paints=0;
const mocks={
 document:{querySelectorAll:()=>[btn]},Set,Date,String,Number,Promise,
 sportsCache:{events:[{id:12,is_watched:false}]},profileCache:{},localStorage:{removeItem(){}},
 ct163Write:()=>{},toast:()=>{},rpc:async()=>{writes++;return {is_watched:true}},
 paintSports:()=>{paints++},sportsPayload:async()=>{paints++},console
};
vm.createContext(mocks);vm.runInContext(sports,mocks);
await mocks.markSportWatched159(12,false);
assert.equal(writes,1,'sports mark must call backend exactly once');
assert.equal(paints,0,'sports must not repaint');
assert.equal(btn.dataset.watched,'1');
assert.equal(mocks.sportsCache.events[0].is_watched,true);
assert.equal(btn.disabled,false);
assert.match(patch,/IntersectionObserver/,'below-screen poster loading should be lazy');
assert.match(patch,/publish270\(d,false\)/,'first recommendation view must not await reserve pool');
console.log('ANDROID_1_0_28_TEST_OK: 948 legacy movie baseline + October play-events merge, sports single-RPC no scroll, 3-page eligible batches, viewport posters');
