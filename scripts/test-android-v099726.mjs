import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const [html,gradle,runtime]=await Promise.all([
  readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r198-mobile-performance.js'),'utf8')
]);
const must=(hay,needle,label)=>{if(!hay.includes(needle))throw new Error('Android 0.99.7.26 missing '+label)};
must(gradle,'versionCode 9996','versionCode 9996');
must(gradle,"versionName '0.99.7.26'",'versionName 0.99.7.26');
must(html,"const REVISION='r198-android-mobile-performance';",'r198 revision');
must(html,'android-v0.99.7.26-r198-mobile-performance','bundle marker');
must(html,'mobile-first-cache-swr-progressive-render','mobile-first marker');
must(html,'sequential-light-no-request-stampede','sequential preload');
must(html,'persistent-snapshot-tmdb-pages-capped-progressive-cards','discover performance');
must(html,'persistent-arena-progressive-events-fast-favorite-modal','sports performance');
must(html,'no-full-repaint-on-search-or-watched-toggle','interaction performance');
must(html,'Math.min(3,Math.max(1,Number(count)||3))','TMDB page cap');
must(html,"ct163WarmOnIdle=function(){if(!session)return;laterA26(()=>ct163PreloadAll(),2200)}",'delayed sequential preload');
must(html,"const snap=readA26(key,max);",'discover persistent snapshot');
must(html,"let arenaA26=readA26('arena',12*60*60*1000)",'sports persistent snapshot');
must(html,'sportsLimitA26=42','progressive sports limit');
must(html,"ct165OpenFavorite=async function(entityId)",'fast favorite event modal');
must(html,"ct170RenderSportsSearch(sportsCache||{})",'sports result-grid-only search');
must(html,"ct168SetWatchedButtons(eventId,next);",'optimistic sports watched state');
must(html,'window.__ctA26PersistSports?.()','optimistic sports snapshot');
must(html,'embedded-apk-never-reloads-from-web-release-json','0.99.7.25 auth isolation preserved');
must(html,'asian-scripted-tv-excluded-from-foryou','dorama exclusion preserved');

if(html.includes("ct170SportsSearch.loading=true;paintSports();ct170SportsSearch.timer"))throw new Error('Android 0.99.7.26 still repaints Sports on every search key');
if(html.includes("sportsCache=null;\n    const fresh=await sportsPayload(true).catch(()=>null);\n    if(fresh&&route()==='sports')paintSports(fresh);"))throw new Error('Android 0.99.7.26 still fully refreshes Sports after watched toggle');

const marker='<script data-ct-android="r198-android-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.26 r198 embedded JS missing');
const js=html.slice(a+marker.length,b);
if((js.match(/mobile-first-cache-swr-progressive-render/g)||[]).length!==1)throw new Error('Android 0.99.7.26 performance runtime injected more than once');
if(!runtime.includes("if(window.__ctAndroidR198Loaded)return"))throw new Error('Android 0.99.7.26 runtime idempotency guard missing');
console.log('ANDROID_099726_TEST_OK version=0.99.7.26 preload=sequential home=cache-first discover=cache+page-cap sports=cache+progressive search=no-repaint watched=optimistic');
