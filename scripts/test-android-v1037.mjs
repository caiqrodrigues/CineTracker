import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r279-android-js">';
const a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'missing Android r279 runtime');
const js=html.slice(a+marker.length,b);
const patch=await readFile('apps/android/runtime-r279-v1037-server-audit.js','utf8');
new Function(js);new Function(patch);
for(const key of ["const REVISION='r279-android-official-1.0.37';",
 'window.__ctAndroidOfficialCode=10079','cinetracker_recommendation_filter_v525',
 'window.__ctR278AndroidV1036','cinetracker_sports_stadium_summary_v296',
 'cinetracker_sport_mark_watched_v1','cinetracker_f1_watch_sync_v462',
 "window.addEventListener('pointermove'","window.addEventListener('pointerup'",
 "window.addEventListener('pointercancel'"])
 assert.ok(js.includes(key),'missing r279 or preserved authority '+key);
assert.ok(html.includes('name="ct-official-version" content="1.0.37"'));
assert.ok(!js.includes("window.addEventListener('pointerdown',e=>{const c=e.target?.closest?.('[data-ct263-special]');if(!c)return;e.preventDefault()"),'legacy pointerdown still opens special cards');
assert.ok(js.includes('window.__ctR279Audit?.permitted(x,false)'), 'Trocar expansion lacks authenticated filter');
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(banned),'forbidden '+banned);
const item=(type,id,title)=>({id,media_type:type,title,release_date:'2025-10-01',vote_average:8.5,poster_path:'/poster.jpg'});
const data={
 _ct186_fresh:{
  movie:[item('movie',101,'Já visto'),item('movie',102,'Na Watchlist'),item('movie',103,'Filme realmente novo')],
  series:[item('tv',201,'Série já iniciada'),item('tv',202,'Série realmente nova')],
  anime:[item('tv',301,'Anime já visto'),item('tv',302,'Anime novo')]
 },
 _ct186_watchlist:{
  movie:[item('movie',102,'Filme na Watchlist'),item('movie',101,'Filme visto')],
  series:[item('tv',203,'Série na Watchlist'),item('tv',201,'Série iniciada')],
  anime:[item('tv',303,'Anime na Watchlist'),item('tv',301,'Anime visto')]
 },
 _ct186_reserve:{movie:[item('movie',101,'Visto do reserve'),item('movie',104,'Novo reserve')],series:[],anime:[]}
};
const fakeDocument={documentElement:{dataset:{}},head:{appendChild(x){fakeDocument.style=x.textContent}},createElement:()=>({textContent:'',id:''})};
let rpcCalls=0;
const ctx={window:{addEventListener(){}},document:fakeDocument,session:{user:{id:'owner'}},user:{id:'owner'},
 localDay:()=> '2026-10-19',ct186Id:x=>x?.id,ct186Type:x=>x?.media_type,ct186Year:()=>2025,
 ct186LoadForYou:async()=>data,paintDiscover:()=>{},route:()=> 'discover',discoverState:{tab:'foryou'},
 ct186ForYouData:data,Map,Set,WeakMap,Promise,Number,String,Object,Array,Date,
 setTimeout,clearTimeout,
 rpc:async(name,args)=>{
  assert.equal(name,'cinetracker_recommendation_filter_v525');
  rpcCalls++;
  const rows=args.p_items;
  const keys=rows.map(x=>x.media_type+':'+x.tmdb_id);
  return{checked_count:rows.length,blocked_keys:keys.filter(x=>['movie:101','movie:102','tv:201','tv:301','tv:203','tv:303'].includes(x)),
   watch_keys:keys.filter(x=>['movie:102','tv:203','tv:303'].includes(x)),
   seen_keys:keys.filter(x=>['movie:101','tv:201','tv:301'].includes(x)),
   not_interested_keys:[]};
 }
};
vm.createContext(ctx);vm.runInContext(patch,ctx,{timeout:1000});
const result=await ctx.ct186LoadForYou();
assert.equal(result._ct186_fresh.movie.length,1,'watched/watchlist movie leaked into fresh');
assert.equal(result._ct186_fresh.movie[0].id,103);
assert.equal(result._ct186_fresh.series.length,1);assert.equal(result._ct186_fresh.series[0].id,202);
assert.equal(result._ct186_fresh.anime.length,1);assert.equal(result._ct186_fresh.anime[0].id,302);
assert.equal(result._ct186_watchlist.movie.length,1);assert.equal(result._ct186_watchlist.movie[0].id,102);
assert.equal(result._ct186_watchlist.series.length,1);assert.equal(result._ct186_watchlist.series[0].id,203);
assert.equal(result._ct186_watchlist.anime.length,1);assert.equal(result._ct186_watchlist.anime[0].id,303);
assert.ok(!result._ct186_reserve.movie.some(x=>x.id===101),'reserves must not leak a watched movie');
assert.ok(ctx.window.__ctR279Audit.permitted(item('movie',104,'new'),false),'audited clean reserve unexpectedly rejected');
assert.ok(rpcCalls>0);
const before=rpcCalls;await ctx.ct186LoadForYou();assert.equal(rpcCalls,before,'already checked candidates must not repeat RPC');
const newCandidate=item('movie',3017,'Expansão TMDB');
assert.ok(!ctx.window.__ctR279Audit.permitted(newCandidate,false),'not-yet-audited swap must never be displayed');
await ctx.window.__ctR279Audit.auditCandidates([newCandidate]);
assert.ok(ctx.window.__ctR279Audit.permitted(newCandidate,false),'audited clean swap should be allowed');
assert.ok(fakeDocument.style.includes('visibility:hidden'),'unverified first-paint candidates must remain hidden');

const start=js.indexOf('/* Only open a special-series card after a confirmed tap.');
const end=js.indexOf("document.addEventListener('click',e=>{const close=e.target?.closest?.('[data-ct263-special-close]')",start);
assert.ok(start>0&&end>start);
const listeners={},opened=[];
const scroll={scrollTop:200};
const card={dataset:{ct263Special:'ufc'},closest:()=>scroll};
const ui={window:{addEventListener(type,fn){(listeners[type]??=[]).push(fn)}},document:{scrollingElement:scroll},
 route263:()=> 'home',openSpecial263:type=>opened.push(type),Math,Number,Date,String};
vm.createContext(ui);vm.runInContext(js.slice(start,end),ui,{timeout:1000});
const event=(type,x=30,y=100,detail=1)=>({pointerId:13,isPrimary:true,clientX:x,clientY:y,detail,
 target:{closest:selector=>selector==='[data-ct263-special]'?card:null},
 preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}});
const fire=(name,e)=>{for(const fn of listeners[name]||[])fn(e);return e};
const dragged=event('down');fire('pointerdown',dragged);
assert.equal(Boolean(dragged.prevented),false,'scroll must never be stopped on pointerdown');
fire('pointermove',event('move',30,140));fire('pointerup',event('up',30,140));fire('click',event('click'));
assert.equal(opened.length,0,'vertical scrolling unexpectedly opened UFC');
fire('pointerdown',event('down'));scroll.scrollTop=260;
fire('pointerup',event('up'));fire('click',event('click'));assert.equal(opened.length,0,'container moved but card opened');
scroll.scrollTop=260;fire('pointerdown',event('down'));fire('pointerup',event('up'));fire('click',event('click'));
assert.deepEqual(opened,['ufc'],'real stationary tap must open exactly one UFC card');
card.dataset.ct263Special='wwe';fire('pointerdown',event('down'));fire('pointerup',event('up'));fire('click',event('click'));
assert.deepEqual(opened,['ufc','wwe']);
card.dataset.ct263Special='f1';fire('pointerdown',event('down'));fire('pointercancel',event('cancel'));fire('click',event('click'));
assert.equal(opened.length,2,'cancelled touch must not open F1');
fire('keydown',{target:{closest:()=>card},key:'Enter',preventDefault(){},stopImmediatePropagation(){}});
assert.deepEqual(opened,['ufc','wwe','f1'],'keyboard must remain accessible');
console.log('ANDROID_1_0_37_TEST_OK v525 server source watched/watchlist/progress aliases, seven slots, audited reserves/swaps, no premature touches, scroll/keyboard');
