import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r475.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v475.js'),'utf8'),
 readFile(resolve(dist,'app-v475.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r476-final.js'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r476 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r476 invalid '+label+' bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r476 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}
function patchGlobal(source,needle,replacement,label){
 const count=source.split(needle).length-1;
 if(count!==1)throw new Error('r476 expected one '+label+', found '+count);
 return source.replace(needle,replacement);
}

js=patchGlobal(js,'mediaCard:item=>mediaCard(item),',
 `mediaCard:item=>mediaCard(item),
 homeMovieCard:item=>mediaCard({...item,media_type:'movie'}),`,
 'core movie card bridge');

js=patchGlobal(
 js,
 "ensureHomeShell:()=>{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home></div>'));return true},",
 "ensureHomeShell:()=>{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home><div class=\"home-tabs ct476-home-skeleton-tabs\"><button type=\"button\" class=\"chip active\" data-home-tab=\"series\">Séries</button><button type=\"button\" class=\"chip\" data-home-tab=\"movies\">Filmes</button></div><div class=\"ct476-home-skeleton\" aria-hidden=\"true\"><div></div><div></div><div></div></div></div>'));return true},",
 'visible Home skeleton'
);

js=patchRuntime(js,"if(window.__ctR424?.version==='1.0.215')return;",[
 [`function hideHomeSeries424(){
 const view=q('[data-home-view="series"]');if(!view)return false;
 view.dataset.ct424HomeGate='1';view.style.visibility='hidden';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 for(const el of homeScrollRoots424(view))try{el.scrollTop=0}catch{}
 return true;
}`,
 `function hideHomeSeries424(){
 const view=q('[data-home-view="series"]');if(!view)return false;
 view.style.removeProperty('visibility');view.removeAttribute('aria-hidden');view.dataset.ct424HomeGate='retired-r476';return true;
}`,'retire hidden Series gate'],
 [`async function gateHomeSeries424(){
 if(routeNow()!=='home'||activeHome()!=='series')return false;
 const token=++homeGate424;hideHomeSeries424();
 try{await timeout(Promise.resolve(window.__ctR399?.refreshSeries?.(true)),5200)}catch{}
 if(routeNow()==='home'&&activeHome()==='series')revealHomeSeries424(token);
 return true;
}`,
 `async function gateHomeSeries424(){
 if(routeNow()!=='home'||activeHome()!=='series')return false;
 hideHomeSeries424();try{void window.__ctR399?.refreshSeries?.(false)}catch{}return true;
}`,'retire delayed Series gate']
],'r424');

js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 ["window.__ctCoreR471?.homeMovieRow?.(y)","window.__ctCoreR471?.homeMovieCard?.(y)",'movie card renderer'],
 ["stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';const frag=document.createDocumentFragment()",
  "stack.replaceChildren();stack.classList.add('ct476-movie-grid');stack.style.display='grid';stack.style.flexDirection='';const frag=document.createDocumentFragment()",
  'movie card grid']
],'r388');

js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
 ["window.__ctCoreR471?.homeMovieRow?.(y)","window.__ctCoreR471?.homeMovieCard?.(y)",'movie card renderer'],
 ["stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",
  "stack.replaceChildren();stack.classList.add('ct476-movie-grid');stack.style.display='grid';stack.style.flexDirection='';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",
  'paged movie grid']
],'r399');

js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 ["const name=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v475';",
  "const name=group==='watch'?'cinetracker_discover_watch_smart_v476':'cinetracker_discover_fresh_v476';",
  'v476 pool authorities'],
 ["try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),7000)))}catch{return[]}",
  "try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),6000))).filter(x=>!/(^|\\b)(wwe|nxt|monday night raw|friday night smackdown|smackdown|wrestlemania|royal rumble|summerslam|survivor series)(\\b|$)/i.test(String(x?.title||x?.name||'')))}catch{return[]}",
  'defensive WWE filter'],
 ["const item=eligible[Math.floor(Math.random()*eligible.length)],key=keyOf(item);ex.add(key);",
  "const windowed=slot.startsWith('watch:')?eligible.slice(0,Math.min(12,eligible.length)):eligible;const item=windowed[Math.floor((slot.startsWith('watch:')?Math.pow(Math.random(),2):Math.random())*windowed.length)],key=keyOf(item);ex.add(key);",
  'smart weighted Watchlist swap'],
 [`function activate(){
 setForYouState();qa('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]').forEach(b=>{if(isForYouControl(b))b.classList.add('active')});
 renderLoading();void load(true);return true;
}`,
 `function activate(){
 setForYouState();qa('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]').forEach(b=>{if(isForYouControl(b))b.classList.add('active')});
 const warm=['movie','series','anime'].some(k=>state.watch[k].length||state.fresh[k].length);if(warm)render();else renderLoading();void load(true);return true;
}`,'instant warm repaint']
],'r464');

js=patchRuntime(js,'/* CineTracker Web 1.0.262 r472',[
 ["function scheduleProfile(force=false){\n const token=++profileToken;\n bounded(()=>{if(token!==profileToken||routeNow()!=='profile')return;void applyProfile(force)},[40,120,280,600,1200,2400,4200,7000,10000,13000,16000]);\n}",
  "function scheduleProfile(){return false}",
  'retire r472 profile scheduler']
],'r472');

js=patchRuntime(js,"if(window.__ctR457?.version==='1.0.247')return;",[
 ['const PROFILE_LIMIT_457=13;','const PROFILE_LIMIT_457=999999;','retire r457 large More']
],'r457');

js=patchRuntime(js,"window.__ctR460Marker='movies-sticky+watchlist-v405+foryou-7-swap+profile-13-half+daily-undo+f1-75-of-77-no-reconcile';",[
 ['const PROFILE_LIMIT_460=13;','const PROFILE_LIMIT_460=999999;','retire r460 large More']
],'r460');

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval('])if(runtime.includes(bad))throw new Error('r476 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v475.js','app-v476.js').replaceAll('app-v475.css','app-v476.css').replaceAll('v1.0.265','v1.0.266').replaceAll('r475-official-1.0.265','r476-official-1.0.266');
css+='\n/* CineTracker Web 1.0.266 r476 — visible Home, card Watchlist, intelligent discovery, Profile 12 + header More. */\n';
sw=sw.replaceAll('app-v475.js','app-v476.js').replaceAll('app-v475.css','app-v476.css').replaceAll('ct-web-1.0.265-r475','ct-web-1.0.266-r476');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.266',revision:'r476-official-1.0.266',base:'r475+r476-home-discover-profile',
 scope:'home-visible+movie-card-watchlist+discover-strict-smart+profile-header-more',
 home_series:'r424 delayed black gate retired; visible skeleton/frame paints immediately and r399/v452 remains data authority',
 home_movies:'history preserved; v405 Watchlist renders as standard 2:3 cards and is the semantic anchor on Filmes entry',
 discover_foryou:'daily/100% New use strict v476 seen/watchlist/favorite/alias/WWE exclusions; Watchlist uses recent-consumption genre affinity with weighted non-sequential swaps',
 profile_lists:'structured v476 authority; exactly 12 summary cards; only compact header More remains and opens all category items in a separate progressively-painted screen',
 history:'daily activity and undo v426 preserved',
 sports:'preserved',f1:'preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v476.js'),js),writeFile(resolve(dist,'app-v476.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v475.js'),{force:true}),rm(resolve(dist,'app-v475.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r476 missing runtime '+anchor);return js.slice(start,close+6)};
const r424=region("if(window.__ctR424?.version==='1.0.215')return;");
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
if(!r424.includes("ct424HomeGate='retired-r476'")||r424.includes("view.style.visibility='hidden'"))throw new Error('r476 Home black gate active');
if(!js.includes('homeMovieCard:item=>mediaCard')||!r388.includes("classList.add('ct476-movie-grid')")||!r399.includes("classList.add('ct476-movie-grid')"))throw new Error('r476 movie card grid missing');
if(!r464.includes('cinetracker_discover_watch_smart_v476')||!r464.includes('cinetracker_discover_fresh_v476')||!r464.includes('nxt|monday night raw'))throw new Error('r476 Discover authority missing');
for(const need of ['cinetracker_profile_lists_v476','data-ct476-header-more','data-ct476-all-screen','const LIMIT=12','i+36','cinetracker_activity_items_by_day_v426'])if(!js.includes(need))throw new Error('r476 missing '+need);
console.log('WEB_R476_READY Home + smart PraVoce + Profile header More');
