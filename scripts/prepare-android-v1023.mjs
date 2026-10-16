import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1022.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r264-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('v1023 requires v1022 baseline');
let js=html.slice(a+marker.length,b);
function replaceOnce(from,to,name){
 const n=js.split(from).length-1;if(n!==1)throw new Error('v1023 '+name+' required once, found '+n);
 js=js.replace(from,to);
}
replaceOnce("if(q111('#ct-f1-v111')===hub)body.innerHTML=bodyF111(d,f111Tab)","if(q111('#ct-f1-v111')===hub){body.innerHTML=bodyF111(d,f111Tab);window.__ctR265F1?.setData(d)}",'F1 result-to-hub handoff');
replaceOnce("const blockedTitle263=/\\b(wwe|raw|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series|money in the bank|elimination chamber|crown jewel|night of champions|backlash|payback)\\b/i;",
 "const blockedTitle263=/\\b(aew|all elite wrestling|njpw|new japan pro wrestling|ring of honor|tna wrestling|impact wrestling|wwe|raw|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series|money in the bank|elimination chamber|crown jewel|night of champions|backlash|payback|wrestling|luta livre|pro wrestling|ufc|mma|stand[\\s-]?up)\\b/i;",'AEW strict global recommendation exclusion');
replaceOnce("if(t==='tv'&&g.includes(10764))return false;","if(t==='tv'&&(g.includes(10764)||g.includes(10767)))return false;",'reality filtering in personal details');
replaceOnce("const REVISION='r264-android-official-1.0.22';","const REVISION='r265-android-official-1.0.23';",'revision');
replaceOnce("window.__ctWebBuild='1.0.22';window.__ctOfficialVersion='1.0.22';window.__ctAndroidOfficialVersion='1.0.22';window.__ctAndroidOfficialCode=10064;",
 "window.__ctWebBuild='1.0.23';window.__ctOfficialVersion='1.0.23';window.__ctAndroidOfficialVersion='1.0.23';window.__ctAndroidOfficialCode=10065;",'version');
js=js.replaceAll('CineTracker • v1.0.22','CineTracker • v1.0.23')
 .replaceAll("JSON.stringify({version:'1.0.22',revision:REVISION","JSON.stringify({version:'1.0.23',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.22'","window.__ctAndroidRelease='1.0.23'");
const patch=await readFile(resolve(root,'apps/android/runtime-r265-v1023-device-parity.js'),'utf8');
for(const need of ['__ctR265AndroidV1023','__ctR265F1','cinetracker_sports_watch_set_v296','data-ct265-race','ct265-empty-slot'])if(!patch.includes(need))throw new Error('v1023 missing patch feature '+need);
for(const disallowed of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(disallowed))throw new Error('v1023 forbidden '+disallowed);
if(!js.includes('\nboot();'))throw new Error('v1023 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+'<script data-ct-android="r265-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1022','ct-android-v1023')
 .replaceAll('content="1.0.22"','content="1.0.23"')
 .replaceAll('r264-r263-post-auth-web-r541-parity','r265-r264-device-foryou-sports-f1-ui');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_23_READY web=r541-frozen android=r262-preserved f1-web-weekend+sports-first-paint+strict-foryou+phone-fit');
