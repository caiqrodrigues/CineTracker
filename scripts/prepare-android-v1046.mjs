import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1045.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r287-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Android r287 baseline unavailable');
let js=html.slice(a+tag.length,b);
const replace=(from,to,label)=>{
 const found=js.split(from).length-1;
 if(found!==1)throw Error(label+': expected one match, found '+found);
 js=js.replace(from,to);
};
replace("const REVISION='r287-android-official-1.0.45';",
 "const REVISION='r288-android-official-1.0.46';",'revision');
replace("window.__ctWebBuild='1.0.45';window.__ctOfficialVersion='1.0.45';window.__ctAndroidOfficialVersion='1.0.45';window.__ctAndroidOfficialCode=10087;",
 "window.__ctWebBuild='1.0.46';window.__ctOfficialVersion='1.0.46';window.__ctAndroidOfficialVersion='1.0.46';window.__ctAndroidOfficialCode=10088;",'metadata');
// Newer TMDB owner from r282 was still repainting its own audited but
// non-canonical pools after r284 had already shown authentic v421 data.
replace("  recommendationData=next;\n  if(isForYou())renderData(next);",
 "  next.__ct288Canonical=true;\n  recommendationData=next;\n  if(isForYou())renderData(next);",'canonical final database owner');
const special=(await readFile(resolve(root,'apps/android/runtime-r288-v1046-special-home.js'),'utf8')).trim();
const discover=(await readFile(resolve(root,'apps/android/runtime-r288-v1046-foryou-stability.js'),'utf8')).trim();
new Function(special);new Function(discover);
for(const x of [special,discover]){
 for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)'])
  if(x.includes(bad))throw Error('Forbidden runtime action '+bad);
}
const marker='window.__ctAndroidV1021={version:';
const i=js.indexOf(marker);
if(i<0||js.indexOf(marker,i+1)!==-1)throw Error('r263 closure unique insertion marker unavailable');
const closure=js.indexOf('\n})();\n\n/* r264:',i);
if(closure<i)throw Error('r263 closure end unavailable');
const safeSpecial='/* r288 guarded scoped Home module repair */\ntry{\n'+special+
 '\n}catch(error){document.documentElement.dataset.ct288SpecialStartError=String(error?.message||error);console.error(error)}\n';
js=js.slice(0,i)+safeSpecial+js.slice(i);
if(js.indexOf(safeSpecial)>js.indexOf('\n})();\n\n/* r264:'))throw Error('special patch escaped r263 closure');
replace('\nboot();','\n'+discover+'\nboot();','final Discover owner');
js=js.replaceAll('CineTracker • v1.0.45','CineTracker • v1.0.46')
 .replaceAll("JSON.stringify({version:'1.0.45',revision:REVISION","JSON.stringify({version:'1.0.46',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.45'","window.__ctAndroidRelease='1.0.46'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r288-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1045','ct-android-v1046').replaceAll('content="1.0.45"','content="1.0.46"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_46_READY canonical v525 Discover + stable WWE F1 UFC + compact mark button; Web r541 frozen');
