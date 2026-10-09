import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r508.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v508.js'),'utf8'),readFile(resolve(dist,'app-v508.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r509 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r509 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r509 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r509 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
const A371="window.__ctR371Marker='home-tab-user-only+repaint-preserved+async-generation-cancel';";
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";

js=replaceNamed(js,A371,'selectByUser',`function selectByUser(kind){
 const wanted=kind==='movies'?'movies':'series';
 userSelected=true;tabRef.current=wanted;tabGeneration++;window.__ctR504UserTab=wanted;window.__ctR502UserTab=wanted;
 document.documentElement.dataset.ct504HomeKind=wanted;document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 applyTab(wanted,tabGeneration);
 try{window.__ctR388?.requestHomeAnchor?.(wanted,true)}catch{}
 try{window.__ctR388?.renderHistory?.(wanted==='movies'?'movies':'episodes')}catch{}
 try{
  if(wanted==='movies')void window.__ctR388?.loadMovies?.(false);
  else{window.__ctR388?.renderSeries?.();void window.__ctR388?.loadSeries?.(false)}
 }catch{}
 return{generation:tabGeneration,signal:tabController?.signal||null}
}`,'r371');

js=replaceNamed(js,A388,'homeRequest507',`function homeRearm509(kind,frames=14){
 const k=kind==='movies'?'movies':'series';
 if(routeNow()!=='home'||activeKind()!==k||homeUserMoved393)return false;
 homeAnchorKind507=k;homeAnchorPending507=true;
 const state=window.__ctR509HomeAnchor||{kind:k,frames:0};state.kind=k;state.frames=Math.max(Number(state.frames||0),Number(frames||0));window.__ctR509HomeAnchor=state;
 requestAnimationFrame(()=>homeAlign507(k,false));return true
}
function homeRequest507(kind=activeKind(),reset=false){
 const k=kind==='movies'?'movies':'series';homeAnchorKind507=k;homeAnchorPending507=true;homeUserMoved393=false;homeAnchorToken393++;
 if(reset){homeMainReady507[k]=false;homeHistoryReady507[k]=false}
 window.__ctR509HomeAnchor={kind:k,frames:24};
 queueMicrotask(()=>homeAlign507(k,false));requestAnimationFrame(()=>homeAlign507(k,false));return homeAnchorToken393
}`,'r388');

js=replaceNamed(js,A388,'homeAlign507',`function homeAlign507(kind=activeKind(),final=false){
 const k=kind==='movies'?'movies':'series',state=window.__ctR509HomeAnchor||{kind:k,frames:0},frames=state.kind===k?Math.max(0,Number(state.frames||0)):0;
 if(routeNow()!=='home'||k!==homeAnchorKind507||activeKind()!==k)return false;
 if(homeUserMoved393){state.frames=0;window.__ctR509HomeAnchor=state;homeAnchorPending507=false;return false}
 if(!homeAnchorPending507&&frames<=0)return false;
 homeForceOrder500(k);const target=homeMain393(k);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),tabsRect=tabs?.getBoundingClientRect?.(),wantedTop=Math.max(8,Math.ceil(Number(tabsRect?.bottom||0))+8),root=homeScrollRoot500(target),doc=root===document.scrollingElement||root===document.documentElement||root===document.body;
 const rootTop=doc?0:Number(root.getBoundingClientRect?.().top||0),localTop=Math.max(0,wantedTop-rootTop),desired=homeOffset500(target,root)-localTop;
 target.style.scrollMarginTop='0px';homeSetScroll500(root,desired);target.dataset.ct509HomeStart='1';
 let left=Math.max(0,frames-1);state.kind=k;state.frames=left;window.__ctR509HomeAnchor=state;
 if(left>0)requestAnimationFrame(()=>homeAlign507(k,false));
 else if(homeMainReady507[k]&&homeHistoryReady507[k])homeAnchorPending507=false;
 if(final&&left<=0&&homeMainReady507[k]&&homeHistoryReady507[k])homeAnchorPending507=false;
 return true
}`,'r388');

js=replaceNamed(js,A388,'homeMarkMain507',`function homeMarkMain507(kind){
 const k=kind==='movies'?'movies':'series';homeMainReady507[k]=true;homeRearm509(k,14);return homeAlign507(k,homeHistoryReady507[k])
}`,'r388');

js=replaceNamed(js,A388,'homeMarkHistory507',`function homeMarkHistory507(kind){
 const k=kind==='movies'?'movies':'series';homeHistoryReady507[k]=true;homeRearm509(k,16);return homeAlign507(k,homeMainReady507[k])
}`,'r388');

js=replaceNamed(js,A388,'loadMovies',`async function loadMovies(force=false){
 const active=()=>routeNow()==='home'&&activeKind()==='movies',paint=()=>{if(active()&&hMovies.length){renderMoviesAll();return true}return false};
 const unpack=v=>{let raw=v?.data??v??{};for(let i=0;i<5;i++){if(Array.isArray(raw)&&raw.length===1&&raw[0]&&typeof raw[0]==='object'){raw=raw[0];continue}if(raw&&typeof raw==='object'&&raw.payload&&typeof raw.payload==='object'){raw=raw.payload;continue}if(raw&&typeof raw==='object'&&raw.data&&typeof raw.data==='object'){raw=raw.data;continue}break}return raw||{}};
 if(hMoviesTask){
  const inherited=hMoviesTask;try{await inherited}catch{}
  if(hMovies.length){paint();return hMovies}
  if(hMoviesTask===inherited)hMoviesTask=null;
 }
 if(!force&&!hMovies.length){const c=rows(cacheGet(HM,5*60*1000));if(c.length){hMovies=c;paint();return hMovies}}
 if(!force&&hMovies.length){paint();return hMovies}
 const run=++hMoviesRun,pageSize=60;
 const page=async offset=>{const value=await timeout(rpc('cinetracker_home_movies_v405',{p_limit:pageSize,p_offset:offset}),6500),raw=unpack(value);return{rows:rows(raw?.rows??(Array.isArray(raw)?raw:[])),count:Number(raw?.count??raw?.total??0)||0}};
 hMoviesTask=(async()=>{try{
  let first=await page(0);
  if(!first.rows.length)first=await page(0);
  if(!first.rows.length){try{const alt=unpack(await timeout(rpc('cinetracker_watchlist_full_v376',{}),7000)),list=rows(alt?.rows??(Array.isArray(alt)?alt:[])).filter(x=>String(x?.media_type||'')==='movie');if(list.length)first={rows:list.slice(0,pageSize),count:Number(alt?.count??alt?.total??list.length)||list.length}}catch{}}
  if(run!==hMoviesRun)return hMovies;
  hMovies=first.rows.filter(x=>String(x?.media_type||'movie')==='movie'&&mediaId(x)>0);
  const total=Math.max(first.count,hMovies.length),sec=q('[data-ct388-movie-watch]');if(sec)sec.dataset.ct492Total=String(total);
  cacheSet(HM,hMovies);document.documentElement.dataset.ct509MoviesSource='v405:'+String(hMovies.length)+'/'+String(total);
  if(hMovies.length)paint();else if(active()){const stack=q('.ct388-movie-stack');if(stack)stack.innerHTML='<div class="empty">Watchlist não carregou. <button type="button" class="chip" data-ct505-movies-retry>Tentar novamente</button></div>'}
  window.__ctR492LoadMoreMovies=async()=>{if(window.__ctR509MovieMoreBusy)return false;const currentTotal=Math.max(total,Number(q('[data-ct388-movie-watch]')?.dataset?.ct492Total||0));if(hMovies.length>=currentTotal)return true;window.__ctR509MovieMoreBusy=true;try{const next=await page(hMovies.length),seen=new Set(hMovies.map(x=>String(mediaId(x)))),added=[];for(const x of next.rows){const id=String(mediaId(x));if(id&&id!=='0'&&!seen.has(id)){seen.add(id);hMovies.push(x);added.push(x)}}cacheSet(HM,hMovies);if(active())renderMoviesAll(added);return true}catch(e){document.documentElement.dataset.ct509MoviesMoreError=String(e?.message||e);return false}finally{window.__ctR509MovieMoreBusy=false}};
  return hMovies
 }catch(e){document.documentElement.dataset.ct509MoviesError=String(e?.message||e);if(active()&&!hMovies.length){const stack=q('.ct388-movie-stack');if(stack)stack.innerHTML='<div class="empty">Não foi possível carregar a Watchlist. <button type="button" class="chip" data-ct505-movies-retry>Tentar novamente</button></div>'}return hMovies}
 finally{if(run===hMoviesRun)hMoviesTask=null}})();
 return hMoviesTask
}`,'r388');

js=replaceNamed(js,A388,'renderHome388',`async function renderHome388(){
 const kind=activeKind();try{if(!q('[data-home]'))setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{}
 paintFrame(kind);homeRequest507(kind,true);if(routeNow()!=='home')return false;
 if(kind==='series'){
  if(hSeries.length)renderSeries();if(hHistory)renderHistory('episodes');
  void loadSeries(false);void loadHistory(false);void loadMovies(false)
 }else{
  if(hMovies.length)renderMoviesAll();if(hHistory)renderHistory('movies');
  void loadMovies(false);void loadHistory(false)
 }
 document.documentElement.dataset.ct388Home='r509-final-home';return true
}`,'r388');

js+="\nfor(const ev of ['pointerdown','keydown'])window.addEventListener(ev,e=>{if(routeNow()!=='home')return;if(ev==='keydown'&&!['PageUp','PageDown','ArrowUp','ArrowDown','Home','End',' '].includes(String(e.key||'')))return;homeUserMoved393=true;homeAnchorPending507=false;if(window.__ctR509HomeAnchor)window.__ctR509HomeAnchor.frames=0},{capture:true,passive:true});\n";
js+="\nwindow.__ctR509Marker='home-history-truly-hidden-both-tabs+movies-empty-race-fixed+v405-nonempty+scope-home-only';\nwindow.__ctR509={version:'0.3.36',scope:'home-only'};\n";
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r509-official-0.3.36';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.36 • $'+'{REVISION}');
html=html.replaceAll('app-v508.js?ct=r508-official-0.3.35','app-v509.js?ct=r509-official-0.3.36').replaceAll('app-v508.css?ct=r508-official-0.3.35','app-v509.css?ct=r509-official-0.3.36').replaceAll('r508-official-0.3.35','r509-official-0.3.36');
css+='\n/* CineTracker Web 0.3.36 r509 — Home only: deterministic hidden History + movie empty-race recovery. */\n';
sw=sw.replaceAll('ct-media-r508','ct-media-r509').replaceAll('app-v508.js','app-v509.js').replaceAll('app-v508.css','app-v509.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.36',revision:'r509-official-0.3.36',base:'r508-home-only',
 scope:'home-series-movies-hidden-history+movie-watchlist-empty-race-fix',
 home_series:'History stays physically above Continue and the active viewport is deterministically anchored on Continue after both main/history paints; user scroll immediately releases the finite lock',
 home_movies:'History stays physically above Watchlist; an inherited empty in-flight result can no longer suppress a fresh v405 request; v405 retries once before bounded v376 fallback; first page remains the compact 176x264 rail',
 discover_foryou:'unchanged',top10:'unchanged',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v509.js'),js),writeFile(resolve(dist,'app-v509.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v508.js'),{force:true}),rm(resolve(dist,'app-v508.css'),{force:true})]);
for(const need of ["window.__ctR509Marker='home-history-truly-hidden-both-tabs+movies-empty-race-fixed+v405-nonempty+scope-home-only'","ct509MoviesSource","homeRearm509","cinetracker_home_movies_v405","r509-official-0.3.36"])if(!js.includes(need))throw new Error('r509 missing '+need);
console.log('WEB_R509_READY Home hidden History + movie race fix');
