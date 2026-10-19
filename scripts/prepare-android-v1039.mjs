import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1038.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r280-android-js">';
const at=html.indexOf(marker),end=at<0?-1:html.indexOf('</script>',at+marker.length);
if(at<0||end<at)throw new Error('Android 1.0.39 requires validated 1.0.38 runtime');
let js=html.slice(at+marker.length,end);
function replaceOnce(from,to,label){
 const n=js.split(from).length-1;
 if(n!==1)throw new Error('r281 '+label+': expected unique anchor, found '+n);
 js=js.replace(from,to);
}
replaceOnce("const REVISION='r280-android-official-1.0.38';",
 "const REVISION='r281-android-official-1.0.39';",'revision');
replaceOnce("window.__ctWebBuild='1.0.38';window.__ctOfficialVersion='1.0.38';window.__ctAndroidOfficialVersion='1.0.38';window.__ctAndroidOfficialCode=10080;",
 "window.__ctWebBuild='1.0.39';window.__ctOfficialVersion='1.0.39';window.__ctAndroidOfficialVersion='1.0.39';window.__ctAndroidOfficialCode=10081;",'version code');
js=js.replaceAll('CineTracker • v1.0.38','CineTracker • v1.0.39')
 .replaceAll("JSON.stringify({version:'1.0.38',revision:REVISION","JSON.stringify({version:'1.0.39',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.38'","window.__ctAndroidRelease='1.0.39'");
const a=js.indexOf('/* CineTracker Android 1.0.37/r279');
const b=a<0?-1:js.indexOf('/* CineTracker Android 1.0.38 / r280',a);
if(a<0||b<a)throw new Error('r281 expected existing authenticated recommendation gate');
let audit=js.slice(a,b);
const needle='.slice(0,16)';
if(audit.split(needle).length!==2)throw new Error('r281 expected one bounded audit batch anchor');
audit=audit.replace(needle,".slice(0,data._ct281AuditDeep?24:(name==='_ct186_reserve'?8:12))");
js=js.slice(0,a)+audit+js.slice(b);
const patch=await readFile(resolve(root,'apps/android/runtime-r281-v1039-profile-and-foryou.js'),'utf8');
for(const marker of ['__ctR281AndroidV1039','cinetracker_profile_summary_v489','_ct281AuditDeep','profile-summary-real-cards'])if(!patch.includes(marker))throw new Error('r281 patch missing '+marker);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(forbidden))throw new Error('r281 forbidden operation '+forbidden);
if(!js.includes('\nboot();'))throw new Error('r281 missing boot anchor');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,at)+'<script data-ct-android="r281-android-js">'+js+'</script>'+html.slice(end+'</script>'.length);
html=html.replaceAll('ct-android-v1038','ct-android-v1039').replaceAll('content="1.0.38"','content="1.0.39"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_39_READY: Profile top12/actors from real v489 summary; no blank stat-only painter; staged authenticated seven-slot recommendations; Web r541 preserved');
