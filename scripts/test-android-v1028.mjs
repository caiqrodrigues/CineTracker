import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r270-android-js">',a=html.indexOf(tag),b=html.indexOf('</script>',a+tag.length);
assert.ok(a>0&&b>a,'Android 1.0.28 embedded runtime missing');
const js=html.slice(a+tag.length,b),patch=await readFile('apps/android/runtime-r270-v1028-focused.js','utf8');
new Function(js);new Function(patch);
for(const need of [
 "const REVISION='r270-android-official-1.0.28'","window.__ctAndroidOfficialCode=10070",
 "window.__ctR270AndroidV1028='movie-history-paged+fast-foryou+lazy-posters+sports-no-scroll'",
 'cinetracker_sport_mark_watched_v1','ct186FreshEligible','ct186WatchPools',
 '__ctR269AndroidV1027','__ctR268AndroidV1026','__ctR267AndroidV1025',
 'cinetracker_f1_watch_sync_v462','cinetracker_sports_stadium_summary_v296',
 'data-home-viewport="movies"'
])assert.ok(js.includes(need),'missing feature '+need);
assert.ok(html.includes('name="ct-official-version" content="1.0.28"'));
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(bad),'forbidden mutation '+bad);
const button={dataset:{watched:'0',on:'0'},setAttribute(){},classList:{toggle(){}},textContent:'',disabled:false};
let sportsCalls=0,redraws=0,scrolls=0,posts=0;
const doc={
 documentElement:{dataset:{}},head:{appendChild(){}},
 querySelectorAll:()=>[button],querySelector:()=>null,
 createElement:()=>({style:{},dataset:{}}),addEventListener(){},
};
const original=[
{id:301,media_id:10,media_title:'Filme 301',tmdb_id:100,poster_path:'/301.jpg',watched_at:'2026-10-17T01:00:00Z'}
];
const record=Array.from({length:120},(_,i)=>({id:i+201,media_id:i+10,title:'Registro '+i,watched_at:new Date(Date.UTC(2026,9,17,0,0,i)).toISOString()}));
const tracked=[];const movies=[];let paints=0;
const mediaObj=id=>({id,tmdb_id:id+1000,title:'Filme de id '+id,poster_path:'/p'+id+'.jpg'});
const movie=(id,type='movie')=>({id,title:'Filme '+id,media_type:type,poster_path:'/p'+id+'.jpg',vote_average:8.7,release_date:'2024-01-01',genre_ids:type==='tv'?[18]:[28]});
const env={
 document:doc,window:{__ctR265Test:{allowed:x=>Boolean(x?.poster_path)}},Promise,Map,Set,WeakMap,WeakSet,Date,Number,String,Array,Object,
 session:{user:{id:'test'}},user:{id:'test'},localDay:()=> '2026-10-17',route:()=> 'home',
 sportsCache:{events:[{id:5,is_watched:false}]},sportsDetail263:{events:[{id:5,is_watched:false}]},
 markSportWatched159:async()=>{throw Error('legacy sports called')},
 toggleSports263:async()=>{throw Error('legacy overlay called')},
 paintSports:()=>{redraws++},render:()=>{redraws++},
 scrollTo:()=>{scrolls++},
 rpc:async name=>{if(name==='cinetracker_sport_mark_watched_v1'){sportsCalls++;return{is_watched:true}}throw Error(name)},
 profileCache:{x:1},toast:()=>{},localStorage:{removeItem(){}},ct163Write:()=>{},
 api:async path=>{
  if(path.startsWith('watch_history?'))return record;
  if(path.startsWith('media?')){const ids=(path.match(/id=in\.\(([^)]+)\)/)||[])[1]||'';return ids.split(',').filter(Boolean).map(Number).map(mediaObj)}
  throw Error('unexpected '+path);
 },
 homeCache:{history_movies:original},homeActiveTab158:'movies',renderHome:async()=>{},paintHome:()=>{paints++},paintDiscover:()=>{paints++},
 ct186Context:async()=>({dash:[]}),ct186WatchPools:()=>({movie:[],series:[],anime:[]}),
 ct186FreshEligible:x=>!x.seen,CT186_MIN_SCORE:7.5,
 ct186UniqueRows:x=>x,ct186MergeRows:(a,b)=>[...a,...b],
 ct186Select:data=>({daily:data._ct186_fresh.movie[0]||null,fm:data._ct186_fresh.movie[1]||null,fs:data._ct186_fresh.series[0]||null,fa:data._ct186_fresh.anime[0]||null,wm:null,ws:null,wa:null,wmPool:[],wsPool:[],waPool:[]}),
 ct186Anime:x=>Boolean(x.isAnime),ct186Type:x=>x.media_type,
 pages:async(path,arg,type)=>{
  if(path.includes('/movie'))return [movie(1),movie(2),movie(3)];
  return [movie(4,'tv'),movie(5,'tv'),{...movie(6,'tv'),isAnime:true},{...movie(7,'tv'),isAnime:true}];
 },
 discoverCache:new Map(),ct186ForYouData:null,ct186LoadForYou:async()=>{},ct186Invalidate:()=>{},ct163WarmOnIdle:()=>{},
 mediaPoster:x=>x.poster_path,homeMovieRow158:x=>'<b>'+x.media_title+'</b>',
 requestAnimationFrame:()=>{},setTimeout:()=>0,clearTimeout:()=>{},
 console
};
vm.createContext(env);vm.runInContext(patch,env,{timeout:1000});
await env.markSportWatched159(5,false);
assert.equal(sportsCalls,1,'single sports write');
assert.equal(button.dataset.watched,'1','optimistic watched state');
assert.equal(env.sportsCache.events[0].is_watched,true);
assert.equal(redraws,0,'sport click must never repaint route');
assert.equal(scrolls,0,'sport click must never scroll to top');
await env.window.__ctR270Test.movieHistory270();
assert.equal(env.homeCache.history_movies.length,120,'film history beyond r5 limit of 80');
assert.equal(env.homeCache.history_movies[0].media_title,'Filme 301','history title resolved from the existing canonical media record');
assert.ok(env.homeCache.history_movies[0].poster_path,'history poster must resolve from media');
assert.equal(env.homeCache.history_movies.at(-1).id,320,'movie history chronological newer last');
const result=await env.ct186LoadForYou();
assert.equal(result._ct186_fresh.movie.length,3);
assert.equal(result._ct186_fresh.series.length,2);
assert.equal(result._ct186_fresh.anime.length,2);
assert.equal((await env.ct186LoadForYou()),result,'return cached valid For You without network');
assert.ok(env.window.__ctR270Test.lazyPosters270,'missing poster lazy-loading');
console.log('ANDROID_1_0_28_VALIDATED sports optimistic one click/no repaint/no scroll; 120 movie history with true media; 7 recommendation slots; cache fast; poster lazy logic');
