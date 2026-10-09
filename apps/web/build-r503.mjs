import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r502.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v502.js'),'utf8'),readFile(resolve(dist,'app-v502.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r503 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r503 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r503 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r503 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}

const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'activeKind',`function activeKind(){
 const locked=String(window.__ctR502UserTab||document.documentElement.dataset.ct502HomeKind||'');
 if(locked==='movies'||locked==='series')return locked;
 try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}
}`,'r388');
js=replaceNamed(js,A388,'applyTab',`function applyTab(k){
 const locked=String(window.__ctR502UserTab||document.documentElement.dataset.ct502HomeKind||''),wanted=(locked==='movies'||locked==='series')?locked:(k==='movies'?'movies':'series');
 document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 try{return window.__ctR495?.applyHomeTab?.(wanted,false)??window.__ctR371?.applyTab?.(wanted)??false}catch{try{return window.__ctR371?.applyTab?.(wanted)??false}catch{return false}}
}`,'r388');
js=replaceNamed(js,A388,'alignHome393',`function alignHome393(kind=activeKind(),token=homeAnchorToken393){
 const current=activeKind();if(routeNow()!=='home'||token!==homeAnchorToken393||homeUserMoved393||kind!==current)return false;
 applyTab(current);homeForceOrder500(current);const target=homeMain393(current);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),margin=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+8),root=homeScrollRoot500(target);
 target.style.scrollMarginTop=margin+'px';
 if(current==='movies'){
  try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{try{target.scrollIntoView(true)}catch{}}
  const doc=root===document.scrollingElement||root===document.documentElement||root===document.body,delta=target.getBoundingClientRect().top-margin;
  if(Math.abs(delta)>1){if(doc){try{window.scrollBy({top:delta,left:0,behavior:'auto'})}catch{window.scrollBy?.(0,delta)}}else root.scrollTop+=delta}
 }else homeSetScroll500(root,homeOffset500(target,root)-margin);
 target.dataset.ct503HomeStart='1';return true
}`,'r388');
js=replaceNamed(js,A388,'loadMovies',`async function loadMovies(force=false){
 const shouldPaint=()=>routeNow()==='home'&&activeKind()==='movies';
 const paintLoaded=()=>{if(shouldPaint()&&hMovies.length){renderMoviesAll();return true}return false};
 if(!hMovies.length&&!force){const cached=rows(cacheGet(HM,5*60*1000));if(cached.length){hMovies=cached;paintLoaded()}}else paintLoaded();
 if(hMoviesTask&&!force){try{await hMoviesTask}catch{}paintLoaded();return hMovies}
 const run=++hMoviesRun,pageSize=60;
 hMoviesTask=(async()=>{try{
  const page=async offset=>{const v=await timeout(rpc('cinetracker_home_movies_v405',{p_limit:pageSize,p_offset:offset}),6500),raw=v?.data??v??{};return{rows:rows(raw?.rows),count:Number(raw?.count||0)||0}};
  const first=await page(0);if(run!==hMoviesRun){paintLoaded();return hMovies}
  const incoming=first.rows.filter(x=>String(x?.media_type||'movie')==='movie'&&mediaId(x)>0);if(incoming.length)hMovies=incoming;
  const total=Math.max(first.count,hMovies.length),sec=q('[data-ct388-movie-watch]');if(sec)sec.dataset.ct492Total=String(total);
  cacheSet(HM,hMovies);paintLoaded();
  window.__ctR492LoadMoreMovies=async()=>{
   if(window.__ctR492MovieMoreBusy)return false;const currentTotal=Math.max(total,Number(q('[data-ct388-movie-watch]')?.dataset?.ct492Total||0));if(hMovies.length>=currentTotal)return true;
   window.__ctR492MovieMoreBusy=true;const b=q('[data-ct492-movies-more]');if(b){b.disabled=true;b.textContent='Carregando…'}
   try{const next=await page(hMovies.length),seen=new Set(hMovies.map(x=>String(mediaId(x)))),added=[];for(const x of next.rows){const id=String(mediaId(x));if(id&&id!=='0'&&!seen.has(id)){seen.add(id);hMovies.push(x);added.push(x)}}cacheSet(HM,hMovies);if(shouldPaint())renderMoviesAll(added);return true}
   catch(e){document.documentElement.dataset.ct492MoviesMoreError=String(e?.message||e);return false}
   finally{window.__ctR492MovieMoreBusy=false;const btn=q('[data-ct492-movies-more]');if(btn)btn.disabled=false}
  };
  document.documentElement.dataset.ct503MoviesReady=String(hMovies.length)+'/'+String(total);return hMovies
 }catch(e){
  document.documentElement.dataset.ct503MoviesError=String(e?.message||e);paintLoaded();
  if(shouldPaint()&&!hMovies.length){const stack=q('.ct388-movie-stack');if(stack)stack.innerHTML='<div class="empty">Não foi possível carregar a Watchlist.</div>'}
  return hMovies
 }finally{if(run===hMoviesRun)hMoviesTask=null}})();
 const out=await hMoviesTask;paintLoaded();return out
}`,'r388');

const A495="window.__ctR495Marker='modern-runtime+old-owners-retired+progressive-home+fast-profile+strict-12';";
js=replaceNamed(js,A495,'applyHomeTab495',`function applyHomeTab495(kind,resetScroll=false){
 const root=document.querySelector('[data-home]');if(!root)return false;
 const locked=String(window.__ctR502UserTab||document.documentElement.dataset.ct502HomeKind||''),wanted=(locked==='movies'||locked==='series')?locked:(kind==='movies'?'movies':'series');
 root.querySelectorAll('[data-home-tab]').forEach(b=>{const on=String(b.dataset.homeTab||'series')===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 root.querySelectorAll('[data-home-view]').forEach(v=>{const on=String(v.dataset.homeView||'')===wanted;v.hidden=!on;v.classList.toggle('hidden',!on);v.setAttribute('aria-hidden',on?'false':'true')});
 document.documentElement.dataset.ct495HomeKind=wanted;document.documentElement.dataset.ct502HomeKind=wanted;
 if(resetScroll)try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo?.(0,0)}
 try{
  if(wanted==='movies'){
   const ready=window.__ctR388?.home?.movies||[];if(ready.length)window.__ctR388?.renderMoviesAll?.();
   Promise.resolve(window.__ctR388?.loadMovies?.(false)).then(()=>{const still=String(window.__ctR502UserTab||document.documentElement.dataset.ct502HomeKind||'')==='movies';if(still&&document.querySelector('[data-home]'))window.__ctR388?.renderMoviesAll?.()}).catch(()=>{})
  }else void window.__ctR388?.loadSeries?.(false)
 }catch{}
 return true
}`,'r495');

js+="\nwindow.__ctR503Marker='home-movies-single-tab-writer+inflight-watchlist-repaint+r502-layout-preserved';\nwindow.__ctR503={version:'0.3.30',scope:'home-movies-only'};\n";
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r503-official-0.3.30';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.30 • ${REVISION}');
html=html.replaceAll('app-v502.js?ct=r502-official-0.3.29','app-v503.js?ct=r503-official-0.3.30').replaceAll('app-v502.css?ct=r502-official-0.3.29','app-v503.css?ct=r503-official-0.3.30').replaceAll('r502-official-0.3.29','r503-official-0.3.30');
css+='\n/* CineTracker Web 0.3.30 r503 — Home Filmes race fix only. */\n';
sw=sw.replaceAll('ct-media-r502','ct-media-r503').replaceAll('app-v502.js','app-v503.js').replaceAll('app-v502.css','app-v503.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.30',revision:'r503-official-0.3.30',base:'r502-scoped-stable',scope:'home-movies-race-only',home_series:'r500/r501 preserved unchanged',home_movies:'single canonical tab writer; ct266 legacy setter removed from r388 path; an in-flight v405 request always repaints Watchlist after completion when Filmes remains selected; cached movie rows paint immediately; r502 176x264/2:3 layout preserved',discover_foryou:'r498 preserved unchanged',top10:'r500 preserved unchanged',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v503.js'),js),writeFile(resolve(dist,'app-v503.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v502.js'),{force:true}),rm(resolve(dist,'app-v502.css'),{force:true})]);
for(const need of ["window.__ctR503Marker='home-movies-single-tab-writer+inflight-watchlist-repaint+r502-layout-preserved'","if(hMoviesTask&&!force){try{await hMoviesTask}catch{}paintLoaded();return hMovies}","Promise.resolve(window.__ctR388?.loadMovies?.(false)).then","r503-official-0.3.30"])if(!js.includes(need))throw new Error('r503 missing '+need);
const r388At=js.indexOf(A388),r388Start=js.lastIndexOf('(()=>{',r388At),r388End=js.indexOf('\n})();',r388At),r388=js.slice(r388Start,r388End),applyMatch=/function applyTab\(k\)[\s\S]*?\n}/.exec(r388)?.[0]||'';
if(applyMatch.includes('ct266ApplyHomeTab'))throw new Error('r503 legacy ct266 still in r388 applyTab');
console.log('WEB_R503_READY Home Movies single writer + in-flight repaint');
