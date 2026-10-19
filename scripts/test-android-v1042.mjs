import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r284-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'r284 embedded script missing');
const bundle=html.slice(a+marker.length,b);
const patch=await readFile('apps/android/runtime-r284-v1042-movies-foryou.js','utf8');
new Function(bundle);new Function(patch);
for(const term of [
 "const REVISION='r284-android-official-1.0.42'",
 'window.__ctAndroidOfficialCode=10084',
 'cinetracker_home_movie_history_v542',
 'cinetracker_discover_watch_unseen_v421',
 'cinetracker_discover_fresh_v421',
 'window.__ctR279Audit',
 'window.__ctR283AndroidV1041',
 'window.__ctR284AndroidV1042',
 'watch||ct186Quality(x)',
 '(!watchKind(key)&&!ct186Quality(x))'
])assert.ok(bundle.includes(term),'missing '+term);
assert.ok(html.includes('name="ct-official-version" content="1.0.42"'));
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 assert.equal(patch.includes(bad),false,'forbidden '+bad);
const make=(id,type='movie',anime=false)=>({id,tmdb_id:id,title:'Mídia '+id,poster_path:'/poster.jpg',media_type:type,media_kind:anime?'anime':'series'});
const fresh={movie:[make(1),make(2)],series:[make(3,'tv')],anime:[make(4,'tv',true)]};
const watch={movie:[make(5)],series:[make(6,'tv')],anime:[make(7,'tv',true)]};
let routeName='discover',tabName='foryou',fetcher=async()=>[{media_id:8,tmdb_id:8,media_title:'Legado',watched_at:'2026-09-05T12:00:00Z'}];
let painter=()=>true,painted=0,historyPainted=0,auditCount=0;
const calls=[];
const pick=data=>({
 daily:data._ct186_fresh.movie[0]||null,
 fm:data._ct186_fresh.movie[1]||null,fs:data._ct186_fresh.series[0]||null,fa:data._ct186_fresh.anime[0]||null,
 wm:data._ct186_watchlist.movie[0]||null,ws:data._ct186_watchlist.series[0]||null,wa:data._ct186_watchlist.anime[0]||null
});
const bridge={getFetcher:()=>fetcher,setFetcher:f=>{fetcher=f},getPainter:()=>painter,setPainter:f=>{painter=f}};
const context={
 window:{__ctR271Bridge:bridge,__ctR283History:{combine:parts=>{
  const seen=new Set();
  return parts.flatMap(x=>Array.isArray(x)?x:[]).filter(x=>{
   const key=x.media_id+':'+x.watched_at;
   if(seen.has(key))return false;seen.add(key);return true;
  }).sort((x,y)=>Date.parse(y.watched_at)-Date.parse(x.watched_at));
 }},__ctR279Audit:{auditData:async data=>{auditCount++;return data;}},addEventListener(){}},
 document:{documentElement:{dataset:{}},addEventListener(){}},
 session:{user:{id:'fixture-user'},access_token:'valid'},user:{id:'fixture-user'},
 route:()=>routeName,discoverState:{tab:'foryou'},homeActiveTab158:'movies',
 homeCache:{history_movies:[]},paintHome:()=>true,paintDiscover:()=>{painted++},
 ct186ContextValue:null,ct186ContextAt:0,ct186ForYouData:null,ct166ForYouData:null,
 ct186Id:x=>Number(x.tmdb_id||x.id||0),ct186UniqueRows:a=>a,
 ct186Select:pick,discoverRows:async()=>null,ct186LoadForYou:async()=>null,
 ct186RefreshVisible:async()=>null,localDay:()=> '2026-10-19',
 rpc:async(name,args)=>{
  calls.push([name,args]);
  if(name==='cinetracker_home_movie_history_v542'){
   if(args.p_offset===0)return{total:121,rows:Array.from({length:120},(_,i)=>({
    media_id:100+i,tmdb_id:100+i,media_title:'Filme '+i,watched_at:'2026-10-15T12:00:00Z'
   }))};
   return{total:121,rows:[{media_id:999,tmdb_id:999,media_title:'Filme final',watched_at:'2026-10-16T12:00:00Z'}]};
  }
  const bag=name.includes('watch_unseen')?watch:fresh;
  return bag[args.p_kind]||[];
 },queueMicrotask,Date,Promise,Map,Set,Number,String,Boolean,Array,console,
 setTimeout:(fn,ms)=>{const t=setTimeout(fn,ms);t.unref?.();return t}
};
vm.createContext(context);vm.runInContext(patch,context,{timeout:1000});
const payload=await context.ct186LoadForYou();
assert.equal(auditCount,1,'six RPC pools must be audited together');
assert.equal(pick(payload).daily.id,1);
assert.equal(pick(payload).fm.id,2);
assert.equal(pick(payload).wm.id,5);
assert.equal(pick(payload).ws.id,6);
assert.equal(pick(payload).wa.id,7);
assert.ok(payload.__ct283ServerAudited,'v525 audited payload only');
assert.ok(painted>=1,'visible recommendations should repaint');
assert.equal(calls.filter(x=>x[0].includes('discover_')).length,6,'exact six authenticated pools');
routeName='home';tabName='';
const movieRows=await context.window.__ctR284Test.loadMoviePages(true);
assert.equal(movieRows.length,121,'pagination must not stop at the first 120');
assert.ok(calls.some(x=>x[0]==='cinetracker_home_movie_history_v542'&&x[1].p_offset===120),'second page required');
const combined=await fetcher();
assert.equal(combined.length,122,'original real movie must be preserved with 121 authoritative rows');
assert.ok(combined.some(x=>x.media_title==='Filme final'));
assert.ok(combined.some(x=>x.media_title==='Legado'));
console.log('ANDROID_1_0_42_TEST_OK: 7 verified slots, 6 server pools, real full movie pagination and legacy retention');
