import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android official 1.0/r318: repair only the recursive non-ForYou delegate.
// Build from r317; retain its audited seven-slot recommendations, and all
// Home, Sports, Profile, F1, SQL and Web functionality unchanged.
const root=resolve(process.cwd());
const source=await readFile(resolve(root,'apps/android/runtime-r270-v1028-profile-foryou-history.js'),'utf8');
const capture='const previousDiscoverRows270=discoverRows;';
const delegate="discoverRows=async function(tab){return String(tab)==='foryou'?startRec(false):previousDiscoverRows270(tab)};";
if(source.split(capture).length!==2||source.split(delegate).length!==2||
   source.indexOf(capture)>=source.indexOf(delegate))
 throw Error('r318 regression: non-ForYou base delegate must be captured BEFORE overriding discoverRows');
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r317.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r317-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Official Android 1.0/r317 compiled baseline missing');
let js=html.slice(a+tag.length,b);
if(js.split(capture).length!==2||js.split(delegate).length!==2||
  js.indexOf(capture)>js.indexOf(delegate))
 throw Error('Recursive Discover delegate still present in compiled APK runtime');
const previous="const REVISION='r317-android-official-1.0';";
const next="const REVISION='r318-android-official-1.0';";
if(js.split(previous).length!==2)throw Error('r317 revision mismatch');
js=js.replace(previous,next);
const previousCode='window.__ctAndroidOfficialCode=10118;';
if(js.split(previousCode).length!==2)throw Error('r317 Android code mismatch');
js=js.replace(previousCode,'window.__ctAndroidOfficialCode=10119;');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r318-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_R318_READY: fixed r270 accidental recursion; non-ForYou tabs delegate once to old discoverRows; other Android flows and v525 audit preserved.');
