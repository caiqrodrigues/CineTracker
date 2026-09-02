import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const marker='<script data-ct-android="r210-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('0.99.7.38 assembled r210 script missing');
const js=html.slice(a+marker.length,b);

for(const m of [
  "const REVISION='r210-android-discover-profile-order';",
  "window.__ctAndroidR210='discover-in-place-pointerdown-profile-exact-hierarchy';",
  "window.__ctAndroidDiscoverTabs='direct-button-pointerdown-in-place-stale-request-guard';",
  "window.__ctAndroidProfileStats='series-episodes-movies-then-times-then-watchlist-total';",
  'window.ct210SelectDiscoverTab=selectTab210;',
  'window.ct210SelectDiscoverType=selectType210;',
  'switchToken210',
  "btn.addEventListener('pointerdown'",
  "stat210('Séries'",
  "stat210('Episódios'",
  "stat210('Filmes'",
  "stat210('Tempo em Séries'",
  "stat210('Tempo em Filmes'",
  "stat210('Tempo total de tela'",
  "stat210('Séries Watchlist'",
  "stat210('Filmes Watchlist'",
  "stat210('Tempo total em Watchlist'",
  'grid-template-columns:repeat(6,minmax(0,1fr))',
  'ct210-third','ct210-half','ct210-wide',
  "window.__ctAndroidSportsUI='single-minimal-item-search-no-date-no-summary';",
  "window.__ctAndroidSportsWatched='single-inline-action-no-duplicate-full-width';",
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters'
])if(!js.includes(m))throw new Error('0.99.7.38 missing '+m);

const r210Start=js.indexOf('/* Android 0.99.7.38 — deterministic in-place Discover tabs');
const r210End=js.indexOf('\n})();',r210Start);
if(r210Start<0||r210End<r210Start)throw new Error('0.99.7.38 r210 runtime range missing');
const r210=js.slice(r210Start,r210End+6);
if(r210.includes("window.addEventListener('touchstart'")||r210.includes("window.addEventListener('touchend'"))throw new Error('0.99.7.38 must not add global touch listeners');
if(!r210.includes("if(my!==switchToken210||seq!==navSeq"))throw new Error('0.99.7.38 stale Discover request guard missing');

const profileOrder=[
  "stat210('Séries'",
  "stat210('Episódios'",
  "stat210('Filmes'",
  "stat210('Tempo em Séries'",
  "stat210('Tempo em Filmes'",
  "stat210('Tempo total de tela'",
  "stat210('Séries Watchlist'",
  "stat210('Filmes Watchlist'",
  "stat210('Tempo total em Watchlist'"
].map(x=>r210.indexOf(x));
for(let i=0;i<profileOrder.length;i++)if(profileOrder[i]<0||(i&&profileOrder[i]<=profileOrder[i-1]))throw new Error('0.99.7.38 Profile hierarchy invalid');

console.log('ANDROID_099738_TEST_OK discover=in-place-pointerdown profile=exact-hierarchy sports=preserved cards=3');
