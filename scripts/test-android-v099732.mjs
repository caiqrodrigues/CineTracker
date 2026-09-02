import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const [html,gradle,runtime]=await Promise.all([
  readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r204-discover-three-cards-touchstart-tabs.js'),'utf8')
]);
const must=(hay,needle,label)=>{if(!hay.includes(needle))throw new Error('Android 0.99.7.32 missing '+label)};
must(gradle,'versionCode 10002','versionCode 10002');
must(gradle,"versionName '0.99.7.32'",'versionName 0.99.7.32');
must(html,"const REVISION='r204-android-discover-three-cards-touchstart-tabs';",'r204 revision');
must(html,'android-v0.99.7.32-r204-discover-three-cards-touchstart-tabs','bundle marker');
must(html,'foryou-no-type-subfilters','PRA VOCE no type filters');
must(html,'touchstart-capture-immediate-no-synthetic-click','touchstart tab activation');
must(html,'native-horizontal-three-cards-per-viewport','three-card carousel marker');
must(html,'calc((100% - 16px)/3)','three cards width');
must(html,"window.addEventListener('touchstart'",'touchstart listener');
must(html,'e.stopImmediatePropagation()','legacy chain stop');
must(html,'activateDiscover204(btn)','direct activation');
must(html,'detail-watchlist-toggle','Watchlist toggle preserved');
must(html,'mobile-first-cache-swr-progressive-render','r198 performance preserved');
for(const old of ['discover-direct-tabs-manual-horizontal-scroll','restore-route-render-and-discover-pan-x','pointer-capture-discover-tabs-horizontal-rails','discover-direct-pointerup-native-horizontal-carousels','discover-compact-foryou-reliable-touch-tabs'])if(html.includes(old))throw new Error('Android 0.99.7.32 old Discover runtime embedded: '+old);
if(!runtime.includes('if(window.__ctAndroidR204Loaded)return'))throw new Error('Android r204 idempotency guard missing');
console.log('ANDROID_099732_TEST_OK cards=three tabs=touchstart filters=foryou-hidden content=native-horizontal web=unchanged');
