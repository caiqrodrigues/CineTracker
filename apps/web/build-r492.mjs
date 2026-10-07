import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r491.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v491.js'),'utf8'),readFile(resolve(dist,'app-v491.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r492-final.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r492 missing '+label+' anchor '+anchor);const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r492 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r492 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r492 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
function legacyRuntimeAnchor(n){
 const needles=[
  'window.__ctR'+n+'={',
  'window.__ctR'+n+' = {',
  'window.__ctR'+n+'Marker=',
  'window.__ctR'+n+'Marker ='
 ];
 for(const needle of needles){const at=js.indexOf(needle);if(at>=0)return at}
 return -1;
}
function rootIifeStart(source,at){
 let start=source.lastIndexOf('\n(()=>{',at);
 if(start>=0)return start+1;
 return source.startsWith('(()=>{')?0:-1;
}
function disableRuntime(n){
 const at=legacyRuntimeAnchor(n);
 if(at<0){console.log('WEB_R492_LEGACY_ABSENT r'+n);return false}
 const start=rootIifeStart(js,at),close=js.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r492 invalid legacy runtime r'+n);
 if(js.startsWith('(()=>{return;',start))return true;
 js=js.slice(0,start)+'(()=>{return;'+js.slice(start+6);
 return true;
}
const retired=[380,381,382,383,384,385,386,389,390,391,392,393,394,395,396,397,398,400,401,402,403,404,405,406,407,408,410,411,412,414,427,429,430,431,432,434,445,449,456,457,458,459,460,461,467,468,469,470,481,482,484,488,489];
for(const n of retired)disableRuntime(n);
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'renderSeries',"function renderSeries(){\n const view=q('[data-home-view=\"series\"]');if(!view)return false;\n qa(':scope > [data-ct399-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());\n const s=rows(hSeries),counts=window.__ctR492SeriesCounts||{},defs=[\n  ['continue','Continuar assistindo',s.filter(x=>x.home_bucket==='continue')],\n  ['dust','Juntando poeira',s.filter(x=>x.home_bucket==='dust')],\n  ['up_to_date','Em dia',s.filter(x=>x.home_bucket==='up_to_date')],\n  ['not_started','Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],\n  ['completed','Concluídas',s.filter(x=>x.home_bucket==='completed')]\n ];\n const html=defs.map(([bucket,title,list])=>{\n  let section=seriesSection(title,list),total=Math.max(list.length,Number(counts?.[bucket]||0));\n  if(total>list.length){\n   const more='<div class=\"ct492-more-wrap\"><button type=\"button\" class=\"chip ct492-more\" data-ct492-series-more=\"'+bucket+'\">Carregar mais · '+list.length.toLocaleString('pt-BR')+' de '+total.toLocaleString('pt-BR')+'</button></div>';\n   section=section.replace(/<\\/section>\\s*$/,more+'</section>');\n  }\n  return section;\n }).join('');\n const history=q(':scope > [data-ct388-history=\"episodes\"]',view);\n if(history)history.insertAdjacentHTML('beforebegin',html);else view.insertAdjacentHTML('beforeend',html);\n document.documentElement.dataset.ct388Series=String(s.length);return true;\n}",'r388');
js=replaceNamed(js,A388,'refreshTv391',"async function refreshTv391(force=false){\n if(refreshTvTask391)return refreshTvTask391;const key='ct492:tv-refresh-at',now=Date.now();\n try{if(!force&&now-Number(sessionStorage.getItem(key)||0)<10*60*1000)return{skipped:true};sessionStorage.setItem(key,String(now))}catch{}\n refreshTvTask391=(async()=>{try{\n  const base=supabaseUrl391();if(!base)return{skipped:true};\n  const r=await fetch(base+'/functions/v1/ct-refresh-tv-state-user',{method:'POST',headers:{...auth391(),'content-type':'application/json'},body:'{}'});\n  if(!r.ok)throw new Error('TV refresh '+r.status);const out=await r.json();\n  if(Number(out?.episodes_cached||0)>0||Number(out?.refreshed||0)>0){\n   const limit=Math.max(24,Math.min(250,Number(document.documentElement.dataset.ct492SeriesLimit||24)||24));\n   const raw=await timeout(rpc('cinetracker_home_series_v492',{p_today:today(),p_limit_per_bucket:limit}),6000);\n   const data=raw?.data??raw??{},full=mergeLogicalSeries(rows(data?.rows));\n   if(full.length){window.__ctR492SeriesCounts=data?.counts||{};hSeries=full;cacheSet(HS,hSeries);if(routeNow()==='home')renderSeries()}\n  }\n  return out||{};\n }catch(e){document.documentElement.dataset.ct492TvRefreshError=String(e?.message||e);return{failed:true}}finally{refreshTvTask391=null}})();\n return refreshTvTask391;\n}",'r388');
js=replaceNamed(js,A388,'loadSeries',"async function loadSeries(force=false){\n if(hSeriesTask&&!force)return hSeriesTask;const run=++hRun,limit=Math.max(24,Math.min(250,Number(document.documentElement.dataset.ct492SeriesLimit||24)||24));\n document.documentElement.dataset.ct492SeriesLimit=String(limit);document.documentElement.dataset.ct392LoadStage='series:'+run;\n hSeriesTask=(async()=>{try{\n  const raw=await timeout(rpc('cinetracker_home_series_v492',{p_today:today(),p_limit_per_bucket:limit}),6000),data=raw?.data??raw??{};\n  const full=mergeLogicalSeries(rows(data?.rows));if(run!==hRun)return hSeries;\n  window.__ctR492SeriesCounts=data?.counts||{};document.documentElement.dataset.ct492SeriesTotal=String(Number(data?.total||full.length));\n  if(full.length){hSeries=full;cacheSet(HS,hSeries);if(routeNow()==='home')renderSeries()}\n  if(!force){\n   const job=()=>{if(routeNow()==='home')void refreshTv391(false)};\n   if(typeof requestIdleCallback==='function')requestIdleCallback(job,{timeout:5000});else setTimeout(job,2500);\n  }\n  return hSeries;\n }catch(e){document.documentElement.dataset.ct492SeriesError=String(e?.message||e);return hSeries}\n finally{if(run===hRun)hSeriesTask=null}})();return hSeriesTask;\n}",'r388');
js=replaceNamed(js,A388,'renderMoviesAll',"function renderMoviesAll(addRows=null){\n const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;\n stack.classList.add('ct489-movie-grid','ct492-movie-grid');stack.style.removeProperty('display');stack.style.removeProperty('flex-direction');\n const append=Array.isArray(addRows),list=append?addRows:hMovies;\n if(!append){stack.replaceChildren();movieNodes=new Map()}\n const frag=document.createDocumentFragment();\n for(const x of rows(list)){const id=mediaId(x);if(!id||movieNodes.has(id))continue;const t=document.createElement('template');t.innerHTML=movieRow(x).trim();const node=t.content.firstElementChild;if(!node)continue;node.dataset.ct388MovieId=String(id);movieNodes.set(id,node);frag.appendChild(node)}\n if(frag.childNodes.length)stack.appendChild(frag);\n const ranks=new Map();sortedMovies().forEach((x,i)=>ranks.set(mediaId(x),i));for(const[id,node]of movieNodes)node.style.order=String(ranks.get(id)??999999);\n const total=Math.max(hMovies.length,Number(sec.dataset.ct492Total||0)),count=q('[data-ct388-movie-count]',sec);\n if(count)count.textContent=(hMovies.length<total?hMovies.length.toLocaleString('pt-BR')+' de ':'')+total.toLocaleString('pt-BR');\n let more=q('[data-ct492-movies-more]',sec);\n if(hMovies.length<total){\n  if(!more){const wrap=document.createElement('div');wrap.className='ct492-more-wrap';wrap.innerHTML='<button type=\"button\" class=\"chip ct492-more\" data-ct492-movies-more>Carregar mais filmes</button>';stack.insertAdjacentElement('afterend',wrap);more=q('[data-ct492-movies-more]',sec)}\n  if(more){more.disabled=false;more.textContent='Carregar mais filmes · '+hMovies.length.toLocaleString('pt-BR')+' de '+total.toLocaleString('pt-BR')}\n }else{more?.closest?.('.ct492-more-wrap')?.remove()}\n sec.dataset.ct388Rendered=String(movieNodes.size);document.documentElement.dataset.ct388Movies=String(movieNodes.size);return true;\n}",'r388');
js=replaceNamed(js,A388,'loadMovies',"async function loadMovies(force=false){\n if(hMoviesTask&&!force)return hMoviesTask;const run=++hMoviesRun,pageSize=60;\n hMoviesTask=(async()=>{try{\n  const page=async offset=>{const v=await timeout(rpc('cinetracker_home_movies_v405',{p_limit:pageSize,p_offset:offset}),6500),raw=v?.data??v??{};return{rows:rows(raw?.rows),count:Number(raw?.count||0)||0}};\n  const first=await page(0);if(run!==hMoviesRun)return hMovies;\n  hMovies=first.rows.filter(x=>String(x?.media_type||'movie')==='movie'&&mediaId(x)>0);const total=Math.max(first.count,hMovies.length),sec=q('[data-ct388-movie-watch]');if(sec)sec.dataset.ct492Total=String(total);\n  cacheSet(HM,hMovies);if(routeNow()==='home'&&activeKind()==='movies')renderMoviesAll();\n  window.__ctR492LoadMoreMovies=async()=>{\n   if(window.__ctR492MovieMoreBusy)return false;const currentTotal=Math.max(total,Number(q('[data-ct388-movie-watch]')?.dataset?.ct492Total||0));if(hMovies.length>=currentTotal)return true;\n   window.__ctR492MovieMoreBusy=true;const b=q('[data-ct492-movies-more]');if(b){b.disabled=true;b.textContent='Carregando…'}\n   try{\n    const next=await page(hMovies.length),seen=new Set(hMovies.map(x=>String(mediaId(x)))),added=[];\n    for(const x of next.rows){const id=String(mediaId(x));if(id&&id!=='0'&&!seen.has(id)){seen.add(id);hMovies.push(x);added.push(x)}}\n    cacheSet(HM,hMovies);if(routeNow()==='home'&&activeKind()==='movies')renderMoviesAll(added);\n    return true;\n   }catch(e){document.documentElement.dataset.ct492MoviesMoreError=String(e?.message||e);return false}\n   finally{window.__ctR492MovieMoreBusy=false;const btn=q('[data-ct492-movies-more]');if(btn)btn.disabled=false}\n  };\n  document.documentElement.dataset.ct492MoviesReady=String(hMovies.length)+'/'+String(total);return hMovies;\n }catch(e){document.documentElement.dataset.ct492MoviesError=String(e?.message||e);return hMovies}\n finally{if(run===hMoviesRun)hMoviesTask=null}})();return hMoviesTask;\n}",'r388');
js=replaceNamed(js,A388,'renderHome388',"async function renderHome388(){\n const kind=activeKind();try{if(!q('[data-home]'))setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home></div>'))}catch{}\n paintFrame(kind);scheduleHome393(kind,true);\n const critical=kind==='movies'?[loadHistory(false)]:[loadSeries(false),loadHistory(false)];\n if(kind==='movies')void loadMovies(false);\n await Promise.allSettled(critical);if(routeNow()!=='home')return false;\n if(kind==='series'&&hSeries.length)renderSeries();if(hHistory){renderHistory('episodes');renderHistory('movies')}if(kind==='movies'&&hMovies.length)renderMoviesAll();\n document.documentElement.dataset.ct388Home='r492-ready';return true;\n}",'r388');
const A455="if(window.__ctR455?.version==='1.0.245')return;";
js=replaceNamed(js,A455,'applyProfile455',"function applyProfile455(){return false}",'r455');
js=replaceNamed(js,A455,'scheduleProfile455',"function scheduleProfile455(){return false}",'r455');
new Function(runtime);js+='\n'+runtime+'\n';
html=html.replaceAll('app-v491.js','app-v492.js').replaceAll('app-v491.css','app-v492.css').replaceAll('v0.3.18','v0.3.19').replaceAll('r491-official-0.3.18','r492-official-0.3.19');
css+='\n/* CineTracker Web 0.3.19 r492 — retire legacy writers + progressive Home rendering. */\n';
sw=sw.replaceAll('ct-media-r491','ct-media-r492');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.19',revision:'r492-official-0.3.19',base:'r491+r492-writer-retirement',
 scope:'legacy-ui-iifes-retired+home-series-compact+movies-on-demand+single-profile+single-foryou',
 home_series:'v492 returns 24 items per bucket plus totals; Continue paints first and additional rows load only on explicit local action',
 home_movies:'v405 first page is 60 native 2:3 cards; remaining Watchlist pages load on demand without replacing the rendered grid',
 discover_foryou:'r464/v490 is the sole active recommendation owner; r380-r449 historical recommendation writers are inert',
 profile:'r491 core Profile is the sole active visual owner; r455 list repaint is disabled and r457-r461/r467-r470 are inert',
 legacy_retired:retired,
 service_worker:'network owns HTML/JS/CSS; only TMDB images cached',
 f1:'r462 and r477 F1 writer preserved',history:'r426 daily history/undo preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v492.js'),js),writeFile(resolve(dist,'app-v492.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v491.js'),{force:true}),rm(resolve(dist,'app-v491.css'),{force:true})]);
for(const n of retired){
 const at=legacyRuntimeAnchor(n);
 if(at<0)continue;
 const start=rootIifeStart(js,at);
 if(start<0||!js.startsWith('(()=>{return;',start))throw new Error('r492 active legacy r'+n);
}
for(const need of ["window.__ctR492Marker='legacy-writers-retired+series-compact-progressive+movies-paged-progressive+profile-single-owner+foryou-single-owner'",'cinetracker_home_series_v492','data-ct492-series-more','data-ct492-movies-more','p_limit:pageSize','renderProfile491(seq)','cinetracker_foryou_payload_v490'])if(!js.includes(need))throw new Error('r492 missing '+need);
console.log('WEB_R492_READY legacy writers retired and Home progressive');
