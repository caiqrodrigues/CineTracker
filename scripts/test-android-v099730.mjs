import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const [html,gradle,runtime]=await Promise.all([
  readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r202-discover-tabs-native-carousel.js'),'utf8')
]);
const must=(hay,needle,label)=>{if(!hay.includes(needle))throw new Error('Android 0.99.7.30 missing '+label)};

must(gradle,'versionCode 10000','versionCode 10000');
must(gradle,"versionName '0.99.7.30'",'versionName 0.99.7.30');
must(html,"const REVISION='r202-android-discover-tabs-native-carousel';",'r202 revision');
must(html,'android-v0.99.7.30-r202-discover-tabs-native-carousel','bundle marker');
must(html,"window.__ctAndroidR202='discover-direct-pointerup-native-horizontal-carousels';",'r202 marker');
must(html,"window.__ctAndroidDiscoverFilters='foryou-no-type-subfilters';",'PRA VOCE filter removal');
must(html,'root.querySelectorAll(\'.ct-r180-type-filters,.filters\').forEach(el=>el.remove())','PRA VOCE DOM filter removal');
must(html,"window.addEventListener('pointerup'",'direct pointerup tab activation');
must(html,'runDiscoverTab202','direct tab handler');
must(html,'discoverState.tab=next','direct tab state change');
must(html,'void Promise.resolve(renderDiscover(seq))','direct Discover render');
must(html,'[data-page="discover"] .foryou-grid','PRA VOCE horizontal grid');
must(html,'[data-page="discover"] .discover-carousel','generic Discover horizontal carousel');
must(html,'overflow-x:auto!important','native horizontal overflow');
must(html,'touch-action:auto!important','native WebView gesture');
must(html,'flex:0 0 min(76vw,300px)!important','PRA VOCE slot mobile width');
must(html,'flex:0 0 min(42vw,170px)!important','generic card mobile width');
must(html,'detail-watchlist-toggle','Watchlist toggle preserved');
must(html,'mobile-first-cache-swr-progressive-render','performance base preserved');
must(html,'embedded-apk-never-reloads-from-web-release-json','auth isolation preserved');
must(html,"window.__ctAndroidWebUntouched='true'",'Web untouched marker');

for(const old of ['restore-route-render-and-discover-pan-x','discover-direct-tabs-manual-horizontal-scroll','pointer-capture-discover-tabs-horizontal-rails']){
  if(html.includes(old))throw new Error('Android 0.99.7.30 contains old Discover gesture runtime: '+old);
}
if(!runtime.includes('if(window.__ctAndroidR202Loaded)return'))throw new Error('r202 idempotency guard missing');
if((html.match(/discover-direct-pointerup-native-horizontal-carousels/g)||[]).length!==1)throw new Error('r202 injected more than once');

console.log('ANDROID_099730_TEST_OK only-android foryou=no-type-filters tabs=direct-pointerup carousels=native-overflow-x old-gesture-runtimes=absent');
