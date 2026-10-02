/* CineTracker Web 1.0.247 r457 — final stability owner for Home Movies, Pra Voce, Profile rails and F1 progress. */
(()=>{'use strict';
if(window.__ctR457?.version==='1.0.247')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?unwrap(v[0]):v?.data?unwrap(v.data):v;
const rpcCall=(n,a)=>{if(!authReady())return Promise.reject(new Error('auth-not-ready'));return Promise.resolve(rpc(n,a))};
const later=(fn,delays)=>{for(const ms of delays)setTimeout(fn,ms)};

/* Home > Filmes: own the selected tab after legacy handlers and keep Watchlist visible. */
let homeToken457=0;
function homeKind457(){
 try{if(window.__ctR371?.activeTab==='movies')return'movies'}catch{}
 const b=q('[data-home-tab].active,[data-home-tab][aria-selected="true"]');
 return String(b?.dataset?.homeTab||'series')==='movies'?'movies':'series';
}
function setHomeKind457(kind){
 if(routeNow()!=='home')return false;
 kind=kind==='movies'?'movies':'series';
 try{if(window.__ctR371&&typeof window.__ctR371==='object')window.__ctR371.activeTab=kind}catch{}
 for(const b of qa('[data-home-tab]')){const on=String(b.dataset.homeTab||'series')===kind;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')}
 for(const v of qa('[data-home-view]')){const on=String(v.dataset.homeView||'series')===kind;v.hidden=!on;v.style.display=on?'':'none'}
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 if(kind==='movies'){
  const token=++homeToken457;
  later(()=>{if(token!==homeToken457||routeNow()!=='home'||homeKind457()!=='movies')return;setHomeKind457('movies');void window.__ctR456?.loadMovies?.(false)},[0,80,260,700,1500]);
 }
 document.documentElement.dataset.ct457HomeKind=kind;
 return true;
}
function enterMovies457(){
 if(routeNow()!=='home')return false;
 setHomeKind457('movies');
 void window.__ctR456?.loadMovies?.(true);
 return true;
}

/* Descobrir > Pra Voce: one owner, six filtered v421 pools, complete action rows. */
let fyTask457=null,fyRun457=0;
let fy457={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
const fyLocks457=new Set(),fySeen457=new Map();
function fyState457(){return window.__ctR288R263?.discover263||null}
function fyHost457(){const a=qa('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]');return a.find(x=>{try{return x.isConnected&&getComputedStyle(x).display!=='none'&&x.getClientRects().length}catch{return false}})||a.at(-1)||null}
function fyActive457(){
 if(routeNow()!=='discover')return false;
 const s=fyState457();if(String(s?.tab||'')==='foryou')return true;
 return!!q('[data-ct319-tab="foryou"].active,[data-ct263-tab="foryou"].active,[data-discover-tab="foryou"].active,[data-ct288-tab="foryou"].active,[aria-selected="true"][data-ct319-tab="foryou"]');
}
function fyKey457(x){const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0);if(!id)return'';return String(x?.media_type||x?.media_kind)==='movie'?'movie:'+id:'tv:'+id}
function fyCurrent457(n){if(n==='daily')return fy457.daily[0]||null;const p=n.split(':'),list=rows(fy457[p[0]]?.[p[1]]),i=Number(fy457.idx[p[0]]?.[p[1]]||0);return list.length?list[i%list.length]:null}
function fyChooseDaily457(){const p=[...fy457.fresh.movie,...fy457.fresh.series,...fy457.fresh.anime].filter(x=>fyKey457(x));fy457.daily=p.length?[p[Number(new Date().toISOString().slice(0,10).replaceAll('-',''))%p.length]]:[]}
function fyCard457(x){
 if(!x)return'<div class="ct457-missing"><b>Sem indicação elegível agora.</b></div>';
 try{const h=typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):'';if(h)return h}catch{}
 return'<article class="ct291-card"><b>'+esc(x?.title||x?.name||'Sem título')+'</b></article>';
}
function fyActions457(n,x){
 if(!x)return'';
 const a=n.startsWith('watch:')?[['seen','✓ Visto'],['swap','↻ Trocar']]:[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']];
 return'<div class="ct457-actions">'+a.map(v=>'<button type="button" class="chip" data-ct457-action="'+v[0]+'" data-ct457-slot="'+n+'">'+v[1]+'</button>').join('')+'</div>';
}
function fySlot457(n){const x=fyCurrent457(n),k=n==='daily'?'':n.split(':')[1],label=k==='movie'?'Filme':k==='series'?'Série':k==='anime'?'Anime':'';return'<div class="ct457-slot" data-ct457-slot="'+n+'">'+(label?'<h3>'+label+'</h3>':'')+fyCard457(x)+fyActions457(n,x)+'</div>'}
function fyPaint457(){
 if(!fyActive457())return false;
 const h=fyHost457();if(!h)return false;
 h.innerHTML='<div data-ct457-foryou><section class="panel"><div class="panel-head"><h2>Indicação do Dia</h2></div>'+fySlot457('daily')+'</section><section class="panel"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct457-grid">'+['movie','series','anime'].map(k=>fySlot457('watch:'+k)).join('')+'</div></section><section class="panel"><div class="panel-head"><h2>100% novos</h2></div><div class="ct457-grid">'+['movie','series','anime'].map(k=>fySlot457('fresh:'+k)).join('')+'</div></section></div>';
 document.documentElement.dataset.ct457ForYou='ready';return true;
}
function fyPaintSlot457(n){const h=fyHost457(),old=qa('[data-ct457-slot]',h).find(x=>x.dataset.ct457Slot===n);if(!old)return fyPaint457();const t=document.createElement('template');t.innerHTML=fySlot457(n);old.replaceWith(t.content.firstElementChild);return true}
async function fySource457(){
 const specs=[['watch','movie','cinetracker_discover_watch_unseen_v421'],['watch','series','cinetracker_discover_watch_unseen_v421'],['watch','anime','cinetracker_discover_watch_unseen_v421'],['fresh','movie','cinetracker_discover_fresh_v421'],['fresh','series','cinetracker_discover_fresh_v421'],['fresh','anime','cinetracker_discover_fresh_v421']];
 const out={watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]}};
 const res=await Promise.allSettled(specs.map(v=>timeout(rpcCall(v[2],{p_kind:v[1],p_limit:v[0]==='watch'?30:48}),12000)));
 res.forEach((r,i)=>{if(r.status==='fulfilled')out[specs[i][0]][specs[i][1]]=rows(unwrap(r.value))});
 if(!['movie','series','anime'].some(k=>out.watch[k].length||out.fresh[k].length))throw new Error('empty');
 return out;
}
async function fyLoad457(force=false){
 if(routeNow()!=='discover')return false;
 const s=fyState457();if(s){s.tab='foryou';s.type='all'}
 if(fyTask457&&!force)return fyTask457;
 const run=++fyRun457,h=fyHost457();if(h)h.innerHTML='<div class="panel"><div class="empty">Buscando indicação…</div></div>';
 fyTask457=(async()=>{try{
  const out=await fySource457();if(run!==fyRun457)return false;
  fy457={daily:[],watch:out.watch,fresh:out.fresh,idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};fyChooseDaily457();
  const ok=fyPaint457();
  later(()=>{if(run===fyRun457&&fyActive457()&&!q('[data-ct457-foryou]'))fyPaint457()},[180,600,1400]);
  return ok;
 }catch(e){if(run===fyRun457&&h)h.innerHTML='<div class="panel"><div class="empty">Recomendações indisponíveis.<br><button class="chip" data-ct457-retry>Tentar novamente</button></div></div>';document.documentElement.dataset.ct457ForYouError=String(e?.message||e);return false}
 finally{if(run===fyRun457)fyTask457=null}})();
 return fyTask457;
}
function fySwap457(n){
 if(fyLocks457.has(n))return false;fyLocks457.add(n);
 try{const cur=fyCurrent457(n),ck=fyKey457(cur),seen=fySeen457.get(n)||new Set();if(ck)seen.add(ck);fySeen457.set(n,seen);
  const p=n==='daily'?[...fy457.fresh.movie,...fy457.fresh.series,...fy457.fresh.anime]:rows(fy457[n.split(':')[0]]?.[n.split(':')[1]]);
  let c=p.filter(x=>fyKey457(x)&&fyKey457(x)!==ck&&!seen.has(fyKey457(x)));if(!c.length)c=p.filter(x=>fyKey457(x)&&fyKey457(x)!==ck);if(!c.length)return false;
  const x=c[Math.floor(Math.random()*c.length)],xk=fyKey457(x);seen.add(xk);
  if(n==='daily')fy457.daily=[x];else{const p2=n.split(':');fy457.idx[p2[0]][p2[1]]=Math.max(0,fy457[p2[0]][p2[1]].findIndex(v=>fyKey457(v)===xk))}
  return fyPaintSlot457(n);
 }finally{fyLocks457.delete(n)}
}
function fyAction457(a,n){
 if(a==='swap')return fySwap457(n);
 if(fyLocks457.has(n))return false;
 const k=fyKey457(fyCurrent457(n));if(!k)return false;fyLocks457.add(n);
 try{
  if(a==='seen')for(const t of ['movie','series','anime'])fy457.watch[t]=fy457.watch[t].filter(x=>fyKey457(x)!==k);
  for(const t of ['movie','series','anime'])fy457.fresh[t]=fy457.fresh[t].filter(x=>fyKey457(x)!==k);
  fy457.daily=fy457.daily.filter(x=>fyKey457(x)!==k);fyChooseDaily457();fyPaint457();
  Promise.resolve(window.__ctR365?.persistDirect?.(a,k)).catch(()=>void 0);return true;
 }finally{fyLocks457.delete(n)}
}
function scheduleFY457(force=false){
 const token=++fyRun457;
 later(()=>{if(token!==fyRun457||routeNow()!=='discover')return;const s=fyState457();if(s&&String(s.tab||'foryou')!=='foryou')return;if(s){s.tab='foryou';s.type='all'}void fyLoad457(force)},[0,80,220,600,1400]);
}

/* Perfil: exactly 13 cards + a half-card Ver mais. */
const PROFILE_LIMIT_457=13;
function profileTitle457(panel){return norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||'')}
function profileWanted457(t){return ['series','filmes','series favoritas','filmes favoritos','atores','atores favoritos'].includes(t)}
function profileApply457(){
 if(routeNow()!=='profile')return false;
 const root=q('[data-profile]');if(!root)return false;let changed=false;
 for(const panel of qa('section.panel,.panel',root)){
  const title=profileTitle457(panel);if(!profileWanted457(title))continue;
  const candidates=qa(':scope>.row,:scope>.ct424-profile-list,:scope>[class*="rail"],:scope>[class*="row"]',panel);
  const row=candidates.find(r=>qa(':scope>*',r).some(x=>x.matches?.('.card,[data-media-id],[data-person-id],article')||q('img,.poster,[class*="poster"],[class*="avatar"]',x)))||candidates[0];
  if(!row)continue;
  qa('[data-ct457-more]',row).forEach(x=>x.remove());
  const cards=qa(':scope>*',row).filter(x=>!x.matches?.('[data-ct455-more],[data-ct424-more]')&&(x.matches?.('.card,[data-media-id],[data-person-id],article')||q('img,.poster,[class*="poster"],[class*="avatar"]',x)));
  if(!cards.length)continue;
  cards.forEach((c,i)=>{c.hidden=i>=PROFILE_LIMIT_457;c.style.display=i>=PROFILE_LIMIT_457?'none':''});
  qa('[data-ct455-more],[data-ct424-more]',row).forEach(x=>x.remove());
  if(cards.length>PROFILE_LIMIT_457){
   const native=qa('button',panel).find(b=>!b.dataset.ct457More&&norm(b.textContent).includes('ver mais'))||null;
   const more=document.createElement('button');more.type='button';more.dataset.ct457More='1';more.className='ct457-profile-more';more.innerHTML='<span aria-hidden="true">›</span><span>Ver mais</span>';
   more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(native&&native.isConnected){native.click();return}cards.forEach(c=>{c.hidden=false;c.style.display=''});more.remove()});
   row.appendChild(more);
  }
  panel.dataset.ct457Profile='13+half-more';changed=true;
 }
 return changed;
}
function scheduleProfile457(){
 later(()=>{if(routeNow()==='profile'){void window.__ctR424?.loadProfile?.();profileApply457()}},[0,120,350,800,1600,3200,6000]);
}

/* F1: canonical released/watched progress from database, never stale 77/77. */
let f1Task457=null;
function patchF1Scope457(scope,d){
 if(!scope)return false;let changed=false;
 const watched=Number(d?.watched_released_episodes||0)||0,released=Number(d?.released_episodes||0)||0,remaining=Math.max(0,Number(d?.remaining_episodes||released-watched)||0);
 const nodes=[scope,...qa('span,small,em,p,strong,b,[data-ct285-progress],[data-ct284-progress]',scope)];
 for(const el of nodes){
  if(el.children?.length>2)continue;const old=String(el.textContent||''),n=norm(old);let next=old;
  if(/\d+\s*\/\s*\d+\s*assistidos/i.test(old))next=next.replace(/\d+\s*\/\s*\d+\s*assistidos/ig,watched+'/'+released+' assistidos');
  if(/\d+\s+epis[oó]dios?\s+dispon[ií]veis?\s+para\s+ver/i.test(old))next=next.replace(/\d+\s+epis[oó]dios?\s+dispon[ií]veis?\s+para\s+ver/ig,remaining+' episódios disponíveis para ver');
  if(n.includes('ja exibidos')||n.includes('já exibidos'))next=next.replace(/\d+\s+j[aá]\s+exibidos/ig,released+' já exibidos');
  if(next!==old){el.textContent=next;changed=true}
 }
 scope.dataset.ct457F1Progress=watched+'/'+released+';remaining='+remaining;return changed;
}
async function f1Patch457(){
 if(!authReady())return false;if(f1Task457)return f1Task457;
 f1Task457=(async()=>{try{
  const raw=unwrap(await timeout(rpcCall('cinetracker_f1_progress_v426',{p_season:new Date().getFullYear()}),9000)),d=raw||{};
  const scopes=new Set();
  for(const el of qa('[data-media-id="865"],[data-series-id="865"],[data-ct-media-id="865"]'))scopes.add(el);
  for(const el of qa('[data-ct285-progress],[data-ct284-progress]')){const s=el.closest('[data-media-id="865"],[data-series-detail],article,.card,.media-row,.modal,section');if(s&&norm(s.textContent).includes('formula 1'))scopes.add(s)}
  for(const s of scopes)patchF1Scope457(s,d);
  document.documentElement.dataset.ct457F1=String(d?.watched_released_episodes||0)+'/'+String(d?.released_episodes||0);
  return true;
 }catch(e){document.documentElement.dataset.ct457F1Error=String(e?.message||e);return false}
 finally{f1Task457=null}})();return f1Task457;
}
function scheduleF1457(){later(()=>void f1Patch457(),[0,120,420,1000,2200])}

/* Rebind public owners so late legacy calls converge to r457 instead of repainting stale UI. */
function bind457(){
 if(window.__ctR456&&typeof window.__ctR456==='object'){window.__ctR456.loadForYou=fyLoad457;window.__ctR456.paintForYou=fyPaint457;window.__ctR456.swap=fySwap457}
 window.__ctR388LoadForYou=fyLoad457;window.__ctR288PaintForYou=fyPaint457;
 for(const n of ['__ctR309','__ctR309Api','__ctR449'])if(window[n]&&typeof window[n]==='object'){if('buildForYou' in window[n])window[n].buildForYou=fyLoad457;if('load' in window[n])window[n].load=fyLoad457;if('paint' in window[n])window[n].paint=fyPaint457;if('swap' in window[n])window[n].swap=fySwap457}
 return true;
}
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;
 const a=t.closest('[data-ct457-action]');if(a&&fyActive457()){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();fyAction457(a.dataset.ct457Action,a.dataset.ct457Slot);return}
 if(t.closest('[data-ct457-retry]')){e.preventDefault();e.stopImmediatePropagation();const s=fyState457();if(s){s.tab='foryou';s.type='all'}void fyLoad457(true);return}
 const ht=t.closest('[data-home-tab]');if(ht&&routeNow()==='home'){const kind=String(ht.dataset.homeTab||'series')==='movies'?'movies':'series';queueMicrotask(()=>{if(kind==='movies')enterMovies457();else setHomeKind457('series')});return}
 const nav=t.closest('[data-nav]');
 if(nav){
  const n=String(nav.dataset.nav||'');
  if(n==='discover')later(()=>{bind457();const s=fyState457();if(s){s.tab='foryou';s.type='all'}scheduleFY457(false)},[0,80,260]);
  if(n==='profile')scheduleProfile457();
  if(n==='home')scheduleF1457();
 }
 if(t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]')){const s=fyState457();if(s){s.tab='foryou';s.type='all'}scheduleFY457(true)}
 if(t.closest('[data-ct311-f1-race],[data-ct285-episode-card],[data-ct284-episode]'))scheduleF1457();
},true);
window.addEventListener('popstate',()=>later(()=>{bind457();if(fyActive457())scheduleFY457(false);if(routeNow()==='profile')scheduleProfile457();scheduleF1457()},[80,300]));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile')scheduleProfile457();if(fyActive457())fyPaint457();scheduleF1457()});
const style=document.createElement('style');style.id='ct457-style';style.textContent='.ct457-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.ct457-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:5px}.ct457-actions [data-ct457-action="swap"]{grid-column:1/-1}.ct457-actions .chip{opacity:1!important;visibility:visible!important;pointer-events:auto!important;min-height:30px!important}.ct457-slot{min-width:0}[data-profile] .ct457-profile-more{box-sizing:border-box!important;display:flex!important;flex:0 0 75px!important;width:75px!important;min-width:75px!important;max-width:75px!important;align-self:stretch!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:10px!important;border:1px solid rgba(86,190,255,.42)!important;border-radius:12px!important;background:rgba(8,25,35,.96)!important;color:inherit!important;cursor:pointer!important}[data-profile] .ct457-profile-more span:first-child{font-size:32px!important}[data-profile] .ct457-profile-more span:last-child{font-size:11px!important;writing-mode:vertical-rl;transform:rotate(180deg)}@media(max-width:720px){.ct457-grid{display:flex;overflow-x:auto}.ct457-grid>.ct457-slot{flex:0 0 154px;width:154px}}';if(!q('#ct457-style'))document.head.appendChild(style);
window.__ctR457={version:'1.0.247',scope:'home-movies+foryou+profile+f1',setHomeKind:setHomeKind457,enterMovies:enterMovies457,loadForYou:fyLoad457,paintForYou:fyPaint457,swap:fySwap457,applyProfile:profileApply457,patchF1:f1Patch457};
window.__ctR457Marker='home-movies-sticky+foryou-v421-owner+profile-13-half+f1-v426-progress';
bind457();queueMicrotask(()=>{bind457();if(routeNow()==='profile')scheduleProfile457();if(fyActive457())scheduleFY457(false);scheduleF1457()});
})();