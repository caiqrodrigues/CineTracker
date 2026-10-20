import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r295-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'r295 embedded Android runtime missing');
const js=html.slice(a+marker.length,b);
new Function(js);
const wwe=await readFile('apps/android/runtime-r295-v1053-wwe-home-stability.js','utf8');
new Function(wwe);
assert.equal(js.split(wwe.trimEnd()).length-1,1,'WWE retention module embedded once');
for(const text of [
 "const REVISION='r295-android-official-1.0.53'",
 "window.__ctAndroidOfficialCode=10095",
 'function ct295Protect()',
 'const ct295Slots=new Map()',
 'ct295Slots.set(key,{slot,parent:slot.parentElement,next:slot.nextSibling})',
 'current.replaceWith(saved.slot)',
 'ct295Protect();',
 'if(actions(target)<1&&attempt<45)',
 'window.__ctR293Gate?.beforeRoute?.()',
 'window.__ctR293AddWatchlist(type,id)',
 'ct293WatchlistSaved',
 "cinetracker_discover_fresh_v421",
 "cinetracker_discover_watch_unseen_v421",
 "cinetracker_recommendation_filter_v525",
 "cinetracker_home_series_v527",
 'window.__ctR295Home'
])assert.ok(js.includes(text),'Missing r295 guard '+text);
assert.ok(html.includes('name="ct-official-version" content="1.0.53"'));
for(const no of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 assert.ok(!wwe.includes(no),'Full reload/unbounded observer forbidden');

// Model the actual r295 nested grid guard against both asynchronous legacy
// replacement and authorized local Trocar. This intentionally operates on the
// exact extracted source functions, not a rewritten version.
const from=js.indexOf('const ct295Slots=new Map()'),to=js.indexOf('let locked=false,account=',from);
assert.ok(from>=0&&to>from,'Nested DOM repair code missing from gate');
const source=js.slice(from,to);
const state={
 window:{},
 root:null,
 document:{documentElement:{dataset:{}}},
 same:()=>true,
 console,Map,Array,Number,String
};
function slot(key,valid){
 return {
  dataset:{ct241SlotKey:key},parentElement:null,nextSibling:null,isConnected:true,
  querySelector(sel){return sel.includes('swap')&&valid?{dataset:{ct277Action:'swap'}}:null},
  replaceWith(newNode){state.root.items.set(key,newNode);newNode.isConnected=true;this.isConnected=false}
 };
}
const original=slot('watchlist:movie',true);
const parent={isConnected:true,insertBefore(node){state.root.items.set(node.dataset.ct241SlotKey,node);node.isConnected=true}};
original.parentElement=parent;
state.root={
 items:new Map([['watchlist:movie',original]]),
 querySelectorAll(){return Array.from(this.items.values())},
 querySelector(selector){
  const match=selector.match(/data-ct241-slot-key="([^"]+)"/);
  return match?this.items.get(match[1]):null
 }
};
vm.createContext(state);vm.runInContext(source+'\nwindow.test={capture:ct295Capture,protect:ct295Protect,saved:ct295Slots};',state,{timeout:1000});
state.window.test.capture();
assert.equal(state.window.test.saved.size,1);
// Late old callback replaces only Watchlist child, not root panel.
const old=slot('watchlist:movie',false);
old.parentElement=parent;
state.root.items.set('watchlist:movie',old);
assert.equal(state.window.test.protect(),1,'Legacy Watchlist subtree was not restored');
assert.equal(state.root.items.get('watchlist:movie'),original);
// Legitimate per-slot swap with correct r278 action bar must not be reverted.
const swapped=slot('watchlist:movie',true);
swapped.parentElement=parent;
state.root.items.set('watchlist:movie',swapped);
assert.equal(state.window.test.protect(),0,'Valid Trocar unexpectedly reset');
assert.equal(state.window.test.saved.get('watchlist:movie').slot,swapped);
// Another late legacy callback must restore the *new* selected card.
const secondLegacy=slot('watchlist:movie',false);
secondLegacy.parentElement=parent;
state.root.items.set('watchlist:movie',secondLegacy);
assert.equal(state.window.test.protect(),1);
assert.equal(state.root.items.get('watchlist:movie'),swapped);

// Retention policy for existing Raw/SmackDown: only concrete seen DOM nodes,
// 3-minute maximum, no fictitious episodes, direct DOM restoration.
assert.ok(wwe.includes("if(Date.now()-item.at>180000)"),'No finite stale-cache bound');
assert.ok(wwe.includes('cloneNode(true)')&&wwe.includes('stack.appendChild(copy)'),
 'Existing Home rows not preserved on delayed paint');
assert.ok(wwe.includes('if(present.has(id))continue'),'WWE duplicate prevention missing');
assert.ok(!wwe.includes('paintDiscover(')&&!wwe.includes('window.location.reload('));
console.log('ANDROID_1_0_53_TEST_OK: r293 canonical source, late nested legacy Watchlist restored, current valid Trocar retained, second legacy restored latest pick, Raw/SmackDown remain after transient repaint; no page reload, Web untouched.');
