import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1024.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r266-android-js">';
const at=html.indexOf(marker),close=html.indexOf('</script>',at+marker.length);
if(at<0||close<at)throw new Error('Android 1.0.25 baseline missing');
let js=html.slice(at+marker.length,close);
function one(from,to,label){
 const n=js.split(from).length-1;
 if(n!==1)throw new Error('1.0.25 '+label+' expected one anchor, found '+n);
 js=js.replace(from,to);
}
one("const REVISION='r266-android-official-1.0.24';","const REVISION='r267-android-official-1.0.25';",'revision');
one("window.__ctWebBuild='1.0.24';window.__ctOfficialVersion='1.0.24';window.__ctAndroidOfficialVersion='1.0.24';window.__ctAndroidOfficialCode=10066;",
"window.__ctWebBuild='1.0.25';window.__ctOfficialVersion='1.0.25';window.__ctAndroidOfficialVersion='1.0.25';window.__ctAndroidOfficialCode=10067;",'version code');
js=js.replaceAll('CineTracker • v1.0.24','CineTracker • v1.0.25')
.replaceAll("JSON.stringify({version:'1.0.24',revision:REVISION","JSON.stringify({version:'1.0.25',revision:REVISION")
.replaceAll("window.__ctAndroidRelease='1.0.24'","window.__ctAndroidRelease='1.0.25'");
const source=await readFile(resolve(root,'apps/android/runtime-r267-v1025-f1-canonical.js'),'utf8');
const f1Body=source.slice(0,source.indexOf('//__CT267_END_BODY__')).trim();
const f1Shell=source.slice(source.indexOf('//__CT267_END_BODY__')+'//__CT267_END_BODY__'.length,source.indexOf('//__CT267_END_SHELL__')).trim();
if(!f1Body.startsWith('function bodyF111(d,tab){')||!f1Shell.startsWith('function ensureF111Shell(){'))throw new Error('F1 direct-owner definitions invalid');
function replaceBetween(start,end,replacement,label){
 const a=js.indexOf(start),b=a<0?-1:js.indexOf(end,a+start.length);
 if(a<0||b<=a||js.indexOf(start,a+1)!==-1)throw new Error('Missing/duplicate '+label);
 js=js.slice(0,a)+replacement+'\n'+js.slice(b);
}
replaceBetween('function bodyF111(d,tab){','function ensureF111Shell(){',f1Body,'F1 old mixed seven-tab body');
replaceBetween('function ensureF111Shell(){','async function paintF111(force=false){',f1Shell,'F1 old mixed seven-tab toolbar');
const oldReplenish='/* The r265 recommendation wrapper clears the fallback pools after the first';
const afterReplenish='/* Show a separate, REAL attended-at-stadium metric.';
replaceBetween(oldReplenish,afterReplenish,'/* Deprecated r266 movie-only top-up: replaced by r267 independent 3-category top-up. */','old movie-only topup');
one('window.__ctR266Test={stadiumSync,stadiumPanel,replenish};','window.__ctR266Test={stadiumSync,stadiumPanel};','removed old replenish export');
const patch=await readFile(resolve(root,'apps/android/runtime-r267-v1025-refill-and-layout.js'),'utf8');
for(const must of ['window.__ctR267AndroidV1025','refillKind','grid-template-columns:repeat(2,minmax(0,1fr))','ct267-f1-hub'])if(!patch.includes(must))throw new Error('Android 1.0.25 required '+must);
for(const denied of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(denied))throw new Error('1.0.25 forbidden operation '+denied);
if(!js.includes('\nboot();'))throw new Error('1.0.25 boot anchor missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,at)+'<script data-ct-android="r267-android-js">'+js+'</script>'+html.slice(close+'</script>'.length);
html=html.replaceAll('ct-android-v1024','ct-android-v1025').replaceAll('content="1.0.24"','content="1.0.25"').replaceAll('r266-r265-video-foryou-stadium-episodes','r267-f1-single-owner-seven-slots-sports-2x1');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_25_READY canonical F1 four tabs, 3-kind independent recommendations, 2+wide sports stats, Web r541 frozen');
