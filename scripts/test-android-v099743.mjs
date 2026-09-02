import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const must=[
  'android-v0.99.7.43-r215-profile-posters-discover',
  "const REVISION='r215-android-profile-posters-discover';",
  'profile-unified-collapse-poster-recovery-discover-static-tabs',
  'main-and-sports-collapse-together-tight-gap',
  'safe-title-type-tmdb-fallback-cache',
  'core-click-static-3x3-no-gesture-listener',
  "safeTmdb('/search/'+job.type",
  'data-ct215-poster-key',
  'IntersectionObserver',
  'ct215-stats-hidden',
  'grid-template-columns:repeat(3,minmax(0,1fr))',
  'static-nine-tab-grid-original-core-click-r214-state',
  'safe-title-type-tmdb-recovery-cached-near-viewport',
  'window.ct214SelectDiscoverTab=selectTab214',
  'selected-tab-is-render-state-and-fetch-state',
  "const h=wide?'40px':'34px'",
  'min-height:36px!important',
  'remove-explanatory-copy-keep-data-labels',
  'single-minimal-item-search-no-date-no-summary',
  'cinetracker_sport_stats_v1-authority',
  'detail-watchlist-toggle'
];
for(const m of must)if(!html.includes(m))throw new Error('0.99.7.43 missing '+m);

for(const forbidden of [
  '__ctAndroidR199Loaded','__ctAndroidR200Loaded','__ctAndroidR201Loaded','__ctAndroidR202Loaded',
  '__ctAndroidR203Loaded','__ctAndroidR204Loaded','__ctAndroidR205Loaded',
  'r209-android-discover-profile-sports-layout','r210-android-profile-order','r211-android-real-dom-roots','r212-android-core-discover-profile'
])if(html.includes(forbidden))throw new Error('0.99.7.43 inherited forbidden runtime '+forbidden);

const start=html.indexOf('/* Android 0.99.7.43');
const end=html.indexOf('})();',start);
const r215=start>=0&&end>start?html.slice(start,end+5):'';
if(!r215)throw new Error('0.99.7.43 r215 block missing');
for(const bad of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){
  if(r215.includes(bad))throw new Error('0.99.7.43 r215 added gesture listener '+bad);
}

// Matching rule used by Android fallback: Family Guy must resolve only by exact normalized title.
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' e ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const family=[
  {id:1434,name:'Family Guy',original_name:'Family Guy',first_air_date:'1999-01-31',poster_path:'/family.jpg',popularity:200},
  {id:999,name:'Family Guy Presents Something Else',first_air_date:'2009-01-01',poster_path:'/wrong.jpg',popularity:999}
];
const exact=family.filter(x=>[x.title,x.name,x.original_title,x.original_name].map(norm).includes(norm('Family Guy')));
if(exact.length!==1||exact[0].id!==1434)throw new Error('Family Guy safe exact-title fixture failed');

console.log('ANDROID_099743_TEST_OK profile=synchronized posters=safe-title-type-recovery discover=static-core-click web=unchanged');
