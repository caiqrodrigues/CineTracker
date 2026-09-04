import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Official 1.0.0 is a packaging/version promotion of the physically validated 0.99.7.71 runtime. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099771.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r243-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.0 requires validated r243/.71 bundle');
let js=html.slice(a+marker.length,b);

for(const required of [
  "const REVISION='r243-android-watchlist-renderer-pool';",
  "window.__ctR243Fix='watchlist-swap-uses-active-ct186-selected-pool';",
  'const selected237=ct186Select(ct186ForYouData);',
  'selected237?.wmPool','selected237?.wsPool','selected237?.waPool',
  "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';"
])if(!js.includes(required))throw new Error('Android 1.0.0 lost validated .71 behavior '+required);

const once=(source,from,to,label)=>{
  const count=source.split(from).length-1;
  if(count!==1)throw new Error(`Android 1.0.0 expected exactly one ${label}, found ${count}`);
  return source.replace(from,to);
};

js=once(js,"window.__ctWebBuild='0.99.7';","window.__ctWebBuild='1.0.0';window.__ctOfficialVersion='1.0.0';window.__ctAndroidOfficialVersion='1.0.0';",'runtime version identity');
js=once(js,'CineTracker • v0.99.7 • ${REVISION}','CineTracker • v1.0.0 • ${REVISION}','visible footer version');
js=once(js,"JSON.stringify({version:'0.99.7',revision:REVISION","JSON.stringify({version:'1.0.0',revision:REVISION",'snapshot version');
if(!js.includes('\nboot();'))throw new Error('Android 1.0.0 boot point missing');
js=js.replace('\nboot();',"\nwindow.__ctAndroidRelease='1.0.0';window.__ctAndroidReleaseBase='0.99.7.71-r243-user-validated';window.__ctAndroidReleaseScope='identity-only-no-runtime-behavior-change';\nboot();");
html=html.slice(0,a)+marker+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099771" content="r243-watchlist-renderer-pool"','name="ct-android-v1000" content="r243-watchlist-renderer-pool-user-validated"');
if(!html.includes('name="ct-android-v1000"'))html=html.replace(marker,'<meta name="ct-android-v1000" content="r243-watchlist-renderer-pool-user-validated">'+marker);
html=html.replace(marker,'<meta name="ct-official-version" content="1.0.0">'+marker);

for(const expected of [
  "window.__ctOfficialVersion='1.0.0'","window.__ctAndroidOfficialVersion='1.0.0'",
  'CineTracker • v1.0.0 • ${REVISION}',"window.__ctAndroidReleaseBase='0.99.7.71-r243-user-validated'",
  'watchlist-swap-uses-active-ct186-selected-pool','native-webview-horizontal-no-manual-touch'
])if(!html.includes(expected))throw new Error('Android 1.0.0 missing '+expected);
if(html.includes('CineTracker • v0.99.7 • ${REVISION}'))throw new Error('old visible Android version leaked');

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_1_0_0_READY base=0.99.7.71-r243 display=1.0.0 behavior=unchanged');
