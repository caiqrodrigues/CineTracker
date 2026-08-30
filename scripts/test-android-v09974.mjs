import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Android 0.99.7.4 test: '+msg)};
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const java=await readFile(resolve(root,'apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
const layout=await readFile(resolve(root,'apps/android/app/src/main/res/layout/activity_main.xml'),'utf8');

must(gradle.includes('versionCode 9974'),'versionCode 9974 missing');
must(gradle.includes("versionName '0.99.7.4'"),'versionName 0.99.7.4 missing');

for(const id of ['nav_home','nav_discover','nav_sports','nav_history','nav_profile','nav_settings'])
  must(layout.includes(`android:id="@+id/${id}"`),`native nav id ${id} missing`);
must(layout.includes('android:id="@+id/nav_sports"')&&layout.includes('android:text="🏆\\nEsportes"'),'Sports native button missing');
must(layout.includes('android:id="@+id/nav_history"')&&layout.includes('android:visibility="gone"'),'History must remain hidden');

must(java.includes('findViewById(R.id.nav_sports).setOnClickListener(v -> navigate("sports"));'),'native Sports binding missing');
must(java.includes("t==='sports'&&window.__ct152Sports&&window.__ct152Sports.open"),'native Sports dispatcher missing');
must(java.includes('protected void onResume()'),'MainActivity onResume missing');
must(java.includes("cinetracker:app-foreground"),'foreground revalidation event missing');

for(const marker of[
  "window.__ct0997R150Loaded",
  "window.__ct0997R150bLoaded",
  "window.__ct0997R151Loaded",
  "window.__ct0997R152Loaded",
  "window.__ct0997R152='r152-sports-hub-v1'",
  'ct-sports-sync',
  'cinetracker_sports_payload_v1',
  'cinetracker_sport_toggle_favorite_v1',
  'data-ct152-nav="sports"',
  'Hoje','Ao vivo','Calendário','Favoritos',
  'soccer','formula_1','mma','basketball','american_football','ice_hockey',
  'ct-android-cast-more','ct-android-actors-more','ct-android-action-grid',
  "window.__ctAndroidBundle='android-v0.99.7.4-r152-sports-hub'",
  "window.__ctAndroidBuild='0.99.7.4'"
])must(html.includes(marker),`embedded runtime missing ${marker}`);

must(!html.includes('<script src="/'),'root JS dependency survived Android inlining');
console.log('ANDROID_09974_TEST_OK version=0.99.7.4 sports=native-button r152=embedded realtime=preserved r151=preserved layout=existing+Sports');
