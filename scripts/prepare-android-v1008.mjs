import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1007.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const oldMarker='<script data-ct-android="r249-android-js">';
const a=html.indexOf(oldMarker),b=a<0?-1:html.indexOf('</script>',a+oldMarker.length);
if(a<0||b<a)throw new Error('Android 1.0.8 requires validated r249/1.0.7 runtime');
let js=html.slice(a+oldMarker.length,b);
for(const required of [
  "const REVISION='r249-android-official-1.0.7';",
  "window.__ctR214='v107-ui-regression-hotfix'",
  "window.__ctAndroidHomeContinuity='background-refresh-no-passive-visible-repaint'",
  "window.__ctAndroidWarmPrimary='profile-foryou-top10-sports-sequential'",
  'cinetracker_mark_watch_v0994','ct-f1-v107','data-ct214-rewatch'
])if(!js.includes(required))throw new Error('Android 1.0.8 missing validated prerequisite '+required);
if(js.includes("if(seq===navSeq&&route()==='home')paintHome()"))throw new Error('Android 1.0.8 still contains passive Home repaint regression');

js=js
  .replaceAll('r249-android-official-1.0.7','r250-android-official-1.0.8')
  .replaceAll('CineTracker • v1.0.7','CineTracker • v1.0.8')
  .replaceAll("window.__ctOfficialVersion='1.0.7'","window.__ctOfficialVersion='1.0.8'")
  .replaceAll("window.__ctAndroidOfficialVersion='1.0.7'","window.__ctAndroidOfficialVersion='1.0.8'")
  .replaceAll('window.__ctAndroidOfficialCode=10049','window.__ctAndroidOfficialCode=10050')
  .replaceAll("window.__ctAndroidRelease='1.0.7'","window.__ctAndroidRelease='1.0.8'");

html=html.slice(0,a)+`<script data-ct-android="r250-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html
  .replaceAll('content="1.0.7"','content="1.0.8"')
  .replaceAll('ct-android-v1007','ct-android-v1008')
  .replaceAll('r249-behavior-authority-hotfix1','r250-video-continuity-stable-home');

for(const good of [
  "const REVISION='r250-android-official-1.0.8';",
  "window.__ctOfficialVersion='1.0.8'",
  "window.__ctAndroidOfficialVersion='1.0.8'",
  'window.__ctAndroidOfficialCode=10050',
  "window.__ctAndroidHomeContinuity='background-refresh-no-passive-visible-repaint'",
  "window.__ctAndroidWarmPrimary='profile-foryou-top10-sports-sequential'",
  "window.__ctR214='v107-ui-regression-hotfix'",
  'cinetracker_mark_watch_v0994','ct-f1-v107','data-ct214-rewatch'
])if(!html.includes(good))throw new Error('Android 1.0.8 final runtime missing '+good);
for(const bad of ['ct107:snapshot:','data-ct107-rewatch','cinetracker_mark_episode_v0994',"window.__ctR212='v107-direct-rewatch-authority'", "window.__ctR213='v107-sports-summary-authority'"])
  if(html.includes(bad))throw new Error('Android 1.0.8 leaked rejected authority '+bad);
await writeFile(indexPath,html,'utf8');

/* Native startup continuity: keep the WebView hidden behind a branded splash until its
   first committed frame. Notification permission is requested only after saveSession,
   never on top of the login screen. These edits are intentionally produced by the same
   release-preparation step that builds the APK, so CI validates the exact compiled source. */
const activityPath=resolve(root,'apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
let activity=await readFile(activityPath,'utf8');
if(!activity.includes('private View startupSplash;')){
  activity=activity.replace('    private WebView webView;','    private WebView webView;\n    private View startupSplash;');
}
activity=activity.replace(
  '        setContentView(R.layout.activity_main);\n\n        webView = findViewById(R.id.webview);\n        webView.setVisibility(View.VISIBLE);',
  '        setContentView(R.layout.activity_main);\n\n        startupSplash = findViewById(R.id.startup_splash);\n        webView = findViewById(R.id.webview);\n        webView.setVisibility(View.INVISIBLE);'
);
if(!activity.includes('onPageCommitVisible(WebView view, String url)')){
  activity=activity.replace(
    '            @Override public void onPageFinished(WebView view, String url) {',
    '            @Override public void onPageCommitVisible(WebView view, String url) {\n                super.onPageCommitVisible(view, url);\n                view.setVisibility(View.VISIBLE);\n                hideStartupSplash();\n            }\n\n            @Override public void onPageFinished(WebView view, String url) {'
  );
}
activity=activity.replace('        bindNativeNavigation();\n        requestNotificationPermission();\n        loadBundledWeb();','        bindNativeNavigation();\n        loadBundledWeb();');
if(!activity.includes('private void hideStartupSplash()')){
  activity=activity.replace(
    '    private void requestNotificationPermission() {',
    '    private void hideStartupSplash() {\n        if (startupSplash == null || startupSplash.getVisibility() != View.VISIBLE) return;\n        startupSplash.animate().alpha(0f).setDuration(160).withEndAction(() -> startupSplash.setVisibility(View.GONE)).start();\n    }\n\n    private void requestNotificationPermission() {'
  );
}
activity=activity.replace(
  '                if (token.isEmpty()) return;\n                Context context = MainActivity.this.getApplicationContext();',
  '                if (token.isEmpty()) return;\n                runOnUiThread(() -> requestNotificationPermission());\n                Context context = MainActivity.this.getApplicationContext();'
);
for(const must of ['private View startupSplash;','webView.setVisibility(View.INVISIBLE);','onPageCommitVisible(WebView view, String url)','hideStartupSplash();','runOnUiThread(() -> requestNotificationPermission());'])
  if(!activity.includes(must))throw new Error('Android 1.0.8 native startup patch missing '+must);
const onCreatePart=activity.slice(activity.indexOf('@Override protected void onCreate'),activity.indexOf('private SharedPreferences importPrefs'));
if(onCreatePart.includes('requestNotificationPermission();'))throw new Error('Android 1.0.8 still requests notification permission during onCreate');
await writeFile(activityPath,activity,'utf8');

const layoutPath=resolve(root,'apps/android/app/src/main/res/layout/activity_main.xml');
let layout=await readFile(layoutPath,'utf8');
if(!layout.includes('android:id="@+id/startup_splash"')){
  const rootOpen='<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical"\n    android:background="#090909">';
  const framed='<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:background="#090909">\n\n    <LinearLayout\n        android:layout_width="match_parent"\n        android:layout_height="match_parent"\n        android:orientation="vertical"\n        android:background="#090909">';
  if(!layout.includes(rootOpen))throw new Error('Android 1.0.8 layout root changed unexpectedly');
  layout=layout.replace(rootOpen,framed);
  const last=layout.lastIndexOf('</LinearLayout>');
  if(last<0)throw new Error('Android 1.0.8 layout closing root missing');
  layout=layout.slice(0,last)+`</LinearLayout>\n\n    <TextView\n        android:id="@+id/startup_splash"\n        android:layout_width="match_parent"\n        android:layout_height="match_parent"\n        android:gravity="center"\n        android:background="#090909"\n        android:text="CineTracker"\n        android:textColor="#FFFFFF"\n        android:textSize="26sp"\n        android:textStyle="bold" />\n</FrameLayout>\n`;
}
if(!layout.includes('android:id="@+id/startup_splash"')||!layout.includes('<FrameLayout'))throw new Error('Android 1.0.8 splash layout missing');
await writeFile(layoutPath,layout,'utf8');

console.log('ANDROID_1_0_8_READY runtime=r250 stable-home=true warm=profile+foryou+top10+sports startup=splash notification=post-session');
