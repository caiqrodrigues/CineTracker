import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r309-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Official Android 1.0/r308 script missing');
const js=html.slice(a+tag.length,b);new Function(js);
for(const marker of [
 "const REVISION='r309-android-official-1.0'",
 "window.__ctAndroidOfficialCode=10110",
 'window.__ctR308Home={mergeMovies,blockedMovie,blockedEpisode,confirmedMovies,undo,tap,normalize,',
 "cinetracker_unmark_history_item_v426",
 "cinetracker_unmark_episode_v1",
 'window.__ctR307Taste={choose,shown,feedback,next,refill,warm,profile,stats:tasteStats',
 'window.__ctR307HomeGuard={scan,cleanOrphans,repairMovies,stats:',
 'window.__ctR306Home={classify,consolidateSeries,recentEpisodes,refresh,normalize,dropEpisode:',
 "window.__ctR305MovieHistory={refresh,merge,latestRows:()=>fresh,drop:",
 "window.__ctR308Home?.blockedEpisode?.(x)",
 "!window.__ctR308Home?.blockedMovie?.(x)",
 "window.addEventListener('click',sportsClick304,true)",
 "if(events)events.remove();",
 "cinetracker_recommendation_filter_v525",
 "window.__ctR303SinglePaint"
])assert.ok(js.includes(marker),'Missing retained feature: '+marker);
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'")&&gradle.includes('versionCode 10110'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));
const module=await readFile('apps/android/runtime-r308-home-actions.js','utf8');
assert.ok(!module.includes('window.location.reload(')&&!module.includes('router.refresh('));
assert.ok(!module.includes('renderSports(')&&!module.includes('paintDiscover('));
assert.ok(!module.includes('location.replace('));
assert.ok(module.includes('min-height:76px!important'),'UFC height must be same as other series');
assert.ok(module.includes('width:52px!important'),'episode mark touch target must be widened');
assert.ok(module.includes('data-ct308-undo'),'Undo control missing');
assert.ok(module.includes('stableBeforePaint();'),'Movie history must be stabilized BEFORE paint');
assert.ok(module.includes('localStorage.getItem(key(id))'),'Verified data should be available before movie history paint');
const form=(id,time)=>({media_id:id,tmdb_id:id,media_type:'movie',title:'Movie '+id,watched_at:time});
let account='user-a',tab='movies',place='home',homeCache={history_movies:[form(4,'2026-10-08T01:00:00Z')],history_episodes:[{
 media_id:18,tmdb_id:98,season_number:2,episode_number:3,watched_at:'2026-10-20T21:00:00Z'
}]};
let latest=[form(7,'2026-10-21T21:00:00Z')],paintCount=0,marked=0,dropMovie=0,dropEpisode=0;
let markedResolve;
const clickEvents=[],docListeners={};
const doc={
 hidden:false,
 documentElement:{dataset:{}},
 querySelector(selector){return selector.startsWith('[data-home-mark-episode')?null:null},
 createElement(type){return{type,id:'',textContent:'',style:{},content:{firstElementChild:null}}},
 head:{appendChild(){}},
 addEventListener(name,fn,opt){(docListeners[name]??=[]).push({fn,opt})}
};
const windowMock={
 __ctR271Bridge:{getPainter:()=>function(rows){paintCount++;return rows},setPainter(fn){this.painter=fn},painter:null},
 __ctR305MovieHistory:{
 latestRows:()=>latest,drop(){dropMovie++},refresh:async()=>{return latest}
 },
 __ctR306Home:{dropEpisode(){dropEpisode++},refresh:async()=>{}},
 addEventListener(name,fn){clickEvents.push(name)},dispatchEvent(){}
};
windowMock.__ctR271Bridge.getPainter=function(){return this.painter||((rows)=>{paintCount++;return rows})};
const local=new Map(),toastMessages=[],rpcCalls=[];
const compile=new Function('window','document','localStorage','route','paintHome','markNextEpisode158','homeMovieRow158','homeEpisodeHistory158','getCache','setCache','getAccount','getTab','rpc','toast','setTimeout','queueMicrotask',
 "let session={access_token:'mock',user:{id:'user-a'}},user={id:'user-a'},homeActiveTab158='movies',homeCache=getCache();"+
 module+
 "return{api:window.__ctR308Home,paint:()=>paintHome(),get:()=>homeCache,set:x=>{homeCache=x},setTab:x=>{homeActiveTab158=x},changeAccount:x=>{session={access_token:'mock',user:{id:x}};user={id:x}}};"
);
const app=compile(windowMock,doc,{getItem:key=>local.get(key)||null,setItem:(key,val)=>local.set(key,val)},
 ()=>place,()=>{paintCount++;return true},
 async id=>{marked++;return new Promise(resolve=>{markedResolve=resolve})},
 (x,history)=>'<div class="home-action-row ct111-history-row"><div class="media-row">'+x.title+'</div><button>Reassistir</button></div>',
 x=>'<div class="home-action-row ct111-history-row"><div class="media-row">'+x.media_id+'</div><button>Reassistir</button></div>',
 ()=>homeCache,x=>homeCache=x,()=>account,()=>tab,
 async(name,params)=>{rpcCalls.push({name,params});return {media_id:params.p_media_id,seen:false,watched:false}},
 msg=>toastMessages.push(msg),()=>42,fn=>fn());
assert.ok(app.api);
const mixed=app.api.mergeMovies([form(4,'2026-10-08T01:00:00Z'),form(7,'2026-10-01T01:00:00Z')]);
assert.equal(mixed.at(-1).tmdb_id,7,'WWE recent movie must remain newest rather than Pokémon');
assert.equal(mixed.at(-1).watched_at,'2026-10-21T21:00:00Z');
const htmlMovie=app.get().history_movies[0];
app.paint();
assert.equal(app.get().history_movies.at(-1).tmdb_id,7,'Home initial paint should receive newest movie');
const htmlEpisode=app.api.mergeMovies([]);
assert.equal(htmlEpisode.at(-1).tmdb_id,7);
assert.equal(doc.documentElement.dataset.ct308MoviesPending,'1','Cold first launch should hide unverified old history');
await windowMock.__ctR305MovieHistory.refresh(true);
assert.equal(doc.documentElement.dataset.ct308MoviesPending,'0','Confirmed server history should end initial loading');
assert.ok(local.get('ct:r308:last-confirmed-movies:user-a')?.includes('2026-10-21'));
const row={
 outerHTML:'<div class="ct111-history-row">Before</div>',
 parentElement:{isConnected:true,children:[],insertBefore(){}},
 remove(){this.removed=true}
};
const undoMovieButton={
 dataset:{ct308Undo:'movie',ct308MediaId:'7',ct308TmdbId:'7',ct308Season:'0',ct308Episode:'0'},
 disabled:false,textContent:'Desmarcar',closest:()=>row
};
await app.api.undo(undoMovieButton);
assert.equal(rpcCalls[0].name,'cinetracker_unmark_history_item_v426');
assert.equal(rpcCalls[0].params.p_media_id,7);
assert.equal(row.removed,true);
assert.equal(dropMovie,1,'Confirmed undo must drop newer movie from v542 fresh cache');
assert.ok(!app.get().history_movies.some(x=>x.media_id===7),'Undo must disappear from Home cache');
assert.equal(app.api.blockedMovie(form(7,'2026-10-21T21:00:00Z')),true,'Old painted record cannot reappear');
assert.ok(!app.api.mergeMovies(latest).some(x=>x.media_id===7),'Old fetched row cannot reappear');
const eRow={...row,removed:false};
const epButton={dataset:{ct308Undo:'episode',ct308MediaId:'18',ct308TmdbId:'98',ct308Season:'2',ct308Episode:'3'},disabled:false,textContent:'Desmarcar',closest:()=>eRow};
await app.api.undo(epButton);
assert.equal(rpcCalls[1].name,'cinetracker_unmark_episode_v1');
assert.equal(rpcCalls[1].params.p_season_number,2);
assert.equal(rpcCalls[1].params.p_episode_number,3);
assert.equal(dropEpisode,1);
assert.equal(app.get().history_episodes.length,0);
assert.ok(app.api.blockedEpisode({media_id:18,tmdb_id:98,season_number:2,episode_number:3}));
app.setTab('series');
const markButton={dataset:{homeMarkEpisode:'18'},disabled:false,textContent:'✓',setAttribute(){},removeAttribute(){},classList:{add(){},remove(){}}};
const evt={target:{closest:()=>markButton},preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
app.api.tap(evt);
app.api.tap(evt);
assert.ok(evt.prevented&&evt.stopped);
assert.equal(markButton.disabled,true,'Immediate visual busy state and one-tap acceptance required');
await Promise.resolve();await Promise.resolve();
assert.equal(marked,1,'Repeated rapid tap must not mark twice');
markedResolve();
await Promise.resolve();await Promise.resolve();await new Promise(setImmediate);
assert.equal(app.api.stats().busy,0,'Click guard must release after previous mark completes');
app.changeAccount('user-b');
assert.equal(app.api.stats().account,'user-b');
assert.equal(app.api.stats().movieRows,0,'Movie history snapshot must not leak across accounts');

assert.ok(js.includes("window.addEventListener('click',tap,true);"),
 'Home episode handler must capture on window before document handlers');
assert.ok(!js.includes("document.addEventListener('click',tap,true);"),
 'Duplicate legacy document-capture mark owners would fire before the new owner');
const tapStart=js.indexOf('function tap(event){',js.indexOf('/* CineTracker official Android 1.0/r308'));
const tapEnd=js.indexOf("document.addEventListener('click',event=>{",tapStart);
assert.ok(tapStart>0&&tapEnd>tapStart);
const tapBody=js.slice(tapStart,tapEnd);
assert.ok(tapBody.includes('event.stopImmediatePropagation()'));
assert.ok(tapBody.includes('actionBusy.add(id)'));
assert.ok(tapBody.includes('markNextEpisode158(id)'));
let nativeMarks=0;
let resolveMark;
const clicks=[];
const buttonA={
 dataset:{homeMarkEpisode:'55'},disabled:false,textContent:'✓',
 setAttribute(){},removeAttribute(){},
 classList:{add(){},remove(){}}
};
const first=new Function('window','document','route','session','homeActiveTab158','markNextEpisode158','toast','actionBusy','Promise',
 'const number=v=>Number(v)>0?Number(v):0;const home=()=>route()==="home";let tapCount=0;'+
 tapBody+"window.addEventListener('click',tap,true);return ()=>tapCount;"
);
const windowDispatch={addEventListener:(type,callback,capture)=>{if(type==='click')clicks.push({callback,capture})}};
const documentDispatch={querySelector:()=>buttonA};
const lock=new Set();
first(windowDispatch,documentDispatch,()=> 'home',{access_token:'mock'},'series',
 ()=>{nativeMarks++;return new Promise(resolve=>{resolveMark=resolve})},()=>{},lock,Promise);
assert.equal(clicks.length,1);
assert.equal(clicks[0].capture,true);
const eventA={
 target:{closest:sel=>sel==='[data-home-mark-episode]'?buttonA:null},
 prevented:false,stopped:false,
 preventDefault(){this.prevented=true},
 stopImmediatePropagation(){this.stopped=true}
};
clicks[0].callback(eventA);
clicks[0].callback(eventA);
assert.ok(eventA.prevented&&eventA.stopped);
await Promise.resolve();await Promise.resolve();
assert.equal(nativeMarks,1,'Two quick taps must invoke only one canonical episode mutation');
resolveMark();await Promise.resolve();await Promise.resolve();await new Promise(setImmediate);
assert.equal(lock.size,0,'Episode processing lock must be released once response settles');

console.log('CINETRACKER_1_0_R309_TEST_OK: unchanged public 1.0; UFC uniform row, 52px one-tap with click guard, server-confirmed movie and episode undo, no stale resurrection, newest movie painted first, account isolation and all r307 recommendation rules preserved.');
