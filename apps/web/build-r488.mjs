import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r487.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v487.js'),'utf8'),
 readFile(resolve(dist,'app-v487.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r488-strict.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r488 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r488 invalid '+label+' bounds');
 return{start,end:close+6};
}
function disableRuntime(source,anchor,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end);
 if(!region.startsWith('(()=>{'))throw new Error('r488 invalid '+label+' opener');
 let disabled='(()=>{return;'+region.slice(6);
 disabled=disabled.replace(/window\.__ctR(485|486|487)Marker=/g,'window.__ctDisabledR$1Marker=');
 return source.slice(0,b.start)+disabled+source.slice(b.end);
}
function replaceNamedFunction(source,anchor,name,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end);
 const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\('),m=re.exec(region);
 if(!m)throw new Error('r488 missing '+label+' function '+name);
 const fnStart=m.index,open=region.indexOf('{',m.index+m[0].length);if(open<0)throw new Error('r488 missing '+label+' body '+name);
 let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){
  const c=region[i],n=region[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}
  if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}
  if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r488 unbalanced '+label+' function '+name);
 return source.slice(0,b.start)+region.slice(0,fnStart)+replacement+region.slice(i)+source.slice(b.end);
}
function patchRuntime(source,anchor,needle,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),count=region.split(needle).length-1;
 if(count!==1)throw new Error('r488 expected one '+label+' patch, found '+count);
 return source.slice(0,b.start)+region.replace(needle,replacement)+source.slice(b.end);
}

for(const [anchor,label] of [
 ["window.__ctR487Marker='home-pulse+movies-2x3+foryou-tmdb-fallback+top10-2x3+profile-exact-12'",'r487 runtime'],
 ["window.__ctR486Marker='home-immediate-frame+movies-row-sticky+discover-v485+top10-2x3+profile-exact-12'",'r486 runtime'],
 ["window.__ctR485Marker='home-cache-visible+movies-compact-rows+discover-v485-direct+profile-v485-exact-12'",'r485 runtime']
])js=disableRuntime(js,anchor,label);

const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=patchRuntime(js,A388,
 "<div class=\"stack\"><div class=\"empty\">Carregando séries…</div></div>",
 "<div class=\"ct481-home-skeleton animate-pulse ct488-home-skeleton\">"+Array.from({length:6},()=>'<div class="ct481-sk-row"><div class="ct481-sk-poster"></div><div class="ct481-sk-copy"><span></span><span></span></div></div>').join('')+"</div>",
 'r388 immediate series skeleton');
js=replaceNamedFunction(js,A388,'loadSeries',`async function loadSeries(force=false){
 if(hSeriesTask&&!force)return hSeriesTask;const run=++hRun;document.documentElement.dataset.ct392LoadStage='series:'+run;
 if(hSeries.length&&routeNow()==='home')renderSeries();
 hSeriesTask=(async()=>{try{
  const raw=typeof window.__ctR488HomeSeries==='function'?await window.__ctR488HomeSeries(!!force):await timeout(rpc('cinetracker_home_series_v452',{p_today:today()}),5200);
  const full=mergeLogicalSeries(rows(raw));if(run!==hRun)return hSeries;
  if(full.length){hSeries=full;cacheSet(HS,hSeries);if(routeNow()==='home')renderSeries()}
  setTimeout(()=>void refreshTv391(false),120);return hSeries;
 }catch(e){document.documentElement.dataset.ct392SeriesError=String(e?.message||e);return hSeries}
 finally{if(run===hRun)hSeriesTask=null}})();return hSeriesTask
}`,'r388');
js=replaceNamedFunction(js,A388,'loadHistory',`async function loadHistory(force=false){
 if(hHistoryTask&&!force)return hHistoryTask;const run=++hHistoryRun;
 hHistoryTask=(async()=>{try{
  const v=typeof window.__ctR488HomeHistory==='function'?await window.__ctR488HomeHistory(!!force):await timeout(rpc('cinetracker_home_history_v391',{p_limit:100}),4200);
  if(run!==hHistoryRun)return hHistory;if(v&&typeof v==='object'){hHistory=v;cacheSet(HH,v);if(routeNow()==='home'){renderHistory('episodes');renderHistory('movies')}}return hHistory;
 }catch(e){document.documentElement.dataset.ct392HistoryError=String(e?.message||e);return hHistory}
 finally{if(run===hHistoryRun)hHistoryTask=null}})();return hHistoryTask
}`,'r388');
js=replaceNamedFunction(js,A388,'renderHome388',`async function renderHome388(){
 const kind=activeKind();try{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{};paintFrame(kind);try{window.__ctR488PaintHomeSkeleton?.(kind)}catch{};scheduleHome393(kind,true);
 const critical=[loadSeries(false),loadHistory(false)];if(kind==='movies')critical.push(loadMovies(false));
 await Promise.allSettled(critical);if(routeNow()!=='home')return false;
 renderSeries();if(hHistory){renderHistory('episodes');renderHistory('movies')}if(kind==='movies'&&hMovies.length)renderMoviesAll();scheduleHome393(kind,false);
 if(kind!=='movies'&&!hMovies.length)setTimeout(()=>{if(!hMovies.length)void loadMovies(false)},250);
 document.documentElement.dataset.ct388Home='authoritative-ready';document.documentElement.dataset.ct392HomeReady='1';document.documentElement.dataset.ct393HomeReady='1';return true
}`,'r388');

const A399="window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';";
js=replaceNamedFunction(js,A399,'refreshSeries399',`async function refreshSeries399(force=false){
 if(seriesTask)return seriesTask;
 seriesTask=(async()=>{try{
  if(!(await waitAuth399()))throw new Error('auth-not-ready');
  const raw=typeof window.__ctR488HomeSeries==='function'?await window.__ctR488HomeSeries(!!force):await timeout(rpcCall('cinetracker_home_series_v452',{p_today:new Date().toISOString().slice(0,10)}),5200);
  const fresh=rows(raw);if(fresh.length&&routeNow()==='home'){series399=fresh;renderSeries399();scheduleAlign399('series',false);document.documentElement.dataset.ct399SeriesAuthority='v488-singleflight'}
  if(!fresh.length&&!series399.length)throw new Error('series-empty');return series399;
 }catch(e){
  const cached=rows(homeBase()?.series);if(!series399.length&&cached.length){series399=cached;renderSeries399()}
  if(!series399.length){const view=q('[data-home-view="series"]');if(view){qa(':scope > [data-ct399-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());view.insertAdjacentHTML('beforeend','<section class="home-section" data-ct399-series-section><div class="empty">Falha ao carregar Séries. <button type="button" class="chip" data-ct399-series-retry>Tentar novamente</button></div></section>')}}
  document.documentElement.dataset.ct399SeriesError=String(e?.message||e);return series399;
 }finally{seriesTask=null}})();
 const result=await seriesTask;if(force||rows(result).some(sportsLike))setTimeout(()=>{void refreshSports399()},1200);return result;
}`,'r399');

const A464="window.__ctR464Marker='discover-foryou-visible-owner-v421';";
js=replaceNamedFunction(js,A464,'fetchPool',`async function fetchPool(group,kind){
 if(typeof window.__ctR488FetchPool==='function')return window.__ctR488FetchPool(group,kind,rpcCall,unwrap,timeout,rows);
 const name=group==='watch'?'cinetracker_discover_watch_smart_v485':'cinetracker_discover_fresh_v485';
 const limit=group==='watch'?30:48;
 try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),2800)))}catch{return[]}
}`,'r464');

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(runtime.includes(bad))throw new Error('r488 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v487.js','app-v488.js').replaceAll('app-v487.css','app-v488.css').replaceAll('v0.3.14','v0.3.15').replaceAll('r487-official-0.3.14','r488-official-0.3.15');
css+='\n/* CineTracker Web 0.3.15 r488 — single authority, immediate Home skeleton, strict 2:3 cards and Profile 12. */\n';
sw=sw.replaceAll('app-v487.js','app-v488.js').replaceAll('app-v487.css','app-v488.css').replaceAll('ct-web-0.3.14-r487','ct-web-0.3.15-r488');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.15',revision:'r488-official-0.3.15',base:'r487-r485-r486-r487-ui-layers-removed+r488-single-authority',
 scope:'home-v452-singleflight+skeleton+movies-strict-2x3+discover-v485-v421-tmdb+top10-strict-2x3+profile-hard-12',
 home_series:'r388 and r399 share one v452 single-flight request; the frame itself contains animate-pulse skeletons so no black first paint remains',
 home_movies:'v405 paging remains; one final CSS authority enforces compact uniform 2:3 poster cards and truncated titles',
 discover_foryou:'r464 is the single visible owner; v485 is primary, v421 bounded fallback and TMDB starts speculatively then passes the strict user-state filter',
 discover_top10:'r321 renderer preserved; final CSS locks every poster container to 2:3 and every nested image to object-cover',
 profile_lists:'r476 remains the list owner with LIMIT=12; competing r485/r486/r487 reassert layers are removed and legacy More cards are pruned',
 sports:'preserved',f1:'preserved',history:'daily-v426-preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v488.js'),js),writeFile(resolve(dist,'app-v488.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v487.js'),{force:true}),rm(resolve(dist,'app-v487.css'),{force:true})]);

for(const old of ['window.__ctR485Marker=','window.__ctR486Marker=','window.__ctR487Marker='])if(js.includes(old))throw new Error('r488 competing runtime retained '+old);
for(const need of [
 "window.__ctR488Marker='single-authority+home-singleflight-skeleton+movies-2x3+foryou-strict-fallback+top10-2x3+profile-12'",
 'window.__ctR488HomeSeries','window.__ctR488HomeHistory','window.__ctR488FetchPool','window.__ctR488PaintHomeSkeleton',
 'cinetracker_home_series_v452','cinetracker_home_history_v391','cinetracker_home_movies_v405','cinetracker_discover_fresh_v485','cinetracker_discover_watch_smart_v485','cinetracker_profile_lists_v485','const LIMIT=12','ct476-header-more'
])if(!js.includes(need))throw new Error('r488 missing '+need);
console.log('WEB_R488_READY single strict authority');
