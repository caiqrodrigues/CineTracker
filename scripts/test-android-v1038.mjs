import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r280-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'Android v1.0.38 compiled runtime missing');
const js=html.slice(a+marker.length,b);
const patch=await readFile('apps/android/runtime-r280-v1038-profile-audit-resilience.js','utf8');
new Function(js);new Function(patch);
for(const key of [
 "const REVISION='r280-android-official-1.0.38';",
 'window.__ctAndroidOfficialCode=10080','window.__ctR280AndroidV1038',
 'cinetracker_profile_screen_v495','rawPools=new WeakMap()',
 'cinetracker_recommendation_filter_v525','data._ct280AuditPartial=!success;',
 'data._ct280AuditRetries','ct280:profile:',
 "function ct163WarmOnIdle(){/* r280: visible tabs own their fetch;",
 'window.__ctR279AndroidV1037',
 'window.__ctR278AndroidV1036','cinetracker_sport_mark_watched_v1',
 'cinetracker_sports_stadium_summary_v296','cinetracker_f1_watch_sync_v462'
])assert.ok(js.includes(key),'missing '+key);
assert.ok(html.includes('name="ct-official-version" content="1.0.38"'));
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 assert.ok(!patch.includes(banned),'forbidden behavior '+banned);
const from=js.indexOf('/* CineTracker Android 1.0.37/r279'),to=js.indexOf('/* CineTracker Android 1.0.38 / r280',from+1);
assert.ok(from>0&&to>from,'r279 isolated authentication module missing');
const audit=js.slice(from,to);
const item=(id,title)=>({id,media_type:'movie',title,release_date:'2025-01-01',vote_average:8.4,poster_path:'/img.jpg'});
const data={
 _ct186_fresh:{movie:[item(1,'Movie already watched'),item(2,'Eligible movie'),item(3,'Eligible extra')],series:[],anime:[]},
 _ct186_watchlist:{movie:[item(4,'Own movie watchlist'),item(1,'Seen watchlist entry')],series:[],anime:[]},
 _ct186_reserve:{movie:[item(5,'Eligible reserve')],series:[],anime:[]}
};
let fail=true,calls=0;
const document={documentElement:{dataset:{}},head:{appendChild(){}},createElement:()=>({textContent:'',id:''})};
const ctx={window:{addEventListener(){}},document,session:{user:{id:'accountA'}},user:{id:'accountA'},
 localDay:()=> '2026-10-19',ct186Id:x=>x?.id,ct186Type:x=>x?.media_type,ct186Year:()=>2025,
 ct186LoadForYou:async()=>data,paintDiscover:()=>{},route:()=> 'home',discoverState:{tab:'foryou'},
 ct186ForYouData:data,Map,Set,WeakMap,Promise,Number,String,Object,Array,Date,
 setTimeout:()=>0,clearTimeout:()=>{},console,
 rpc:async(name,args)=>{
  assert.equal(name,'cinetracker_recommendation_filter_v525');
  calls++;
  if(fail)throw new Error('simulated network timeout');
  const keys=args.p_items.map(x=>x.media_type+':'+x.tmdb_id);
  return {checked_count:keys.length,
   blocked_keys:keys.filter(x=>['movie:1','movie:4'].includes(x)),
   watch_keys:keys.filter(x=>x==='movie:4'),
   seen_keys:keys.filter(x=>x==='movie:1'),
   not_interested_keys:[]};
 }
};
vm.createContext(ctx);vm.runInContext(audit,ctx,{timeout:1000});
const first=await ctx.ct186LoadForYou();
assert.equal(first._ct186_fresh.movie.length,0,'server-unverified recommendation leaked');
assert.equal(first._ct186_watchlist.movie.length,0,'server-unverified watchlist leaked');
assert.equal(first._ct280AuditPartial,true,'server outage not reported');
assert.equal(document.documentElement.dataset.ct279Audit,'partial');
fail=false;
const recovered=await ctx.window.__ctR279Audit.auditData(first);
assert.equal(recovered._ct280AuditPartial,false,'server audit recovery did not clear warning');
assert.deepEqual([...recovered._ct186_fresh.movie.map(x=>x.id)],[2,3],'original fresh candidates were lost after RPC failure');
assert.deepEqual([...recovered._ct186_watchlist.movie.map(x=>x.id)],[4],'watchlist recovered wrong user items');
assert.deepEqual([...recovered._ct186_reserve.movie.map(x=>x.id)],[5],'unverified reserve cannot be lost');
assert.ok(calls>=2,'no verified second call');
assert.equal(document.documentElement.dataset.ct279Audit,'ready');
const patchContext={
 window:{},document:{head:{appendChild(){}},addEventListener(){},querySelector(){return null},createElement(){return{}}},
 renderProfile:async()=>{},ct168PaintProfile:()=>{},paintDiscover:()=>{},
 session:{user:{id:'accountA'}},user:{id:'accountA'},Map,WeakMap,Promise,
 route:()=> 'home',Date,Number,String,Array,Object,console,queueMicrotask:()=>{},
 setTimeout:()=>0,requestAnimationFrame:()=>0
};
vm.createContext(patchContext);vm.runInContext(patch,patchContext,{timeout:1000});
assert.ok(patchContext.window.__ctR280Test.profileValid({stats:{movies_watched:18}}),'valid cached profile rejected');
assert.equal(patchContext.window.__ctR280Test.profileValid({stats:{}}),false,'empty profile should not overwrite last good cache');
console.log('ANDROID_1_0_38_TEST_OK r279 audit failure remains fail-closed, raw verified on recovery, owner-specific profile snapshot, no background preload or whole-page reload');
