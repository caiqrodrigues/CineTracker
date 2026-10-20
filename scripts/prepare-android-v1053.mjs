import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1052.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r294-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Validated Android 1.0.52 baseline unavailable');
let js=html.slice(a+tag.length,b);
function once(from,to,label){
 const count=js.split(from).length-1;
 if(count!==1)throw Error('Android r295 '+label+': expected one match, found '+count);
 js=js.replace(from,to);
}
once("const REVISION='r294-android-official-1.0.52';",
 "const REVISION='r295-android-official-1.0.53';",'revision');
once("window.__ctWebBuild='1.0.52';window.__ctOfficialVersion='1.0.52';window.__ctAndroidOfficialVersion='1.0.52';window.__ctAndroidOfficialCode=10094;",
 "window.__ctWebBuild='1.0.53';window.__ctOfficialVersion='1.0.53';window.__ctAndroidOfficialVersion='1.0.53';window.__ctAndroidOfficialCode=10095;",'metadata');
// r293 gate currently restores only the root's direct child nodes. The
// broken Watchlist repaint changes NESTED DOM and bypasses that guard.
const start=js.indexOf('/* CineTracker Android 1.0.51/r293 — absolute final owner');
const end=js.indexOf('window.__ctR293Gate={',start);
if(start<0||end<=start)throw Error('r293 gate implementation not found');
let gate=js.slice(start,end);
function gp(from,to,label){
 const count=gate.split(from).length-1;
 if(count!==1)throw Error('Android r295 gate '+label+': found '+count);
 gate=gate.replace(from,to);
}
// Keep the lock even with one nonempty Watchlist category.
gp('if(actions(target)<3){','if(actions(target)<1){','canonical ownership one active slot');
gp('let locked=false,account=',"\n/* r295: remember ONLY valid action-ready slot DOM nodes. A legacy renderer\n * can replace a nested Watchlist grid without changing root.childNodes.\n * Slot edits performed by r278 remain valid and become the new snapshot. */\nconst ct295Slots=new Map();\nfunction ct295Capture(){\n if(!same())return;\n for(const slot of Array.from(root.querySelectorAll('[data-ct241-slot-key]'))){\n  const key=String(slot.dataset.ct241SlotKey||'');\n  if(!key||!slot.querySelector('[data-ct277-action=\"swap\"]'))continue;\n  ct295Slots.set(key,{slot,parent:slot.parentElement,next:slot.nextSibling});\n }\n}\nfunction ct295Protect(){\n if(!same())return 0;\n let restored=0;\n for(const [key,saved] of ct295Slots){\n  const current=root.querySelector('[data-ct241-slot-key=\"'+key+'\"]');\n  if(current?.querySelector('[data-ct277-action=\"swap\"]')){\n   // An authenticated local Trocar/Assistido update replaces only its slot.\n   if(current!==saved.slot)ct295Slots.set(key,{slot:current,parent:current.parentElement,next:current.nextSibling});\n   continue;\n  }\n  // Old r116/r282 HTML has a different button layout. Restore last valid\n  // interactive node without touching any other slot or page section.\n  if(current?.isConnected){current.replaceWith(saved.slot);restored++}\n  else if(saved.parent?.isConnected){\n   saved.parent.insertBefore(saved.slot,saved.next?.isConnected?saved.next:null);\n   restored++;\n  }\n }\n if(restored){\n  document.documentElement.dataset.ct295RecoveredLegacySlots=String(restored);\n }\n ct295Capture();\n return restored;\n}\n"+'\nlet locked=false,account=','insert nested slot guard');
gp('observer?.disconnect();observer=null;locked=false;', 'observer?.disconnect();observer=null;ct295Slots.clear();locked=false;','reset slot account');
gp('  restoreData();\n // Never repaint from an old pool.',
   '  ct295Protect();\n restoreData();\n // Never repaint from an old pool.',
   'repair nested legacy Watchlist');
gp('  nodes=Array.from(target.childNodes);\n  restoreData();observe();',
   '  nodes=Array.from(target.childNodes);\n  restoreData();observe();ct295Capture();requestAnimationFrame(ct295Capture);',
   'capture seven canonical slots');
gp(' if(ct294Restored)try{window.__ctR278Test?.reconcile?.()}catch(e){',
   ' if(ct294Restored)try{window.__ctR278Test?.reconcile?.()}catch(e){',
   'verify guarded reconcile');
js=js.slice(0,start)+gate+js.slice(end);
// On the next seven-slot paint, do not remount if an authenticated owner is
// already committed for the route. The gate protects source and DOM.
once("if(discoverState.tab==='foryou'&&window.__ctR293Gate?.shouldBlockPaint?.(rows))return;",
 "if(discoverState.tab==='foryou'&&window.__ctR293Gate?.shouldBlockPaint?.(rows))return;",
 'original paint sink already guarded');
// Only Home integration: keep Raw/SmackDown cards across an async paint,
// without global refetch, avoiding changes to any other sports row.
const patch=(await readFile(resolve(root,'apps/android/runtime-r295-v1053-wwe-home-stability.js'),'utf8')).trimEnd();
new Function(patch);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(patch.includes(bad))throw Error('Forbidden full-page mutation '+bad);
once('\nboot();','\n/* r295 Raw/SmackDown durable Home rows */\ntry{\n'+patch+
 '\n}catch(error){document.documentElement.dataset.ct295HomeStartError=String(error?.message||error);console.error(error)}\nboot();',
 'scope final Home before boot');
js=js.replaceAll('CineTracker • v1.0.52','CineTracker • v1.0.53')
 .replaceAll("JSON.stringify({version:'1.0.52',revision:REVISION","JSON.stringify({version:'1.0.53',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.52'","window.__ctAndroidRelease='1.0.53'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r295-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1052','ct-android-v1053').replaceAll('content="1.0.52"','content="1.0.53"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_53_READY: exact Pra Voce nested legacy guard, valid local Trocar/Watchlist/Seen preserved; WWE Raw/SmackDown retained across Home paints. Existing Web untouched.');
