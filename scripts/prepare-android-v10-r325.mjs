import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Native Android 1.0 overlay. Existing Web and Supabase files are untouched.
const root=resolve(process.cwd());
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const oldTag='<script data-ct-android="r324-android-stable-js">';
const newTag='<script data-ct-android="r325-android-stable-js">';
let html=await readFile(target,'utf8').catch(()=>null);
if(!html?.includes(oldTag)&&!html?.includes(newTag)){
 execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r324.mjs')],{
  cwd:root,stdio:'inherit'
 });
 html=await readFile(target,'utf8');
}
if(html?.includes(newTag)){
 console.log('ANDROID_1_0_R325_ALREADY_PREPARED');process.exit(0);
}
const start=html.indexOf(oldTag),end=start<0?-1:html.indexOf('</script>',start+oldTag.length);
if(start<0||end<=start)throw Error('Android r324 embedded runtime is missing');
let js=html.slice(start+oldTag.length,end);
function once(before,after,label){
 const count=js.split(before).length-1;
 if(count!==1)throw Error('Android r325 '+label+': expected one anchor, got '+count);
 js=js.replace(before,after);
}
once("const REVISION='r324-android-official-1.0';",
 "const REVISION='r325-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10125;',
 'window.__ctAndroidOfficialCode=10126;','internal version');
const singleOwner=(await readFile(resolve(root,'apps/android/runtime-r325-series-single-owner.js'),'utf8')).trim();
const profile=(await readFile(resolve(root,'apps/android/runtime-r325-profile-immediate-sync.js'),'utf8')).trim();
for(const marker of ['ct325Watched','ct325QueueFrontiers','cinetracker_home_series_watch_state_v4','window.__ctR325Series'])
 if(!singleOwner.includes(marker))throw Error('Android r325 Home patch missing '+marker);
for(const marker of ['ct168MergeQuick','cinetracker_activity_by_day_v1','window.__ctR325Profile'])
 if(!profile.includes(marker))throw Error('Android r325 Profile patch missing '+marker);
once("scope:'Home Séries and Historico only'};\n})();",
 "scope:'Home Séries and Historico only'};\n"+singleOwner+'\n})();',
 'r306 private authenticated Home owner');
js+='\n'+profile+'\n';
new Function(js);
html=html.slice(0,start)+newTag+js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(target,html,'utf8');
console.log('ANDROID_1_0_R325_READY: Home series episode reconciliation and Profile immediate sync; Web frozen.');
