import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Official Android 1.0 / r309. Preserve r308 fixes and r307 taste model.
// Home-only: intercept mark-episode at WINDOW capture (before old
// document-capture owners) so one physical tap triggers exactly one mutation.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r308.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r308-android-stable-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
if(start<0||end<=start)throw Error('Official 1.0/r308 baseline missing');
let js=html.slice(start+tag.length,end);
function one(a,b,why){const hits=js.split(a).length-1;if(hits!==1)
 throw Error('Android r309 '+why+': expected one match, got '+hits);js=js.replace(a,b)}
one("const REVISION='r308-android-official-1.0';","const REVISION='r309-android-official-1.0';",'revision');
one('window.__ctAndroidOfficialCode=10109;','window.__ctAndroidOfficialCode=10110;','native versionCode');
one("document.addEventListener('click',tap,true);","window.addEventListener('click',tap,true);",
 'make first-tap episode marking sole event owner before legacy document listeners');
const tap=js.slice(js.indexOf('function tap(event){'),js.indexOf("window.addEventListener('click',tap,true);"));
if(!tap.includes('event.stopImmediatePropagation()')||!tap.includes('actionBusy.has(id)')||
 !tap.includes('markNextEpisode158(id)'))throw Error('First-tap synchronous lock or canonical persisted action missing');
new Function(js);
html=html.slice(0,start)+'<script data-ct-android="r309-android-stable-js">'+js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('CINETRACKER_1_0_R309_READY: one window-capture owner for episode mark; r308 movie/episode undo, UFC geometry, first-paint movie history; r307 audited personalized picks retained.');
