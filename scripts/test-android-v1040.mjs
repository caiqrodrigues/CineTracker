import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r282-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'v1040 bundled runtime absent');
const js=html.slice(a+marker.length,b);
const patch=await readFile('apps/android/runtime-r282-v1040-foryou-history.js','utf8');
new Function(js);new Function(patch);
for(const piece of [
 "const REVISION='r282-android-official-1.0.40'",
 "window.__ctAndroidOfficialCode=10082",
 "window.__ctR282AndroidV1040='fresh-movie-play-events+home-history-preserved+parallel-v525-foryou+empty-layout'",
 'watch_play_events_v0994','cinetracker_home_movie_history_v323',
 'cinetracker_recommendation_filter_v525',
 'ct282-empty-slot','ct186ContextAt=0',
 'if(now<movieRetryAt271)return;',
 'movieRetryAt271=Date.now()+120000;',
 'g.includes(10766))return false;',
 'if(ok===false&&isVisible()&&picked.get(key)===ref)',
 'cinetracker_sports_stadium_summary_v296',
 '__ctR281AndroidV1039','__ctR279AndroidV1037','__ctR278AndroidV1036',
 '__ctR271AndroidV1029'
])assert.ok(js.includes(piece),'critical owner missing '+piece);
assert.ok(!js.includes('if(movieStamp271===key||now<movieRetryAt271)return;'),'Home history still locked for entire day');
assert.ok(!js.includes('g.includes(10766)||g.includes(18)'),'Drama incorrectly blocked');
assert.ok(html.includes('name="ct-official-version" content="1.0.40"'));
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 assert.ok(!patch.includes(bad),'forbidden operation '+bad);

// Exercise the real r282 module without device/user secrets: sources are
// mocked according to the authenticated Supabase table schema, never invented
// success results from private user data.
const build=(type,id,anime=false)=>({
 id,title:'Elegível '+id,poster_path:'/poster'+id+'.jpg',
 media_type:type,vote_average:8.4,release_date:'2024-04-02',isAnime:anime
});
const movie=[build('movie',11),build('movie',12),build('movie',13)];
const series=[build('tv',21),build('tv',22),build('tv',23)];
const anime=[build('tv',31,true),build('tv',32,true),build('tv',33,true)];
const old=[{id:1,media_id:1,watched_at:'2026-10-10T15:00:00Z',media_title:'Pokémon O Filme',tmdb_id:11}];
let fetcher=async()=>old,painter=()=>true,painted=0,network=0,ctxAccess=0;
const counters={audited:0},domStyles=[];
const empty=()=>({movie:[],series:[],anime:[]});
const sandbox={
 window:{addEventListener(){},__ctR265Test:{allowed:x=>Boolean(x?.poster_path)},
  __ctR279Audit:{auditData:async data=>{
   counters.audited++;
   // Simulate v525: an item in Watchlist or seen can never enter a fresh slot.
   for(const k of ['movie','series','anime']){
    data._ct186_fresh[k]=(data._ct186_fresh[k]||[]).filter(x=>!x.seen&&!x.is_watchlist);
    data._ct186_watchlist[k]=(data._ct186_watchlist[k]||[]).filter(x=>x.is_watchlist&&!x.seen);
   }
   return data;
  }},
  __ctR271Bridge:{getFetcher:()=>fetcher,setFetcher:f=>{fetcher=f},getPainter:()=>painter,setPainter:f=>{painter=f}}},
 },
 document:{head:{appendChild:x=>domStyles.push(x.textContent)},createElement:()=>({id:'',textContent:''}),addEventListener(){},querySelector(){return null}},
 session:{user:{id:'test-owner'}},user:{id:'test-owner'},
 ct186ContextValue:null,ct186ContextAt:0,ct186ForYouData:null,ct166ForYouData:null,
 ct186Context:async()=>{ctxAccess++;return{dash:[{is_watchlist:true}],historyMovieIds:new Set(),historyTvIds:new Set(),watchMovieIds:new Set(),watchTvIds:new Set(),historyAliases:new Set(),watchAliases:new Set()}},
 ct186WatchPools:()=>({movie:[{...movie[0],is_watchlist:true}],series:[],anime:[]}),
 ct186UniqueRows:x=>[...new Map(x.map(z=>[z.media_type+':'+z.id,z])).values()],
 ct186MergeRows:(a,b)=>[...new Map([...a,...b].map(z=>[z.media_type+':'+z.id,z])).values()],
 ct186Type:x=>x.media_type,
 ct186Anime:x=>Boolean(x.isAnime),
 ct186Quality:x=>Number(x.vote_average)>=7.5,
 ct186Select:data=>({
  daily:data._ct186_fresh.movie[0]||null,
  fm:data._ct186_fresh.movie[1]||null,
  fs:data._ct186_fresh.series[0]||null,
  fa:data._ct186_fresh.anime[0]||null,
  wm:data._ct186_watchlist.movie[0]||null,
  ws:null,wa:null
 }),
 ct186Slot:(label,x,key)=>'<div>'+label+' '+key+'</div>',
 ct186LoadForYou:async()=>({}),ct186RefreshVisible:async()=>({}),
 discoverRows:async()=>[{id:1}],paintDiscover:()=>{painted++},
 paintHome:()=>true,homeActiveTab158:'movies',homeCache:{history_movies:old},
 route:()=> 'discover',discoverState:{tab:'foryou'},
 localDay:()=> '2026-10-19',uid:()=> 'test-owner',console,
 api:async url=>{
  if(url.startsWith('watch_play_events_v0994?'))return[{id:7,media_id:2,item_type:'movie',played_at:'2026-10-19T14:20:00Z'}];
  if(url.startsWith('media?'))return[{id:2,tmdb_id:1222,title:'Filme depois de Pokémon',media_type:'movie',poster_path:'/p2.jpg'}];
  return[];
 },
 rpc:async(name)=>name==='cinetracker_home_movie_history_v323'?[]:null,
 safeTmdb:async(path,params)=>{
  network++;
  const source=path.includes('movie')?movie:params.with_genres==='16'?anime:series;
  return{results:[...source,{...source[0],id:999,seen:true}]};
 },
 queueMicrotask,Promise,Date,Map,WeakMap,Set,WeakSet,Number,String,Boolean,Array,
 setTimeout:(fn,ms)=>{const t=setTimeout(fn,ms);t.unref();return t},
};
sandbox.window.document=sandbox.document;
vm.createContext(sandbox);
vm.runInContext(patch,sandbox,{timeout:2000});
const history=await fetcher();
assert.equal(history.length,2,'full older movie and newer play must coexist');
assert.equal(history[0].media_id,2,'newest real movie must be first');
assert.equal(history[1].media_id,1,'old Pokémon history must not be erased');
assert.equal(history[0].media_title,'Filme depois de Pokémon');
assert.ok(domStyles[0].includes('grid-template-columns:minmax(190px'),'daily empty card must be phone-width');
assert.ok(!domStyles[0].includes('100px-wide'),'no old incorrect tiny column');

await sandbox.discoverRows('foryou');
for(let i=0;i<60;i++)await new Promise(done=>setImmediate(done));
const rec=sandbox.window.__ctR282Test.forYou();
assert.ok(rec&&rec.data._ct186_fresh.movie.length>=2,'daily and fresh must have different eligible movies');
assert.ok(rec.data._ct186_fresh.series.length>=1,'series candidates missing');
assert.ok(rec.data._ct186_fresh.anime.length>=1,'anime candidates missing');
assert.ok(counters.audited>=3,'all three categories must pass authenticated audit');
assert.ok(painted>=3,'progressive category paint did not happen');
assert.equal(rec.data._ct186_fresh.movie.some(x=>x.seen),false,'seen movie leaked');
assert.ok(network<=6,'fast first load must use bounded 3+3 queries');
assert.equal(sandbox.ct186Slot('Filme',null,'daily:movie',0).includes('ct265-empty-slot'),false,'old narrow empty slot survived');
assert.ok(sandbox.ct186Slot('Filme',null,'daily:movie',0).includes('ct277-empty'),'empty placeholder should be single');
console.log('ANDROID_1_0_40_TEST_OK recent play after Pokemon preserved + no 24h history lock + 7 secure progressive slots + 3 parallel first pages + correct non-overflow empty slot');
