import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
for(const expected of [
  'name="ct-official-version" content="1.0.0"',
  'name="ct-android-v1000" content="r243-watchlist-renderer-pool-user-validated"',
  "window.__ctWebBuild='1.0.0';window.__ctOfficialVersion='1.0.0';window.__ctAndroidOfficialVersion='1.0.0';",
  'CineTracker • v1.0.0 • ${REVISION}',
  "window.__ctAndroidRelease='1.0.0'",
  "window.__ctAndroidReleaseBase='0.99.7.71-r243-user-validated'",
  'watchlist-swap-uses-active-ct186-selected-pool',
  'const selected237=ct186Select(ct186ForYouData);',
  'selected237?.wmPool','selected237?.wsPool','selected237?.waPool',
  'native-webview-horizontal-no-manual-touch',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person'
])if(!html.includes(expected))throw new Error('Android 1.0.0 missing '+expected);
if(html.includes('CineTracker • v0.99.7 • ${REVISION}'))throw new Error('old visible version still active');
for(const rejected of ['android-v0.99.7.66-r238-watchlist-swap-only','android-v0.99.7.67-r239-watchlist-direct-dashboard','android-v0.99.7.68-r240-watchlist-hit-route'])
  if(html.includes(rejected))throw new Error('rejected Watchlist experiment leaked '+rejected);
console.log('ANDROID_1_0_0_TEST_OK base=.71 watchlist=validated top10=native visible-version=1.0.0');
