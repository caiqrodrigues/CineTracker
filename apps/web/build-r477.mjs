import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r476.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v476.js'),'utf8'),
 readFile(resolve(dist,'app-v476.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r477-stability.js'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r477 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r477 invalid '+label+' bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r477 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}

/* r415 caused the exact ~9 second black Home entry. Retire the visual marker/timer defensively,
   without depending on the exact historical function formatting. */
{
 const anchor="window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile';";
 const at=js.indexOf(anchor);
 if(at<0)throw new Error('r477 missing r415 anchor');
 const rs=js.lastIndexOf('(()=>{',at),rc=js.indexOf('\n})();',at);
 if(rs<0||rc<0)throw new Error('r477 invalid r415 bounds');
 let region=js.slice(rs,rc+6);
 region=region.replaceAll("document.documentElement.dataset.ct415HomeEntering='series';","delete document.documentElement.dataset.ct415HomeEntering;");
 region=region.replace(/elapsed\s*>=\s*9000/g,'elapsed>=0');
 region=region.replace(/homeEntering\s*=\s*true/g,'homeEntering=false');
 region=region.replace("profilePaint(data);void updateSportsProfile(run);return data;","profilePaint(data);return data;");
 js=js.slice(0,rs)+region+js.slice(rc+6);
}

/* r424 may still refresh main time stats, but it no longer rewrites Sports or Profile lists. */
js=patchRuntime(js,"if(window.__ctR424?.version==='1.0.215')return;",[
 ["patchVisibleProfileStats424(stats,sports);normalizeProfileLists424();return{stats,sports};","patchVisibleProfileStats424(stats,null);try{window.__ctR476?.paintProfile?.()}catch{}return{stats,sports:null};",'retire sports/list repaint']
],'r424');

/* F1 Home uses the r477 writer directly; the existing F1 Hub runtime remains untouched. */

/* Movies return to the same compact rich row geometry used by Series. */
js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 ["window.__ctCoreR471?.homeMovieCard?.(y)","window.__ctCoreR471?.homeMovieRow?.(y)",'compact movie renderer'],
 ["stack.replaceChildren();stack.classList.add('ct476-movie-grid');stack.style.display='grid';stack.style.flexDirection='';const frag=document.createDocumentFragment()","stack.replaceChildren();stack.classList.remove('ct476-movie-grid');stack.style.display='flex';stack.style.flexDirection='column';const frag=document.createDocumentFragment()",'compact movie stack']
],'r388');

js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
 ["window.__ctCoreR471?.homeMovieCard?.(y)","window.__ctCoreR471?.homeMovieRow?.(y)",'compact movie renderer'],
 ["stack.replaceChildren();stack.classList.add('ct476-movie-grid');stack.style.display='grid';stack.style.flexDirection='';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';","stack.replaceChildren();stack.classList.remove('ct476-movie-grid');stack.style.display='flex';stack.style.flexDirection='column';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",'compact movie stack']
],'r399');

/* Pra Você returns to the proven v421 pools; keep only the defensive WWE text filter. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 ["const name=group==='watch'?'cinetracker_discover_watch_smart_v476':'cinetracker_discover_fresh_v476';","const name=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';",'restore v421 pools'],
 ["for(const delay of [0,300,900]){","for(const delay of [0,250]){",'bounded fast retry']
],'r464');

/* r476 already owns exactly twelve cards + compact header More; keep that behavior intact. */

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(runtime.includes(bad))throw new Error('r477 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v476.js','app-v477.js').replaceAll('app-v476.css','app-v477.css').replaceAll('v1.0.266','v1.0.267').replaceAll('r476-official-1.0.266','r477-official-1.0.267');
css+='\n/* CineTracker Web 1.0.267 r477 — fast visible Home, compact movie rows, stable F1/Discover/Profile. */\n';
sw=sw.replaceAll('app-v476.js','app-v477.js').replaceAll('app-v476.css','app-v477.css').replaceAll('ct-web-1.0.266-r476','ct-web-1.0.267-r477');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.267',revision:'r477-official-1.0.267',base:'r476+r477-stability',
 scope:'home-fast+f1-home-watch+compact-movies+discover-v421+profile-12-header-only+sports-stable',
 home_series:'retired r415 nine-second visual gate; Home shell/frame and r399/v452 remain the data authority',
 home_movies:'v405 Watchlist keeps History above but returns to the same compact rich ct274 row geometry used by Series',
 f1:'Home ct266 check writes through cinetracker_f1_watch_sync_v462 using the live closure RPC; r462 F1 Hub/progress bridge repaired',
 discover_foryou:'r464 restored to proven v421 watch/fresh pools with bounded retry and WWE defensive filter',
 profile_lists:'exactly 12 cards; no large More card; only compact header More opens the complete category screen',
 profile_sports:'r415/r424 competing Sports paints retired; final watched/stadium counts use v296 once per reconciliation',
 history:'daily activity and undo v426 preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v477.js'),js),writeFile(resolve(dist,'app-v477.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v476.js'),{force:true}),rm(resolve(dist,'app-v476.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r477 missing runtime '+anchor);return js.slice(start,close+6)};
const r415=region("window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile';");
const r424=region("if(window.__ctR424?.version==='1.0.215')return;");
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
if(r415.includes("document.documentElement.dataset.ct415HomeEntering='series'")||r415.includes('elapsed>=9000')&&r415.includes('homeEntering=true'))throw new Error('r477 r415 Home gate still active');
if(!r388.includes("homeMovieRow?.(y)")||!r399.includes("homeMovieRow?.(y)")||r388.includes("classList.add('ct476-movie-grid')")||r399.includes("classList.add('ct476-movie-grid')"))throw new Error('r477 compact Movies missing');
if(!r464.includes('cinetracker_discover_watch_unseen_v421')||!r464.includes('cinetracker_discover_fresh_v421')||r464.includes('cinetracker_discover_watch_smart_v476'))throw new Error('r477 v421 Discover missing');
if(!js.includes('const LIMIT=12')||!js.includes('data-ct476-header-more')||!js.includes("window.__ctR477Marker='home-no-nine-second-gate+compact-movies+f1-home-writer+foryou-v421+profile-12-header-only+sports-v296'"))throw new Error('r477 Profile/runtime marker missing');
for(const need of ['cinetracker_profile_lists_v476','cinetracker_sports_stadium_summary_v296','cinetracker_activity_items_by_day_v426','cinetracker_unmark_history_item_v426'])if(!js.includes(need))throw new Error('r477 missing '+need);
console.log('WEB_R477_READY');
