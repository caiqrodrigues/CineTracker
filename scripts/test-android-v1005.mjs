import fs from 'node:fs';
const p='apps/android/app/src/main/assets/hotfix5/index.html';const s=fs.readFileSync(p,'utf8');
for(const x of ['name="ct-official-version" content="1.0.5"','<script data-ct-android="r247-android-js">',"const REVISION='r247-android-official-1.0.5';","window.__ctR209='v105-video-corrections'",'const CT105_ANDROID=true;','data-ct105-rewatch-movie','data-ct105-rewatch-episode','data-ct105-history-rewatch','ct104PaintF1=async function','--ct104-card-w','watchlist-swap-uses-active-ct186-selected-pool','native-webview-horizontal-no-manual-touch'])if(!s.includes(x))throw new Error('Android 1.0.5 missing '+x);
if(!s.includes("window.__ctAndroidOfficialCode=10047"))throw new Error('Android code missing');
console.log('ANDROID_1_0_5_RUNTIME_VALIDATED');
