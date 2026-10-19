import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1043.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r285-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Android 1.0.43 baseline unavailable');
let js=html.slice(a+tag.length,b);
function once(before,after,label){
 const n=js.split(before).length-1;
 if(n!==1)throw Error('r286 '+label+': expected one source marker, got '+n);
 js=js.replace(before,after);
}
function section(start,end,replacement,label){
 const a=js.indexOf(start),b=a<0?-1:js.indexOf(end,a+start.length);
 if(a<0||b<a||js.indexOf(start,a+start.length)!==-1)throw Error('r286 '+label+': ambiguous owner');
 js=js.slice(0,a)+replacement+'\n'+js.slice(b);
}
once("const REVISION='r285-android-official-1.0.43';","const REVISION='r286-android-official-1.0.44';",'revision');
once("window.__ctWebBuild='1.0.43';window.__ctOfficialVersion='1.0.43';window.__ctAndroidOfficialVersion='1.0.43';window.__ctAndroidOfficialCode=10085;",
"window.__ctWebBuild='1.0.44';window.__ctOfficialVersion='1.0.44';window.__ctAndroidOfficialVersion='1.0.44';window.__ctAndroidOfficialCode=10086;",'metadata');
// V525 server authority: an unrelated client rating rule cannot null its approved pools.
if(js.includes('&&ct186Quality(x)&&!ct186LocalBlocked.has(ct186Key(x))'))throw Error('r283 redundant quality regression');
once("const disabled=(act==='swap'&&nChoices<2&&(watchKind(key)||expandedOnce.has(kindOf(key))))||busy.has(key);",
"const disabled=busy.has(key);",'buttons permanently disabled');
once("let owner=actualUser(),auditing=null;","let owner=actualUser(),auditing=null,viewEpoch=-1;",'new-visit ownership');
once(" loadSeen();\n const root=q('[data-discover-content]');",
" loadSeen();\n if(viewEpoch!==window.__ctR286VisitEpoch){viewEpoch=window.__ctR286VisitEpoch;picked.clear()}\n const root=q('[data-discover-content]');",'rotation on each visit');
once("  let candidate=usable.find(x=>mediaRef(x)===override)||usable.find(x=>mediaRef(x)===mediaIn(slot))||\n   usable.find(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x)&&mediaRef(x)===mediaRef(suggested[key]))||\n   usable.find(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x))||null;",
"  let candidate=usable.find(x=>mediaRef(x)===override)||\n   usable.find(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x)&&mediaRef(x)===mediaRef(suggested[key]))||\n   usable.find(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x))||\n   usable.find(x=>mediaRef(x)===mediaIn(slot))||usable[0]||null;",
'priority of new recommendations');
once(" return poolFor(data,key,ctx).filter(x=>{\n  const ref=mediaRef(x);\n  return ref&&ref!==current&&!taken.has(ref)&&!seenIn(key).has(ref)&&!blockedMemory(key,x);\n });",
" const available=poolFor(data,key,ctx).filter(x=>{const ref=mediaRef(x);return ref&&ref!==current&&!taken.has(ref)});\n const newRows=available.filter(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x));\n if(newRows.length)return newRows;\n const allowed=available.filter(x=>!blockedMemory(key,x));return allowed.length?allowed:available;",
'safe cycling after pool exhausted');
once("function verifyInBackground(key,item){\n const ref=mediaRef(item);",
"function verifyInBackground(key,item){\n if(selectedData()?.__ct283ServerAudited)return;\n const ref=mediaRef(item);",
'no delayed client deletion of approved cards');
// Keep the six category-specific authenticated pools. Never substitute TMDB popularity.
section("async function expandPool(key){","async function slotChoice(key,current){",
"async function expandPool(key){return Boolean(await window.__ctR286Refill?.(key));}",
'server-only refill');
section("async function slotChoice(key,current){","function changeOne(key){",
"async function slotChoice(key,current){\n let options=candidates(key,current);\n if(!options.length){await expandPool(key);options=candidates(key,current)}\n return options[0]||null;\n}",
'constant-time swap');
once("   const next=await slotChoice(key,ref);\n   if(!next)return;",
"   const next=await slotChoice(key,ref);\n   if(!next){try{toast('Nenhuma outra indicação elegível nesta categoria.')}catch{}return;}",
'explain genuinely empty pool');
once("window.addEventListener('click',e=>{\n const card=e.target?.closest?.('[data-ct263-special]');\n if(!card||route263()!=='home')return;",
"window.addEventListener('click',e=>{\n if(e.target?.closest?.('[data-ct286-special-quick]'))return;\n const card=e.target?.closest?.('[data-ct263-special]');\n if(!card||route263()!=='home')return;",
'allow special-series quick-watch click');
js=js.replaceAll('CineTracker • v1.0.43','CineTracker • v1.0.44')
 .replaceAll("JSON.stringify({version:'1.0.43',revision:REVISION","JSON.stringify({version:'1.0.44',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.43'","window.__ctAndroidRelease='1.0.44'");
const runtime=await readFile(resolve(root,'apps/android/runtime-r286-v1044-discover-and-special-home.js'),'utf8');
new Function(runtime);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(runtime.includes(forbidden))throw Error('r286 forbidden '+forbidden);
if(!js.includes('\nboot();'))throw Error('r286 boot marker missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r286-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1043','ct-android-v1044').replaceAll('content="1.0.43"','content="1.0.44"');
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_44_READY 7-button authority + rotation + special Home; Web r541 frozen');
