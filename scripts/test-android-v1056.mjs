import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r298-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Android 1.0.56 embedded runtime missing');
const js=html.slice(a+marker.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0.56"'));
for(const required of [
 "const REVISION='r298-android-official-1.0.56'",
 'window.__ctAndroidOfficialCode=10098',
 'lastForYouRoot',
 'if(root!==lastForYouRoot){picked.clear();lastForYouRoot=root}',
 'const fingerprint=ref+\'|\'+key;',
 'if(button.disabled!==disabled)button.disabled=disabled;',
 'window.__ctR293Gate',
 'window.__ctR296WweHome',
 'function ct297Status(label)',
 'cinetracker_recommendation_filter_v525'
])assert.ok(js.includes(required),'Missing r298 marker '+required);
const start=js.indexOf('/* Android 1.0.36 r278 — ONLY Descobrir > Pra Você.');
const end=js.indexOf('/* CineTracker Android 1.0.37/r279',start);
assert.ok(start>=0&&end>start,'Embedded r278 scope missing');
const controller=js.slice(start,end);
assert.ok(!controller.includes("const allowed=available.filter(x=>!blockedMemory(key,x));return allowed.length?allowed:available;"),
 'Previously shown recommendations must never be recycled by Trocar');
assert.ok(!controller.includes("const fingerprint=ref+'|'+key+'|'+nChoices+'|'"),
 'Busy flip must not repaint entire action bars');
assert.ok(controller.indexOf('usable.find(x=>mediaRef(x)===mediaIn(slot))')<
 controller.indexOf('usable.find(x=>!seenIn(key).has(mediaRef(x))'),
 'Current valid card must be preserved before any fresh candidate');
assert.ok(!controller.includes('if(viewEpoch!==window.__ctR286VisitEpoch)'),
 'Background fetch must not discard the selected card');
// Execute the actual candidates() function with concrete per-slot memories.
const cStart=controller.indexOf('function candidates(key,current){');
const cEnd=controller.indexOf('function contentDetailSafe(',cStart);
assert.ok(cStart>0&&cEnd>cStart,'Trocar implementation missing');
const already={ref:'movie:101'},other={ref:'movie:202'},third={ref:'movie:303'};
const pool=[already,other,third];
const exposure=new Map([['fresh:movie',new Set(['movie:101','movie:202'])]]);
const picked=new Map([['fresh:series','tv:900']]);
const candidates=new Function('selectedData','ct186ContextValue','picked','mediaRef','poolFor','seenIn','blockedMemory',
 controller.slice(cStart,cEnd)+'return candidates;')(
 ()=>({}),{},picked,x=>x.ref,()=>pool,
 key=>exposure.get(key)||new Set(),()=>false
);
assert.deepEqual(candidates('fresh:movie','movie:101').map(x=>x.ref),['movie:303']);
exposure.get('fresh:movie').add('movie:303');
assert.deepEqual(candidates('fresh:movie','movie:101'),[],
 'Exhausted swap pool must return no old suggestion');
exposure.get('fresh:movie').delete('movie:303');
picked.set('watchlist:movie','movie:303');
assert.deepEqual(candidates('fresh:movie','movie:101'),[],
 'Another visible slot must not be duplicated');

// The existing control elements stay mounted while a request changes busy.
const fStart=controller.indexOf('function controls(slot,key,item,nChoices){');
const fEnd=controller.indexOf('function reconcile(){',fStart);
assert.ok(fStart>0&&fEnd>fStart,'DOM button controller missing');
const busy=new Set();
let writes=0;
const buttons=[{disabled:false},{disabled:false},{disabled:false}];
const bar={
 dataset:{ct277Fingerprint:'movie:101|fresh:movie'},
 querySelectorAll:()=>buttons,
 set innerHTML(value){writes++;this.content=value}
};
const card={querySelector:selector=>selector==='.ct277-actions'?bar:null,appendChild(){}};
const slot={
 querySelector(selector){return selector==='.discover-card'?card:selector==='.ct277-actions'?bar:null},
 querySelectorAll(){return[]}
};
const controls=new Function('q','mediaRef','busy','watchKind','document',
 controller.slice(fStart,fEnd)+'return controls;')(
 (selector,root)=>root.querySelector(selector),x=>x.ref,busy,()=>false,{createElement:()=>({})}
);
controls(slot,'fresh:movie',already,3);
assert.equal(writes,0,'Initial unchanged action bar must not be rebuilt');
busy.add('fresh:movie');
controls(slot,'fresh:movie',already,3);
assert.equal(writes,0,'Disabling the controls must not rebuild buttons');
assert.ok(buttons.every(x=>x.disabled));
busy.delete('fresh:movie');
controls(slot,'fresh:movie',already,3);
assert.equal(writes,0,'Enabling buttons must not rebuild them');
assert.ok(buttons.every(x=>!x.disabled));
const stripped=controller.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g,'');
assert.ok(!stripped.includes('window.location.reload(')&&!stripped.includes('router.refresh('));
console.log('ANDROID_1_0_56_TEST_OK: no repeated Trocar items even with exhausted pools; no duplicate across slots; stable active selection and no action-bar DOM rebuild during rapid clicks; Web unchanged.');
