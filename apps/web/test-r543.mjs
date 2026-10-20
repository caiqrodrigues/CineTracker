import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const [js,html,release,runtime]=await Promise.all([
 readFile('apps/web/dist/app-v543.js','utf8'),
 readFile('apps/web/dist/index.html','utf8'),
 readFile('apps/web/dist/release.json','utf8'),
 readFile('apps/web/runtime-r542-wwe-episodes.js','utf8')
]);
new Function(js);new Function(runtime);
assert.ok(js.includes("const REVISION='r543-official-0.3.70'"),'new Web version missing');
assert.ok(js.includes("window.__ctR541Marker='home-entry-anchor-per-tab+history-hidden-above+no-cross-tab-state'"),'frozen UI changed');
assert.ok(js.includes("edge:(name,body={},timeout=18000)=>edge(name,body,timeout),"),
 'WWE update depends on missing authenticated r471 Edge bridge');
assert.equal(js.split("edge:(name,body={},timeout=18000)=>edge(name,body,timeout),").length-1,1,
 'Core bridge must export authenticated Edge helper exactly once');
assert.ok(js.includes("window.__ctR542Wwe="),'WWE Home live patch lost');
assert.ok(js.includes('cinetracker_home_series_v527'));
assert.ok(js.includes('cinetracker_home_series_watch_state_v4'));
assert.ok(html.includes('app-v543.js')&&html.includes('app-v543.css'));
assert.equal(JSON.parse(release).revision,'r543-official-0.3.70');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.ok(!runtime.includes(bad),'Forbidden full refresh');

// Execute the exact injected bridge source. Its new Edge method must call
// the existing authenticated POST helper without copying or exposing a JWT.
const start=js.indexOf('window.__ctCoreR471=Object.freeze({');
const end=js.indexOf('});',start);
assert.ok(start>0&&end>start);
const fragment=js.slice(start,end+3);
const calls=[];
const sandbox={
 window:{},
 route:()=> 'home',
 session:{access_token:'opaque-user-jwt'},
 rpc:async (name,args)=>({name,args}),
 edge:async(name,body,timeout)=>{calls.push({name,body,timeout});return {ok:true}},
 tz:()=> 'America/Sao_Paulo',
 img:(path,size)=>size+':'+path,
 profileCache:{},profileRows:()=>({}),mediaCard:()=> '',
 toast:()=>{},ct171OpenActivityDay:()=>{},
 Object,Boolean
};
vm.createContext(sandbox);vm.runInContext(fragment,sandbox,{timeout:1000});
const bridge=sandbox.window.__ctCoreR471;
assert.equal(bridge.route(),'home');
assert.equal(bridge.authReady(),true);
const response=await bridge.edge('ct-wwe-tv-refresh',{source:'test-r543'});
assert.equal(response.ok,true);
assert.deepEqual(calls.map(c=>c.name),['ct-wwe-tv-refresh']);
assert.equal(calls[0].timeout,18000);
assert.equal(calls[0].body.source,'test-r543');

// Verify the existing r542 Home behavior calls the newly-exposed bridge on
// entering the Home while leaving non-Home routes and app rendering alone.
let active='home';
const client={
 window:{__ctCoreR471:{...bridge,route:()=>active},addEventListener(){}},
 document:{addEventListener(){},documentElement:{dataset:{}},querySelector:()=>null,hidden:false},
 setTimeout(){return 1},Intl,Date,Number,Boolean,String,Array,Map,Set,Promise,console
};
vm.createContext(client);
vm.runInContext(runtime,client,{timeout:1200});
assert.equal(typeof client.window.__ctR542Wwe.sync,'function');
assert.equal(typeof client.window.__ctR542Wwe.applyToHome,'function');
assert.equal(client.window.__ctR542Wwe.getCalls(),0);
active='profile';
assert.equal(await client.window.__ctR542Wwe.sync(true),false);
console.log('WEB_R543_TEST_OK authenticated Edge bridge invokes WWE refresh, no page reload, r541 UI preserved');
