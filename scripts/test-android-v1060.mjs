import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r302-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android 1.0.60 embedded runtime is missing');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0.60"'));
for(const required of [
 "const REVISION='r302-android-official-1.0.60'",
 'window.__ctAndroidOfficialCode=10102',
 'window.__ctR293Gate={',
 'function ct296Ready(target)',
 'function ct301Exposed(key,ref)',
 "const fingerprint=ref+'|'+key",
 'function ct300Choice(rows)',
 'function ct297Status(label)',
 'window.__ctR296WweHome',
 'const restoreCached=()=>',
 "[['previous','Anteriores'],['upcoming','Próximos']]",
 'cinetracker_recommendation_filter_v525'
])assert.ok(js.includes(required),'r302 missing retained behavior '+required);
function moduleBetween(start,end){
 const a=js.indexOf(start),b=a<0?-1:js.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,'Missing scope '+start);
 return js.slice(a,b);
}
const r278=moduleBetween('/* Android 1.0.36 r278 — ONLY Descobrir > Pra Você.',
 '/* CineTracker Android 1.0.37/r279');
assert.ok(r278.includes('if(isVisible()&&!window.__ctR293Gate?.locked?.())schedule()'),
 'Only the first uncommitted authenticated paint may schedule a full reconcile');
assert.ok(r278.includes("if(swapping.has(key))continue"),'In-flight card remains untouched');
assert.ok(r278.includes("return newRows;"),'No old Trocar fallback');
assert.equal((r278.match(/window\.addEventListener\('click',event=>/g)||[]).length,1,
 'Canonical r278 must have exactly one action listener');

const r284=moduleBetween('/* CineTracker Android 1.0.42 / r284',
 '/* CineTracker Android r285');
assert.ok(!r284.includes('queueMicrotask(()=>{try{window.__ctR278Test?.reconcile?.()}'),
 'r284 background fetch still repaints all seven cards');
assert.ok(!r284.includes('if(isForYou())renderData(result)'),
 'Authenticated fetch must not render the whole route twice');
assert.ok(r284.includes('ct291DrawNav===navSeq')&&r284.includes('ct291DrawOwner===owner()'),
 'First-paint network data authority must still be user and navigation scoped');
assert.ok(r284.includes('await bounded(auditor.auditData(next),16000)'),
 'Must preserve authenticated v525 personalized filtering');

const r288=moduleBetween('/* CineTracker Android 1.0.46/r288',
 '/* CineTracker Android r289');
assert.ok(!r288.includes('window.__ctR278Test?.reconcile?.()'),
 'r288 extra delayed r278 reconcile must be gone');
assert.ok(r288.includes('if(!verified(data))return prevPaint.apply(this,arguments)'),
 'First-paint rendering still works');

const r293=moduleBetween('/* CineTracker Android 1.0.51/r293 — absolute final owner','/* Android r294');
assert.ok(!r293.includes("document.addEventListener('click',event=>"),
 'r293 should not repaint on routine action events');
assert.ok(!r293.includes("window.addEventListener('cinetracker:data-changed',()=>"),
 'r293 should not repaint on unrelated data events');
assert.ok(!r293.includes('window.__ctR278Test?.reconcile?.()'),
 'r293 DOM repair must never pick another recommendation');
assert.ok(r293.includes("const isSlotNode=node=>node?.nodeType===1"),
 'Structural legacy paint observer must remain active');
assert.ok(r293.includes('root.replaceChildren(...nodes)'),
 'Recovery of verified 7-slot DOM must remain available');
assert.ok(r293.includes('ct295Protect()'),'Per-slot protection remains available');
assert.ok(r293.includes("window.addEventListener('popstate',()=>{clearIfLeaving()},false)"));

const start=r293.indexOf('function shouldBlockPaint(value){');
const stop=r293.indexOf('function afterPaint(value,target){',start);
assert.ok(start>=0&&stop>start);
let repairs=0,restores=0;
const document={documentElement:{dataset:{}}};
const guards=new Function('active','same','restoreData','schedule','slots','root','document',
 'let paintBlockCount=0,routeBlockCount=0;'+r293.slice(start,stop)+
 'return{shouldBlockPaint,beforeRoute};')(
 ()=>true,()=>true,()=>{restores++},()=>{repairs++},()=>7,{},document
);
assert.equal(guards.shouldBlockPaint({}),true);
assert.equal(guards.beforeRoute(),true);
assert.equal(restores,2,'Verified data remains protected');
assert.equal(repairs,0,'Blocked legacy paints must schedule ZERO repaint frames');
assert.equal(document.documentElement.dataset.ct293BlockedPaints,'1');

// Six action routes still intact, only UI ownership was changed.
for(const marker of ['[data-ct277-action]','ct186Context(false)','data-ct241-slot-key',
 'ct186LocalBlocked.add(ref)','await markSeen(type,id)','window.__ctR293AddWatchlist(type,id)',
 'void rpc('])assert.ok(r278.includes(marker),'r278 action lost '+marker);
const activeText=r278.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g,'');
assert.ok(!activeText.includes('window.location.reload(')&&!activeText.includes('router.refresh('));
console.log('ANDROID_1_0_60_TEST_OK: one user-scoped r278 action owner; 0 redundant r284/r288/r293 recompositions after commit; 0 repaints on blocked legacy work; verified DOM and v525 rules intact.');
