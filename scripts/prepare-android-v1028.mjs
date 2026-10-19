import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1027.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r269-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('r270 requires validated Android 1.0.27 runtime');
let js=html.slice(a+tag.length,b);
function once(x,y,meaning){
 const count=js.split(x).length-1;
 if(count!==1)throw Error('r270 '+meaning+' must match once; found '+count);
 js=js.replace(x,y);
}
once("const REVISION='r269-android-official-1.0.27';","const REVISION='r270-android-official-1.0.28';",'revision');
once("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",
"window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",'Android release version');
js=js.replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
 .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.27'","window.__ctAndroidRelease='1.0.28'");
const patch=await readFile(resolve(root,'apps/android/runtime-r270-v1028-recovery.js'),'utf8');
for(const must of ["__ctR270AndroidV1028","cinetracker_profile_summary_v489","cinetracker_profile_list_v475","cinetracker_sport_mark_watched_v1","ct186LoadForYou=async function","ct163PreloadAll=function","window.addEventListener('click'"])if(!patch.includes(must))throw Error('missing r270 feature '+must);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(forbidden))throw Error('forbidden r270 '+forbidden);
if(!js.includes('\nboot();'))throw Error('r270 boot injection not found');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r270-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1027','ct-android-v1028').replaceAll('content="1.0.27"','content="1.0.28"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_28_READY Profile complete, authentic Discover fast, movie history paginated, Sports mutation without scroll');
