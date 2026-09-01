import {readFile} from 'node:fs/promises';
const h=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
for(const m of [
  'android-v0.99.7.16-r180-discover-profile','r180-discover-profile-parity','strict-discover-profile-layout',
  'native-pan-x-all-subtabs-strict-rules','collapsible-wide-stats-mobile','data-ct-r180-tabs','data-ct-r180-stats-toggle',
  'touch-action:pan-x!important','grid-column:span 2!important','home-target-card-by-media-id','safe-inside-poster-no-transform'
])if(!h.includes(m))throw new Error('Android 0.99.7.16 missing '+m);
const marker='<script data-ct-android="r180-js">',a=h.indexOf(marker),b=h.indexOf('</script>',a+marker.length);if(a<0||b<a)throw new Error('r180 embedded script missing');
const js=h.slice(a+marker.length,b);if(!js.includes("const REVISION='r180-discover-profile-parity';"))throw new Error('wrong embedded revision');
console.log('ANDROID_099716_OK r180 strict Discover/Profile embedded');
