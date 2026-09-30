/* CineTracker Web 1.0.202 r411 — Descobrir > Pra Você progressive owner only. */
(()=>{
'use strict';
if(window.__ctR411?.version==='1.0.202')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return!!session?.access_token}catch{return false}};
const rpcCall=(n,a)=>{if(!authReady()||typeof rpc!=='function')return Promise.reject(new Error('auth/rpc'));return Promise.resolve(rpc(n,a))};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const visible=el=>{if(!el?.isConnected)return false;try{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length>0}catch{return true}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state=()=>window.__ctR288R263?.discover263||null;
const isForYou=()=>routeNow()==='discover'&&(String(state()?.tab||'foryou')==='foryou'||!!q('[data-ct319-tab="foryou"].active,[data-ct263-tab="foryou"].active,[data-discover-tab="foryou"].active,[data-ct411-foryou]'));
const discoverRoot=()=>{const all=qa('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]');return all.find(visible)||all[all.length-1]||null};
const key=x=>{const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;const type=String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';return id>0?type+':'+id:''};
const title=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');

let fy={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
let task=null,run=0,ownerToken=0,ready=false;
const loaded=new Set(),errors=new Map(),actionLocks=new Set(),excluded=new Map();

function unwrapRows(v){
 if(v&&typeof v==='object'&&!Array.isArray(v)&&'data'in v)return unwrapRows(v.data);
 if(Array.isArray(v)){
  if(v.length===1&&Array.isArray(v[0]))return v[0];
  if(v.length===1&&v[0]&&typeof v[0]==='object'&&Array.isArray(v[0].rows))return v[0].rows;
  return v;
 }
 if(v&&typeof v==='object'&&Array.isArray(v.rows))return v.rows;
 return[];
}
function current(name){
 if(name==='daily')return fy.daily[0]||null;
 const[k,t]=name.split(':'),pool=rows(fy[k]?.[t]);
 return pool.length?pool[(Number(fy.idx[k]?.[t]||0))%pool.length]:null;
}
function chooseDaily(){
 const all=[...fy.fresh.movie,...fy.fresh.series,...fy.fresh.anime].filter(x=>key(x));
 if(!all.length){fy.daily=[];return}
 const d=new Date(),stamp=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));
 fy.daily=[all[stamp%all.length]];
}
function card(x){
 if(!x)return'';
 try{const h=typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):'';if(typeof h==='string'&&h.trim())return h}catch{}
 return'<article class="ct291-card" data-media="'+esc(key(x))+'"><b>'+esc(title(x))+'</b></article>';
}
function poolStatus(name){
 if(name==='daily')return loaded.has('daily')?errors.get('daily')||'ready':'loading';
 const[k,t]=name.split(':'),p=k+':'+t;
 return loaded.has(p)?errors.get(p)||'ready':'loading';
}
function placeholder(name){
 const s=poolStatus(name);
 if(s==='loading')return'<div class="ct388-placeholder ct411-pending"><b>Carregando…</b></div>';
 if(s!=='ready')return'<div class="ct388-placeholder"><b>Falha ao carregar este bloco.</b></div>';
 return'<div class="ct388-placeholder"><b>Sem indicação elegível agora.</b></div>';
}
function actions(name,x){
 if(!x)return'';
 const spec=name.startsWith('watch:')?[['seen','✓ Visto'],['swap','↻ Trocar']]:[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']];
 return'<div class="ct411-actions '+(spec.length===3?'three':'two')+'">'+spec.map(([a,l])=>'<button type="button" class="chip ct411-action" aria-disabled="false" data-ct411-action="'+a+'" data-ct411-slot="'+name+'">'+l+'</button>').join('')+'</div>';
}
function slot(name){
 const x=current(name),type=name==='daily'?'':name.split(':')[1],label=type==='movie'?'Filme':type==='anime'?'Anime':type==='series'?'Série':'';
 return'<div class="ct388-slot" data-ct411-slot="'+name+'">'+(label?'<h3>'+label+'</h3>':'')+'<div class="ct388-cardwrap">'+(x?card(x):placeholder(name))+'</div>'+actions(name,x)+'</div>';
}
function expected(){
 let actions=0,swaps=0;
 for(const name of ['daily','watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime'])if(current(name)){actions+=name.startsWith('watch:')?2:3;swaps++}
 return{actions,swaps};
}
function activateActions(){
 const root=q('[data-ct411-foryou]');if(!root)return false;
 for(const b of qa('[data-ct411-action]',root)){
  b.type='button';b.hidden=false;b.removeAttribute('hidden');b.removeAttribute('disabled');b.removeAttribute('inert');b.setAttribute('aria-disabled','false');
  b.style.setProperty('pointer-events','auto','important');b.style.setProperty('opacity','1','important');b.style.setProperty('cursor','pointer','important');
 }
 const e=expected(),actions=qa('[data-ct411-action]',root).length,swaps=qa('[data-ct411-action="swap"]',root).length;
 document.documentElement.dataset.ct411ActionCount=String(actions);document.documentElement.dataset.ct411SwapCount=String(swaps);
 return actions===e.actions&&swaps===e.swaps;
}
function ownerOk(){
 const root=discoverRoot(),box=q('[data-ct411-foryou]',root);if(!box)return false;
 const e=expected();return qa('[data-ct411-action]',box).length===e.actions&&qa('[data-ct411-action="swap"]',box).length===e.swaps;
}
function scheduleRepair(){
 const token=++ownerToken;
 for(const ms of [0,120,350,800,1600,3200,6500,10000,15000])setTimeout(()=>{if(token!==ownerToken||!isForYou())return;if(!ownerOk())renderForYou(false);else activateActions()},ms);
}
function renderForYou(repair=true){
 if(!isForYou())return false;
 const root=discoverRoot();if(!root)return false;
 root.innerHTML='<div data-ct411-foryou><section class="panel ct388-block"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct388-rail daily">'+slot('daily')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot('watch:'+k)).join('')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>100% novos</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot('fresh:'+k)).join('')+'</div></section></div>';
 root.dataset.ct411Owned='1';document.documentElement.dataset.ct411ForYou=ready?'ready':'loading';activateActions();if(repair)scheduleRepair();return true;
}
function renderSlot(name){
 const root=discoverRoot(),old=qa('[data-ct411-slot]',root).find(x=>x.dataset.ct411Slot===name);if(!old)return renderForYou();
 const t=document.createElement('template');t.innerHTML=slot(name);old.replaceWith(t.content.firstElementChild);activateActions();return true;
}
function showLoading(){
 if(!isForYou())return false;const root=discoverRoot();if(!root)return false;
 root.innerHTML='<div data-ct411-foryou><div class="panel"><div class="empty">Buscando indicação…</div></div></div>';document.documentElement.dataset.ct411ForYou='loading';return true;
}
function showFailure(){
 if(!isForYou())return false;const root=discoverRoot();if(!root)return false;
 root.innerHTML='<div data-ct411-foryou><div class="panel"><div class="empty">Não foi possível carregar as recomendações.<br><button class="chip ct411-action" type="button" data-ct411-retry>Tentar novamente</button></div></div></div>';document.documentElement.dataset.ct411ForYou='error';return true;
}
async function loadPool(group,type,token){
 const id=group+':'+type,name=group==='watch'?'cinetracker_discover_watch_unseen_v396':'cinetracker_discover_fresh_v387';
 try{
  const value=await timeout(rpcCall(name,{p_kind:type,p_limit:24}),12000);
  if(token!==run)return 0;
  const list=unwrapRows(value).filter(x=>key(x));
  fy[group][type]=list;fy.idx[group][type]=0;loaded.add(id);errors.delete(id);
  if(group==='fresh'&&['fresh:movie','fresh:series','fresh:anime'].every(x=>loaded.has(x))){chooseDaily();loaded.add('daily');errors.delete('daily')}
  if(isForYou())renderForYou(false);
  return list.length;
 }catch(e){
  if(token===run){loaded.add(id);errors.set(id,String(e?.message||e||'erro'));if(isForYou()&&[...loaded].some(x=>x!==id))renderForYou(false)}
  throw e;
 }
}
async function loadForYou(force=false){
 if(!authReady()||routeNow()!=='discover')return false;
 if(task&&!force)return task;
 try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}
 const token=++run;
 if(!ready&&!rows(fy.watch.movie).length&&!rows(fy.watch.series).length&&!rows(fy.watch.anime).length&&!rows(fy.fresh.movie).length&&!rows(fy.fresh.series).length&&!rows(fy.fresh.anime).length)showLoading();else renderForYou(false);
 const specs=[['watch','movie'],['watch','series'],['watch','anime'],['fresh','movie'],['fresh','series'],['fresh','anime']];
 const jobs=specs.map(([group,type])=>loadPool(group,type,token));
 task=(async()=>{
  const settled=await Promise.allSettled(jobs);
  if(token!==run)return false;
  if(!loaded.has('daily')){chooseDaily();loaded.add('daily');if(!fy.daily.length&&settled.every(x=>x.status==='rejected'))errors.set('daily','erro')}
  const hasData=[...fy.watch.movie,...fy.watch.series,...fy.watch.anime,...fy.fresh.movie,...fy.fresh.series,...fy.fresh.anime].some(x=>key(x));
  ready=hasData;
  if(hasData){if(isForYou())renderForYou(true);return true}
  showFailure();return false;
 })().finally(()=>{if(token===run)task=null});
 return task;
}
function ex(name){if(!excluded.has(name))excluded.set(name,new Set());return excluded.get(name)}
function swap(name){
 if(actionLocks.has(name))return false;actionLocks.add(name);
 try{
  const cur=current(name),ck=key(cur),seen=ex(name);if(ck)seen.add(ck);
  let pool;if(name==='daily')pool=[...fy.fresh.movie,...fy.fresh.series,...fy.fresh.anime];else{const[k,t]=name.split(':');pool=rows(fy[k]?.[t])}
  let choices=pool.filter(x=>{const k=key(x);return k&&k!==ck&&!seen.has(k)});if(!choices.length)choices=pool.filter(x=>{const k=key(x);return k&&k!==ck});if(!choices.length)return false;
  const item=choices[Math.floor(Math.random()*choices.length)],ik=key(item);seen.add(ik);
  if(name==='daily')fy.daily=[item];else{const[k,t]=name.split(':'),i=fy[k][t].findIndex(x=>key(x)===ik);fy.idx[k][t]=Math.max(0,i)}
  renderSlot(name);return true;
 }finally{actionLocks.delete(name)}
}
function snapshot(){return{daily:[...fy.daily],watch:{movie:[...fy.watch.movie],series:[...fy.watch.series],anime:[...fy.watch.anime]},fresh:{movie:[...fy.fresh.movie],series:[...fy.fresh.series],anime:[...fy.fresh.anime]},idx:{watch:{...fy.idx.watch},fresh:{...fy.idx.fresh}}}}
function restore(s){fy={daily:[...s.daily],watch:{movie:[...s.watch.movie],series:[...s.watch.series],anime:[...s.watch.anime]},fresh:{movie:[...s.fresh.movie],series:[...s.fresh.series],anime:[...s.fresh.anime]},idx:{watch:{...s.idx.watch},fresh:{...s.idx.fresh}}}}
function removeKey(k,action){
 fy.daily=fy.daily.filter(x=>key(x)!==k);
 for(const t of ['movie','series','anime']){
  if(action==='seen')fy.watch[t]=fy.watch[t].filter(x=>key(x)!==k);
  fy.fresh[t]=fy.fresh[t].filter(x=>key(x)!==k);fy.idx.watch[t]=0;fy.idx.fresh[t]=0;
 }
 if(!fy.daily.length)chooseDaily();
}
function act(action,name){
 if(action==='swap')return swap(name);if(actionLocks.has(name))return false;
 const k=key(current(name));if(!k)return false;actionLocks.add(name);const before=snapshot();
 try{
  removeKey(k,action);renderForYou(false);
  const persist=window.__ctR365?.persistDirect;
  if(typeof persist!=='function'){restore(before);renderForYou(false);return false}
  Promise.resolve(persist(action,k)).then(()=>{ready=true}).catch(()=>{restore(before);if(isForYou())renderForYou(true)});
  return true;
 }finally{actionLocks.delete(name)}
}
function enterForYou(force=false){if(!authReady()||routeNow()!=='discover')return false;bind();if(ready&&!force)return renderForYou(true);void loadForYou(force);return true}
function wrapDiscover(api){
 if(!api||typeof api!=='object')return;
 api.loadForYou=loadForYou;if('renderForYou'in api)api.renderForYou=renderForYou;if('enterForYou'in api)api.enterForYou=enterForYou;if('swap'in api)api.swap=swap;if('act'in api)api.act=act;
}
function bind(){
 for(const n of ['__ctR396','__ctR397','__ctR398','__ctR399','__ctR400','__ctR401','__ctR402','__ctR403','__ctR404','__ctR405','__ctR406','__ctR407','__ctR408','__ctR409','__ctR410','__ctR388','__ctR395'])wrapDiscover(window[n]);
 if(window.__ctR319&&typeof window.__ctR319==='object'){
  window.__ctR319.loadForYou=loadForYou;
  if(typeof window.__ctR319.loadDiscover==='function'&&!window.__ctR319.loadDiscover.__ctR411Owned){
   const base=window.__ctR319.loadDiscover.bind(window.__ctR319);
   const wrapped=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?loadForYou(force):base(tab,force)};
   wrapped.__ctR411Owned=true;window.__ctR319.loadDiscover=wrapped;
  }
 }
 if(typeof window.__ctR288LoadDiscover==='function'&&!window.__ctR288LoadDiscover.__ctR411Owned){
  const base=window.__ctR288LoadDiscover;
  const wrapped=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?loadForYou(force):base.call(this,tab,force)};
  wrapped.__ctR411Owned=true;window.__ctR288LoadDiscover=wrapped;
 }
 window.__ctR288PaintForYou=renderForYou;document.documentElement.dataset.ct411Owner='discover-foryou-only';return true;
}
window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const a=t.closest('[data-ct411-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();act(String(a.dataset.ct411Action||''),String(a.dataset.ct411Slot||''));return}
 const retry=t.closest('[data-ct411-retry]');if(retry){e.preventDefault();e.stopImmediatePropagation();void loadForYou(true);return}
 const f=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(f)for(const ms of [0,100,300])setTimeout(()=>{bind();if(routeNow()==='discover')enterForYou(false)},ms);
 const nav=t.closest('[data-nav="discover"]');if(nav)for(const ms of [0,100,300])setTimeout(()=>{bind();if(isForYou())enterForYou(false)},ms);
},true);
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())setTimeout(()=>void loadForYou(true),80)});
window.addEventListener('online',()=>{if(isForYou())void loadForYou(true)});
function readyProbe(n=0){bind();if(authReady()&&isForYou()){enterForYou(false);return}if(n<30)setTimeout(()=>readyProbe(n+1),200)}
window.__ctR411={version:'1.0.202',scope:'discover-foryou-only',loadForYou,renderForYou,enterForYou,swap,act,bind,getForYou:()=>fy};
window.__ctR411Marker='progressive-six-pools-12s-no-composite-complete-actions';
bind();queueMicrotask(bind);setTimeout(()=>readyProbe(0),0);
})();