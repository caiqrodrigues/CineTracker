import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r267-android-js">',a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'r267 APK script must exist');
const app=html.slice(a+marker.length,b);
new Function(app);
for(const required of [
 'name="ct-official-version" content="1.0.25"',
 "const REVISION='r267-android-official-1.0.25'",
 'window.__ctAndroidOfficialCode=10067',
 "window.__ctR267AndroidV1025='f1-four-canonical-tabs+seven-slot-refill+sports-two-plus-wide-time'",
 'ct267-f1-hub','ct267-f1-calendar','data-ct265-race','ct267-canonical-layout',
 'window.__ctR266AndroidV1024','window.__ctR265AndroidV1023',
 'cinetracker_sports_stadium_summary_v296','cinetracker_sports_watch_set_v296',
 'ct186FreshEligible','ct186MergeRows',
 'ct169-drawer-backdrop'
])assert.ok((required.startsWith('name=')?html:app).includes(required),'missing '+required);
assert.ok(!app.includes("['pitstops','Pit stops']"),'legacy F1 seven-tab UI still active');
assert.ok(!app.includes("['pitstops','Pit stops']"),'legacy Android F1 tabs remain');
const f1=await readFile('apps/android/runtime-r267-v1025-f1-canonical.js','utf8');
const body=f1.slice(0,f1.indexOf('//__CT267_END_BODY__')).trim();
const shell=f1.slice(f1.indexOf('//__CT267_END_BODY__')+'//__CT267_END_BODY__'.length,f1.indexOf('//__CT267_END_SHELL__')).trim();
new Function(body);new Function(shell);
const esc=x=>String(x??'');
const f1mock={
 f111Stand:()=>[],f111Race:()=>({}),f111Date:x=>x||'—',rowsF111:()=>'',resultsF111:()=>'',e111:esc,
};
vm.createContext(f1mock);vm.runInContext(body,f1mock);
const schedule={races:[{raceName:'Grande Prêmio do Brasil',round:21,Circuit:{circuitName:'Interlagos',Location:{country:'Brasil'}},date:'2026-11-08'}],next:{raceName:'Brasil'}};
const calendar=f1mock.bodyF111(schedule,'calendar');
assert.match(calendar,/data-ct265-race="0"/);
assert.match(calendar,/Fim de semana, sessões, grid e resultado/);
assert.ok(!calendar.includes('Pit stops'));
const view=f1mock.bodyF111(schedule,'overview');assert.ok(view.includes('Próximo Grande Prêmio'));
assert.equal((shell.match(/\['(?:overview|calendar|drivers|constructors)','/g)||[]).length,4,'canonical Web four tabs required');
for(const oldTab of ["'last','Último GP'","'pitstops','Pit stops'","'laps','Voltas'"])assert.ok(!shell.includes(oldTab),'legacy tab survived '+oldTab);
const patch=await readFile('apps/android/runtime-r267-v1025-refill-and-layout.js','utf8');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(bad),'forbidden '+bad);
const movie=(id,title)=>({id,title,media_type:'movie',poster_path:'/x.jpg'});
const tv=(id,title,isAnime=false)=>({id,title,media_type:'tv',poster_path:'/x.jpg',isAnime});
const fresh={movie:[movie(1,'Filme A')],series:[],anime:[]};
const data={_ct186_fresh:fresh,_ct186_watchlist:{movie:[],series:[],anime:[]},_ct186_fallback:{movie:[],series:[],anime:[]}};
const fakeDoc={head:{appendChild(el){fakeDoc.style=el.textContent}},createElement:()=>({id:'',textContent:''}),addEventListener(){}};
const fake={
 window:{__ctR265Test:{allowed:x=>!x.blocked}},
 document:fakeDoc,Promise,WeakMap,WeakSet,Map,Set,Date,setTimeout,
 ct186LoadForYou:async()=>data,ct186RefreshVisible:async()=>data,
 ct186Context:async()=>({}),ct186FreshEligible:x=>!x.seen&&!x.watchlist,
 ct186Type:x=>x.media_type,ct186Anime:x=>Boolean(x.isAnime),
 ct186MergeRows:(a,b)=>[...new Map([...a,...b].map(x=>[x.id,x])).values()],
 ct186Select:d=>({daily:d._ct186_fresh.movie[0]||null,fm:d._ct186_fresh.movie[1]||null,fs:d._ct186_fresh.series[0]||null,fa:d._ct186_fresh.anime[0]||null,wm:null,ws:null,wa:null,wmPool:[],wsPool:[],waPool:[]}),
 pages:async (path,q)=>{
  if(path.includes('movie'))return [movie(2,'Filme B'),movie(3,'Filme C'),{...movie(999,'Visto'),seen:true}];
  return [tv(4,'Série B'),tv(5,'Série C'),tv(6,'Anime C',true),tv(7,'Anime D',true),{...tv(888,'Na Watchlist'),watchlist:true}];
 },
 route:()=> 'discover',discoverState:{tab:'foryou'},paintDiscover:()=>{fake.paints=(fake.paints||0)+1},ct186ForYouData:null,
 localDay:()=> '2026-10-16',discoverCache:new Map(),
 console,
};
vm.createContext(fake);vm.runInContext(patch,fake);
await fake.ct186LoadForYou(false);
await fake.window.__ctR267Test.fillMissing(data);
assert.ok(data._ct186_fresh.movie.length>=3,'two eligible new movies required for daily+fresh');
assert.ok(data._ct186_fresh.series.length>=2,'new TV series refill required');
assert.ok(data._ct186_fresh.anime.length>=2,'new anime refill required');
assert.equal(data._ct186_fresh.movie.some(x=>x.seen),false,'seen title escaped');
assert.equal(data._ct186_fresh.series.some(x=>x.watchlist),false,'watchlist title escaped');
assert.equal(data._ct186_watchlist.movie.length,0,'new title inserted into Watchlist slot');
assert.ok(fake.paints>0,'new eligible candidates did not update seven visible slots');
assert.ok(fakeDoc.style.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
assert.ok(fakeDoc.style.includes('grid-column:1/-1'));
assert.ok(fakeDoc.style.includes('data-ct266-stadium-stat'));
console.log('ANDROID_1_0_25_TEST_OK F1_4_TABS GP_DETAIL 7_SLOTS_MOVIE_TV_ANIME NO_WATCHLIST_LEAK SPORTS_2_PLUS_WIDE');
