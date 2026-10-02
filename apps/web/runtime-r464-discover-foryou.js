/* CineTracker Web 1.0.254 r464 — Descobrir > Pra Você single visible owner. */
(()=>{
'use strict';
if(window.__ctR464?.version==='1.0.254')return;
window.__ctR464Marker='discover-foryou-visible-owner-v421';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const rpcCall=(name,args)=>{if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};
const unwrap=v=>v&&typeof v==='object'&&!Array.isArray(v)&&v.data!=null?v.data:v;
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
const root464=()=>q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]')||q('[data-discover-content]');
const normalizeText=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const isForYouControl=el=>{
 const b=el?.closest?.('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab],button');
 if(!b)return false;
 const values=[b.dataset?.ct319Tab,b.dataset?.ct315Tab,b.dataset?.ct263DiscoverTab,b.dataset?.discoverTab,b.getAttribute?.('data-tab'),b.textContent];
 return values.some(v=>{const s=normalizeText(v);return s==='foryou'||s==='pra voce'||s==='para voce'});
};
const stateSaysForYou=()=>{
 try{const t=String(window.__ctR288R263?.discover263?.tab||'');if(t)return t==='foryou'}catch{}
 const active=qa('[data-ct319-tab].active,[data-ct315-tab].active,[data-ct263-discover-tab].active,[data-discover-tab].active').find(Boolean);
 return active?isForYouControl(active):false;
};
const isForYou=()=>routeNow()==='discover'&&stateSaysForYou();
const setForYouState=()=>{try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}};
const keyOf=x=>{const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;if(!id)return'';return (String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv')+':'+id};
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const posterOf=x=>String(x?.poster_path||x?.raw_tmdb?.poster_path||'');
const emptyState=()=>({daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}});
let state=emptyState(),loadTask=null,loadToken=0;
const locks=new Set(),excluded=new Map();
function current(slot){
 if(slot==='daily'){const a=rows(state.daily);return a.length?a[state.idx.daily%a.length]:null}
 const [group,kind]=slot.split(':');const a=rows(state[group]?.[kind]);const i=Number(state.idx?.[group]?.[kind]||0);return a.length?a[i%a.length]:null;
}
function cardHtml(x){
 if(!x)return '<div class="ct388-placeholder ct464-terminal"><b>Sem indicação elegível agora.</b></div>';
 try{if(typeof ct288Card==='function'){const h=ct288Card(x,{watch:false,add:false,slot:true});if(typeof h==='string'&&h.trim())return h}}catch{}
 const p=posterOf(x),src=p?(p.startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';
 return '<article class="ct291-card ct464-fallback" data-media="'+esc(keyOf(x))+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><b>'+esc(titleOf(x))+'</b></article>';
}
function actionsHtml(slot,x){
 if(!x)return'';
 const list=slot.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];
 return '<div class="ct388-actions '+(slot.startsWith('watch:')?'two':'three')+'">'+list.map(([label,action])=>'<button type="button" class="chip" data-ct464-action="'+action+'" data-ct464-slot="'+slot+'">'+label+'</button>').join('')+'</div>';
}
function slotHtml(slot){
 const x=current(slot),kind=slot==='daily'?(x?(String(x?.media_type)==='movie'?'movie':String(x?.media_kind)==='anime'?'anime':'series'):'movie'):slot.split(':')[1];
 return '<div class="ct388-slot" data-ct464-slot="'+slot+'" data-ct388-kind="'+kind+'">'+(slot==='daily'?'':'<h3>'+(kind==='movie'?'Filme':kind==='anime'?'Anime':'Série')+'</h3>')+'<div class="ct388-cardwrap">'+cardHtml(x)+'</div>'+actionsHtml(slot,x)+'</div>';
}
function render(){
 if(!isForYou())return false;const root=root464();if(!root)return false;
 root.innerHTML='<div data-ct464-foryou><section class="panel ct388-block"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct388-rail daily">'+slotHtml('daily')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slotHtml('watch:'+k)).join('')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>100% Novos</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slotHtml('fresh:'+k)).join('')+'</div></section></div>';
 root.dataset.ct464Owned='1';document.documentElement.dataset.ct464ForYou='ready';document.documentElement.dataset.ct464SwapCount=String(qa('[data-ct464-action="swap"]',root).length);return true;
}
function renderLoading(){const root=root464();if(!root)return false;root.innerHTML='<div data-ct464-foryou><div class="panel"><div class="empty">Buscando indicação…</div></div></div>';root.dataset.ct464Owned='1';document.documentElement.dataset.ct464ForYou='loading';return true}
async function fetchPool(group,kind){
 const name=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';
 const limit=group==='watch'?30:48;
 try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),7000)))}catch{return[]}
}
function chooseDaily(){
 const all=[...state.fresh.movie,...state.fresh.series,...state.fresh.anime].filter(x=>keyOf(x));
 if(!all.length){state.daily=[];return}
 const d=new Date(),seed=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));
 state.daily=[all[seed%all.length]];state.idx.daily=0;
}
async function load(force=false){
 setForYouState();if(routeNow()!=='discover')return false;if(loadTask&&!force)return loadTask;
 const token=++loadToken;if(!q('[data-ct464-foryou]',root464()))renderLoading();
 loadTask=(async()=>{
  const kinds=['movie','series','anime'];
  const specs=[...kinds.map(k=>['watch',k]),...kinds.map(k=>['fresh',k])];
  const settled=await Promise.allSettled(specs.map(([g,k])=>fetchPool(g,k)));
  if(token!==loadToken||routeNow()!=='discover')return false;
  const next=emptyState();
  settled.forEach((r,i)=>{if(r.status==='fulfilled')next[specs[i][0]][specs[i][1]]=rows(r.value)});
  state=next;chooseDaily();render();
  document.documentElement.dataset.ct464PoolCounts=JSON.stringify({watch:Object.fromEntries(kinds.map(k=>[k,state.watch[k].length])),fresh:Object.fromEntries(kinds.map(k=>[k,state.fresh[k].length]))});
  return true;
 })().catch(()=>{if(token===loadToken){state=emptyState();render();document.documentElement.dataset.ct464ForYou='error'}return false}).finally(()=>{if(token===loadToken)loadTask=null});
 return loadTask;
}
const exclusion=slot=>{if(!excluded.has(slot))excluded.set(slot,new Set());return excluded.get(slot)};
function swap(slot){
 if(locks.has(slot))return false;locks.add(slot);
 try{
  const cur=current(slot),curKey=keyOf(cur),ex=exclusion(slot);if(curKey)ex.add(curKey);
  let pool;if(slot==='daily')pool=[...state.fresh.movie,...state.fresh.series,...state.fresh.anime];else{const[g,k]=slot.split(':');pool=rows(state[g]?.[k])}
  let eligible=pool.filter(x=>{const k=keyOf(x);return k&&k!==curKey&&!ex.has(k)});if(!eligible.length)eligible=pool.filter(x=>keyOf(x)&&keyOf(x)!==curKey);if(!eligible.length)return false;
  const item=eligible[Math.floor(Math.random()*eligible.length)],key=keyOf(item);ex.add(key);
  if(slot==='daily'){state.daily=[item];state.idx.daily=0}else{const[g,k]=slot.split(':');state.idx[g][k]=Math.max(0,state[g][k].findIndex(x=>keyOf(x)===key))}
  render();return true;
 }finally{locks.delete(slot)}
}
function removeKey(key,mode){
 state.daily=state.daily.filter(x=>keyOf(x)!==key);
 for(const k of ['movie','series','anime']){
  if(mode==='seen')state.watch[k]=state.watch[k].filter(x=>keyOf(x)!==key);
  state.fresh[k]=state.fresh[k].filter(x=>keyOf(x)!==key);state.idx.watch[k]=0;state.idx.fresh[k]=0;
 }
 state.idx.daily=0;if(!state.daily.length)chooseDaily();
}
function persist(action,key){try{return Promise.resolve(window.__ctR365?.persistDirect?.(action,key))}catch{return Promise.resolve(false)}}
function act(action,slot){
 if(action==='swap')return swap(slot);if(locks.has(slot))return false;
 const x=current(slot),key=keyOf(x);if(!key)return false;locks.add(slot);
 removeKey(key,action);render();persist(action,key).catch(()=>{}).finally(()=>locks.delete(slot));return true;
}
function activate(){
 setForYouState();qa('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]').forEach(b=>{if(isForYouControl(b))b.classList.add('active')});
 renderLoading();void load(true);return true;
}
window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const a=t.closest('[data-ct464-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();act(String(a.dataset.ct464Action||''),String(a.dataset.ct464Slot||''));return}
 if(routeNow()==='discover'&&isForYouControl(t)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();activate()}
},true);
for(const ev of ['pointerdown','touchstart'])window.addEventListener(ev,e=>{if(routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},{capture:true,passive:true});
window.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(isForYou())activate()},0));
window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>{if(isForYou())void load(true)},0));
for(const n of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[n]=load;
for(const ms of [0,250,800,1800])setTimeout(()=>{if(isForYou())activate()},ms);
window.__ctR464={version:'1.0.254',scope:'discover-foryou-only',load,render,swap,activate};
})();