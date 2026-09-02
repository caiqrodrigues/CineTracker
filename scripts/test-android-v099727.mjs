import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const [html,gradle,runtime]=await Promise.all([
  readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r199-discover-touch-fix.js'),'utf8')
]);
const must=(hay,needle,label)=>{if(!hay.includes(needle))throw new Error('Android 0.99.7.27 missing '+label)};
must(gradle,'versionCode 9997','versionCode 9997');
must(gradle,"versionName '0.99.7.27'",'versionName 0.99.7.27');
must(html,"const REVISION='r199-android-discover-touch-fix';",'r199 revision');
must(html,'android-v0.99.7.27-r199-discover-touch-fix','bundle marker');
must(html,'restore-route-render-and-discover-pan-x','r199 marker');
must(html,'navigation-never-throttled','navigation-first render');
must(html,'subtabs-clickable-horizontal-native-pan','Discover touch policy');
must(html,"if(r==='discover')return renderDiscover(seq);",'canonical Discover dispatcher');
must(html,'touch-action:pan-x!important;scroll-snap-type:none!important;scroll-behavior:auto!important','horizontal rail CSS');
must(html,"[data-page=\"discover\"] .tabs>[data-discover-tab]",'Discover tab touch override');
must(html,"document.addEventListener('pointerdown'",'instant tab feedback');
must(html,'mobile-first-cache-swr-progressive-render','r198 performance preserved');
must(html,'embedded-apk-never-reloads-from-web-release-json','auth isolation preserved');
must(html,'asian-scripted-tv-excluded-from-foryou','dorama exclusion preserved');

const marker='<script data-ct-android="r199-android-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.27 r199 embedded JS missing');
const js=html.slice(a+marker.length,b);
if((js.match(/restore-route-render-and-discover-pan-x/g)||[]).length!==1)throw new Error('Android 0.99.7.27 r199 injected more than once');
if(js.indexOf('mobile-first-cache-swr-progressive-render')>js.indexOf('restore-route-render-and-discover-pan-x'))throw new Error('Android 0.99.7.27 r199 must override r198 after performance layer');
if(!runtime.includes('render=async function()'))throw new Error('Android 0.99.7.27 direct render restoration missing');
console.log('ANDROID_099727_TEST_OK version=0.99.7.27 tabs=clickable horizontal=pan-x render=navigation-first performance=r198-preserved');
