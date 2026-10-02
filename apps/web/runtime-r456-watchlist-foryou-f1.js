/* CineTracker Web 1.0.246 r456 — movie Watchlist, Pra Você and canonical F1 progress recovery. */
(()=>{'use strict';
if(window.__ctR456?.version==='1.0.246')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
const rpcCall=(n,a)=>{if(!authReady())return Promise.reject(new Error('auth-not-ready'));return Promise.resolve(rpc(n,a))};
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?unwrap(v[0]):v?.data?unwrap(v.data):v;
const idle=fn=>typeof requestIdleCallback==='function'?requestIdleCallback(()=>fn(),{timeout:100}):setTimeout(()=>requestAnimationFrame(fn),0);
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

let movieTask=null,movieRun=0,movieRows=[],movieTotal=0;
function movieKey(x){return String(x?.media_id||x?.tmdb_id||x?.id||'')}
function movieSection456(){
 return '<section class="home-section" data-ct456-movie-watch><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><small data-ct456-movie-count>…</small></div><div class="stack ct456-movie-stack"></div></section>';
}
function movieHost456(){
 const view=q('[data-home-view="movies"]');if(!view)return null;
 let sec=q(':scope>[data-ct456-movie-watch],:scope>[data-ct404-movie-watch],:scope>[data-ct388-movie-watch]',view);
 if(!sec){view.insertAdjacentHTML('beforeend',movieSection456());sec=q(':scope>[data-ct456-movie-watch]',view)}
 if(!q('.ct456-movie-stack',sec)){const old=q('.ct388-movie-stack,.stack',sec);if(old)old.classList.add('ct456-movie-stack')}
 return sec;
}
function movieHtml456(x){
 const y={...x,media_type:'movie',runtime_minutes:Number(x?.runtime_minutes||0)||0};
 try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''})}catch{}
 return '<div class="media-row" data-media-id="'+esc(y.media_id||'')+'"><b>'+esc(y.title||'Sem título')+'</b></div>';
}
function appendMovieNodes456(items,reset=false){
 const sec=movieHost456(),stack=q('.ct456-movie-stack',sec);if(!sec||!stack)return false;
 if(reset)stack.replaceChildren();
 const count=q('[data-ct456-movie-count],[data-ct404-movie-count]',sec);if(count)count.textContent=String(movieTotal||movieRows.length);
 let i=0,token=movieRun;
 const paint=()=>{if(token!==movieRun||routeNow()!=='home')return;const frag=document.createDocumentFragment(),end=Math.min(items.length,i+12);for(;i<end;i++){const t=document.createElement('template');t.innerHTML=String(movieHtml456(items[i])||'').trim();if(t.content.firstElementChild)frag.appendChild(t.content.firstElementChild)}stack.appendChild(frag);if(i<items.length)idle(paint)};
 if(!items.length&&reset)stack.innerHTML='<div class="empty">Nenhum item.</div>';else idle(paint);
 return true;
}
async function moviePage456(offset,limit=120){
 const p=unwrap(await timeout(rpcCall('cinetracker_home_movies_v405',{p_limit:limit,p_offset:offset}),7000))||{};
 return{rows:rows(p.rows),count:Math.max(Number(p.count||0)||0,rows(p.rows).length)};
}
async function loadMovies456(force=false){
 if(routeNow()!=='home'||!authReady())return false;if(movieTask&&!force)return movieTask;const run=++movieRun;
 movieTask=(async()=>{try{
  const first=await moviePage456(0,120);if(run!==movieRun)return false;
  movieRows=first.rows;movieTotal=first.count;appendMovieNodes456(movieRows,true);
  const pages=Math.min(50,Math.ceil(movieTotal/120)),known=new Set(movieRows.map(movieKey));
  for(let p=1;p<pages;p+=3){
   const batch=await Promise.allSettled([p,p+1,p+2].filter(x=>x<pages).map(x=>moviePage456(x*120,120)));
   if(run!==movieRun)return false;const added=[];
   for(const b of batch)if(b.status==='fulfilled')for(const item of b.value.rows){const k=movieKey(item);if(k&&!known.has(k)){known.add(k);movieRows.push(item);added.push(item)}}
   if(added.length)appendMovieNodes456(added,false);
  }
  document.documentElement.dataset.ct456Movies=String(movieRows.length);return true;
 }catch(e){const sec=movieHost456(),stack=q('.ct456-movie-stack',sec);if(stack)stack.innerHTML='<div class="empty">Falha ao carregar Watchlist.</div>';document.documentElement.dataset.ct456MoviesError=String(e?.message||e);return false}
 finally{if(run===movieRun)movieTask=null}})();return movieTask;
}

let fyTask=null,fyRun=0,fy={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
const fyLocks=new Set(),fyExcluded=new Map();
function mediaKey456(x){const id=Number(x?.tmdb_id||x?.id||0);if(!id)return'';return String(x?.media_type||x?.media_kind)==='movie'?'movie:'+id:'tv:'+id}
function fyRoot456(){const a=qa('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]');return a.find(x=>{try{return x.isConnected&&getComputedStyle(x).display!=='none'&&x.getClientRects().length}catch{return false}})||a.at(-1)||null}
function forYouActive456(){if(routeNow()!=='discover')return false;const s=window.__ctR288R263?.discover263;if(s&&String(s.tab||'')==='foryou')return true;const a=q('[data-ct319-tab="foryou"].active,[data-ct263-tab="foryou"].active,[data-discover-tab="foryou"].active,[aria-selected="true"][data-ct319-tab="foryou"]');return!!a}
function current456(n){if(n==='daily')return fy.daily[0]||null;const[b,k]=n.split(':'),p=rows(fy[b]?.[k]),i=Number(fy.idx[b]?.[k]||0);return p.length?p[i%p.length]:null}
function chooseDaily456(){const p=[...fy.fresh.movie,...fy.fresh.series,...fy.fresh.anime].filter(x=>mediaKey456(x));fy.daily=p.length?[p[Number(new Date().toISOString().slice(0,10).replaceAll('-',''))%p.length]]:[]}
function card456(x){if(!x)return'<div class="ct456-missing"><b>Sem indicação elegível agora.</b></div>';try{const h=typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):'';if(h)return h}catch{}return'<article class="ct291-card" data-media="'+esc(mediaKey456(x))+'"><b>'+esc(x?.title||x?.name||'Sem título')+'</b></article>'}
function actions456(n,x){if(!x)return'';const a=n.startsWith('watch:')?[['seen','✓ Visto'],['swap','↻ Trocar']]:[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']];return'<div class="ct456-actions">'+a.map(([k,l])=>'<button type="button" class="chip" data-ct456-action="'+k+'" data-ct456-slot="'+n+'">'+l+'</button>').join('')+'</div>'}
function slot456(n){const x=current456(n),k=n==='daily'?'':n.split(':')[1],label=k==='movie'?'Filme':k==='series'?'Série':k==='anime'?'Anime':'';return'<div class="ct456-slot" data-ct456-slot="'+n+'">'+(label?'<h3>'+label+'</h3>':'')+card456(x)+actions456(n,x)+'</div>'}
function paintFY456(){if(!forYouActive456())return false;const h=fyRoot456();if(!h)return false;h.innerHTML='<div data-ct456-foryou><section class="panel"><div class="panel-head"><h2>Indicação do Dia</h2></div>'+slot456('daily')+'</section><section class="panel"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct456-grid">'+['movie','series','anime'].map(k=>slot456('watch:'+k)).join('')+'</div></section><section class="panel"><div class="panel-head"><h2>100% novos</h2></div><div class="ct456-grid">'+['movie','series','anime'].map(k=>slot456('fresh:'+k)).join('')+'</div></section></div>';document.documentElement.dataset.ct456ForYou='ready';return true}
function paintSlot456(n){const h=fyRoot456(),old=qa('[data-ct456-slot]',h).find(x=>x.dataset.ct456Slot===n);if(!old)return paintFY456();const t=document.createElement('template');t.innerHTML=slot456(n);old.replaceWith(t.content.firstElementChild);return true}
async function loadFY456(force=false){
 if(routeNow()!=='discover'||!authReady())return false;const st=window.__ctR288R263?.discover263;if(st){st.tab='foryou';st.type='all'}if(fyTask&&!force)return fyTask;const run=++fyRun,h=fyRoot456();if(h)h.innerHTML='<div class="panel"><div class="empty">Buscando indicação…</div></div>';
 fyTask=(async()=>{try{
  const specs=[['watch','movie','cinetracker_discover_watch_unseen_v421'],['watch','series','cinetracker_discover_watch_unseen_v421'],['watch','anime','cinetracker_discover_watch_unseen_v421'],['fresh','movie','cinetracker_discover_fresh_v421'],['fresh','series','cinetracker_discover_fresh_v421'],['fresh','anime','cinetracker_discover_fresh_v421']];
  const out={watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]}},res=await Promise.allSettled(specs.map(([,k,n])=>timeout(rpcCall(n,{p_kind:k,p_limit:30}),7000)));
  res.forEach((r,i)=>{if(r.status==='fulfilled')out[specs[i][0]][specs[i][1]]=rows(unwrap(r.value))});
  if(run!==fyRun)return false;fy={daily:[],watch:out.watch,fresh:out.fresh,idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};chooseDaily456();
  if(!fy.daily.length&&!['movie','series','anime'].some(k=>fy.watch[k].length||fy.fresh[k].length))throw new Error('empty');
  return paintFY456();
 }catch(e){if(run===fyRun&&h)h.innerHTML='<div class="panel"><div class="empty">Recomendações indisponíveis.<br><button class="chip" data-ct456-retry>Tentar novamente</button></div></div>';document.documentElement.dataset.ct456ForYouError=String(e?.message||e);return false}
 finally{if(run===fyRun)fyTask=null}})();return fyTask;
}
function swap456(n){if(fyLocks.has(n))return false;fyLocks.add(n);try{const cur=current456(n),ck=mediaKey456(cur),seen=fyExcluded.get(n)||new Set();if(ck)seen.add(ck);fyExcluded.set(n,seen);const p=n==='daily'?[...fy.fresh.movie,...fy.fresh.series,...fy.fresh.anime]:rows(fy[n.split(':')[0]]?.[n.split(':')[1]]);let c=p.filter(x=>{const k=mediaKey456(x);return k&&k!==ck&&!seen.has(k)});if(!c.length)c=p.filter(x=>mediaKey456(x)&&mediaKey456(x)!==ck);if(!c.length)return false;const x=c[Math.floor(Math.random()*c.length)],xk=mediaKey456(x);seen.add(xk);if(n==='daily')fy.daily=[x];else{const[b,k]=n.split(':');fy.idx[b][k]=Math.max(0,fy[b][k].findIndex(v=>mediaKey456(v)===xk))}paintSlot456(n);return true}finally{fyLocks.delete(n)}}
function action456(a,n){if(a==='swap')return swap456(n);if(fyLocks.has(n))return false;const k=mediaKey456(current456(n));if(!k)return false;fyLocks.add(n);try{if(a==='seen')for(const t of ['movie','series','anime'])fy.watch[t]=fy.watch[t].filter(x=>mediaKey456(x)!==k);for(const t of ['movie','series','anime'])fy.fresh[t]=fy.fresh[t].filter(x=>mediaKey456(x)!==k);fy.daily=fy.daily.filter(x=>mediaKey456(x)!==k);chooseDaily456();paintFY456();Promise.resolve(window.__ctR365?.persistDirect?.(a,k)).catch(()=>void 0);return true}finally{fyLocks.delete(n)}}

let f1Task=null;
async function patchF1456(){
 if(!authReady())return false;if(f1Task)return f1Task;
 f1Task=(async()=>{try{const raw=unwrap(await timeout(rpcCall('cinetracker_home_series_v452',{p_today:new Date().toISOString().slice(0,10)}),6500));const item=rows(raw).find(x=>Number(x?.media_id)===865);if(!item)return false;const watched=Number(item.watched_episodes||0)||0,released=Number(item.released_episodes||0)||0,available=Math.max(0,Number(item.available_episodes||released-watched)||0);for(const el of qa('[data-ct285-progress],[data-ct284-progress]')){const scope=el.closest('main,section,article,.modal,[data-series-detail]')||document;const txt=norm(scope.textContent);if(txt.includes('formula 1')||txt.includes('formula one'))el.textContent=watched+'/'+released+' assistidos · '+released+' já exibidos'}document.documentElement.dataset.ct456F1=watched+'/'+released+';available='+available;return true}catch(e){document.documentElement.dataset.ct456F1Error=String(e?.message||e);return false}finally{f1Task=null}})();return f1Task;
}

function bind456(){
 if(window.__ctR404&&typeof window.__ctR404==='object')window.__ctR404.loadMovies=loadMovies456;
 if(window.__ctR405&&typeof window.__ctR405==='object')window.__ctR405.loadMovies=loadMovies456;
 window.__ctR388LoadForYou=loadFY456;window.__ctR288PaintForYou=paintFY456;
 if(window.__ctR309&&typeof window.__ctR309==='object'){window.__ctR309.buildForYou=loadFY456;window.__ctR309.swap=swap456}
 if(window.__ctR309Api&&typeof window.__ctR309Api==='object'){window.__ctR309Api.buildForYou=loadFY456;window.__ctR309Api.swap=swap456}
 if(window.__ctR449&&typeof window.__ctR449==='object'){window.__ctR449.load=loadFY456;window.__ctR449.paint=paintFY456;window.__ctR449.swap=swap456}
 return true;
}
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;
 const a=t.closest('[data-ct456-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();action456(a.dataset.ct456Action,a.dataset.ct456Slot);return}
 if(t.closest('[data-ct456-retry]')){e.preventDefault();void loadFY456(true);return}
 const hb=t.closest('[data-home-tab],.home-tabs button');if(hb&&routeNow()==='home'&&norm(hb.textContent).includes('filme')){setTimeout(()=>void loadMovies456(false),0)}
 const fyb=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');if(fyb&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const st=window.__ctR288R263?.discover263;if(st){st.tab='foryou';st.type='all'}void loadFY456(false);return}
 if(t.closest('[data-ct311-f1-race],[data-ct285-episode-card],[data-ct284-episode]'))setTimeout(()=>void patchF1456(),80);
 const nav=t.closest('[data-nav]');if(nav)for(const ms of[80,300,900])setTimeout(()=>{bind456();if(routeNow()==='home'&&q('[data-home-view="movies"]')?.getClientRects?.().length)void loadMovies456(false);if(forYouActive456())void loadFY456(false);void patchF1456()},ms);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{bind456();void patchF1456();if(forYouActive456())void loadFY456(false)},120));
window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>void patchF1456(),100));
const st=document.createElement('style');st.id='ct456-style';st.textContent='.ct456-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.ct456-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:5px}.ct456-actions [data-ct456-action="swap"]{grid-column:1/-1}.ct456-actions .chip{opacity:1!important;pointer-events:auto!important;min-height:30px!important}.ct456-slot{min-width:0}@media(max-width:720px){.ct456-grid{display:flex;overflow-x:auto}.ct456-grid>.ct456-slot{flex:0 0 154px;width:154px}}';if(!q('#ct456-style'))document.head.appendChild(st);
window.__ctR456={version:'1.0.246',scope:'movie-watchlist+foryou+f1-progress',loadMovies:loadMovies456,loadForYou:loadFY456,paintForYou:paintFY456,swap:swap456,patchF1:patchF1456};
window.__ctR456Marker='watchlist-v405+foryou-v421+f1-v452';
bind456();queueMicrotask(()=>{bind456();void patchF1456()});
})();