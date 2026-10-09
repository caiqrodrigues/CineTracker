import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r506.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v506.js'),'utf8'),readFile(resolve(dist,'app-v506.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r507 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r507 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r507 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r507 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
const A371="window.__ctR371Marker='home-tab-user-only+repaint-preserved+async-generation-cancel';";
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
const A505="window.__ctR505Marker='home-movies-nonempty-retry+sticky-home-tabs+r504-pointer-preserved';";

js=replaceNamed(js,A371,'selectByUser',`function selectByUser(kind){
 const wanted=kind==='movies'?'movies':'series';
 userSelected=true;tabRef.current=wanted;tabGeneration++;window.__ctR504UserTab=wanted;window.__ctR502UserTab=wanted;
 document.documentElement.dataset.ct504HomeKind=wanted;document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 applyTab(wanted,tabGeneration);
 try{window.__ctR388?.requestHomeAnchor?.(wanted,false)}catch{}
 try{if(wanted==='movies')void window.__ctR388?.loadMovies?.(false);else void window.__ctR388?.loadSeries?.(false)}catch{}
 return{generation:tabGeneration,signal:tabController?.signal||null}
}`,'r371');

js=replaceNamed(js,A388,'homeMain393',`let homeAnchorPending507=false,homeAnchorKind507='series';
const homeMainReady507={series:false,movies:false},homeHistoryReady507={series:false,movies:false};
function homeRequest507(kind=activeKind(),reset=false){
 const k=kind==='movies'?'movies':'series';homeAnchorKind507=k;homeAnchorPending507=true;homeUserMoved393=false;homeAnchorToken393++;
 if(reset){homeMainReady507[k]=k==='movies'?hMovies.length>0:hSeries.length>0;homeHistoryReady507[k]=!!hHistory}
 queueMicrotask(()=>homeAlign507(k,false));requestAnimationFrame(()=>requestAnimationFrame(()=>homeAlign507(k,false)));return homeAnchorToken393
}
function homeMain393(kind=activeKind()){
 const k=kind==='movies'?'movies':'series',view=q('[data-home-view="'+k+'"]');if(!view)return null;homeForceOrder500(k);
 if(k==='movies')return q(':scope > [data-ct388-movie-watch]',view);
 return [...view.children].find(x=>x.matches?.('[data-ct388-series-section],[data-ct388-series-loading]')&&/continuar\\s+assistindo|assistir\\s*a\\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||q(':scope > [data-ct388-series-loading]',view)||null
}
function homeAlign507(kind=activeKind(),final=false){
 const k=kind==='movies'?'movies':'series';if(routeNow()!=='home'||!homeAnchorPending507||k!==homeAnchorKind507||activeKind()!==k)return false;
 homeForceOrder500(k);const target=homeMain393(k);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),margin=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+12),root=homeScrollRoot500(target);
 target.style.scrollMarginTop=margin+'px';homeSetScroll500(root,homeOffset500(target,root)-margin);target.dataset.ct507HomeStart='1';
 if(final||homeMainReady507[k]&&homeHistoryReady507[k])homeAnchorPending507=false;
 return true
}
function homeMarkMain507(kind){const k=kind==='movies'?'movies':'series';homeMainReady507[k]=true;return homeAlign507(k,homeHistoryReady507[k])}
function homeMarkHistory507(kind){const k=kind==='movies'?'movies':'series';homeHistoryReady507[k]=true;return homeAlign507(k,homeMainReady507[k])}`,'r388');

js=replaceNamed(js,A388,'alignHome393',`function alignHome393(kind=activeKind()){return homeAlign507(kind,false)}`,'r388');
js=replaceNamed(js,A388,'scheduleHome393',`function scheduleHome393(kind=activeKind(),fresh=false){if(fresh)return homeRequest507(kind,true);queueMicrotask(()=>homeAlign507(kind,false));requestAnimationFrame(()=>homeAlign507(kind,false));return homeAnchorToken393}`,'r388');
js=replaceNamed(js,A388,'renderHistory',`function renderHistory(kind){
 const wanted=kind==='episodes'?'series':'movies',view=q('[data-home-view="'+wanted+'"]'),old=q(':scope > [data-ct388-history="'+kind+'"]',view);if(!view||!old)return false;
 const t=document.createElement('template');t.innerHTML=historySection(kind);old.replaceWith(t.content.firstElementChild);homeForceOrder500(wanted);
 if(routeNow()==='home'&&activeKind()===wanted)requestAnimationFrame(()=>homeMarkHistory507(wanted));return true
}`,'r388');

js=replaceNamed(js,A388,'renderSeries',`function renderSeries(){
 const view=q('[data-home-view="series"]');if(!view)return false;
 qa(':scope > [data-ct399-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 const s=rows(hSeries),counts=window.__ctR492SeriesCounts||{},limit=Math.max(24,Math.min(250,Number(document.documentElement.dataset.ct492SeriesLimit||24)||24)),defs=[['continue','Continuar assistindo',s.filter(x=>x.home_bucket==='continue')],['dust','Juntando poeira',s.filter(x=>x.home_bucket==='dust')],['up_to_date','Em dia',s.filter(x=>x.home_bucket==='up_to_date')],['not_started','Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],['completed','Concluídas',s.filter(x=>x.home_bucket==='completed')]];
 const html=defs.map(([bucket,title,list])=>{let section=seriesSection(title,list),total=Math.max(list.length,Number(counts?.[bucket]||0));if(total>list.length&&list.length>=limit){const more='<div class="ct492-more-wrap"><button type="button" class="chip ct492-more" data-ct492-series-more="'+bucket+'">Carregar mais · '+list.length.toLocaleString('pt-BR')+' de '+total.toLocaleString('pt-BR')+'</button></div>';section=section.replace(/<\\/section>\\s*$/,more+'</section>')}return section}).join('');
 const history=q(':scope > [data-ct388-history="episodes"]',view);if(history)history.insertAdjacentHTML('afterend',html);else view.insertAdjacentHTML('beforeend',html);
 homeForceOrder500('series');document.documentElement.dataset.ct388Series=String(s.length);if(activeKind()==='series')requestAnimationFrame(()=>homeMarkMain507('series'));return true
}`,'r388');

js=replaceNamed(js,A388,'renderMoviesAll',`function renderMoviesAll(addRows=null){
 const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;
 stack.classList.add('ct500-movie-grid');stack.classList.remove('stack','ct499-movie-grid');stack.style.removeProperty('display');stack.style.removeProperty('flex-direction');
 const append=Array.isArray(addRows),list=append?addRows:hMovies;if(!append){stack.replaceChildren();movieNodes=new Map()}
 const frag=document.createDocumentFragment();for(const x of rows(list)){const id=mediaId(x);if(!id||movieNodes.has(id))continue;const t=document.createElement('template');t.innerHTML=movieRow(x).trim();const node=t.content.firstElementChild;if(!node)continue;node.dataset.ct388MovieId=String(id);movieNodes.set(id,node);frag.appendChild(node)}
 if(frag.childNodes.length)stack.appendChild(frag);
 const ranks=new Map();sortedMovies().forEach((x,i)=>ranks.set(mediaId(x),i));for(const[id,node]of movieNodes)node.style.order=String(ranks.get(id)??999999);
 const total=Math.max(hMovies.length,Number(sec.dataset.ct492Total||0)),count=q('[data-ct388-movie-count]',sec);if(count)count.textContent=(hMovies.length<total?hMovies.length.toLocaleString('pt-BR')+' de ':'')+total.toLocaleString('pt-BR');
 let more=q('[data-ct492-movies-more]',sec);if(hMovies.length<total){if(!more){const wrap=document.createElement('div');wrap.className='ct492-more-wrap';wrap.innerHTML='<button type="button" class="chip ct492-more" data-ct492-movies-more>Carregar mais filmes</button>';stack.insertAdjacentElement('afterend',wrap);more=q('[data-ct492-movies-more]',sec)}if(more){more.disabled=false;more.textContent='Carregar mais filmes · '+hMovies.length.toLocaleString('pt-BR')+' de '+total.toLocaleString('pt-BR')}}else more?.closest?.('.ct492-more-wrap')?.remove();
 homeForceOrder500('movies');sec.dataset.ct388Rendered=String(movieNodes.size);document.documentElement.dataset.ct388Movies=String(movieNodes.size);if(activeKind()==='movies')requestAnimationFrame(()=>homeMarkMain507('movies'));return true
}`,'r388');

js=replaceNamed(js,A388,'loadMovies',`async function loadMovies(force=false){
 const active=()=>routeNow()==='home'&&activeKind()==='movies',paint=()=>{if(active()&&hMovies.length){renderMoviesAll();return true}return false};
 const unpack=v=>{let raw=v?.data??v??{};for(let i=0;i<5;i++){if(Array.isArray(raw)&&raw.length===1&&raw[0]&&typeof raw[0]==='object'){raw=raw[0];continue}if(raw&&typeof raw==='object'&&raw.payload&&typeof raw.payload==='object'){raw=raw.payload;continue}if(raw&&typeof raw==='object'&&raw.data&&typeof raw.data==='object'){raw=raw.data;continue}break}return raw||{}};
 if(hMoviesTask){try{await hMoviesTask}catch{}paint();return hMovies}
 if(!force&&!hMovies.length){const c=rows(cacheGet(HM,5*60*1000));if(c.length){hMovies=c;paint();return hMovies}}
 if(!force&&hMovies.length){paint();return hMovies}
 const run=++hMoviesRun,pageSize=60;
 const page=async offset=>{const value=await timeout(rpc('cinetracker_home_movies_v405',{p_limit:pageSize,p_offset:offset}),6500),raw=unpack(value);return{rows:rows(raw?.rows??(Array.isArray(raw)?raw:[])),count:Number(raw?.count??raw?.total??0)||0}};
 hMoviesTask=(async()=>{try{
  let first=await page(0);
  if(!first.rows.length){try{const alt=unpack(await timeout(rpc('cinetracker_watchlist_full_v376',{}),9000)),list=rows(alt?.rows??(Array.isArray(alt)?alt:[])).filter(x=>String(x?.media_type||'')==='movie');if(list.length)first={rows:list.slice(0,pageSize),count:Number(alt?.count??alt?.total??list.length)||list.length}}catch{}}
  if(run!==hMoviesRun)return hMovies;
  hMovies=first.rows.filter(x=>String(x?.media_type||'movie')==='movie'&&mediaId(x)>0);
  const total=Math.max(first.count,hMovies.length),sec=q('[data-ct388-movie-watch]');if(sec)sec.dataset.ct492Total=String(total);
  cacheSet(HM,hMovies);document.documentElement.dataset.ct507MoviesSource='v405:'+String(hMovies.length)+'/'+String(total);
  if(hMovies.length)paint();else if(active()){const stack=q('.ct388-movie-stack');if(stack)stack.innerHTML='<div class="empty">Watchlist não carregou. <button type="button" class="chip" data-ct505-movies-retry>Tentar novamente</button></div>'}
  window.__ctR492LoadMoreMovies=async()=>{if(window.__ctR507MovieMoreBusy)return false;const currentTotal=Math.max(total,Number(q('[data-ct388-movie-watch]')?.dataset?.ct492Total||0));if(hMovies.length>=currentTotal)return true;window.__ctR507MovieMoreBusy=true;try{const next=await page(hMovies.length),seen=new Set(hMovies.map(x=>String(mediaId(x)))),added=[];for(const x of next.rows){const id=String(mediaId(x));if(id&&id!=='0'&&!seen.has(id)){seen.add(id);hMovies.push(x);added.push(x)}}cacheSet(HM,hMovies);if(active())renderMoviesAll(added);return true}catch(e){document.documentElement.dataset.ct507MoviesMoreError=String(e?.message||e);return false}finally{window.__ctR507MovieMoreBusy=false}};
  return hMovies
 }catch(e){document.documentElement.dataset.ct507MoviesError=String(e?.message||e);if(active()&&!hMovies.length){const stack=q('.ct388-movie-stack');if(stack)stack.innerHTML='<div class="empty">Não foi possível carregar a Watchlist. <button type="button" class="chip" data-ct505-movies-retry>Tentar novamente</button></div>'}return hMovies}
 finally{if(run===hMoviesRun)hMoviesTask=null}})();
 return hMoviesTask
}`,'r388');

js=replaceNamed(js,A505,'ensureMovies',`async function ensureMovies(force=false){
 if(movieTask)return movieTask;loading();
 movieTask=Promise.resolve().then(()=>baseLoad?.(!!force)||[]).then(list=>{list=Array.isArray(list)?list:[];if(routeHome()&&moviesActive()&&list.length)try{baseRender?.()}catch{};if(routeHome()&&moviesActive()&&!list.length)failed();document.documentElement.dataset.ct505Movies=String(list.length);return list}).finally(()=>{movieTask=null});
 return movieTask
}`,'r505');

const movedOld="for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home')homeUserMoved393=true},{capture:true,passive:true});";
if(!js.includes(movedOld))throw new Error('r507 missing Home movement listener');
js=js.replace(movedOld,"for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home'){homeUserMoved393=true;homeAnchorPending507=false}},{capture:true,passive:true});");

const exportOld="window.__ctR388={version:'1.0.184',renderHome:renderHome388,loadSeries,loadHistory,loadMovies,renderSeries,renderMoviesAll,";
if(!js.includes(exportOld))throw new Error('r507 missing r388 export');
js=js.replace(exportOld,"window.__ctR388={version:'1.0.184',requestHomeAnchor:homeRequest507,alignHome:(k)=>homeAlign507(k,true),renderHome:renderHome388,loadSeries,loadHistory,loadMovies,renderSeries,renderMoviesAll,");

js+="\nwindow.__ctR507Marker='home-final-anchor-after-history+movies-v405-singleflight+scope-home-only';\nwindow.__ctR507={version:'0.3.34',scope:'home-only'};\n";
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r507-official-0.3.34';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.34 • $'+'{REVISION}');
html=html.replaceAll('app-v506.js?ct=r506-official-0.3.33','app-v507.js?ct=r507-official-0.3.34').replaceAll('app-v506.css?ct=r506-official-0.3.33','app-v507.css?ct=r507-official-0.3.34').replaceAll('r506-official-0.3.33','r507-official-0.3.34');
css+='\n/* CineTracker Web 0.3.34 r507 — Home only: final history-aware anchor + single-flight movie Watchlist. */\n';
sw=sw.replaceAll('ct-media-r506','ct-media-r507').replaceAll('app-v506.js','app-v507.js').replaceAll('app-v506.css','app-v507.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.34',revision:'r507-official-0.3.34',base:'r506-scoped-home',
 scope:'home-history-final-anchor+movies-watchlist-singleflight',
 home_series:'History remains physically above Continue; anchor is repeated exactly when the real History and main section settle, then released so user scroll wins',
 home_movies:'History remains physically above Watchlist; v405 is single-flight/cache-first, verified at 60 rows of 1391, with v376 only as bounded fallback',
 discover_foryou:'unchanged',top10:'unchanged',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v507.js'),js),writeFile(resolve(dist,'app-v507.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v506.js'),{force:true}),rm(resolve(dist,'app-v506.css'),{force:true})]);
for(const need of ["window.__ctR507Marker='home-final-anchor-after-history+movies-v405-singleflight+scope-home-only'","homeMarkHistory507","homeMarkMain507","cinetracker_home_movies_v405","ct507MoviesSource","r507-official-0.3.34"])if(!js.includes(need))throw new Error('r507 missing '+need);
console.log('WEB_R507_READY Home-only final anchor + Movies single-flight');
