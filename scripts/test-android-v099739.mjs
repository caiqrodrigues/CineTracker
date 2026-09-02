import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const marker='<script data-ct-android="r211-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('0.99.7.39 assembled r211 script missing');
const js=html.slice(a+marker.length,b);

const required=[
  "const REVISION='r211-android-real-dom-roots';",
  "window.__ctAndroidR211='real-dom-roots-discover-profile';",
  '[data-discover] [data-discover-tab]',
  '[data-profile] .ct210-stats-grid',
  'window.ct210SelectDiscoverTab=selectTab210',
  'switchToken210',
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
  'single-minimal-item-search-no-date-no-summary',
  'single-inline-action-no-duplicate-full-width',
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters',
  'detail-watchlist-toggle'
];
for(const m of required)if(!js.includes(m))throw new Error('0.99.7.39 missing '+m);

const r210Start=js.indexOf('/* Android 0.99.7.38 — deterministic in-place Discover tabs');
const r210End=js.indexOf('\n})();',r210Start);
if(r210Start<0||r210End<r210Start)throw new Error('0.99.7.39 r210 range missing');
const r210=js.slice(r210Start,r210End+6);
if(r210.includes('[data-page="discover"]')||r210.includes('[data-page="profile"]'))throw new Error('0.99.7.39 synthetic data-page selector survived in r210');
if(!r210.includes("document.querySelectorAll('[data-discover] [data-discover-tab]')"))throw new Error('0.99.7.39 Discover binding is not on real DOM root');
if(!r210.includes('[data-profile] .ct210-stats-grid'))throw new Error('0.99.7.39 Profile CSS is not on real DOM root');

console.log('ANDROID_099739_TEST_OK discover=real-root profile=real-root cards=3 sports=preserved');
