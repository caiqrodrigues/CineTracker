import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('apps/web/patch-v083-hotfix13-bingers-semantics.js','utf8');
const window={};
const context=vm.createContext({
  window,
  document:{querySelector(){return null}},
  console,
  setTimeout,
  clearTimeout,
  TextDecoder,
  Response,
  Blob,
  DecompressionStream:globalThis.DecompressionStream,
  fetch:async()=>{throw new Error('network must not be used by semantic unit test')},
  CustomEvent:class CustomEvent{constructor(type,init={}){this.type=type;this.detail=init.detail}},
});
new vm.Script(source,{filename:'patch-v083-hotfix13-bingers-semantics.js'}).runInContext(context);

if(typeof window.ct13PrepareImport!=='function')throw new Error('HOTFIX13 prepare engine was not exposed');
if(typeof window.ct13ParseDelimited!=='function')throw new Error('HOTFIX13 CSV parser was not exposed');

const eq=(actual,expected,label)=>{if(actual!==expected)throw new Error(`${label}: expected ${expected}, got ${actual}`)};

// Regression: NFKD normalization must keep visually distinct sequel markers apart.
const duplicateLibrary=[
  {type:'movie',title:'The Accountant',year:'2016',list_status:'following',added_at:'2021-06-09T11:26:26.000Z'},
  {type:'movie',title:'The Accountant²',year:'2025',list_status:'following',added_at:'2025-04-01T13:37:05.000Z'},
  {type:'movie',title:'How to Train Your Dragon',year:'2010',list_status:'following',added_at:'2021-06-08T11:52:39.000Z'},
  {type:'movie',title:'How to Train Your Dragon',year:'2025',list_status:'following',added_at:'2025-06-11T00:06:09.000Z'}
];
const duplicateWatches=[
  {type:'movie',title:'The Accountant',first_watched_at:'2021-06-09T11:31:06.000Z',last_watched_at:'2025-05-14T17:42:14.000Z',plays:'2'},
  {type:'movie',title:'The Accountant²',first_watched_at:'2025-05-06T02:13:32.000Z',last_watched_at:'2025-05-06T02:13:32.000Z',plays:'1'},
  {type:'movie',title:'How to Train Your Dragon',first_watched_at:'2021-06-08T11:52:40.000Z',last_watched_at:'2021-06-08T11:52:40.000Z',plays:'1'},
  {type:'movie',title:'How to Train Your Dragon',first_watched_at:'2025-06-11T00:06:09.000Z',last_watched_at:'2025-09-15T10:32:53.000Z',plays:'2'}
];
const duplicate=window.ct13PrepareImport(duplicateLibrary,duplicateWatches);
eq(duplicate.summary.unmatched_watch_events,0,'duplicate-title unmatched records');
eq(duplicate.summary.movie_watch_records,4,'duplicate-title record count');
eq(duplicate.summary.movie_plays,6,'duplicate-title plays total');
const dragonIds=duplicate.watches.filter(x=>x.title==='How to Train Your Dragon').map(x=>x.media_tmdb_id);
if(new Set(dragonIds).size!==2)throw new Error('same-title editions must be allocated to different media rows');

// Acceptance fixture mirrors the real Bingers export aggregates without containing user titles/data.
const library=[];
for(let i=0;i<2318;i++)library.push({type:'movie',title:`Movie ${i+1}`,year:'2000',tmdb_id:String(100000+i),list_status:i<1309?'for_later':'following',added_at:'2020-01-01T00:00:00Z'});
for(let i=0;i<760;i++)library.push({type:'show',title:`Show ${i+1}`,year:'2000',tmdb_id:String(200000+i),list_status:i<3?'for_later':'watching',added_at:'2020-01-01T00:00:00Z'});

const watches=[];
// 949 movie records; 363 have one replay => 1,312 total movie plays.
for(let i=0;i<949;i++)watches.push({type:'movie',title:`Movie ${1309+i+1}`,tmdb_id:String(100000+1309+i),first_watched_at:'2021-01-01T00:00:00Z',last_watched_at:'2021-01-01T00:00:00Z',plays:String(i<363?2:1)});
// 11,747 episode records across 227 shows; 3,157 have one replay => 14,904 total episode plays.
for(let i=0;i<11747;i++){
  const showIndex=3+(i%227);
  watches.push({type:'episode',title:`Show ${showIndex+1}`,tmdb_id:String(200000+showIndex),season_number:String(1+Math.floor(i/1000)),episode_number:String(1+(i%1000)),first_watched_at:'2021-01-02T00:00:00Z',last_watched_at:'2021-01-02T00:00:00Z',plays:String(i<3157?2:1)});
}

const result=window.ct13PrepareImport(library,watches),s=result.summary;
eq(s.library_items,3078,'library items');eq(s.library_movies,2318,'library movies');eq(s.library_series,760,'library series');
eq(s.movie_watch_records,949,'movie records');eq(s.episode_watch_records,11747,'episode records');eq(s.raw_watch_records,12696,'raw history records');
eq(s.movie_plays,1312,'movie plays');eq(s.episode_plays,14904,'episode plays');eq(s.total_plays,16216,'combined plays');
eq(s.watchlist_movies,1309,'movie watchlist');eq(s.watchlist_series,533,'not-started series watchlist');eq(s.started_series,227,'series with episode history');
eq(s.watch_later_movies,1309,'watch-later movies');eq(s.watch_later_series,3,'watch-later series');eq(s.watch_later_total,1312,'watch-later total');
eq(s.history_only_media,0,'history-only media for complete library fixture');eq(s.unmatched_watch_events,0,'unmatched history records');
if(!s.ignored_ratings||!s.ignored_lists)throw new Error('ratings/lists must remain ignored');

console.log(`HOTFIX13_BINGERS_SEMANTICS_OK library=${s.library_items}; movies=${s.movie_plays}; episodes=${s.episode_plays}; total=${s.total_plays}; series_watchlist=${s.watchlist_series}; started_series=${s.started_series}; watch_later=${s.watch_later_total}; unmatched=${s.unmatched_watch_events}`);
