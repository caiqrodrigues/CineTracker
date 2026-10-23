import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r322-android-stable-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start);
assert.ok(start>=0&&end>start,'Built Android r322 runtime is missing');
const js=html.slice(start+tag.length,end);
new Function(js);
assert.ok(js.includes("const REVISION='r322-android-official-1.0';"));
assert.ok(js.includes('window.__ctAndroidOfficialCode=10123;'));
assert.ok(js.includes('cinetracker_discover_fresh_v421'));
assert.ok(js.includes('cinetracker_discover_watch_unseen_v421'));
assert.ok(js.includes('cinetracker_recommendation_filter_v525'));
assert.ok(js.includes('window.__ctR316Discover='));
assert.ok(js.includes('window.__ctR319Discover='));
assert.ok(js.includes('window.__ctR321Discover='));
assert.ok(js.includes('window.__ctR322Top10='));
assert.ok(js.includes('window.__ctR307Taste='));
assert.ok(js.includes('window.__ctR308Home='));
assert.match(js,/ct314-rail\.daily\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);
assert.doesNotMatch(js,/let next=choose\(slot,oldKey\);/);
assert.ok(js.includes('let next=choose(slot,oldKey,false);'));
assert.ok(js.includes('if(!next)next=choose(slot,oldKey,true);'));
assert.doesNotMatch(js,/if\(visit!==navSeq\)\{visit=navSeq;serial\+\+;request=null;excluded\.clear\(\)/);
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1\.0'/);
assert.match(gradle,/versionCode 10123/);
assert.match(gradle,/signingConfig signingConfigs\.official/);

// The actual extracted runtime picker must uniformly rotate through the
// eligible v421/v525 pool and remember previous picks across visits.
const chooseSource=js.slice(js.indexOf('function seenFor(slot){'),js.indexOf('function setCurrent(slot,item,remember=true){'));
assert.ok(chooseSource.includes('Math.floor(randomness()*available.length)'));
assert.ok(!chooseSource.includes('taste()?.choose?.('),'No deterministic taste override may select the same title');
const store=new Map(),seenRows=Array.from({length:17},(_,i)=>({media_type:'movie',id:i+1}));
const context={
 owner:'account-A',excluded:new Map(),
 localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},
 selectedRefs:()=>new Set(),poolFor:()=>seenRows,
 admissible:()=>true,identity:x=>'movie:'+x.id,
 Math:{floor:Math.floor,random:()=>0},Uint32Array
};
const picker=vm.runInNewContext(chooseSource+';({choose,seenFor,rememberSeen})',context);
const shown=[];
for(let i=0;i<17;i++){
 const selected=picker.choose('fresh:movie','',false);
 assert.ok(selected,'Should still have a never-shown eligible choice');
 shown.push(selected.id);
 picker.seenFor('fresh:movie').add('movie:'+selected.id);
 picker.rememberSeen('fresh:movie');
}
assert.equal(new Set(shown).size,17,'No title may repeat while an eligible unseen title exists');
assert.equal(picker.choose('fresh:movie','',false),null,'Exhausted picks must invite a refill');
context.excluded=new Map();
assert.equal(picker.seenFor('fresh:movie').size,17,'Seen IDs survive leaving and reopening the tab');
assert.ok(picker.choose('fresh:movie','movie:17',true),'Explicit recycling must recover when no new title exists');
context.owner='account-B';context.excluded=new Map();
assert.equal(picker.seenFor('fresh:movie').size,0,'Impressions are scoped to one authenticated user');

const module=await readFile('apps/android/runtime-r322-top10-complete.js','utf8');
assert.ok(js.includes(module),'Adaptive Top 10 module must be bundled in Android');
assert.doesNotMatch(module,/window\.location\.reload\(|router\.refresh\(|while\s*\(true\)/);
assert.doesNotMatch(module,/paintHome\(|renderSports\(|renderProfile\(/);
let calls=0,audits=0,permit=true;
const listeners=new Map(),session={user:{id:'account-A'},access_token:'token'};
const window={
 __ctR320Discover:{topRows:()=>{throw Error('Old two-page source used')}},
 __ctR265Test:{allowed:x=>Boolean(x.poster_path)},
 __ctR279Audit:{
  auditCandidates:async batch=>{audits++;assert.ok(batch.length>0);return permit},
  permitted:x=>Number(x.id)%3!==0
 },
 addEventListener:(key,fn)=>listeners.set(key,fn)
};
const run=new Function('window','session','user','safeTmdb',module);
run(window,session,null,async(path,{page,watch_region,with_watch_providers})=>{
 calls++;
 assert.equal(watch_region,'BR');assert.equal(with_watch_providers,8);
 assert.ok(['/discover/movie','/discover/tv'].includes(path));
 return {results:Array.from({length:4},(_,i)=>({
  id:(page-1)*4+i+1,poster_path:'/poster.jpg',popularity:100-(page-1)*4-i
 }))};
});
const top=await window.__ctR320Discover.topRows(8);
assert.equal(top.movies.length,10,'Top 10 movies must continue past two pages');
assert.equal(top.series.length,10,'Top 10 series must continue past two pages');
assert.ok(calls>4,'The adaptive source must request continuation pages');
assert.ok(calls<=30,'Bounded search must never exceed 15 pages per media type');
assert.ok(audits>=2,'Each continuation wave must pass personal v525 audit');
assert.ok([...top.movies,...top.series].every(x=>x.id%3!==0));
const before=calls;
await window.__ctR320Discover.topRows(8);
assert.equal(calls,before,'Complete, audited results use short per-account cache');
listeners.get('cinetracker:data-changed')();
permit=false;
await assert.rejects(window.__ctR320Discover.topRows(8),/Não foi possível confirmar/);
session.user.id='account-B';permit=true;
assert.equal((await window.__ctR320Discover.topRows(8)).movies.length,10);
assert.equal(window.__ctR322Top10.stats().completed,2);

console.log('CINETRACKER_ANDROID_1_0_R322_TEST_OK: web-style unbiased rotation, persisted distinct picks, authenticated isolation, 10+10 adaptive audited Top10, original Android modules preserved.');
