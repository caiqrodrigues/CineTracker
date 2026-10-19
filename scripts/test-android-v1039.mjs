import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r281-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Android 1.0.39 embedded runtime missing');
const js=html.slice(a+marker.length,b);
const patch=await readFile('apps/android/runtime-r281-v1039-profile-and-foryou.js','utf8');
new Function(js);new Function(patch);
for(const need of [
 "const REVISION='r281-android-official-1.0.39';",
 'window.__ctAndroidOfficialCode=10081',
 'window.__ctR281AndroidV1039=',
 'cinetracker_profile_summary_v489',
 "data._ct281AuditDeep?24:(name==='_ct186_reserve'?8:12)",
 'window.__ctR280AndroidV1038','window.__ctR279AndroidV1037',
 'cinetracker_recommendation_filter_v525','cinetracker_profile_screen_v495',
 'cinetracker_sports_stadium_summary_v296'
])assert.ok(js.includes(need),'missing '+need);
assert.ok(html.includes('name="ct-official-version" content="1.0.39"'));
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 assert.equal(patch.includes(banned),false,'forbidden mutation '+banned);
const media=(id,type)=>({media_id:id,media_type:type,tmdb_id:1000+id,title:'Media '+id,poster_path:'/test.jpg',watched_episodes:type==='tv'?10:0,is_favorite:false});
const summary={
 series:[media(1,'tv'),media(2,'tv')],
 movies:[media(3,'movie'),media(4,'movie')],
 series_favorites:[media(1,'tv'),media(5,'tv')],
 movie_favorites:[media(4,'movie'),media(6,'movie')],
 actors:[{tmdb_person_id:88,actor_name:'Ator',profile_path:'/actor.jpg'}],
 counts:{series:45,movies:78,series_favorites:11,movie_favorites:12,actors:6}
};
const saved=new Map(),timers=[],rendered=[];
const root={
 prepend(){},
 querySelector(){return null},
 querySelectorAll(){return []},
 closest(){return null}
};
const document={
 head:{appendChild(){}},querySelector:(sel)=>sel==='[data-profile]'?root:null,
 createElement:()=>({dataset:{},innerHTML:'',className:''}),
 addEventListener(){},scrollingElement:{scrollTop:0}
};
let current='profile',auditCalls=0;
const forYouData={_ct186_fresh:{movie:[],series:[],anime:[]},_ct280AuditPartial:false};
const ctx={
 window:{addEventListener(){},__ctR279Audit:{auditData:async d=>{auditCalls++;return d}}},
 document,Date,Promise,Map,Set,WeakSet,Array,Object,Number,String,JSON,
 session:{user:{id:'profile-user'}},user:{id:'profile-user'},
 route:()=>current,navSeq:3,
 localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,String(value)),removeItem:key=>saved.delete(key)},
 profileCache:{stats:{movies_watched:1328,episodes_watched:17304},dashboard:[],favorite_actors:[]},
 ct168PaintProfile:(data,note)=>{ctx.profileCache=data;rendered.push({data,note})},
 renderProfile:async()=>{},
 ct186LoadForYou:async()=>forYouData,
 discoverState:{tab:'foryou'},
 paintDiscover:()=>{},
 rpc:async (name)=>{assert.equal(name,'cinetracker_profile_summary_v489');return summary},
 requestAnimationFrame:cb=>cb(),queueMicrotask:cb=>cb(),setTimeout:(fn)=>{timers.push(fn);return 1},
 console
};
vm.createContext(ctx);vm.runInContext(patch,ctx,{timeout:1000});
const tests=ctx.window.__ctR281Test;
assert.ok(tests.valid(summary),'real v489 summary must validate');
const d=tests.library(summary);
assert.equal(d.dashboard.length,6,'deduped real media must preserve liked and watched');
assert.equal(d.favorite_actors.length,1,'real actors preserved');
assert.ok(d.dashboard.find(x=>x.media_id===3).is_seen,'real watched movie in list');
assert.ok(d.dashboard.find(x=>x.media_id===5).is_favorite,'real favorite series in list');
await ctx.renderProfile(3);
for(let i=0;i<8;i++)await Promise.resolve();
assert.equal(ctx.profileCache.dashboard.length,6,'profile independent summary did not hydrate media cards');
assert.equal(ctx.profileCache.stats.movies_watched,1328,'stats were wiped by media summary');
assert.ok(rendered.some(x=>x.data.dashboard.length===6),'real summary not painted');
ctx.ct168PaintProfile({stats:{movies_watched:1328},dashboard:[]},'quick update');
assert.equal(ctx.profileCache.dashboard.length,6,'slow stats-only painter cleared previously loaded lists');
assert.equal(tests.read().actors.length,1,'per-user snapshot not saved');
current='discover';
await ctx.ct186LoadForYou(false);
assert.ok(timers.length>0,'missing fresh category did not schedule deeper server audit');
await timers[timers.length-1]();for(let i=0;i<4;i++)await Promise.resolve();
assert.equal(forYouData._ct281AuditDeep,true,'deeper recommendation audit did not activate');
assert.equal(auditCalls,1,'deeper recommendation verification did not run');
assert.ok(!patch.includes('window.location.reload('));
console.log('ANDROID_1_0_39_TEST_OK: full 12-section summary contract, real films/series/favorites/actors, retained stats and library on quick paints, audited Pra Voce second batch, no full-page reload');
