import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1046.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r288-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Android 1.0.46 baseline unavailable');
let js=html.slice(a+tag.length,b);
const replace=(before,after,label)=>{
 const found=js.split(before).length-1;
 if(found!==1)throw Error('r289 '+label+': expected 1 anchor, found '+found);
 js=js.replace(before,after);
};
replace("const REVISION='r288-android-official-1.0.46';",
 "const REVISION='r289-android-official-1.0.47';",'revision');
replace("window.__ctWebBuild='1.0.46';window.__ctOfficialVersion='1.0.46';window.__ctAndroidOfficialVersion='1.0.46';window.__ctAndroidOfficialCode=10088;",
 "window.__ctWebBuild='1.0.47';window.__ctOfficialVersion='1.0.47';window.__ctAndroidOfficialVersion='1.0.47';window.__ctAndroidOfficialCode=10089;",'metadata');
replace("const f111Stand=(x,key)=>x?.MRData?.StandingsTable?.StandingsLists?.[0]?.[key]||[];",
 "const f111Stand=(value,key)=>{if(Array.isArray(value))return value;const x=value?.MRData||value?.data?.MRData||value?.data||value;const rows=x?.StandingsTable?.StandingsLists?.[0]?.[key]||x?.StandingsLists?.[0]?.[key]||x?.standings?.[key]||x?.[key]||x?.items;return Array.isArray(rows)?rows:[]};",
 'F1 multiple valid response forms');
const f1=(await readFile(resolve(root,'apps/android/runtime-r289-v1047-f1-rankings.js'),'utf8')).trimEnd();
const home=(await readFile(resolve(root,'apps/android/runtime-r289-v1047-special-home-standard.js'),'utf8')).trimEnd();
const other=await Promise.all([
 readFile(resolve(root,'apps/android/runtime-r289-v1047-profile-drilldowns.js'),'utf8'),
 readFile(resolve(root,'apps/android/runtime-r289-v1047-discover-guard.js'),'utf8')
]);
for(const text of [f1,home,...other]){
 new Function(text);
 for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)'])
  if(text.includes(forbidden))throw Error('r289 forbidden action '+forbidden);
}
replace('function rowsF111(a,constructors=false){',
 '/* r289 F1 standings rescue, inside r111 closure */\ntry{\n'+f1+
 '\n}catch(error){document.documentElement.dataset.ct289F1StartError=String(error?.message||error);console.error(error)}\n'+
 '\nfunction rowsF111(a,constructors=false){',
 'F1 standings module scope');
replace('window.__ctAndroidV1021={version:',
 '/* r289 normalized Home rows, inside r263 closure */\ntry{\n'+home+
 '\n}catch(error){document.documentElement.dataset.ct289HomeStartupError=String(error?.message||error);console.error(error)}\nwindow.__ctAndroidV1021={version:',
 'UFC/WWE/F1 Home module scope');
// Internal event must not invalidate the authenticated pools while an
// optimistic mutation is in progress in the current seven slots.
replace("window.addEventListener('cinetracker:data-changed',()=>{\n recommendationData=null;recommendationEpoch++;",
"window.addEventListener('cinetracker:data-changed',()=>{\n if(isForYou()&&window.__ctR289DiscoverV1047&&window.__ctR288DiscoverTest?.getStable?.()){historyStamp=0;return;}\n recommendationData=null;recommendationEpoch++;",
 'targeted active Pra Voce invalidation');
// Protect the login bootstrap from unrelated UI extensions.
const wrappers=other.map((text,i)=>'try{\n'+text+
 '\n}catch(error){document.documentElement.dataset.ct289Extension'+i+'Error=String(error?.message||error);console.error(error)}');
replace('\nboot();','\n'+wrappers.join('\n')+'\nboot();','bounded outer extensions');
js=js.replaceAll('CineTracker • v1.0.46','CineTracker • v1.0.47')
 .replaceAll("JSON.stringify({version:'1.0.46',revision:REVISION","JSON.stringify({version:'1.0.47',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.46'","window.__ctAndroidRelease='1.0.47'");
new Function(js);
const closing=js.indexOf('\n})();\n\n/* r264:');
const anchor=js.indexOf('/* r289 normalized Home rows, inside r263 closure */');
if(anchor<0||closing<anchor)throw Error('Home extension unexpectedly outside r263 private scope');
html=html.slice(0,a)+'<script data-ct-android="r289-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1046','ct-android-v1047').replaceAll('content="1.0.46"','content="1.0.47"');
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_47_READY Profile history modals, reliable F1 standings, standard UFC WWE F1 Home, canonical Pra Voce; Web r541 frozen');
