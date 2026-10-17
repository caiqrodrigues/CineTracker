import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1028.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r270-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<=a)throw new Error('Android 1.0.29 requires exact 1.0.28 baseline');
let js=html.slice(a+marker.length,b);
function once(from,to,label){const count=js.split(from).length-1;if(count!==1)throw Error('r271 '+label+': expected one, found '+count);js=js.replace(from,to)}
once("const REVISION='r270-android-official-1.0.28';","const REVISION='r271-android-official-1.0.29';",'revision');
once("window.__ctWebBuild='1.0.28';window.__ctOfficialVersion='1.0.28';window.__ctAndroidOfficialVersion='1.0.28';window.__ctAndroidOfficialCode=10070;",
"window.__ctWebBuild='1.0.29';window.__ctOfficialVersion='1.0.29';window.__ctAndroidOfficialVersion='1.0.29';window.__ctAndroidOfficialCode=10071;",'version/code');
js=js.replaceAll('CineTracker • v1.0.28','CineTracker • v1.0.29')
.replaceAll("JSON.stringify({version:'1.0.28',revision:REVISION","JSON.stringify({version:'1.0.29',revision:REVISION")
.replaceAll("window.__ctAndroidRelease='1.0.28'","window.__ctAndroidRelease='1.0.29'");
/* The LIVE Android Pra Voce owner is r118 affinity, which supersedes the
   older r186 six-page function. Bound only this live owner and preserve its
   scoring/exclusion formulas. The r271 runtime fills truly empty categories. */
function affinityScope271(start,end,oldText,newText,label){
 const a=js.indexOf(start),b=a<0?-1:js.indexOf(end,a+start.length);
 if(a<0||b<=a)throw Error('r271 active affinity scope missing '+label);
 const before=js.slice(a,b);
 if(before.split(oldText).length!==2)throw Error('r271 live owner '+label+' must occur once');
 js=js.slice(0,a)+before.replace(oldText,newText)+js.slice(b);
}
affinityScope271('function seedRows118(c,kind){','async function enrichSeed118(seed){',
 '.slice(0,5);','.slice(0,2);','max two weighted affinity seeds');
affinityScope271('async function poolForKind118(c,kind){','let affinity118=null',
 'if(i<2)jobs.push','if(i<1)jobs.push','one relevant similar query per category');
const patch=await readFile(resolve(root,'apps/android/runtime-r271-v1029-history-sports-foryou.js'),'utf8');
for(const tag of ['__ctR271AndroidV1029',"window.addEventListener('click',sportsClick271,true)",'watch_history?select=id,media_id','fetchAllMovies271','ct186LoadForYou=async function'])if(!patch.includes(tag))throw Error('Android 1.0.29 missing '+tag);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])if(patch.includes(forbidden))throw Error('Forbidden '+forbidden);
if(!js.includes('\nboot();'))throw Error('missing boot anchor');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r271-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1028','ct-android-v1029').replaceAll('content="1.0.28"','content="1.0.29"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_29_READY sports watch optimistic no re-render, full verified movie history pages, cached personal recommendations, lazy posters inherited; Web r541 untouched');
