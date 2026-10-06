import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r472.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,discover,owner]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v472.js'),'utf8'),
 readFile(resolve(dist,'app-v472.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r474-discover-foryou.js'),'utf8'),
 readFile(resolve(root,'runtime-r474-home-profile.js'),'utf8')
]);

function region(source,anchor,label){
 const mark=source.indexOf(anchor);if(mark<0)throw new Error('r474 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',mark);if(start<0)throw new Error('r474 missing '+label+' start');
 const close=source.indexOf('\n})();',mark);if(close<0)throw new Error('r474 missing '+label+' end');
 const end=close+'\n})();'.length;return{start,end,text:source.slice(start,end)};
}
function patch(source,anchor,patches,label){
 const r=region(source,anchor,label);let t=r.text;
 for(const [a,b,n] of patches){const c=t.split(a).length-1;if(c!==1)throw new Error('r474 '+label+' '+n+' count '+c);t=t.replace(a,b)}
 return source.slice(0,r.start)+t+source.slice(r.end);
}
function strip(source,anchor,label){const r=region(source,anchor,label);return source.slice(0,r.start)+source.slice(r.end)}

js=patch(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 ["const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};","const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};\nconst rpc=(name,args={})=>{try{if(!window.__ctCoreR471?.rpc)return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",'core bridge'],
 ["const critical=[loadSeries(false),loadHistory(false)];if(kind==='movies')critical.push(loadMovies(false));","const critical=[loadHistory(false)];if(kind==='movies'){if(typeof window.__ctR399?.ensureMovies==='function')critical.push(Promise.resolve(window.__ctR399.ensureMovies(false)));else critical.push(loadMovies(false))}else{if(typeof window.__ctR399?.refreshSeries==='function')critical.push(Promise.resolve(window.__ctR399.refreshSeries(false)));else critical.push(loadSeries(false))}",'canonical loaders'],
 ["renderSeries();if(hHistory){renderHistory('episodes');renderHistory('movies')}if(kind==='movies'&&hMovies.length)renderMoviesAll();scheduleHome393(kind,false);","if(!window.__ctR399?.renderSeries&&hSeries.length)renderSeries();if(hHistory){renderHistory('episodes');renderHistory('movies')}if(kind==='movies'&&!window.__ctR399?.renderMovies&&hMovies.length)renderMoviesAll();scheduleHome393(kind,false);",'legacy repaint'],
 ["if(kind!=='movies'&&!hMovies.length)setTimeout(()=>{if(!hMovies.length)void loadMovies(false)},250);","if(kind!=='movies')setTimeout(()=>{if(typeof window.__ctR399?.ensureMovies==='function')void window.__ctR399.ensureMovies(false);else if(!hMovies.length)void loadMovies(false)},250);",'prefetch'],
 ["window.addEventListener('click',e=>{if(routeNow()!=='home')return;const b=e.target?.closest?.('[data-home-tab]');if(!b)return;const k=String(b.dataset.homeTab||'series')==='movies'?'movies':'series';homeAnchorToken393++;homeUserMoved393=false;applyTab(k);setTimeout(()=>{if(k==='movies'){if(hMovies.length)renderMoviesAll();else void loadMovies(false)}scheduleHome393(k,false)},0)},true);","window.addEventListener('click',e=>{if(routeNow()!=='home')return;const b=e.target?.closest?.('[data-home-tab]');if(!b)return;const k=String(b.dataset.homeTab||'series')==='movies'?'movies':'series';homeAnchorToken393++;homeUserMoved393=false;applyTab(k);setTimeout(()=>{if(k==='movies'){if(typeof window.__ctR399?.ensureMovies==='function')void window.__ctR399.ensureMovies(false);else if(hMovies.length)renderMoviesAll();else void loadMovies(false)}else if(typeof window.__ctR399?.refreshSeries==='function')void window.__ctR399.refreshSeries(false);scheduleHome393(k,false)},0)},true);",'tab owner']
],'r388');

js=patch(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
 ["const routeNow=()=>{try{if(typeof window.__ctR469Route==='function')return String(window.__ctR469Route()||'');return String(typeof route==='function'?route():'')}catch{return''}};","const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};",'route'],
 ["const rpcCall=(name,args)=>{try{if(typeof window.__ctR469Rpc==='function')return Promise.resolve(window.__ctR469Rpc(name,args));if(typeof rpc==='function')return Promise.resolve(rpc(name,args))}catch(e){return Promise.reject(e)}return Promise.reject(new Error('rpc unavailable'))};","const rpcCall=(name,args)=>{try{if(!window.__ctCoreR471?.rpc)return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",'rpc'],
 ["const authReady399=()=>{try{if(typeof window.__ctR469Session==='function'&&typeof window.__ctR469Rpc==='function')return!!window.__ctR469Session()?.access_token;return!!session?.access_token&&typeof rpc==='function'}catch{return false}};","const authReady399=()=>{try{return!!window.__ctCoreR471?.rpc}catch{return false}};",'auth']
],'r399');

js=strip(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",'old r464');
js=strip(js,"if(window.__ctR472?.version==='1.0.262')return;",'old r472');

new Function(discover);new Function(owner);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(discover.includes(bad)||owner.includes(bad))throw new Error('r474 forbidden '+bad);
js+='\n'+discover+'\n'+owner+'\n';

html=html.replaceAll('app-v472.js','app-v474.js').replaceAll('app-v472.css','app-v474.css').replaceAll('v1.0.262','v1.0.264').replaceAll('r472-official-1.0.262','r474-official-1.0.264');
css+='\n/* CineTracker Web 1.0.264 r474 — stable Home, strict rotating Pra Voce, Profile 12+13th more. */\n';
sw=sw.replaceAll('app-v472.js','app-v474.js').replaceAll('app-v472.css','app-v474.css').replaceAll('ct-web-1.0.262-r472','ct-web-1.0.264-r474');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.264',revision:'r474-official-1.0.264',base:'r472+r474-stable-owners',
 scope:'home-first-paint+discover-strict-rotation+profile-history-favorites-12+movie-history-watchlist-tabs',
 home:'r388 frame/history plus r399 v452/v405 through the live closure bridge; legacy v391/v393 media repaint retired',
 discover_foryou:'strict dashboard validation before paint; seen/favorite/watchlist blocked from fresh, seen/favorite blocked from Watchlist slots; opening rotation persisted per session',
 profile:'Series and Movies are recent history only; favorite rails isolated; Actors favorites; 12 cards plus 13th Ver mais; Movies full screen has History and Watchlist tabs',
 history:'r471/v426 preserved',f1:'preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v474.js'),js),writeFile(resolve(dist,'app-v474.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v472.js'),{force:true}),rm(resolve(dist,'app-v472.css'),{force:true})]);

for(const need of [
 "window.__ctR464Marker='discover-foryou-r474-strict-filter-rotate-v421'",
 "window.__ctR472Marker='home-stable+r474-profile-history-12-separate-more+stadium-v296'",
 'cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391',
 'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','cinetracker_profile_media_dashboard_v0991',
 'const PROFILE_LIMIT=12','data-ct472-movie-tab="history"','data-ct472-movie-tab="watchlist"','cinetracker_profile_actors_v465'
])if(!js.includes(need))throw new Error('r474 missing '+need);
if(js.includes("window.__ctR464Marker='discover-foryou-visible-owner-v421'"))throw new Error('r474 retained old r464');
if(js.includes("if(window.__ctR472?.version==='1.0.262')return;"))throw new Error('r474 retained old r472');
console.log('WEB_R474_READY');
