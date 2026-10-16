import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';

const p='apps/android/app/src/main/assets/hotfix5/index.html';
const html=await readFile(p,'utf8');
for(const must of [
  'name="ct-official-version" content="1.0.21"',
  '<script data-ct-android="r263-android-js">',
  "const REVISION='r263-android-official-1.0.21';",
  "window.__ctAndroidOfficialCode=10063",
  "window.__ctR243Fix='watchlist-swap-uses-active-ct186-selected-pool'",
  "window.__ctR217Consolidated='v111-r204-r243-single-release-authority'",
  "window.__ctR226V120='final-dom-authority-no-legacy-listeners'",
  "window.__ctR263AndroidV1021='web-r541-parity+android-r262-preserved'",
  "window.__ctAndroidWebFreeze='43f5f0c5d87802fac80365c62388276c0b2d7255:r541-official-0.3.68'",
  'cinetracker_special_series_counts_v540',
  'cinetracker_f1_series_v512',
  'cinetracker_ufc_series_v518',
  'cinetracker_wwe_ppv_series_v519',
  'cinetracker_f1_watch_sync_v462',
  'cinetracker_recommendation_filter_v525',
  'cinetracker_activity_items_by_day_v518',
  'cinetracker_unmark_history_item_v426',
  'cinetracker_sports_team_recent_v525',
  'cinetracker_sports_league_latest_round_v520',
  'data-ct263-profile-more',
  'data-ct263-special',
  'ct263:top10:'
])if(!html.includes(must))throw new Error('Android 1.0.21 missing '+must);

const packed=await readFile('apps/android/runtime-r263-v1021-web-sync.js.gz');
const runtime=gunzipSync(packed).toString('utf8');
const digest=createHash('sha256').update(runtime).digest('hex');
if(digest!=='5952547a846c5011c154c7c66d2882c1511c5505c040ace08dd37c930fc81c49')throw new Error('Android 1.0.21 runtime payload hash mismatch '+digest);
for(const forbidden of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(runtime.includes(forbidden))throw new Error('Android 1.0.21 forbidden construct '+forbidden);
for(const preserved of [
 'watchlist-swap-uses-active-ct186-selected-pool',
 'native-webview-horizontal-no-manual-touch',
 'final-dom-authority-no-legacy-listeners',
 'profile-watchlist-drilldown-sports-organized-ui'
])if(!html.includes(preserved))throw new Error('Android 1.0.21 lost preserved Android behavior '+preserved);

console.log('ANDROID_1_0_21_VALIDATED web=r541-frozen android=r262-preserved parity=home+special+discover+top10+profile+history+sports');
