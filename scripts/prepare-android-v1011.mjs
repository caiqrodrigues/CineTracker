import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Deliberately restart from the physically validated .71/r243 Android runtime. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1000.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r243-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.11 requires exact r243/1.0.0 base');
let js=html.slice(a+marker.length,b);
for(const must of [
 "const REVISION='r243-android-watchlist-renderer-pool';",
 "window.__ctR243Fix='watchlist-swap-uses-active-ct186-selected-pool';",
 "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';",
 "window.__ctOfficialVersion='1.0.0'",
 "window.__ctAndroidOfficialVersion='1.0.0'"
])if(!js.includes(must))throw new Error('Android 1.0.11 lost validated r243 prerequisite '+must);
for(const forbidden of ["window.__ctR208='v104-authoritative-internal-runtime'","window.__ctR214='v107-ui-regression-hotfix'","window.__ctR215HomeComposition","window.__ctR216RealRegressions",'r246-','r249-android-official','r250-android-official','r251-android-official','r252-android-official'])if(js.includes(forbidden))throw new Error('Android 1.0.11 base contaminated by later runtime '+forbidden);
const patch=await readFile(resolve(root,'apps/web/runtime-r217-v111-consolidated.js'),'utf8');
for(const must of ["window.__ctR217Consolidated='v111-r204-r243-single-release-authority'",'data-ct111-rewatch','ct-f1-v111',"edge('cinetracker-f1-v1',{season},30000)","window.__ctV111Top10='three-complete-cards-mobile'"])if(!patch.includes(must))throw new Error('Android 1.0.11 consolidated patch missing '+must);
if(!js.includes('\nboot();'))throw new Error('Android 1.0.11 boot point missing');
js=js
 .replaceAll("const REVISION='r243-android-watchlist-renderer-pool';","const REVISION='r253-android-official-1.0.11';")
 .replaceAll("window.__ctWebBuild='1.0.0';window.__ctOfficialVersion='1.0.0';window.__ctAndroidOfficialVersion='1.0.0';","window.__ctWebBuild='1.0.11';window.__ctOfficialVersion='1.0.11';window.__ctAndroidOfficialVersion='1.0.11';window.__ctAndroidOfficialCode=10053;")
 .replaceAll('CineTracker • v1.0.0 • ${REVISION}','CineTracker • v1.0.11 • ${REVISION}')
 .replaceAll("JSON.stringify({version:'1.0.0',revision:REVISION","JSON.stringify({version:'1.0.11',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.0'","window.__ctAndroidRelease='1.0.11'")
 .replaceAll("window.__ctAndroidReleaseBase='0.99.7.71-r243-user-validated'","window.__ctAndroidReleaseBase='0.99.7.71-r243-user-validated-consolidated'")
 .replaceAll("window.__ctAndroidReleaseScope='identity-only-no-runtime-behavior-change'","window.__ctAndroidReleaseScope='r243-plus-single-r217-authority'");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r253-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1000','ct-android-v1011').replaceAll('content="1.0.0"','content="1.0.11"').replaceAll('r243-watchlist-renderer-pool-user-validated','r253-r243-consolidated-r217');
for(const must of ["const REVISION='r253-android-official-1.0.11';","window.__ctAndroidOfficialCode=10053","window.__ctR217Consolidated='v111-r204-r243-single-release-authority'",'data-ct111-rewatch','ct-f1-v111'])if(!html.includes(must))throw new Error('Android 1.0.11 prepared runtime missing '+must);
for(const forbidden of ["window.__ctR208='v104-authoritative-internal-runtime'","window.__ctR214='v107-ui-regression-hotfix'","window.__ctR215HomeComposition","window.__ctR216RealRegressions",'ct-f1-v104','ct-f1-v107','data-ct214-rewatch','data-ct216-rewatch'])if(html.includes(forbidden))throw new Error('Android 1.0.11 leaked rejected later authority '+forbidden);
await writeFile(indexPath,html,'utf8');

/* Native-only continuity: splash until first committed WebView frame; notification permission after authenticated saveSession. */
const activityPath=resolve(root,'apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
let activity=await readFile(activityPath,'utf8');
if(!activity.includes('private View startupSplash;'))activity=activity.replace('    private WebView webView;','    private WebView webView;\n    private View startupSplash;');
activity=activity.replace('        setContentView(R.layout.activity_main);\n\n        webView = findViewById(R.id.webview);\n        webView.setVisibility(View.VISIBLE);','        setContentView(R.layout.activity_main);\n\n        startupSplash = findViewById(R.id.startup_splash);\n        webView = findViewById(R.id.webview);\n        webView.setVisibility(View.INVISIBLE);');
if(!activity.includes('onPageCommitVisible(WebView view, String url)'))activity=activity.replace('            @Override public void onPageFinished(WebView view, String url) {','            @Override public void onPageCommitVisible(WebView view, String url) {\n                super.onPageCommitVisible(view, url);\n                view.setVisibility(View.VISIBLE);\n                hideStartupSplash();\n            }\n\n            @Override public void onPageFinished(WebView view, String url) {');
activity=activity.replace('        bindNativeNavigation();\n        requestNotificationPermission();\n        loadBundledWeb();','        bindNativeNavigation();\n        loadBundledWeb();');
if(!activity.includes('private void hideStartupSplash()'))activity=activity.replace('    private void requestNotificationPermission() {','    private void hideStartupSplash() {\n        if (startupSplash == null || startupSplash.getVisibility() != View.VISIBLE) return;\n        startupSplash.animate().alpha(0f).setDuration(160).withEndAction(() -> startupSplash.setVisibility(View.GONE)).start();\n    }\n\n    private void requestNotificationPermission() {');
activity=activity.replace('                if (token.isEmpty()) return;\n                Context context = MainActivity.this.getApplicationContext();','                if (token.isEmpty()) return;\n                runOnUiThread(() -> requestNotificationPermission());\n                Context context = MainActivity.this.getApplicationContext();');
for(const must of ['private View startupSplash;','webView.setVisibility(View.INVISIBLE);','onPageCommitVisible(WebView view, String url)','hideStartupSplash();','runOnUiThread(() -> requestNotificationPermission());'])if(!activity.includes(must))throw new Error('Android 1.0.11 native startup missing '+must);
const onCreate=activity.slice(activity.indexOf('@Override protected void onCreate'),activity.indexOf('private SharedPreferences importPrefs'));if(onCreate.includes('requestNotificationPermission();'))throw new Error('Android 1.0.11 requests notification permission before session');
await writeFile(activityPath,activity,'utf8');

const layoutPath=resolve(root,'apps/android/app/src/main/res/layout/activity_main.xml');
let layout=await readFile(layoutPath,'utf8');
if(!layout.includes('android:id="@+id/startup_splash"')){
 const old='<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical"\n    android:background="#090909">';
 const framed='<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:background="#090909">\n\n    <LinearLayout\n        android:layout_width="match_parent"\n        android:layout_height="match_parent"\n        android:orientation="vertical"\n        android:background="#090909">';
 if(!layout.includes(old))throw new Error('Android 1.0.11 layout root unexpected');layout=layout.replace(old,framed);const last=layout.lastIndexOf('</LinearLayout>');if(last<0)throw new Error('Android 1.0.11 layout close missing');layout=layout.slice(0,last)+`</LinearLayout>\n\n    <TextView\n        android:id="@+id/startup_splash"\n        android:layout_width="match_parent"\n        android:layout_height="match_parent"\n        android:gravity="center"\n        android:background="#090909"\n        android:text="CineTracker"\n        android:textColor="#FFFFFF"\n        android:textSize="26sp"\n        android:textStyle="bold" />\n</FrameLayout>\n`;
}
await writeFile(layoutPath,layout,'utf8');
console.log('ANDROID_1_0_11_READY base=r243 skipped=r246-r252 runtime=r253 authority=r217');
