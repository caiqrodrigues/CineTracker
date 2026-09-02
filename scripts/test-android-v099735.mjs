import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const marker='<script data-ct-android="r207-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('0.99.7.35 assembled r207 script missing');
const js=html.slice(a+marker.length,b);

const required=[
  "const REVISION='r207-android-profile-sports-nav';",
  "window.__ctAndroidR207='profile-first-tap-shell-compact-sports-tools';",
  "window.__ctAndroidProfileNav='immediate-shell-then-existing-cache-first-loader';",
  "window.__ctAndroidSportsTools='compact-mobile-search-panel';",
  "window.__ctAndroidPreload='profile-first-before-sports';",
  "window.__ctAndroidForegroundRender='disabled-no-render-suppression';",
  "window.__ctAndroidDiscoverTabs='core-document-click-no-android-capture';",
  "window.__ctAndroidR206='discover-core-events-three-cards';",
  'calc((100% - 16px)/3)',
  'foryou-no-type-subfilters',
  'detail-watchlist-toggle',
  'add-remove-alias-aware',
  '[data-page="sports"] [data-sports-search]{height:30px!important',
  "setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile'"
];
for(const m of required)if(!js.includes(m))throw new Error('0.99.7.35 missing '+m);

for(const forbidden of [
  'discover-state-aware-foreground-throttle',
  'restore-route-render-and-discover-pan-x',
  'discover-direct-tabs-manual-horizontal-scroll',
  'pointer-capture-discover-tabs-horizontal-rails',
  'discover-direct-pointerup-native-horizontal-carousels',
  'discover-compact-foryou-reliable-touch-tabs',
  'discover-three-cards-touchstart-tabs',
  'discover-native-tab-grid-direct-button-listeners'
])if(js.includes(forbidden))throw new Error('0.99.7.35 forbidden marker survived: '+forbidden);

const r207Start=js.indexOf('/* Android 0.99.7.35 — profile first-tap shell');
const r207End=js.indexOf('\n})();',r207Start);
if(r207Start<0||r207End<r207Start)throw new Error('0.99.7.35 r207 runtime range missing');
const r207=js.slice(r207Start,r207End+6);
for(const forbidden of [
  "window.addEventListener('touchstart'",
  "window.addEventListener('touchend'",
  "window.addEventListener('pointerdown'",
  "window.addEventListener('pointerup'",
  "window.addEventListener('click'"
])if(r207.includes(forbidden))throw new Error('0.99.7.35 r207 owns forbidden global input path: '+forbidden);

const p=js.indexOf("rpc('cinetracker_profile_quick_stats_v1',{})");
const s=js.indexOf('await sportsPayload(false)',p);
if(p<0||s<p)throw new Error('0.99.7.35 profile-first preload order not assembled');

console.log('ANDROID_099735_TEST_OK nav=unsuppressed profile=first-paint+preload-first sports=compact discover=r206-preserved');
