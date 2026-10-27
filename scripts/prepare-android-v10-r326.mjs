import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const oldTag='<script data-ct-android="r325-android-stable-js">';
const newTag='<script data-ct-android="r326-android-stable-js">';
let html=await readFile(target,'utf8').catch(()=>null);
if(!html?.includes(oldTag)&&!html?.includes(newTag)){
 execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r325.mjs')],{
  cwd:root,stdio:'inherit'
 });
 html=await readFile(target,'utf8');
}
if(html.includes(newTag)){
 const start=html.indexOf(newTag),end=html.indexOf('</script>',start+newTag.length);
 if(end<0)throw Error('Broken r326 script block');
 const js=html.slice(start+newTag.length,end);
 const marker='/* CineTracker Android 1.0 / r326 — media-only ZIP of CSV files, Bingers-style.';
 const at=js.lastIndexOf(marker);
 if(at<0)throw Error('Missing r326 media ZIP module');
 const patch=(await readFile(resolve(root,'apps/android/runtime-r326-media-export.js'),'utf8')).trim();
 const updated=js.slice(0,at)+patch+'\n';
 new Function(updated);
 await writeFile(target,html.slice(0,start)+newTag+updated+html.slice(end),'utf8');
 console.log('ANDROID_1_0_R326_REPREPARED');process.exit(0);
}
const start=html.indexOf(oldTag),end=start<0?-1:html.indexOf('</script>',start+oldTag.length);
if(start<0||end<=start)throw Error('Official Android r325 runtime is missing');
let js=html.slice(start+oldTag.length,end);
function replaceOnce(a,b,label){
 const count=js.split(a).length-1;if(count!==1)throw Error('Android r326 '+label+': expected one anchor, got '+count);
 js=js.replace(a,b);
}
replaceOnce("const REVISION='r325-android-official-1.0';",
 "const REVISION='r326-android-official-1.0';",'revision');
replaceOnce('window.__ctAndroidOfficialCode=10126;',
 'window.__ctAndroidOfficialCode=10127;','internal version');
const patch=(await readFile(resolve(root,'apps/android/runtime-r326-media-export.js'),'utf8')).trim();
for(const marker of ['zipCsv','buildFiles','CineTrackerNative.exportBackup','window.__ctR326MediaExport='])
 if(!patch.includes(marker))throw Error('Missing Android media ZIP feature '+marker);
js+='\n'+patch+'\n';
new Function(js);
html=html.slice(0,start)+newTag+js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(target,html,'utf8');
console.log('ANDROID_1_0_R326_READY: Android-only CSV ZIP for films, series and episode history; no sports.');
