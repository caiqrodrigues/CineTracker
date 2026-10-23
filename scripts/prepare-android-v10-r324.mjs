import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android-only overlay on the proven signed r323 runtime. No Web/SQL changes.
const root=resolve(process.cwd());
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const oldTag='<script data-ct-android="r323-android-stable-js">';
let html=await readFile(target,'utf8').catch(()=>null);
if(!html?.includes(oldTag)){
 execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r323.mjs')],{
  cwd:root,stdio:'inherit'
 });
 html=await readFile(target,'utf8');
}
const start=html.indexOf(oldTag),end=start<0?-1:html.indexOf('</script>',start+oldTag.length);
if(start<0||end<=start)throw Error('Official r323 runtime not found');
let js=html.slice(start+oldTag.length,end);
function once(before,after,label){
 const count=js.split(before).length-1;
 if(count!==1)throw Error('Android r324 '+label+': expected one anchor, got '+count);
 js=js.replace(before,after);
}
once("const REVISION='r323-android-official-1.0';",
 "const REVISION='r324-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10124;',
 'window.__ctAndroidOfficialCode=10125;','internal version');
const patch=(await readFile(resolve(root,'apps/android/runtime-r324-home-premieres.js'),'utf8')).trim();
for(const marker of ['ct324LatestAired','ct324WasCaught','ct324PreviousClassify',
 'ct324PreviousRefresh','window.__ctR324Premieres=']){
 if(!patch.includes(marker))throw Error('Android r324 missing '+marker);
}
once('const formerRender=renderHome;\nrenderHome=async function(seq){',
 patch+'\nconst formerRender=renderHome;\nrenderHome=async function(seq){',
 'patch only the r306 series reconciler');
new Function(js);
html=html.slice(0,start)+'<script data-ct-android="r324-android-stable-js">'+js+
 '</script>'+html.slice(end+'</script>'.length);
await writeFile(target,html,'utf8');
console.log('ANDROID_1_0_R324_READY: newly aired seasons return to Continue; Web and all unrelated Android modules unchanged.');
