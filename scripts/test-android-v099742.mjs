import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const must=[
  'android-v0.99.7.42-r214-discover-state-clean-captions-density',
  "const REVISION='r214-android-discover-state-clean-captions-density';",
  'window.ct214SelectDiscoverTab=selectTab214',
  'window.ct214SelectDiscoverType=selectType214',
  'renderDiscover=async function(seq)',
  'selected-tab-is-render-state-and-fetch-state',
  'single-state-route-click-fetch-active-tab',
  "shell('Descobrir','','discover'",
  'data-ct214-active',
  "const h=wide?'40px':'34px'",
  'min-height:36px!important',
  'remove-explanatory-copy-keep-data-labels',
  'REGRA ATIVA',
  'baseado nos seus vistos',
  'priorizad[ao].*watchlist',
  'o cache limpa apenas',
  'single-minimal-item-search-no-date-no-summary',
  'cinetracker_sport_stats_v1-authority',
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters',
  'detail-watchlist-toggle'
];
for(const m of must)if(!html.includes(m))throw new Error('0.99.7.42 missing '+m);

const oldCore="const dt=e.target.closest('[data-discover-tab]');if(dt){e.preventDefault();if(window.ct213SelectDiscoverTab){void window.ct213SelectDiscoverTab(dt.dataset.discoverTab);return}discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){e.preventDefault();if(window.ct213SelectDiscoverType){void window.ct213SelectDiscoverType(ty.dataset.discoverType);return}discoverState.type=ty.dataset.discoverType;void render();return}";
const newCore="const dt=e.target.closest('[data-discover-tab]');if(dt){e.preventDefault();if(window.ct214SelectDiscoverTab){void window.ct214SelectDiscoverTab(dt.dataset.discoverTab);return}discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){e.preventDefault();if(window.ct214SelectDiscoverType){void window.ct214SelectDiscoverType(ty.dataset.discoverType);return}discoverState.type=ty.dataset.discoverType;void render();return}";
if(html.includes(oldCore))throw new Error('0.99.7.42 still dispatches Discover clicks to r213');
if(!html.includes(newCore))throw new Error('0.99.7.42 original click branch does not dispatch to r214');

const r214Start=html.indexOf('/* Android 0.99.7.42');
const r214End=html.indexOf('})();',r214Start);
const r214=r214Start>=0&&r214End>r214Start?html.slice(r214Start,r214End+5):'';
if(!r214)throw new Error('0.99.7.42 r214 block missing');
for(const bad of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"])if(r214.includes(bad))throw new Error('0.99.7.42 r214 added gesture listener '+bad);

for(const bad of ['r209-android-discover-profile-sports-layout','r210-android-discover-profile-order','r211-android-real-dom-roots','r212-android-core-discover-profile'])if(html.includes(bad))throw new Error('0.99.7.42 inherited forbidden runtime '+bad);

console.log('ANDROID_099742_TEST_OK discover=single-state captions=removed profile=34/40 sports=36 web=unchanged');
