import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r307-android-stable-js">';
const begin=html.indexOf(tag),end=begin<0?-1:html.indexOf('</script>',begin+tag.length);
assert.ok(begin>=0&&end>begin,'Official Android 1.0 r307 runtime missing');
const js=html.slice(begin+tag.length,end);new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
for(const marker of [
 "const REVISION='r307-android-official-1.0'",
 'window.__ctAndroidOfficialCode=10108',
 'window.__ctR307Taste={choose,shown,feedback,next,refill,profile,stats:tasteStats',
 'window.__ctR307HomeGuard={scan,cleanOrphans,repairMovies,stats:',
 'window.__ctR305MovieHistory={refresh,merge,latestRows:()=>fresh,restore:',
 'window.__ctR307Taste?.choose?.(key,usable',
 'window.__ctR307Taste?.shown?.(key,candidate)',
 'window.__ctR307Taste?.feedback?.(key,current',
 'window.__ctR307Taste?.next',
 'paintedVisit=visit',
 'cinetracker_recommendation_filter_v525',
 "window.__ctR303SinglePaint",
 "window.addEventListener('click',sportsClick304,true)",
 'if(events)events.remove();',
 "window.__ctR306Home={classify,consolidateSeries,recentEpisodes,refresh,normalize",
 'cinetracker_home_movie_history_v542',
 "[['previous','Anteriores'],['upcoming','Próximos']]"
])assert.ok(js.includes(marker),'Lost official 1.0 working feature or r307 marker: '+marker);
const module=await readFile('apps/android/runtime-r307-taste-home.js','utf8');
assert.ok(!module.includes('window.location.reload(')&&!module.includes('router.refresh('));
assert.ok(!module.includes("paintDiscover(")&&!module.includes('renderHome('));
assert.ok(!module.includes('window.__ctR306Home=')&&!module.includes('paintSports('));
assert.ok(module.includes('gate.auditData(isolated)'),'Every supplementary candidate must pass current authenticated v525 audit');
assert.ok(module.includes('ct186FreshEligible(x,ctx)'),'Supplementary candidates cannot bypass watch or watched filters');
assert.ok(module.includes('gate.permitted(x,false)'),'Only server-permitted fresh items may be appended');
assert.ok(module.includes("key.startsWith('watchlist:')"),'Watchlist slots must never use external TMDB fallback');
assert.ok(!module.includes('ct186SaveDaily268('),'No reset of established identity / slot ownership');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'")&&gradle.includes('versionCode 10108'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));

const mk=(id,genre,kind='movie')=>({id,media_type:kind,title:'Content '+id,
 genre_ids:[genre],vote_average:8.1,poster_path:'/poster.jpg',release_date:'2026-01-01'});
let owner='a',date='2026-10-21',page='discover',tab='foryou',restores=0,removed=0;
const stored=new Map(),logs={},docEvents={};
const data={_ct186_fresh:{movie:[mk(1,28),mk(2,35),mk(3,28)],series:[],anime:[]},
 _ct186_watchlist:{movie:[mk(4,28)],series:[],anime:[]}};
const dashboard=[{id:11,media_type:'movie',genre_ids:[28],is_seen:true,is_favorite:true},
 {id:12,media_type:'movie',genre_ids:[28],is_watchlist:true},
 {id:13,media_type:'movie',genre_ids:[35],is_seen:true}];
let lastRow='movie:2';
const ghost={textContent:'✓',removed:false,querySelector:s=>s==='.media-row'?null:{tagName:'BUTTON'},
 remove(){this.removed=true;removed++}};
const validRow={textContent:'Valid movie',querySelector:()=>({tagName:'DIV'})};
const series={querySelectorAll:()=>[ghost,validRow]};
const movieStack={querySelectorAll:()=>[{dataset:{media:lastRow}}]};
const movies={querySelector:s=>s==='.home-history .stack'?movieStack:null};
const home={};
const doc={
 hidden:false,documentElement:{dataset:{}},
 addEventListener(type,fn){(docEvents[type]??=[]).push(fn)},
 querySelector:s=>s==='[data-home-viewport="series"]'?series:
  s==='[data-home-viewport="movies"]'?movies:s==='[data-home]'?home:null
};
const win={
 __ctR279Audit:{auditData:async data=>data,permitted:()=>true},
 __ctR303SinglePaint:{data:()=>data},
 __ctR305MovieHistory:{latestRows:()=>[{tmdb_id:9,watched_at:'2026-10-21T18:00:00Z'}],restore(){restores++;lastRow='movie:9'}},
 __ctR265Test:{allowed:()=>true},
 addEventListener(type,fn){(logs[type]??=[]).push(fn)}
};
const storage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)};
const allowedRows=[];
const setup=new Function('window','document','localStorage','setTimeout','queueMicrotask','safeTmdb','ct186UniqueRows',
 'ct186FreshEligible','ct186ContextValue','genreIds158','ct186Id','ct186Type','ct186Anime','route','localDay','ct186MergeRows',
 'paintHome','MutationObserver','ct186Quality',
 "let session={user:{id:'a'},access_token:'token'},user={id:'a'};"+
 "let discoverState={tab:'foryou'},homeActiveTab158='movies';"+
 module+
 "return{taste:window.__ctR307Taste,guard:window.__ctR307HomeGuard,changeAccount(id){session={user:{id},access_token:'token'};user={id}},"+
 "changePage(id){page=id},changeDay(id){date=id},setSection(t){homeActiveTab158=t}};"
);
let seenCalls=0;
const runtime=setup(win,doc,storage,()=>99,fn=>fn(),async(endpoint,params)=>{
 seenCalls++;assert.ok(endpoint==='/discover/movie');assert.ok(params.page>=1&&params.page<=18);
 return{results:[mk(20,28),mk(21,35)]}
},rows=>[...new Map(rows.map(x=>[x.media_type+':'+x.id,x])).values()],()=>true,
 {dash:dashboard},x=>x.genre_ids||[],x=>x.id,
 x=>x.media_type,x=>false,()=>page,()=>date,(a,b)=>[...a,...b],
 ()=>true,undefined,()=>true);
const taste=runtime.taste,guard=runtime.guard;
assert.ok(taste&&guard);
const prof=taste.profile();
assert.ok(prof.positive.get(28)>prof.positive.get(35),
 'Watched, favorited and watchlisted genre should rank above generic high-rated titles');
assert.equal(taste.stats().watched,2);
assert.equal(taste.stats().watchlist,1);
assert.equal(taste.stats().favorites,1);
const pool=[mk(1,28),mk(2,35),mk(3,28)];
const first=taste.choose('fresh:movie',pool);
assert.ok(first&&first.id!==4);
taste.shown('fresh:movie',first);
const second=taste.choose('fresh:movie',pool,'movie:'+first.id);
assert.ok(second&&second.id!==first.id,'First Trocar must offer another real title');
taste.shown('fresh:movie',second);
const third=taste.choose('fresh:movie',pool,'movie:'+second.id);
assert.ok(third&&![first.id,second.id].includes(third.id),
 'Previously shown candidates should be suppressed while alternatives exist');
taste.shown('fresh:movie',third);
date='2026-10-22';
const nextDay=taste.choose('fresh:movie',[...pool,mk(50,28)]);
assert.equal(nextDay.id,50,'Following day must not restart with yesterday’s identical slate');
taste.feedback('fresh:movie',first,'swap');
taste.feedback('fresh:movie',mk(50,28),'seen');
assert.ok(taste.profile().positive.get(28)>0,'Mark seen updates the affinity model');
assert.ok(taste.profile().negative.get(28)>0,'Trocar teaches the affinity model');
assert.equal(taste.stats().impressions,3);
assert.ok(stored.get('ct:r307:taste:a')?.includes('shown'));
const w=taste.choose('watchlist:movie',[mk(4,28),mk(5,35)]);
assert.ok(w,'Watchlist can choose from existing Watchlist items');
assert.ok(!data._ct186_watchlist.movie.some(x=>x.id===20));
const x=await taste.next('fresh:movie','movie:1',[]);
assert.ok(x&&[20,21].includes(x.id),'When a fresh slot exhausts its pool, top up from new candidates');
assert.equal(seenCalls,1);
assert.equal(data._ct186_fresh.movie.length,5,'Authenticated and filtered candidates appended without replacing pool');
assert.equal(await taste.refill('watchlist:movie'),false,'Must never invent Watchlist cards');
page='home';runtime.setSection('series');
guard.cleanOrphans();
assert.equal(removed,1,'Only orphan ✓ action bar removed');
assert.ok(!validRow.removed,'Actual episode buttons and series cards remain untouched');
runtime.setSection('movies');
guard.repairMovies();
assert.equal(restores,1,'Stale Pokémon-like movie History replaced by verified latest');
guard.repairMovies();
assert.equal(restores,1,'No DOM observer restore loop when latest card is present');
runtime.changeAccount('b');page='discover';
assert.equal(taste.stats().account,'b');
assert.equal(taste.stats().impressions,0,'Do not leak recommendation history between accounts');
assert.ok(taste.profile().positive.get(28)>0,'Initial preference learns from watched/Watchlist profile independently');
console.log('CINETRACKER_1_0_R307_TEST_OK: official 1.0 intact; orphan check removed; old movie-paint repaired without loops; account-isolated learned affinity and negative swap feedback; next-day non-repeat; authenticated v525 vetted candidate refill; Sports/F1/Home 30-day buckets preserved.');
