import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const start='<script data-ct-android="r270-android-js">';
const a=html.indexOf(start),b=html.indexOf('</script>',a+start.length);
assert.ok(a>=0&&b>a,'r270 expected in APK runtime');
const js=html.slice(a+start.length,b);
const patch=await readFile('apps/android/runtime-r270-v1028-recovery.js','utf8');
new Function(js);new Function(patch);
for(const key of [
 "const REVISION='r270-android-official-1.0.28'",
 'window.__ctAndroidOfficialCode=10070',
 '__ctR270AndroidV1028',
 'cinetracker_profile_summary_v489',
 'cinetracker_profile_list_v475',
 'cinetracker_profile_actors_v465',
 'cinetracker_sport_mark_watched_v1',
 'cinetracker_home_live_v0997_r3',
 'cinetracker_sports_stadium_summary_v296',
 'cinetracker_f1_watch_sync_v462',
 '__ctR269AndroidV1027',
 '__ctR268AndroidV1026',
 '__ctR267AndroidV1025',
 '__ctR243Fix'
])assert.ok(js.includes(key),'missing '+key);
assert.ok(html.includes('name="ct-official-version" content="1.0.28"'));
for(const denied of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(denied),'forbidden '+denied);
const stored=new Map(),clicks={window:[],document:[]},rpcCalls=[],paints=[];
const fakeDom={
 head:{appendChild(){}},documentElement:{dataset:{}},
 createElement(tag){return {tagName:tag,textContent:'',dataset:{},className:'',type:tag,innerHTML:'',appendChild(){},isConnected:true,after(){},addEventListener(){},querySelector(){return null}}},
 querySelector(){return null},querySelectorAll(){return fakeDom.activeButton?[fakeDom.activeButton]:[]},
 addEventListener(name,fn,capture){(clicks.document[name]??=[]).push({fn,capture})}
};
const storage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,String(v)),removeItem:k=>stored.delete(k)};
const mk=(type,id,anime=false)=>({id,tmdb_id:id,media_type:type,title:'Elegível '+id,poster_path:'/x.jpg',vote_average:8.2,anime});
const freshRows={movie:[mk('movie',11),mk('movie',12)],series:[mk('tv',21),mk('tv',22)],anime:[mk('tv',31,true),mk('tv',32,true)]};
const listing={
 series:[{media_id:1,tmdb_id:12,title:'Série 1',poster_path:'/a',watched_episodes:50}],
 movies:[{media_id:2,tmdb_id:13,title:'Filme 1',poster_path:'/b'}],
 series_favorites:[{media_id:3,tmdb_id:14,title:'Série Favorita',poster_path:'/c'}],
 movie_favorites:[{media_id:4,tmdb_id:15,title:'Filme Favorito',poster_path:'/d'}],
 actors:[{tmdb_person_id:10,actor_name:'Ator favorito',profile_path:'/actor'}],
 counts:{series:123,movies:1300,series_favorites:40,movie_favorites:30,actors:20}
};
const watchPools={movie:[{...mk('movie',72),_ct_watchlist:true}],series:[{...mk('tv',73),_ct_watchlist:true}],anime:[{...mk('tv',74,true),_ct_watchlist:true}]};
const stats={stats:{movies_watched:1300,total_minutes:125000},series_stats:{},remaining:{},sports_stats:{sports_minutes:300}};
const env={
 window:{addEventListener(name,fn,capture){(clicks.window[name]??=[]).push({fn,capture})},__ctR265Test:{allowed:x=>Boolean(x.poster_path)}},
 document:fakeDom,session:{user:{id:'123'}},user:{id:'123'},localStorage:storage,sessionStorage:storage,
 profileCache:null,navSeq:1,discoverCache:new Map(),discoverState:{tab:'foryou'},
 route:()=>env.currentRoute,currentRoute:'profile',homeActiveTab158:'series',sportsCache:{events:[{id:45,is_watched:false}]},
 rpc:async(name,args)=>{
  rpcCalls.push({name,args});
  if(name==='cinetracker_profile_summary_v489')return listing;
  if(name==='cinetracker_profile_quick_stats_v1')return stats;
  if(name==='cinetracker_sport_mark_watched_v1')return {is_watched:args.p_watched};
  if(name==='cinetracker_profile_list_v475')return {rows:listing.movies,count:1300};
  if(name==='cinetracker_profile_actors_v465')return {rows:listing.actors,count:20};
  throw new Error('unexpected rpc '+name);
 },
 setApp:()=>{},shell:()=>'<profile/>',loading:()=>'<loading/>',
 ct163Read:()=>null,ct163Write:()=>{},
 ct168PaintProfile:d=>{paints.push(d)},ct168MergeQuick:(base,q)=>({...base,...q,dashboard:base.dashboard||[],favorite_actors:base.favorite_actors||[]}),
 ct168ProfileNote:()=>{},ct186Context:async()=>({}),ct186WatchPools:()=>watchPools,
 ct186UniqueRows:arr=>[...new Map(arr.map(x=>[x.media_type+':'+x.id,x])).values()],
 ct186FreshEligible:x=>!x.is_seen&&!x.is_watchlist,ct186Type:x=>x.media_type,ct186Anime:x=>x.anime,
 ct186Select:d=>({daily:d._ct186_fresh.movie[0],fm:d._ct186_fresh.movie[1],fs:d._ct186_fresh.series[0],fa:d._ct186_fresh.anime[0],wm:d._ct186_watchlist.movie[0],ws:d._ct186_watchlist.series[0],wa:d._ct186_watchlist.anime[0],
  wmPool:d._ct186_watchlist.movie,wsPool:d._ct186_watchlist.series,waPool:d._ct186_watchlist.anime}),
 pages:async(path,params,type,n)=>{
  assert.equal(n,2,'initial Discover calls should request only two pages');
  return type==='movie'?freshRows.movie:params.with_genres==='16'?freshRows.anime:freshRows.series;
 },
 CT186_MIN_SCORE:7.5,ct186Invalidate:()=>{},paintDiscover:()=>{},ct168ProfileNote:()=>{},
 syncProfile263:()=>{},stadiumSync:async()=>{},
 renderProfile:async()=>{},renderHome:async()=>{},homeMovieRow158:()=>'<movie/>',
 openProfileMore263:()=>{},cardHtml263:x=>'<card/>',ct163PreloadAll:()=>{},ct163PreloadStarted:false,
 ct186LoadForYou:async()=>{},ct186RefreshVisible:async()=>{},
 requestAnimationFrame:fn=>fn(),toast:()=>{},Date,Math,Map,Set,WeakMap,WeakSet,Array,Promise,console,
};
vm.createContext(env);vm.runInContext(patch,env,{timeout:1000});
assert.equal(typeof env.window.__ctR270Test?.mergeLists,'function');
await env.renderProfile(1);
assert.ok(env.profileCache.dashboard.length>=4,'Profile must show media across all 4 categories');
assert.ok(env.profileCache.favorite_actors.length===1,'actors not loaded');
assert.ok(env.profileCache.dashboard.some(x=>x.is_seen),'movie history flag lost');
assert.ok(env.profileCache.dashboard.some(x=>x.is_favorite),'favorite flags lost');
assert.ok(rpcCalls.some(x=>x.name==='cinetracker_profile_summary_v489'),'must fetch real profile summary');
assert.ok(!rpcCalls.some(x=>x.name==='cinetracker_profile_payload_v0997'),'must not run old heavy full profile query');
env.currentRoute='discover';const discovery=await env.ct186LoadForYou(false);
assert.ok(discovery.daily&&discovery.movie&&discovery.series&&discovery.anime,'four fresh slots missing');
assert.ok(discovery.watchlist_movie&&discovery.watchlist_series&&discovery.watchlist_anime,'Watchlist slots missing');
assert.notEqual(discovery.daily.id,discovery.movie.id,'daily and fresh movie must be distinct');
assert.equal(env.ct163PreloadStarted,false,'warm task should not run until explicitly called');
env.ct163PreloadAll();assert.equal(env.ct163PreloadStarted,true);
let saved=false;
const button={dataset:{sportWatched:'45',on:'0'},classList:{toggle(){}},disabled:false,textContent:''};
fakeDom.activeButton=button;
const handler=clicks.window.click.find(x=>x.capture===true)?.fn;assert.equal(typeof handler,'function');
handler({target:{closest:()=>button},preventDefault(){saved=true},stopImmediatePropagation(){},stopPropagation(){}});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(saved,true);assert.equal(button.dataset.on,'1');
assert.equal(env.sportsCache.events[0].is_watched,true,'sport optimistic status not synchronized');
assert.ok(rpcCalls.some(x=>x.name==='cinetracker_sport_mark_watched_v1'),'sports mark RPC missing');
console.log('ANDROID_1_0_28_TEST_OK profile filled including favorites/actors, 7 Discover slots initial 6 TMDB pages, sport optimistic no redraw, no heavy preload');
