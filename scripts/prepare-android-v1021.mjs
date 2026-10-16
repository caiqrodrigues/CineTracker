import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {inflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1020.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r262-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.21 requires exact r262/1.0.20 prepared base');
let js=html.slice(a+marker.length,b);

for(const must of [
  "const REVISION='r262-android-official-1.0.20';",
  "window.__ctAndroidOfficialCode=10062",
  "window.__ctR243Fix='watchlist-swap-uses-active-ct186-selected-pool'",
  "window.__ctR217Consolidated='v111-r204-r243-single-release-authority'",
  "window.__ctR218V112='foryou-strict-f1-cors-profile-three-cards'",
  "window.__ctR219V113='persistent-foryou-memory-f1-collapse-grid'",
  "window.__ctR220V114='watchlist-enrichment-inplace-add-stats-unified-icons'",
  "window.__ctR221V115='watchlist-own-contract-f1-complete-sessions'",
  "window.__ctR222V116='final-dom-watchlist-direct-rpc-f1-favorite-modal'",
  "window.__ctR223V117='profile-watchlist-drilldown-sports-organized-ui'",
  "window.__ctR224V118='foryou-affinity-profile-watchlist-render-authority'",
  "window.__ctR225V119='watchlist-authoritative-sort-details-sports-controls'",
  "window.__ctR226V120='final-dom-authority-no-legacy-listeners'",
  "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';"
])if(!js.includes(must))throw new Error('Android 1.0.21 lost validated 1.0.20 prerequisite '+must);

const packed=await readFile(resolve(root,'apps/android/runtime-r263-v1021-web-sync.js.gz'));
// Ignore the damaged gzip trailer; validate the exact decompressed bytes using SHA-256 below.
const patch=inflateRawSync(packed.subarray(10,-8)).toString('utf8');
const digest=createHash('sha256').update(patch).digest('hex');
if(digest!=='5952547a846c5011c154c7c66d2882c1511c5505c040ace08dd37c930fc81c49')throw new Error('Android 1.0.21 runtime payload hash mismatch '+digest);
for(const must of [
  "window.__ctR263AndroidV1021='web-r541-parity+android-r262-preserved'",
  "window.__ctAndroidWebFreeze='43f5f0c5d87802fac80365c62388276c0b2d7255:r541-official-0.3.68'",
  'cinetracker_special_series_counts_v540',
  'cinetracker_recommendation_filter_v525',
  'cinetracker_activity_items_by_day_v518',
  'cinetracker_sports_team_recent_v525',
  'cinetracker_f1_watch_sync_v462'
])if(!patch.includes(must))throw new Error('Android 1.0.21 parity patch missing '+must);
for(const forbidden of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(patch.includes(forbidden))throw new Error('Android 1.0.21 parity patch contains forbidden construct '+forbidden);
if(!js.includes('\nboot();'))throw new Error('Android 1.0.21 boot point missing');

const once=(source,from,to,label)=>{const n=source.split(from).length-1;if(n!==1)throw new Error(`Android 1.0.21 expected one ${label}, found ${n}`);return source.replace(from,to)};
js=once(js,"const REVISION='r262-android-official-1.0.20';","const REVISION='r263-android-official-1.0.21';",'revision');
js=once(js,"window.__ctWebBuild='1.0.20';window.__ctOfficialVersion='1.0.20';window.__ctAndroidOfficialVersion='1.0.20';window.__ctAndroidOfficialCode=10062;","window.__ctWebBuild='1.0.21';window.__ctOfficialVersion='1.0.21';window.__ctAndroidOfficialVersion='1.0.21';window.__ctAndroidOfficialCode=10063;",'identity');
js=js.replaceAll('CineTracker • v1.0.20','CineTracker • v1.0.21')
     .replaceAll("JSON.stringify({version:'1.0.20',revision:REVISION","JSON.stringify({version:'1.0.21',revision:REVISION")
     .replaceAll("window.__ctAndroidRelease='1.0.20'","window.__ctAndroidRelease='1.0.21'");
js=js.replace('\nboot();','\n'+patch+'\nboot();');

html=html.slice(0,a)+`<script data-ct-android="r263-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1020','ct-android-v1021')
         .replaceAll('content="1.0.20"','content="1.0.21"')
         .replaceAll('r262-r261-plus-r226','r263-r262-plus-web-r541-parity');

for(const must of [
  "const REVISION='r263-android-official-1.0.21';",
  "window.__ctAndroidOfficialCode=10063",
  "window.__ctR263AndroidV1021='web-r541-parity+android-r262-preserved'",
  "window.__ctR226V120='final-dom-authority-no-legacy-listeners'",
  "window.__ctR243Fix='watchlist-swap-uses-active-ct186-selected-pool'",
  'cinetracker_special_series_counts_v540',
  'cinetracker_recommendation_filter_v525',
  'cinetracker_activity_items_by_day_v518',
  'cinetracker_sports_team_recent_v525'
])if(!html.includes(must))throw new Error('Android 1.0.21 final runtime missing '+must);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_1_0_21_READY base=r262 web-freeze=r541 parity=home+special+discover+top10+profile+history+sports native=unchanged');
