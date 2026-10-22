import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const start=html.indexOf('<script data-ct-android="r310-android-stable-js">');
const end=html.indexOf('</script>',start);
assert.ok(start>0&&end>start,'r310 official 1.0 HTML runtime not present');
const js=html.slice(start,end);
new Function(js);
for(const s of [
 "const REVISION='r310-android-official-1.0'",
 "window.__ctAndroidOfficialCode=10111",
 'window.__ctR310Profile={refresh,combine,stats:',
 'window.__ctR310Discover={begin,stats:',
 "window.__ctR307Taste={choose,shown,feedback,next,refill,warm,ingest,profile,stats:tasteStats",
 "window.__ctR310Discover?.begin?.(visit))picked.clear()",
 "Math.random()*sum",
 "window.addEventListener('click',tap,true);",
 'window.__ctR308Home={mergeMovies,blockedMovie,blockedEpisode,confirmedMovies,undo,tap,normalize,',
 'window.__ctR306Home={classify,consolidateSeries,recentEpisodes,refresh,normalize',
 'window.__ctR305MovieHistory={refresh,merge,latestRows:',
 'window.__ctR303SinglePaint',
 'window.__ctR293Gate',
 'window.addEventListener(\'click\',sportsClick304,true);',
 'if(events)events.remove();'
])assert.ok(js.includes(s),'Required legacy protection or r310 marker absent: '+s);
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1.0'/);
assert.match(gradle,/versionCode 10111/);
assert.match(gradle,/applicationId 'com.cinetracker.app'/);
const module=await readFile('apps/android/runtime-r310-profile-discover.js','utf8');
assert.ok(!module.includes('window.location.reload(')&&!module.includes('router.refresh('));
assert.ok(!module.includes('renderHome(')&&!module.includes('paintSports(')&&!module.includes('paintDiscover('));
const render=[],events={},docEvents={},scheduled=[];
const profileNode={closest:()=>({scrollTop:50}),isConnected:true};
const doc={
 hidden:false,documentElement:{dataset:{}},
 querySelector:sel=>sel==='[data-profile]'?profileNode:null,
 addEventListener:(type,callback)=>{(docEvents[type]??=[]).push(callback)}
};
const windowMock={
 __ctR307Taste:{ingest(v){render.push(['ingest',v.length])},warm(force){render.push(['warm',force])},stats(){return {}}},
 addEventListener:(type,callback)=>{(events[type]??=[]).push(callback)}
};
const local=new Map(),calls=[];
const cache={dashboard:[]};
let nextData=[];
const exec=new Function('window','document','route','rpc','localStorage','setInterval','setTimeout','queueMicrotask','syncProfile263',
 "let session={user:{id:'alpha'},access_token:'yes'},user={id:'alpha'},profileCache={dashboard:[]};"+
 "let ct168PaintProfile=(data)=>{window.__lastPaint=data;return true},renderProfile=()=>true;"+
 module+
 "return {profile:window.__ctR310Profile,discover:window.__ctR310Discover,"+
 "paint:data=>ct168PaintProfile(data,''),navigate:()=>renderProfile()," +
 "changeUser:id=>{session={user:{id},access_token:'yes'};user={id}},"+
 "cache:()=>profileCache};"
);
const app=exec(windowMock,doc,()=> 'profile', (name)=>{
 assert.equal(name,'cinetracker_profile_media_dashboard_v0991');
 calls.push(name);return Promise.resolve(nextData);
},{getItem:key=>local.get(key)||null,setItem:(key,value)=>local.set(key,value)},
 fn=>scheduled.push(fn),()=>0,fn=>fn(),()=>{});
const tv=(id,date,count=1)=>({media_type:'tv',media_id:id,tmdb_id:id,title:'Serie '+id,watched_episodes:count,last_watched_at:date});
nextData=[tv(51,'2026-10-22T08:20:00Z',12),tv(77,'2026-10-20T14:00:00Z',8)];
assert.equal(await app.profile.refresh(true),true);
assert.equal(app.profile.stats().verified,2);
assert.equal(render.find(x=>x[0]==='ingest')[1],2);
assert.equal(windowMock.__lastPaint.dashboard[0].media_id,51);
assert.equal(windowMock.__lastPaint.dashboard[0].last_watched_at,'2026-10-22T08:20:00Z');
const stale=app.paint({dashboard:[tv(51,'2026-10-08T10:00:00Z',2),tv(77,'2026-10-03T10:00:00Z',1)]});
assert.equal(stale,true);
assert.equal(windowMock.__lastPaint.dashboard[0].last_watched_at,'2026-10-22T08:20:00Z','Late stale profile render cannot remove recent watched series');
assert.equal(windowMock.__lastPaint.dashboard[0].watched_episodes,12);
nextData=[tv(51,'2026-10-22T08:20:00Z',12),tv(77,'2026-10-22T09:11:00Z',9)];
assert.equal(await app.profile.refresh(true),true);
assert.equal(windowMock.__lastPaint.dashboard[0].media_id,77,'Same-day newer watched series must move to front');
assert.ok(local.get('ct:r310:confirmed-profile:alpha')?.includes('2026-10-22'));
app.changeUser('beta');
assert.equal(app.profile.combine([]).length,0,'Previous account's watched series must not leak');
assert.equal(app.profile.stats().verified,0);
assert.equal(app.discover.begin('42:2026-10-22'),true);
assert.equal(app.discover.begin('42:2026-10-22'),false,'Single visit must not reroll repeatedly');
assert.equal(app.discover.begin('43:2026-10-22'),true,'New visit must create a fresh audited choice');
assert.equal(app.discover.begin('43:2026-10-23'),true,'Next day must start new round');
assert.equal(render.filter(x=>x[0]==='warm'&&x[1]).length,3);
assert.ok(js.includes("if(!force&&profileRows.length&&now()-profileLoadedAt<12*60*1000)return true;"));
assert.ok(js.includes("if(p.length<=2&&!key.startsWith('watchlist:'))void refill(key);"));
assert.ok(js.includes("now()-(lastByRef.get(ref(x))||0)>COOLDOWN"),'Cross-day repeated recommendations must be blocked within 21-day impressions');
assert.ok(js.includes("if(key.startsWith('watchlist:')"),'Watchlist pool must remain from true user entries only');
console.log('CINETRACKER_1_0_R310_TEST_OK: official version retained; Profile latest series confirmed + stale overwrite protected + account isolation; discover per-visit/day restart with stochastic nonrepeat & real-profile affinity; r309 Home + Sports retained.');
