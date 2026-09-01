import {readFile} from 'node:fs/promises';
const h=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
for(const m of [
  'android-v0.99.7.17-r181-season-toggle','r181-season-whole-toggle','whole-season-watch-toggle',
  'whole-season-released-only-reversible','confirm-previous-incomplete-seasons','data-ct181-season-toggle',
  'cinetracker_mark_episode_v0994','cinetracker_unmark_episode_v1','ct176PrimeWithWatched',
  'strict-discover-profile-layout','native-pan-x-all-subtabs-strict-rules','safe-inside-poster-no-transform'
])if(!h.includes(m))throw new Error('Android 0.99.7.17 missing '+m);
const marker='<script data-ct-android="r181-js">',a=h.indexOf(marker),b=h.indexOf('</script>',a+marker.length);if(a<0||b<a)throw new Error('r181 embedded script missing');
const js=h.slice(a+marker.length,b);if(!js.includes("const REVISION='r181-season-whole-toggle';"))throw new Error('wrong embedded revision');
console.log('ANDROID_099717_OK r181 whole season toggle embedded');
