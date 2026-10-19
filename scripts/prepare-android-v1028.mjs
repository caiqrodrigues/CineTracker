import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1027.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const marker='<script data-ct-android="r269-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<=a)throw Error('Android 1.0.28 requires 1.0.27 baseline');
let js=html.slice(a+marker.length,b);
function once(x,y,name){const count=js.split(x).length-1;if(count!==1)throw Error('r270 '+name+': expected 1 anchor, found '+count);js=js.replace(x,y)}
once("const REVISION='r269-android-official-1.0.27';","const REVISION='r270-android-official-1.0.28';",'revision');
once("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",
"window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",'native code');
js=js.replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
 .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.27'","window.__ctAndroidRelease='1.0.28'");
const patch=await readFile(resolve(root,'apps/android/runtime-r270-v1028-weekly-discover-sports.js'),'utf8');
for(const need of ['__ctR270AndroidV1028','verifyWeekly','cinetracker_home_history_v387','cinetracker_recommendation_filter_v525','cinetracker_sport_mark_watched_v1','ct186LoadForYou=async function'])if(!patch.includes(need))throw Error('Missing r270 feature '+need);
for(const denied of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(denied))throw Error('Forbidden r270 behavior '+denied);
if(!js.includes('\nboot();'))throw Error('Missing Android boot marker');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r270-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1027','ct-android-v1028').replaceAll('content="1.0.27"','content="1.0.28"');
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_28_READY WWE weekly recent, one discover authority, historical movies canonical, Sports actions no scroll/reload; Web r541 unchanged');
