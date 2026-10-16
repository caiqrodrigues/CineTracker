import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const file='apps/android/app/src/main/assets/hotfix5/index.html';
const html=await readFile(file,'utf8');
const marker='<script data-ct-android="r264-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.22 runtime missing');
const js=html.slice(a+marker.length,b);
for(const need of [
  'name="ct-official-version" content="1.0.22"',
  "const REVISION='r264-android-official-1.0.22';",
  'window.__ctAndroidOfficialCode=10064',
  "window.__ctR264AndroidV1022='auth+android-scroll+foryou-pools+native-preserved'",
  'window.__ctR243Fix=',
  'window.__ctR226V120=',
  "cinetracker_special_series_counts_v540",
  "cinetracker_f1_series_v512",
  "cinetracker_ufc_series_v518",
  "cinetracker_wwe_ppv_series_v519",
  "cinetracker_f1_watch_sync_v462",
  "cinetracker_recommendation_filter_v525",
  "cinetracker_activity_items_by_day_v518",
  "cinetracker_sports_team_recent_v525",
  "cinetracker_sports_league_latest_round_v520",
  "data-home-viewport",
  "const view=q263('[data-home-viewport=",
  "const v=q263('[data-home-viewport=",
  "if(!(await waitSession263()))return special263.current",
  "ct186Select(data)",
  "window.__ctAndroidV1022={version:'1.0.22'"
]){
  const source=need.startsWith('name="')?html:js;
  if(!source.includes(need))throw new Error('1.0.22 lacks '+need);
}
const patch=await readFile('apps/android/runtime-r264-v1022-integration.js','utf8');
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)', 'setInterval(', 'new MutationObserver'])if(patch.includes(banned))throw new Error('1.0.22 introduced prohibited code '+banned);
const coreChecks={
  oldNative:'window.__ctR243Fix',
  existingWatchlist:'watchlist-swap-uses-active-ct186-selected-pool',
  priorAuthority:'final-dom-authority-no-legacy-listeners',
  independentHomeScroll:'v.scrollTop=Math.max(0,main.offsetTop-hist.offsetTop)',
  currentPostAuth:'if(!(await waitSession263()))return special263.current',
  exactSpecialBuckets:".home-start",
  preservedNative:'native-import-export-navigation-notifications',
};
for(const [name,source] of Object.entries(coreChecks))if(!js.includes(source))throw new Error('1.0.22 regression in '+name);
console.log('ANDROID_1_0_22_VALIDATED sha256='+createHash('sha256').update(js).digest('hex'));
