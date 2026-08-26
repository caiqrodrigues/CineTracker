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
  File:globalThis.File,
  DecompressionStream:globalThis.DecompressionStream,
  fetch:async()=>{throw new Error('network must not be used by semantic unit test')},
  CustomEvent:class CustomEvent{constructor(type,init={}){this.type=type;this.detail=init.detail}},
});
new vm.Script(source,{filename:'patch-v083-hotfix13-bingers-semantics.js'}).runInContext(context);

if(typeof window.ct13PrepareImport!=='function')throw new Error('HOTFIX13 prepare engine was not exposed');

const library=[
  {type:'movie',title:'Filme atual',tmdb_id:'101',list_status:''},
  {type:'movie',title:'Filme para depois',tmdb_id:'102',list_status:'for_later'},
  {type:'show',title:'Série não iniciada',tmdb_id:'201',list_status:'following'},
  {type:'show',title:'Série iniciada',tmdb_id:'202',list_status:'following'},
  {type:'show',title:'Série explicitamente para depois',tmdb_id:'203',list_status:'for_later'}
];
const watches=[
  {type:'movie',title:'Filme atual',tmdb_id:'101',last_watched_at:'2026-01-01T00:00:00Z'},
  {type:'episode',title:'Série iniciada',tmdb_id:'202',season_number:'1',episode_number:'1',last_watched_at:'2026-01-02T00:00:00Z'},
  {type:'movie',title:'Filme antigo fora da biblioteca',tmdb_id:'9991',last_watched_at:'2020-01-01T00:00:00Z'},
  {type:'episode',title:'Série antiga fora da biblioteca',tmdb_id:'9992',season_number:'2',episode_number:'3',last_watched_at:'2020-01-02T00:00:00Z'}
];
const result=window.ct13PrepareImport(library,watches);
const s=result.summary;

function eq(actual,expected,label){if(actual!==expected)throw new Error(`${label}: expected ${expected}, got ${actual}`)}
eq(s.library_items,5,'original library count');
eq(s.library_movies,2,'original movie library count');
eq(s.library_series,3,'original series library count');
eq(s.raw_watch_events,4,'raw history count');
eq(s.watch_events,4,'preserved history count');
eq(s.watched_movie_events,2,'movie history including library-missing item');
eq(s.watched_episode_events,2,'episode history including library-missing item');
eq(s.history_only_media,2,'synthetic media references');
eq(s.unmatched_watch_events,0,'unmatched history');
eq(s.watchlist_movies,1,'movie watchlist');
eq(s.watchlist_series,2,'not-started plus explicit series watchlist');
eq(s.followed_series,1,'started/followed series');

const notStarted=result.library.find(x=>x.tmdb_id==='201');
const started=result.library.find(x=>x.tmdb_id==='202');
if(notStarted?.list_status!=='for_later'||notStarted?.ct13_derived_state!=='not_started_watchlist')throw new Error('following series with zero episode history must become not-started watchlist');
if(started?.list_status!=='watching'||started?.ct13_derived_state!=='started')throw new Error('series with episode history must remain started/in progress');

// Acceptance target observed in the user's Bingers Statistics screen:
// 1,312 watched movies + 14,904 watched episodes = 16,216 watched items.
const bigLibrary=[
  {type:'movie',title:'Filme base',tmdb_id:'7001',list_status:''},
  {type:'show',title:'Série base',tmdb_id:'7002',list_status:'following'},
  {type:'show',title:'Série não iniciada grande',tmdb_id:'7003',list_status:'following'}
];
const bigWatches=[];
for(let i=0;i<1312;i++)bigWatches.push({type:'movie',title:'Filme base',tmdb_id:'7001',last_watched_at:'2026-01-01T00:00:00Z',plays:'1'});
for(let i=0;i<14904;i++)bigWatches.push({type:'episode',title:'Série base',tmdb_id:'7002',season_number:String(1+Math.floor(i/1000)),episode_number:String(1+(i%1000)),last_watched_at:'2026-01-02T00:00:00Z'});
const big=window.ct13PrepareImport(bigLibrary,bigWatches).summary;
eq(big.watched_movie_events,1312,'Bingers watched movies acceptance total');
eq(big.watched_episode_events,14904,'Bingers watched episodes acceptance total');
eq(big.watch_events,16216,'Bingers combined watched acceptance total');
eq(big.raw_watch_events,16216,'Bingers raw combined watched acceptance total');
eq(big.unmatched_watch_events,0,'Bingers acceptance unmatched total');
eq(big.watchlist_series,1,'zero-history following series classification in large case');
eq(big.followed_series,1,'started series classification in large case');

console.log(`HOTFIX13_BINGERS_SEMANTICS_OK movies=${big.watched_movie_events}; episodes=${big.watched_episode_events}; combined=${big.watch_events}; not-started=>watchlist; missing-library-history=preserved`);
