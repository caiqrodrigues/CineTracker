import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r275-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'v1.0.33 startup source must be embedded');
const app=html.slice(a+tag.length,b),patch=await readFile('apps/android/runtime-r275-v1033-foryou-fixed.js','utf8');
new Function(app);new Function(patch);
assert.ok(html.includes('name="ct-official-version" content="1.0.33"'));
for(const marker of [
 "const REVISION='r275-android-official-1.0.33'",
 'window.__ctAndroidOfficialCode=10075',
 'window.__ctR275AndroidV1033',
 'window.__ctR273AndroidV1031=VERSION',
 'window.__ctR271Bridge={',
 'cinetracker_sports_stadium_summary_v296',
 'cinetracker_home_movie_history_v323',
 'cinetracker_sport_mark_watched_v1',
 'cinetracker_f1_watch_sync_v462',
 'cinetracker_recommendation_filter_v525',
 'data-ct275-seen',
 'ct275-foryou-only'
])assert.ok(app.includes(marker),'preserved baseline/new scope missing '+marker);
assert.equal((app.match(/audit263\(fresh\.(?:movie|series|anime),'fresh',12\)/g)||[]).length,3,'full detail audit must remain for 3 fresh slots');
assert.equal((app.match(/audit263\(watch\.(?:movie|series|anime),'watchlist',8\)/g)||[]).length,3,'full detail audit must remain for 3 personal Watchlist slots');
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.equal(patch.includes(banned),false,'forbidden '+banned);
assert.ok(patch.includes('[data-discover-content] [data-ct241-section]'),'CSS must be scoped to only Pra Você');
assert.ok(!patch.includes('#ct-f1-v111')&&!patch.includes('[data-home-viewport]')&&!patch.includes('[data-sports]'),'scope leaks outside Pra Você');
let bootCalls=0,requests=0,rendered=0,original=0;
const store=new Map();
const mk=(kind,id,other={})=>({id,title:'Elegível '+id,media_type:kind==='movie'?'movie':'tv',poster_path:'/img.jpg',vote_average:8.5,release_date:'2026-05-01',anime:kind==='anime',...other});
const movie=[mk('movie',101),mk('movie',102),mk('movie',103,{is_seen:true})],series=[mk('series',201),mk('series',202)],anime=[mk('anime',301),mk('anime',302)];
const fixture={_ct186_fresh:{movie:[movie[0],movie[1]],series:[series[0]],anime:[anime[0]]},
 _ct186_watchlist:{movie:[mk('movie',10,{is_watchlist:true})],series:[mk('series',20,{is_watchlist:true})],anime:[mk('anime',30,{is_watchlist:true})]}};
const clone=x=>JSON.parse(JSON.stringify(x));
const context={dash:[],watchedIds:new Set([103]),watchlistIds:new Set([10,20,30])};
const listeners={},windowListeners={};let css='';
const doc={head:{appendChild(el){css=el.textContent}},createElement:()=>({textContent:'',id:'',dataset:{},setAttribute(){}}),
 querySelector:()=>null,addEventListener:(name,cb)=>{listeners[name]=cb}};
const dataKey=x=>x.media_type+':'+x.id;
const env={window:{__ctR265Test:{allowed:x=>!!x?.poster_path&&!/aew|wrestling|stand.?up|ufc/i.test(x.title||'')&&!(x.runtime>0&&x.runtime<40)&&!String(x.homepage||'').includes('youtube.com')},addEventListener(name,cb){(windowListeners[name]??=[]).push(cb)}},
 document:doc,session:{user:{id:'user1'}},user:{id:'user1'},console,
 localDay:()=> '2026-10-18',localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},
 Date,Array,Map,Set,WeakMap,Promise,Number,String,Object,
 route:()=> 'discover',discoverState:{tab:'foryou'},discoverCache:new Map(),
 ct186FreshPools:async()=>null,
 ct186Context:async()=>context,
 ct186Type:x=>x.media_type,ct186Anime:x=>!!x.anime,
 ct186FreshEligible:(x,c)=>!x.is_seen&&!x.is_watchlist&&!c.watchedIds.has(x.id)&&!c.watchlistIds.has(x.id),
 ct186WatchEligible:(x,c)=>c.watchlistIds.has(x.id)&&!c.watchedIds.has(x.id),
 ct186UniqueRows:rows=>[...new Map(rows.map(x=>[dataKey(x),x])).values()],
 ct186MergeRows:(a,b)=>[...new Map([...a,...b].map(x=>[dataKey(x),x])).values()],
 ct186FavoriteGenres:()=>[12,16],
 ct186Select:d=>({daily:d._ct186_fresh.movie[0],fm:d._ct186_fresh.movie[1],fs:d._ct186_fresh.series[0],
  fa:d._ct186_fresh.anime[0],wm:d._ct186_watchlist.movie[0],ws:d._ct186_watchlist.series[0],wa:d._ct186_watchlist.anime[0],
  wmPool:d._ct186_watchlist.movie,wsPool:d._ct186_watchlist.series,waPool:d._ct186_watchlist.anime}),
 ct186ForYouData:null,
 ct186LoadForYou:async()=>{original++;return clone(fixture)},
 ct186RefreshVisible:async()=>clone(fixture),
 paintDiscover:()=>{rendered++},swapNow237:()=>true,
 safeTmdb:async(path,opt)=>{requests++;if(path.includes('/movie'))return{results:movie};
  return{results:opt.with_origin_country==='JP'?anime:series}},
 requestAnimationFrame:cb=>cb(),
 markSeen:async()=>true,
 boot:()=>{bootCalls++},
};
vm.createContext(env);
vm.runInContext(patch+'\nboot();',env);
assert.equal(bootCalls,1,'v1.0.31 login boot must still run');
assert.equal(env.window.__ctR275StartupError,undefined,'patch must not crash login');
const pools=await env.ct186FreshPools(context);
assert.equal(pools.movie.length,2,'seen movie must be removed from pool');
assert.equal(pools.series.length,2,'eligible TV series must load');
assert.equal(pools.anime.length,2,'eligible anime must load');
assert.equal(requests,6,'3 categories x 2 parallel TMDB pages, no affinity waterfall');
const data=await env.ct186LoadForYou(false);assert.equal(original,1);assert.ok(data._ct186_watchlist.movie.length);
const cached=await env.ct186LoadForYou(false);assert.equal(original,1,'second Pra Você visit must reuse audited, current-context cache');
assert.equal(cached._ct186_fresh.movie.length,2);
assert.ok(!cached._ct186_fresh.movie.some(x=>x.id===103),'watched movie must not leak');
assert.ok(cached._ct186_watchlist.movie.every(x=>context.watchlistIds.has(x.id)),'only real Watchlist candidates');
context.watchlistIds.add(102);
const filtered=await env.ct186LoadForYou(false);
assert.equal(filtered._ct186_fresh.movie.some(x=>x.id===102),false,'newly watchlisted candidate must be removed on next cache audit');
assert.ok(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'));
assert.ok(css.includes('aspect-ratio:2/3!important'));
assert.ok(css.includes('height:38px!important'));
assert.ok(css.includes('overflow:hidden!important'));
assert.ok(css.includes('white-space:nowrap!important'));
assert.ok(css.includes('ct274-mark-seen'));

assert.ok(css.includes('flex:0 0 42px!important'),'action footer must have reserved height');
assert.ok(css.includes('ct275-mark-seen'),'Visto button must have visible styling');
const watchlistButton={disabled:true,removed:false,remove(){this.removed=true},setAttribute(){},title:''};
const swappedButton={disabled:false,setAttribute(){},title:''};
const mainButton={dataset:{media:'movie:10'}};
const actions={children:[],querySelector(selector){
 if(selector==='.discover-watch')return watchlistButton.removed?null:watchlistButton;
 if(selector==='[data-ct237-swap]')return swappedButton;
 if(selector==='[data-ct275-seen]')return this.children.find(x=>x.dataset?.ct275Seen)||null;
 return null;
},insertBefore(el){this.children.push(el)}};
const card={querySelector(selector){if(selector==='.ct169-card-actions')return actions;if(selector==='[data-media]')return mainButton;return null}};
const slot={dataset:{ct241SlotKey:'watchlist:movie'},querySelector(selector){return selector==='.discover-card'?card:null},setAttribute(){}};
const root={querySelectorAll(selector){return selector==='[data-ct241-slot-key]'?[slot]:[]}};
doc.querySelector=selector=>selector==='[data-discover-content]'?root:null;
env.window.__ctR237Pool=()=>[fixture._ct186_watchlist.movie[0],mk('movie',11,{is_watchlist:true})];
env.window.__ctR275Test.dress();
assert.equal(watchlistButton.removed,true,'disabled Na Watchlist must be REMOVED rather than relabeled');
const realSeen=actions.children.find(x=>x.dataset?.ct275Seen==='movie:10');
assert.ok(realSeen,'Watchlist slot must contain functional Visto control');
assert.equal(realSeen.disabled,undefined,'new Visto control must not be disabled');
assert.equal(slot.dataset.ct275Layout,'ready');
assert.ok(windowListeners.pointerdown?.length,'swap re-decoration needs pointerdown because old r237 stops click propagation');
assert.equal(env.window.__ctR275Test.validRef('movie:10'),true);
assert.equal(env.window.__ctR275Test.validRef('movie:0'),false);
assert.equal(env.window.__ctR275Test.validRef('movie:abc'),false);

const failed={window:{__ctR265Test:{}},document:doc,console,boot:()=>{failed.boots=(failed.boots||0)+1}};
vm.createContext(failed);vm.runInContext(patch+'\nboot();',failed);
assert.equal(failed.boots,1,'fail-open startup must never block login');
assert.ok(failed.window.__ctR275StartupError,'missing optional foryou runtime must not crash native app');
console.log('ANDROID_1_0_33_TEST_OK startup-safe, 7 audited slots, excludes seen/watchlist, fast 6 TMDB requests, same-day cache, no outside CSS');
