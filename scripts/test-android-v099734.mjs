import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const marker='<script data-ct-android="r206-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('0.99.7.34 assembled r206 script missing');
const js=html.slice(a+marker.length,b);

const required=[
  "const REVISION='r206-android-discover-core-events';",
  "window.__ctAndroidR206='discover-core-events-three-cards';",
  "window.__ctAndroidDiscoverTabs='core-document-click-no-android-capture';",
  "window.__ctAndroidScope='discover-only-no-global-render-no-sports-profile-nav-overrides';",
  "window.__ctAndroidForegroundRender='discover-state-aware-foreground-throttle';",
  "const dt=e.target.closest('[data-discover-tab]');if(dt){discoverState.tab=dt.dataset.discoverTab;void render();return}",
  "const ty=e.target.closest('[data-discover-type]');if(ty){discoverState.type=ty.dataset.discoverType;void render();return}",
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters',
  'native-horizontal-three-cards-per-viewport',
  'detail-watchlist-toggle',
  'add-remove-alias-aware',
  'mobile-first-cache-swr-progressive-render'
];
for(const m of required)if(!js.includes(m))throw new Error('0.99.7.34 missing '+m);

const oldControllers=[
  'restore-route-render-and-discover-pan-x',
  'discover-direct-tabs-manual-horizontal-scroll',
  'pointer-capture-discover-tabs-horizontal-rails',
  'discover-direct-pointerup-native-horizontal-carousels',
  'discover-compact-foryou-reliable-touch-tabs',
  'discover-three-cards-touchstart-tabs',
  'discover-native-tab-grid-direct-button-listeners'
];
for(const m of oldControllers)if(js.includes(m))throw new Error('0.99.7.34 old Discover controller survived: '+m);

/* Inspect only r206 itself: it must not install a competing Android input controller or
   replace the global route renderer. */
const r206Start=js.indexOf('/* Android 0.99.7.34 — Discover uses');
const r206End=js.indexOf('\n})();',r206Start);
if(r206Start<0||r206End<r206Start)throw new Error('0.99.7.34 r206 runtime range missing');
const r206=js.slice(r206Start,r206End+6);
for(const forbidden of [
  "window.addEventListener('touchstart'",
  "window.addEventListener('touchend'",
  "window.addEventListener('pointerdown'",
  "window.addEventListener('pointerup'",
  "window.addEventListener('click'",
  'render=async function()'
])if(r206.includes(forbidden))throw new Error('0.99.7.34 r206 owns forbidden global input/render path: '+forbidden);

/* The r198 foreground optimization may still wrap render, but a Discover state change must
   always produce a different signature and therefore must not be swallowed. */
for(const m of [
  "if(r==='discover')return r+':'+String(discoverState?.tab||'foryou')+':'+String(discoverState?.type||'all');",
  'sig===lastRenderSigA26'
])if(!js.includes(m))throw new Error('0.99.7.34 state-aware foreground guard missing '+m);

console.log('ANDROID_099734_TEST_OK core-click=true android-capture=false cards=3 scope=discover-only');
