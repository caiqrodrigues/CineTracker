import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const marker='<script data-ct-android="r212-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('0.99.7.40 assembled r212 script missing');
const js=html.slice(a+marker.length,b);
const required=[
  "const REVISION='r212-android-core-discover-profile';",
  "window.__ctAndroidR212='direct-r180-discover-explicit-profile-rows';",
  "window.__ctAndroidDiscoverTabs='actual-content-switch-not-visual-only';",
  "window.__ctAndroidProfileStats='explicit-rows-no-css-grid-dependency';",
  "window.__ctAndroidBase='0.99.7.36-sports-approved';",
  'renderDiscover=renderDiscover212',
  'window.ct212SelectDiscoverTab=switchTab212',
  "if(selected==='foryou')paintDiscover(rows||{});else ctR180RenderArray(rows||[]);",
  "if(typeof ctR180StrictRows==='function')return ctR180StrictRows(tab);",
  "row212(3,[card212('Séries'",
  "card212('Episódios'",
  "card212('Filmes'",
  "row212(2,[card212('Tempo em Séries'",
  "card212('Tempo em Filmes'",
  "row212(1,[card212('Tempo total de tela'",
  "row212(2,[card212('Séries Watchlist'",
  "card212('Filmes Watchlist'",
  "row212(1,[card212('Tempo total em Watchlist'",
  "document.querySelectorAll('[data-sports] .event .ct168-watch-action').forEach(x=>x.remove())",
  'single-minimal-item-search-no-date-no-summary',
  'cinetracker_sport_stats_v1-authority',
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters',
  'detail-watchlist-toggle'
];
for(const m of required)if(!js.includes(m))throw new Error('0.99.7.40 missing '+m);
for(const forbidden of ['r209-android-discover-profile-sports-layout','r210-android-discover-profile-order','r211-android-real-dom-roots'])if(js.includes(forbidden))throw new Error('0.99.7.40 inherited broken '+forbidden);
const order=["card212('Séries'","card212('Episódios'","card212('Filmes'","card212('Tempo em Séries'","card212('Tempo em Filmes'","card212('Tempo total de tela'","card212('Séries Watchlist'","card212('Filmes Watchlist'","card212('Tempo total em Watchlist'"].map(x=>js.indexOf(x));
for(let i=0;i<order.length;i++)if(order[i]<0||(i&&order[i]<=order[i-1]))throw new Error('0.99.7.40 Profile order invalid');
console.log('ANDROID_099740_TEST_OK discover=content-switch profile=explicit-rows sports=.36-approved cards=3');
