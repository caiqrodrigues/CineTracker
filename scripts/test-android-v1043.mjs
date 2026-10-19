import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r285-android-js">',a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android r285 embedded JS missing');
const bundle=html.slice(a+tag.length,b);
const patch=await readFile('apps/android/runtime-r285-v1043-scoped-recovery.js','utf8');
new Function(bundle);new Function(patch);
for(const term of [
 "const REVISION='r285-android-official-1.0.43'",
 'window.__ctAndroidOfficialCode=10085',
 'window.__ctR285AndroidV1043',
 'cinetracker_profile_quick_stats_v1',
 'cinetracker_profile_summary_v489',
 'cinetracker_home_movie_history_v542',
 'cinetracker_discover_fresh_v421',
 'cinetracker_discover_watch_unseen_v421',
 'cinetracker_recommendation_filter_v525',
 "if(!selectedData()?.__ct283ServerAudited&&!ct186Quality(x))return false;",
 "if(!(window.__ctR285AndroidV1043&&route()==='discover'&&discoverState?.tab==='foryou'))window.dispatchEvent"
])assert.ok(bundle.includes(term),'r285 missing '+term);
assert.equal(bundle.includes('&&window.__ctR265Test?.allowed?.(x)===true&&(watch||ct186Quality(x))'),false,
 'extra quality gate after server approval');
assert.ok(html.includes('name="ct-official-version" content="1.0.43"'));
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 assert.ok(!patch.includes(bad),'forbidden '+bad);
// Assert responsive CSS is applied AFTER r282's oversize daily slot.
const oldCss=bundle.indexOf("ct-r282-seven-slots");
const compactCss=bundle.indexOf("ct285-android-cards");
assert.ok(oldCss>=0&&compactCss>oldCss,'new compact daily styles must win cascade');
assert.ok(patch.includes('width:calc((100% - 12px)/3)!important'),'daily card not 3-column width');
assert.ok(patch.includes('aspect-ratio:2/3!important'),'daily poster ratio not fixed');
// Exercise r285's actual Profile recovery without calling a destructive legacy owner.
const props={};
let mounted=false,painted=[],requests=[],tab='profile';
const root={scrollTop:0};
const fakePage={querySelector(){return null},replaceChildren(){}};
const fakeDocument={
 scrollingElement:root,documentElement:{dataset:{}},
 querySelector:x=>x==='[data-profile]'?fakePage:null,
 head:{appendChild:el=>{props.css=el.textContent}},
 createElement:()=>({id:'',textContent:'',className:'',dataset:{},appendChild(){}}),
 addEventListener(){}
};
const owner='android-test-user';
const stub={
 window:{addEventListener(){}},document:fakeDocument,
 session:{user:{id:owner}},user:{id:owner},navSeq:19,route:()=>tab,
 profileCache:null,
 renderProfile:()=>{throw Error('legacy profile called')},
 setApp:()=>{mounted=true},shell:()=>'<main>Perfil</main>',
 ct163Read:()=>null,
 ct168MergeQuick:(base,quick)=>({...base,...quick,stats:quick.stats||base.stats||{}}),
 ct168PaintProfile:(data)=>{painted.push(JSON.parse(JSON.stringify(data)))},
 localStorage:{getItem:()=>null,setItem:()=>{}},
 tz:()=> 'America/Sao_Paulo',
 rpc:async(name,args)=>{
  requests.push(name);
  if(name==='cinetracker_profile_quick_stats_v1')
   return{stats:{movies_watched:900,episodes_watched:2000,total_minutes:70000},series_stats:{completed_series:45}};
  if(name==='cinetracker_profile_summary_v489')
   return{movies:[{media_type:'movie',tmdb_id:10,media_id:10,title:'Filme'}],
    series:[{media_type:'tv',tmdb_id:20,media_id:20,title:'Série'}],
    series_favorites:[],movie_favorites:[],actors:[{actor_name:'Ator'}]};
  if(name==='cinetracker_sports_stadium_summary_v296')return{watched_events:42};
  if(name==='cinetracker_activity_by_day_v517')return[{day:'2026-10-19',count:2}];
  throw Error('unexpected profile RPC '+name);
 },
 requestAnimationFrame:fn=>{fn();return 1},Date,Promise,Map,Set,Number,String,Boolean,Array,
 queueMicrotask,console,
 setTimeout:(fn,ms)=>{const id=setTimeout(fn,ms);id.unref?.();return id}
};
vm.createContext(stub);vm.runInContext(patch,stub,{timeout:1500});
await stub.renderProfile(19);
assert.ok(mounted,'profile route shell missing');
assert.ok(painted.length>=2,'profile should paint progressively');
assert.ok(painted.some(x=>x.stats.movies_watched===900),'verified real statistics not painted');
assert.ok(painted.some(x=>x.dashboard?.some(y=>y.is_seen&&y.media_type==='movie')),
 'profile movie library not painted');
assert.ok(requests.includes('cinetracker_profile_summary_v489'),'separate actual library RPC missing');
assert.ok(!requests.includes('cinetracker_profile_screen_v495'),'slow screen RPC should not block a healthy profile');
assert.ok(props.css?.includes('calc((100% - 12px)/3)'),'daily CSS absent');
console.log('ANDROID_1_0_43_TEST_OK compact 2:3 daily, scoped optimistic mutations, valid swap pool, progressive stats + lists, frozen Web');
