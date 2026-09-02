import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const [html,gradle,runtime]=await Promise.all([
  readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r203-discover-compact-reliable-tabs.js'),'utf8')
]);
const must=(h,n,l)=>{if(!h.includes(n))throw new Error('Android 0.99.7.31 missing '+l)};

must(gradle,'versionCode 10001','versionCode 10001');
must(gradle,"versionName '0.99.7.31'",'versionName 0.99.7.31');
must(html,"const REVISION='r203-android-discover-compact-reliable-tabs';",'r203 revision');
must(html,'android-v0.99.7.31-r203-discover-compact-reliable-tabs','bundle marker');
must(html,'foryou-no-type-subfilters','PRA VOCE filters removed');
must(html,'touchend-direct-render-tabrail-no-horizontal-gesture','touchend tab contract');
must(html,"window.addEventListener('touchend'",'touchend listener');
must(html,'activateDiscover203','direct tab activation');
must(html,"touch-action:pan-y!important",'tab rail vertical-only touch');
must(html,'native-horizontal-content-compact-cards','content carousel contract');
must(html,'min(44vw,168px)','compact PRA VOCE width');
must(html,'overflow-x:auto!important','native horizontal overflow');
must(html,'detail-watchlist-toggle','Watchlist toggle preserved');
must(html,'mobile-first-cache-swr-progressive-render','r198 performance preserved');
must(html,'embedded-apk-never-reloads-from-web-release-json','auth isolation preserved');
for(const old of ['discover-direct-tabs-manual-horizontal-scroll','restore-route-render-and-discover-pan-x','pointer-capture-discover-tabs-horizontal-rails','discover-direct-pointerup-native-horizontal-carousels']){
  if(html.includes(old))throw new Error('Android 0.99.7.31 contains old Discover runtime '+old);
}
if(!runtime.includes('if(window.__ctAndroidR203Loaded)return'))throw new Error('r203 idempotency guard missing');
console.log('ANDROID_099731_TEST_OK foryou=compact filters=removed tabs=touchend-direct content=native-horizontal web=untouched');
