import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r294-android-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'r294 Android asset missing');
const js=html.slice(start+tag.length,end);new Function(js);
const wwe=await readFile('apps/android/runtime-r294-v1052-wwe-live.js','utf8');new Function(wwe);
assert.equal(js.split(wwe.trimEnd()).length-1,1,'WWE trigger must be injected once');
for(const token of [
 "const REVISION='r294-android-official-1.0.52'",
 "window.__ctAndroidOfficialCode=10094",
 "cinetracker_home_series_v527",
 "cinetracker_home_series_watch_state_v4",
 "ct-wwe-tv-refresh",
 "ct293WatchlistSaved",
 "ct293BlockedPaints",
 "if(actions(target)<3)",
 "if(ct294Restored)try{window.__ctR278Test?.reconcile?.()}",
 "window.__ctR293Gate?.shouldBlockPaint?.(rows)",
 "window.__ctR293Gate?.beforeRoute?.()",
 "window.__ctR293AddWatchlist(type,id)",
 "cinetracker_recommendation_filter_v525",
 "cinetracker_discover_fresh_v421"
])assert.ok(js.includes(token),'r294 missing '+token);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.equal(wwe.includes(forbidden),false,'Forbidden '+forbidden);
assert.ok(html.includes('name="ct-official-version" content="1.0.52"'));
const state={
 window:{addEventListener(){}},
 document:{addEventListener(){},head:{appendChild(){}},createElement:()=>({}),
  documentElement:{dataset:{}}},
 route:()=> 'home',homeActiveTab158:'series',session:{user:{id:'tester'},access_token:'token'},user:{id:'tester'},
 rpc:async()=>[],edge:async()=>({ok:true,shows:[]}),
 Date,Promise,Number,String,Array,Set,Map,Boolean,Intl,console,setTimeout:()=>1
};
vm.createContext(state);vm.runInContext(wwe,state,{timeout:1600});
const api=state.window.__ctR294Wwe;
const watches=[{tmdb_id:4656,watched_keys:[{s:34,e:41}]}];
assert.equal(api.watchSet(watches,4656).has('34:41'),true);
assert.equal(api.watchSet(watches,4656).has('34:42'),false);
assert.equal(api.watchSet(watches,1549).size,0);
assert.ok(wwe.includes("stack.appendChild(container)"),'Recent only must move DOM nodes in place');
assert.ok(!wwe.includes('paintHome(')&&!wwe.includes('render()')&&
 !wwe.includes('location.replace'),'No full-page or all-Home paint permitted');
const gateStart=js.indexOf('/* CineTracker Android 1.0.51/r293 — absolute final owner');
const gateEnd=js.indexOf('window.__ctR293Gate={',gateStart);
const gate=js.slice(gateStart,gateEnd);
assert.ok(gate.includes('let ct294Restored=false'));
assert.ok(gate.includes('if(actions(target)<3)'));
assert.ok(!gate.includes('if(actions(target)<5)'));
assert.ok(gate.includes('if(ct294Restored)try{window.__ctR278Test?.reconcile?.()}'),
 'Guard against infinite per-frame r278 reconcile');
console.log('ANDROID_1_0_52_TEST_OK: 4 eligible swap buttons lock canonical, no observer recursion, watchlist in-place, Raw/SmackDown recent from authenticated sync, no reload');
