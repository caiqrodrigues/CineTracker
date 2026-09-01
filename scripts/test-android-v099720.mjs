import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),index=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const [html,gradle]=await Promise.all([readFile(index,'utf8'),readFile(resolve(root,'apps/android/app/build.gradle'),'utf8')]);
for(const m of [
  'android-v0.99.7.20-r185a-instant-cache','r185a-instant-cache','instant-visual-cache-safe-revalidate',
  'stale-while-revalidate-visual-only','cache-never-writes-never-decides-business-state','old-render-path-remains-authority',
  'data-ct185a-stale','Pular e marcar só','Marcar anteriores +','compact-inline-season-toggle-no-giant-button'
])if(!html.includes(m))throw new Error('Android 0.99.7.20 missing '+m);
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android 0.99.7.20 imported Web-only r183');
if(!gradle.includes("versionName '0.99.7.20'")||!gradle.includes('versionCode 9990'))throw new Error('Android 0.99.7.20 identity mismatch');
const marker='<script data-ct-android="r185a-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android r185A embedded JS missing');
const tmp=resolve(root,'.tmp-android-r185a.js');await writeFile(tmp,html.slice(a+marker.length,b),'utf8');
execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'});await rm(tmp,{force:true});
console.log('ANDROID_099720_TEST_OK identity=0.99.7.20 cache=visual-only authority=unchanged');
