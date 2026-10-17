import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r271-android-js">',a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>0&&b>a,'1.0.29 runtime missing');
const app=html.slice(a+marker.length,b);
const patch=await readFile('apps/android/runtime-r271-v1029-history-sports-foryou.js','utf8');
new Function(app);new Function(patch);
for(const required of [
 'name="ct-official-version" content="1.0.29"',
 "const REVISION='r271-android-official-1.0.29'",
 'window.__ctAndroidOfficialCode=10071',
 "window.__ctR271AndroidV1029='sports-stays-put+chronological-all-movies+foryou-fast-snapshot'",
 'window.__ctR270AndroidV1028','window.__ctR269AndroidV1027',
 'cinetracker_profile_media_dashboard_v0991',
 'cinetracker_sports_watch_set_v296',
 'cinetracker_sport_mark_watched_v1',
 'cinetracker_recommendation_filter_v525'
])assert.ok((required.startsWith('name=')?html:app).includes(required),'missing '+required);
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(bad),'forbidden '+bad);
const listeners={click:[], 'cinetracker:data-changed':[]},storage=new Map();
const fakeButton={dataset:{sportWatch:'9',watched:'0'},disabled:false,style:{},attributes:{},isConnected:true,textContent:'✓ Marcar assistido',
 matches(s){return s==='[data-sport-watch]'},classList:{toggle(){}},setAttribute(k,v){fakeButton.attributes[k]=v}};
const sportRow={id:9,is_watched:false},cachedSports={events:[sportRow],watch_history:[]};
let RPC=0,paintCount=0,scroll=482,rowsReturned=0,personalLoads=0;
const allHistory=[
 {id:101,media_id:31,title:'Filme mais novo',watched_at:'2026-10-16T23:00:00Z'},
 {id:102,media_id:30,title:'Pokémon',watched_at:'2026-08-25T18:00:00Z'},
 {id:103,media_id:29,title:'Filme mais antigo',watched_at:'2026-05-12T13:00:00Z'}
];
const movieStack={innerHTML:''},history={offsetHeight:450};
const vp={scrollTop:scroll,get scrollHeight(){return 1200},querySelector(s){if(s==='.home-history .stack')return movieStack;if(s==='.home-history')return history;return null}};
const fakeDoc={head:{appendChild(){}},createElement:()=>({}),querySelector(s){if(s==='[data-home-viewport="movies"]')return vp;return null},
 querySelectorAll(){return [fakeButton]},addEventListener(k,fn){(listeners[k]||=[]).push(fn)}};
const fakeWindow={addEventListener(k,fn){(listeners[k]||=[]).push(fn)}};
const fakeData={
 window:fakeWindow,document:fakeDoc,session:{access_token:'token',user:{id:'uid'}} ,user:{id:'uid'},sportsCache:cachedSports,
 sportsDetail263:null,profileCache:{},Date,Promise,Set,Map,JSON,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
 route:()=>fakeData.currentRoute,currentRoute:'sports',homeActiveTab158:'movies',localDay:()=> '2026-10-17',
 paintHome:()=>{paintCount++},homeCache:{history_movies:[]},homeMovieRow158:x=>'<article>'+x.media_title+' '+x.poster_path+'</article>',
 rpc:async(name)=>{RPC++;if(name==='cinetracker_sport_mark_watched_v1')return {is_watched:true};return []},
 api:async(path)=>{
  if(path.startsWith('watch_history?')){rowsReturned++;return allHistory}
  if(path.startsWith('media?'))return [
   {id:31,tmdb_id:900,title:'Filme mais novo',poster_path:'/n.jpg',media_type:'movie'},
   {id:30,tmdb_id:100,title:'Pokémon',poster_path:'/pokemon.jpg',media_type:'movie'},
   {id:29,tmdb_id:50,title:'Filme mais antigo',poster_path:'/old.jpg',media_type:'movie'}];
  return[];
 },
 ct163Write:()=>{},toast:()=>{},setTimeout:(fn)=>{fn();return 0},
 ct186LoadForYou:async()=>{personalLoads++;return {_ct186_fresh:{movie:[{id:11,title:'Candidato',poster_path:'/x.jpg'}],series:[],anime:[]},_ct186_watchlist:{movie:[],series:[],anime:[]}}},
 ct186Select:d=>({daily:d._ct186_fresh.movie[0],fm:null,fs:null,fa:null,wm:null,ws:null,wa:null,wmPool:[],wsPool:[],waPool:[]}),
 ct186RefreshVisible:async()=>null,ct186ForYouData:null,console
};
vm.createContext(fakeData);vm.runInContext(patch,fakeData,{timeout:1000});
const hook=listeners.click[0];
let prevented=0,stopped=0;
hook({target:{closest:()=>fakeButton},preventDefault(){prevented++},stopImmediatePropagation(){stopped++}});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(RPC,1);assert.equal(sportRow.is_watched,true);
assert.equal(fakeButton.dataset.watched,'1');assert.equal(fakeButton.disabled,false);
assert.equal(prevented,1);assert.equal(stopped,1);
assert.equal(paintCount,0,'Sports watch must not repaint or reset scroll');
assert.equal(vp.scrollTop,482,'watch click must preserve scroll');
fakeData.currentRoute='home';
const h=await fakeData.window.__ctR271Test.fetchAllMovies271();
assert.equal(rowsReturned,1,'fetch paginated user history, not capped by Home RPC 80');
assert.equal(h.length,3);assert.equal(h[0].media_title,'Filme mais novo');
assert.equal(h[1].poster_path,'/pokemon.jpg');assert.equal(h[2].media_title,'Filme mais antigo');
fakeData.window.__ctR271Test.paintMovieHistory271(h);
assert.ok(movieStack.innerHTML.indexOf('Filme mais antigo')<movieStack.innerHTML.indexOf('Pokémon'));
assert.ok(movieStack.innerHTML.indexOf('Pokémon')<movieStack.innerHTML.indexOf('Filme mais novo'));
assert.equal(vp.scrollTop,482,'movie history DOM update must not reset viewport');
const first=await fakeData.ct186LoadForYou(false);const second=await fakeData.ct186LoadForYou(false);
assert.equal(personalLoads,1,'fresh same-day personal snapshot must be reused');
assert.ok(first._ct186_fresh.movie.length&&second.daily);
console.log('ANDROID_1_0_29_TEST_OK SPORTS one-click optimistic no repaint+no scroll, authenticated full movie history chronology/posters, fast owned Pra Voce cache');
