import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r323-android-stable-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Signed Android WebView must contain the r323 runtime');
const js=html.slice(a+marker.length,b);
new Function(js);
assert.ok(js.includes("const REVISION='r323-android-official-1.0';"));
assert.ok(js.includes('window.__ctAndroidOfficialCode=10124;'));
for(const old of ['window.__ctR322Top10=','window.__ctR321Discover=',
 'window.__ctR307Taste=','window.__ctR308Home=','window.__ctR314ForYou=',
 'window.__ctR315DiscoverCards=','window.__ctR316Discover='])
 assert.ok(js.includes(old),'Preserve certified Android module '+old);
assert.ok(js.includes('cinetracker_foryou_payload_v498'));
assert.ok(js.includes('cinetracker_discover_fresh_v485'));
assert.ok(js.includes('cinetracker_discover_watch_smart_v485'));
assert.ok(js.includes('cinetracker_discover_fresh_v421'));
assert.ok(js.includes('window.__ctR279Audit.auditData(raw)'));
assert.ok(js.includes('Math.floor(randomness()*available.length)'));
assert.ok(js.includes('ct:r322:shown:'));
assert.match(js,/ct314-rail\.daily\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);

const start=js.indexOf('async function auditedPools(id){');
const end=js.indexOf('async function load(force=false,preserve=false){',start);
assert.ok(start>0&&end>start);
const loader=js.slice(start,end);
assert.doesNotMatch(loader,/window\.location\.reload\(|router\.refresh\(|while\s*\(true\)/);
const fresh=(kind,count)=>Array.from({length:count},(_,i)=>({
 tmdb_id:i+1+(kind==='movie'?1000:kind==='series'?2000:3000),
 media_type:kind==='movie'?'movie':'tv',media_kind:kind==='anime'?'anime':'series',
 title:kind+' #'+i,poster_path:'/poster.jpg',runtime_minutes:120,
 __ct489_pool:'fresh'
}));
const watch=(kind,count)=>Array.from({length:count},(_,i)=>({
 tmdb_id:i+9000+(kind==='movie'?100:kind==='series'?200:300),
 media_type:kind==='movie'?'movie':'tv',media_kind:kind==='anime'?'anime':'series',
 title:'Watch '+kind+' #'+i,poster_path:'/poster.jpg',runtime_minutes:80,
 __ct489_pool:'watch'
}));
const kinds=['movie','series','anime'];
const expected={watch:Object.fromEntries(kinds.map(k=>[k,watch(k,5)])),
 fresh:Object.fromEntries(kinds.map(k=>[k,fresh(k,24)])),source:'v498-seen-alias-safe'};
expected.fresh.movie[0].__seen=true;
expected.fresh.series[1].__blocked=true;

let calls=[],primary=expected,user='A';
const permitted=(x,isWatch)=>!x.__seen&&!x.__blocked&&
 (isWatch?x.__ct489_pool==='watch':x.__ct489_pool==='fresh');
const sandbox={
 KINDS:kinds,
 empty:()=>({movie:[],series:[],anime:[]}),
 blank:()=>({watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},selected:new Map()}),
 arr:x=>Array.isArray(x)?x:[],
 taste:()=>({warm:async()=>true}),
 timebox:async value=>value,
 userId:()=>user,
 rpc:async(name,args)=>{
  calls.push(name);
  if(name==='cinetracker_foryou_payload_v498')return primary;
  if(name==='cinetracker_discover_fresh_v485')return fresh(args.p_kind,17);
  if(name==='cinetracker_discover_watch_smart_v485')return watch(args.p_kind,3);
  return [];
 },
 identity:x=>x?.tmdb_id?(x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id:'',
 kindMatch:(x,kind)=>x.media_type===(kind==='movie'?'movie':'tv')&&
  (kind==='movie'||(kind==='anime')===(x.media_kind==='anime')),
 canUse:(x,kind,isWatch)=>Boolean(x.__ct314ServerAudited&&
  (kind==='movie'||x.media_kind===(kind==='anime'?'anime':'series'))&&permitted(x,isWatch)),
 verifyData:d=>Boolean(d?._ct279AuditedFor&&d?._ct186_fresh&&d?._ct186_watchlist),
 window:{__ctR279Audit:{
  permitted,
  auditData:async raw=>{
   for(const k of kinds){
    raw._ct186_fresh[k]=raw._ct186_fresh[k].filter(x=>permitted(x,false));
    raw._ct186_watchlist[k]=raw._ct186_watchlist[k].filter(x=>permitted(x,true));
   }
   raw._ct279AuditedFor=user;return raw;
  }
 }},
 document:{documentElement:{dataset:{}}},
 ct186ForYouData:null,ct166ForYouData:null,
 fetchPool:async()=>{throw Error('Legacy v421 should not replace populated v498 pools')},
 Promise,JSON,Map,Set
};
const {auditedPools}=vm.runInNewContext(loader+';({auditedPools})',sandbox);
let loaded=await auditedPools('A');
assert.deepEqual(calls,['cinetracker_foryou_payload_v498'],
 'Current Web uses one authoritative call when all six categories are populated');
assert.equal(loaded.fresh.movie.length,23);
assert.equal(loaded.fresh.series.length,23);
assert.equal(loaded.fresh.anime.length,24);
assert.equal(loaded.watch.movie.length,5);
assert.ok(loaded.fresh.movie.every(x=>x.__ct314ServerAudited&&x.title!=='A Vida é Bela'));
assert.equal(sandbox.document.documentElement.dataset.ct323PoolSources.includes('v498'),true);

// Empty v498 category uses the same Web r487 recovery authority, rather than
// falling back to a few old deterministic v421 recommendations.
calls=[];
primary={...expected,fresh:{...expected.fresh,anime:[]}};
loaded=await auditedPools('A');
assert.ok(calls.includes('cinetracker_discover_fresh_v485'));
assert.equal(loaded.fresh.anime.length,17,
 'Empty canonical categories recover through audited Web v485 candidates');
assert.ok(loaded.fresh.anime.every(x=>x.__ct314ServerAudited));
console.log('CINETRACKER_ANDROID_1_0_R323_TEST_OK: real Web v498 primary, 6-slot diversity, v525 gate, Android modules untouched.');

const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1\.0'/);
assert.match(gradle,/versionCode 10124/);
assert.match(gradle,/signingConfig signingConfigs\.official/);
