import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
const index=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const [html,gradle,runtime]=await Promise.all([
  readFile(index,'utf8'),
  readFile(resolve(root,'apps/android/app/build.gradle'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r195-android.js'),'utf8')
]);
for(const m of [
  'android-v0.99.7.23-r195-mobile-equivalents','r195-android-r190-r195-equivalents','r190-r195-mobile-equivalents',
  'canonical-known-media-fast-detail-state','favorites-strongest-seen-history-affinity','asian-scripted-tv-excluded-from-foryou',
  'statistics-less-vertical-space','ct-sports-sync-v4+ct-sports-search-v2','bilingual-media-search','home-r5+profile-fast-dashboard',
  'cinetracker_profile_media_dashboard_v0997_fast','cinetracker_known_media_v1','cinetracker_media_state_v1','cinetracker_home_live_v0997_r5',
  'foryou-strict-quality-year-history-realtime','tmdb-gte-7.5-release-year-gt-1990','block-pure-drama-18-and-any-documentary-99',
  'seven-slots-no-duplicate-media','watch_history+media_overrides-postgres-changes','home-entry-top-anchor','geometry-only-no-layout-no-color',
  'instant-visual-cache-safe-revalidate','Pular e marcar só','Marcar anteriores +'
])if(!html.includes(m))throw new Error('Android 0.99.7.23 missing '+m);
if(!gradle.includes("versionName '0.99.7.23'")||!gradle.includes('versionCode 9993'))throw new Error('Android 0.99.7.23 identity mismatch');
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android imported Web-only r183');
if(html.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse'"))throw new Error('Android imported Web-only r185C route layer');
if(html.includes("window.__ctR194Web='taste-intelligence-compact-profile'"))throw new Error('Android imported Web-only r194 runtime instead of adapted layer');
if(!runtime.includes("countriesA23(x).some(c=>['KR','JP','CN','TW','HK','TH'].includes(c))"))throw new Error('Dorama country rule missing');
if(!runtime.includes("['ko','ja','zh','th'].includes(lang)"))throw new Error('Dorama language rule missing');
if(!runtime.includes("genres.includes")&&(!runtime.includes('10764')||!runtime.includes('10763')||!runtime.includes('10767')))throw new Error('Dorama non-scripted exemptions missing');
if(!runtime.includes("if(fav)" )&&!runtime.includes('(fav?9:0)'))throw new Error('Favorite taste weighting missing');
if(!runtime.includes("min-height:47px"))throw new Error('Compact Android profile stat height missing');
if(!runtime.includes("[data-ct-a23-seen]"))throw new Error('Android local-first seen action missing');
const marker='<script data-ct-android="r195-android-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android r195 embedded JS missing');
const tmpRuntime=resolve(root,'.tmp-android-r195-runtime.js'),tmpBundle=resolve(root,'.tmp-android-v099723-bundle.js');
await writeFile(tmpRuntime,runtime,'utf8');
await writeFile(tmpBundle,html.slice(a+marker.length,b),'utf8');
try{
  execFileSync(process.execPath,['--check',tmpRuntime],{stdio:'inherit'});
  execFileSync(process.execPath,['--check',tmpBundle],{stdio:'inherit'});
}finally{
  await Promise.all([rm(tmpRuntime,{force:true}),rm(tmpBundle,{force:true})]);
}
console.log('ANDROID_099723_TEST_OK identity=0.99.7.23 ported=r190-r195 sports=shared-v4-v2 dorama=blocked profile=dense');
