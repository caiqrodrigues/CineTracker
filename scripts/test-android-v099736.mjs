import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const marker='<script data-ct-android="r208-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('0.99.7.36 assembled r208 script missing');
const js=html.slice(a+marker.length,b);

const required=[
  "const REVISION='r208-android-discover-sports-cleanup';",
  "window.__ctAndroidR208='discover-stable-rail-minimal-sports-authoritative-profile-stats';",
  "window.__ctAndroidDiscoverTabs='fixed-position-no-auto-scroll-after-load';",
  "window.__ctAndroidSportsUI='single-minimal-item-search-no-date-no-summary';",
  "window.__ctAndroidProfileSports='cinetracker_sport_stats_v1-authority';",
  "ctR180ExposeActiveTab=function(){};",
  "document.querySelectorAll('.search-global').forEach(x=>x.remove());",
  "tools.querySelectorAll('[data-sports-date]').forEach(x=>x.remove());",
  "if(title==='Central esportiva'||panel.querySelector('.sports-summary'))panel.remove();",
  "root.querySelectorAll('[data-sports-time-banner],.sports-time-banner').forEach(x=>x.remove());",
  "rpc('cinetracker_sport_stats_v1',{})",
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters',
  'detail-watchlist-toggle',
  "window.__ctAndroidForegroundRender='disabled-no-render-suppression';"
];
for(const m of required)if(!js.includes(m))throw new Error('0.99.7.36 missing '+m);

const r208Start=js.indexOf('/* Android 0.99.7.36 — stable Discover rail');
const r208End=js.indexOf('\n})();',r208Start);
if(r208Start<0||r208End<r208Start)throw new Error('0.99.7.36 r208 runtime range missing');
const r208=js.slice(r208Start,r208End+6);
for(const forbidden of [
  "window.addEventListener('touchstart'",
  "window.addEventListener('touchend'",
  "window.addEventListener('pointerdown'",
  "window.addEventListener('pointerup'",
  'discover-native-tab-grid-direct-button-listeners'
])if(r208.includes(forbidden))throw new Error('0.99.7.36 r208 owns forbidden touch/grid path: '+forbidden);

if(!r208.includes("profileCache={...(profileCache||{}),sports_stats:stats}"))throw new Error('0.99.7.36 Sports stats authority not merged into Profile');
if(!r208.includes("grid-template-columns:18px minmax(0,1fr)!important"))throw new Error('0.99.7.36 Sports search is not single-column minimal layout');

console.log('ANDROID_099736_TEST_OK discover=fixed-rail sports=single-search-no-summary profile-sports=rpc-authority cards=3');
