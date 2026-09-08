import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1011.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r253-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.12 requires r253/1.0.11 prepared base');
let js=html.slice(a+marker.length,b);
for(const must of [
 "const REVISION='r253-android-official-1.0.11';",
 "window.__ctR217Consolidated='v111-r204-r243-single-release-authority'",
 "window.__ctAndroidOfficialCode=10053",
 "window.__ctV111Top10='three-complete-cards-mobile'"
])if(!js.includes(must))throw new Error('Android 1.0.12 lost 1.0.11 prerequisite '+must);
const patch=await readFile(resolve(root,'apps/web/runtime-r218-v112-foryou-f1-profile.js'),'utf8');
for(const must of [
 "window.__ctR218V112='foryou-strict-f1-cors-profile-three-cards'",
 "window.__ctV112ForYou='fresh-never-known-never-repeat-watchlist-not-started-30d'",
 "window.__ctV112F1='browser-cors-preflight-v5'",
 "window.__ctV112Profile='three-complete-cards-mobile'",
 'grid-auto-columns:calc((100% - 16px)/3)'
])if(!patch.includes(must))throw new Error('Android 1.0.12 patch missing '+must);
if(!js.includes('\nboot();'))throw new Error('Android 1.0.12 boot point missing');
const once=(s,x,y,label)=>{const n=s.split(x).length-1;if(n!==1)throw new Error(`Android 1.0.12 expected one ${label}, found ${n}`);return s.replace(x,y)};
js=once(js,"const REVISION='r253-android-official-1.0.11';","const REVISION='r254-android-official-1.0.12';",'revision');
js=once(js,"window.__ctWebBuild='1.0.11';window.__ctOfficialVersion='1.0.11';window.__ctAndroidOfficialVersion='1.0.11';window.__ctAndroidOfficialCode=10053;","window.__ctWebBuild='1.0.12';window.__ctOfficialVersion='1.0.12';window.__ctAndroidOfficialVersion='1.0.12';window.__ctAndroidOfficialCode=10054;",'identity');
js=js.replaceAll('CineTracker • v1.0.11','CineTracker • v1.0.12').replaceAll("JSON.stringify({version:'1.0.11',revision:REVISION","JSON.stringify({version:'1.0.12',revision:REVISION").replaceAll("window.__ctAndroidRelease='1.0.11'","window.__ctAndroidRelease='1.0.12'");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r254-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1011','ct-android-v1012').replaceAll('content="1.0.11"','content="1.0.12"').replaceAll('r253-r243-consolidated-r217','r254-r253-plus-r218');
for(const must of ["const REVISION='r254-android-official-1.0.12';","window.__ctAndroidOfficialCode=10054","window.__ctR218V112='foryou-strict-f1-cors-profile-three-cards'",'grid-auto-columns:calc((100% - 16px)/3)'])if(!html.includes(must))throw new Error('Android 1.0.12 final runtime missing '+must);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_1_0_12_READY base=r253 runtime=r254 foryou=strict f1=cors-v5 profile=3-complete');
