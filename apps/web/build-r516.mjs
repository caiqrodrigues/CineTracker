import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r515.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v515.js'),'utf8'),readFile(resolve(dist,'app-v515.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r516-final.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r516 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r516 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r516 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r516 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}

const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'loadMovies',`async function loadMovies(force=false){
 const active=()=>routeNow()==='home'&&activeKind()==='movies';
 const unpack=value=>{let raw=value;for(let i=0;i<7;i++){if(Array.isArray(raw)&&raw.length===1&&raw[0]&&typeof raw[0]==='object'){const one=raw[0];if(Array.isArray(one?.rows)||one?.count!=null||one?.total!=null){raw=one;break}const vals=Object.values(one);raw=vals.length===1&&vals[0]&&typeof vals[0]==='object'?vals[0]:one;continue}if(raw&&typeof raw==='object'&&Array.isArray(raw.rows))break;if(raw&&typeof raw==='object'&&raw.payload&&typeof raw.payload==='object'){raw=raw.payload;continue}if(raw&&typeof raw==='object'&&raw.data&&typeof raw.data==='object'){raw=raw.data;continue}if(raw&&typeof raw==='object'&&raw.result&&typeof raw.result==='object'){raw=raw.result;continue}break}return raw||{}};
 if(!force&&hMovies.length){if(active())renderMoviesAll();return hMovies}
 if(hMoviesTask&&!force)return hMoviesTask;
 const run=++hMoviesRun,pageSize=60;
 const page=async offset=>{const value=await timeout(rpc('cinetracker_home_movies_v405',{p_limit:pageSize,p_offset:offset}),6500),raw=unpack(value);return{rows:rows(raw?.rows??(Array.isArray(raw)?raw:[])),count:Number(raw?.count??raw?.total??0)||0}};
 const task=(async()=>{try{
  let first=await page(0);
  if(!first.rows.length){try{const alt=unpack(await timeout(rpc('cinetracker_watchlist_full_v376',{}),7000)),list=rows(alt?.rows??(Array.isArray(alt)?alt:[])).filter(x=>String(x?.media_type||'')==='movie');if(list.length)first={rows:list.slice(0,pageSize),count:Number(alt?.count??alt?.total??list.length)||list.length}}catch{}}
  if(run!==hMoviesRun)return hMovies;
  hMovies=first.rows.filter(x=>String(x?.media_type||'movie')==='movie'&&mediaId(x)>0);
  const total=Math.max(first.count,hMovies.length),sec=q('[data-ct388-movie-watch]');if(sec)sec.dataset.ct492Total=String(total);
  cacheSet(HM,hMovies);document.documentElement.dataset.ct516MoviesSource='v405:'+String(hMovies.length)+'/'+String(total);
  if(active()&&hMovies.length)renderMoviesAll();
  else if(active()&&!hMovies.length){const stack=q('[data-home-view="movies"] .ct388-movie-stack');if(stack)stack.innerHTML='<div class="empty">Não foi possível carregar a Watchlist. <button type="button" class="chip" data-ct505-movies-retry>Tentar novamente</button></div>'}
  window.__ctR492LoadMoreMovies=async()=>{if(window.__ctR516MovieMoreBusy)return false;const live=q('[data-ct388-movie-watch]'),currentTotal=Math.max(total,Number(live?.dataset?.ct492Total||0));if(hMovies.length>=currentTotal)return true;window.__ctR516MovieMoreBusy=true;try{const next=await page(hMovies.length),seen=new Set(hMovies.map(x=>String(mediaId(x))));for(const x of next.rows){const id=String(mediaId(x));if(id&&id!=='0'&&!seen.has(id)){seen.add(id);hMovies.push(x)}}cacheSet(HM,hMovies);if(active())renderMoviesAll();return true}catch(e){document.documentElement.dataset.ct516MoviesMoreError=String(e?.message||e);return false}finally{window.__ctR516MovieMoreBusy=false}};
  return hMovies
 }catch(e){document.documentElement.dataset.ct516MoviesError=String(e?.message||e);if(active()&&!hMovies.length){const stack=q('[data-home-view="movies"] .ct388-movie-stack');if(stack)stack.innerHTML='<div class="empty">Não foi possível carregar a Watchlist. <button type="button" class="chip" data-ct505-movies-retry>Tentar novamente</button></div>'}return hMovies}
 finally{if(hMoviesTask===task)hMoviesTask=null}})();
 hMoviesTask=task;return task
}`,'r388');

const A371="window.__ctR371Marker='home-tab-user-only+repaint-preserved+async-generation-cancel';";
js=replaceNamed(js,A371,'selectByUser',`function selectByUser(kind){
 const wanted=kind==='movies'?'movies':'series';
 userSelected=true;tabRef.current=wanted;tabGeneration++;window.__ctR504UserTab=wanted;window.__ctR502UserTab=wanted;
 document.documentElement.dataset.ct504HomeKind=wanted;document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 applyTab(wanted,tabGeneration);
 if(wanted==='movies'){
  Promise.resolve(window.__ctR388?.loadMovies?.(true)).then(()=>{if(desiredTab()==='movies'&&q('[data-home]')){applyTab('movies',tabGeneration);window.__ctR388?.renderMoviesAll?.()}}).catch(()=>{});
 }else try{void window.__ctR388?.loadSeries?.(false)}catch{}
 return{generation:tabGeneration,signal:tabController?.signal||null}
}`,'r371');

const A505="window.__ctR505Marker='home-movies-nonempty-retry+sticky-home-tabs+r504-pointer-preserved';";
js=replaceNamed(js,A505,'loading',`function loading(){
 if(!routeHome()||!moviesActive())return false;
 const stack=q('[data-home-view="movies"] .ct388-movie-stack');
 if(!stack||stack.querySelector('.ct514-movie-card,[data-ct505-movie-loading]'))return false;
 stack.innerHTML='<div class="ct505-movie-loading" data-ct505-movie-loading><span></span><span></span><span></span><span></span><span></span></div>';
 return true;
}`,'r505');
js=replaceNamed(js,A505,'failed',`function failed(){
 const stack=q('[data-home-view="movies"] .ct388-movie-stack');
 if(stack&&!stack.querySelector('.ct514-movie-card'))stack.innerHTML='<div class="empty">Não foi possível carregar a Watchlist. <button type="button" class="chip" data-ct505-movies-retry>Tentar novamente</button></div>';
}`,'r505');
js=replaceNamed(js,A505,'ensureMovies',`async function ensureMovies(force=false){
 if(movieTask&&!force)return movieTask;
 loading();
 const task=(async()=>{let list=[];try{list=await baseLoad?.(!!force)||[]}catch{}if(!Array.isArray(list))list=[];if(!list.length&&!force){try{list=await baseLoad?.(true)||[]}catch{};if(!Array.isArray(list))list=[]}if(routeHome()&&moviesActive()&&list.length){try{baseRender?.()}catch{}}if(routeHome()&&moviesActive()&&!list.length)failed();document.documentElement.dataset.ct516Movies=String(list.length);return list})().finally(()=>{if(movieTask===task)movieTask=null});
 movieTask=task;return task;
}`,'r505');
const oldOverride="if(baseLoad)window.__ctR388.loadMovies=ensureMovies;";
if(!js.includes(oldOverride))throw new Error('r516 r505 override missing');
js=js.replace(oldOverride,"/* r516: r388 v405 loader remains the final Movies owner; r505 is helper-only. */");

const A512="window.__ctR512Marker='r514-stable-historical-seasons+movie-2x3-rail+canonical-f1-sync';";
js=replaceNamed(js,A512,'cardHtml',`function cardHtml(key,p){
 const s=p?.series||{},isF1=key==='f1',title=isF1?'Fórmula 1':'UFC',season=Number(s.season||currentYear());
 const watched=Number(s.watched_episodes||0),seasonTotal=Number(s.total_episodes||s.released_episodes||0),pending=Number(s.available_episodes||0),poster=String(s.poster_url||''),g=window.__ctR516SpecialSummary?.get?.(key)||null;
 const globalWatched=Math.max(watched,Number(g?.watched||0)),globalTotal=Math.max(globalWatched,seasonTotal,Number(g?.total||0));
 const globalText=g&&globalTotal>0?(globalWatched.toLocaleString('pt-BR')+'/'+globalTotal.toLocaleString('pt-BR')+' eventos assistidos · '):'';
 const seasonText='T'+season+' · '+watched+'/'+seasonTotal+' '+(isF1?'sessões':'eventos');
 const sub=pending>0?(pending+' '+(isF1?'sessão':'evento')+(pending===1?'':'s')+' recente'+(pending===1?'':'s')+' pendente'+(pending===1?'':'s')+(s.next_episode_title?' · '+s.next_episode_title:'')):('Em dia'+(s.upcoming_episode_title?' · Próximo: '+s.upcoming_episode_title:''));
 return '<div class="media-row ct274-media-card ct512-special-card" data-ct512-special="'+key+'" data-ct513-open="'+key+'" role="button" tabindex="0" aria-label="Abrir série '+esc(title)+'"><div class="ct274-row-left"><div class="thumb"'+(poster?' style="background-image:url(&quot;'+esc(poster)+'&quot;)"':'')+'></div><div class="ct274-row-copy"><b>'+esc(title)+'</b><small class="ct274-meta">'+globalText+seasonText+'</small><small class="ct274-sub">'+esc(sub)+'</small></div></div><span class="badge" aria-hidden="true">›</span></div>'
}`,'r512');

const A513="window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch';";
js=replaceNamed(js,A513,'render',`function render(){
 if(!state)return false;
 let root=q('[data-ct513-series-screen]');if(!root){root=document.createElement('div');root.dataset.ct513SeriesScreen='1';root.className='ct513-series-screen';document.body.appendChild(root)}
 const type=state.type,title=type==='f1'?'Fórmula 1':'UFC',data=state.data||{},s=data.series||{},events=rows(data.events),seasons=rows(data.seasons);
 const watched=Number(s.watched_episodes??events.filter(x=>x.is_watched).length),total=Number(s.total_episodes??events.length),loading=state.loading,g=window.__ctR516SpecialSummary?.get?.(type)||null;
 const globalWatched=Math.max(watched,Number(g?.watched||0)),globalTotal=Math.max(globalWatched,total,Number(g?.total||0));
 const subtitle=type==='f1'?'Temporadas desde 1950 · treinos, classificação, sprint e corrida':'Temporadas desde 1993 · Fight Nights e PPVs';
 const globalText=g&&globalTotal>0?('Série: '+globalWatched.toLocaleString('pt-BR')+'/'+globalTotal.toLocaleString('pt-BR')+' eventos assistidos'):'Série: carregando total global…';
 root.innerHTML='<button type="button" class="btn ct513-series-back ct515-series-back" data-ct513-series-close aria-label="Voltar para Home">← Voltar para Home</button><main class="ct513-series-page"><header class="ct513-series-head"><div><small>SÉRIE</small><h1>'+title+'</h1><p>'+subtitle+'</p></div></header><section class="panel ct513-series-season"><div class="ct513-series-toolbar"><label>Temporada <select data-ct513-season '+(loading?'disabled':'')+'>'+seasons.map(y=>'<option value="'+Number(y)+'"'+(Number(y)===Number(state.season)?' selected':'')+'>'+Number(y)+'</option>').join('')+'</select></label><strong class="ct516-series-progress"><span>Temporada: '+watched+'/'+total+' '+(type==='f1'?'sessões':'eventos')+'</span><span>'+globalText+'</span></strong></div><div class="ct513-series-events">'+(loading?'<div class="ct513-series-loading">Carregando temporada '+Number(state.season)+'…</div>':events.length?events.map(x=>eventHtml(type,x)).join(''):'<div class="empty">Nenhum episódio/evento encontrado nesta temporada.</div>')+'</div></section></main>';
 document.documentElement.classList.add('ct513-series-open');return true
}`,'r513-screen');

const exportOld="window.__ctR513SeriesScreen={version:'0.3.40',open,close,changeSeason,get state(){return state}};";
if(!js.includes(exportOld))throw new Error('r516 r513 export missing');
js=js.replace(exportOld,"window.__ctR513SeriesScreen={version:'0.3.43',open,close,changeSeason,rerender:render,get state(){return state}};");

new Function(runtime);js+='\n'+runtime+'\n';
js+="\n;window.__ctR516Marker='movies-v405-final-owner+special-series-global-progress+season-progress-preserved';\n";
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r516-official-0.3.43';").replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.43 • $'+'{REVISION}');
html=html.replaceAll('app-v515.js?ct=r515-official-0.3.42','app-v516.js?ct=r516-official-0.3.43').replaceAll('app-v515.css?ct=r515-official-0.3.42','app-v516.css?ct=r516-official-0.3.43').replaceAll('r515-official-0.3.42','r516-official-0.3.43');
css+='\n/* r516 special-series global + seasonal progress. */\n.ct516-series-progress{display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:2px!important;font-size:12px!important}\n@media(max-width:640px){.ct516-series-progress{align-items:flex-start!important;width:100%!important}}\n';
sw=sw.replaceAll('ct-media-r515','ct-media-r516').replaceAll('app-v515.js','app-v516.js').replaceAll('app-v515.css','app-v516.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.43',revision:'r516-official-0.3.43',base:'r515+r516-final-owners',
 scope:'movie-watchlist-v405-final-owner+f1-ufc-global-progress',
 home_movies:'r505 no longer overwrites the r388/v405 loader; every explicit Filmes selection starts the final v405 owner and paints the first 60 strict 2:3 cards',
 special_series:'Home cards show global F1/UFC progress plus current-season progress; season screen keeps its own counter and shows global series progress separately',
 top10:'r514 strict 10+10 preserved unchanged',profile:'unchanged',discover_foryou:'unchanged',home_series:'unchanged',wwe:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v516.js'),js),writeFile(resolve(dist,'app-v516.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v515.js'),{force:true}),rm(resolve(dist,'app-v515.css'),{force:true})]);
for(const need of ["window.__ctR516Marker='movies-v405-final-owner+special-series-global-progress+season-progress-preserved'",'ct516MoviesSource','cinetracker_home_movies_v405','ct-special-series-summary','cinetracker_special_series_progress_v516','Série: carregando total global','r516-official-0.3.43','topEligible514'])if(!js.includes(need))throw new Error('r516 missing '+need);
if(js.includes("if(baseLoad)window.__ctR388.loadMovies=ensureMovies;"))throw new Error('r516 stale r505 override remains');
console.log('WEB_R516_READY final movie owner + global special progress');
