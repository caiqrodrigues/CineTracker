import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1021.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r263-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('v1022 needs validated v1021');
let js=html.slice(a+marker.length,b);
const once=(before,after,label)=>{
 const n=js.split(before).length-1;
 if(n!==1)throw new Error('Android v1022 '+label+': expected 1 occurrence, got '+n);
 js=js.replace(before,after);
};
once("const view=homeView263(kind);if(!view)return null;\n const sections=qa263(':scope > section',view);",
 "const view=q263('[data-home-viewport=\"'+kind+'\"] .home-start');if(!view)return null;\n const sections=qa263(':scope > section',view);",'Home actual target');
once("const v=homeView263('series');if(!v)return null;return qa263(':scope > section',v).find",
 "const v=q263('[data-home-viewport=\"series\"] .home-start');if(!v)return null;return qa263(':scope > section',v).find",'special series actual bucket');
const start=js.indexOf('function requestAnchor263(kind){'),end=js.indexOf('function cancelAnchor263(){',start);
if(start<0||end<start)throw new Error('v1022 base anchor missing');
js=js.slice(0,start)+[
 "function requestAnchor263(kind){",
 " const k=kind==='movies'?'movies':'series',st=anchor263[k],g=++st.generation;",
 " st.done=false;st.applied=false;st.cancelled=false;activeHome263=k;",
 " let attempts=0;",
 " const run=()=>{",
 "  if(g!==st.generation||st.done||st.cancelled||route263()!=='home')return;",
 "  const v=q263('[data-home-viewport=\"'+k+'\"]'),hist=v&&q263(':scope > .home-history',v),main=v&&q263(':scope > .home-start',v);",
 "  if(!v||!hist||!main||v.closest('.hidden')){if(++attempts<12)requestAnimationFrame(run);return}",
 "  v.scrollTop=Math.max(0,main.offsetTop-hist.offsetTop);",
 "  st.applied=true;st.done=true;v.dataset.ct263Anchor=k;",
 " };",
 " requestAnimationFrame(run);",
 "}"
].join('\n')+'\n'+js.slice(end);
once("special263.currentTask=(async()=>{const y=new Date().getFullYear(),day=today263()",
 "special263.currentTask=(async()=>{if(!(await waitSession263()))return special263.current;const y=new Date().getFullYear(),day=today263()",
 'post-auth series load');
once("const REVISION='r263-android-official-1.0.21';","const REVISION='r264-android-official-1.0.22';",'revision');
once("window.__ctWebBuild='1.0.21';window.__ctOfficialVersion='1.0.21';window.__ctAndroidOfficialVersion='1.0.21';window.__ctAndroidOfficialCode=10063;",
 "window.__ctWebBuild='1.0.22';window.__ctOfficialVersion='1.0.22';window.__ctAndroidOfficialVersion='1.0.22';window.__ctAndroidOfficialCode=10064;",'identity');
js=js.replaceAll('CineTracker • v1.0.21','CineTracker • v1.0.22')
 .replaceAll("JSON.stringify({version:'1.0.21',revision:REVISION","JSON.stringify({version:'1.0.22',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.21'","window.__ctAndroidRelease='1.0.22'");
const patch=await readFile(resolve(root,'apps/android/runtime-r264-v1022-integration.js'),'utf8');
for(const need of ["window.__ctR264AndroidV1022='auth+android-scroll+foryou-pools+native-preserved'","ct186Select(data)","window.__ctAndroidV1022={version:'1.0.22'"])if(!patch.includes(need))throw new Error('v1022 patch incomplete '+need);
if(!js.includes('\nboot();'))throw new Error('v1022 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+'<script data-ct-android="r264-android-js">'+js+'</script>'+html.slice(b+9);
html=html.replaceAll('ct-android-v1021','ct-android-v1022').replaceAll('content="1.0.21"','content="1.0.22"').replaceAll('r263-r262-plus-web-r541-parity','r264-r263-post-auth-web-r541-parity');
for(const need of ["window.__ctAndroidOfficialCode=10064","cinetracker_special_series_counts_v540","__ctR264AndroidV1022","data-home-viewport"])if(!html.includes(need))throw new Error('v1022 runtime incomplete '+need);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_22_READY web=r541-frozen native=r262-preserved home-auth-special-discover-profile');
