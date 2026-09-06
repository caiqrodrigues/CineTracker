import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const html=await readFile(resolve(process.cwd(),'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
for(const x of ['name="ct-official-version" content="1.0.1"','name="ct-android-v1001" content="r243-plus-rewatch-sports-validated"',"window.__ctAndroidRelease='1.0.1'",'persistent-2x-3x-4x-no-disable','ct171RewatchMovie=async function','ct171RewatchEpisode=async function','remove-status-statistics-summary-card','cleanSports221','watchlist-swap-uses-active-ct186-selected-pool','native-webview-horizontal-no-manual-touch'])if(!html.includes(x))throw new Error('Android 1.0.1 missing '+x);
if(html.includes('CineTracker • v1.0.0 • ${REVISION}'))throw new Error('old visible 1.0.0 leaked');
console.log('ANDROID_1_0_1_TEST_OK rewatch=movie+episode sports=summary-removed base-r243=preserved');
