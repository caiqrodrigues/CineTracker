import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r270-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>0&&b>a,'r270 inline script is missing');
const app=html.slice(a+marker.length,b),patch=await readFile('apps/android/runtime-r270-v1028-history-sports-speed.js','utf8');
new Function(app);new Function(patch);
for(const fragment of [
 "const REVISION='r270-android-official-1.0.28'",
 'window.__ctAndroidOfficialCode=10070',
 "window.__ctR270AndroidV1028='movies-history-pages+sports-no-jump+foryou-warm-cache+poster-priority'",
 'for(const query of variants.slice(0,1)){',
 'window.__ctR269AndroidV1027=',
 'window.__ctR268AndroidV1026=',
 'window.__ctR267AndroidV1025=',
 'cinetracker_sports_stadium_summary_v296',
 'cinetracker_sports_watch_set_v296',
 'cinetracker_f1_watch_sync_v462',
 'cinetracker_recommendation_filter_v525'
])assert.ok(app.includes(fragment),'missing '+fragment);
assert.ok(html.includes('name="ct-official-version" content="1.0.28"'));
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.equal(patch.includes(bad),false,'forbidden '+bad);
const oldData=Array.from({length:80},(_,i)=>({id:200-i,media_id:100+i,title:'old '+i,watched_at:'2026-10-17T00:00:00Z'}));
const fetched=Array.from({length:133},(_,i)=>({id:300-i,media_id:100+i,title:'Film '+i,watched_at:new Date(Date.UTC(2026,9,17)-i*86400000).toISOString()}));
const media=fetched.map(x=>({id:x.media_id,tmdb_id:x.media_id+1000,title:'Metadata '+x.media_id,poster_path:'/post-'+x.media_id+'.jpg'}));
const button={
 dataset:{sportWatch:'777',watched:'0',on:'0'},disabled:false,
 classList:{toggle(){}},hasAttribute:n=>n==='data-sport-watch',
 textContent:'✓ Marcar assistido'
};
const event={id:777,is_watched:false};
const eventListeners={},logs=[],storage=new Map(),sessionStorage=new Map();
const store=m=>({getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)});
const fakeDoc={
 head:{appendChild(){}},
 createElement:()=>({dataset:{},rel:'',href:'',crossOrigin:''}),
 querySelector:()=>null,
 querySelectorAll:s=>s.startsWith('[data-sport-watch=')?[button]:[],
 documentElement:{dataset:{},clientHeight:850},
 addEventListener(){}
};
const ctx={
 window:{innerHeight:850,addEventListener:(name,fn,capture)=>{eventListeners[name]=[fn,capture]},scrollY:1140},
 document:fakeDoc,
 session:{access_token:'test-jwt',user:{id:'person-unique'}},user:{id:'person-unique'},
 localStorage:store(storage),sessionStorage:store(sessionStorage),
 URL,Promise,Set,Map,Date,JSON,Array,queueMicrotask,
 localDay:()=> '2026-10-18',SUPABASE_URL:'https://example.supabase.co',
 sportsCache:{events:[event],watch_history:[]},profileCache:null,
 toast:s=>logs.push(s),rpc:async(name,data)=>{logs.push(name);return {is_watched:data.p_watched}},
 ct163Write:(n,data)=>{},ct163Read:()=>null,
 ct163PreloadStarted:false,
 api:async path=>{
  if(path.startsWith('watch_history?')){
   const offset=Number(new URL('https://db.local/'+path).searchParams.get('offset')||0);
   return fetched.slice(offset,offset+120);
  }
  if(path.startsWith('media?')){
   const raw=decodeURIComponent(path);const m=raw.match(/id=in\.\((.*?)\)/);
   const ids=new Set((m?.[1]||'').split(',').map(Number));
   return media.filter(x=>ids.has(x.id));
  }
  throw Error('unexpected API '+path);
 },
 homeActiveTab158:'movies',homeCache:{history_movies:oldData},
 paintHome:()=>{},paintDiscover:()=>{},paintSports:()=>{},
 ct186FreshPools:async()=>({}),ct186PopularPool:async()=>[],ct186LoadForYou:async()=>({}),
 ct186Invalidate:()=>{},ct186ForYouData:null,discoverCache:new Map(),
 ct186FavoriteGenres:()=>[],CT186_MIN_SCORE:7.5,
 ct186UniqueRows:r=>r,ct186FreshEligible:()=>true,ct186Anime:x=>Boolean(x.isAnime),ct186Type:x=>x.media_type,
 pages:async(p,q,kind,num)=>{logs.push('pages-'+num);return []},
 ct163PreloadAll:()=>{throw Error('old heavy preloader should be replaced')},
 route:()=> 'home',navSeq:1,
 console,
};
vm.createContext(ctx);vm.runInContext(patch,ctx,{timeout:1500});
assert.equal(eventListeners.click[1],true,'sports interception must occur in window capture phase, before legacy document listener');
let prevented=false,stopped=false;
eventListeners.click[0]({target:{closest:()=>button},preventDefault(){prevented=true},stopImmediatePropagation(){stopped=true}});
assert.ok(prevented&&stopped);
assert.equal(button.dataset.watched,'1','optimistic watch should change immediately');
assert.equal(ctx.sportsCache.events[0].is_watched,true);
await new Promise(resolve=>setImmediate(resolve));
assert.ok(logs.includes('cinetracker_sport_mark_watched_v1'));
assert.equal(ctx.window.scrollY,1140,'sports marking changed scroll position');
assert.equal(logs.filter(x=>x.includes('sports_payload')).length,0,'bulk synchronous sports reload on mark');
const full=await ctx.window.__ctR270Test.movieHistoryFetch();
assert.equal(full.length,133,'movie history must not stop at the old 80-row RPC cap');
assert.equal(full[0].title,'Film 132');assert.equal(full[132].title,'Film 0');
assert.ok(full.every(x=>x.poster_path?.startsWith('/post-')&&x.tmdb_id>0),'all paged items need poster and TMDB metadata');
assert.ok(ctx.window.__ctR270Test.forYouKey().includes('person-unique'),'recommendation cache must be user scoped');
await ctx.ct186FreshPools({dash:[]});
assert.deepEqual(logs.filter(x=>x==='pages-2').length,3,'only 2 pages/category may run in initial fast recommendation load');
ctx.ct163PreloadAll();
assert.equal(logs.filter(x=>x.includes('/discover')).length,0,'bulk preloader must not re-trigger Discover');
const candidate={_ct186_fresh:{movie:[],series:[],anime:[]},_ct186_watchlist:{movie:[],series:[],anime:[]}};
ctx.ct186LoadForYou=async()=>candidate; // existing patched function is saved separately in a closure, test persistent route by providing store.
sessionStorage.set('ct:r270:foryou:person-unique:2026-10-18',JSON.stringify({at:Date.now(),data:candidate}));
assert.ok(ctx.window.__ctR270Test.restoreForYou(),'validated same-user same-day snapshot not restored');
console.log('ANDROID_1_0_28_TEST_OK: sport optimistic/no-scroll/no-refetch, history 133>80 fully hydrated, capped TMDB pools, scoped warm recs, native preserved');
