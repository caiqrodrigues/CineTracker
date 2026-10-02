/* CineTracker Web 1.0.251 r461 — hard final owner for the Web surfaces still reproduced in user video. */
(()=>{'use strict';
if(window.__ctR461?.version==='1.0.251')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('TIMEOUT')),ms))]);
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?unwrap(v[0]):v&&typeof v==='object'&&v.data!=null?unwrap(v.data):v;
const later=(fn,delays)=>{for(const ms of delays)setTimeout(fn,ms)};
const emit=(detail={})=>{try{document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail}))}catch{}};

/* HOME — never expose History before Continue; Movies owns its own Watchlist loader. */
let homeMode461='series',homeSeq461=0,movieTask461=null,movieRows461=[],movieTotal461=0,movieRun461=0;
function homeKind461(el){const d=String(el?.dataset?.homeTab||'');if(d==='series'||d==='movies')return d;const t=norm(el?.textContent||'');return t.includes('filme')?'movies':t.includes('serie')?'series':''}
function homeView461(kind){return q('[data-home-view="'+kind+'"]')}
function applyHome461(kind){
 if(routeNow()!=='home')return false;homeMode461=kind==='movies'?'movies':'series';
 try{if(window.__ctR371&&typeof window.__ctR371==='object')window.__ctR371.activeTab=homeMode461}catch{}
 for(const b of qa('[data-home-tab],.home-tabs button')){const k=homeKind461(b);if(!k)continue;const on=k===homeMode461;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')}
 for(const v of qa('[data-home-view]')){const on=String(v.dataset.homeView||'')===homeMode461;v.hidden=!on;v.style.display=on?'':'none'}
 return true;
}
function scrollRoots461(el){const out=[];for(let p=el?.parentElement;p&&p!==document.body&&p!==document.documentElement;p=p.parentElement){try{const s=getComputedStyle(p);if((/auto|scroll/.test(String(s.overflowY||''))||p.scrollHeight>p.clientHeight+2)&&p.scrollHeight>p.clientHeight+2)out.push(p)}catch{}}return out}
function continuePanel461(){
 const root=homeView461('series')||q('[data-home-series]')||q('#app')||document;
 for(const p of qa('section,.panel,[class*="panel"]',root)){const h=q('.panel-head h1,.panel-head h2,.panel-head h3,:scope>h1,:scope>h2,:scope>h3,h2,h3',p),t=norm(h?.textContent||'');if(t==='continuar assistindo'||t.startsWith('continuar assistindo ')||t==='assistir a seguir')return p}
 return null;
}
function hideSeries461(){document.documentElement.dataset.ct461SeriesGate='1';const v=homeView461('series');if(v)v.style.visibility='hidden';try{history.scrollRestoration='manual'}catch{}try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}if(v)for(const s of scrollRoots461(v))try{s.scrollTop=0}catch{}}
function revealSeries461(){
 const v=homeView461('series');if(v){v.style.visibility='visible';v.dataset.ct461Ready='1'}document.documentElement.removeAttribute('data-ct461-series-gate');delete document.documentElement.dataset.ct461SeriesGate;
}
function settleSeries461(){
 if(routeNow()!=='home'||homeMode461!=='series')return false;applyHome461('series');const v=homeView461('series');if(v)for(const s of scrollRoots461(v))try{s.scrollTop=0}catch{}
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 const p=continuePanel461();if(!p)return false;try{p.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{}revealSeries461();document.documentElement.dataset.ct461Home='continue';return true;
}
function enterSeries461(){
 const seq=++homeSeq461;homeMode461='series';applyHome461('series');hideSeries461();
 try{window.__ctR399?.refreshSeries?.(false)}catch{}
 later(()=>{if(seq!==homeSeq461||routeNow()!=='home'||homeMode461!=='series')return;if(settleSeries461())return},[0,40,100,180,320,520,800,1200,1800,2600,3800,5200]);
 setTimeout(()=>{if(seq===homeSeq461&&routeNow()==='home'&&homeMode461==='series'&&!continuePanel461()){try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}revealSeries461()}},5600);
 return true;
}
function movieHost461(){
 const view=homeView461('movies');if(!view)return null;
 let sec=q('[data-ct461-movie-watch],[data-ct456-movie-watch],[data-ct404-movie-watch],[data-ct388-movie-watch]',view);
 if(!sec){view.insertAdjacentHTML('beforeend','<section class="home-section" data-ct461-movie-watch><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><small data-ct461-movie-count>…</small></div><div class="stack ct461-movie-stack"></div></section>');sec=q('[data-ct461-movie-watch]',view)}
 let stack=q('.ct461-movie-stack',sec);if(!stack){stack=q('.ct456-movie-stack,.ct404-movie-stack,.ct388-movie-stack,.stack',sec);if(stack)stack.classList.add('ct461-movie-stack')}
 return{sec,stack};
}
function movieHtml461(x){
 const y={...x,media_type:'movie'};try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''})}catch{}
 return '<article class="media-row" data-media-id="'+esc(y.media_id||'')+'"><b>'+esc(y.title||'Sem título')+'</b></article>';
}
function paintMovies461(items,reset=false){
 const h=movieHost461();if(!h?.stack)return false;if(reset)h.stack.replaceChildren();const c=q('[data-ct461-movie-count],[data-ct456-movie-count],[data-ct404-movie-count]',h.sec);if(c)c.textContent=String(movieTotal461||movieRows461.length);
 const frag=document.createDocumentFragment();for(const x of items){const t=document.createElement('template');t.innerHTML=String(movieHtml461(x)||'').trim();if(t.content.firstElementChild)frag.appendChild(t.content.firstElementChild)}h.stack.appendChild(frag);
 if(reset&&!items.length)h.stack.innerHTML='<div class="empty">Nenhum item na Watchlist.</div>';return true;
}
async function moviePage461(offset,limit=120){const raw=unwrap(await timeout(rpc('cinetracker_home_movies_v405',{p_limit:limit,p_offset:offset}),8000))||{};return{rows:rows(raw.rows),count:Math.max(num(raw.count),rows(raw.rows).length)}}
async function loadMovies461(force=false){
 if(routeNow()!=='home'||homeMode461!=='movies'||!authReady())return false;if(movieTask461&&!force)return movieTask461;const run=++movieRun461;
 movieTask461=(async()=>{try{
  const first=await moviePage461(0,120);if(run!==movieRun461)return false;movieRows461=first.rows;movieTotal461=first.count;paintMovies461(movieRows461,true);document.documentElement.dataset.ct461Movies=String(movieRows461.length)+'/'+String(movieTotal461);
  const known=new Set(movieRows461.map(x=>String(x?.media_id||''))),pages=Math.min(50,Math.ceil(movieTotal461/120));
  for(let p=1;p<pages;p++){if(run!==movieRun461||homeMode461!=='movies'||routeNow()!=='home')return false;const pg=await moviePage461(p*120,120).catch(()=>({rows:[]}));const add=[];for(const x of pg.rows){const k=String(x?.media_id||'');if(k&&!known.has(k)){known.add(k);movieRows461.push(x);add.push(x)}}if(add.length){paintMovies461(add,false);await sleep(0)}}
  document.documentElement.dataset.ct461Movies=String(movieRows461.length)+'/'+String(movieTotal461);return true;
 }catch(e){const h=movieHost461();if(h?.stack)h.stack.innerHTML='<div class="empty">Falha ao carregar Watchlist. <button type="button" class="chip" data-ct461-movie-retry>Tentar novamente</button></div>';document.documentElement.dataset.ct461MoviesError=String(e?.message||e);return false}
 finally{if(run===movieRun461)movieTask461=null}})();return movieTask461;
}
function enterMovies461(){++homeSeq461;homeMode461='movies';revealSeries461();applyHome461('movies');try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}void loadMovies461(true);return true}

/* DESCOBRIR > PRA VOCÊ — one concrete renderer, always with complete action rows. */
let fyTask461=null,fyRun461=0;
let fy461={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
const fyLocks461=new Set(),fySeen461=new Map();
function fyState461(){return window.__ctR288R263?.discover263||null}
function fyActive461(){if(routeNow()!=='discover')return false;const s=fyState461();if(String(s?.tab||'')==='foryou')return true;return!!q('[data-ct319-tab="foryou"].active,[data-ct263-tab="foryou"].active,[data-discover-tab="foryou"].active,[data-ct288-tab="foryou"].active,[aria-selected="true"][data-ct319-tab="foryou"]')}
function fyHost461(){const a=qa('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]');return a.find(x=>{try{return x.isConnected&&getComputedStyle(x).display!=='none'&&x.getClientRects().length}catch{return false}})||a.at(-1)||null}
function fyKey461(x){const id=num(x?.tmdb_id||x?.source_tmdb_id||x?.id);if(!id)return'';return String(x?.media_type||x?.media_kind)==='movie'?'movie:'+id:'tv:'+id}
function fyCurrent461(name){if(name==='daily')return fy461.daily[0]||null;const[b,k]=name.split(':'),p=rows(fy461[b]?.[k]),i=num(fy461.idx[b]?.[k]);return p.length?p[i%p.length]:null}
function fyChooseDaily461(){const p=[...fy461.fresh.movie,...fy461.fresh.series,...fy461.fresh.anime].filter(x=>fyKey461(x));fy461.daily=p.length?[p[num(new Date().toISOString().slice(0,10).replaceAll('-',''))%p.length]]:[]}
function fyCard461(x){if(!x)return'<div class="ct461-missing"><b>Sem indicação elegível agora.</b></div>';try{const h=typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):'';if(h)return h}catch{}return'<article class="ct291-card"><b>'+esc(x?.title||x?.name||'Sem título')+'</b></article>'}
function fyActions461(name,x){if(!x)return'';const a=name.startsWith('watch:')?[['seen','✓ Visto'],['swap','↻ Trocar']]:[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']];return'<div class="ct461-actions">'+a.map(([k,l])=>'<button type="button" class="chip" data-ct461-action="'+k+'" data-ct461-slot="'+name+'">'+l+'</button>').join('')+'</div>'}
function fySlot461(name){const x=fyCurrent461(name),k=name==='daily'?'':name.split(':')[1],label=k==='movie'?'Filme':k==='series'?'Série':k==='anime'?'Anime':'';return'<div class="ct461-slot" data-ct461-slot="'+name+'">'+(label?'<h3>'+label+'</h3>':'')+fyCard461(x)+fyActions461(name,x)+'</div>'}
function paintFY461(){
 if(!fyActive461())return false;const h=fyHost461();if(!h)return false;
 h.innerHTML='<div data-ct461-foryou><section class="panel"><div class="panel-head"><h2>Indicação do Dia</h2></div>'+fySlot461('daily')+'</section><section class="panel"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct461-grid">'+['movie','series','anime'].map(k=>fySlot461('watch:'+k)).join('')+'</div></section><section class="panel"><div class="panel-head"><h2>100% novos</h2></div><div class="ct461-grid">'+['movie','series','anime'].map(k=>fySlot461('fresh:'+k)).join('')+'</div></section></div>';
 document.documentElement.dataset.ct461ForYou='ready';document.documentElement.dataset.ct461SwapCount=String(qa('[data-ct461-action="swap"]',h).length);return true;
}
function paintFYSlot461(name){const h=fyHost461(),old=qa('[data-ct461-slot]',h).find(x=>x.dataset.ct461Slot===name);if(!old)return paintFY461();const t=document.createElement('template');t.innerHTML=fySlot461(name);old.replaceWith(t.content.firstElementChild);return true}
async function fySource461(){
 const specs=[['watch','movie','cinetracker_discover_watch_unseen_v421',30],['watch','series','cinetracker_discover_watch_unseen_v421',30],['watch','anime','cinetracker_discover_watch_unseen_v421',30],['fresh','movie','cinetracker_discover_fresh_v421',48],['fresh','series','cinetracker_discover_fresh_v421',48],['fresh','anime','cinetracker_discover_fresh_v421',48]];
 const out={watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]}};
 const res=await Promise.allSettled(specs.map(v=>timeout(rpc(v[2],{p_kind:v[1],p_limit:v[3]}),9000)));
 res.forEach((r,i)=>{if(r.status==='fulfilled')out[specs[i][0]][specs[i][1]]=rows(unwrap(r.value))});
 if(!['movie','series','anime'].some(k=>out.watch[k].length||out.fresh[k].length))throw new Error('FORYOU_EMPTY');return out;
}
async function loadFY461(force=false){
 if(routeNow()!=='discover'||!authReady())return false;const s=fyState461();if(s){s.tab='foryou';s.type='all'}if(fyTask461&&!force)return fyTask461;const run=++fyRun461,h=fyHost461();if(h&&!q('[data-ct461-foryou]',h))h.innerHTML='<div class="panel"><div class="empty">Buscando indicação…</div></div>';
 fyTask461=(async()=>{try{const out=await fySource461();if(run!==fyRun461)return false;fy461={daily:[],watch:out.watch,fresh:out.fresh,idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};fyChooseDaily461();return paintFY461()}catch(e){if(run===fyRun461&&h)h.innerHTML='<div class="panel"><div class="empty">Recomendações indisponíveis.<br><button type="button" class="chip" data-ct461-fy-retry>Tentar novamente</button></div></div>';document.documentElement.dataset.ct461ForYouError=String(e?.message||e);return false}finally{if(run===fyRun461)fyTask461=null}})();return fyTask461;
}
function swapFY461(name){if(fyLocks461.has(name))return false;fyLocks461.add(name);try{const cur=fyCurrent461(name),ck=fyKey461(cur),seen=fySeen461.get(name)||new Set();if(ck)seen.add(ck);fySeen461.set(name,seen);const p=name==='daily'?[...fy461.fresh.movie,...fy461.fresh.series,...fy461.fresh.anime]:rows(fy461[name.split(':')[0]]?.[name.split(':')[1]]);let c=p.filter(x=>{const k=fyKey461(x);return k&&k!==ck&&!seen.has(k)});if(!c.length)c=p.filter(x=>fyKey461(x)&&fyKey461(x)!==ck);if(!c.length)return false;const x=c[Math.floor(Math.random()*c.length)],xk=fyKey461(x);seen.add(xk);if(name==='daily')fy461.daily=[x];else{const[b,k]=name.split(':');fy461.idx[b][k]=Math.max(0,fy461[b][k].findIndex(v=>fyKey461(v)===xk))}return paintFYSlot461(name)}finally{fyLocks461.delete(name)}}
async function actionFY461(action,name){
 if(action==='swap')return swapFY461(name);if(fyLocks461.has(name))return false;const key=fyKey461(fyCurrent461(name));if(!key)return false;fyLocks461.add(name);
 const before=JSON.parse(JSON.stringify(fy461));
 try{
  if(action==='seen')for(const t of ['movie','series','anime'])fy461.watch[t]=fy461.watch[t].filter(x=>fyKey461(x)!==key);
  for(const t of ['movie','series','anime'])fy461.fresh[t]=fy461.fresh[t].filter(x=>fyKey461(x)!==key);fy461.daily=fy461.daily.filter(x=>fyKey461(x)!==key);fyChooseDaily461();paintFY461();
  await window.__ctR365?.persistDirect?.(action,key);return true;
 }catch(e){fy461=before;paintFY461();try{toast('Não foi possível sincronizar. '+(e?.message||e))}catch{}return false}
 finally{fyLocks461.delete(name)}
}
function enterFY461(){const s=fyState461();if(s){s.tab='foryou';s.type='all'}void loadFY461(false);return true}

/* PERFIL — canonical time + no cropped rails/cards. */
let profileTask461=null,profileSeq461=0;
function fmtTime461(minutes){const total=Math.max(0,Math.floor(num(minutes))),days=Math.floor(total/1440),hours=Math.floor((total%1440)/60),mins=total%60;return days>0?String(days)+'D '+String(hours).padStart(2,'0')+'H '+String(mins).padStart(2,'0')+'M':String(hours).padStart(2,'0')+'H '+String(mins).padStart(2,'0')+'M'}
function patchProfileStats461(stats,sports){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]')||q('#app');if(!root)return false;let changed=false;
 for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',root)){const label=norm(q('small,label,.stat-label,.label',card)?.textContent||''),value=q('b,strong,.value,.stat-value',card);if(!value)continue;if(label.includes('tempo')&&label.includes('serie')&&!label.includes('watchlist')){value.textContent=fmtTime461(stats?.series_minutes);changed=true}else if(label.includes('tempo')&&label.includes('filme')&&!label.includes('watchlist')){value.textContent=fmtTime461(stats?.movie_minutes);changed=true}else if(label.includes('tempo')&&label.includes('total')){value.textContent=fmtTime461(stats?.total_minutes);changed=true}}
 for(const panel of qa('section.panel,.panel',root)){const title=norm(q('.panel-head h2,.panel-head h3,h2,h3',panel)?.textContent||'');if(!title.includes('esportes assistidos'))continue;for(const card of qa('.stat,[data-stat],.stat-card,.profile-stat',panel)){const label=norm(q('small,label,.stat-label,.label',card)?.textContent||''),value=q('b,strong,.value,.stat-value',card);if(!value)continue;if(label==='tempo assistido'){value.textContent=fmtTime461(sports?.sports_minutes);changed=true}if(label==='eventos assistidos'){value.textContent=num(sports?.watched_events).toLocaleString('pt-BR');changed=true}}}
 root.dataset.ct461ProfileStats='canonical';return changed;
}
function unclipProfile461(){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]')||q('#app');if(!root)return false;
 let changed=false;try{changed=!!window.__ctR455?.applyProfile?.()}catch{}
 if(!changed)try{changed=!!window.__ctR460?.applyProfile?.()}catch{}
 if(changed)root.dataset.ct461ProfileLists='13+half-more';return changed;
}
async function loadProfile461
async function loadProfile461(){
 if(routeNow()!=='profile'||!authReady())return false;if(profileTask461)return profileTask461;const seq=++profileSeq461;
 profileTask461=(async()=>{const [statsRaw,sportsRaw]=await Promise.all([timeout(rpc('cinetracker_profile_stats',{}),7000).catch(()=>null),timeout(rpc('cinetracker_sport_stats_v421',{}),7000).catch(()=>null)]);if(seq!==profileSeq461||routeNow()!=='profile')return false;const stats=Array.isArray(statsRaw)?statsRaw[0]:statsRaw,sports=Array.isArray(sportsRaw)?sportsRaw[0]:sportsRaw;patchProfileStats461(stats||{},sports||{});unclipProfile461();return true})().finally(()=>{profileTask461=null});return profileTask461;
}
function scheduleProfile461(){const seq=++profileSeq461;later(()=>{if(seq!==profileSeq461||routeNow()!=='profile')return;unclipProfile461();void loadProfile461()},[0,80,220,500,1000,1800,3000])}

/* F1 — rebind the effective controls after every legacy runtime and handle real click targets directly. */
let f1Task461=null;
function bindF1461(){try{window.__ctR422?.bindApi?.();window.__ctR422?.bindOwners?.()}catch{}const o=window.__ctR423;if(!o)return false;try{ct285Mark=o.markSeriesF1}catch{}try{ct284Mark=o.markSeriesF1}catch{}try{toggleF1Session311=o.toggleF1Hub}catch{}try{if(window.__ctR421){window.__ctR421.toggleF1=o.toggleF1Hub;window.__ctR421.syncF1=o.syncF1Hub;window.__ctR421.scheduleF1Sync=o.scheduleF1Sync}}catch{}return true}
async function refreshF1461(){if(f1Task461)return f1Task461;f1Task461=(async()=>{try{if(!authReady())return false;bindF1461();const raw=unwrap(await timeout(rpc('cinetracker_f1_progress_v426',{p_season:new Date().getFullYear()}),7000)),d=raw||{},released=num(d.released_episodes),watched=Math.min(released,num(d.watched_released_episodes)),remaining=Math.max(0,released-watched);if(!released)return false;for(const scope of qa('[data-media-id="865"],[data-series-id="865"],[data-ct-media-id="865"],[data-ct285-special="f1"]')){for(const el of [scope,...qa('span,small,em,p,strong,b,[data-ct285-progress],[data-ct284-progress]',scope)]){if(el.children?.length>4)continue;const old=String(el.textContent||'');let next=old.replace(/\d+\s*\/\s*\d+\s*assistidos/ig,watched+'/'+released+' assistidos').replace(/\d+\s+j[aá]\s+exibidos/ig,released+' já exibidos').replace(/\d+\s+epis[oó]dios?\s+dispon[ií]veis?\s+para\s+ver/ig,remaining+' episódios disponíveis para ver');if(next!==old)el.textContent=next}}document.documentElement.dataset.ct461F1=watched+'/'+released+';remaining='+remaining;return d}catch(e){document.documentElement.dataset.ct461F1Error=String(e?.message||e);return false}finally{f1Task461=null}})();return f1Task461}
function scheduleF1461(){later(()=>{bindF1461();void refreshF1461()},[0,80,220,500,1000,1800])}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const f1Series=t.closest('[data-ct285-watch][data-media-id="865"],[data-ct284-watch][data-media-id="865"]');if(f1Series&&window.__ctR423?.markSeriesF1){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void window.__ctR423.markSeriesF1(f1Series).finally(()=>{scheduleF1461();if(routeNow()==='profile')scheduleProfile461()});return}
 const f1Hub=t.closest('[data-ct311-f1-watch]');if(f1Hub&&window.__ctR423?.toggleF1Hub){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void window.__ctR423.toggleF1Hub(f1Hub).finally(()=>{scheduleF1461();if(routeNow()==='profile')scheduleProfile461()});return}
 const home=t.closest('[data-home-tab],.home-tabs button');if(home&&routeNow()==='home'){const k=homeKind461(home);if(k){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();k==='movies'?enterMovies461():enterSeries461();return}}
 if(t.closest('[data-ct461-movie-retry]')){e.preventDefault();e.stopImmediatePropagation();void loadMovies461(true);return}
 const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterFY461();return}
 const fa=t.closest('[data-ct461-action]');if(fa&&fyActive461()){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void actionFY461(String(fa.dataset.ct461Action||''),String(fa.dataset.ct461Slot||''));return}
 if(t.closest('[data-ct461-fy-retry]')){e.preventDefault();e.stopImmediatePropagation();void loadFY461(true);return}
 const nav=t.closest('[data-nav]');if(nav){const n=String(nav.dataset.nav||'');if(n==='home')setTimeout(enterSeries461,0);if(n==='discover')setTimeout(()=>{if(fyActive461())enterFY461()},0);if(n==='profile')setTimeout(scheduleProfile461,0);if(n==='home'||n==='sports'||n==='f1hub')setTimeout(scheduleF1461,0)}
 if(t.closest('[data-ct255-watch]'))setTimeout(scheduleF1461,120);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{bindF1461();if(routeNow()==='home'){homeMode461='series';enterSeries461()}if(routeNow()==='discover'&&fyActive461())enterFY461();if(routeNow()==='profile')scheduleProfile461();scheduleF1461()},0));
window.addEventListener('cinetracker:data-changed',e=>{const src=String(e?.detail?.source||'');if(routeNow()==='profile')scheduleProfile461();if(src.includes('f1')||num(e?.detail?.media_id)===865)scheduleF1461()});
window.addEventListener('cinetracker:f1-watched-changed',()=>{scheduleF1461();if(routeNow()==='profile')scheduleProfile461()});

const style=document.createElement('style');style.id='ct461-style';style.textContent='html[data-ct461-series-gate="1"] [data-home-view="series"]{visibility:hidden!important}.ct461-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}.ct461-slot{min-width:0!important;height:auto!important;overflow:visible!important}.ct461-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important;margin-top:7px!important;position:relative!important;z-index:20!important;overflow:visible!important}.ct461-actions [data-ct461-action="swap"]{grid-column:1/-1!important;display:inline-flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}.ct461-actions .chip{min-height:30px!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}[data-profile] .ct424-profile-list,[data-profile] .row{max-height:none!important;height:auto!important;overflow:visible!important}@media(max-width:720px){.ct461-grid{display:flex!important;overflow-x:auto!important}.ct461-grid>.ct461-slot{flex:0 0 154px!important;width:154px!important}}';if(!q('#ct461-style'))document.head.appendChild(style);

window.__ctR461={version:'1.0.251',scope:'home-series-preboot+movies-watchlist+foryou-complete-actions+profile-truth+f1-three-way',enterSeries:enterSeries461,enterMovies:enterMovies461,loadMovies:loadMovies461,loadForYou:loadFY461,paintForYou:paintFY461,loadProfile:loadProfile461,refreshF1:refreshF1461,bindF1:bindF1461};
window.__ctR461Marker='preboot-continue+watchlist-v405+foryou-7-actions+profile-uncropped+f1-r423-r426';
queueMicrotask(()=>{bindF1461();if(routeNow()==='home')enterSeries461();if(routeNow()==='discover'&&fyActive461())enterFY461();if(routeNow()==='profile')scheduleProfile461();scheduleF1461()});
})();