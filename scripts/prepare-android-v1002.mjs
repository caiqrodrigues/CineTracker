import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
execFileSync(process.execPath,['scripts/prepare-android-v1001.mjs'],{stdio:'inherit'});
const file='apps/android/app/src/main/assets/hotfix5/index.html';
let html=fs.readFileSync(file,'utf8');
let patch=fs.readFileSync('apps/web/runtime-r206-f1-rewatch-fix.js','utf8');
patch=patch.replace("window.__ctR206='f1-hub-rewatch-functional-sports-cleanup'","window.__ctR244='f1-hub-rewatch-functional-sports-cleanup-android'");
const must=[
  "window.__ctR244='f1-hub-rewatch-functional-sports-cleanup-android'",
  "cinetracker_mark_watch_v0994",
  "[data-ct171-rewatch-media],[data-ct171-rewatch-episode],[data-rewatch-episode]",
  "https://api.jolpi.ca/ergast/f1",
  "current/driverstandings",
  "current/constructorstandings",
  "current/last/results",
  "current/last/qualifying",
  "remove-status-statistics-summary-card-runtime"
];
for(const x of must) if(!patch.includes(x)) throw new Error(`Android 1.0.2 patch missing: ${x}`);
const injection=`\n<script>\n${patch}\nwindow.__ctAndroidOfficialVersion='1.0.2';window.__ctAndroidOfficialCode=10044;window.__ctAndroidRelease102='functional-rewatch-plus-f1-sports-hub';\n</script>\n`;
if(!html.includes('</body>')) throw new Error('Android embedded HTML has no closing body');
html=html.replace('</body>',`${injection}</body>`)
  .replace(/name="ct-official-version" content="1\.0\.1"/g,'name="ct-official-version" content="1.0.2"')
  .replace(/1\.0\.1 \/ versionCode 10043/g,'1.0.2 / versionCode 10044')
  .replace(/rewatch-movie-episode-plus-sports-summary-removal-web-android/g,'functional-rewatch-plus-f1-sports-hub-web-android');
for(const x of must) if(!html.includes(x)) throw new Error(`Final Android runtime missing: ${x}`);
for(const x of ['watchlist-swap-uses-active-ct186-selected-pool','native-webview-horizontal-no-manual-touch']) if(!html.includes(x)) throw new Error(`Preservation regression: ${x}`);
fs.writeFileSync(file,html);
console.log('Android 1.0.2 runtime injected after validated base and asserted.');