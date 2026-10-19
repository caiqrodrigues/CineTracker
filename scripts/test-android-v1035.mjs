import assert from'node:assert/strict';
import vm from'node:vm';
import{readFile}from'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r277-android-js">',a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Android r277 startup must be embedded');
const app=html.slice(a+marker.length,b),patch=await readFile('apps/android/runtime-r277-v1035-foryou-single-owner.js','utf8');
new Function(app);new Function(patch);
for(const m of [
 "const REVISION='r277-android-official-1.0.35'",
 'window.__ctAndroidOfficialCode=10077',
 "window.__ctR277AndroidV1035='single-owner-seven-slots+real-media-params+eligible-swap'",
 'window.__ctR276AndroidV1034',
 'window.__ctR275AndroidV1033',
 'cinetracker_home_movie_history_v323',
 'cinetracker_sport_mark_watched_v1',
 'cinetracker_f1_watch_sync_v462',
 'cinetracker_recommendation_filter_v525',
 'cinetracker_sports_stadium_summary_v296'
])assert.ok(app.includes(m),'Preserved Android release/runtime '+m);
assert.ok(html.includes('name="ct-official-version" content="1.0.35"'));
assert.ok(app.includes("if(!isForYou237()||window.__ctR277AndroidV1035)return;"),'old swap must not steal pointerup/click');
assert.ok(app.includes("if(window.__ctR277AndroidV1035||route()!=='discover'"),'old dressing must not append duplicate buttons');
assert.ok(app.includes("const dailyHtml='<div class=\"foryou-grid ct166-daily-grid\">'"),'seven slots including empty daily');
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver','paintHome=','renderSports=','#ct-f1-v111','[data-home-viewport]']){
 assert.ok(!patch.includes(forbidden),'Forbidden outside-scope mutation '+forbidden);
}
const windowHandlers={};
const documentHandlers={};
const store=new Map(),observed=[];
const data={
 _ct186_fresh:{
  movie:[{id:101,title:'Elegível 101',media_type:'movie',poster_path:'/101.jpg',vote_average:8.4,release_date:'2025-01-01'},
         {id:102,title:'Elegível 102',media_type:'movie',poster_path:'/102.jpg',vote_average:8.5,release_date:'2025-01-01'},
         {id:103,title:'AEW Revolution 2026',media_type:'movie',poster_path:'/103.jpg',vote_average:9,release_date:'2026-01-01'},
         {id:104,title:'Filme Curto',runtime:18,media_type:'movie',poster_path:'/104.jpg',vote_average:9,release_date:'2026-01-01'},
         {id:105,title:'Filme Assistido',media_type:'movie',poster_path:'/105.jpg',vote_average:9,release_date:'2026-01-01',is_seen:true},
         {id:106,title:'Filme da Watchlist',media_type:'movie',poster_path:'/106.jpg',vote_average:9,release_date:'2026-01-01',is_watchlist:true}],
  series:[{id:201,title:'Série nova',media_type:'tv',poster_path:'/s.jpg',vote_average:8,first_air_date:'2025-01-01'}],
  anime:[{id:301,title:'Anime novo',media_type:'tv',anime:true,poster_path:'/a.jpg',vote_average:8,first_air_date:'2025-01-01'}]
 },
 _ct186_watchlist:{
  movie:[{id:401,title:'Filme da Watchlist',media_type:'movie',poster_path:'/w.jpg',vote_average:9,release_date:'2025-01-01',is_watchlist:true}],
  series:[{id:402,title:'Série da Watchlist',media_type:'tv',poster_path:'/w.jpg',vote_average:9,first_air_date:'2025-01-01',is_watchlist:true}],
  anime:[{id:403,title:'Anime Watchlist',media_type:'tv',anime:true,poster_path:'/w.jpg',vote_average:9,first_air_date:'2025-01-01',is_watchlist:true}]
 }
};
let watchCalls=[],seenCalls=[],renderCount=0;
const blocked=new Set(),slotRefs={'daily:movie':'movie:102','fresh:movie':'movie:101'};
const fakeSlot=key=>({
 dataset:{ct241SlotKey:key},
 querySelector(selector){
  if(selector==='button[data-media]')return{dataset:{media:slotRefs[key]||''}};
  if(selector==='.discover-card')return{remove(){},querySelector(){return null},appendChild(){}};
  return null;
 },
 querySelectorAll(){return []},appendChild(){},replaceWith(){},
});
const root={querySelector(selector){
 const m=selector.match(/^\[data-ct241-slot-key="(.*)"\]$/);return m?fakeSlot(m[1]):null;
}};
const doc={head:{appendChild(x){doc.css=x.textContent}},
 createElement(){return{dataset:{},innerHTML:'',appendChild(){},querySelector(){return null},setAttribute(){},remove(){}}},
 querySelector(selector){if(selector==='[data-discover-content]')return root;const m=selector.match(/^\[data-ct241-slot-key="(.*)"\]$/);return m?fakeSlot(m[1]):null},
 addEventListener(type,cb){documentHandlers[type]=cb}};
const ctx={watchlistIds:new Set([401,402,403,106]),watchedIds:new Set([105])};
const fake={
 window:{__ctR265Test:{allowed:x=>!!x?.poster_path&&!/aew|wrestling|stand-up|ufc/i.test(x.title||'')&&!(x.runtime>0&&x.runtime<40)},
  addEventListener(name,cb){(windowHandlers[name]??=[]).push(cb)}},
 document:doc,session:{user:{id:'u1'}},user:{id:'u1'},console,Map,Set,Promise,Number,String,Object,
 route:()=> 'discover',discoverState:{tab:'foryou'},ct186ForYouData:data,ct166ForYouData:data,
 ct186Id:x=>x.id,ct186Type:x=>x.media_type,ct186Anime:x=>!!x.anime,ct186Quality:x=>x.vote_average>=7.5&&!!x.poster_path,
 ct186FreshEligible:(x,c)=>!x.is_seen&&!x.is_watchlist&&!c.watchedIds.has(x.id)&&!c.watchlistIds.has(x.id)&&!blocked.has(x.media_type+':'+x.id),
 ct186WatchEligible:(x,c)=>c.watchlistIds.has(x.id)&&!c.watchedIds.has(x.id)&&!blocked.has(x.media_type+':'+x.id),
 ct186ContextValue:ctx,ct186ContextAt:0,ct186Context:async()=>ctx,
 ct186UniqueRows:rows=>[...new Map((rows||[]).map(x=>[x.media_type+':'+x.id,x])).values()],
 ct186Select:()=>({daily:data._ct186_fresh.movie[0],wm:data._ct186_watchlist.movie[0],ws:data._ct186_watchlist.series[0],wa:data._ct186_watchlist.anime[0],fm:data._ct186_fresh.movie[1],fs:data._ct186_fresh.series[0],fa:data._ct186_fresh.anime[0]}),
 ct186Slot:()=>'<div></div>',paintDiscover:()=>{renderCount++},
 ct186LocalBlocked:blocked,addWatchlist:async(t,id)=>{watchCalls.push([t,id])},markSeen:async(t,id)=>{seenCalls.push([t,id])},
 requestAnimationFrame:fn=>{observed.push(fn);return observed.length},toast:()=>{},setTimeout,clearTimeout};
vm.createContext(fake);vm.runInContext(patch,fake,{timeout:1000});
assert.equal(fake.window.__ctR277StartupError,undefined,'r277 startup crash');
assert.ok(doc.css.includes('content:none!important'),'CSS must disable legacy pseudo plus');
assert.ok(doc.css.includes('.ct277-control'),'buttons must use one unambiguous action owner');
assert.equal(fake.window.__ctR277Test.poolFor(data,'fresh:movie',ctx).length,2,'must exclude wrestling, shorts, watched and Watchlist');
assert.equal(fake.window.__ctR277Test.poolFor(data,'watchlist:movie',ctx).length,1,'Watchlist must only include real items');
assert.equal(fake.window.__ctR277Test.poolFor(data,'fresh:series',ctx).length,1);
assert.equal(fake.window.__ctR277Test.poolFor(data,'fresh:anime',ctx).length,1);
assert.ok(windowHandlers.click?.length===1,'exactly one r277 handler');
const click=windowHandlers.click[0];
function dispatch(action,key,ref){
 const btn={dataset:{ct277Action:action,ct277Slot:key,ct277Ref:ref},disabled:false};
 const event={target:{closest:selector=>selector==='[data-ct277-action]'?btn:null},preventDefault(){},stopImmediatePropagation(){}};
 click(event);
}
dispatch('watchlist','fresh:movie','movie:101');
await new Promise(resolve=>setImmediate(resolve));
assert.deepEqual(watchCalls,[['movie',101]],'Watchlist must receive real media type and TMDB ID exactly once');
assert.ok(blocked.has('movie:101'),'Watchlist optimistic local exclusion missing');
blocked.delete('movie:101');
dispatch('seen','fresh:movie','movie:101');
await new Promise(resolve=>setImmediate(resolve));
assert.deepEqual(seenCalls,[['movie',101]],'Visto must receive real media type/ID exactly once');
assert.ok(blocked.has('movie:101'));
dispatch('watchlist','watchlist:movie','movie:401');
await new Promise(resolve=>setImmediate(resolve));
assert.equal(watchCalls.length,1,'Watchlist cards must not accept +Watchlist action');
console.log('ANDROID_1_0_35_TEST_OK single action owner, exact tmdb params, real Visto/Watchlist, no double+, no scope leaks, strict 7-category filters');
