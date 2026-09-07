import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
execFileSync(process.execPath,['scripts/prepare-android-v1002.mjs'],{stdio:'inherit'});
const file='apps/android/app/src/main/assets/hotfix5/index.html';
let html=fs.readFileSync(file,'utf8');
let patch=fs.readFileSync('apps/web/runtime-r207-v103.js','utf8');
patch=patch.replace("window.__ctR207='v103-rewatch-navigation-recommendations-f1'","window.__ctR245='v103-rewatch-navigation-recommendations-f1-android'");
const must=["window.__ctR245='v103-rewatch-navigation-recommendations-f1-android'",'p_media_id:x.mediaId','p_item_type:x.itemType','p_season_number:x.itemType',"cinetracker_recommendation_memory_v101","cinetracker_recommendation_record_v101","instant-global-nav-closes-details","current/last/pitstops","current/last/laps","Sprint Shootout"];
for(const x of must) if(!patch.includes(x)) throw new Error(`Android 1.0.3 patch missing: ${x}`);
const injection=`\n<script>\n${patch}\nwindow.__ctAndroidOfficialVersion='1.0.3';window.__ctAndroidOfficialCode=10045;window.__ctAndroidRelease103='rewatch-navigation-recommendation-memory-f1-advanced';\n</script>\n`;
if(!html.includes('</body>')) throw new Error('Android embedded HTML has no closing body');
html=html.replace('</body>',`${injection}</body>`)
 .replace(/name="ct-official-version" content="1\.0\.2"/g,'name="ct-official-version" content="1.0.3"')
 .replace(/1\.0\.2 \/ versionCode 10044/g,'1.0.3 / versionCode 10045')
 .replace(/functional-rewatch-plus-f1-sports-hub-web-android/g,'rewatch-navigation-recommendation-memory-f1-advanced-web-android');
for(const x of must) if(!html.includes(x)) throw new Error(`Final Android 1.0.3 runtime missing: ${x}`);
for(const x of ['watchlist-swap-uses-active-ct186-selected-pool','native-webview-horizontal-no-manual-touch']) if(!html.includes(x)) throw new Error(`Preservation regression: ${x}`);
fs.writeFileSync(file,html);
console.log('Android 1.0.3 runtime injected and asserted.');