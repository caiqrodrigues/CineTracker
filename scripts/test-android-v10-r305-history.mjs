import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r305-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android 1.0 r305 runtime missing');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
for(const req of [
 "const REVISION='r305-android-official-1.0'",
 'window.__ctAndroidOfficialCode=10106',
 "if(events)events.remove();",
 'grid-template-columns:minmax(0,1fr)!important',
 "window.addEventListener('click',sportsClick304,true)",
 'window.__ctR303SinglePaint',
 'window.__ctR293Gate',
 'window.__ctR296WweHome',
 'cinetracker_recommendation_filter_v525',
 'window.__ctR305MovieHistory=',
 "rpc('cinetracker_home_movie_history_v542',{p_limit:200,p_offset:0})",
 "[['previous','Anteriores'],['upcoming','Próximos']]"
])assert.ok(js.includes(req),'Missing retained r305 behavior: '+req);
assert.ok(!js.includes('if(events)bar.appendChild(events);'),'Ver Eventos still injected into Sports action area');
assert.ok(!js.includes('grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;width:100%!important;margin-top:9px!important}'),
 'Sports action row was not expanded to one button');
const start=js.indexOf('/* Android 1.0 / r305 — authorized recent-movie-history overlay */');
const end=js.indexOf('\nboot();',start);
assert.ok(start>0&&end>start,'History owner must be the final module before boot');
const module=js.slice(start,end);
assert.ok(!module.includes('window.location.reload(')&&!module.includes('router.refresh('));
assert.ok(!module.includes('renderHome(')&&!module.includes('renderSports('));
assert.ok(!module.includes('profileCache=')&&!module.includes('discoverState='));
assert.ok(module.includes('const previousPainter=bridge.getPainter();'));
assert.ok(module.includes('bridge.setPainter(function(items){'));
assert.ok(module.includes("document.addEventListener('visibilitychange'"));
assert.ok(module.includes("window.addEventListener('pageshow'"));
assert.ok(module.includes("window.addEventListener('cinetracker:data-changed'"));
assert.ok(module.includes('setInterval(()=>{if(!document.hidden&&active())void refresh(false)},120000)'));

const base=(id,day,extra={})=>({media_id:id,tmdb_id:id,media_type:'movie',title:'Filme '+id,watched_at:day+'T17:30:00.000Z',...extra});
let current='home',tab='movies',account='user-a',syncedData=null;
const pending=[],events={},listeners={},paints=[],pageDraws=[];
const bridge={
 painter(rows){paints.push([...rows]);return true},
 getPainter(){return this.painter},
 setPainter(fn){this.painter=fn}
};
const previous=[base(1,'2026-09-01'),base(2,'2026-10-08',{title:'Pokémon'})];
function combine(parts){
 const out=[],seen=new Set();
 for(const x of parts.flat())if(x?.media_id&&x?.watched_at){
  const k=x.media_id+':'+x.watched_at;
  if(!seen.has(k)){seen.add(k);out.push(x)}
 }
 return out.sort((a,b)=>Date.parse(b.watched_at)-Date.parse(a.watched_at));
}
const windowMock={
 __ctR271Bridge:bridge,__ctR283History:{combine},
 addEventListener(name,fn){(events[name]??=[]).push(fn)}
};
const documentMock={
 hidden:false,documentElement:{dataset:{}},
 addEventListener(name,fn){(listeners[name]??=[]).push(fn)}
};
const run=new Function('window','document','route','startRows','rpc','setInterval','setTimeout','setImmediate','Date',
 "let session={access_token:'auth-token',user:{id:'user-a'}},user={id:'user-a'},homeActiveTab158='movies';"+
 "let homeCache={history_movies:[...startRows]},paintHome=()=>{pageDraws.push('home');return true};"+
 module+
 "return{state:()=>({homeCache,session,user}),switchUser(id){session={access_token:'auth-token',user:{id}};user={id}},switchTab(v){homeActiveTab158=v},paintHome:()=>paintHome(),bridge};"
);
const oldDate=Date;
const app=run(windowMock,documentMock,()=>current,previous,
 (name,args)=>{assert.equal(name,'cinetracker_home_movie_history_v542');assert.deepEqual(args,{p_limit:200,p_offset:0});return new Promise((resolve,reject)=>pending.push({resolve,reject}))},
 ()=>42,()=>42,undefined,oldDate);
const owner=windowMock.__ctR305MovieHistory;
assert.ok(owner,'History owner API absent');
let task=owner.refresh(true);
assert.equal(pending.length,1,'First open must query server for recent films');
pending.shift().resolve({total:3,rows:[base(1,'2026-09-01'),base(2,'2026-10-08',{title:'Pokémon'}),base(3,'2026-10-20')]});
await task;
assert.equal(owner.stats().latest,'2026-10-20T17:30:00.000Z');
assert.equal(paints.length,1,'Fresh response should repaint ONLY movie history section');
assert.equal(paints[0][0].media_id,3);
assert.equal(paints[0][2].media_id,1);
assert.equal(app.state().homeCache.history_movies.length,3);

// The old r271/r284 cursor can finish after today. Its stale paint cannot
// discard the server-verified Oct 20 card.
bridge.getPainter()(previous);
assert.equal(paints.at(-1)[0].media_id,3,'Old paginated request replaced newest watched movie');
assert.equal(app.state().homeCache.history_movies[0].media_id,3);
assert.equal(pageDraws.length,0,'Movie history refresh must not rebuild Home page');

task=owner.refresh(true);
assert.equal(pending.length,1);
pending.shift().resolve({total:4,rows:[base(1,'2026-09-01'),base(2,'2026-10-08',{title:'Pokémon'}),base(3,'2026-10-20'),base(4,'2026-10-20',{watched_at:'2026-10-20T22:59:00Z'})]});
await task;
assert.equal(paints.at(-1)[0].media_id,4,'Later same-day movie did not advance the history');
assert.equal(paints.at(-1).length,4);

// Foreground lifecycle should actively request a fresh page, but never
// refetch the whole page or alter unrelated tabs.
listeners.visibilitychange[0]();
assert.equal(pending.length,1,'App foreground should refresh latest movies');
pending.shift().resolve({total:4,rows:[base(4,'2026-10-20',{watched_at:'2026-10-20T22:59:00Z'})]});
await Promise.resolve();await Promise.resolve();await new Promise(setImmediate);
const previousPaintCount=paints.length;
bridge.getPainter()(previous);
assert.ok(paints.length>previousPaintCount);
assert.equal(paints.at(-1)[0].media_id,4);

app.switchTab('series');
const idleCalls=pending.length;
events.pageshow[0]();
await Promise.resolve();
assert.equal(pending.length,idleCalls,'Series should not trigger movie-history fetch');
app.switchTab('movies');
const homeResult=app.paintHome();
assert.equal(homeResult,true);
await Promise.resolve();
assert.equal(pending.length,idleCalls,'Immediate reentry should honor short in-flight throttle');
task=owner.refresh(true);
assert.equal(pending.length,idleCalls+1,'Explicit refresh must bypass TTL');
pending.shift().reject(new Error('network unavailable'));
await task;
assert.ok(owner.stats().lastError.includes('network unavailable'));
assert.equal(paints.at(-1)[0].media_id,4,'A failed request cannot lose already-verified recent movie');

app.switchUser('user-b');
task=owner.refresh(true);
assert.equal(pending.length,1);
pending.shift().resolve({total:1,rows:[base(90,'2026-10-19')]});
await task;
assert.equal(owner.stats().account,'user-b');
assert.equal(owner.stats().latest,'2026-10-19T17:30:00.000Z');
assert.equal(paints.at(-1)[0].media_id,90);
assert.ok(!paints.at(-1).some(x=>x.media_id===4),'Old account latest movie leaked across users');

const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'")&&gradle.includes('versionCode 10106'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));
console.log('CINETRACKER_1_0_R305_TEST_OK: no Sports Ver eventos, watched action untouched; recent movie history refresh on foreground, latest appended today, stale asynchronous pages never erase new records, network failure preserves visible history, no cross-user data, no full Home refresh.');
