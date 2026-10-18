import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1029.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r271-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Android r272 requires v1.0.29 owner');
let js=html.slice(a+tag.length,b);
function once(oldText,newText,label){const n=js.split(oldText).length-1;if(n!==1)throw Error('r272 '+label+': '+n);js=js.replace(oldText,newText)}
once("const REVISION='r271-android-official-1.0.29';","const REVISION='r272-android-official-1.0.30';",'revision');
once("window.__ctWebBuild='1.0.29';window.__ctOfficialVersion='1.0.29';window.__ctAndroidOfficialVersion='1.0.29';window.__ctAndroidOfficialCode=10071;",
"window.__ctWebBuild='1.0.30';window.__ctOfficialVersion='1.0.30';window.__ctAndroidOfficialVersion='1.0.30';window.__ctAndroidOfficialCode=10072;",'version');
js=js.replaceAll('CineTracker • v1.0.29','CineTracker • v1.0.30')
 .replaceAll("JSON.stringify({version:'1.0.29',revision:REVISION","JSON.stringify({version:'1.0.30',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.29'","window.__ctAndroidRelease='1.0.30'");
const patch=await readFile(resolve(root,'apps/android/runtime-r272-v1030-history-authority.js'),'utf8');
for(const token of ['__ctR272AndroidV1030','mergeHistory272','cinetracker_home_movie_history_v323','watchPosters','ct186ContextValue'])if(!patch.includes(token))throw Error('missing feature '+token);
for(const denied of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(denied))throw Error('forbidden code '+denied);
if(!js.includes('\nboot();'))throw Error('boot injection missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r272-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1029','ct-android-v1030').replaceAll('content="1.0.29"','content="1.0.30"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_30_READY all 948 movie legacy history + real October replays, lazy posters after history paging, sports no scroll and secure ForYou');
