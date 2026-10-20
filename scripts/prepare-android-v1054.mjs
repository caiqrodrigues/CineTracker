import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1053.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r295-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw Error('Android 1.0.53 baseline unavailable');
let js=html.slice(a+marker.length,b);
function once(from,to,label){
 const found=js.split(from).length-1;
 if(found!==1)throw Error('Android r296 '+label+': expected one occurrence, found '+found);
 js=js.replace(from,to);
}
once("const REVISION='r295-android-official-1.0.53';",
 "const REVISION='r296-android-official-1.0.54';",'revision');
once("window.__ctWebBuild='1.0.53';window.__ctOfficialVersion='1.0.53';window.__ctAndroidOfficialVersion='1.0.53';window.__ctAndroidOfficialCode=10095;",
 "window.__ctWebBuild='1.0.54';window.__ctOfficialVersion='1.0.54';window.__ctAndroidOfficialVersion='1.0.54';window.__ctAndroidOfficialCode=10096;",'metadata');

// The r295 gate could lock after one available button even if other slots
// were not initialized. Require all seven slots to have their final r278
// actions (or an explicit empty-category placeholder), but allow some
// Watchlist categories to be legitimately empty.
const start=js.indexOf('/* CineTracker Android 1.0.51/r293 — absolute final owner');
const end=js.indexOf('window.__ctR293Gate={',start);
if(start<0||end<=start)throw Error('Android canonical Discover gate unavailable');
let gate=js.slice(start,end);
function gateOnce(from,to,label){
 const found=gate.split(from).length-1;
 if(found!==1)throw Error('Android r296 gate '+label+': expected one, found '+found);
 gate=gate.replace(from,to);
}
const readiness=[
'function ct296Ready(target){',
" const found=Array.from(target?.querySelectorAll?.('[data-ct241-slot-key]')||[]);",
' if(found.length!==7)return false;',
" if(new Set(found.map(slot=>String(slot.dataset.ct241SlotKey||''))).size!==7)return false;",
' for(const slot of found){',
"  const key=String(slot.dataset.ct241SlotKey||'');",
"  const card=slot.querySelector('.discover-card');",
'  if(!card){',
"   if(!slot.querySelector('[data-ct277-empty]'))return false;",
'   continue;',
'  }',
"  if(!slot.querySelector('button[data-media]'))return false;",
"  const buttons=Array.from(slot.querySelectorAll('.ct277-actions [data-ct277-action]'));",
"  const required=key.startsWith('watchlist:')?['seen','swap']:['watchlist','seen','swap'];",
'  if(buttons.length!==required.length)return false;',
"  const actions=new Set(buttons.map(button=>String(button.dataset.ct277Action||'')));",
'  if(required.some(action=>!actions.has(action)))return false;',
' }',
' return true;',
'}',
''].join('\n');
gateOnce('function commit(value,target){',readiness+'function commit(value,target){','seven-slot readiness');
gateOnce('!target?.isConnected||slots(target)<5','!target?.isConnected||slots(target)<7','no partial screen lock');
gateOnce('if(actions(target)<1&&attempt<45){','if(!ct296Ready(target)){','complete buttons or explicit empty slot');
gateOnce('if(attempt<10)requestAnimationFrame(()=>commitAt(attempt+1));','if(attempt<90)requestAnimationFrame(()=>commitAt(attempt+1));','bounded wait for async context');
gateOnce('Missing actionable seven slots after 10 frames','Seven complete authenticated slots did not become ready within 90 frames','diagnostic');
js=js.slice(0,start)+gate+js.slice(end);

// Replace, do not stack, the old 3-minute clone-based WWE restorer. Keep
// real existing row nodes and never reinstate a row after a local watched click.
const older=(await readFile(resolve(root,'apps/android/runtime-r295-v1053-wwe-home-stability.js'),'utf8')).trimEnd();
const newer=(await readFile(resolve(root,'apps/android/runtime-r296-v1054-wwe-home-owner.js'),'utf8')).trimEnd();
new Function(newer);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 if(newer.includes(bad))throw Error('Forbidden Android mutation '+bad);
once(older,newer,'single WWE Home owner');
js=js.replaceAll('CineTracker • v1.0.53','CineTracker • v1.0.54')
 .replaceAll("JSON.stringify({version:'1.0.53',revision:REVISION","JSON.stringify({version:'1.0.54',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.53'","window.__ctAndroidRelease='1.0.54'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r296-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1053','ct-android-v1054')
 .replaceAll('content="1.0.53"','content="1.0.54"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_54_READY: complete authenticated Discover slots; Raw/SmackDown restored with real DOM nodes and watched-state invalidation; Web untouched.');
