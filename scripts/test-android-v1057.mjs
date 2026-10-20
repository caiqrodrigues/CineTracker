import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r299-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android 1.0.57 runtime not embedded');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0.57"'));
for(const marker of [
 "const REVISION='r299-android-official-1.0.57'",
 'window.__ctAndroidOfficialCode=10099',
 'function ct297Status(label)',
 'window.__ctR293Gate',
 'window.__ctR296WweHome',
 'return newRows;',
 'cinetracker_recommendation_filter_v525'
])assert.ok(js.includes(marker),'Missing preserved authority '+marker);

const beginning=js.indexOf('/* Android 1.0.50 / r292 — one DOM owner');
const end=js.indexOf('/* r293 final scoped Discover owner',beginning);
assert.ok(beginning>0&&end>beginning,'Legacy r292 module missing');
const legacy=js.slice(beginning,end);
assert.ok(!legacy.includes('function afterAction(){'),'r292 still schedules actions');
assert.ok(!legacy.includes('for(const ms of [0,100,350,850,1700,3200])'),'r292 six delayed reconciliations remain');
assert.ok(!legacy.includes("window.addEventListener('click'"),'r292 legacy action listener remains');
assert.ok(!legacy.includes("window.addEventListener('cinetracker:data-changed'"),'r292 extra data listener remains');
assert.ok(!legacy.includes('discoverRows=async function'),'r292 legacy async re-entry remains');
assert.ok(!legacy.includes('requestAnimationFrame(()=>{try{window.__ctR278Test?.reconcile?.()}'),
 'A blocked old paint still schedules r278');
assert.ok(legacy.includes('paintDiscover=function(data,...args){')&&legacy.includes('return null;'),
 'Legacy repaint guard must remain active');

const ga=js.indexOf('/* CineTracker Android 1.0.51/r293 — absolute final owner');
const gb=js.indexOf('/* Android r294',ga);
const gate=js.slice(ga,gb);
assert.ok(gate.includes('ct296Ready(target)'),'Strict seven-slot validation missing');
assert.ok(gate.includes('if([...change.addedNodes,...change.removedNodes].some(isSlotNode)){schedule();return}'));
assert.ok(!gate.includes('new MutationObserver(()=>{if(same())schedule()})'),
 'The full subtree used to request repair on every tiny button mutation');

const obStart=gate.indexOf('function observe(){');
const obEnd=gate.indexOf('function ct296Ready(target)',obStart);
assert.ok(obStart>=0&&obEnd>obStart,'DOM observer missing');
let observerCallback,observeOptions,repairs=0,isActive=true;
class FakeObserver{
 constructor(fn){observerCallback=fn}
 observe(_node,config){observeOptions=config}
 disconnect(){}
}
const root={id:'foryou'};
const observe=new Function('MutationObserver','root','same','schedule',
 'let observer=null;'+gate.slice(obStart,obEnd)+'return observe;')(
 FakeObserver,root,()=>isActive,()=>repairs++
);
observe();
assert.equal(observeOptions.subtree,true);
const insideSlot={closest:selector=>selector==='[data-ct241-slot-key]'?{}:null};
const section={closest:()=>null};
const slot={nodeType:1,matches:selector=>selector==='[data-ct241-slot-key]',querySelector:()=>null};
const poster={nodeType:1,matches:()=>false,querySelector:()=>null};
observerCallback([{target:insideSlot,addedNodes:[poster],removedNodes:[]}]);
assert.equal(repairs,0,'A poster update must not trigger a full repair');
observerCallback([{target:insideSlot,addedNodes:[],removedNodes:[poster]}]);
assert.equal(repairs,0,'An action bar modification must not trigger a full repair');
observerCallback([{target:section,addedNodes:[slot],removedNodes:[]}]);
assert.equal(repairs,1,'A legacy complete slot replacement must trigger recovery');
observerCallback([{target:root,addedNodes:[],removedNodes:[]}]);
assert.equal(repairs,2,'A true root repaint must trigger recovery');
isActive=false;
observerCallback([{target:root,addedNodes:[slot],removedNodes:[]}]);
assert.equal(repairs,2,'Changing routes must stop recovery');

const st=js.indexOf('/* Android 1.0.36 r278');
const se=js.indexOf('/* CineTracker Android 1.0.37/r279',st);
const controller=js.slice(st,se);
assert.ok(controller.includes('return newRows;'),'Trocar must never reuse shown titles');
assert.ok(controller.includes('if(bar.dataset.ct277Fingerprint===fingerprint)'),'Stable action bar must remain mounted');
const stripped=controller.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g,'');
assert.ok(!stripped.includes('window.location.reload(')&&!stripped.includes('router.refresh('));
console.log('ANDROID_1_0_57_TEST_OK: r292 has 0 delayed action repaints; r293 ignores button/poster changes and protects actual slot/root replacements; prior authenticated Trocar and 7 slots preserved.');
