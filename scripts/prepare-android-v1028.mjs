import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1027.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r269-android-js">';
const at=html.indexOf(marker),end=at<0?-1:html.indexOf('</script>',at+marker.length);
if(at<0||end<=at)throw new Error('Android 1.0.28 requires exact r269 baseline');
let js=html.slice(at+marker.length,end);
function once(old,newText,name){
 const n=js.split(old).length-1;
 if(n!==1)throw new Error('r270: expected exactly one '+name+', found '+n);
 js=js.replace(old,newText);
}
function replaceRegion(start,stop,source,name){
 const a=js.indexOf(start),b=a<0?-1:js.indexOf(stop,a+start.length);
 if(a<0||b<=a||js.indexOf(start,a+1)!==-1)throw new Error('r270 invalid '+name+' bounds');
 js=js.slice(0,a)+source+'\n'+js.slice(b);
}
const direct=await readFile(resolve(root,'apps/android/runtime-r270-v1028-sports-direct.js'),'utf8');
const get=(start,stop)=>{const a=direct.indexOf(start),b=direct.indexOf(stop,a+start.length);if(a<0||b<a)throw Error('r270 source missing '+start);return direct.slice(a,b).trim()};
replaceRegion('async function markSportWatched159(eventId,currentlyWatched){',"document.addEventListener('click',function r159SportsWatchClick(e){",
 get('const ct270SportsPending=new Set();','//__CT270_SPORT_BASE_END__'),
 'generic sports-watch action');
replaceRegion('async function toggleSports263(btn){',"document.addEventListener('click',e=>{const close=e.target?.closest?.('[data-ct263-sports-close]');",
 get('async function toggleSports263(btn){','//__CT270_SPORT_DETAIL_END__'),
 'sports drilldown no redraw/no scroll');
once("const REVISION='r269-android-official-1.0.27';","const REVISION='r270-android-official-1.0.28';",'revision');
once("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",
 "window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",'version');
js=js.replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
 .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.27'","window.__ctAndroidRelease='1.0.28'");
const patch=await readFile(resolve(root,'apps/android/runtime-r270-v1028-profile-foryou-history.js'),'utf8');
for(const x of ['__ctR270AndroidV1028','profileMerge','recoverProfile','recCandidates','fullMovieHistory','ct186LoadForYou=async function','ct186RefreshVisible=async function'])
 if(!patch.includes(x))throw Error('r270 patch missing '+x);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver','while (true)'])
 if(patch.includes(bad)||direct.includes(bad))throw Error('r270 forbidden '+bad);
if(!js.includes('\nboot();'))throw Error('r270 boot anchor absent');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,at)+'<script data-ct-android="r270-android-js">'+js+'</script>'+html.slice(end+'</script>'.length);
html=html.replaceAll('ct-android-v1027','ct-android-v1028').replaceAll('content="1.0.27"','content="1.0.28"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_28_READY profile-real-library+seven-slot-progressive-audit+full-film-history+sports-optimistic-in-place+Web-r541-frozen');
