import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
await import('./prepare-android-v0997.mjs');

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
html=html
  .replaceAll('android-v0.99.7.2-ui-polish-r3','android-v0.99.7.3-r150-realtime')
  .replaceAll("window.__ctAndroidBuild='0.99.7.2'","window.__ctAndroidBuild='0.99.7.3'")
  .replaceAll('v09972-android-ui-polish-r3','v09973-r150-realtime-sync');
await writeFile(indexPath,html,'utf8');

for(const marker of[
  "window.__ct0997R150Loaded",
  "window.__ct0997R150bLoaded",
  "window.__ct0997R150b='r150b-realtime-sync'",
  'cinetracker_calendar_watchlist_v0997',
  "cinetracker:app-foreground",
  "event==='postgres_changes'"
])if(!html.includes(marker))throw new Error(`Android 0.99.7.3: embedded runtime missing ${marker}`);

if(!html.includes("window.__ctAndroidBundle='android-v0.99.7.3-r150-realtime'"))throw new Error('Android 0.99.7.3: bundle marker missing');
console.log('ANDROID_09973_PREPARED r150=calendar r150b=realtime native=foreground');
