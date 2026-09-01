import {readFile} from 'node:fs/promises';
const h=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
for(const m of [
  'android-v0.99.7.18-r182-home-season-polish','r182-home-season-polish','home-clean-status-season-compact-control',
  'remove-noninteractive-circle-badge-keep-row-navigation','compact-inline-season-toggle-no-giant-button',
  'removed-noninteractive-circle','compact-inline-card-and-drawer','ct182-season-toggle',
  'whole-season-watch-toggle','data-ct181-season-toggle','cinetracker_mark_episode_v0994','cinetracker_unmark_episode_v1','ct176PrimeWithWatched',
  'strict-discover-profile-layout','native-pan-x-all-subtabs-strict-rules','safe-inside-poster-no-transform'
])if(!h.includes(m))throw new Error('Android 0.99.7.18 missing '+m);
const marker='<script data-ct-android="r182-js">',a=h.indexOf(marker),b=h.indexOf('</script>',a+marker.length);if(a<0||b<a)throw new Error('r182 embedded script missing');
const js=h.slice(a+marker.length,b);if(!js.includes("const REVISION='r182-home-season-polish';"))throw new Error('wrong embedded revision');
if(!h.includes('body[data-ct-android-route="home"] [data-home] .media-row>.badge{display:none!important}'))throw new Error('Home circle is still visible');
if(!h.includes('width:auto!important;min-height:32px!important;max-width:none!important'))throw new Error('season control is not compact on Android');
console.log('ANDROID_099718_OK r182 Home circle removed and season control compact');
