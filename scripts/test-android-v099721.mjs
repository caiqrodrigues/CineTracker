import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),index=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const [html,gradle,css]=await Promise.all([
  readFile(index,'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/web/r185c-polish-shared.css'),'utf8')
]);
for(const m of [
  'android-v0.99.7.21-r185c-home-polish','r185c-home-scroll-polish','home-entry-top-anchor',
  'geometry-only-no-layout-no-color','enter-home-at-top','--ct185c-radius-panel',
  'instant-visual-cache-safe-revalidate','Pular e marcar só','Marcar anteriores +','compact-inline-season-toggle-no-giant-button'
])if(!html.includes(m))throw new Error('Android 0.99.7.21 missing '+m);
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android 0.99.7.21 imported Web-only r183');
if(html.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse'"))throw new Error('Android 0.99.7.21 imported Web-only r185C performance');
if(!gradle.includes("versionName '0.99.7.21'")||!gradle.includes('versionCode 9991'))throw new Error('Android 0.99.7.21 identity mismatch');
for(const p of ['color:','background:','padding:','margin:','display:','position:','width:','height:','gap:','grid-','font-','transform:','box-shadow:'])if(css.includes(p))throw new Error('Android polish changes forbidden visual/layout property '+p);
const marker='<script data-ct-android="r185c-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android r185C embedded JS missing');
const tmp=resolve(root,'.tmp-android-r185c.js');await writeFile(tmp,html.slice(a+marker.length,b),'utf8');
execFileSync(process.execPath,['--check',tmp],{stdio:'inherit'});await rm(tmp,{force:true});
console.log('ANDROID_099721_TEST_OK identity=0.99.7.21 home=top polish=geometry-only performance=r185A');
