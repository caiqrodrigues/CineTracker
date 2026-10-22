import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r320-android-stable-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
assert.ok(start>0&&end>start,'1.0/r320 runtime is missing');
const js=html.slice(start+tag.length,end);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'")&&gradle.includes('versionCode 10121'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));
for(const marker of [
 "const REVISION='r320-android-official-1.0';",
 'window.__ctAndroidOfficialCode=10121;',
 'window.__ctR320Discover={providers,topRows,stats:',
 'const data=await window.__ctR320Discover.topRows(Number(provider));',
 'const providers=await window.__ctR320Discover.providers();',
 'data-ct316-retry',
 "const results=await Promise.allSettled([",
 'Promise.resolve({dash:true})',
 'void Promise.resolve(taste()?.warm?.(true)).catch(()=>{})',
 'void timebox(ct186Context(true),18000).catch(()=>{})',
 "window.__ctR314ForYou={load,mount,swap,action,choose,paint,poolFor,stats:",
 "window.__ctR319Discover={rows,stats:",
 "window.__ctR316Discover={show,ensureTop10,restore,detailVisible,",
 "window.__ctR305MovieHistory=",
 "window.__ctR306Home=",
 "window.__ctR307HomeGuard=",
 "window.__ctR308Home=",
 'cinetracker_recommendation_filter_v525',
 "window.addEventListener('click',sportsClick304,true)",
 "if(events)events.remove();"
])assert.ok(js.includes(marker),'Lost required feature: '+marker);
assert.ok(!js.includes('const data=await ct171TopRows(Number(provider));'));
assert.ok(!js.includes('const providers=await ct171Providers();'));
assert.ok(!js.includes('ct171ProviderList.slice(0,3).map(p=>ct171TopRows('));
assert.equal(js.split('window.__ctR320Discover={providers,topRows,stats:').length-1,1);
assert.equal(js.split('const data=await window.__ctR320Discover.topRows(Number(provider));').length-1,1);
assert.equal(js.split('const providers=await window.__ctR320Discover.providers();').length-1,1);
const block=js.slice(js.indexOf('async function auditedPools(id){'),js.indexOf('async function load(force=false,preserve=false){'));
assert.ok(block.includes("timebox(rpc(name,{p_kind:kind,p_limit}),16000)")===false);
assert.ok(block.includes("const audited=await timebox(window.__ctR279Audit.auditData(raw),20000)"));
assert.ok(block.includes("for(let i=0;i<6;i++)if(results[i].status==='fulfilled')"));
assert.ok(block.includes("if(!verifyData(audited))throw Error("));
assert.ok(block.includes("clean.watch[kind]=arr(audited._ct186_watchlist[kind])"));
assert.ok(block.includes("clean.fresh[kind]=arr(audited._ct186_fresh[kind])"));
assert.ok(block.includes('Promise.resolve({dash:true})'));
assert.ok(block.includes('Promise.resolve(true)'));
assert.ok(!block.includes('timebox(taste()?.warm?.(true)||Promise.resolve(true),18000)'));
assert.ok(!block.includes('  timebox(ct186Context(true),18000),'));

const module=await readFile('apps/android/runtime-r320-discover-loading.js','utf8');
assert.ok(js.includes(module),'r320 must install the reviewed module unchanged');
assert.ok(!module.includes('window.location.reload(')&&!module.includes('router.refresh('));
assert.ok(!module.includes('paintHome(')&&!module.includes('renderSports('));
let providerCallCount=0,topCallCount=0,returnLate=false;
const timers=new Map();let id=0;
const setTimer=(fn,ms)=>{const key=++id;timers.set(key,{fn,ms});return key};
const clearTimer=key=>timers.delete(key);
const fakeWindow={};
const run=new Function('window','ct171Providers','ct171TopRows','setTimeout','clearTimeout',module);
run(fakeWindow,()=>{providerCallCount++;return Promise.resolve([{provider_id:8}])},
 provider=>{topCallCount++;return Promise.resolve({movies:[provider],series:[]})},
 setTimer,clearTimer);
const api=fakeWindow.__ctR320Discover;
assert.ok(api);
assert.deepEqual(await api.providers(),[{provider_id:8}]);
assert.deepEqual(await api.topRows(8),{movies:[8],series:[]});
assert.equal(providerCallCount,1);assert.equal(topCallCount,1);
assert.equal(timers.size,0,'All resolved request timeouts must be cleared');
await assert.rejects(()=>api.topRows(0),/Streaming inválido/);
assert.equal(topCallCount,1,'Invalid provider must never hit the API');
// Independently test bounded failure for a provider query that never settles.
const hanging={};
const fakeWindow2={};
run(fakeWindow2,()=>Promise.resolve([]),
 ()=>new Promise(()=>{}),
 setTimer,clearTimer);
const hangingCall=fakeWindow2.__ctR320Discover.topRows(44);
await Promise.resolve();await Promise.resolve();
const timer=[...timers].find(([,v])=>v.ms===12000);
assert.ok(timer,'Unresolved Top10 must have a strict 12-second deadline');
timer[1].fn();
await assert.rejects(()=>hangingCall,/Top 10.*excedeu 12s/);
assert.equal(fakeWindow2.__ctR320Discover.stats().failures,1);
console.log('CINETRACKER_1_0_R320_TEST_OK: authenticated v421+v525 retained, optional context and taste no longer block ForYou, 12s Top10 timeout with retry, selected provider only, all non-Discover Android functions preserved, public version 1.0.');
