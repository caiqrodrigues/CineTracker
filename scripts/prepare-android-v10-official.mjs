import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

// Official Android 1.0 promotion. Runtime behavior is BYTE-FOR-BYTE
// equivalent to Android 1.0.61/r303 apart from presentation/version metadata.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1061.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const oldTag='<script data-ct-android="r303-android-js">';
const a=html.indexOf(oldTag),b=a<0?-1:html.indexOf('</script>',a+oldTag.length);
if(a<0||b<=a)throw Error('CineTracker Android 1.0.61 certified runtime absent');
const original=html.slice(a+oldTag.length,b);
let js=original;
function exactlyOnce(from,to,label){
 const matches=js.split(from).length-1;
 if(matches!==1)throw Error('Android 1.0 stable '+label+': expected one marker, got '+matches);
 js=js.replace(from,to);
}
exactlyOnce("const REVISION='r303-android-official-1.0.61';","const REVISION='r303-android-official-1.0';",'build identity');
exactlyOnce("window.__ctWebBuild='1.0.61';window.__ctOfficialVersion='1.0.61';window.__ctAndroidOfficialVersion='1.0.61';window.__ctAndroidOfficialCode=10103;",
 "window.__ctWebBuild='1.0';window.__ctOfficialVersion='1.0';window.__ctAndroidOfficialVersion='1.0';window.__ctAndroidOfficialCode=10104;",'internal version');
const optionalReplacements=[
 ['CineTracker • v1.0.61','CineTracker • v1.0'],
 ["JSON.stringify({version:'1.0.61',revision:REVISION","JSON.stringify({version:'1.0',revision:REVISION"],
 ["window.__ctAndroidRelease='1.0.61'","window.__ctAndroidRelease='1.0'"]
];
for(const [oldValue,newValue] of optionalReplacements)js=js.replaceAll(oldValue,newValue);
new Function(js);
let normalized=js;
for(const [oldValue,newValue] of [...optionalReplacements].reverse())normalized=normalized.replaceAll(newValue,oldValue);
normalized=normalized.replace("window.__ctWebBuild='1.0';window.__ctOfficialVersion='1.0';window.__ctAndroidOfficialVersion='1.0';window.__ctAndroidOfficialCode=10104;",
 "window.__ctWebBuild='1.0.61';window.__ctOfficialVersion='1.0.61';window.__ctAndroidOfficialVersion='1.0.61';window.__ctAndroidOfficialCode=10103;");
normalized=normalized.replace("const REVISION='r303-android-official-1.0';","const REVISION='r303-android-official-1.0.61';");
if(normalized!==original)throw Error('Official promotion would modify functional JavaScript');
html=html.slice(0,a)+'<script data-ct-android="r303-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('content="1.0.61"','content="1.0"');
if(!html.includes('name="ct-official-version" content="1.0"'))throw Error('Android 1.0 branding missing');
await writeFile(file,html,'utf8');
console.log('CINETRACKER_ANDROID_1_0_STABLE_READY: r303 functional JS identical to 1.0.61; stable identity 1.0; versionCode 10104; no Web, DB or feature change.');
