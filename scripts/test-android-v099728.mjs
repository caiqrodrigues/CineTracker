import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const [html,gradle,runtime,watchlist]=await Promise.all([
  readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r200-discover-gesture-watchlist.js'),'utf8'),
  readFile(resolve(root,'apps/web/runtime-r196-web.js'),'utf8')
]);
const must=(hay,needle,label)=>{if(!hay.includes(needle))throw new Error('Android 0.99.7.28 missing '+label)};

must(gradle,'versionCode 9998','versionCode 9998');
must(gradle,"versionName '0.99.7.28'",'versionName 0.99.7.28');
must(html,"const REVISION='r200-android-discover-gesture-watchlist';",'r200 revision');
must(html,'android-v0.99.7.28-r200-discover-gesture-watchlist','bundle marker');
must(html,'discover-direct-tabs-manual-horizontal-scroll','Discover direct tabs');
must(html,'window-capture-direct-renderDiscover','window capture routing');
must(html,'touch-scrollLeft-horizontal-dominance','manual horizontal engine');
must(html,"window.addEventListener('click'",'window click capture');
must(html,'discoverState.tab=next','direct Discover tab state');
must(html,'void Promise.resolve(renderDiscover(seq))','direct renderDiscover');
must(html,'g.rail.scrollLeft=g.left-dx','manual horizontal scrollLeft');
must(html,"document.addEventListener('touchmove'",'touchmove listener');
must(html,'passive:false','cancelable horizontal move');
must(html,'touch-action:pan-y!important','vertical/native gesture contract');

must(html,"window.__ctR196Web='detail-watchlist-toggle';",'shared r196 Watchlist toggle');
must(html,'add-remove-alias-aware','alias-aware Watchlist toggle');
must(html,'state=in.(AddedToWatchlist,WatchLater)','Watchlist state pair');
must(html,"{method:'DELETE'}",'Watchlist DELETE');
must(html,'matched_media_ids','alias/import matched media removal');
must(html,"toast('Removido da Watchlist.')",'Watchlist removal feedback');
must(html,"b.disabled=false",'checked Watchlist remains clickable');
must(html,"title=on?'Remover da Watchlist':'Adicionar à Watchlist'",'Watchlist action hint');

must(html,'navigation-never-throttled','r199 navigation preservation');
must(html,'mobile-first-cache-swr-progressive-render','r198 performance preservation');
must(html,'embedded-apk-never-reloads-from-web-release-json','auth isolation preservation');
must(html,'asian-scripted-tv-excluded-from-foryou','dorama exclusion preservation');

if((html.match(/discover-direct-tabs-manual-horizontal-scroll/g)||[]).length!==1)throw new Error('Android 0.99.7.28 r200 injected more than once');
if((html.match(/detail-watchlist-toggle/g)||[]).length!==1)throw new Error('Android 0.99.7.28 shared Watchlist patch injected more than once');
if(!runtime.includes("if(window.__ctAndroidR200Loaded)return"))throw new Error('Android r200 idempotency guard missing');
if(!watchlist.includes("if(window.__ctR196WebLoaded)return"))throw new Error('Shared r196 idempotency guard missing');

console.log('ANDROID_099728_TEST_OK tabs=direct-window-capture horizontal=manual-scrollLeft watchlist=add-remove-alias-aware performance=r198 auth=r197');
