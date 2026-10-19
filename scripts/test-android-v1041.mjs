import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r283-android-js">',a=html.indexOf(tag),b=html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'r283 embedded bundle missing');
const js=html.slice(a+tag.length,b),patch=await readFile('apps/android/runtime-r283-v1041-history-discover.js','utf8');
new Function(js);new Function(patch);
for(const marker of [
 "const REVISION='r283-android-official-1.0.41'","window.__ctAndroidOfficialCode=10083",
 '__ctR283AndroidV1041','__ct283ServerAudited','__ctR282AndroidV1040','__ctR279Audit',
 'cinetracker_profile_media_dashboard_v0991','media_overrides?select=id,media_id,watched_at,state',
 'watch_play_events_v0994','cinetracker_home_movie_history_v323','cinetracker_sports_stadium_summary_v296'
])assert.ok(js.includes(marker),'missing '+marker);
assert.ok(html.includes('name="ct-official-version" content="1.0.41"'));
assert.ok(js.includes('s.data.__ct283ServerAudited=true'),'authenticated-only data must be marked after v525');
assert.ok(js.includes('window.__ctR279Audit?.permitted?.(x,watchKind(key))'),'r277 must use v525 instead of stale context');
assert.ok(js.includes('s.done=true;if(visible(s))display(s)'),'render final retry when audit exhausted');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.equal(patch.includes(bad),false,'forbidden '+bad);
const m=(id,title,attrs={})=>({id,title,media_type:'movie',poster_path:'/p.jpg',...attrs});
const eligible=m(11,'Filme novo',{authorized:true}),fresh=m(12,'Outro filme',{authorized:true});
const watched=m(13,'Já visto',{authorized:false,seen:true}),watch=m(14,'Da Watchlist',{authorized:true,watch:true});
const legacy=[{id:1,media_id:1,tmdb_id:101,media_title:'Pokémon O Filme',watched_at:'2026-10-10T10:00:00Z'}];
let fetcher=async()=>legacy,painter=()=>true;
const bridge={getFetcher:()=>fetcher,setFetcher:f=>{fetcher=f},getPainter:()=>painter,setPainter:f=>{painter=f}};
const audit={permitted:(x,w)=>x.authorized===true&&!x.seen&&(w?x.watch===true:!x.watch)};
const ctx={
 window:{__ctR271Bridge:bridge,__ctR279Audit:audit,__ctR265Test:{allowed:x=>Boolean(x?.poster_path)},__ctR282Test:{forYou:()=>({done:true})},addEventListener(){}},
 document:{addEventListener(){}},
 user:{id:'test-user'},session:{user:{id:'test-user'},access_token:'ok'},
 ct186Type:x=>x.media_type,ct186Id:x=>x.id,ct186Anime:()=>false,ct186Key:x=>'movie:'+x.id,
 ct186Quality:x=>Boolean(x.poster_path),ct186LocalBlocked:new Set(),
 ct186DailyPick:pool=>pool[0],ct186UniqueRows:items=>items,ct186Select:()=>({daily:watched}),
 ct186Slot:(label,item)=>item?'<div>OK</div>':'<div>Nenhuma indicação elegível nesta categoria.</div>',
 route:()=> 'home',homeActiveTab158:'movies',homeCache:{history_movies:legacy},paintHome:()=>true,
 api:async q=>{
  if(q.startsWith('media_overrides?'))return[{id:21,media_id:2,watched_at:'2026-10-19T13:00:00Z'}];
  if(q.startsWith('media?'))return[{id:2,tmdb_id:102,media_type:'movie',title:'Filme depois de Pokémon',poster_path:'/p2.jpg'}];
  throw Error('unexpected authenticated query '+q);
 },
 rpc:async name=>{
  assert.equal(name,'cinetracker_profile_media_dashboard_v0991');
  return[{media_id:3,tmdb_id:103,media_type:'movie',is_seen:true,last_watched_at:'2026-10-19T12:00:00Z',title:'Outro depois de Pokémon',poster_path:'/p3.jpg'},
         {media_id:4,tmdb_id:104,media_type:'movie',is_seen:false,last_watched_at:'2026-10-19T11:00:00Z',title:'Não assistido',poster_path:'/p4.jpg'}];
 },queueMicrotask,Promise,Set,Map,Date,Number,String,Boolean,Array,console
};
vm.createContext(ctx);vm.runInContext(patch,ctx,{timeout:1500});
const chosen=ctx.ct186Select({__ct283ServerAudited:true,_ct186_fresh:{movie:[eligible,fresh,watched,watch],series:[],anime:[]},_ct186_watchlist:{movie:[watch],series:[],anime:[]}});
assert.equal(chosen.daily.id,11);assert.equal(chosen.fm.id,12);assert.equal(chosen.wm.id,14);
assert.ok(![chosen.daily,chosen.fm].some(x=>x.seen||x.watch),'seen/Watchlist candidate escaped');
assert.equal(ctx.ct186Select({__ct283ServerAudited:false}).daily,watched,'only audited owner uses verified selection');
const overrides=await ctx.window.__ctR283History.fetchExtra();
assert.equal(overrides.length,2,'two real post-Pokémon sources missing');
const full=await fetcher();
assert.equal(full.length,3,'old Pokémon + two later movie records must coexist');
assert.equal(full[0].media_title,'Filme depois de Pokémon');
assert.equal(full[1].media_title,'Outro depois de Pokémon');
assert.equal(full[2].media_title,'Pokémon O Filme');
assert.ok(!full.some(x=>x.media_title==='Não assistido'),'unwatched item leaked');
assert.ok(ctx.ct186Slot('Filme',null,'fresh:movie').includes('Buscar novamente'),'user needs retry after verification fails');
console.log('ANDROID_1_0_41_TEST_OK r283 server-only seven slots + dated override/dashboard history after Pokémon + no reload');
