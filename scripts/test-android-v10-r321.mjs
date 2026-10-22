import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const begin=html.indexOf('<script data-ct-android="r321-android-stable-js">');
const end=begin<0?-1:html.indexOf('</script>',begin);
assert.ok(begin>0&&end>begin,'r321 compiled official Android runtime missing');
const js=html.slice(begin+'<script data-ct-android="r321-android-stable-js">'.length,end);
new Function(js);
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1\.0'/);
assert.match(gradle,/versionCode 10122/);
assert.match(gradle,/signingConfig signingConfigs\.official/);
for(const marker of [
 "const REVISION='r321-android-official-1.0';",
 'window.__ctAndroidOfficialCode=10122;',
 'window.__ctR321Discover={topRows:providerRows,',
 'window.__ctR320Discover={providers,topRows,stats:',
 'window.__ctR319Discover={rows,stats:',
 'window.__ctR316Discover={show,ensureTop10,restore,detailVisible,',
 'window.__ctR314ForYou={load,mount,swap,action,choose,paint,poolFor,stats:',
 'cinetracker_discover_watch_unseen_v421',
 'cinetracker_discover_fresh_v421',
 'cinetracker_recommendation_filter_v525',
 'window.__ctR305MovieHistory=',
 'window.__ctR306Home=',
 'window.__ctR308Home='
])assert.ok(js.includes(marker),'Previously working Android feature lost: '+marker);
assert.ok(!js.includes('ct171ProviderList.slice(0,3).map(p=>ct171TopRows('));
assert.ok(!js.includes('timebox(ct186Context(true),18000)'));
assert.equal(js.split('window.__ctR321Discover={topRows:providerRows,').length-1,1);
assert.match(js,/ct314-rail\.daily\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);
assert.doesNotMatch(js,/ct314-rail\.daily\{grid-template-columns:minmax\(0,min\(190px,100%\)\)!important/);
const source=js.slice(js.indexOf('function mount(){'),js.indexOf('// Wrap only the ForYou route.'));
assert.ok(source.includes('serial++;request=null;excluded.clear();model=blank()'));
const context={
 userId:()=> 'current-user',
 reset:()=>{},
 session:{access_token:'fresh'},
 message:()=>{throw Error('Unexpected sign-in blocker')},
 visit:4,navSeq:5,serial:11,request:Promise.resolve('old'),
 excluded:new Map([['daily',new Set(['old'])]]),model:{old:true},
 blank:()=>({newVisit:true}),load:()=>Promise.resolve(true)
};
assert.equal(vm.runInNewContext(source+'; mount()',context),true);
assert.equal(context.serial,12,'Re-entry must invalidate the previous ticket');
assert.equal(context.request,null,'Re-entry must not reuse an earlier request');
assert.equal(context.excluded.size,0);
assert.equal(context.model.newVisit,true);
assert.ok(js.includes("timer=setTimeout(()=>reject(Error('Tempo limite ao carregar Descobrir')),19000);"));
assert.ok(js.includes('timebox(rpc(name,{p_kind:kind,p_limit}),10000)'));
assert.ok(js.includes('timebox(window.__ctR279Audit.auditData(raw),18000)'));

const module=await readFile('apps/android/runtime-r321-discover-recovery.js','utf8');
assert.ok(js.includes(module),'Final Discover module not installed');
assert.doesNotMatch(module,/window\.location\.reload\(|router\.refresh\(|while\s*\(true\)/);
assert.doesNotMatch(module,/paintHome\(|renderSports\(|renderProfile\(/);
let tmdbCalls=0,audits=0,allowed=true;
const listeners=new Map();
const win={
 __ctR320Discover:{topRows:()=>{throw Error('Legacy Top10 waterfall invoked')}},
 __ctR265Test:{allowed:x=>Boolean(x.poster_path)},
 __ctR279Audit:{
  auditCandidates:async items=>{audits++;assert.ok(items.length>0);return allowed},
  permitted:x=>x.id!==2
 },
 addEventListener:(name,listener)=>listeners.set(name,listener)
};
const data=page=>({results:[
 {id:1+page,title:'Movie '+page,name:'Series '+page,poster_path:'/poster.jpg',popularity:100-page},
 {id:2,title:'Excluded watchlist',poster_path:'/poster.jpg',popularity:99}
]});
const run=new Function('window','session','user','safeTmdb',module);
run(win,{user:{id:'user-1'},access_token:'valid'},null,async(path,params)=>{
 tmdbCalls++;
 assert.equal(params.watch_region,'BR');
 assert.ok(['/discover/movie','/discover/tv'].includes(path));
 return data(params.page);
});
const top=await win.__ctR320Discover.topRows(8);
assert.deepEqual(top.movies.map(x=>x.id),[2+0,3].filter(x=>x!==2));
assert.equal(top.series.length,1);
assert.equal(top.movies.every(x=>x.id!==2),true);
assert.equal(audits,1);
assert.equal(tmdbCalls,4,'Only the selected provider receives four page requests');
await win.__ctR320Discover.topRows(8);
assert.equal(tmdbCalls,4,'Top10 should reuse the fresh audited provider cache');
listeners.get('cinetracker:data-changed')();
allowed=false;
await assert.rejects(()=>win.__ctR320Discover.topRows(8),/Não foi possível verificar/);
assert.equal(tmdbCalls,8,'Mutation invalidates provider cache');
assert.equal(win.__ctR321Discover.stats().failures,1);
console.log('CINETRACKER_1_0_R321_TEST_OK: fixed re-entry generations, 2:3 daily parity, bounded v421/v525, authenticated provider Top10 and unchanged Android modules.');
