import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r477.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v477.js'),'utf8'),
 readFile(resolve(dist,'app-v477.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r478 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r478 invalid '+label+' bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r478 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}

/* HOME: r388 only owns the frame/history. r399 owns live Series v452 and Movies v405.
   Avoid full shell replacement and stale v391/v393 repaint on first entry. */
js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 [`async function renderHome388(){
 const kind=activeKind();try{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{};paintFrame(kind);scheduleHome393(kind,true);
 const critical=[loadSeries(false),loadHistory(false)];if(kind==='movies')critical.push(loadMovies(false));
 await Promise.allSettled(critical);
 if(routeNow()!=='home')return false;
 renderSeries();if(hHistory){renderHistory('episodes');renderHistory('movies')}if(kind==='movies'&&hMovies.length)renderMoviesAll();scheduleHome393(kind,false);
 if(kind!=='movies'&&!hMovies.length)setTimeout(()=>{if(!hMovies.length)void loadMovies(false)},250);
 document.documentElement.dataset.ct388Home='authoritative-ready';document.documentElement.dataset.ct392HomeReady='1';document.documentElement.dataset.ct393HomeReady='1';return true
}`,
 `async function renderHome388(){
 const kind=activeKind();
 try{if(!q('[data-home]'))setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{}
 paintFrame(kind);scheduleHome393(kind,true);
 try{window.__ctR399?.enterHome?.(kind)}catch{}
 await Promise.allSettled([loadHistory(false)]);
 if(routeNow()!=='home')return false;
 if(hHistory){renderHistory('episodes');renderHistory('movies')}
 try{if(kind==='series')window.__ctR399?.renderSeries?.();else window.__ctR399?.renderMovies?.()}catch{}
 scheduleHome393(kind,false);
 document.documentElement.dataset.ct388Home='authoritative-ready';document.documentElement.dataset.ct392HomeReady='1';document.documentElement.dataset.ct393HomeReady='1';return true
}`,
 'single frame/history owner']
],'r388');

/* r477 Home boot becomes single-flight enough to prevent first-entry shell churn. */
js=patchRuntime(js,"if(window.__ctR477?.version==='1.0.267')return;",[
 ["let homeRun=0;","let homeRun=0,lastHomeBootKind='',lastHomeBootAt=0;",'home guard state'],
 [`function bootHome(kind='series'){
 if(!(routeNow()==='home'||homeLocation()))return false;
 const run=++homeRun,k=kind==='movies'?'movies':'series';
 delete document.documentElement.dataset.ct413HomeEntering;
 delete document.documentElement.dataset.ct415HomeEntering;
 try{if(!q('[data-home]'))core.ensureHomeShell?.()}catch{}
 try{if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]'))void window.__ctR388?.renderHome?.()}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 try{window.__ctR476?.primeHome?.(k)}catch{}
 for(const ms of [60,160,360,700])setTimeout(()=>{if(run!==homeRun||!(routeNow()==='home'||homeLocation()))return;try{window.__ctR399?.enterHome?.(k)}catch{}},ms);
 return true;
}`,
 `function bootHome(kind='series'){
 if(!(routeNow()==='home'||homeLocation()))return false;
 const k=kind==='movies'?'movies':'series',now=Date.now();
 if(lastHomeBootKind===k&&now-lastHomeBootAt<500&&q('[data-home-view="'+k+'"]'))return true;
 lastHomeBootKind=k;lastHomeBootAt=now;const run=++homeRun;
 delete document.documentElement.dataset.ct413HomeEntering;
 delete document.documentElement.dataset.ct415HomeEntering;
 try{if(!q('[data-home]'))core.ensureHomeShell?.()}catch{}
 let task=null;try{if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]'))task=window.__ctR388?.renderHome?.()}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 try{window.__ctR476?.primeHome?.(k)}catch{}
 Promise.resolve(task).finally(()=>{if(run!==homeRun||!(routeNow()==='home'||homeLocation()))return;try{window.__ctR399?.enterHome?.(k)}catch{}});
 return true;
}`,
 'stable Home boot']
],'r477');

/* PRA VOCE: strict user evidence filters + one load at a time + rotating non-daily slots. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 ["const name=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';",
  "const name=group==='watch'?'cinetracker_discover_watch_smart_v476':'cinetracker_discover_fresh_v476';",
  'strict pool authorities'],
 ["if(loadTask&&!force)return loadTask;","if(loadTask)return loadTask;",'single flight'],
 ["if(token!==loadToken||routeNow()!=='discover')return false;state=next;chooseDaily();render();",
  `if(token!==loadToken||routeNow()!=='discover')return false;state=next;chooseDaily();
  let cycle=1;try{cycle=(Number(sessionStorage.getItem('ct478:foryou-cycle')||0)+1)%100000;sessionStorage.setItem('ct478:foryou-cycle',String(cycle))}catch{cycle=Date.now()%100000}
  ['movie','series','anime'].forEach((k,i)=>{const w=rows(state.watch[k]),f=rows(state.fresh[k]);if(w.length)state.idx.watch[k]=(cycle+i*3)%w.length;if(f.length)state.idx.fresh[k]=(cycle+i*5+1)%f.length});
  render();`,
  'rotate eligible slots'],
 ["for(const ms of [0,250,800,1800])setTimeout(()=>{if(isForYou())activate()},ms);",
  "setTimeout(()=>{if(isForYou())activate()},0);",
  'single startup activation']
],'r464');

/* PROFILE: summary/history semantics are separated from favorites/watchlist.
   Movies full-screen gets History/Watchlist tabs; summary remains recent history only. */
js=patchRuntime(js,"if(window.__ctR476?.version==='1.0.266')return;",[
 ["let profile=null,profileTask=null,profileSeq=0,allSeq=0;",
  "let profile=null,profileTask=null,profileSeq=0,allSeq=0,movieWatchlist=[],movieWatchTask=null;",
  'movie Watchlist state'],
 ["const listFor=key=>key==='series'?rows(profile?.series):key==='movies'?rows(profile?.movies):key==='seriesFav'?rows(profile?.series_favorites):key==='movieFav'?rows(profile?.movie_favorites):rows(profile?.actors);",
  `const seriesHistory=()=>rows(profile?.series).filter(x=>Number(x?.watched_episodes||0)>0&&!!x?.last_watched_at);
const movieHistory=()=>rows(profile?.movies).filter(x=>!!x?.last_watched_at);
const listFor=key=>key==='series'?seriesHistory():key==='movies'?movieHistory():key==='seriesFav'?rows(profile?.series_favorites):key==='movieFav'?rows(profile?.movie_favorites):rows(profile?.actors);`,
  'history-only summary lists'],
 [`function closeAll(){q('[data-ct476-all-screen]')?.remove();allSeq++}
function openAll(key){
 const data=listFor(key);closeAll();const seq=++allSeq,back=document.createElement('div');back.className='ct476-all-screen';back.dataset.ct476AllScreen=key;
 back.innerHTML='<section class="ct476-all-panel" role="dialog" aria-modal="true"><header><div><small>PERFIL</small><h2>'+esc(labels[key])+'</h2><p>'+data.length.toLocaleString('pt-BR')+' itens</p></div><button type="button" class="btn" data-ct476-all-close>✕ Fechar</button></header><div class="ct476-all-grid" data-ct476-all-grid></div></section>';
 document.body.appendChild(back);const grid=q('[data-ct476-all-grid]',back);let i=0;
 const paint=()=>{
  if(seq!==allSeq||!back.isConnected)return;
  const end=Math.min(data.length,i+36),frag=document.createDocumentFragment();
  for(;i<end;i++){const t=document.createElement('template');t.innerHTML=renderCard(key,data[i]).trim();if(t.content.firstElementChild)frag.appendChild(t.content.firstElementChild)}
  grid.appendChild(frag);if(i<data.length)requestAnimationFrame(paint);
 };
 requestAnimationFrame(paint);q('[data-ct476-all-close]',back)?.focus();return true;
}`,
 `function closeAll(){q('[data-ct476-all-screen]')?.remove();allSeq++}
async function loadMovieWatchlist(force=false){
 if(movieWatchTask&&!force)return movieWatchTask;
 movieWatchTask=(async()=>{const out=[],seen=new Set();let offset=0,total=Infinity;
  for(let page=0;page<50&&offset<total;page++){
   const raw=await core.rpc('cinetracker_home_movies_v405',{p_limit:120,p_offset:offset}),payload=raw?.data??raw??{},batch=rows(payload?.rows);
   total=Math.max(Number(payload?.count||0)||0,offset+batch.length);
   for(const x of batch){const id=String(x?.media_id||x?.id||x?.tmdb_id||'');if(id&&!seen.has(id)){seen.add(id);out.push(x)}}
   if(!batch.length)break;offset+=batch.length;if(batch.length<120&&offset>=total)break;
  }
  movieWatchlist=out;return out;
 })().catch(e=>{document.documentElement.dataset.ct478MovieWatchlistError=String(e?.message||e);return movieWatchlist}).finally(()=>{movieWatchTask=null});
 return movieWatchTask;
}
function fullData(key,mode='history'){return key==='movies'&&mode==='watchlist'?movieWatchlist:listFor(key)}
function paintAllGrid(back,key,mode='history'){
 const data=fullData(key,mode),grid=q('[data-ct476-all-grid]',back),count=q('[data-ct478-all-count]',back);if(!grid)return false;
 if(count)count.textContent=data.length.toLocaleString('pt-BR')+' itens';
 grid.replaceChildren();const seq=++allSeq;let i=0;
 const paint=()=>{if(seq!==allSeq||!back.isConnected)return;const end=Math.min(data.length,i+36),frag=document.createDocumentFragment();
  for(;i<end;i++){const t=document.createElement('template');t.innerHTML=renderCard(key,data[i]).trim();if(t.content.firstElementChild)frag.appendChild(t.content.firstElementChild)}
  grid.appendChild(frag);if(i<data.length)requestAnimationFrame(paint);
 };
 requestAnimationFrame(paint);return true;
}
function setMovieMode(back,mode){
 const m=mode==='watchlist'?'watchlist':'history';back.dataset.ct478MovieMode=m;
 qa('[data-ct478-movie-mode]',back).forEach(b=>{const on=String(b.dataset.ct478MovieMode)===m;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 paintAllGrid(back,'movies',m);return true;
}
async function switchMovieMode(mode){
 const back=q('[data-ct476-all-screen="movies"]');if(!back)return false;
 if(mode==='watchlist'){const grid=q('[data-ct476-all-grid]',back);if(grid)grid.innerHTML='<div class="empty">Carregando Watchlist…</div>';await loadMovieWatchlist(false);if(!back.isConnected)return false}
 return setMovieMode(back,mode);
}
function openAll(key){
 const data=listFor(key);closeAll();const back=document.createElement('div');back.className='ct476-all-screen';back.dataset.ct476AllScreen=key;
 const tabs=key==='movies'?'<div class="ct478-movie-tabs" role="tablist" aria-label="Filmes"><button type="button" class="chip active" role="tab" aria-selected="true" data-ct478-movie-mode="history">Histórico</button><button type="button" class="chip" role="tab" aria-selected="false" data-ct478-movie-mode="watchlist">Watchlist</button></div>':'';
 back.innerHTML='<section class="ct476-all-panel" role="dialog" aria-modal="true"><header><div><small>PERFIL</small><h2>'+esc(labels[key])+'</h2><p data-ct478-all-count>'+data.length.toLocaleString('pt-BR')+' itens</p>'+tabs+'</div><button type="button" class="btn" data-ct476-all-close>✕ Fechar</button></header><div class="ct476-all-grid" data-ct476-all-grid></div></section>';
 document.body.appendChild(back);paintAllGrid(back,key,'history');if(key==='movies')void loadMovieWatchlist(false);q('[data-ct476-all-close]',back)?.focus();return true;
}`,
  'full list tabs'],
 [`window.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct476-header-more]');
 if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openAll(String(b.dataset.ct476HeaderMore||''));return}
 if(e.target?.closest?.('[data-ct476-all-close]')||e.target?.matches?.('[data-ct476-all-screen]')){e.preventDefault();closeAll();return}
 if(e.target?.closest?.('[data-nav="profile"]')){profile=null;setTimeout(()=>scheduleProfile(true),0)}
},true);`,
 `window.addEventListener('click',e=>{
 const mode=e.target?.closest?.('[data-ct478-movie-mode]');
 if(mode){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void switchMovieMode(String(mode.dataset.ct478MovieMode||'history'));return}
 const b=e.target?.closest?.('[data-ct476-header-more]');
 if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openAll(String(b.dataset.ct476HeaderMore||''));return}
 if(e.target?.closest?.('[data-ct476-all-close]')||e.target?.matches?.('[data-ct476-all-screen]')){e.preventDefault();closeAll();return}
 if(e.target?.closest?.('[data-nav="profile"]')){profile=null;movieWatchlist=[];setTimeout(()=>scheduleProfile(true),0)}
},true);`,
 'full list tab click'],
 ["window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile'){profile=null;scheduleProfile(true)}});",
  "window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile'){profile=null;movieWatchlist=[];scheduleProfile(true)}});",
  'profile invalidation'],
 ["window.__ctR476={version:'1.0.266',scope:'home+discover-foryou+profile-lists',primeHome,loadProfile,paintProfile,openAll};",
  "window.__ctR476={version:'1.0.266',scope:'home+discover-foryou+profile-lists',primeHome,loadProfile,paintProfile,openAll,loadMovieWatchlist,switchMovieMode};",
  'profile api']
],'r476');

js+='\n'+"/* CineTracker Web 1.0.268 r478 — stable Home first paint, strict Pra Você and history-only Profile lists. */\n(()=>{\n'use strict';\nif(window.__ctR478?.version==='1.0.268')return;\nwindow.__ctR478Marker='home-single-first-paint+discover-v476-strict-rotation+profile-history-only+movies-history-watchlist-tabs';\nwindow.__ctR478={version:'1.0.268',scope:'home+discover-foryou+profile-history-lists'};\n})();\n"+'\n';

html=html.replaceAll('app-v477.js','app-v478.js').replaceAll('app-v477.css','app-v478.css').replaceAll('v1.0.267','v1.0.268').replaceAll('r477-official-1.0.267','r478-official-1.0.268');
css+='\n/* CineTracker Web 1.0.268 r478 — stable Home, strict recommendations, history-only Profile. */\n'+
'.ct478-movie-tabs{display:flex;gap:8px;margin-top:12px}.ct478-movie-tabs .chip.active{font-weight:800}.ct476-all-grid>.empty{grid-column:1/-1}\n';
sw=sw.replaceAll('app-v477.js','app-v478.js').replaceAll('app-v477.css','app-v478.css').replaceAll('ct-web-1.0.267-r477','ct-web-1.0.268-r478');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.268',revision:'r478-official-1.0.268',base:'r477+r478-stability',
 scope:'home-stable-first-paint+discover-strict-rotation+profile-history-only+movie-history-watchlist-tabs',
 home_series:'r388 no longer replaces an existing Home shell or races legacy v391 Series against r399/v452; first paint is stable and History loads independently',
 home_movies:'r388 no longer races legacy v393 against r399/v405; Watchlist remains compact and canonical',
 discover_foryou:'r464 uses strict v476 fresh pools and smart unseen Watchlist pools; non-daily slots rotate per successful open while Daily remains daily',
 profile_lists:'Series and Movies summaries/full lists are history-only; Favorites and Actors stay category-pure; exactly 12 summary cards',
 profile_movies:'Movies full screen opens on History and provides History/Watchlist tabs; Watchlist pages through v405 only when needed',
 sports:'r477 preserved',f1:'r477/r462 preserved',history:'daily v426 preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v478.js'),js),writeFile(resolve(dist,'app-v478.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v477.js'),{force:true}),rm(resolve(dist,'app-v477.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r478 missing runtime '+anchor);return js.slice(start,close+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");
if(r388.includes('const critical=[loadSeries(false),loadHistory(false)]')||r388.includes("try{setApp(shell('Home'"))throw new Error('r478 Home legacy repaint still active');
if(!r464.includes('cinetracker_discover_watch_smart_v476')||!r464.includes('cinetracker_discover_fresh_v476')||!r464.includes("ct478:foryou-cycle")||r464.includes("if(loadTask&&!force)return loadTask"))throw new Error('r478 strict rotating Discover missing');
for(const need of ['const LIMIT=12','seriesHistory=()=>','movieHistory=()=>','cinetracker_home_movies_v405','data-ct478-movie-mode="history"','data-ct478-movie-mode="watchlist"'])if(!r476.includes(need))throw new Error('r478 Profile missing '+need);
if(!r477.includes('now-lastHomeBootAt<500'))throw new Error('r478 Home boot guard missing');
const r478=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.268 r478'));for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(r478.includes(bad))throw new Error('r478 forbidden '+bad);
if(!js.includes("window.__ctR478Marker='home-single-first-paint+discover-v476-strict-rotation+profile-history-only+movies-history-watchlist-tabs'"))throw new Error('r478 marker missing');
console.log('WEB_R478_READY');
