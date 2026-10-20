import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const root='apps/web/dist/';
const [js,html,release,runtime]=await Promise.all([
 readFile(root+'app-v542.js','utf8'),readFile(root+'index.html','utf8'),
 readFile(root+'release.json','utf8'),readFile('apps/web/runtime-r542-wwe-episodes.js','utf8')
]);
new Function(js);new Function(runtime);
assert.ok(js.includes("const REVISION='r542-official-0.3.69'"));
assert.ok(js.includes("window.__ctR541Marker='home-entry-anchor-per-tab+history-hidden-above+no-cross-tab-state'"));
assert.ok(js.includes('ct-wwe-tv-refresh'));
assert.ok(js.includes('cinetracker_home_series_v527'));
assert.ok(js.includes('cinetracker_home_series_watch_state_v4'));
assert.ok(html.includes('app-v542.js'));
assert.ok(JSON.parse(release).revision==='r542-official-0.3.69');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.equal(runtime.includes(bad),false,'Full page refresh forbidden');
const core={route:()=> 'home',edge:async()=>({ok:true,shows:[]}),rpc:async()=>[]};
const sandbox={
 window:{__ctCoreR471:core,addEventListener(){}},document:{addEventListener(){},
  documentElement:{dataset:{}},querySelector:()=>null},
 setTimeout:()=>1,Date,Number,String,Array,Map,Set,Promise,Intl,console
};
vm.createContext(sandbox);vm.runInContext(runtime,sandbox,{timeout:1000});
assert.equal(sandbox.window.__ctR542Wwe.version,'0.3.69');
const w=sandbox.window.__ctR542Wwe.watchedSet([{tmdb_id:4656,watched_keys:[{s:34,e:42}]}],4656);
assert.equal(w.has('34:42'),true);
assert.equal(w.has('34:43'),false);
const latest=sandbox.window.__ctR542Wwe.latestFrom({shows:[{
 tmdb_id:1549,last_episode_to_air:{air_date:'2026-10-16'}
}]},1549);
assert.equal(latest.air_date,'2026-10-16');
await sandbox.window.__ctR542Wwe.sync(true);
assert.equal(sandbox.window.__ctR542Wwe.getCalls(),1);
console.log('WEB_R542_TEST_OK WWE only, last episodes, no document reload; r541 preserved');
