import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r486.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v486.js'),'utf8'),
 readFile(resolve(dist,'app-v486.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r487-final-cards.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r487 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r487 invalid '+label+' bounds');
 return{start,end:close+6};
}
function patchRuntime(source,anchor,patches,label){
 const b=bounds(source,anchor,label);let region=source.slice(b.start,b.end);
 for(const patch of patches){
  const needle=patch[0],replacement=patch[1],name=patch[2],count=region.split(needle).length-1;
  if(count!==1)throw new Error('r487 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,b.start)+region+source.slice(b.end);
}
function patchGlobal(source,needle,replacement,label){
 const count=source.split(needle).length-1;
 if(count!==1)throw new Error('r487 expected one '+label+', found '+count);
 return source.replace(needle,replacement);
}

js=patchGlobal(
 js,
 "image:(path,size='w342')=>img(path,size),",
 "image:(path,size='w342')=>img(path,size),\n tmdb:(path,params={},opts={})=>tmdb(path,params,opts),",
 'core TMDB bridge'
);

js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 ["window.__ctCoreR471?.homeMovieRow?.(y)","window.__ctCoreR471?.homeMovieCard?.(y)",'movie card renderer'],
 ["stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';const frag=document.createDocumentFragment()",
  "stack.replaceChildren();stack.classList.remove('ct485-movie-rows');stack.classList.add('ct487-movie-grid');stack.style.display='grid';stack.style.flexDirection='';const frag=document.createDocumentFragment()",
  'movie card grid']
],'r388');

js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
 ["window.__ctCoreR471?.homeMovieRow?.(y)","window.__ctCoreR471?.homeMovieCard?.(y)",'movie card renderer'],
 ["stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",
  "stack.replaceChildren();stack.classList.remove('ct485-movie-rows');stack.classList.add('ct487-movie-grid');stack.style.display='grid';stack.style.flexDirection='';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",
  'paged movie grid']
],'r399');

const oldFetch=[
 "async function fetchPool(group,kind){",
 " const name=group==='watch'?'cinetracker_discover_watch_smart_v485':'cinetracker_discover_fresh_v485';",
 " const limit=group==='watch'?30:48;",
 " try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),3500)))}catch{return[]}",
 "}"
].join('\n');
const newFetch=[
 "async function fetchPool(group,kind){",
 " if(typeof window.__ctR487FetchPool==='function')return window.__ctR487FetchPool(group,kind,rpcCall,unwrap,timeout,rows);",
 " const name=group==='watch'?'cinetracker_discover_watch_smart_v485':'cinetracker_discover_fresh_v485';",
 " const limit=group==='watch'?30:48;",
 " try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),3500)))}catch{return[]}",
 "}"
].join('\n');
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 [oldFetch,newFetch,'r487 pool bridge']
],'r464');

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver']){
 if(runtime.includes(bad))throw new Error('r487 forbidden '+bad);
}
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v486.js','app-v487.js').replaceAll('app-v486.css','app-v487.css').replaceAll('v0.3.13','v0.3.14').replaceAll('r486-official-0.3.13','r487-official-0.3.14');
css+='\n/* CineTracker Web 0.3.14 r487 — pulse Home, Movies 2:3 cards, TMDB For You fallback, Top10 2:3, Profile exact 12. */\n';
sw=sw.replaceAll('app-v486.js','app-v487.js').replaceAll('app-v486.css','app-v487.css').replaceAll('ct-web-0.3.13-r486','ct-web-0.3.14-r487');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.14',
 revision:'r487-official-0.3.14',
 base:'r486+r487-requested-final',
 scope:'home-pulse+movies-2x3-cards+discover-v485-v421-tmdb+top10-2x3+profile-exact-12',
 home_series:'instant animate-pulse skeleton is visible before r388/v452/v391 finishes; loading remains bounded and no page reload is used',
 home_movies:'v405 remains the authority; Watchlist renders as compact uniform poster cards with strict 2:3 geometry and truncated titles',
 discover_foryou:'v485 direct pools are primary, v421 is bounded fallback and TMDB is final fresh fallback filtered by user state and content rules',
 discover_top10:'poster/card geometry remains strict 2:3 with object-cover images',
 profile_lists:'exactly 12 visible cards in the five requested summaries; large More cards are removed and only the minimal header control remains',
 sports:'preserved',
 f1:'preserved',
 history:'daily-v426-preserved',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v487.js'),js),
 writeFile(resolve(dist,'app-v487.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v486.js'),{force:true}),rm(resolve(dist,'app-v486.css'),{force:true})]);

const region=anchor=>{const b=bounds(js,anchor,anchor);return js.slice(b.start,b.end)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
if(!js.includes("tmdb:(path,params={},opts={})=>tmdb(path,params,opts)"))throw new Error('r487 TMDB bridge missing');
if(!r388.includes('homeMovieCard?.(y)')||!r388.includes("classList.add('ct487-movie-grid')"))throw new Error('r487 r388 Movies cards missing');
if(!r399.includes('homeMovieCard?.(y)')||!r399.includes("classList.add('ct487-movie-grid')"))throw new Error('r487 r399 Movies cards missing');
if(!r464.includes('__ctR487FetchPool'))throw new Error('r487 For You bridge missing');
for(const need of ['cinetracker_discover_fresh_v485','cinetracker_discover_watch_smart_v485','cinetracker_discover_fresh_v421','cinetracker_discover_filter_v320','tmdbFresh487']){
 if(!js.includes(need))throw new Error('r487 For You missing '+need);
}
if(!runtime.includes('animate-pulse')||!runtime.includes('aspect-ratio:2/3!important')||!runtime.includes('object-fit:cover!important'))throw new Error('r487 visual rules missing');
if(!runtime.includes('nth-child(n+13)')||!runtime.includes('enforceProfile12'))throw new Error('r487 Profile exact 12 missing');
console.log('WEB_R487_READY requested fixes');
