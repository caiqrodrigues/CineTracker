import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1051.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r293-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Missing validated Android v1.0.51 baseline');
let js=html.slice(a+tag.length,b);
function change(from,to,label){
 const matches=js.split(from).length-1;
 if(matches!==1)throw Error('Android r294 '+label+': expected one marker, found '+matches);
 js=js.replace(from,to);
}
change("const REVISION='r293-android-official-1.0.51';",
 "const REVISION='r294-android-official-1.0.52';",'version');
change("window.__ctWebBuild='1.0.51';window.__ctOfficialVersion='1.0.51';window.__ctAndroidOfficialVersion='1.0.51';window.__ctAndroidOfficialCode=10093;",
 "window.__ctWebBuild='1.0.52';window.__ctOfficialVersion='1.0.52';window.__ctAndroidOfficialVersion='1.0.52';window.__ctAndroidOfficialCode=10094;",'metadata');
// Repair the real r293 gate in isolation. A Watchlist with only 4 occupied
// slots must not abandon the lock because one of the 7 swap buttons is empty.
const start=js.indexOf('/* CineTracker Android 1.0.51/r293 — absolute final owner');
const end=js.indexOf('window.__ctR293Gate={',start);
if(start<0||end<start)throw Error('r293 final owner scope missing');
let gate=js.slice(start,end);
function gatePatch(from,to,label){
 const matches=gate.split(from).length-1;
 if(matches!==1)throw Error('r294 '+label+': expected one, found '+matches);
 gate=gate.replace(from,to);
}
gatePatch('if(actions(target)<5){','if(actions(target)<3){','lock partially-empty Watchlist');
gatePatch("function repair(){\n if(!same())return;",
 "function repair(){\n if(!same())return;\n let ct294Restored=false;",'observer guard');
gatePatch("if(current?.isConnected){current.replaceWith(root);restoreCount++}",
 "if(current?.isConnected){current.replaceWith(root);restoreCount++;ct294Restored=true}",'shell guard');
gatePatch('root.replaceChildren(...nodes);\n  restoreCount++;',
 'root.replaceChildren(...nodes);\n  restoreCount++;ct294Restored=true;','child guard');
gatePatch('try{window.__ctR278Test?.reconcile?.()}catch(e){\n  document.documentElement.dataset.ct293ReconcileError',
 'if(ct294Restored)try{window.__ctR278Test?.reconcile?.()}catch(e){\n  document.documentElement.dataset.ct293ReconcileError',
 'never recursively reconcile harmless local mutation');
js=js.slice(0,start)+gate+js.slice(end);
// r294 WWE refresh uses the already-authenticated Android edge() helper.
const wwe=(await readFile(resolve(root,'apps/android/runtime-r294-v1052-wwe-live.js'),'utf8')).trimEnd();
new Function(wwe);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(wwe.includes(forbidden))throw Error('Forbidden r294 behavior '+forbidden);
change('\nboot();','\n/* Android r294: isolated WWE sync */\ntry{\n'+wwe+
 '\n}catch(e){document.documentElement.dataset.ct294WweStartupError=String(e?.message||e);console.error(e)}\nboot();','authenticated WWE sync before boot');
js=js.replaceAll('CineTracker • v1.0.51','CineTracker • v1.0.52')
 .replaceAll("JSON.stringify({version:'1.0.51',revision:REVISION","JSON.stringify({version:'1.0.52',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.51'","window.__ctAndroidRelease='1.0.52'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r294-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1051','ct-android-v1052').replaceAll('content="1.0.51"','content="1.0.52"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_52_READY Pra Você single owner with no infinite observer repaint, empty Watchlist allowed, watched/watchlist in-place; Raw/SmackDown auto sync; Web separate r542');
