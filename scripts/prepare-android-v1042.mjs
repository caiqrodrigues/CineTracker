import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1041.mjs')],{cwd:root,stdio:'inherit'});
const location=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(location,'utf8');
const tag='<script data-ct-android="r283-android-js">';
const first=html.indexOf(tag),last=first<0?-1:html.indexOf('</script>',first+tag.length);
if(first<0||last<first)throw Error('Android r283 frozen baseline unavailable');
let js=html.slice(first+tag.length,last);
function exactly(from,to,label){
 const count=js.split(from).length-1;
 if(count!==1)throw Error('r284 '+label+' unexpected anchors: '+count);
 js=js.replace(from,to);
}
exactly("const REVISION='r283-android-official-1.0.41';","const REVISION='r284-android-official-1.0.42';",'revision');
exactly("window.__ctWebBuild='1.0.41';window.__ctOfficialVersion='1.0.41';window.__ctAndroidOfficialVersion='1.0.41';window.__ctAndroidOfficialCode=10083;",
"window.__ctWebBuild='1.0.42';window.__ctOfficialVersion='1.0.42';window.__ctAndroidOfficialVersion='1.0.42';window.__ctAndroidOfficialCode=10084;",'version');
exactly("window.__ctR265Test?.allowed?.(x)===true&&ct186Quality(x)&&!ct186LocalBlocked.has(ct186Key(x))",
"window.__ctR265Test?.allowed?.(x)===true&&(watch||ct186Quality(x))&&!ct186LocalBlocked.has(ct186Key(x))",
'allow eligible watchlist movie regardless of popularity rating');
exactly("if(typeof allowed!=='function'||!allowed(x)||!ct186Quality(x)||ct186LocalBlocked.has(ct186Key(x)))return false;",
"if(typeof allowed!=='function'||!allowed(x)||(!watchKind(key)&&!ct186Quality(x))||ct186LocalBlocked.has(ct186Key(x)))return false;",
'keep r277 watchlist eligible without fresh-only popularity threshold');
js=js.replaceAll('CineTracker • v1.0.41','CineTracker • v1.0.42')
 .replaceAll("JSON.stringify({version:'1.0.41',revision:REVISION","JSON.stringify({version:'1.0.42',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.41'","window.__ctAndroidRelease='1.0.42'");
const patch=await readFile(resolve(root,'apps/android/runtime-r284-v1042-movies-foryou.js'),'utf8');
new Function(patch);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(patch.includes(bad))throw Error('r284 disallowed: '+bad);
if(!js.includes('\nboot();'))throw Error('r284 boot anchor unavailable');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,first)+'<script data-ct-android="r284-android-js">'+js+'</script>'+html.slice(last+'</script>'.length);
html=html.replaceAll('ct-android-v1041','ct-android-v1042').replaceAll('content="1.0.41"','content="1.0.42"');
await writeFile(location,html,'utf8');
console.log('ANDROID_1_0_42_READY DB-paged movie history + v421/v525-for-you verified; Web r541 frozen');
