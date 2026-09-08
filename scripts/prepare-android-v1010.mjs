import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1009.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r251-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 1.0.10 requires r251/1.0.9 runtime');
let js=html.slice(a+marker.length,b);
const patch=await readFile(resolve(root,'apps/web/runtime-r216-v110-real-regressions.js'),'utf8');
for(const m of ["window.__ctR216RealRegressions='foryou-f1-rewatch-history-mobile-layout'",'data-ct216-rewatch','__ctV110GetF1'])if(!patch.includes(m))throw new Error('Android 1.0.10 patch missing '+m);

const oldRec="async function loadRecState(force=false){if(!force&&Date.now()-recAt<15000)return recState;try{const x=await rpc('cinetracker_recommendation_state_v107',{});if(x&&typeof x==='object')recState=x;recAt=Date.now()}catch{}return recState}";
const newRec="async function loadRecState(force=false){if(!force&&Date.now()-recAt<15000)return recState;try{const x=await Promise.race([rpc('cinetracker_recommendation_state_v107',{}),new Promise(r=>setTimeout(()=>r(null),3500))]);if(x&&typeof x==='object')recState=x;recAt=Date.now()}catch{}return recState}";
if(!js.includes(oldRec))throw new Error('Android 1.0.10 could not locate recommendation blocker');
js=js.replace(oldRec,newRec);
const f1Start=js.indexOf('async function getF1(force=false){'),f1End=f1Start<0?-1:js.indexOf('\nconst standings=',f1Start);
if(f1Start<0||f1End<f1Start)throw new Error('Android 1.0.10 could not locate F1 loader');
const f1Fn="async function getF1(force=false){if(!force&&f1Data&&Date.now()-f1At<300000)return f1Data;const season=new Date().getFullYear();try{const d=await edge('cinetracker-f1-v1',{season},30000);if(!d||!Array.isArray(d.races))throw new Error('F1 sem calendário');f1Data=d;f1At=Date.now();try{localStorage.setItem('ct:v110:f1:'+season,JSON.stringify({at:f1At,data:d}))}catch{}return f1Data}catch(err){try{const hit=JSON.parse(localStorage.getItem('ct:v110:f1:'+season)||'null');if(hit?.data){f1Data=hit.data;f1At=Number(hit.at||0);return f1Data}}catch{}throw err}}";
js=js.slice(0,f1Start)+f1Fn+js.slice(f1End);
if(!js.includes('\nboot();'))throw new Error('Android 1.0.10 boot point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
js=js
 .replaceAll('r251-android-official-1.0.9','r252-android-official-1.0.10')
 .replaceAll('CineTracker • v1.0.9','CineTracker • v1.0.10')
 .replaceAll("window.__ctOfficialVersion='1.0.9'","window.__ctOfficialVersion='1.0.10'")
 .replaceAll("window.__ctAndroidOfficialVersion='1.0.9'","window.__ctAndroidOfficialVersion='1.0.10'")
 .replaceAll('window.__ctAndroidOfficialCode=10051','window.__ctAndroidOfficialCode=10052')
 .replaceAll("window.__ctAndroidRelease='1.0.9'","window.__ctAndroidRelease='1.0.10'");
html=html.slice(0,a)+`<script data-ct-android="r252-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('content="1.0.9"','content="1.0.10"').replaceAll('ct-android-v1009','ct-android-v1010').replaceAll('r251-canonical-home-no-history','r252-real-regressions');
for(const good of ["const REVISION='r252-android-official-1.0.10';","window.__ctAndroidOfficialVersion='1.0.10'",'window.__ctAndroidOfficialCode=10052',"window.__ctR216RealRegressions='foryou-f1-rewatch-history-mobile-layout'",'data-ct216-rewatch',"edge('cinetracker-f1-v1',{season},30000)","setTimeout(()=>r(null),3500)","grid-template-columns:minmax(0,1fr)"])
 if(!html.includes(good))throw new Error('Android 1.0.10 final runtime missing '+good);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_1_0_10_READY runtime=r252 video=1001745761 fixes=foryou+f1+rewatch+layout');
