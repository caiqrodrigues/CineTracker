import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const marker='<script data-ct-android="r209-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('0.99.7.37 assembled r209 script missing');
const js=html.slice(a+marker.length,b);

const required=[
  "const REVISION='r209-android-discover-profile-sports-layout';",
  "window.__ctAndroidR209='discover-direct-core-tabs-profile-stat-order-sports-no-duplicate-watch';",
  "window.__ctAndroidDiscoverTabs='core-handler-direct-render-no-pan-rail';",
  "window.__ctAndroidProfileStats='compact-components-before-wide-totals';",
  "window.__ctAndroidSportsWatched='single-inline-action-no-duplicate-full-width';",
  "const dseq=++navSeq;void renderDiscover(dseq);return",
  'overflow-x:hidden!important',
  'touch-action:manipulation!important',
  "document.querySelectorAll('[data-sports] .event .ct168-watch-action').forEach(x=>x.remove());",
  "ctR180StatCard('Tempo em Séries'",
  "ctR180StatCard('Tempo em Filmes'",
  "ctR180StatCard('Tempo total de tela'",
  "ctR180StatCard('Tempo de série em Watchlist'",
  "ctR180StatCard('Tempo de filme em Watchlist'",
  "ctR180StatCard('Tempo total em Watchlist'",
  "window.__ctAndroidSportsUI='single-minimal-item-search-no-date-no-summary';",
  "window.__ctAndroidProfileSports='cinetracker_sport_stats_v1-authority';",
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters',
  'detail-watchlist-toggle'
];
for(const m of required)if(!js.includes(m))throw new Error('0.99.7.37 missing '+m);

const oldCore="const dt=e.target.closest('[data-discover-tab]');if(dt){discoverState.tab=dt.dataset.discoverTab;void render();return}";
if(js.includes(oldCore))throw new Error('0.99.7.37 old Discover global-render branch survived');

const r209Start=js.indexOf('/* Android 0.99.7.37 — reliable Discover taps');
const r209End=js.indexOf('\n})();',r209Start);
if(r209Start<0||r209End<r209Start)throw new Error('0.99.7.37 r209 runtime range missing');
const r209=js.slice(r209Start,r209End+6);
const order=[
  "ctR180StatCard('Tempo em Séries'",
  "ctR180StatCard('Tempo em Filmes'",
  "ctR180StatCard('Tempo total de tela'",
  "ctR180StatCard('Tempo de série em Watchlist'",
  "ctR180StatCard('Tempo de filme em Watchlist'",
  "ctR180StatCard('Tempo total em Watchlist'"
].map(x=>r209.indexOf(x));
for(let i=0;i<order.length;i++)if(order[i]<0||(i&&order[i]<=order[i-1]))throw new Error('0.99.7.37 Profile stat order invalid');
for(const forbidden of ["window.addEventListener('touchstart'","window.addEventListener('touchend'","window.addEventListener('pointerdown'","window.addEventListener('pointerup'"]){
  if(r209.includes(forbidden))throw new Error('0.99.7.37 r209 owns forbidden touch/pointer path: '+forbidden);
}
console.log('ANDROID_099737_TEST_OK discover=core-direct-no-pan profile=ordered-compact sports=single-inline-watch cards=3');
