import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r270-android-js">',a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a);
const js=html.slice(a+marker.length,b);
const patch=await readFile('apps/android/runtime-r270-v1028-corrections.js','utf8');
new Function(js);new Function(patch);
for(const part of [
 "const REVISION='r270-android-official-1.0.28'","window.__ctAndroidOfficialCode=10070",
 "__ctR270AndroidV1028","cinetracker_android_movie_history_v1028",
 "markSportWatched159=async function","ct163PreloadAll=function",
 "IntersectionObserver","cinetracker_sports_stadium_summary_v296",
 "cinetracker_f1_watch_sync_v462","cinetracker_recommendation_filter_v525",
 "window.__ctR269AndroidV1027","window.__ctR268AndroidV1026",
 "window.__ctR267AndroidV1025","window.__ctR265AndroidV1023"
])assert.ok(js.includes(part),'required '+part);
assert.ok(html.includes('name="ct-official-version" content="1.0.28"'));
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(bad),'forbidden '+bad);
const region=(start,end)=>js.slice(js.indexOf(start),js.indexOf(end,js.indexOf(start)));
assert.equal((region('async function ct186FreshPools(c){','function ct186WatchPools(c){').match(/,2\)/g)||[]).length,3);
assert.equal((region('async function ct186PopularPool(kind,c){','function ct186Hash(s){').match(/,2\)/g)||[]).length,3);
let savedY=178;
const stack={innerHTML:'Initial Pokémon',get offsetHeight(){return this.innerHTML.length*2}};
const hint={textContent:'Histórico'};
const vp={get scrollTop(){return savedY},set scrollTop(v){savedY=v},querySelector(s){return s==='.home-history .stack'?stack:s==='.home-history-hint'?hint:null}};
const btn={dataset:{watched:'0'},classList:{toggle(){}},textContent:'✓ Marcar assistido',disabled:false,isConnected:true};
const sportsEvent={id:12,title:'Jogo',is_watched:false,sport_watched_at:null};
const sportsCache={events:[sportsEvent],watch_history:[],stats:{watched_events:2,sports_minutes:180}};
let sportsRpcs=0,historyRpcs=0,updates=0;
const rows=Array.from({length:180},(_,i)=>({id:i+1,tmdb_id:500+i,poster_path:'/poster'+i+'.jpg',media_title:i===155?'Depois de Pokémon':'Título '+i,watched_at:new Date(Date.UTC(2026,8,1)+i*86400000).toISOString()}));
const storage=new Map(),ss={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v))};
const env={
 window:{},document:{head:{appendChild(){}},createElement:()=>({textContent:'',id:''}),
 querySelector(s){return s==='[data-home-viewport="movies"]'?vp:null},querySelectorAll(s){return s==='[data-sport-watch="12"]'?[btn]:[]},addEventListener(){}},
 session:{user:{id:'demo'}},user:{id:'demo'},homeActiveTab158:'movies',homeCache:{history_movies:[]},
 sportsCache,profileCache:{},route:()=>'home',sessionStorage:ss,localStorage:ss,
 homeMovieRow158:x=>'<article>'+String(x.media_title||x.title)+'</article>',
 homeEpisodeHistory158:x=>'',discoverCard158:x=>'',paintHome:()=>{},renderHome:async()=>{},paintDiscover:()=>{},
 markSportWatched159:async()=>{},ct163PreloadAll:()=>{},ct163PreloadStarted:false,ct163Write:()=>{updates++},
 ct168SetWatchedButtons:()=>{},requestAnimationFrame:f=>f(),esc:x=>String(x),
 rpc:async(name,args)=>{
  if(name==='cinetracker_android_movie_history_v1028'){historyRpcs++;assert.equal(args.p_limit,450);return rows}
  if(name==='cinetracker_sport_mark_watched_v1'){sportsRpcs++;return {is_watched:true,duration_minutes:50}}
  throw Error('unexpected RPC '+name)
 },toast:()=>{},console,Date,Promise,Set,Map,JSON,Number,Math,Array,String,IntersectionObserver:undefined
};
vm.createContext(env);vm.runInContext(patch,env,{timeout:1000});
const T=env.window.__ctR270Test;assert.ok(T);
await T.fullMovieHistory();
assert.equal(historyRpcs,1);
assert.ok(stack.innerHTML.includes('Depois de Pokémon'),'history after Pokémon missing');
assert.ok(stack.innerHTML.includes('Título 0')&&stack.innerHTML.includes('Título 179'),'history incomplete');
assert.ok(savedY>178,'scroll anchor moved');
await T.fullMovieHistory();assert.equal(historyRpcs,1,'cache ignored');
const lazy=T.lazyPosterHtml270('<div class="thumb" style="background-image:url(\'https://image.tmdb.org/t/p/w154/abc.jpg\')"></div>');
assert.ok(lazy.includes('data-ct270-poster=')&&!lazy.includes('background-image:url'));
env.route=()=> 'sports';
const anchored=savedY;
await env.markSportWatched159(12,false);
assert.equal(sportsRpcs,1);
assert.equal(btn.dataset.watched,'1');
assert.equal(sportsEvent.is_watched,true);
assert.equal(savedY,anchored,'sports click jumped');
assert.equal(sportsCache.stats.watched_events,3);
assert.equal(updates,1);
assert.equal(T.processingSport270.size,0);
env.ct163PreloadAll();assert.equal(env.ct163PreloadStarted,true);
console.log('ANDROID_1_0_28_TEST_OK full movie history + scroll anchor + zero full sports refresh + lazy posters + bounded Discover + no preload stampede');