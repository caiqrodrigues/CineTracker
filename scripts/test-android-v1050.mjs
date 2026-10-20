import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r292-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'r292 Android asset missing');
const js=html.slice(a+tag.length,b);new Function(js);
const home=await readFile('apps/android/runtime-r292-v1050-home-counter-and-duplicate.js','utf8');
const discover=await readFile('apps/android/runtime-r292-v1050-discover-single-owner.js','utf8');
new Function(home);new Function(discover);
for(const s of [home,discover]){
 assert.equal(js.split(s).length-1,1,'Extension not injected exactly once');
 for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
  assert.ok(!s.includes(bad),'Forbidden '+bad);
}
for(const token of [
 "const REVISION='r292-android-official-1.0.50'",
 "window.__ctAndroidOfficialCode=10092",
 "num263(historical.watched)",
 "num263(historical.total)",
 "removeSpecialDuplicates263('f1')",
 "window.__ctR292Discover",
 "window.__ctR292Home",
 "cinetracker_special_series_counts_v540",
 "cinetracker_watchlist_full_v119",
 "cinetracker_ufc_series_v518",
 "cinetracker_wwe_ppv_series_v519",
 "cinetracker_f1_series_v512",
 "data-ct263-special",
 "cinetracker_mark_episode_v0994",
 "cinetracker_unmark_history_item_v426",
 "cinetracker_recommendation_filter_v525"
])assert.ok(js.includes(token),'Missing '+token);
assert.ok(html.includes('name="ct-official-version" content="1.0.50"'));
assert.ok(!js.includes('previous.call(null,stable);'),'Old Discover whole-page fallback survived');
assert.ok(!js.includes("const label=d?.series?seen+'/'+(released||'?')"),'Old single-season counter survived');
assert.ok(js.includes('ct292BlockedRepaints'),'One painter per visit missing');
// NFL episode history: 120 planned valid coordinates, extra season 0 must not count.
const env={
 window:{addEventListener(){}},document:{addEventListener(){},head:{appendChild(){}},createElement:()=>({}),
  documentElement:{dataset:{}},querySelector:()=>null},
 route:()=> 'home',homeActiveTab158:'series',session:{user:{id:'tester'}},
 user:{id:'tester'},paintHome:()=>{},api:async()=>[],Date,Promise,Array,String,Number,Set,Map,Boolean,
 queueMicrotask:()=>{},requestAnimationFrame:()=>{},setTimeout:()=>{},encodeURIComponent,console
};
vm.createContext(env);vm.runInContext(home,env,{timeout:2000});
const prog=[];
for(let s=1;s<=2;s++)for(let e=1;e<=60;e++)prog.push({season_number:s,episode_number:e,watched:true});
prog.push({season_number:0,episode_number:60,watched:true},{season_number:0,episode_number:61,watched:true});
assert.equal(env.window.__ctR292HomeTest.countEpisodes(prog),120);
assert.equal(env.window.__ctR292HomeTest.countEpisodes(prog.slice(0,35)),35);
assert.ok(home.includes('tv:-1321137963')&&home.includes("row.remove()"),
 'Wrong generic Formula 1 not hidden DOM-only');
assert.ok(home.includes('ct290-home-special'),'Functional custom F1 could be targeted');
// Simulate the exact regression: correct seven canonical slots then one Trocar
// followed by stale old owner trying to repaint duplicate Watchlist titles.
let redraws=0,reconciled=0,seq=7;
const canonical={__ct288Canonical:true,__ct283ServerAudited:true,_ct186_fresh:{},_ct186_watchlist:{}};
const state={
 window:{addEventListener(){},__ctR278Test:{reconcile(){reconciled++}}},
 document:{documentElement:{dataset:{}},querySelector(){return {querySelectorAll:()=>Array(7).fill({})}}},
 session:{user:{id:'owner'}},user:{id:'owner'},navSeq:7,
 route:()=> 'discover',discoverState:{tab:'foryou'},
 ct186ForYouData:canonical,ct166ForYouData:canonical,
 paintDiscover(){redraws++},discoverRows:async()=>canonical,
 requestAnimationFrame:f=>f(),setTimeout:()=>1,
 Number,String,Boolean,Array,Promise,console
};
vm.createContext(state);vm.runInContext(discover,state,{timeout:2000});
state.paintDiscover(canonical); // first authorized paint
state.window.__ctR292DiscoverTest.reconcile(); // lock after seven slots
state.paintDiscover({__ct288Canonical:false}); // old duplicate Watchlist
state.paintDiscover(canonical); // another background complete
assert.equal(redraws,1,'Legacy redraw replaced seven already selected cards after Trocar');
assert.equal(state.window.__ctR292DiscoverTest.getBlocked(),2);
assert.ok(reconciled>=2,'Local slot reconcile missing');
console.log('ANDROID_1_0_50_TEST_OK: UFC/WWE/F1 v540 history totals not season totals, 120 NFL episodes, duplicate F1 DOM-only hidden, no stale first-Trocar repaint; Web frozen r541');
