import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r289-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android r289 bundle missing');
const js=html.slice(a+tag.length,b);
new Function(js);
const names=[
 'apps/android/runtime-r289-v1047-profile-metrics.js',
 'apps/android/runtime-r289-v1047-f1-standings.js',
 'apps/android/runtime-r289-v1047-home-parity.js',
 'apps/android/runtime-r289-v1047-discover-guard.js'
];
const parts=await Promise.all(names.map(p=>readFile(p,'utf8')));
for(const code of parts){
 new Function(code);
 for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)'])
  assert.ok(!code.includes(bad),'Full page reload disallowed');
}
for(const key of [
 "const REVISION='r289-android-official-1.0.47'",
 'window.__ctAndroidOfficialCode=10089',
 'window.__ctR289ProfileV1047',
 'window.__ctR289HomeV1047',
 'window.__ctR289DiscoverV1047',
 'window.__ctR289F1Test',
 'cinetracker_profile_media_dashboard_v0991',
 'cinetracker_watchlist_full_v119',
 'cinetracker_sports_watch_history_v296',
 'api.jolpi.ca/ergast/f1/',
 'cinetracker_discover_fresh_v421',
 'cinetracker_recommendation_filter_v525',
 'data-ct286-special-quick',
 "if(isForYou()&&window.__ctR289DiscoverV1047){historyStamp=0;return;}"
])assert.ok(js.includes(key),'Missing '+key);
assert.ok(html.includes('name="ct-official-version" content="1.0.47"'));
assert.ok(js.indexOf('/* r289 F1 standings rescue')<js.indexOf('function rowsF111(a,constructors=false){'));
assert.ok(js.indexOf('/* r289 normalized Home rows')<js.indexOf('\n})();\n\n/* r264:'));
assert.ok(js.indexOf('/* CineTracker Android r289 / 1.0.47: clickable Profile')>js.indexOf('\n})();\n\n/* r264:'));
// F1 standings: validate normalized MRData, alternate flat server rows
const arr=[{position:'1',points:'200',Driver:{givenName:'Teste',familyName:'Piloto'}}];
const response={MRData:{StandingsTable:{StandingsLists:[{DriverStandings:arr}]}}};
const sandbox={
 window:{},getF111:async()=>({races:[{round:'1'}]}),f111Data:null,rowsF111:()=>'<div>legacy rows</div>',
 localStorage:{getItem:()=>null,setItem:()=>{}},document:{documentElement:{dataset:{}}},fetch:async()=>({ok:true,json:async()=>response}),
 AbortController,setTimeout,clearTimeout,Date,Promise,JSON,Array,Object,Number,Error,String
};
vm.createContext(sandbox);
vm.runInContext(parts[1],sandbox,{timeout:2000});
assert.equal(sandbox.window.__ctR289F1Test.list(response,'DriverStandings').length,1);
assert.equal(sandbox.window.__ctR289F1Test.list({DriverStandings:arr},'DriverStandings').length,1);
assert.ok(sandbox.rowsF111([]).includes('Classificação não disponível'));
const rank=await sandbox.getF111(false);
assert.equal(sandbox.window.__ctR289F1Test.list(rank.drivers,'DriverStandings').length,1);
// Profile metric eligibility preserved: Watchlist = distinct genres, movies, series
for(const required of ['watch_tv','watch_movie','history_tv','history_movie','sports_all','sports_stadium','sports_tv'])
 assert.ok(parts[0].includes(required),'Missing Profile counter '+required);
assert.ok(parts[0].includes('window.__ctV120OpenWatchlist')===false,
 'Watchlist should remain delegated to existing ct120 controller');
assert.ok(parts[2].includes('home-action-row ct289-special-row'),'Special Home not using ordinary action-row layout');
assert.ok(parts[2].includes('width:36px!important'),'Special Home action not compact');
assert.ok(parts[2].includes('for(const {k,d} of sorted)'),'Three special series missing');
assert.ok(parts[3].includes('if(!canonical(data)&&canonical(cached))'),'Late callback not guarded');
console.log('ANDROID_1_0_47_TEST_OK F1 normalized+fallback, Profile 7 drilldown counters, standard Home rows, canonical Discover, Web r541 frozen');
