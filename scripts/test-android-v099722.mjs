import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),index=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const [html,gradle]=await Promise.all([readFile(index,'utf8'),readFile(resolve(root,'apps/android/app/build.gradle'),'utf8')]);
for(const m of [
  'android-v0.99.7.22-r186-foryou-strict-realtime','r186-foryou-strict-realtime','foryou-strict-quality-year-history-realtime',
  'tmdb-gte-7.5-release-year-gt-1990','block-pure-drama-18-and-any-documentary-99','seven-slots-no-duplicate-media',
  'watch_history+media_overrides-postgres-changes','same-r186-authority-as-web','home-entry-top-anchor','geometry-only-no-layout-no-color',
  'instant-visual-cache-safe-revalidate','Pular e marcar só','Marcar anteriores +'
])if(!html.includes(m))throw new Error('Android 0.99.7.22 missing '+m);
if(!gradle.includes("versionName '0.99.7.22'")||!gradle.includes('versionCode 9992'))throw new Error('Android 0.99.7.22 identity mismatch');
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android imported Web-only r183');
if(html.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse'"))throw new Error('Android imported Web-only r185C performance');
const marker='<script data-ct-android="r186-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android r186 embedded JS missing');
const tmp=resolve(root,'.tmp-android-r186.js');await writeFile(tmp,html.slice(a+marker.length,b),'utf8');execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'});await rm(tmp,{force:true});
console.log('ANDROID_099722_TEST_OK identity=0.99.7.22 foryou=strict realtime=watch_history+media_overrides');
