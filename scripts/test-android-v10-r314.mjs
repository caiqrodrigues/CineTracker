import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r314-android-stable-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Android 1.0/r314 HTML runtime is missing');
const js=html.slice(a+marker.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
for(const keep of [
 "const REVISION='r314-android-official-1.0'",
 'window.__ctAndroidOfficialCode=10115;',
 'window.__ctR313Session=',
 'restoreSession=async function restoreSession313',
 'window.__ctR312Transport=',
 'window.__ctR311Special=',
 'window.__ctR311Discover=',
 'window.__ctR311Movies=',
 'window.__ctR310Profile',
 'window.__ctR308Home',
 'window.__ctR307Taste',
 'window.__ctR305MovieHistory',
 "window.addEventListener('click',sportsClick304,true);",
 'cinetracker_unmark_episode_v1',
 'window.__ctR314ForYou='
])assert.ok(js.includes(keep),'Missing r313 stable component: '+keep);
const start=js.indexOf('/* CineTracker Android official 1.0/r314.');
const end=js.indexOf('\nboot();',start);
assert.ok(start>0&&end>start,'Android r314 must be the last addition before boot');
const module=js.slice(start,end);
new Function(module);
for(const required of [
 'cinetracker_discover_watch_unseen_v421',
 'cinetracker_discover_fresh_v421',
 'window.__ctR279Audit.auditData(raw)',
 'window.__ctR279Audit?.permitted?.(x,watch)',
 'window.__ctR265Test?.allowed?.(x)',
 "if(discoverState?.tab!=='foryou')return oldRender.apply(this,arguments);",
 "if(active())return true;",
 'window.__ctR307Taste',
 'window.__ctR314ForYou=',
 "window.addEventListener('click',event=>{",
 "window.__ctR293AddWatchlist(mediaType,id)",
 "markSeen(mediaType,id)",
 "data-ct314-action",
 "data-ct314-slot",
 "grid-template-columns:repeat(3,minmax(0,1fr))"
])assert.ok(module.includes(required),'Web parity marker missing: '+required);
for(const prohibited of [
 'window.location.reload(',
 'router.refresh(',
 'window.history.go(',
 'localStorage.clear(',
 'renderHome=',
 'renderSports=',
 'renderProfile=',
 'paintHome=',
 'paintSports=',
 'paintProfile='
])assert.ok(!module.includes(prohibited),'r314 exceeds scope: '+prohibited);
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'"));
assert.ok(gradle.includes('versionCode 10115'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));

// Execute the actual inserted module in isolation, not a reimplemented mock.
const watch=[],fresh=[],requests=[],impressions=[],feedback=[],marked=[],saved=[],opened=[],listeners={};
let currentUser='account-A',token='access-A',tab='foryou',routeNow='discover';
let renderCount=0,nonForyouRenders=0,nonForyouPaints=0,audits=0;
const root={innerHTML:'',dataset:{},querySelector(){return null},querySelectorAll(sel){
 return sel==='[data-ct314-slot]'?Array.from({length:(this.innerHTML.match(/data-ct314-slot="/g)||[]).length},()=>({})):[]},
 contains(){return true}};
const document={
 hidden:false,documentElement:{dataset:{}},head:{appendChild(x){if(x.id==='ct314-web-parity-foryou')this.style=x}},
 createElement(tag){return{tagName:tag.toUpperCase(),textContent:'',id:'',innerHTML:'',content:{firstElementChild:{}}}},
 querySelector(sel){return sel==='[data-discover-content]'?root:null},
 addEventListener(name,fn){(listeners[name]??=[]).push(fn)}
};
const window={
 addEventListener(name,fn){(listeners['window:'+name]??=[]).push(fn)},
 __ctR265Test:{allowed:row=>row?.title!=='BANNED'},
 __ctR279Audit:{permitted:(row,watchFlag)=>!row.blocked&&!!row.__ct421_eligible,
  auditData:async data=>{
   audits++;
   data._ct279AuditedFor=currentUser;
   data._ct280AuditPartial=false;
   for(const k of ['movie','series','anime']){
    data._ct186_fresh[k]=data._ct186_fresh[k].filter(x=>!x.blocked);
    data._ct186_watchlist[k]=data._ct186_watchlist[k].filter(x=>!x.blocked);
   }
   return data;
  }},
 __ctR307Taste:{
  choose:(slot,candidates)=>{
   const notShown=candidates.find(x=>!impressions.some(i=>i.slot===slot&&i.id===x.tmdb_id));
   return notShown||candidates.at(-1);
  },
  shown:(slot,item)=>impressions.push({slot,id:item.tmdb_id}),
  feedback:(slot,item,action)=>feedback.push({slot,id:item?.tmdb_id,action}),
  warm:async()=>true,
  refill:async()=>false
 },
 __ctR293AddWatchlist:async(type,id)=>saved.push({type,id})
};
const row=(kind,id,blocked=false)=>({
 id,tmdb_id:id,media_type:kind==='movie'?'movie':'tv',media_kind:kind,
 title:'Title '+id,poster_path:'/p/'+id+'.jpg',vote_average:8.5,
 __ct421_eligible:true,blocked
});
const byKind={movie:100,series:200,anime:300};
for(const kind of ['movie','series','anime']){
 watch.push([kind,Array.from({length:8},(_,i)=>row(kind,byKind[kind]+i+500))]);
 fresh.push([kind,Array.from({length:9},(_,i)=>row(kind,byKind[kind]+i,i===8))]);
}
const server=async(name,args)=>{
 requests.push({name,args,who:currentUser});
 if(name==='cinetracker_discover_watch_unseen_v421')
  return watch.find(([k])=>k===args.p_kind)[1];
 if(name==='cinetracker_discover_fresh_v421')
  return fresh.find(([k])=>k===args.p_kind)[1];
 throw Error('Unexpected RPC '+name);
};
const context={
 window,document,Set,Map,Promise,Math,Date,Uint32Array,JSON,String,Number,
 setTimeout,clearTimeout,console,queueMicrotask,
};
const bootstrap=[
 "let session={access_token:'access-A',user:{id:'account-A'}},user={id:'account-A'};",
 "let discoverState={tab:'foryou',type:'all'},navSeq=21;",
 "const route=()=>globalThis.routeNow;",
 "const rpc=(...args)=>globalThis.server(...args);",
 "let ct186ContextValue={dash:[{media_id:1}],historyMovieIds:new Set(),historyTvIds:new Set(),watchMovieIds:new Set(),watchTvIds:new Set()};",
 "async function ct186Context(){return ct186ContextValue}",
 "const ct186LocalBlocked=new Set();",
 "const mediaPoster=x=>x.poster_path;",
 "const img=p=>'https://test.invalid'+p;",
 "const markSeen=async(type,id)=>globalThis.marked.push({type,id});",
 "const toast=x=>globalThis.toasts.push(String(x));",
 "const shell=(...parts)=>parts.at(-1);",
 "let renderDiscover=async()=>{globalThis.nonForyouRenders++};",
 "let paintDiscover=()=>{globalThis.nonForyouPaints++};",
 "const setApp=()=>{globalThis.renderCount++;document.querySelector('[data-discover-content]').innerHTML=''};"
].join('\n')+'\n';
Object.assign(context,{
 routeNow:'discover',server,marked,toasts:[],renderCount:0,nonForyouRenders:0,nonForyouPaints:0
});
vm.runInNewContext(bootstrap+module+[
"globalThis.test={",
"render:async()=>{await renderDiscover(navSeq);await window.__ctR314ForYou.load(false)},",
"paint:()=>paintDiscover({}),",
"swap:x=>window.__ctR314ForYou.swap(x),",
"action:(a,s)=>window.__ctR314ForYou.action(a,s),",
"choose:x=>window.__ctR314ForYou.choose(x),",
"stats:()=>window.__ctR314ForYou.stats(),",
"setTab:x=>discoverState.tab=x,",
"enter:async()=>{navSeq++;await renderDiscover(navSeq);await window.__ctR314ForYou.load(false)}",
"};"
].join('\n'),context,{filename:'r314-web-foryou-regression'});
await context.test.render();
assert.equal(audits,1,'Every seven-slot pool must pass the authenticated v525 audit');
assert.equal(requests.length,6,'Must use six Web v421 pool RPCs');
assert.ok(requests.every(x=>x.name.endsWith('_v421')));
assert.deepEqual(JSON.parse(JSON.stringify(requests.filter(x=>x.name==='cinetracker_discover_fresh_v421').map(x=>x.args))),
 [{p_kind:'movie',p_limit:48},{p_kind:'series',p_limit:48},{p_kind:'anime',p_limit:48}]);
assert.equal(context.test.stats().slots,7,'Seven Web slots required');
assert.equal((root.innerHTML.match(/data-ct314-action="swap"/g)||[]).length,7);
assert.equal((root.innerHTML.match(/data-ct314-action="seen"/g)||[]).length,7);
assert.equal((root.innerHTML.match(/data-ct314-action="watchlist"/g)||[]).length,4);
assert.equal((root.innerHTML.match(/data-ct314-slot="watch:/g)||[]).length,3);
assert.equal((root.innerHTML.match(/data-ct314-slot="fresh:/g)||[]).length,3);
assert.ok(!root.innerHTML.includes('BANNED'));
assert.ok(!root.innerHTML.includes('Title 108'),'v525 blocked candidate must not render');
assert.equal(context.renderCount,1,'Only the ForYou route shell is rendered');
assert.ok(document.head.style.textContent.includes('aspect-ratio:2/3'),'2:3 posters preserved');
const impressionsBefore=impressions.filter(x=>x.slot==='watch:anime').map(x=>x.id);
assert.equal(impressionsBefore.length,1);
assert.equal(await context.test.swap('watch:anime'),true);
assert.equal(impressions.filter(x=>x.slot==='watch:anime').length,2);
assert.notEqual(impressions.at(-1).id,impressionsBefore[0],'Swap cannot return immediately to original item');
assert.equal(context.test.stats().swaps,1);
assert.equal(feedback.at(-1).action,'swap');
await context.test.action('seen','fresh:series');
assert.equal(marked.length,1,'Existing seen mutation must be used');
assert.equal(marked[0].type,'tv');
await context.test.action('watchlist','fresh:movie');
assert.equal(saved.length,1,'Existing authenticated Watchlist mutation must be used');
assert.equal(saved[0].type,'movie');
assert.ok(context.toasts.some(x=>x.includes('Watchlist')));
context.test.setTab('trending');await context.test.render();context.test.paint();
assert.equal(context.nonForyouRenders,1,'Other Discover tab renderer unchanged');
assert.equal(context.nonForyouPaints,1,'Other Discover tab painter unchanged');
assert.equal(context.renderCount,1,'Other tab must not trigger custom seven-slot mount');
context.test.setTab('foryou');await context.test.enter();
assert.equal(context.test.stats().slots,7);
assert.ok(impressions.filter(x=>x.slot==='watch:anime').length>=3,
 'On reentry, recommendation ownership must change');
assert.ok(context.test.stats().loaded>=2);
assert.equal(requests.length,12,'A fresh visit must revalidate the six web source RPCs');
console.log('CINETRACKER_1_0_R314_TEST_OK: six authenticated Web v421 pools; verified v525 7 slots; 7 swap, 7 seen and 4 Watchlist actions; diversity across visits; other tabs untouched.');
