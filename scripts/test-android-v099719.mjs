import {readFile} from 'node:fs/promises';
const [h,g]=await Promise.all([
  readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8'),
  readFile('apps/android/app/build.gradle','utf8')
]);
for(const m of [
  'android-v0.99.7.19-r184-gap-prompt','r184-episode-gap-prompt','skip-or-mark-previous-released',
  'detect-skipped-released-episodes-before-manual-watch','all-released-episodes-before-target-across-seasons',
  'Pular e marcar só','Marcar anteriores +','ct184SkippedBefore','ct181Pool(jobs,4',
  'home-clean-status-season-compact-control','compact-inline-season-toggle-no-giant-button',
  'cinetracker_unmark_episode_v1','ct176PrimeWithWatched','data-ct-android="r184-js"'
])if(!h.includes(m))throw new Error('Android 0.99.7.19 missing '+m);
if(h.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android imported Web-only r183 patch');
if(!g.includes("versionName '0.99.7.19'")||!g.includes('versionCode 9989'))throw new Error('Android 0.99.7.19 Gradle identity missing');
const marker='<script data-ct-android="r184-js">',a=h.indexOf(marker),b=h.indexOf('</script>',a+marker.length);if(a<0||b<a)throw new Error('r184 embedded script missing');
const js=h.slice(a+marker.length,b);
if(!js.includes("const REVISION='r184-episode-gap-prompt';"))throw new Error('wrong embedded Android revision');
if(!js.includes('const $$'))throw new Error('selector helper $$ corrupted');
console.log('ANDROID_099719_OK r182-mobile-preserved r184-gap=skip-or-fill');
