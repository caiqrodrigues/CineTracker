import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1008.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r250-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.9 requires validated r250/1.0.8 runtime');
let js=html.slice(a+marker.length,b);
let patch=await readFile(resolve(root,'apps/web/runtime-r215-v109-home-composition.js'),'utf8');
for(const required of [
  "const REVISION='r250-android-official-1.0.8';",
  "window.__ctAndroidHomeContinuity='background-refresh-no-passive-visible-repaint'",
  "window.__ctAndroidWarmPrimary='profile-foryou-top10-sports-sequential'",
  "window.__ctR214='v107-ui-regression-hotfix'",
  'cinetracker_mark_watch_v0994','ct-f1-v107','data-ct214-rewatch'
])if(!js.includes(required))throw new Error('Android 1.0.9 missing validated prerequisite '+required);
for(const required of ["window.__ctR215HomeComposition='no-standalone-history-home'","window.__ctHomeHistoryPolicy='history-hidden-from-home-canonical-buckets-only'",'__ctCleanHomeHistory'])if(!patch.includes(required))throw new Error('Android 1.0.9 Home patch missing '+required);
if(!js.includes('\nboot();'))throw new Error('Android 1.0.9 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
js=js
  .replaceAll('r250-android-official-1.0.8','r251-android-official-1.0.9')
  .replaceAll('CineTracker • v1.0.8','CineTracker • v1.0.9')
  .replaceAll("window.__ctOfficialVersion='1.0.8'","window.__ctOfficialVersion='1.0.9'")
  .replaceAll("window.__ctAndroidOfficialVersion='1.0.8'","window.__ctAndroidOfficialVersion='1.0.9'")
  .replaceAll('window.__ctAndroidOfficialCode=10050','window.__ctAndroidOfficialCode=10051')
  .replaceAll("window.__ctAndroidRelease='1.0.8'","window.__ctAndroidRelease='1.0.9'");
html=html.slice(0,a)+`<script data-ct-android="r251-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html
  .replaceAll('content="1.0.8"','content="1.0.9"')
  .replaceAll('ct-android-v1008','ct-android-v1009')
  .replaceAll('r250-video-continuity-stable-home','r251-canonical-home-no-history');
for(const good of [
  "const REVISION='r251-android-official-1.0.9';",
  "window.__ctOfficialVersion='1.0.9'",
  "window.__ctAndroidOfficialVersion='1.0.9'",
  'window.__ctAndroidOfficialCode=10051',
  "window.__ctR215HomeComposition='no-standalone-history-home'",
  "window.__ctHomeHistoryPolicy='history-hidden-from-home-canonical-buckets-only'",
  "window.__ctAndroidHomeContinuity='background-refresh-no-passive-visible-repaint'",
  "window.__ctR214='v107-ui-regression-hotfix'",
  'cinetracker_mark_watch_v0994','ct-f1-v107','data-ct214-rewatch'
])if(!html.includes(good))throw new Error('Android 1.0.9 final runtime missing '+good);
for(const bad of ['ct107:snapshot:','data-ct107-rewatch','cinetracker_mark_episode_v0994',"window.__ctR212='v107-direct-rewatch-authority'", "window.__ctR213='v107-sports-summary-authority'"])
  if(html.includes(bad))throw new Error('Android 1.0.9 leaked rejected authority '+bad);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_1_0_9_READY runtime=r251 home=canonical-buckets-only history=hidden startup=1.0.8-preserved');
