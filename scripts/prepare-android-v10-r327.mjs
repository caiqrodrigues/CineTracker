import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Version 1.0 remains the public Android version; the Web/Supabase tree is untouched.
const root=resolve(process.cwd());
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const oldTag='<script data-ct-android="r326-android-stable-js">';
const newTag='<script data-ct-android="r327-android-stable-js">';
let html=await readFile(target,'utf8').catch(()=>null);
if(!html?.includes(oldTag)&&!html?.includes(newTag)){
 execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r326.mjs')],{cwd:root,stdio:'inherit'});
 html=await readFile(target,'utf8');
}
const source=(await readFile(resolve(root,'apps/android/runtime-r327-home-search-fluidity.js'),'utf8')).trim();
for(const marker of ['window.__ctR327HomeSearch=', 'function localRows(', 'function onInput(', 'function paint('])
 if(!source.includes(marker))throw Error('Android Home search module missing '+marker);
const tag=html.includes(newTag)?newTag:oldTag;
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
if(start<0||end<0)throw Error('Official Android r326 base runtime is missing');
let js=html.slice(start+tag.length,end);
const marker='/* CineTracker Android 1.0 r327 — Home search and responsive interaction.';
if(tag===newTag){
 const offset=js.lastIndexOf(marker);
 if(offset<0)throw Error('Existing Android r327 patch marker is missing');
 js=js.slice(0,offset);
}else{
 const before="const REVISION='r326-android-official-1.0';";
 const after="const REVISION='r327-android-official-1.0';";
 if(js.split(before).length!==2)throw Error('Expected one Android r326 revision marker');
 js=js.replace(before,after);
 if(js.split('window.__ctAndroidOfficialCode=10127;').length!==2)throw Error('Expected one Android r326 build code');
 js=js.replace('window.__ctAndroidOfficialCode=10127;','window.__ctAndroidOfficialCode=10128;');
}
js+='\n'+source+'\n';
new Function(js);
html=html.slice(0,start)+newTag+js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(target,html,'utf8');
console.log('CINETRACKER_ANDROID_1_0_R327_READY: Home search, progressive results and smoother interactions; Web frozen.');
