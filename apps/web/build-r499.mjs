import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r498.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v498.js'),'utf8'),
 readFile(resolve(dist,'app-v498.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r499 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r499 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r499 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r499 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'homeMain393',`function homeMain393(kind=activeKind()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q(':scope > [data-ct388-movie-watch]',view);
 return [...view.children].find(x=>x.matches?.('[data-ct388-series-section],[data-ct388-series-loading]')&&/continuar\\s+assistindo|assistir\\s*a\\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||q(':scope > [data-ct388-series-loading]',view)||null
}`,'r388');
js=replaceNamed(js,A388,'scheduleHome393',`function scheduleHome393(kind=activeKind(),fresh=false){
 if(fresh){homeAnchorToken393++;homeUserMoved393=false}const token=homeAnchorToken393;
 queueMicrotask(()=>alignHome393(kind,token));
 requestAnimationFrame(()=>requestAnimationFrame(()=>alignHome393(kind,token)));
 return token
}`,'r388');
js=replaceNamed(js,A388,'renderHistory',`function renderHistory(kind){
 const wanted=kind==='episodes'?'series':'movies',view=q('[data-home-view="'+wanted+'"]'),old=q(':scope > [data-ct388-history="'+kind+'"]',view);if(!view||!old)return false;
 const keep=routeNow()==='home'&&activeKind()===wanted&&!homeUserMoved393,anchor0=keep?homeMain393(wanted):null,before=anchor0?.getBoundingClientRect?.().top;
 const t=document.createElement('template');t.innerHTML=historySection(kind);old.replaceWith(t.content.firstElementChild);
 if(keep&&Number.isFinite(before))requestAnimationFrame(()=>{if(routeNow()!=='home'||activeKind()!==wanted||homeUserMoved393)return;const anchor=homeMain393(wanted),after=anchor?.getBoundingClientRect?.().top;if(Number.isFinite(after)){const delta=after-before;if(Math.abs(delta)>1)try{window.scrollBy({top:delta,left:0,behavior:'auto'})}catch{window.scrollBy?.(0,delta)}}});
 return true
}`,'r388');
js=replaceNamed(js,A388,'renderSeries',`function renderSeries(){
 const view=q('[data-home-view="series"]');if(!view)return false;
 qa(':scope > [data-ct399-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 const s=rows(hSeries),counts=window.__ctR492SeriesCounts||{},limit=Math.max(24,Math.min(250,Number(document.documentElement.dataset.ct492SeriesLimit||24)||24)),defs=[
  ['continue','Continuar assistindo',s.filter(x=>x.home_bucket==='continue')],
  ['dust','Juntando poeira',s.filter(x=>x.home_bucket==='dust')],
  ['up_to_date','Em dia',s.filter(x=>x.home_bucket==='up_to_date')],
  ['not_started','Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],
  ['completed','Concluídas',s.filter(x=>x.home_bucket==='completed')]
 ];
 const html=defs.map(([bucket,title,list])=>{
  let section=seriesSection(title,list),total=Math.max(list.length,Number(counts?.[bucket]||0));
  if(total>list.length&&list.length>=limit){
   const more='<div class="ct492-more-wrap"><button type="button" class="chip ct492-more" data-ct492-series-more="'+bucket+'">Carregar mais · '+list.length.toLocaleString('pt-BR')+' de '+total.toLocaleString('pt-BR')+'</button></div>';
   section=section.replace(/<\\/section>\\s*$/,more+'</section>');
  }
  return section;
 }).join('');
 const history=q(':scope > [data-ct388-history="episodes"]',view);
 if(history)history.insertAdjacentHTML('afterend',html);else view.insertAdjacentHTML('beforeend',html);
 document.documentElement.dataset.ct388Series=String(s.length);scheduleHome393('series',false);return true
}`,'r388');
js=replaceNamed(js,A388,'movieRow',`function movieRow(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 const tmdb=Number(y?.tmdb_id||y?.raw_tmdb?.id||0)||0,p=String(y?.poster_path||y?.raw_tmdb?.poster_path||''),src=p?(p.startsWith('http')?p:img(p,'w342')):'',meta=typeof ct274MovieMeta==='function'?ct274MovieMeta(y):[y?.release_year||'',y?.runtime_minutes?y.runtime_minutes+' min':''].filter(Boolean).join(' · ');
 const posterStyle='position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;min-width:100%!important;max-width:100%!important;min-height:100%!important;max-height:100%!important;aspect-ratio:auto!important;background-size:cover!important;background-position:center!important;'+(src?'background-image:url(\\''+esc(src)+'\\')!important;':'');
 let action='';try{action=ct274MovieWatchAction(y)||''}catch{}
 return '<article class="card ct499-movie-card" data-ct388-movie-id="'+mediaId(y)+'" data-media="movie:'+tmdb+'"><button type="button" class="ct499-movie-open" data-media="movie:'+tmdb+'" style="position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;min-width:100%!important;max-width:100%!important;min-height:100%!important;max-height:100%!important;padding:0!important"><div class="poster" style="'+posterStyle+'"></div><div class="card-body"><b>'+esc(titleOf(y))+'</b><small>'+esc(meta)+'</small></div></button>'+action+'</article>'
}`,'r388');
js=replaceNamed(js,A388,'renderMoviesAll',`function renderMoviesAll(addRows=null){
 const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;
 stack.classList.add('ct499-movie-grid');stack.classList.remove('stack');stack.style.removeProperty('display');stack.style.removeProperty('flex-direction');
 const append=Array.isArray(addRows),list=append?addRows:hMovies;if(!append){stack.replaceChildren();movieNodes=new Map()}
 const frag=document.createDocumentFragment();
 for(const x of rows(list)){const id=mediaId(x);if(!id||movieNodes.has(id))continue;const t=document.createElement('template');t.innerHTML=movieRow(x).trim();const node=t.content.firstElementChild;if(!node)continue;node.dataset.ct388MovieId=String(id);movieNodes.set(id,node);frag.appendChild(node)}
 if(frag.childNodes.length)stack.appendChild(frag);
 const ranks=new Map();sortedMovies().forEach((x,i)=>ranks.set(mediaId(x),i));for(const[id,node]of movieNodes)node.style.order=String(ranks.get(id)??999999);
 const total=Math.max(hMovies.length,Number(sec.dataset.ct492Total||0)),count=q('[data-ct388-movie-count]',sec);if(count)count.textContent=(hMovies.length<total?hMovies.length.toLocaleString('pt-BR')+' de ':'')+total.toLocaleString('pt-BR');
 let more=q('[data-ct492-movies-more]',sec);if(hMovies.length<total){if(!more){const wrap=document.createElement('div');wrap.className='ct492-more-wrap';wrap.innerHTML='<button type="button" class="chip ct492-more" data-ct492-movies-more>Carregar mais filmes</button>';stack.insertAdjacentElement('afterend',wrap);more=q('[data-ct492-movies-more]',sec)}if(more){more.disabled=false;more.textContent='Carregar mais filmes · '+hMovies.length.toLocaleString('pt-BR')+' de '+total.toLocaleString('pt-BR')}}else more?.closest?.('.ct492-more-wrap')?.remove();
 sec.dataset.ct388Rendered=String(movieNodes.size);document.documentElement.dataset.ct388Movies=String(movieNodes.size);scheduleHome393('movies',false);return true
}`,'r388');
js=replaceNamed(js,A388,'frame',`function frame(){
 return '<div class="home-tabs"><button type="button" class="chip active" data-home-tab="series">Séries</button><button type="button" class="chip" data-home-tab="movies">Filmes</button></div>'+
 '<div data-home-view="series" class="home-list">'+historySection('episodes')+(hSeries.length?'':'<section class="home-section" data-ct388-series-loading><div class="panel-head"><h3>Continuar assistindo</h3><small>…</small></div><div class="stack"><div class="empty">Carregando séries…</div></div></section>')+'</div>'+
 '<div data-home-view="movies" class="home-list hidden">'+historySection('movies')+movieSection()+'</div>'
}`,'r388');

const A321="window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity';";
js=replaceNamed(js,A321,'topRaw321',`async function topRaw321(provider,force=false){
 if(testBridge?.top)return testBridge.top(provider,force);
 const key=String(provider),hit=topCache.get(key);if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
 const storage='ct499:top10:'+String(typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10))+':'+key;
 if(!force)try{const c=JSON.parse(sessionStorage.getItem(storage)||'null');if(c?.movies&&c?.series){topCache.set(key,{at:Date.now(),rows:c});return c}}catch{}
 const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false},tasks=[];
 for(const page of [1,2,3,4,5]){tasks.push(tmdbPage321('/discover/movie',{...common,page},'movie'));tasks.push(tmdbPage321('/discover/tv',{...common,page},'tv'))}
 const got=await Promise.all(tasks),movies=[],series=[];for(let i=0;i<got.length;i+=2){movies.push(...got[i]);series.push(...got[i+1])}
 const data={movies:dedupe321(movies),series:dedupe321(series)};topCache.set(key,{at:Date.now(),rows:data});try{sessionStorage.setItem(storage,JSON.stringify(data))}catch{}return data
}`,'r321');
js=replaceNamed(js,A321,'paintTop321',`async function paintTop321(provider,token,force=false){
 const content=q('[data-ct321-top-content]');if(!content||token!==topToken||String(discover?.tab)!=='top10')return false;
 try{
  let raw=await topRaw321(provider,force),a=await exact321([...raw.movies,...raw.series]);
  if(token!==topToken||String(discover?.tab)!=='top10')return false;
  let movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10),series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);
  if(movies.length<10||series.length<10){
   const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false},tasks=[];
   for(const page of [6,7,8,9,10]){tasks.push(tmdbPage321('/discover/movie',{...common,page},'movie'));tasks.push(tmdbPage321('/discover/tv',{...common,page},'tv'))}
   const got=await Promise.all(tasks),mx=[],sx=[];for(let i=0;i<got.length;i+=2){mx.push(...got[i]);sx.push(...got[i+1])}
   raw={movies:dedupe321([...raw.movies,...mx]),series:dedupe321([...raw.series,...sx])};a=await exact321([...raw.movies,...raw.series]);
   if(token!==topToken||String(discover?.tab)!=='top10')return false;
   movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);topCache.set(String(provider),{at:Date.now(),rows:raw});
  }
  let name='Streaming';try{name=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider))?.provider_name||name}catch{}
  content.innerHTML='<div class="ct288-top-name"><b>'+esc(name)+'</b></div><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>'+series.length+'</small></div><div class="ct319-top-row">'+(series.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem séries elegíveis neste streaming.</div>')+'</div></section><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>'+movies.length+'</small></div><div class="ct319-top-row">'+(movies.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem filmes elegíveis neste streaming.</div>')+'</div></section>';
  loaded321();document.documentElement.dataset.ct499Top10=String(series.length)+':'+String(movies.length);return true
 }catch(e){content.innerHTML='<div class="empty">'+esc(e?.message||'Não foi possível carregar o Top 10 agora.')+'</div>';loaded321();return false}
}`,'r321');
js=replaceNamed(js,A321,'loadTop321',`async function loadTop321(force=false){
 const h=host();if(!h)return false;const token=++topToken;loading321('Carregando Top 10…');
 h.innerHTML='<section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row" data-ct321-providers><div class="ct263-loading">Carregando streamings…</div></div><div data-ct321-top-content><div class="ct263-loading">Montando Top 10…</div></div></section>';
 if(!state.topProvider)state.topProvider=Number((typeof ct171TopProvider!=='undefined'&&ct171TopProvider)||8)||8;try{ct171TopProvider=state.topProvider}catch{}
 const paint=paintTop321(state.topProvider,token,force);
 void Promise.resolve(typeof ct171Providers==='function'?ct171Providers():[]).then(providers=>{if(token!==topToken||String(discover?.tab)!=='top10')return;const list=rows(providers),box=q('[data-ct321-providers]');if(box)box.innerHTML=list.map(p=>'<button type="button" class="ct288-provider '+(Number(p.provider_id)===Number(state.topProvider)?'active':'')+'" data-ct321-provider="'+Number(p.provider_id)+'">'+(p.logo_path?'<span style="background-image:url(\\''+img(p.logo_path,'w92')+'\\')"></span>':'')+'<b>'+esc(p.provider_name||'Streaming')+'</b></button>').join('')||'<div class="empty">Nenhum streaming disponível.</div>'}).catch(()=>{});
 return paint
}`,'r321');

js=js.replace(/const REVISION='[^']+';/,"const REVISION='r499-official-0.3.26';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.26 • ${REVISION}');
js+='\nwindow.__ctR499Marker="history-above-main+native-movie-2x3+top10-ten-eligible+foryou-v498-preserved";\nwindow.__ctR499={version:"0.3.26",scope:"home-series-movies+discover-top10"};\n';
html=html.replaceAll('app-v498.js?ct=r498-official-0.3.25','app-v499.js?ct=r499-official-0.3.26').replaceAll('app-v498.css?ct=r498-official-0.3.25','app-v499.css?ct=r499-official-0.3.26').replaceAll('r498-official-0.3.25','r499-official-0.3.26');
css+='\n/* CineTracker Web 0.3.26 r499 — scoped Home ordering/native posters + Top 10 completeness. */\n'+
'html body [data-home-view="movies"] .ct388-movie-stack.ct499-movie-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;grid-auto-flow:row!important;gap:14px!important;align-items:start!important;width:100%!important;overflow:visible!important}\n'+
'html body [data-home-view="movies"] .ct499-movie-card{position:relative!important;display:block!important;width:150px!important;min-width:132px!important;max-width:150px!important;height:auto!important;aspect-ratio:2/3!important;padding:0!important;overflow:hidden!important;border-radius:12px!important;background:#07131d!important}\n'+
'html body [data-home-view="movies"] .ct499-movie-open{position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;min-height:0!important;padding:0!important;border:0!important;background:transparent!important;color:inherit!important;text-align:left!important}\n'+
'html body [data-home-view="movies"] .ct499-movie-card .poster{position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;aspect-ratio:auto!important;border-radius:0!important;background-size:cover!important;background-position:center!important}\n'+
'html body [data-home-view="movies"] .ct499-movie-card .card-body{position:absolute!important;z-index:2!important;left:0!important;right:0!important;bottom:0!important;padding:42px 8px 8px!important;background:linear-gradient(180deg,transparent,rgba(3,10,15,.96))!important;pointer-events:none!important}\n'+
'html body [data-home-view="movies"] .ct499-movie-card .card-body b,html body [data-home-view="movies"] .ct499-movie-card .card-body small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}\n'+
'html body [data-home-view="movies"] .ct499-movie-card>[data-ct266-watch],html body [data-home-view="movies"] .ct499-movie-card>[data-ct279-watch],html body [data-home-view="movies"] .ct499-movie-card>.ct266-watch-action,html body [data-home-view="movies"] .ct499-movie-card>.ct279-watch-button{position:absolute!important;z-index:5!important;top:7px!important;right:7px!important;margin:0!important;width:32px!important;min-width:32px!important;height:32px!important;min-height:32px!important;padding:0!important;border-radius:10px!important}\n'+
'@media(max-width:720px){html body [data-home-view="movies"] .ct388-movie-stack.ct499-movie-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}html body [data-home-view="movies"] .ct499-movie-card{width:100%!important;min-width:0!important;max-width:none!important}}\n';
sw=sw.replaceAll('ct-media-r498','ct-media-r499').replaceAll('app-v498.js','app-v499.js').replaceAll('app-v498.css','app-v499.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.26',revision:'r499-official-0.3.26',base:'r498-scoped-stable',scope:'home-history-above-anchor+native-movie-posters+top10-complete-only',home_series:'history remains first in DOM above Continue; entry anchors to Continue with viewport compensation when history hydrates',home_movies:'history remains above Watchlist; Watchlist uses native full-poster strict 2:3 cards and preserves v405 pagination/actions',discover_foryou:'v498 alias-safe seen exclusion preserved unchanged',top10:'pages 1-5 are primary; pages 6-10 are bounded top-up only when personal filtering leaves fewer than 10 eligible items',profile:'unchanged',f1:'unchanged',sports:'unchanged',history:'unchanged except Home placement',android:'unchanged-1.0.20/10062'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v499.js'),js),writeFile(resolve(dist,'app-v499.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v498.js'),{force:true}),rm(resolve(dist,'app-v498.css'),{force:true})]);
for(const need of ['window.__ctR499Marker="history-above-main+native-movie-2x3+top10-ten-eligible+foryou-v498-preserved"',"history.insertAdjacentHTML('afterend',html)",'ct499-movie-card','for(const page of [6,7,8,9,10])','cinetracker_foryou_payload_v498'])if(!js.includes(need))throw new Error('r499 missing '+need);
console.log('WEB_R499_READY scoped final');
