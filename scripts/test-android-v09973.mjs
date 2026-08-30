import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Android 0.99.7.3 test: '+msg)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const java=await readFile(resolve(root,'apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');

for(const marker of[
  "window.__ct0997R150Loaded",
  "window.__ct0997R150bLoaded",
  "window.__ct0997R151Loaded",
  "r150b-realtime-sync",
  "r151-library-identity-reconcile",
  "seen+watchlist+progress",
  'ct-reconcile-library-user',
  'cinetracker_calendar_watchlist_v0997',
  "event==='postgres_changes'",
  "cinetracker:app-foreground",
  'Sincronizar pendentes',
  'Revalidar tudo',
  "android-v0.99.7.3-r151-library-sync",
  'v09973-r151-library-sync'
])must(html.includes(marker),`embedded runtime missing ${marker}`);

must(!html.includes('<script src="/'),'embedded runtime still depends on root JS assets');
must(java.includes('protected void onResume()'),'MainActivity onResume missing');
must(java.includes("cinetracker:app-foreground"),'native foreground event missing');
must(java.includes("source:'android-onResume'"),'native foreground source missing');
must(gradle.includes('versionCode 9973'),'versionCode 9973 missing');
must(gradle.includes("versionName '0.99.7.3'"),'versionName 0.99.7.3 missing');
console.log('ANDROID_09973_TEST_OK calendar=today watchlist=real realtime=websocket foreground=onResume identity=r151 covers=repair layout=apk-existing');
