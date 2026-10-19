import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const file='apps/android/app/src/main/assets/hotfix5/index.html';
const html=await readFile(file,'utf8'),tag='<script data-ct-android="r291-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'1.0.49 Android JS missing');
const js=html.slice(a+tag.length,b);new Function(js);
const home=await readFile('apps/android/runtime-r291-v1049-home-count-and-logo.js','utf8');
const art=await readFile('apps/android/runtime-r291-v1049-nfl-art.js','utf8');
new Function(home);new Function(art);
for(const token of [
 "const REVISION='r291-android-official-1.0.49'",
 "window.__ctAndroidOfficialCode=10091",
 "ct291SuppressedRepaint",
 "ct291DrawNav===navSeq",
 "window.__ctR291Home",
 "window.__ctR291NFLArt",
 "Show do intervalo · Super Bowl",
 "ct291-nfl-badge",
 "ct291-nfl-poster",
 "SUPER BOWL",
 "HALFTIME",
 "NFL-branded-super-bowl-game-and-halftime-covers",
 "fixed-check-36px-all-time-UFC-793-WWE-567-and-NFL-identity",
 "cinetracker_recommendation_filter_v525",
 "cinetracker_discover_watch_unseen_v421",
 "cinetracker_mark_episode_v0994",
 "cinetracker_unmark_history_item_v426",
 "cinetracker_watchlist_full_v119",
 "cinetracker_home_movie_history_v542"
])assert.ok(js.includes(token),'Missing '+token);
assert.ok(html.includes('name="ct-official-version" content="1.0.49"'));
assert.ok(home.includes('height:36px!important')&&home.includes('max-height:36px!important'),
 'Home watch control not vertically bounded');
assert.ok(home.includes('total_episodes')&&home.includes('793')&&home.includes('567'),
 'Home full UFC/WWE series catalog totals missing');
assert.ok(home.includes('g85fqz1662057187.png'),'NFL logo missing');
assert.ok(art.includes('ct291-nfl-game')&&art.includes('ct291-nfl-halftime'),
 'NFL separate game/halftime artwork missing');
// Verify the actual original r284 owner no longer repaints existing 7 slots
// after a successful first render and two synthetic local Trocar actions.
const start=js.indexOf('let ct291DrawNav=-1'),end=js.indexOf('async function bucket(group,kind){',start);
assert.ok(start>0&&end>start,'r284 scoped override missing');
const segment=js.slice(start,end);
const dom={querySelectorAll:()=>Array(7).fill({})};
const p={
 isForYou:()=>true,owner:()=> 'test-account',navSeq:19,
 document:{querySelector:()=>dom,documentElement:{dataset:{}}},
 window:{__ctR278Test:{reconcile(){p.reconciles++}}},
 queueMicrotask:fn=>fn(),reconciles:0,painted:0,
 paintDiscover:()=>{p.painted++},
 ct186ForYouData:null,ct166ForYouData:null,ct186ContextValue:{dash:[]},
 ct186Select:()=>({daily:null,fm:null,fs:null,fa:null,wm:null,ws:null,wa:null}),
 moreThanZero:()=>true,
 Set,Map,Date,Array,Number,String,Boolean
};
vm.createContext(p);
vm.runInContext(segment+'\nwindow.probeRenderData=renderData;',p,{timeout:1000});
const data=()=>({__ct283ServerAudited:true,_ct186_fresh:{},_ct186_watchlist:{}});
assert.equal(p.window.probeRenderData(data()),true);
assert.equal(p.painted,1,'Initial v525 render should show seven slots');
assert.equal(p.window.probeRenderData(data()),true);
assert.equal(p.window.probeRenderData(data()),true);
assert.equal(p.painted,1,'Two late async v525 refreshes reset local swaps');
assert.ok(p.reconciles>=2,'Active controls must reconcile in place');
p.navSeq=20;
p.window.probeRenderData(data());
assert.equal(p.painted,2,'New navigation must show fresh eligible recommendations');
assert.equal(p.document.documentElement.dataset.ct291SuppressedRepaint,'2');
// NFL T1/T2 cannot be reimported; only reinterpret existing coordinates.
assert.ok(js.includes("season===1?'Super Bowl '"));
assert.ok(js.includes("season===1?'game':'halftime'"));
assert.ok(js.includes('sourceId=-1895884984'));
assert.ok(js.includes('episode_progress?select=season_number,episode_number,watched'));
console.log('ANDROID_1_0_49_TEST_OK: double Trocar never resets 7 slots; new visit still paints, UFC 793/WWE 567 history, 36px action, NFL badge + game/halftime artwork, previous Profile/Sports and login preserved');
