import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const [html,activity,gradle]=await Promise.all([
  readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8'),
  readFile(resolve(root,'apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java'),'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8')
]);
const must=(hay,needle,label)=>{if(!hay.includes(needle))throw new Error('Android 0.99.7.25 missing '+label)};
must(gradle,'versionCode 9995','versionCode 9995');
must(gradle,"versionName '0.99.7.25'",'versionName 0.99.7.25');
must(html,"const REVISION='r197-android-auth-runtime-isolation';",'r197 revision');
must(html,'android-v0.99.7.25-r197-auth-runtime-isolation','bundle marker');
must(html,'disable-web-release-refresh-and-service-worker','auth isolation marker');
must(html,'embedded-apk-never-reloads-from-web-release-json','release policy');
must(html,'unregister-web-service-workers','service worker policy');
must(html,'releaseMismatch161=true;','release mismatch short circuit');
must(html,'checkRelease161=async function(){return false};','release checker disabled');
must(html,"window.CineTrackerNative?.saveSession?.(JSON.stringify(s))",'native session bridge');
must(html,'auth-success-mount-home-shell-before-fast-paint','0.99.7.24 Home shell preservation');
must(html,'r190-r195-mobile-equivalents','r190-r195 parity preserved');
must(html,'asian-scripted-tv-excluded-from-foryou','dorama filter preserved');
must(html,'ct-sports-sync-v4+ct-sports-search-v2','sports backend preserved');

const marker='<script data-ct-android="r197-android-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.25 r197 embedded JS missing');
const js=html.slice(a+marker.length,b);
if((js.match(/embedded-apk-never-reloads-from-web-release-json/g)||[]).length!==1)throw new Error('Android 0.99.7.25 auth isolation injected more than once');

must(activity,'final String routePath = JSONObject.quote(path);','native route quoting');
must(activity,"history.replaceState({},'',",'native in-place route');
const hostStart=activity.indexOf('if (host.equals("mycinetracker.vercel.app"))');
const hostEnd=hostStart<0?-1:activity.indexOf('if (host.endsWith("supabase.co"))',hostStart);
if(hostStart<0||hostEnd<0)throw new Error('Android 0.99.7.25 native same-host block missing');
const hostBlock=activity.slice(hostStart,hostEnd);
if(hostBlock.includes('loadBundledWeb();'))throw new Error('Android 0.99.7.25 still reloads bundled Web on same-host navigation');

console.log('ANDROID_099725_TEST_OK identity=0.99.7.25 release-check=disabled service-worker=isolated native-route=in-place login=no-web-reload');
