import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const key='<script data-ct-android="r270-android-js">',start=html.indexOf(key),end=html.indexOf('</script>',start+key.length);
assert.ok(start>=0&&end>start,'r270 official embedded script');
const script=html.slice(start+key.length,end);
new Function(script);
for(const marker of [
 "const REVISION='r270-android-official-1.0.28'",
 'window.__ctAndroidOfficialCode=10070',
 'window.__ctR270AndroidV1028',
 'window.__ctR269AndroidV1027',
 'cinetracker_home_history_v387',
 'cinetracker_recommendation_filter_v525',
 'cinetracker_sport_mark_watched_v1',
 'cinetracker_f1_watch_sync_v462',
 'cinetracker_special_series_counts_v540'
])assert.ok(script.includes(marker),'missing '+marker);
assert.ok(html.includes('name="ct-official-version" content="1.0.28"'));
const patch=await readFile('apps/android/runtime-r270-v1028-weekly-discover-sports.js','utf8');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.equal(patch.includes(bad),false,'forbidden '+bad);
assert.ok(!patch.includes('basicEligible263(')&&!patch.includes('sportsDetail263?.'),'private legacy closure must not be referenced');
const handlers={window:{},document:{}},memory=new Map(),local=new Map();
const mkStore=data=>({getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)});
let pages=0,shows=0,profileRpc=0,sportsRPC=0,painted=0;
let view='discover';
const rows=(kind,n)=>Array.from({length:n},(_,i)=>({
 id:kind==='movie'?101+i:kind==='anime'?301+i:201+i,
 title:kind+' '+i,name:kind+' '+i,
 poster_path:'/test.jpg',vote_average:8.2,release_date:'2025-01-01',first_air_date:'2025-01-01',
 media_type:kind==='movie'?'movie':'tv',original_language:kind==='anime'?'ja':'en',
 genre_ids:kind==='anime'?[16,10759]:[12],
}));
const header=(name)=>name==='[data-home-viewport="movies"]'?{scrollTop:120}:null;
const media=(id,title,date,last)=>({media_id:id===1549?9627:2111,tmdb_id:id,title,
 raw_tmdb:{last_episode_to_air:{air_date:date,season_number:id===1549?28:34,episode_number:40}},
 home_bucket:'up_to_date',is_caught_up:true,last_watched_at:last||'2026-10-05T10:00:00Z',available_episodes:0});
const globals={
 window:{addEventListener:(name,fn)=>{(handlers.window[name]??=[]).push(fn)},__ctR265Test:{allowed:x=>Boolean(x?.id&&x?.poster_path&&!/AEW|WWE/.test(x.title||''))}},
 document:{addEventListener:(name,fn)=>{(handlers.document[name]??=[]).push(fn)},querySelector:header,querySelectorAll:()=>[]},
 user:{id:'test-user'},session:{access_token:'token',user:{id:'test-user'}},
 sessionStorage:mkStore(memory),localStorage:mkStore(local),
 localDay:()=> '2026-10-18',
 Date,Math,Number,String,Boolean,JSON,Promise,Map,Set,Array,WeakMap,WeakSet,
 setTimeout,clearTimeout,queueMicrotask,
 homeActiveTab158:'series',homeCache:{series:[media(1549,'WWE Friday Night SmackDown','2026-10-02'),media(4656,'Raw','2026-10-05')],history_movies:[],history_episodes:[]},
 sportsCache:{events:[{id:57,is_watched:false}]},profileCache:{},ct186LocalBlocked:new Set(),
 ct186ForYouData:null,ct166ForYouData:null,ct186ContextValue:null,ct186ContextAt:0,
 discoverCache:new Map(),discoverState:{tab:'foryou'},
 ct163Write:()=>{},ct186UniqueRows:x=>[...new Map(x.map(z=>[z.media_type+':'+z.id,z])).values()],
 ct186FreshEligible:x=>!x.is_seen&&!x.is_watchlist,ct186WatchEligible:()=>true,
 ct186Quality:x=>x.vote_average>=7.5&&x.poster_path,
 ct186Type:x=>x.media_type,ct186Key:x=>x.media_type+':'+x.id,ct186Year:x=>2025,
 ct186Anime:x=>x.original_language==='ja',ct186Context:async()=>({}),
 ct186WatchPools:()=>({movie:[rows('movie',1)[0]],series:[rows('series',1)[0]],anime:[rows('anime',1)[0]]}),
 ct186Select:data=>{
  const f=data._ct186_fresh,w=data._ct186_watchlist;
  return{daily:f.movie[0],fm:f.movie[1],fs:f.series[0],fa:f.anime[0],
   wm:w.movie[0],ws:w.series[0],wa:w.anime[0],
   wmPool:w.movie,wsPool:w.series,waPool:w.anime};
 },
 ct186LoadForYou:async()=>({}),ct186RefreshVisible:async()=>({}),
 mediaTmdb:x=>x.tmdb_id,route:()=>view,
 paintDiscover:()=>painted++,paintHome:()=>painted++,
 toast:()=>{},
 tmdb:async(path,options)=>{
  if(path==='/tv/1549'){shows++;return{last_episode_to_air:{season_number:28,episode_number:42,air_date:'2026-10-16',name:'Novo SmackDown'}}}
  if(path==='/tv/4656'){shows++;return{last_episode_to_air:{season_number:34,episode_number:41,air_date:'2026-10-12',name:'Novo Raw'}}}
  pages++;const kind=path.includes('/movie')?'movie':options?.with_genres==='16'?'anime':'series';
  return{results:rows(kind,14)};
 },
 api:async()=>[],
 rpc:async(name,args)=>{
  if(name==='cinetracker_recommendation_filter_v525'){profileRpc++;return{blocked_keys:['movie:102']}}
  if(name==='cinetracker_home_history_v387')return{history_movies:[{tmdb_id:55,media_id:100,title:'Filme após Pokémon',poster_path:'/correct.jpg',runtime_minutes:129,vote_average:8.4,watched_at:'2026-10-17T23:00:00Z'}]};
  if(name==='cinetracker_sport_mark_watched_v1'){sportsRPC++;return{is_watched:args.p_watched}}
  return{};
 },
};
globals.window.document=globals.document;
vm.createContext(globals);vm.runInContext(patch,globals,{timeout:2000});
const T=globals.window.__ctR270Test;
assert.equal(T.fridayOrMonday(5),'2026-10-16');
assert.equal(T.fridayOrMonday(1),'2026-10-12');
const d=await globals.ct186LoadForYou(false);
assert.equal(d.__ct270Canonical,true);
assert.ok(d._ct186_fresh.movie.length>1);
assert.ok(d._ct186_fresh.series.length>0);
assert.ok(d._ct186_fresh.anime.length>0);
assert.equal(d._ct186_fresh.movie.some(x=>x.id===102),false,'blocked movie leaked to fresh');
assert.ok(!d._ct186_fallback.movie.length,'Watchlist must not receive new candidates');
const firstRequests=pages;
await globals.ct186LoadForYou(false);
assert.equal(pages,firstRequests,'cached Pra Voce triggered the network again');
view='home';
const wwe=await T.verifyWeekly({id:1549,title:/smackdown/i,day:5,knownMedia:[9627,2110]});
const raw=await T.verifyWeekly({id:4656,title:/^raw$/i,day:1,knownMedia:[2111]});
assert.equal(wwe.pending,true);assert.equal(raw.pending,true);
assert.equal(wwe.season,28);assert.equal(wwe.episode,42);
T.applyWeekly({id:1549,title:/smackdown/i},wwe);
T.applyWeekly({id:4656,title:/^raw$/i},raw);
assert.equal(globals.homeCache.series.filter(x=>x.home_bucket==='continue').length,2,'Raw/SmackDown must leave Em dia with recently released unseen episodes');
globals.homeActiveTab158='movies';
await T.movieHistory270();
assert.equal(globals.homeCache.history_movies[0].poster_path,'/correct.jpg','movie history poster missing');
assert.equal(globals.homeCache.history_movies[0].runtime_minutes,129,'movie history metadata not restored');
view='sports';
const click=handlers.window.click.at(-1);
let stopped=0;const button={dataset:{sportWatched:'57',on:'0'},textContent:'✓ Marcar como assistido',matches:()=>false,closest:()=>null};
click({target:{closest:()=>button},preventDefault(){stopped++},stopPropagation(){stopped++},stopImmediatePropagation(){stopped++}});
for(let i=0;i<5;i++)await Promise.resolve();
assert.equal(stopped,3,'sports click propagated into navigation');
assert.equal(sportsRPC,1,'sports click must write once only');
assert.equal(globals.sportsCache.events[0].is_watched,true);
console.log('ANDROID_1_0_28_TEST_OK isolated discover cache/filter, WWE newly aired checks, canonical movie history, optimistic one-RPC Sports watch');
