import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const must=[
  'android-v0.99.7.41-r213-discover-core-profile-density',
  "const REVISION='r213-android-discover-core-profile-density';",
  'window.ct213SelectDiscoverTab=switchTab213',
  'window.ct213SelectDiscoverType=switchType213',
  'ctR180RenderArray(rows||[])',
  "if(tab==='foryou')paintDiscover(rows||{})",
  'real-core-click-direct-low-level-tab-content',
  'original-click-branch-direct-low-level-render',
  "row213(3,[card213('Séries'",
  "card213('Episódios'",
  "card213('Filmes'",
  "row213(2,[card213('Tempo em Séries'",
  "card213('Tempo em Filmes'",
  "card213('Tempo total de tela'",
  "row213(2,[card213('Séries Watchlist'",
  "card213('Filmes Watchlist'",
  "card213('Tempo total em Watchlist'",
  "panel.querySelector('.panel-head small')?.remove()",
  "panel.querySelectorAll('p').forEach(p=>p.remove())",
  "min-height:${h}!important",
  "const h=wide?'44px':'38px'",
  'single-minimal-item-search-no-date-no-summary',
  'cinetracker_sport_stats_v1-authority',
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters',
  'detail-watchlist-toggle'
];
for(const m of must)if(!html.includes(m))throw new Error('0.99.7.41 missing '+m);
const old="const dt=e.target.closest('[data-discover-tab]');if(dt){discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){discoverState.type=ty.dataset.discoverType;void render();return}";
if(html.includes(old))throw new Error('0.99.7.41 legacy Discover render branch survived');
for(const bad of [
  "addEventListener('pointerdown'",
  "addEventListener('pointerup'",
  "addEventListener('touchstart'",
  "addEventListener('touchend'",
  'r209-android-discover-profile-sports-layout',
  'r210-android-discover-profile-order',
  'r211-android-real-dom-roots',
  'r212-android-core-discover-profile'
])if(html.includes(bad))throw new Error('0.99.7.41 forbidden '+bad);
console.log('ANDROID_099741_TEST_OK core-click=direct content=selected-tab profile=compact sports-caption=removed');
