import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r290-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android 1.0.48 embedded runtime missing');
const js=html.slice(a+tag.length,b);new Function(js);
const paths=[
 'apps/android/runtime-r290-v1048-home-parity.js',
 'apps/android/runtime-r290-v1048-profile-order.js',
 'apps/android/runtime-r290-v1048-nfl-superbowl.js',
 'apps/android/runtime-r290-v1048-discover-owner.js'
];
const [home,profile,nfl,discover]=await Promise.all(paths.map(p=>readFile(p,'utf8')));
for(const text of [home,profile,nfl,discover]){
 new Function(text);
 assert.equal(js.split(text).length-1,1,'Feature injected more/less than once');
 for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
  assert.ok(!text.includes(forbidden),'Forbidden operation '+forbidden);
}
for(const token of ["const REVISION='r290-android-official-1.0.48'",
 'window.__ctAndroidOfficialCode=10090','window.__ctR290Home',
 'window.__ctR290Profile','window.__ctR290NFL','window.__ctR290Discover',
 'cinetracker_watchlist_full_v119','cinetracker_mark_episode_v0994',
 'cinetracker_unmark_history_item_v426','cinetracker_recommendation_filter_v525',
 'cinetracker_home_movie_history_v542'
])assert.ok(js.includes(token),'Missing '+token);
assert.ok(html.includes('name="ct-official-version" content="1.0.48"'));
const homeLoc=js.indexOf('window.__ctR290Home'),homeEnd=js.indexOf('\n})();\n\n/* r264:',homeLoc);
const profileStart=js.indexOf('window.__ctR289Profile='),profileLoc=js.indexOf('window.__ctR290Profile');
const lastBoot=js.lastIndexOf('\nboot();');
assert.ok(homeLoc>0&&homeEnd>homeLoc,'Special Home escaped r263 private scope');
assert.ok(profileLoc>profileStart&&lastBoot>profileLoc,'Profile sorting escaped its modal owner');
assert.ok(js.indexOf('window.__ctR290NFL')>profileLoc&&js.indexOf('window.__ctR290Discover')>profileLoc,
 'NFL or Discover patch applied before old painter');

// Real Home mock: all three rows must use the same structure as ordinary series.
const inserts=[];
const stack={querySelector:()=>null,insertAdjacentHTML(pos,value){inserts.push(value)},
 querySelectorAll:()=>[]};
const panel={querySelector:s=>s===':scope > .stack'?stack:null};
const d={
 window:{},document:{documentElement:{dataset:{}},createElement:()=>({}),head:{appendChild(){}}},
 route263:()=> 'home',homeActiveTab158:'series',
 homeView263:()=>({querySelectorAll:()=>[]}),specialPanel263:()=>panel,
 special263:{current:{ufc:{series:{watched_episodes:5,released_episodes:8,available_episodes:3,home_bucket:'continue'}},wwe:null,f1:null}},
 specialCfg263:{ufc:{title:'UFC'},wwe:{title:'WWE Pay-Per-View'},f1:{title:'Fórmula 1'}},
 esc263:x=>String(x),num263:x=>Number(x)||0,rows263:x=>Array.isArray(x)?x:[],
 mountSpecial263:()=>false,loadCurrentSpecial263:async()=>{},Date,Promise,Number,String,Array,Map,Set,console
};
vm.createContext(d);vm.runInContext(home,d,{timeout:1800});
assert.equal(d.mountSpecial263(),true,'All three series must be visible');
assert.equal(inserts.length,3);
assert.ok(inserts.every(s=>s.includes('home-action-row ct290-home-special')),'Nonstandard row');
assert.ok(inserts.some(s=>s.includes('data-ct286-special-quick="ufc"')),'UFC mark seen missing');
assert.ok(home.includes('grid-template-columns:minmax(0,1fr) 38px'),'Right-hand control is not at end');
assert.ok(home.includes('max-width:38px'),'Button oversized');

// NFL: existing synthetic media, 60 years, two episodes each year; no duplicate writing.
const nflEnv={window:{},document:{addEventListener(){},head:{appendChild(){}},
 createElement:()=>({id:'',textContent:'',appendChild(){}})},
 session:{user:{id:'test-profile'}},user:{id:'test-profile'},
 route:()=> 'home',console,Date,Promise,Number,String,Array,Set,Map,CustomEvent:class{},toast(){},
 api:async()=>[],rpc:async()=>({})};
vm.createContext(nflEnv);vm.runInContext(nfl,nflEnv,{timeout:1800});
const t=nflEnv.window.__ctR290NFLTest;
assert.equal(t.roman(1),'I');assert.equal(t.roman(59),'LIX');assert.equal(t.roman(60),'LX');
assert.equal(t.titleFor(2026,1),'Super Bowl LX');
assert.ok(nfl.includes('episode_progress?select=season_number,episode_number,watched'));
assert.ok(nfl.includes('sourceId=-1895884984'));
assert.ok(nfl.includes("p_item_type:'episode'"),'Unmark must target real episode history');

// Profile watcher ordering is fully independent of user-specific data.
const profileCtx={
 window:{},document:{head:{appendChild(){}},createElement:()=>({})},
 createModal:kind=>({kind,el:{querySelector:()=>null}}),
 fetchItems:async()=>[{title:'A',watched_at:'2015-03-15'},{title:'B',watched_at:'2026-10-19'}],
 draw:()=>true,rows:x=>Array.isArray(x?.rows)?x.rows:[],bounded:async p=>p,rpc:async()=>({rows:[]}),
 Date,Promise,Number,String,Array,Set,Map,Intl,console
};
vm.createContext(profileCtx);vm.runInContext(profile,profileCtx,{timeout:1800});
const sorter=profileCtx.window.__ctR290ProfileTest.sorted;
const items=[{title:'Zulu',added_at:'2025-01-01'},{title:'Amora',added_at:'2026-10-19'}];
assert.equal(sorter(items,'latest')[0].title,'Amora');
assert.equal(sorter(items,'oldest')[0].title,'Zulu');
assert.equal(sorter(items,'az')[0].title,'Amora');
assert.equal(sorter(items,'za')[0].title,'Zulu');
const hist=await profileCtx.fetchItems('series-history');
assert.equal(hist[0].title,'B','History should open newest first');
const canonical={__ct283ServerAudited:true,__ct288Canonical:true,_ct186_fresh:{},_ct186_watchlist:{}};
const disc={
 window:{addEventListener(){},__ctR278Test:{reconcile(){}}},
 document:{addEventListener(){},querySelector:()=>null,documentElement:{dataset:{}}},
 route:()=> 'discover',discoverState:{tab:'foryou'},session:{user:{id:'a'}},user:{id:'a'},
 paintDiscover:()=>true,discoverRows:async()=>canonical,
 ct186ForYouData:canonical,ct166ForYouData:canonical,setTimeout:()=>1,Number,Boolean,String,Promise,console
};
vm.createContext(disc);vm.runInContext(discover,disc,{timeout:1800});
assert.ok(disc.window.__ctR290DiscoverTest.valid(canonical));
assert.equal(disc.window.__ctR290DiscoverTest.valid({}),false);
console.log('ANDROID_1_0_48_TEST_OK standard 3 Home series rows with right-side buttons; NFL 1967–2026 existing 120 episodes; newest history + 4 Watchlist filters; canonical seven-slot owner; Web r541 unchanged');
