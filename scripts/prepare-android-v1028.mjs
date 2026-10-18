import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1027.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r269-android-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
if(start<0||end<=start)throw new Error('r270 expected Android v1.0.27 base');
let js=html.slice(start+tag.length,end);
function once(a,b,label){const count=js.split(a).length-1;if(count!==1)throw new Error('r270 '+label+' required once; found '+count);js=js.replace(a,b)}
once("const REVISION='r269-android-official-1.0.27';","const REVISION='r270-android-official-1.0.28';",'revision');
once("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",
 "window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",'version');
js=js.replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
 .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.27'","window.__ctAndroidRelease='1.0.28'");
const patch=await readFile(resolve(root,'apps/android/runtime-r270-v1028-focused.js'),'utf8');
for(const required of ['__ctR270AndroidV1028','markSportWatched159=async function','toggleSports263=async function','history_movies=rows','ct186LoadForYou=async function','IntersectionObserver'])if(!patch.includes(required))throw new Error('missing '+required);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(forbidden))throw new Error('scoped r270 patch contains forbidden full redraw '+forbidden);
if(!js.includes('\nboot();'))throw new Error('r270 insertion boot absent');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,start)+'<script data-ct-android="r270-android-js">'+js+'</script>'+html.slice(end+'</script>'.length);
html=html.replaceAll('ct-android-v1027','ct-android-v1028').replaceAll('content="1.0.27"','content="1.0.28"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_28_READY Android r270: optimistic sports click no scroll, history beyond 80, fast first paint recommendations and viewport lazy posters; Web r541 frozen');
