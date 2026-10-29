import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const src=await readFile('apps/android/runtime-r327-home-search-fluidity.js','utf8');
new Function(src);
for(const banned of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.ok(!src.includes(banned),'Android search may not reload or spin: '+banned);
const listeners=new Map(),styleVars=new Map();
let inputValue='';
const input={get value(){return inputValue},set value(v){inputValue=v},
 getBoundingClientRect:()=>({bottom:92}),blur(){this.blurred=true}};
const out={innerHTML:'',replaceChildren(){this.innerHTML=''}};
const doc={
 querySelector:selector=>{
  if(selector==='[data-page="home"]')return{};
  if(selector==='[data-page="home"] [data-global-search]')return input;
  if(selector==='[data-page="home"] [data-global-results]')return out;
  return null;
 },
 documentElement:{style:{setProperty:(key,value)=>styleVars.set(key,value)}},
 head:{appendChild(element){this.last=element}},
 createElement:()=>({id:'',textContent:''}),
 addEventListener:(name,callback)=>listeners.set(name,callback)
};
const urls=[],resolvers=[];
let legacySearch=0,activeRoute='home';
const ctx={
 window:{addEventListener:()=>{}},document:doc,
 route:()=> activeRoute,globalSearch:async()=>{legacySearch++},
 homeCache:{series:[{tmdb_id:100,media_type:'tv',title:'Dragon Ball Z',poster_path:'/dragon.jpg'}],
  movie_watchlist:[{tmdb_id:200,title:'A Vida é Bela',poster_path:'/life.jpg'}]},
 profileCache:{dashboard:[]},
 img:(p)=>'https://image.tmdb.org/t/p/w154'+p,
 tmdb:(path,params)=>{urls.push({path,params});return new Promise(resolve=>resolvers.push({path,resolve}))},
 setTimeout,clearTimeout,Date
};
new Function('ctx','with(ctx){'+src+'}')(ctx);
const api=ctx.window.__ctR327HomeSearch;
assert.equal(api.version,327);
assert.equal(doc.head.last.id,'ct-android-r327-home-fluidity');
inputValue='Dragon';api.onInput(inputValue);
assert.match(out.innerHTML,/Dragon Ball Z/,'Local user library must paint instantly');
assert.match(out.innerHTML,/data-media="tv:100"/);
await new Promise(resolve=>setTimeout(resolve,225));
assert.equal(urls.length,3,'Three independent TMDB queries, no five-call bilingual stampede');
resolvers.find(x=>x.path==='/search/movie').resolve({results:[{id:501,title:'Dragon: o Filme'}]});
await new Promise(resolve=>setTimeout(resolve,5));
assert.match(out.innerHTML,/Dragon: o Filme/,'First API response paints before TV/person calls finish');
assert.match(out.innerHTML,/Dragon Ball Z/,'Server results do not overwrite local results');
inputValue='Lupin';api.onInput(inputValue);
resolvers.find(x=>x.path==='/search/tv').resolve({results:[{id:777,name:'Dragon Antigo'}]});
await new Promise(resolve=>setTimeout(resolve,5));
assert.doesNotMatch(out.innerHTML,/Dragon Antigo/,'Late results from prior terms are ignored');
await new Promise(resolve=>setTimeout(resolve,220));
assert.equal(urls.length,6);
resolvers.filter(x=>x.path==='/search/movie').at(-1).resolve({results:[]});
resolvers.filter(x=>x.path==='/search/tv').at(-1).resolve({results:[{id:321,name:'Lupin'}]});
resolvers.filter(x=>x.path==='/search/person').at(-1).resolve({results:[]});
await new Promise(resolve=>setTimeout(resolve,10));
assert.match(out.innerHTML,/data-media="tv:321"/,'TV result is navigable');
assert.equal(api.stats().cache,1,'Only the settled query is cached');
inputValue='';api.onInput('');
assert.equal(out.innerHTML,'','Search results close without a page reload');
assert.equal(styleVars.get('--ct327-search-top'),'98px');
activeRoute='discover';
await ctx.globalSearch('Matrix');
assert.equal(legacySearch,1,'Search on other screens must retain the existing behavior');
const assembled=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
assert.ok(assembled.includes('data-ct-android="r327-android-stable-js"'));
assert.ok(assembled.includes('window.__ctR327HomeSearch='));
assert.ok(assembled.includes('window.__ctR326MediaExport='));
assert.ok(assembled.includes('window.__ctR325Profile='));
assert.ok(assembled.includes('window.__ctR325Series='));
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1\.0'/);
assert.match(gradle,/versionCode 10128/);
console.log('CINETRACKER_ANDROID_1_0_R327_TEST_OK: instant local Home search, progressive remote results, stale-query protection, reduced request fan-out, ZIP/Profile/Home preserved, Web frozen.');
