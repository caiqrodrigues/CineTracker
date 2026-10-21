import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r306-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Official 1.0/r306 embedded runtime missing');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
for(const s of ["const REVISION='r306-android-official-1.0'","window.__ctAndroidOfficialCode=10107",
 "window.__ctR305MovieHistory={refresh,merge,restore:",
 "window.__ctR306Home={classify,consolidateSeries,recentEpisodes,refresh,normalize",
 "rpc('cinetracker_home_series_v527',{p_today:localDay(),p_limit_per_bucket:250})",
 "rpc('cinetracker_home_history_v391',{p_limit:100})",
 "window.__ctR303SinglePaint","window.__ctR296WweHome",
 "window.addEventListener('click',sportsClick304,true)",
 "if(events)events.remove();",
 "cinetracker_recommendation_filter_v525"])
 assert.ok(js.includes(s),'Missing preserved scope or Home fix: '+s);
const homeStart=js.indexOf('/* CineTracker Android 1.0 / r306 — one Home state reconciler */');
const homeEnd=js.indexOf('\nboot();',homeStart);
assert.ok(homeStart>=0&&homeEnd>homeStart);
const patch=js.slice(homeStart,homeEnd);
assert.ok(!patch.includes('router.refresh(')&&!patch.includes('window.location.reload('));
assert.ok(!patch.includes('renderSports(')&&!patch.includes('paintDiscover('));
assert.ok(!patch.includes("rpc('cinetracker_home_live_v0997_r5'"),'Do not duplicate full Home RPC');
assert.ok(patch.includes("window.__ctR305MovieHistory?.restore?.()"));
assert.ok(patch.includes("document.addEventListener('visibilitychange'"));

const watched=(tmdb,daysAgo,bucket='continue',extra={})=>({
 tmdb_id:tmdb,media_id:tmdb,media_type:'tv',title:'Série '+tmdb,
 watched_episodes:12,last_watched_at:new Date(Date.UTC(2026,9,21)-daysAgo*86400000).toISOString(),
 released_episodes:24,is_caught_up:false,home_bucket:bucket,...extra
});
let page='home',tab='series',owner='a';
let cache={series:[],history_episodes:[],history_movies:[]};
let latestResults={};
const events={},listeners={},calls=[];
const root={querySelector(){return null}};
const doc={hidden:false,documentElement:{dataset:{}},
 addEventListener(k,fn){(listeners[k]??=[]).push(fn)},
 querySelector:()=>null};
const win={__ctR305MovieHistory:{restore(){calls.push('movie-restored')},refresh(){calls.push('movie-refresh')}},
 addEventListener(k,fn){(events[k]??=[]).push(fn)}};
const work=new Function('window','document','route','rpc','localDay','setTimeout','queueMicrotask',
 'read', 'write','old', 'root','getTab','getOwner','setInterval',
 "let session={access_token:'test',user:{id:'a'}},user={id:'a'};"+
 "let homeActiveTab158='series',homeCache=read(),navSeq=1;"+
 "let paintHome=()=>{write(homeCache);return true};"+
 "let renderHome=async()=>{write(homeCache);return true};"+
 "const homeEpisodeHistory158=x=>'<div>'+x.episode_number+'</div>';"+
 patch+
 "return {api:window.__ctR306Home,paint:()=>paintHome(),render:()=>renderHome(1),"+
 "setData:data=>{homeCache=data},state:()=>homeCache,tab:x=>{homeActiveTab158=x},changeUser:id=>{session={access_token:'test',user:{id}};user={id}}};"
);
let observed=cache;
const app=work(win,doc,()=>page,(name,args)=>{
 calls.push(name);
 if(!(name in latestResults))return Promise.reject(new Error('simulated network failure'));
 return Promise.resolve(latestResults[name]);
},()=> '2026-10-21',undefined,fn=>fn(),()=>observed,x=>{observed=x},
 ()=>{},root,()=>tab,()=>owner,()=>0);
const classify=app.api.classify;
const now=Date.UTC(2026,9,21,12);
assert.equal(classify(watched(1,29),now).home_bucket,'continue','29 days active');
assert.equal(classify(watched(2,30),now).home_bucket,'dust','30 day threshold');
assert.equal(classify(watched(3,31,'continue',{is_up_to_date:true}),now).home_bucket,'dust',
 'Legacy UpToDate flag must not override 30-day dust');
assert.equal(classify(watched(4,31,'dust',{is_caught_up:true}),now).home_bucket,'up_to_date',
 'A caught-up series has no missing episode and should not be dust');
assert.equal(classify(watched(5,31,'continue',{latest_released_season_number:2,
 latest_released_episode_number:14,last_season_number:2,last_episode_number:11,
 latest_episode_air_date:'2026-10-20'}),now).home_bucket,'dust',
 'Old regular series cannot escape 30-day rule just because another episode aired');
assert.equal(classify(watched(4656,90,'dust',{title:'WWE Raw',
 latest_released_season_number:34,latest_released_episode_number:42,last_season_number:34,
 last_episode_number:41,latest_episode_air_date:'2026-10-19'}),now).home_bucket,'continue',
 'New unwatched WWE episode must appear in Continue despite old historical gaps');
assert.equal(classify(watched(1549,90,'continue',{title:'SmackDown',
 latest_released_season_number:28,latest_released_episode_number:42,last_season_number:28,
 last_episode_number:42,latest_episode_air_date:'2026-10-16'}),now).home_bucket,'up_to_date',
 'SmackDown with latest released watched should be UpToDate');
assert.equal(classify({...watched(9,90),watched_episodes:0,home_bucket:'not_started'},now).home_bucket,'not_started');
const merge=app.api.recentEpisodes;
const e=(at,num)=>({media_id:22,tmdb_id:150,season_number:1,episode_number:num,watched_at:at,media_title:'Exemplo'});
const merged=merge([e('2026-10-10T12:00:00Z',1),e('2026-10-20T12:00:00Z',2)],
 [e('2026-10-09T12:00:00Z',1),e('2026-10-19T12:00:00Z',3)]);
assert.equal(merged.length,3);
assert.equal(merged.at(-1).episode_number,2,'Recent series watched date must remain newest at bottom');
assert.equal(merged[0].watched_at,'2026-10-10T12:00:00Z','Stale duplicate must not roll date backwards');

// Validate real async refresh and stale Home repaint repairs.
latestResults={
 cinetracker_home_series_v527:{rows:[watched(3,31),watched(4,4)]},
 cinetracker_home_history_v391:{history_episodes:[e('2026-10-21T12:00:00Z',4)]}
};
app.setData({series:[watched(3,31,'continue')],history_episodes:[e('2026-10-10T12:00:00Z',1)]});
await app.api.refresh(true);
assert.equal(app.state().series.find(x=>x.tmdb_id===3).home_bucket,'dust');
assert.equal(app.state().history_episodes.at(-1).episode_number,4);
app.setData({series:[watched(3,31,'continue')],history_episodes:[e('2026-10-10T12:00:00Z',1)]});
app.paint();
assert.equal(app.state().series[0].home_bucket,'dust','Late cached paint must not undo dust');
assert.equal(app.state().history_episodes.at(-1).episode_number,4,'Late cached paint must not erase recent episode');
app.tab('movies');app.paint();
assert.ok(calls.includes('movie-restored'),'Old movie history must be restored after every Home repaint');
assert.ok(!calls.includes('cinetracker_home_live_v0997_r5'),'No redundant full-page RPC');
app.changeUser('b');app.setData({series:[],history_episodes:[]});app.paint();
assert.equal(app.api.stats().episodes,0,'Previous account episode history must be dropped');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'")&&gradle.includes('versionCode 10107'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
console.log('CINETRACKER_1_0_R306_TEST_OK: 30-day dust threshold, new WWE episode, current WWE caught-up, monotonic series/movie history, account isolation, no full-page refresh.');
