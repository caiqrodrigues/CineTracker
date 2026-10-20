import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r293-android-js">';
const at=html.indexOf(marker),to=at<0?-1:html.indexOf('</script>',at+marker.length);
assert.ok(at>=0&&to>at,'Android r293 missing embedded JavaScript');
const js=html.slice(at+marker.length,to);
new Function(js);
const source=(await readFile('apps/android/runtime-r293-v1051-foryou-single-owner.js','utf8')).trimEnd();
new Function(source);
assert.equal(js.split(source).length-1,1,'Singleton r293 owner injected incorrectly');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.ok(!source.includes(bad),'Forbidden full refresh '+bad);
for(const x of [
 "const REVISION='r293-android-official-1.0.51'",
 'window.__ctAndroidOfficialCode=10093',
 'window.__ctR293Gate?.shouldBlockPaint?.(rows)',
 'window.__ctR293Gate?.afterPaint?.(rows,h)',
 "window.__ctR293Gate?.beforeRoute?.()",
 "window.__ctR293Gate?.commit?.(data,document.querySelector('[data-discover-content]'))",
 'if(!window.__ctR293Gate?.locked?.())paintDiscover(d)',
 'window.__ctR293Gate.restoreData();return;',
 "window.__ctR293Gate={",
 "cinetracker_discover_watch_unseen_v421",
 "cinetracker_discover_fresh_v421",
 "cinetracker_recommendation_filter_v525",
 "window.__ctR278Test",
 "window.__ctR292Home",
 "cinetracker_special_series_counts_v540"
])assert.ok(js.includes(x),'Missing '+x);
assert.ok(html.includes('name="ct-official-version" content="1.0.51"'));
assert.equal(js.split('window.__ctR293Gate?.afterPaint?.(rows,h)').length-1,1,'Original r158 DOM sink not uniquely gated');
assert.equal(js.split("if(discoverState.tab==='foryou'&&window.__ctR293Gate?.beforeRoute?.())return;").length-1,1,'Missing original renderDiscover guard');

// Old pre-r293 owners capture originalPaint references, and bypass every
// later wrapper. Only the original r158 DOM sink prevents their repaint.
const early=js.indexOf("function paintDiscover(rows){");
const delayed=js.indexOf('if(!window.__ctR293Gate?.locked?.())paintDiscover(d)');
assert.ok(early>0&&delayed>early,'Stored callback must reach the guarded original sink');

// A user's v525-authenticated seven cards and local in-place Trocar selection
// must survive any (stale or even audited) delayed paint and shell redraw.
let activeRoute='discover',tab='foryou',account='viewer-42';
const seven=Array.from({length:7},(_,i)=>({tag:'card-'+i,selected:'initial-'+i}));
const root={
 isConnected:true,childNodes:[{tag:'sections',children:seven}],
 querySelectorAll(sel){
  if(sel==='[data-ct241-slot-key]'||sel==='[data-ct277-action="swap"]')return seven;
  return [];
 },
 replaceChildren(...nodes){this.childNodes=nodes;}
};
let currentRoot=root,reconciles=0,observed=0;
class Observer{
 constructor(callback){this.callback=callback}
 observe(){observed++}
 disconnect(){}
}
const mock={
 window:{addEventListener(){},__ctR278Test:{reconcile(){reconciles++}}},
 document:{
  querySelector:sel=>sel==='[data-discover-content]'?currentRoot:null,
  documentElement:{dataset:{}},createElement:()=>({}),
  head:{appendChild(){}},addEventListener(){}
 },
 session:{user:{id:account}},user:{id:account},discoverState:{tab},
 route:()=>activeRoute,navSeq:88,ct186ForYouData:null,ct166ForYouData:null,
 requestAnimationFrame:fn=>{fn();return 1},
 cancelAnimationFrame(){},queueMicrotask:fn=>fn(),MutationObserver:Observer,
 Number,String,Boolean,Date,Set,Map,Array,Promise,console
};
vm.createContext(mock);
vm.runInContext(source,mock,{timeout:2000});
const gate=mock.window.__ctR293Gate;
const canonical=()=>({__ct288Canonical:true,__ct283ServerAudited:true,
 _ct186_fresh:{movie:[{id:5}],series:[{id:3}],anime:[]},
 _ct186_watchlist:{movie:[{id:22}],series:[{id:15}],anime:[{id:9}]}});
const correct=canonical();
assert.equal(gate.shouldBlockPaint({}),false,'Cannot block initial correct screen');
gate.afterPaint(correct,root);
assert.equal(gate.locked(),true,'First audited seven-slot screen not committed');
assert.equal(mock.ct186ForYouData,correct);
assert.ok(observed>=1,'Liveness observer missing');
// User presses Trocar — changes one local card, never its section DOM node.
seven[0].selected='swapped-51';
const late={_ct186_fresh:{movie:[{id:123}]},_ct186_watchlist:{movie:[{id:999}]}};
assert.equal(gate.shouldBlockPaint(late),true,'Unverified #Alive Watchlist would replace seven slots');
assert.equal(gate.shouldBlockPaint(canonical()),true,'Even stale audited responses must not reset local swaps');
assert.equal(gate.beforeRoute(),true,'Watchlist mutation would re-render the ENTIRE route shell');
assert.equal(seven[0].selected,'swapped-51','Trocar selection changed unexpectedly');
assert.equal(mock.ct186ForYouData,correct,'Stale callback overwrote live pool');
// Bypass original painter via direct innerHTML/setApp simulation.
const bad={tag:'legacy-#Alive-series-12-11-46'};
root.childNodes=[bad];
gate.repair();
assert.equal(root.childNodes[0].children[0].selected,'swapped-51','DOM not restored after direct legacy paint');
assert.equal(mock.document.documentElement.dataset.ct293Owner,'authenticated-v525-seven-slots');
assert.ok(reconciles>0);
assert.ok(gate.stats().paintBlockCount===2);
assert.ok(gate.stats().routeBlockCount===1);
// Returning from another route must allow fresh authenticated recommendations
// to initialize; keeping an old detached root would break new navigation.
activeRoute='home';root.isConnected=false;gate.clearIfLeaving();
activeRoute='discover';const newer={...root,isConnected:true,childNodes:[{tag:'new',children:seven}]};
currentRoot=newer;
const next=canonical();gate.afterPaint(next,newer);
assert.equal(gate.locked(),true,'New Discover visit failed');
assert.equal(mock.ct186ForYouData,next,'New visit reused old user pool');

// Regression: r116 scheduled its own full old Watchlist after an arbitrary
// async response (often ~5 seconds idle). It must never run on Pra Você.
for(const sourceText of [
 "async function hydrateWatch116(force=false){\n if(window.__ctR293Gate&&route()==='discover'&&discoverState?.tab==='foryou')return;",
 "function display(s){\n if(window.__ctR293Gate&&route()==='discover'&&discoverState?.tab==='foryou')return;",
 "function invalidate196(){\n  if(window.__ctR293Gate&&route()==='discover'&&discoverState?.tab==='foryou'){",
 "function ct186RealtimeChange(table,data){\n  if(!ct186RealtimeRelevant(table,data))return;\n  if(window.__ctR293Gate&&route()==='discover'&&discoverState?.tab==='foryou'){",
 "if(window.__ctR293Gate&&isForYou()){historyStamp=0;return;}"
])assert.ok(js.includes(sourceText),'Legacy full-screen update survives: '+sourceText.slice(0,64));
const take=(begin,end)=>{
 const i=js.indexOf(begin),j=i<0?-1:js.indexOf(end,i+begin.length);
 assert.ok(i>=0&&j>i,'Missing uniquely isolated legacy function '+begin);
 return js.slice(i,j);
};
const ctx={
 window:{__ctR293Gate:{},dispatchEvent(){throw Error('Legacy broadcast invoked')}},
 route:()=> 'discover',discoverState:{tab:'foryou'},document:{documentElement:{dataset:{}}},
 homeCache:{},profileCache:{},discoverCache:{clear(){}},ct171SeenMap:{},
 ct186ContextValue:{watchMovieIds:new Set([123])},ct186ContextAt:999,
 ct186LocalBlocked:new Set(),ct186RealtimeRelevant:()=>true,
 ct186ResolveMediaKey:async()=> 'movie:123',
 ct186RefreshVisible(){throw Error('Forbidden realtime page refresh')},
 Promise,Number,String,Date,console
};
vm.createContext(ctx);
vm.runInContext(take('async function hydrateWatch116(force=false){','\ntry{const base=paintDiscover;paintDiscover=function'),ctx,{timeout:1500});
const noHydration=await ctx.hydrateWatch116(false);
assert.equal(noHydration,undefined,'Late watchlist hydration attempted a redraw');
vm.runInContext(take('function invalidate196(){','\nfunction paintWatchButton196('),ctx,{timeout:1500});
const savedContext=ctx.ct186ContextValue;
ctx.invalidate196();
assert.equal(ctx.ct186ContextValue,savedContext,'Watchlist mutation discarded selection context');
assert.equal(ctx.document.documentElement.dataset.ct293WatchlistUpdate,'in-place');
vm.runInContext(take('function ct186RealtimeChange(table,data){','\nfunction ct186RealtimeStart('),ctx,{timeout:1500});
ctx.ct186RealtimeChange('media_overrides',{type:'INSERT',record:{media_id:783}});
await Promise.resolve();await Promise.resolve();
assert.equal(ctx.document.documentElement.dataset.ct293Realtime,'local-only');
assert.equal(ctx.ct186LocalBlocked.has('movie:123'),true);
const late={
 window:{__ctR293Gate:{}},route:()=> 'discover',discoverState:{tab:'foryou'},
 visible(){throw Error('Legacy TMDB progressive painter reached')},
 console
};
vm.createContext(late);
vm.runInContext(take('function display(s){','\nasync function verify('),late,{timeout:1500});
late.display({owner:'outdated'});
console.log('ANDROID_1_0_51_TEST_OK: old captured r279 painter guarded at original DOM sink, 5-second Watchlist snapback blocked, first render allowed, local Trocar and Watchlist mutation retain seven cards/scroll, new navigation resets, login and Web frozen');
