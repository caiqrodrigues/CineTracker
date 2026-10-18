import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1027.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r269-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<=a)throw new Error('r270 requires exact Android v1.0.27 runtime');
let js=html.slice(a+marker.length,b);
function once(from,to,label){
 const n=js.split(from).length-1;
 if(n!==1)throw new Error('r270 '+label+' expected unique anchor, got '+n);
 js=js.replace(from,to);
}
once("const REVISION='r269-android-official-1.0.27';","const REVISION='r270-android-official-1.0.28';",'revision');
once("window.__ctWebBuild='1.0.27';window.__ctOfficialVersion='1.0.27';window.__ctAndroidOfficialVersion='1.0.27';window.__ctAndroidOfficialCode=10069;",
"window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",'version');
once('for(const query of variants){','for(const query of variants.slice(0,1)){','bounded background recommendation top-up');
js=js.replaceAll('CineTracker • v1.0.27','CineTracker • v1.0.28')
 .replaceAll("JSON.stringify({version:'1.0.27',revision:REVISION","JSON.stringify({version:'1.0.28',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.27'","window.__ctAndroidRelease='1.0.28'");
const patch=await readFile(resolve(root,'apps/android/runtime-r270-v1028-history-sports-speed.js'),'utf8');
for(const must of ['__ctR270AndroidV1028','window.addEventListener(\'click\',sportsClick,true)','movieHistoryFetch','ct186LoadForYou=async function','deferPosters','ct163PreloadAll=function'])if(!patch.includes(must))throw new Error('r270 missing '+must);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(forbidden))throw new Error('r270 forbidden '+forbidden);
if(!js.includes('\nboot();'))throw new Error('r270 boot anchor missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r270-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1027','ct-android-v1028').replaceAll('content="1.0.27"','content="1.0.28"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_28_READY: paginated full movies history, no-refresh Sport click, fast audited For You cache and deferred poster traffic; Web r541 frozen');
