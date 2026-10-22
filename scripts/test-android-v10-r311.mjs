import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r311-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'official r311 HTML script not found');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.match(html,/name="ct-official-version" content="1.0"/);
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/applicationId 'com.cinetracker.app'/);
assert.match(gradle,/versionName '1.0'/);
assert.match(gradle,/versionCode 10112/);
assert.match(gradle,/signingConfig signingConfigs.official/);
for(const snippet of [
 "const REVISION='r311-android-official-1.0'",
 "window.__ctAndroidOfficialCode=10112",
 "window.__ctR311Special={refresh,best,stats:",
 "window.__ctR311Movies={check,sync,stats:",
 "window.__ctR311Discover={recover,stats:",
 "const verified=window.__ctR311Special?.best?.(k)",
 "if(kinds.some(k=>array(next._ct186_fresh[k]).length<14))",
 "await window.__ctR311Discover?.recover?.(next,stamp);",
 'window.__ctR303SinglePaint',
 'window.__ctR310Profile',
 'window.__ctR307Taste',
 "window.addEventListener('click',sportsClick304,true)",
 "window.addEventListener('click',tap,true);",
 "if(events)events.remove();",
 'window.__ctR305MovieHistory=',
 'window.__ctR306Home=',
 'window.__ctR308Home=',
 'cinetracker_home_movie_history_v542',
 'cinetracker_home_series_v527',
 'cinetracker_home_history_v391',
 'cinetracker_unmark_episode_v1',
 'cinetracker_ufc_series_v518',
 'cinetracker_wwe_ppv_series_v519',
 'cinetracker_f1_series_v512'
])assert.ok(js.includes(snippet),'missing stable function or r311 fix: '+snippet);
assert.ok(!js.includes('g.includes(10766)||g.includes(18))return false'), 'Drama was still excluded as adult content');
const module=await readFile('apps/android/runtime-r311-home-discover.js','utf8');
new Function(module);
for(const violation of ['window.location.reload(', 'router.refresh(', 'while(true)', 'setInterval(', "renderSports(", "ct168PaintProfile("])
 assert.ok(!module.includes(violation),'out-of-scope or unbounded behavior '+violation);
assert.ok(module.includes("if(uid()!==who)return false;"),'discard cross-account recommendation work');
assert.ok(module.includes("ct186FreshEligible(item,ctx)"),'never bypass watchlist/seen exclusions');
assert.ok(module.includes("window.__ctR265Test?.allowed?.(item)!==true"),'never bypass origin/content restrictions');
assert.ok(module.includes("The caller's existing v525 auditData"),'auditor remains the final authority');
const events={},docEvents=[],responses=[],painterCalls=[],movieItems=[];
let account='user-1',page='home',tab='series',lastRows=[];
const dummyDoc={
 hidden:false,documentElement:{dataset:{}},
 querySelector(){return null},
 addEventListener(type,fn){docEvents.push({type,fn})}
};
const w={
 addEventListener(k,f){(events[k]??=[]).push(f)},
 __ctR290HomeTest:{mount(){painterCalls.push('special')}},
 __ctAndroidV1021:{loadCounts(){painterCalls.push('counts');return Promise.resolve({})}},
 __ctR308Home:{mergeMovies(rows){return [...rows,...movieItems].filter(x=>Number(x.tmdb_id)>0).sort((a,b)=>Date.parse(a.watched_at)-Date.parse(b.watched_at))}},
 __ctR305MovieHistory:{refresh(){return Promise.resolve({})}},
 __ctR271Bridge:{getPainter(){return rows=>{painterCalls.push(['movie',rows.length]);return true}}},
 __ctR307Taste:{warm(){return Promise.resolve(true)},profile(){return{positive:new Map([[28,10]])}}},
 __ctR265Test:{allowed(){return true}}
};
const calls=[];
const ctx={dash:[{title:'Watchlist',media_type:'movie',tmdb_id:777,is_watchlist:true}],watchMovieIds:new Set([777]),historyMovieIds:new Set(),watchTvIds:new Set(),historyTvIds:new Set()};
function example(kind,i){
 return {id:kind==='movie'?i+101:i+901,media_type:kind==='movie'?'movie':'tv',
  title:'Eligible '+kind+' '+i,genre_ids:kind==='anime'?[16]:[28],poster_path:'/image.jpg',vote_average:7.5,
  first_air_date:'2025-01-01',release_date:'2025-01-01'};
}
const context={
 window:w,document:dummyDoc,MutationObserver:undefined,
 route:()=>page,session:{access_token:'fake',user:{id:account}},user:{id:account},
 homeActiveTab158:tab,homeCache:{history_movies:[]},
 renderHome:async()=>true,paintHome:()=>true,
 rpc:async(name,params)=>{
  calls.push([name,params]);
  if(name==='cinetracker_ufc_series_v518'||name==='cinetracker_wwe_ppv_series_v519'||name==='cinetracker_f1_series_v512')
   return{series:{home_bucket:'continue',available_episodes:2,watched_episodes:7},events:[{episode_number:3}]};
  throw Error('unexpected RPC '+name);
 },
 localDay:()=> '2026-10-22',newDate:null,
 setTimeout:()=>0,queueMicrotask:fn=>fn(),
 ct186Context:async()=>ctx,ct186WatchPools:()=>({movie:[example('movie',777)],series:[],anime:[]}),
 ct186WatchEligible:()=>true,
 ct186FreshEligible:()=>true,
 ct186UniqueRows:rows=>[...new Map(rows.map(x=>[x.media_type+':'+x.id,x])).values()],
 ct186Type:x=>x.media_type,ct186Anime:x=>x.title.includes('anime'),
 ct186MergeRows:(a,b)=>[...a,...b],
 safeTmdb:async(endpoint,params)=>{
  responses.push([endpoint,params]);
  const kind=endpoint.endsWith('movie')?'movie':params.with_origin_country==='JP'?'anime':'series';
  return{results:Array.from({length:22},(_,i)=>example(kind,i))};
 },
 Date,Math,
 console
};
vm.runInNewContext(module,context,{filename:'runtime-r311-home-discover.js'});
assert.ok(w.__ctR311Special&&w.__ctR311Movies&&w.__ctR311Discover);
assert.equal(await w.__ctR311Special.refresh(true),true,'3 actual authenticated special series must load');
assert.equal(w.__ctR311Special.stats().verified,3);
assert.equal(w.__ctR311Special.best('ufc').series.watched_episodes,7);
assert.ok(painterCalls.includes('special'),'the old special series presenter must re-render after server confirmation');
assert.equal(calls.length,3,'no redundant full Home RPC or Web/SQL modification');
page='discover';tab='series';
const data={_ct186_fresh:{movie:[],series:[],anime:[]},_ct186_watchlist:{movie:[],series:[],anime:[]}};
const result=await w.__ctR311Discover.recover(data,'user-1:2026-10-22');
assert.equal(result,true,'empty v421 response must recover real candidates');
for(const kind of ['movie','series','anime'])
 assert.ok(data._ct186_fresh[kind].length>=10,'eligible '+kind+' must be available');
assert.ok(responses.length>=3,'public candidate acquisition did not run');
assert.ok(data._ct186_watchlist.movie.length>0,'watchlist pool must come from the real dashboard');
assert.ok(!data.__ct283ServerAudited&&!data.__ct288Canonical,
 'public candidates cannot masquerade as verified v525 recommendations');
context.session={access_token:'fake',user:{id:'user-2'}};
context.user={id:'user-2'};
assert.equal(w.__ctR311Special.best('ufc'),null,'special series data leaked across accounts');
assert.equal(w.__ctR311Discover.stats().account,'user-2','recommendation impression state not account isolated');
console.log('CINETRACKER_1_0_R311_TEST_OK: public version 1.0, code 10112, r310 functions preserved; UFC/WWE/F1 authenticated status refresh; account isolation; empty Discover recovered with eligible movie, TV and anime pools, only v525 grants display; no Web/Profile/Sports/full page reload changes.');
