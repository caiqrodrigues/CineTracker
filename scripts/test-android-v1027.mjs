import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r269-android-js">',a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>0&&b>a,'r269 APK embedded runtime missing');
const js=html.slice(a+marker.length,b);
const patch=await readFile('apps/android/runtime-r269-v1027-phone-performance.js','utf8');
new Function(js);new Function(patch);
for(const part of [
 "const REVISION='r269-android-official-1.0.27'",
 'window.__ctAndroidOfficialCode=10069',
 "window.__ctR269AndroidV1027='f1-four-one-row+foryou-actions-below-text+fast-top10-sports-home'",
 "window.__ctR268AndroidV1026=","window.__ctR267AndroidV1025=","window.__ctR266AndroidV1024=",
 "window.__ctR265AndroidV1023=",
 'cinetracker_sports_stadium_summary_v296','cinetracker_f1_watch_sync_v462',
 'cinetracker_recommendation_filter_v525',
 'cinetracker_sports_watch_set_v296'
])assert.ok(js.includes(part),'required Android authority '+part);
assert.ok(html.includes('name="ct-official-version" content="1.0.27"'));
assert.ok(!js.includes('ct171ProviderList=null;const providers=await ct171Providers()'),'Top 10 reinitializes provider list');
assert.ok(js.includes("if(false&&!q113('[data-ct113-f1-grid]',tabs))"),'legacy F1 Grid fifth-tab mount survived');
assert.ok(js.includes('setTimeout(()=>{if(session)void ct163PreloadAll()},6500)'),'Home initial load still competes with all background preloads');
assert.ok(js.includes("cached?.d?.races?.length&&Date.now()-Number(cached.t||0)<8*60*60*1000"),'F1 Hub does not use fresh real-data snapshot');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(bad),'regression operation '+bad);
for(const test of [
 '#ct-f1-v111 [data-ct113-f1-grid]{display:none!important}',
 'grid-template-columns:repeat(4,minmax(0,1fr))',
 '[data-ct241-section] .ct166-slot .card-body b',
 'white-space:nowrap!important',
 '.ct169-card-actions',
 'margin-top:auto!important',
 'height:42px!important',
 'grid-template-columns:14px minmax(0,1fr) auto!important',
 'grid-column:3!important'
])assert.ok(patch.includes(test),'geometry check '+test);
let requests=0,legacyRequests=0,sportsRendered=0,earlyHub=0,f1Paint=0;
const st=new Map(),lt=new Map(),sheet=[];
const storage=m=>({getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v))});
const sample=(kind,i)=>({id:i,media_type:kind,poster_path:'/poster.jpg',vote_average:8.2,title:'Filme elegível '+i,genre_ids:[12]});
const env={
 window:{},document:{head:{appendChild(el){sheet.push(el.textContent)}},createElement:()=>({textContent:'',id:''}),querySelector:()=>({})},
 session:{user:{id:'person'}},user:{id:'person'},localDay:()=> '2026-10-17',
 localStorage:storage(lt),sessionStorage:storage(st),
 ct171TopRows:async()=>{legacyRequests++;return{movies:[],series:[]}},
 tmdb263:async(p,opt)=>{requests++;return{results:Array.from({length:10},(_,i)=>sample(p.includes('/movie')?'movie':'tv',Number(opt.page)*100+i))}},
 audit263:async(rows)=>rows.filter(x=>x.id&&x.poster_path).slice(0,10),
 sportsCache:null,ct163Read:()=>({sports:[{slug:'f1'}],events:[],favorites:[]}),
 renderSports:async()=>{sportsRendered++},ensureF111Shell:()=>{earlyHub++},paintF111:async()=>{f1Paint++},
 route:()=> 'sports',requestAnimationFrame:f=>f(),console,Date,Map,Set,Promise,
};
env.window.document=env.document;
vm.createContext(env);vm.runInContext(patch,env,{timeout:1000});
const result=await env.ct171TopRows(8);
assert.equal(result.movies.length,10);assert.equal(result.series.length,10);
assert.equal(requests,8,'first Top10 should only fetch 4 pages each medium, concurrently');
assert.equal(legacyRequests,0);
const again=await env.ct171TopRows(8);assert.equal(requests,8,'same-day in-memory Top10 reruns expensive provider query');
assert.equal(again.movies.length,10);
await env.renderSports();
assert.ok(sportsRendered===1&&earlyHub===1&&f1Paint===1,'Sports must render cached F1 immediately');
assert.ok(env.sportsCache&&env.sportsCache.sports.length===1,'Sports existing real cache not restored');
assert.ok(sheet[0].includes('height:42px!important')&&sheet[0].includes('display:grid!important'));
console.log('ANDROID_1_0_27_TEST_OK: fast top10=8 requests only once, 10+10 audited, sports cache first, F1 4 tabs, recommendation fixed card geometry');
