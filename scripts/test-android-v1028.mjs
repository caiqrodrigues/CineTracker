import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r270-android-js">',a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Android 1.0.28 exact embedded runtime missing');
const js=html.slice(a+marker.length,b);
new Function(js);
const patch=await readFile('apps/android/runtime-r270-v1028-profile-foryou-history.js','utf8');
const direct=await readFile('apps/android/runtime-r270-v1028-sports-direct.js','utf8');
new Function(patch);
for(const txt of [
 "const REVISION='r270-android-official-1.0.28'",
 "window.__ctAndroidOfficialCode=10070",
 "window.__ctR270AndroidV1028='profile-real-library+foryou-progressive-audit+movie-history-complete+sports-no-refresh'",
 'recoverProfileFromRows','cinetracker_profile_media_dashboard_v0997_fast','cinetracker_profile_media_dashboard_v0991',
 'ct186FreshEligible','ct186PopularPool','audit263','fullMovieHistory','ct270SportsPending',
 'cinetracker_sport_mark_watched_v1','ct163Write','window.__ctR269AndroidV1027=',
 'cinetracker_sports_stadium_summary_v296','cinetracker_special_series_counts_v540'
])assert.ok(js.includes(txt),'missing Android working runtime feature '+txt);
assert.ok(html.includes('name="ct-official-version" content="1.0.28"'));
for(const denied of ['window.location.reload(', 'router.refresh(', 'while(true)', 'while (true)', 'new MutationObserver'])
 assert.ok(!patch.includes(denied)&&!direct.includes(denied),'forbidden mutation '+denied);
const sportDirect=direct.slice(direct.indexOf('const ct270SportsPending'),direct.indexOf('//__CT270_SPORT_DETAIL_END__'));
let sportsPaints=0,updates=0;
const btn=(kind,id)=>({dataset:{sportWatch:id,ct263SportWatch:id,sportWatched:id,watched:'0',on:'0'},disabled:false,
 matches:s=>s===kind,classList:{toggle(){}},textContent:''});
const p1=btn('[data-sport-watch]','5'),p2=btn('[data-ct263-sport-watch]','5'),p3=btn('[data-sport-watched]','5');
const sportEnv={
 sportsCache:{events:[{id:5,is_watched:false}],watch_history:[]},
 sportsDetail263:{events:[{id:5,is_watched:false}]},
 document:{querySelectorAll:(s)=>s.includes('"5"')?[p1,p2,p3]:[]},
 rpc:async(n,args)=>{assert.equal(n,'cinetracker_sport_mark_watched_v1');updates++;return {is_watched:args.p_watched}},
 ct163Write:()=>{},window:{__ctA26PersistSports:()=>{}},toast:()=>{},
 paintSports:()=>{sportsPaints++},renderSportsDetail263:()=>{sportsPaints++},
 profileCache:{},localStorage:{removeItem(){}},
 console,Date,Set,Number
};
vm.createContext(sportEnv);vm.runInContext(sportDirect,sportEnv);
await sportEnv.markSportWatched159(5,false);
assert.equal(updates,1);assert.equal(sportEnv.sportsCache.events[0].is_watched,true);
assert.equal(p1.dataset.watched,'1');assert.equal(sportsPaints,0,'mark watched must NOT render or reset scroll');
await sportEnv.toggleSports263(p2);
assert.equal(sportEnv.sportsDetail263.events[0].is_watched,false);
assert.equal(updates,2);assert.equal(sportsPaints,0,'sports detail must not redraw after watched toggle');

const mem=new Map(),user={id:'user-270'},view={};
const doc={
 documentElement:{dataset:{}},head:{appendChild(){}},
 createElement(){return {style:{},dataset:{},textContent:'',className:'',appendChild(){},remove(){},insertBefore(){},querySelector(){return null}}},
 querySelector(sel){if(sel==='[data-profile]')return view;if(sel==='[data-home-viewport="movies"]')return null;return null},
 querySelectorAll(){return[]},addEventListener(){}
};
const sample={media_type:'movie',tmdb_id:9,id:9,poster_path:'/a',title:'Filme real',is_seen:true};
let rendered=null;
const env={
 window:{scrollY:0,scrollTo(){},__ctR265Test:{allowed:()=>true}},document:doc,
 user,session:{user},route:()=> 'profile',discoverState:{tab:'foryou'},
 profileCache:{stats:{movies_watched:1000,episodes_watched:17000}},renderProfile:async()=>{},
 ct168PaintProfile:d=>{rendered=d},
 ct186Select:d=>({daily:d._ct186_fresh.movie[0]||null,fm:d._ct186_fresh.movie[1]||null,fs:null,fa:null,wm:null,ws:null,wa:null,wmPool:[],wsPool:[],waPool:[]}),
 ct186Context:async()=>({dash:[]}),ct186WatchPools:()=>({movie:[],series:[],anime:[]}),
 ct186UniqueRows:a=>a,ct186FreshEligible:()=>true,ct186Type:x=>x.media_type,ct186Anime:()=>false,ct186MergeRows:(a,b)=>[...a,...b],
 pages:async()=>[],ct186PopularPool:async()=>[],audit263:async()=>[],
 ct186ForYouData:null,ct186DiscoverRowsBase:async()=>[],
 discoverRows:async()=>[],ct186LoadForYou:async()=>({}),ct186RefreshVisible:async()=>{},
 paintDiscover:()=>{},ct163Write:()=>{},syncProfile263:()=>{},
 homeCache:{},renderHome:async()=>{},homeMovieRow158:()=>'<div></div>',
 localDay:()=> '2026-10-19',api:async()=>[],rpc:async()=>null,
 localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v),removeItem:k=>mem.delete(k)},
 console,Date,Map,Set,Promise,setTimeout,requestAnimationFrame:f=>f()
};
env.window.document=doc;
vm.createContext(env);
vm.runInContext(patch,env,{timeout:1000});
env.ct168PaintProfile({stats:{movies_watched:1000,episodes_watched:17000},dashboard:[sample]});
assert.equal(rendered.dashboard.length,1);
env.ct168PaintProfile({stats:{movies_watched:1000,episodes_watched:17000},dashboard:[]});
assert.equal(rendered.dashboard.length,1,'stats-only refresh erased valid Profile lists');
const first=await env.ct186LoadForYou(false);
assert.ok(first._ct186_fresh&&first._ct186_watchlist);
const other=await env.discoverRows('trending');
assert.ok(Array.isArray(other));
assert.ok(patch.includes('for(let off=0;off<600;off+=200)'),'movie history must not truncate to 80 rows');
assert.ok(patch.includes("movieHistoryLimit+=120"),'older movie history must load in bounded 120-card pages');
console.log('ANDROID_1_0_28_TEST_OK real profile list retained, seven-slot skeleton, other discover tabs preserved, sports optimistic same-position, movie history paginated');
