import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1023.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r265-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.24 needs exact 1.0.23 validated runtime');
let js=html.slice(a+marker.length,b);
const once=(oldText,newText,label)=>{const count=js.split(oldText).length-1;if(count!==1)throw new Error(label+': expected 1 anchor, found '+count);js=js.replace(oldText,newText)};
once("const REVISION='r265-android-official-1.0.23';","const REVISION='r266-android-official-1.0.24';",'revision');
once("window.__ctWebBuild='1.0.23';window.__ctOfficialVersion='1.0.23';window.__ctAndroidOfficialVersion='1.0.23';window.__ctAndroidOfficialCode=10065;",
"window.__ctWebBuild='1.0.24';window.__ctOfficialVersion='1.0.24';window.__ctAndroidOfficialVersion='1.0.24';window.__ctAndroidOfficialCode=10066;",'version');
js=js.replaceAll('CineTracker • v1.0.23','CineTracker • v1.0.24')
.replaceAll("JSON.stringify({version:'1.0.23',revision:REVISION","JSON.stringify({version:'1.0.24',revision:REVISION")
.replaceAll("window.__ctAndroidRelease='1.0.23'","window.__ctAndroidRelease='1.0.24'");
const patch=await readFile(resolve(root,'apps/android/runtime-r266-v1024-video-verified.js'),'utf8');
for(const must of ['__ctR266AndroidV1024','ct169-drawer-backdrop','cinetracker_sports_stadium_summary_v296','ct186FreshEligible','ct186MergeRows','data-ct266-stadium-stat'])if(!patch.includes(must))throw new Error('Missing real fix '+must);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(bad))throw new Error('Forbidden new behavior '+bad);
if(!js.includes('\nboot();'))throw new Error('Android boot anchor missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+'<script data-ct-android="r266-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1023','ct-android-v1024').replaceAll('content="1.0.23"','content="1.0.24"').replaceAll('r265-r264-device-foryou-sports-f1-ui','r266-r265-video-foryou-stadium-episodes');
for(const marker of ['r266-android-js','cinetracker_sports_stadium_summary_v296','ct169-drawer-backdrop','__ctR266AndroidV1024'])if(!html.includes(marker))throw new Error('Android 1.0.24 final missing '+marker);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_24_READY actual Android season drawer + real stadium RPC + bounded movie recommendations; native Web r541 unchanged');
