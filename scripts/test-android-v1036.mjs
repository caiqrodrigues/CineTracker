import assert from'node:assert/strict';
import vm from'node:vm';
import{readFile}from'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r278-android-js">',a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Android r277 startup must be embedded');
const app=html.slice(a+marker.length,b),patch=await readFile('apps/android/runtime-r278-v1036-foryou-nonrepeating.js','utf8');
new Function(app);new Function(patch);
for(const m of [
 "const REVISION='r278-android-official-1.0.36'",
 'window.__ctAndroidOfficialCode=10078',
 "window.__ctR278AndroidV1036='single-tap-no-repeat+strict-tmdb-detail+bounded-fresh-pool'",
 'window.__ctR276AndroidV1034',
 'window.__ctR275AndroidV1033',
 'cinetracker_home_movie_history_v323',
 'cinetracker_sport_mark_watched_v1',
 'cinetracker_f1_watch_sync_v462',
 'cinetracker_recommendation_filter_v525',
 'cinetracker_sports_stadium_summary_v296'
])assert.ok(app.includes(m),'Preserved Android release/runtime '+m);
assert.ok(html.includes('name="ct-official-version" content="1.0.36"'));
assert.ok(app.includes("if(!isForYou237()||window.__ctR277AndroidV1035)return;"),'old swap must not steal pointerup/click');
assert.ok(app.includes("if(window.__ctR277AndroidV1035||route()!=='discover'"),'old dressing must not append duplicate buttons');
assert.ok(app.includes("const dailyHtml='<div class=\"foryou-grid ct166-daily-grid\">'"),'seven slots including empty daily');
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver','paintHome=','renderSports=','#ct-f1-v111','[data-home-viewport]']){
 assert.ok(!patch.includes(forbidden),'Forbidden outside-scope mutation '+forbidden);
}
const windowHandlers={};
const documentHandlers={};
const store=new Map(),observed=[];
const sessionStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,String(value))};
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
  __ctV113MemoryBlocked:()=>false,
  addEventListener(name,cb){(windowHandlers[name]??=[]).push(cb)}},
 document:doc,session:{user:{id:'u1'}},user:{id:'u1'},console,Map,Set,Promise,Number,String,Object,Date,JSON,sessionStorage,localDay:()=> '2026-10-19',
 route:()=> 'discover',discoverState:{tab:'foryou'},ct186ForYouData:data,ct166ForYouData:data,
 ct186Id:x=>x.id,ct186Type:x=>x.media_type,ct186Anime:x=>!!x.anime,ct186Quality:x=>x.vote_average>=7.5&&!!x.poster_path,
 ct186FreshEligible:(x,c)=>!x.is_seen&&!x.is_watchlist&&!c.watchedIds.has(x.id)&&!c.watchlistIds.has(x.id)&&!blocked.has(x.media_type+':'+x.id),
 ct186WatchEligible:(x,c)=>c.watchlistIds.has(x.id)&&!c.watchedIds.has(x.id)&&!blocked.has(x.media_type+':'+x.id),
 ct186ContextValue:ctx,ct186ContextAt:0,ct186Context:async()=>ctx,
 ct186UniqueRows:rows=>[...new Map((rows||[]).map(x=>[x.media_type+':'+x.id,x])).values()],
 ct186MergeRows:(a,b)=>[...new Map([...(a||[]),...(b||[])].map(x=>[x.media_type+':'+x.id,x])).values()],
 ct186PopularPool:async()=>[],
 rpc:async()=>null,
 safeTmdb:async (path)=>({id:Number(path.split('/').pop()),runtime:96,genres:[{id:12}],homepage:''}),
 ct186SaveDaily268:()=>{},
 ct186Select:()=>({daily:data._ct186_fresh.movie[0],wm:data._ct186_watchlist.movie[0],ws:data._ct186_watchlist.series[0],wa:data._ct186_watchlist.anime[0],fm:data._ct186_fresh.movie[1],fs:data._ct186_fresh.series[0],fa:data._ct186_fresh.anime[0]}),
 ct186Slot:()=>'<div></div>',paintDiscover:()=>{renderCount++},
 ct186LocalBlocked:blocked,addWatchlist:async(t,id)=>{watchCalls.push([t,id])},markSeen:async(t,id)=>{seenCalls.push([t,id])},
 requestAnimationFrame:fn=>{observed.push(fn);return observed.length},toast:()=>{},setTimeout,clearTimeout};
vm.createContext(fake);vm.runInContext(patch,fake,{timeout:1000});
assert.equal(fake.window.__ctR277StartupError,undefined,'r278 startup crash');
assert.ok(fake.window.__ctR278Test,'r278 functional exports must exist');
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

const fixed=fake.window.__ctR278Test;
blocked.delete('movie:101');ctx.watchedIds.delete(101);ctx.watchlistIds.delete(101);
// Daily movie already occupies movie:102; exercise another isolated slot
// so uniqueness against other visible slots remains part of the test.
data._ct186_fresh.series.push({id:202,title:'Outra série elegível',media_type:'tv',poster_path:'/202.jpg',vote_average:8.5,first_air_date:'2025-01-01'});
const firstPool=fixed.candidates('fresh:series','tv:201');
assert.equal(firstPool.length,1,'same slot should start with exactly one alternate');
const next=await fixed.slotChoice('fresh:series','tv:201');
assert.equal(next?.id,202,'first swap should offer the other eligible series');
fixed.takeSeen('fresh:series','tv:201');
fixed.takeSeen('fresh:series','tv:202');
const exhausted=await fixed.slotChoice('fresh:series','tv:202');
assert.equal(exhausted,null,'second swap must not cycle back to a shown series');
assert.ok(fixed.seenIn('fresh:series').has('tv:201'));
assert.ok(fixed.seenIn('fresh:series').has('tv:202'));
const good=(id,title)=>({id,title,media_type:'movie',poster_path:'/test.jpg',vote_average:8.6,release_date:'2025-09-10'});
assert.equal(fixed.contentDetailSafe(good(900,'Filme'),{id:900,runtime:39,genres:[{id:12}]}),false,'shorter than 40min not allowed');
assert.equal(fixed.contentDetailSafe(good(901,'Filme'),{id:901,runtime:100,homepage:'https://youtube.com/watch?v=abc',genres:[{id:12}]}),false,'original YouTube title forbidden');
assert.equal(fixed.contentDetailSafe(good(902,'Filme'),{id:902,runtime:100,genres:[{id:10764}]}),false,'reality forbidden');
assert.equal(fixed.contentDetailSafe(good(903,'Filme'),{id:903,runtime:100,genres:[{id:12}],production_companies:[{name:'YouTube Originals'}]}),false,'YouTube production forbidden');
assert.equal(fixed.contentDetailSafe(good(904,'AEW Revolution 2026'),{id:904,runtime:110,genres:[{id:12}]}),false,'wrestling forbidden');
assert.equal(fixed.contentDetailSafe(good(905,'Filme'),{id:905,runtime:90,genres:[{id:12}]}),true,'eligible 90min movie allowed');
const bad=good(906,'Novo');
data._ct186_fresh.movie.push(bad);
fake.safeTmdb=async()=>({id:906,runtime:20,genres:[{id:12}]});
assert.equal(await fixed.validate('fresh:movie',bad),false,'new swap must be detail-audited before displaying');
assert.ok(!fixed.candidates('fresh:movie','movie:102').some(x=>x.id===906),'audited ineligible item must disappear permanently');
assert.equal(data._ct186_watchlist.movie.length,1,'watchlist candidates cannot be replenished from new-title sources');
console.log('ANDROID_1_0_36_TEST_OK nonrepeating 2-options swap, exhaustion without rewind, TMDB shorts/YouTube/reality/AEW and real click actions');
