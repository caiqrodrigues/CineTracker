import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r499.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v499.js'),'utf8'),readFile(resolve(dist,'app-v499.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r500 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r500 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r500 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r500 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'homeMain393',`function homeScrollRoot500(target){
 let p=target?.parentElement;
 while(p&&p!==document.body&&p!==document.documentElement){
  try{const s=getComputedStyle(p),y=String(s.overflowY||'');if(/auto|scroll|overlay/.test(y)&&p.scrollHeight>p.clientHeight+2)return p}catch{}
  p=p.parentElement
 }
 return document.scrollingElement||document.documentElement
}
function homeOffset500(target,root){
 if(!target||!root)return 0;
 const doc=root===document.scrollingElement||root===document.documentElement||root===document.body;
 if(doc)return target.getBoundingClientRect().top+(window.scrollY||root.scrollTop||0);
 const a=target.getBoundingClientRect(),b=root.getBoundingClientRect();return a.top-b.top+root.scrollTop
}
function homeSetScroll500(root,top){
 const y=Math.max(0,Number(top)||0),doc=root===document.scrollingElement||root===document.documentElement||root===document.body;
 if(doc){try{window.scrollTo({top:y,left:0,behavior:'auto'})}catch{window.scrollTo?.(0,y)}}else root.scrollTop=y
}
function homeForceOrder500(kind=activeKind()){
 const k=kind==='movies'?'movies':'series',view=q('[data-home-view="'+k+'"]');if(!view)return false;
 const history=q(':scope > [data-ct388-history="'+(k==='movies'?'movies':'episodes')+'"]',view);
 let main=null;
 if(k==='movies')main=q(':scope > [data-ct388-movie-watch]',view);
 else main=[...view.children].find(x=>x.matches?.('[data-ct388-series-section],[data-ct388-series-loading]')&&/continuar\\s+assistindo|assistir\\s*a\\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||q(':scope > [data-ct388-series-loading]',view);
 if(history&&main&&!(history.compareDocumentPosition(main)&Node.DOCUMENT_POSITION_FOLLOWING))view.insertBefore(history,main);
 return !!(history&&main)
}
function homeMain393(kind=activeKind()){
 const k=kind==='movies'?'movies':'series',view=q('[data-home-view="'+k+'"]');if(!view)return null;homeForceOrder500(k);
 if(k==='movies')return q(':scope > [data-ct388-movie-watch]',view);
 return [...view.children].find(x=>x.matches?.('[data-ct388-series-section],[data-ct388-series-loading]')&&/continuar\\s+assistindo|assistir\\s*a\\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||q(':scope > [data-ct388-series-loading]',view)||null
}`,'r388');
js=replaceNamed(js,A388,'alignHome393',`function alignHome393(kind=activeKind(),token=homeAnchorToken393){
 if(routeNow()!=='home'||token!==homeAnchorToken393||homeUserMoved393)return false;applyTab(kind);homeForceOrder500(kind);
 const target=homeMain393(kind);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),margin=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+8),root=homeScrollRoot500(target);
 target.style.scrollMarginTop=margin+'px';homeSetScroll500(root,homeOffset500(target,root)-margin);target.dataset.ct500HomeStart='1';return true
}`,'r388');
js=replaceNamed(js,A388,'scheduleHome393',`function scheduleHome393(kind=activeKind(),fresh=false){
 if(fresh){homeAnchorToken393++;homeUserMoved393=false}const token=homeAnchorToken393;
 queueMicrotask(()=>alignHome393(kind,token));requestAnimationFrame(()=>requestAnimationFrame(()=>alignHome393(kind,token)));return token
}`,'r388');
js=replaceNamed(js,A388,'renderHistory',`function renderHistory(kind){
 const wanted=kind==='episodes'?'series':'movies',view=q('[data-home-view="'+wanted+'"]'),old=q(':scope > [data-ct388-history="'+kind+'"]',view);if(!view||!old)return false;
 const keep=routeNow()==='home'&&activeKind()===wanted&&!homeUserMoved393;
 const t=document.createElement('template');t.innerHTML=historySection(kind);old.replaceWith(t.content.firstElementChild);homeForceOrder500(wanted);
 if(keep)requestAnimationFrame(()=>alignHome393(wanted,homeAnchorToken393));return true
}`,'r388');
js=replaceNamed(js,A388,'renderSeries',`function renderSeries(){
 const view=q('[data-home-view="series"]');if(!view)return false;
 qa(':scope > [data-ct399-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 const s=rows(hSeries),counts=window.__ctR492SeriesCounts||{},limit=Math.max(24,Math.min(250,Number(document.documentElement.dataset.ct492SeriesLimit||24)||24)),defs=[['continue','Continuar assistindo',s.filter(x=>x.home_bucket==='continue')],['dust','Juntando poeira',s.filter(x=>x.home_bucket==='dust')],['up_to_date','Em dia',s.filter(x=>x.home_bucket==='up_to_date')],['not_started','Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],['completed','Concluídas',s.filter(x=>x.home_bucket==='completed')]];
 const html=defs.map(([bucket,title,list])=>{let section=seriesSection(title,list),total=Math.max(list.length,Number(counts?.[bucket]||0));if(total>list.length&&list.length>=limit){const more='<div class="ct492-more-wrap"><button type="button" class="chip ct492-more" data-ct492-series-more="'+bucket+'">Carregar mais · '+list.length.toLocaleString('pt-BR')+' de '+total.toLocaleString('pt-BR')+'</button></div>';section=section.replace(/<\\/section>\\s*$/,more+'</section>')}return section}).join('');
 const history=q(':scope > [data-ct388-history="episodes"]',view);if(history)history.insertAdjacentHTML('afterend',html);else view.insertAdjacentHTML('beforeend',html);
 homeForceOrder500('series');document.documentElement.dataset.ct388Series=String(s.length);scheduleHome393('series',false);return true
}`,'r388');
js=replaceNamed(js,A388,'movieRow',`function movieRow(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 const tmdb=Number(y?.tmdb_id||y?.raw_tmdb?.id||0)||0,p=String(y?.poster_path||y?.raw_tmdb?.poster_path||''),src=p?(p.startsWith('http')?p:img(p,'w342')):'',meta=typeof ct274MovieMeta==='function'?ct274MovieMeta(y):[y?.release_year||'',y?.runtime_minutes?y.runtime_minutes+' min':''].filter(Boolean).join(' · ');
 let action='';try{action=ct274MovieWatchAction(y)||''}catch{}
 return '<article class="ct500-movie-card" data-ct388-movie-id="'+mediaId(y)+'" data-media="movie:'+tmdb+'"><button type="button" class="ct500-movie-open" data-media="movie:'+tmdb+'"><div class="poster"'+(src?' style="background-image:url(\\''+esc(src)+'\\')"':'')+'></div><div class="card-body"><b>'+esc(titleOf(y))+'</b><small>'+esc(meta)+'</small></div></button>'+action+'</article>'
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
 homeForceOrder500('movies');sec.dataset.ct388Rendered=String(movieNodes.size);document.documentElement.dataset.ct388Movies=String(movieNodes.size);scheduleHome393('movies',false);return true
}`,'r388');
js=replaceNamed(js,A388,'frame',`function frame(){
 return '<div class="home-tabs"><button type="button" class="chip active" data-home-tab="series">Séries</button><button type="button" class="chip" data-home-tab="movies">Filmes</button></div>'+
 '<div data-home-view="series" class="home-list">'+historySection('episodes')+(hSeries.length?'':'<section class="home-section" data-ct388-series-loading><div class="panel-head"><h3>Continuar assistindo</h3><small>…</small></div><div class="stack"><div class="empty">Carregando séries…</div></div></section>')+'</div>'+
 '<div data-home-view="movies" class="home-list hidden">'+historySection('movies')+movieSection()+'</div>'
}`,'r388');

const A321="window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity';";
js=replaceNamed(js,A321,'topRaw321',`async function topPage500(provider,type,page){
 if(testBridge?.topPage)return dedupe321(await testBridge.topPage(provider,type,page));
 const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false,page};
 return tmdbPage321(type==='movie'?'/discover/movie':'/discover/tv',common,type)
}
async function topEligible500(provider,type,force=false){
 const sk='ct500:top10:'+String(typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10))+':'+String(provider)+':'+type;
 if(!force)try{const c=JSON.parse(sessionStorage.getItem(sk)||'null');if(Array.isArray(c)&&c.length===10)return c}catch{}
 const out=[],seen=new Set();let empty=0;
 for(let start=1;start<=50&&out.length<10;start+=5){
  const pages=[start,start+1,start+2,start+3,start+4].filter(x=>x<=50),got=await Promise.all(pages.map(p=>topPage500(provider,type,p))),batch=[];
  for(const list of got)for(const x of rows(list)){const k=keyOf(x);if(!validKey(k)||seen.has(k))continue;seen.add(k);batch.push(x)}
  if(!batch.length){empty++;if(empty>=2)break;continue}empty=0;
  const a=await exact321(batch);for(const x of batch){if(!a.blocked.has(keyOf(x)))out.push(x);if(out.length>=10)break}
 }
 const final=out.slice(0,10);try{if(final.length===10)sessionStorage.setItem(sk,JSON.stringify(final))}catch{}return final
}
async function topRaw321(provider,force=false){
 if(testBridge?.top)return testBridge.top(provider,force);
 const key=String(provider),hit=topCache.get(key);if(!force&&hit&&Date.now()-hit.at<STALE&&hit.rows?.movies?.length===10&&hit.rows?.series?.length===10)return hit.rows;
 const [movies,series]=await Promise.all([topEligible500(provider,'movie',force),topEligible500(provider,'tv',force)]),data={movies,series,__ct500Eligible:true};topCache.set(key,{at:Date.now(),rows:data});return data
}
try{window.__ctR500TopTest={eligible:topEligible500}}catch{}`,'r321');
js=replaceNamed(js,A321,'paintTop321',`async function paintTop321(provider,token,force=false){
 const content=q('[data-ct321-top-content]');if(!content||token!==topToken||String(discover?.tab)!=='top10')return false;
 try{
  const raw=await topRaw321(provider,force);if(token!==topToken||String(discover?.tab)!=='top10')return false;
  const movies=rows(raw?.movies).slice(0,10),series=rows(raw?.series).slice(0,10);
  let name='Streaming';try{name=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider))?.provider_name||name}catch{}
  content.innerHTML='<div class="ct288-top-name"><b>'+esc(name)+'</b></div><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>'+series.length+'</small></div><div class="ct319-top-row">'+(series.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem séries elegíveis neste streaming.</div>')+'</div></section><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>'+movies.length+'</small></div><div class="ct319-top-row">'+(movies.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem filmes elegíveis neste streaming.</div>')+'</div></section>';
  loaded321();document.documentElement.dataset.ct500Top10=String(series.length)+':'+String(movies.length);return true
 }catch(e){content.innerHTML='<div class="empty">'+esc(e?.message||'Não foi possível carregar o Top 10 agora.')+'</div>';loaded321();return false}
}`,'r321');

js=js.replace(/const REVISION='[^']+';/,"const REVISION='r500-official-0.3.27';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.27 • ${REVISION}');
js+='\nwindow.__ctR500Marker="real-history-anchor+isolated-movie-2x3+adaptive-top10-10x10";\nwindow.__ctR500={version:"0.3.27",scope:"home-series-movies+discover-top10"};\n';
html=html.replaceAll('app-v499.js?ct=r499-official-0.3.26','app-v500.js?ct=r500-official-0.3.27').replaceAll('app-v499.css?ct=r499-official-0.3.26','app-v500.css?ct=r500-official-0.3.27').replaceAll('r499-official-0.3.26','r500-official-0.3.27');
css+='\n/* CineTracker Web 0.3.27 r500 — real populated-history anchor + isolated poster geometry + adaptive Top 10. */\n'+
'html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid{display:grid!important;grid-template-columns:repeat(auto-fill,150px)!important;grid-auto-flow:row!important;gap:14px!important;align-items:start!important;justify-content:start!important;width:100%!important;overflow:visible!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-card{position:relative!important;display:block!important;box-sizing:border-box!important;width:150px!important;min-width:150px!important;max-width:150px!important;height:225px!important;min-height:225px!important;max-height:225px!important;aspect-ratio:auto!important;padding:0!important;margin:0!important;overflow:hidden!important;border-radius:12px!important;background:#07131d!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-open{position:absolute!important;inset:0!important;display:block!important;width:150px!important;height:225px!important;min-width:150px!important;max-width:150px!important;min-height:225px!important;max-height:225px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;color:inherit!important;text-align:left!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-card .poster{position:absolute!important;inset:0!important;display:block!important;width:150px!important;height:225px!important;min-width:150px!important;max-width:150px!important;min-height:225px!important;max-height:225px!important;aspect-ratio:auto!important;border-radius:0!important;background-size:cover!important;background-position:center!important;object-fit:cover!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-card .card-body{position:absolute!important;z-index:2!important;left:0!important;right:0!important;bottom:0!important;padding:42px 8px 8px!important;background:linear-gradient(180deg,transparent,rgba(3,10,15,.96))!important;pointer-events:none!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-card .card-body b,html body [data-home-view="movies"] .ct500-movie-card .card-body small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-card>[data-ct266-watch],html body [data-home-view="movies"] .ct500-movie-card>[data-ct279-watch],html body [data-home-view="movies"] .ct500-movie-card>.ct266-watch-action,html body [data-home-view="movies"] .ct500-movie-card>.ct279-watch-button{position:absolute!important;z-index:5!important;top:7px!important;right:7px!important;margin:0!important;width:32px!important;min-width:32px!important;height:32px!important;min-height:32px!important;padding:0!important;border-radius:10px!important}\n'+
'@media(max-width:720px){html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}html body [data-home-view="movies"] .ct500-movie-card,html body [data-home-view="movies"] .ct500-movie-open,html body [data-home-view="movies"] .ct500-movie-card .poster{width:100%!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important}}\n';
sw=sw.replaceAll('ct-media-r499','ct-media-r500').replaceAll('app-v499.js','app-v500.js').replaceAll('app-v499.css','app-v500.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.27',revision:'r500-official-0.3.27',base:'r499-scoped-stable',scope:'home-real-hidden-history+movie-isolated-2x3+top10-adaptive-10x10',home_series:'History stays physically before Continue and populated-history hydration reanchors the actual scroll container instead of window-only assumptions',home_movies:'Movies watched stays above Watchlist; Watchlist card is isolated from generic .card CSS and is explicitly 150x225 on desktop',discover_foryou:'v498 preserved unchanged',top10:'adaptive 5-page batches continue up to page 50 until 10 eligible series and 10 eligible movies are found after personal filtering; final eligible sets are cached',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v500.js'),js),writeFile(resolve(dist,'app-v500.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v499.js'),{force:true}),rm(resolve(dist,'app-v499.css'),{force:true})]);
for(const need of ['window.__ctR500Marker="real-history-anchor+isolated-movie-2x3+adaptive-top10-10x10"','homeScrollRoot500','ct500-movie-card','topEligible500','start<=50','r500-official-0.3.27'])if(!js.includes(need))throw new Error('r500 missing '+need);
console.log('WEB_R500_READY scoped real fixes');
