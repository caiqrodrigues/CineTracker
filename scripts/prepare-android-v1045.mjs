import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1044.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const runtime=(await readFile(resolve(root,'apps/android/runtime-r286-v1044-discover-and-special-home.js'),'utf8')).trimEnd();
let html=await readFile(path,'utf8');
const oldTag='<script data-ct-android="r286-android-js">';
const a=html.indexOf(oldTag),b=a<0?-1:html.indexOf('</script>',a+oldTag.length);
if(a<0||b<a)throw Error('Missing exact Android r286 bundle');
let js=html.slice(a+oldTag.length,b);
function exactly(before,after,description){
 const matches=js.split(before).length-1;
 if(matches!==1)throw Error(description+': expected one match, found '+matches);
 js=js.replace(before,after);
}
exactly("const REVISION='r286-android-official-1.0.44';",
 "const REVISION='r287-android-official-1.0.45';",'revision');
exactly("window.__ctWebBuild='1.0.44';window.__ctOfficialVersion='1.0.44';window.__ctAndroidOfficialVersion='1.0.44';window.__ctAndroidOfficialCode=10086;",
 "window.__ctWebBuild='1.0.45';window.__ctOfficialVersion='1.0.45';window.__ctAndroidOfficialVersion='1.0.45';window.__ctAndroidOfficialCode=10087;",'Android metadata');
// Root cause of black login in r286: special-series functions have PRIVATE
// closure scope under Android r263. The r286 patch had been inserted after
// the r263 IIFE, so mountSpecial263 did not exist during bootstrap.
exactly('\n'+runtime+'\nboot();','\nboot();','remove out-of-scope module');
const exportAnchor='window.__ctAndroidV1021={version:';
const pos=js.indexOf(exportAnchor);
if(pos<0||js.indexOf(exportAnchor,pos+1)!==-1)throw Error('r263 closure anchor ambiguous');
const closed=js.indexOf('\n})();\n\n/* r264:',pos);
if(closed<0)throw Error('r263 closure not found');
const startupSafe='/* r287: r286 actions executed WITHIN r263 module scope. */\n'+
 'try{\n'+runtime+'\nwindow.__ctR287AndroidV1045="bootstrap-fixed-r263-private-scope";\n}'+
 'catch(error){document.documentElement.dataset.ct287StartupError=String(error?.message||error);'+
 'console.error("Android special module guarded; login preserved",error)}\n';
js=js.slice(0,pos)+startupSafe+js.slice(pos);
if(js.indexOf(startupSafe)>closed||js.indexOf('window.__ctR287AndroidV1045')>js.indexOf('\n})();\n\n/* r264:'))throw Error('Special patch outside r263 closure');
js=js.replaceAll('CineTracker • v1.0.44','CineTracker • v1.0.45')
 .replaceAll("JSON.stringify({version:'1.0.44',revision:REVISION","JSON.stringify({version:'1.0.45',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.44'","window.__ctAndroidRelease='1.0.45'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r287-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1044','ct-android-v1045').replaceAll('content="1.0.44"','content="1.0.45"');
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_45_READY r286 special-module scope fixed, login bootstrap guarded, Web r541 frozen');
