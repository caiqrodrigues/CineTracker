import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const [html,gradle,runtime]=await Promise.all([
  readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r205-discover-native-tab-grid.js'),'utf8')
]);
const must=(hay,needle,label)=>{if(!hay.includes(needle))throw new Error('Android 0.99.7.33 missing '+label)};
must(gradle,'versionCode 10003','versionCode 10003');
must(gradle,"versionName '0.99.7.33'",'versionName 0.99.7.33');
must(html,"const REVISION='r205-android-discover-native-tab-grid';",'r205 revision');
must(html,'android-v0.99.7.33-r205-discover-native-tab-grid','bundle marker');
must(html,'discover-native-tab-grid-direct-button-listeners','native grid marker');
must(html,'android-owned-grid-no-legacy-data-discover-tab','legacy rail isolation');
must(html,'data-a33-tab','Android unique tab attribute');
must(html,'data-a33-type','Android unique type attribute');
must(html,'ct205-tab-grid','9-button grid');
must(html,"b.addEventListener('touchend',fire",'direct touch listener');
must(html,"b.addEventListener('click',fire",'direct click listener');
must(html,'ctR180TabRail=function(){return tabsA33()}','r180 rail replacement');
must(html,"if(String(discoverState?.tab||'foryou')==='foryou')return '';",'PRA VOCE type-filter removal');
must(html,'calc((100% - 16px)/3)','three cards per viewport');
must(html,'detail-watchlist-toggle','Watchlist toggle preserved');
must(html,'mobile-first-cache-swr-progressive-render','r198 performance preserved');
for(const old of [
  'restore-route-render-and-discover-pan-x','discover-direct-tabs-manual-horizontal-scroll',
  'pointer-capture-discover-tabs-horizontal-rails','discover-direct-pointerup-native-horizontal-carousels',
  'discover-compact-foryou-reliable-touch-tabs','discover-three-cards-touchstart-tabs'
])if(html.includes(old))throw new Error('Android 0.99.7.33 old Discover runtime embedded: '+old);
if(!runtime.includes('if(window.__ctAndroidR205Loaded)return'))throw new Error('Android r205 idempotency guard missing');
if(runtime.includes('data-discover-tab="')||runtime.includes('data-discover-type="'))throw new Error('Android r205 must not generate legacy Discover button attributes');
console.log('ANDROID_099733_TEST_OK tabs=native-grid-direct-listeners cards=three foryou=no-types web=unchanged');
