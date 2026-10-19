import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1035.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r277-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw new Error('r278 requires r277 exact signed base');
let js=html.slice(a+tag.length,b);
const from=await readFile(resolve(root,'apps/android/runtime-r277-v1035-foryou-single-owner.js'),'utf8');
const to=await readFile(resolve(root,'apps/android/runtime-r278-v1036-foryou-nonrepeating.js'),'utf8');
if(js.split(from).length!==2)throw new Error('r278 requires exactly one old seven-slot owner for replacement');
for(const mandatory of ['__ctR278AndroidV1036','async function slotChoice','contentDetailSafe','cinetracker_recommendation_record_v113','ct186FreshEligible','ct186WatchEligible'])if(!to.includes(mandatory))throw new Error('r278 owner missing '+mandatory);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(to.includes(forbidden))throw new Error('r278 forbidden '+forbidden);
js=js.replace(from,to);
function once(oldText,newText,label){const n=js.split(oldText).length-1;if(n!==1)throw new Error(label+': expected one, found '+n);js=js.replace(oldText,newText)}
once("const REVISION='r277-android-official-1.0.35';","const REVISION='r278-android-official-1.0.36';",'revision');
once("window.__ctWebBuild='1.0.35';window.__ctOfficialVersion='1.0.35';window.__ctAndroidOfficialVersion='1.0.35';window.__ctAndroidOfficialCode=10077;",
"window.__ctWebBuild='1.0.36';window.__ctOfficialVersion='1.0.36';window.__ctAndroidOfficialVersion='1.0.36';window.__ctAndroidOfficialCode=10078;",'version');
js=js.replaceAll('CineTracker • v1.0.35','CineTracker • v1.0.36')
.replaceAll("JSON.stringify({version:'1.0.35',revision:REVISION","JSON.stringify({version:'1.0.36',revision:REVISION")
.replaceAll("window.__ctAndroidRelease='1.0.35'","window.__ctAndroidRelease='1.0.36'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r278-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1035','ct-android-v1036').replaceAll('content="1.0.35"','content="1.0.36"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_36_READY single owner replaced, never repeat, detail audited, seven slots, without Home/Sports/Web changes');
