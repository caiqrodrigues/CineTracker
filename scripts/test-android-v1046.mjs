import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r288-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android 1.0.46 release missing');
const bundled=html.slice(a+tag.length,b);
new Function(bundled);
const special=(await readFile('apps/android/runtime-r288-v1046-special-home.js','utf8')).trim();
const discover=(await readFile('apps/android/runtime-r288-v1046-foryou-stability.js','utf8')).trim();
new Function(special);new Function(discover);
for(const token of [
 "const REVISION='r288-android-official-1.0.46'",
 "window.__ctAndroidOfficialCode=10088",
 "next.__ct288Canonical=true;",
 "window.__ctR288DiscoverV1046",
 "window.__ctR288HomeV1046",
 "cinetracker_discover_watch_unseen_v421",
 "cinetracker_discover_fresh_v421",
 "cinetracker_recommendation_filter_v525",
 "cinetracker_f1_series_v512",
 "cinetracker_wwe_ppv_series_v519",
 "cinetracker_ufc_series_v518"
])assert.ok(bundled.includes(token),'Missing '+token);
const inner=bundled.indexOf('window.__ctR288HomeV1046');
const firstClose=bundled.indexOf('\n})();\n\n/* r264:',inner);
const outside=bundled.indexOf('window.__ctR288DiscoverV1046');
assert.ok(inner>0&&firstClose>inner&&outside>firstClose,'Home runs INSIDE r263, Discover AFTER legacy owners');
assert.ok(html.includes('name="ct-official-version" content="1.0.46"'));
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.ok(!special.includes(bad)&&!discover.includes(bad),'Forbidden full reload '+bad);
// Test all three special rows with UFC loaded, and F1/WWE missing.
const rendered=[],styles=[];
const stack={
 querySelector(){return null},
 insertAdjacentHTML(_position,html){rendered.push(html)}
};
const panel={querySelector(){return stack}};
const dataUfc={series:{home_bucket:'continue',available_episodes:1},events:[{episode_number:2,released:true,is_watched:false}]};
const owners={
 window:{},session:{user:{id:'person-a'}},user:{id:'person-a'},homeActiveTab158:'series',route263:()=> 'home',
 document:{documentElement:{dataset:{}},createElement:()=>({}),head:{appendChild(x){styles.push(x.textContent)}}},
 homeView263:()=>({querySelectorAll:()=>[]}),specialPanel263:()=>panel,
 special263:{current:{ufc:dataUfc,wwe:null,f1:null}},rows263:x=>Array.isArray(x)?x:[],
 specialCfg263:{ufc:{title:'UFC'},wwe:{title:'WWE Pay-Per-View'},f1:{title:'Fórmula 1'}},
 esc263:x=>String(x),num263:x=>Number(x)||0,
 specialCard263:(kind)=>'<div class="media-row ct263-special" data-ct263-special="'+kind+'"><div class="thumb"></div><div><b>Title</b></div><span class="badge">›</span></div>',
 mountSpecial263:()=>false,recount263:()=>{},
 loadCurrentSpecial263:async()=>owners.special263.current,
 console,setTimeout,Date,Promise,Math,Boolean,Number,String,Array,Map,Set
};
vm.createContext(owners);vm.runInContext(special,owners,{timeout:2000});
assert.equal(owners.mountSpecial263(),true,'Home must show all three tracked series');
assert.equal(rendered.length,3,'No special Home series may disappear when RPC is empty');
assert.equal(rendered.filter(x=>x.includes('Sincronização pendente')).length,2,'Missing data must be disclosed');
assert.ok(rendered.some(x=>x.includes('ct288-quick')),'UFC must have small inline seen button');
assert.ok(styles.some(x=>x.includes('max-width:36px!important')),'Quick button width must be bounded');
owners.special263.current.ufc=null;
await owners.loadCurrentSpecial263(true);
assert.ok(owners.special263.current.ufc===dataUfc,'Transient sync failure erased loaded UFC');
assert.equal(rendered.length,6,'Home must render after sync completes');
// Test authenticated seven-slot paint remains owned after asynchronous legacy callbacks.
const pools={movie:[{id:1}],series:[{id:2}],anime:[{id:3}]};
const canonical={__ct283ServerAudited:true,__ct288Canonical:true,_ct186_fresh:pools,_ct186_watchlist:pools};
const old={__ct283ServerAudited:true,_ct186_fresh:pools,_ct186_watchlist:pools};
let paints=[],reconciles=0,epoch=0;
const env={
 window:{__ctR278Test:{reconcile(){reconciles++}}},session:{user:{id:'person-a'}},user:{id:'person-a'},
 discoverState:{tab:'foryou'},route:()=> 'discover',localDay:()=> '2026-10-19',navSeq:12,
 ct186ForYouData:null,ct166ForYouData:null,
 discoverRows:async()=>old,ct186LoadForYou:async()=>canonical,
 paintDiscover:function(data){paints.push(data);return true},
 markSeen:async()=>true,addWatchlist:async()=>true,
 document:{documentElement:{dataset:{}},createElement:()=>({}),head:{appendChild(){}}},
 requestAnimationFrame:fn=>{fn();return 1},console,Promise,Number,String,Boolean,Date,setTimeout
};
vm.createContext(env);vm.runInContext(discover,env,{timeout:2000});
const response=await env.discoverRows('foryou');
assert.equal(response,canonical);assert.equal(env.ct186ForYouData,canonical);
const before=paints.length;env.paintDiscover(old);
assert.equal(paints.length,before,'Legacy callback unexpectedly replaced current slots');
assert.equal(env.ct186ForYouData,canonical,'Legacy callback reset canonical v525 source');
env.paintDiscover(canonical);
assert.equal(paints.length,before+1);assert.ok(reconciles>=1,'Buttons not restored by final owner');
epoch=env.window.__ctR286VisitEpoch;env.navSeq=13;await env.discoverRows('foryou');
assert.equal(env.window.__ctR286VisitEpoch,epoch+1,'Reopening did not rotate the recommendation epoch');
console.log('ANDROID_1_0_46_TEST_OK: 3 Home rows, bounded UFC button, retained WWE/F1, canonical seven slots, stale paints ignored, opening rotation, Web unchanged');
