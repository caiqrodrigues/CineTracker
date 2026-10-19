import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r289-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android r289 executable JS missing');
const js=html.slice(a+tag.length,b);
new Function(js);
const files=[
 'apps/android/runtime-r289-v1047-profile-drilldowns.js',
 'apps/android/runtime-r289-v1047-f1-rankings.js',
 'apps/android/runtime-r289-v1047-special-home-standard.js',
 'apps/android/runtime-r289-v1047-discover-guard.js'
];
const parts=await Promise.all(files.map(p=>readFile(p,'utf8')));
for(const p of parts){
 new Function(p);
 for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
  assert.equal(p.includes(bad),false,'Forbidden '+bad);
}
for(const x of [
 "const REVISION='r289-android-official-1.0.47'",
 'window.__ctAndroidOfficialCode=10089',
 'window.__ctR289Profile',
 'window.__ctR289F1',
 'window.__ctR289SpecialHome',
 'window.__ctR289DiscoverV1047',
 'cinetracker_home_movie_history_v542',
 'cinetracker_profile_media_dashboard_v0991',
 'cinetracker_sports_watch_history_v296',
 'cinetracker_f1_watch_sync_v462',
 'api.jolpi.ca/ergast/f1/',
 'cinetracker_discover_fresh_v421',
 'cinetracker_recommendation_filter_v525',
 'data-ct286-special-quick'
])assert.ok(js.includes(x),'Android r289 missing '+x);
assert.ok(html.includes('name="ct-official-version" content="1.0.47"'),'release metadata mismatch');
const sports=js.indexOf('window.__ctR289F1'),sportsClose=js.indexOf('\n})();\n\n/* CineTracker 1.0.12',sports);
const home=js.indexOf('window.__ctR289SpecialHome'),homeClose=js.indexOf('\n})();\n\n/* r264:',home);
const profile=js.indexOf('window.__ctR289Profile'),boot=js.lastIndexOf('\nboot();');
assert.ok(sports>0&&sportsClose>sports&&home>sportsClose&&homeClose>home&&profile>homeClose&&boot>profile,'Private module scope violated: black login regression');
for(const key of ['series-watchlist','movies-watchlist','series-history','movies-history','episodes-history','sports-tv','sports-stadium'])
 assert.ok(parts[0].includes(key),'Missing stat drilldown '+key);
assert.ok(parts[0].includes('data-ct289-modal')&&parts[0].includes('cinetracker_home_movie_history_v542'),
 'Profile modal full movie history missing');
assert.ok(parts[0].includes('kind.startsWith(\'sports\')'),'TV and stadium separation missing');
assert.ok(parts[1].includes('getF111=async function')&&parts[1].includes('bodyF111=function'),
 'F1 standings must refresh both general and separate tabs');
assert.ok(parts[2].includes('for(const kind of sorted)')&&parts[2].includes('min-width:34px!important'),
 'Home special card width/3-series parity missing');
assert.ok(parts[3].includes('if(!canonical(data)&&canonical(cached))'),
 'Legacy recommendations not blocked');

// Evaluate the actual F1 fallback with a provider response without standing.
const top=[{position:'1',points:'123',Driver:{givenName:'Piloto',familyName:'Teste'}}];
const raw={MRData:{StandingsTable:{StandingsLists:[{DriverStandings:top}]}}};
const f1env={
 window:{},document:{documentElement:{dataset:{}}},
 route:()=> 'sports',q111:()=>({innerHTML:''}),
 f111Data:{season:2026,races:[{round:1}],drivers:null,constructors:null},
 f111Tab:'drivers',f111At:0,
 getF111:async()=>({season:2026,races:[{round:1}]}),
 bodyF111:()=>'<div>Original</div>',
 fetch:async()=>({ok:true,json:async()=>raw}),
 localStorage:{getItem:()=>null,setItem:()=>{}},
 AbortController,setTimeout,clearTimeout,Date,Promise,Map,Set,Array,Number,String,Boolean,
 console
};
vm.createContext(f1env);
vm.runInContext(parts[1],f1env,{timeout:1500});
assert.equal(f1env.window.__ctR289F1Test.standing({drivers:raw},'drivers').length,1);
assert.equal(f1env.window.__ctR289F1Test.valid({drivers:raw,constructors:raw}),false);
const retrieved=await f1env.window.__ctR289F1Test.requestStandings(2026,'drivers');
assert.equal(f1env.window.__ctR289F1Test.standing({drivers:retrieved},'drivers').length,1);

console.log('ANDROID_1_0_47_TEST_OK: Profile 7 history/watchlist stat actions, independent F1 standings, UFC/WWE/F1 standard rows, v525 canonical slots, guarded login, Web frozen');
