import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1047.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r289-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Missing validated Android 1.0.47 runtime');
let js=html.slice(a+tag.length,b);
const swap=(oldValue,newValue,label)=>{
 const count=js.split(oldValue).length-1;
 if(count!==1)throw Error('r290 '+label+' expected one anchor, found '+count);
 js=js.replace(oldValue,newValue);
};
swap("const REVISION='r289-android-official-1.0.47';",
 "const REVISION='r290-android-official-1.0.48';",'revision');
swap("window.__ctWebBuild='1.0.47';window.__ctOfficialVersion='1.0.47';window.__ctAndroidOfficialVersion='1.0.47';window.__ctAndroidOfficialCode=10089;",
 "window.__ctWebBuild='1.0.48';window.__ctOfficialVersion='1.0.48';window.__ctAndroidOfficialVersion='1.0.48';window.__ctAndroidOfficialCode=10090;",'metadata');
const sources=await Promise.all([
 'apps/android/runtime-r290-v1048-home-parity.js',
 'apps/android/runtime-r290-v1048-profile-order.js',
 'apps/android/runtime-r290-v1048-nfl-superbowl.js',
 'apps/android/runtime-r290-v1048-discover-owner.js'
].map(p=>readFile(resolve(root,p),'utf8')));
for(const src of sources){
 new Function(src);
 for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
  if(src.includes(bad))throw Error('r290 forbidden operation '+bad);
}
const guarded=(src,id)=>'/* r290 '+id+' guarded extension */\ntry{\n'+src+
 '\n}catch(error){document.documentElement.dataset.ct290'+id+'StartupError=String(error?.message||error);console.error(error)}\n';
const specialScope=js.indexOf('window.__ctAndroidV1021={version:');
const scopeEnd=js.indexOf('\n})();\n\n/* r264:',specialScope);
if(specialScope<0||scopeEnd<specialScope)throw Error('r263 scope missing');
swap('window.__ctAndroidV1021={version:',guarded(sources[0],'Home')+'window.__ctAndroidV1021={version:','r263 special Home');
if(js.indexOf('window.__ctR290Home')>js.indexOf('\n})();\n\n/* r264:'))throw Error('r290 Home patch outside private r263 scope');
const profileMarker='window.__ctR289ProfileTest={keyOf,enhance,unique,fetchItems,open,close,titles};';
swap(profileMarker,guarded(sources[1],'Profile')+profileMarker,'r289 profile modal');
const profileStart=js.indexOf('window.__ctR289Profile=');
if(js.indexOf('window.__ctR290Profile')<profileStart||js.indexOf('window.__ctR290Profile')>js.lastIndexOf('\nboot();'))throw Error('r290 Profile patch outside existing profile owner');
swap('\nboot();','\n'+guarded(sources[2],'NFL')+guarded(sources[3],'Discover')+'boot();','post-owner NFL and Discover');
js=js.replaceAll('CineTracker • v1.0.47','CineTracker • v1.0.48')
 .replaceAll("JSON.stringify({version:'1.0.47',revision:REVISION","JSON.stringify({version:'1.0.48',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.47'","window.__ctAndroidRelease='1.0.48'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r290-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1047','ct-android-v1048').replaceAll('content="1.0.47"','content="1.0.48"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_48_READY standard 3 Home cards + NFL by year + newest Profile history + v119 Watchlist sorting + seven-slot stable render, Web r541 frozen');
