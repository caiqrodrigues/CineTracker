/* CineTracker Web 1.0.150 r359 — cache-first Home metadata + single-owner Pra Você actions. */
(()=>{
'use strict';
if(window.__ctR359?.version==='1.0.150')return;
window.__ctR359Marker='home-v359-cache-first+foryou-single-slot-direct-actions';
window.__ctR359Scope='home-first-paint-metadata+discover-foryou-actions';
window.__ctR359Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const pending=new Map();
let testBridge=null;

function routeNow359(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function cloneState359(st){
 if(!st)return null;
 return{
  ...st,
  watchPools:{movie:[...rows(st.watchPools?.movie)],series:[...rows(st.watchPools?.series)],anime:[...rows(st.watchPools?.anime)]},
  freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},
  watchIndex:{...(st.watchIndex||{movie:0,series:0,anime:0})},
  freshIndex:{...(st.freshIndex||{movie:0,series:0,anime:0})},
  dailyPool:[...rows(st.dailyPool)]
 };
}
function typeOf359(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function idOf359(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf359(x){const id=idOf359(x);return id>0?(typeOf359(x)==='movie'?'movie':'tv')+':'+id:''}
function normalizeIndex359(v,len){return len>0?Math.min(Math.max(0,Number(v||0)),len-1):0}
function normalizeState359(st){
 for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime']){
  const pool=rows(st?.[bucket+'Pools']?.[kind]);
  st[bucket+'Index']={...(st[bucket+'Index']||{movie:0,series:0,anime:0})};
  st[bucket+'Index'][kind]=normalizeIndex359(st[bucket+'Index'][kind],pool.length);
 }
 st.dailyIndex=normalizeIndex359(st.dailyIndex,rows(st.dailyPool).length);
 return st;
}
function installState359(st){
 normalizeState359(st);
 window.__ctR309Test?.setForYouState?.(st);
 return true;
}
function current359(pool,index){const a=rows(pool);return a.length?a[normalizeIndex359(index,a.length)]:null}
function itemForSlot359(st,name){
 if(!st)return null;
 if(name==='daily')return current359(st.dailyPool,st.dailyIndex);
 const [bucket,kind]=String(name||'').split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
 return current359(st?.[bucket+'Pools']?.[kind],st?.[bucket+'Index']?.[kind]);
}
function removeKey359(list,key){return rows(list).filter(x=>keyOf359(x)!==key)}
function slotByName359(name){
 try{return q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(name||''))+'"]')}catch{return null}
}
function renderGenre359(item,slot){
 const copy=q('.ct336-cardwrap .ct288-copy',slot);if(!copy)return;
 q(':scope > .ct344-primary-genre',copy)?.remove();
 let genre='';try{genre=window.__ctR344?.primaryGenre?.(item)||''}catch{}
 const g=document.createElement('small');g.className='ct344-primary-genre';g.textContent=genre||'Gênero não informado';copy.appendChild(g);
}
function animateSlot359(slot){
 if(!slot)return;
 slot.classList.remove('ct359-enter');void slot.offsetWidth;slot.classList.add('ct359-enter');
 setTimeout(()=>slot.classList.remove('ct359-enter'),180);
}
function renderSlot359(name,{animate=true}={}){
 const slot=slotByName359(name);if(!slot)return false;
 const st=window.__ctR309Test?.state,item=itemForSlot359(st,name);
 if(!item){slot.hidden=true;slot.setAttribute('hidden','');return true}
 slot.hidden=false;slot.removeAttribute('hidden');
 const wrap=q(':scope > .ct336-cardwrap',slot);if(!wrap)return false;
 let html='';try{html=typeof ct288Card==='function'?ct288Card(item,{watch:false,add:false,slot:true}):''}catch{}
 if(!html)return false;
 wrap.innerHTML=html;
 renderGenre359(item,slot);
 try{window.__ctR348?.fixSlot?.(slot,window.__ctR336Test?.fyModel336?.())}catch{}
 try{window.__ctR349?.compact?.()}catch{}
 try{window.__ctR357?.normalizeCards?.(slot)}catch{}
 if(animate)animateSlot359(slot);
 return true;
}
function mutate359(action,key,name){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const before=cloneState359(st),next=cloneState359(st);
 if(action==='swap'){
  if(name==='daily'){
   const pool=rows(next.dailyPool);if(pool.length<2)return null;
   next.dailyIndex=(normalizeIndex359(next.dailyIndex,pool.length)+1)%pool.length;
  }else{
   const [bucket,kind]=String(name||'').split(':');
   if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
   const pool=rows(next?.[bucket+'Pools']?.[kind]);if(pool.length<2)return null;
   const cur=normalizeIndex359(next?.[bucket+'Index']?.[kind],pool.length);
   let idx=(cur+1)%pool.length;
   if(bucket==='watch'&&window.__ctR353?.pickIndex){
    const smart=Number(window.__ctR353.pickIndex(pool,kind,cur));
    if(Number.isInteger(smart)&&smart>=0&&smart<pool.length&&smart!==cur)idx=smart;
   }
   next[bucket+'Index']={...(next[bucket+'Index']||{})};next[bucket+'Index'][kind]=idx;
  }
 }else if(action==='seen'){
  for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime'])next[bucket+'Pools'][kind]=removeKey359(next[bucket+'Pools'][kind],key);
  next.dailyPool=removeKey359(next.dailyPool,key);
 }else if(action==='watchlist'){
  for(const kind of ['movie','series','anime'])next.freshPools[kind]=removeKey359(next.freshPools[kind],key);
  next.dailyPool=removeKey359(next.dailyPool,key);
 }else return null;
 installState359(next);return{before,next};
}
async function persistBackend359(action,key){
 const [type,idRaw]=String(key||'').split(':'),id=Number(idRaw||0);
 if(!['movie','tv'].includes(type)||!(id>0))throw new Error('Mídia inválida');
 if(testBridge){
  if(action==='watchlist'&&typeof testBridge.watchlist==='function')return await testBridge.watchlist(type,id);
  if(action==='seen'&&typeof testBridge.seen==='function')return await testBridge.seen(type,id);
 }
 if(action==='watchlist'){
  if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');
  return await addWatchlist(type,id);
 }
 if(action==='seen'){
  if(typeof markSeen!=='function')throw new Error('Visto indisponível');
  return await markSeen(type,id);
 }
 throw new Error('Ação inválida');
}
async function rememberSwap359(name,key){
 const mapped=String(name||'').startsWith('watch:')?'watchlist:'+String(name).split(':')[1]:name;
 if(!/^((fresh|watchlist):(movie|series|anime))$/.test(String(mapped||'')))return false;
 const [type,idRaw]=String(key||'').split(':'),id=Number(idRaw||0);if(!(id>0))return false;
 try{
  if(testBridge?.swapMemory)return await testBridge.swapMemory(type,id,mapped);
  if(typeof rpc==='function')await rpc('cinetracker_recommendation_record_v113',{p_tmdb_id:id,p_media_type:type,p_slot:mapped,p_action:'swapped'});
  return true;
 }catch{return false}
}
function metaFromTarget359(target){
 const btn=target?.closest?.('button.ct336-action,.ct336-actions button');if(!btn||btn.disabled)return null;
 const slot=btn.closest('[data-ct336-slot]');if(!slot)return null;
 const name=String(slot.dataset.ct336Slot||'');if(!name)return null;
 const item=itemForSlot359(window.__ctR309Test?.state,name);
 const key=keyOf359(item)||String(q('[data-ct288-card]',slot)?.dataset?.ct288Card||'');
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const action=(btn.matches('[data-ct336-swap-only]')||label.includes('trocar'))?'swap':
              (label.includes('watchlist')||btn.dataset.ct336Action==='watchlist')?'watchlist':
              (label.includes('visto')||btn.dataset.ct336Action==='seen')?'seen':'';
 if(!action)return null;
 return{btn,slot,name,key,action};
}
function handleAction359(meta){
 const tx=mutate359(meta.action,meta.key,meta.name);if(!tx)return false;
 const gen=(pending.get(meta.name)||0)+1;pending.set(meta.name,gen);
 if(!renderSlot359(meta.name,{animate:true})){installState359(tx.before);return false}
 document.documentElement.dataset.ct359LastAction=meta.action+':'+meta.name+(meta.key?':'+meta.key:'');
 if(meta.action==='swap'){
  void rememberSwap359(meta.name,meta.key);
  return true;
 }
 void persistBackend359(meta.action,meta.key).catch(e=>{
  if(pending.get(meta.name)===gen){installState359(tx.before);renderSlot359(meta.name,{animate:true})}
  try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}
 });
 return true;
}
function early359(target,event){
 if(!target?.closest||routeNow359()!=='discover'||!target.closest('[data-ct336-foryou]'))return false;
 const meta=metaFromTarget359(target);if(!meta)return false;
 const ok=handleAction359(meta);
 if(ok){event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.()}
 return ok;
}

/* ---------- HOME: DB metadata is authoritative on first paint ---------- */
function cloneRow359(x){try{return typeof ct285CloneRow==='function'?ct285CloneRow(x):{...x}}catch{return{...x}}}
function fastPrepareHome359(payload){
 if(!payload||typeof payload!=='object')return false;
 let list=rows(payload.series);
 try{const d=typeof ct275DedupSeries==='function'?ct275DedupSeries(list):list;if(d?.length)list=d}catch{}
 list=list.map(cloneRow359);
 try{ct285HomePayload=payload}catch{}
 try{ct285CommittedRows=list.map(cloneRow359)}catch{}
 try{ct275SourcePayload=payload}catch{}
 try{ct275CanonicalSeries=list.map(cloneRow359)}catch{}
 payload.__ct359WebPrepared=true;
 window.__ctR359HomePrepared=list.map(cloneRow359);
 return true;
}
async function noHydrate359(){
 document.documentElement.dataset.ct359HomeHydration='cache-first-no-live-hydrate';
 return true;
}
async function backgroundTvRefresh359(){
 try{
  if(testBridge?.refresh)return await testBridge.refresh();
  const base=(()=>{try{return String(typeof SUPABASE_URL!=='undefined'?SUPABASE_URL:(window.SUPABASE_URL||''))}catch{return String(window.SUPABASE_URL||'')}})();
  if(!base||typeof fetch!=='function')return false;
  const headers=(()=>{try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}})();
  const r=await fetch(base+'/functions/v1/ct-refresh-tv-state-user',{method:'POST',headers:{...headers,'content-type':'application/json'},body:'{}'});
  return r.ok;
 }catch{return false}
}
if(window.__ctR343){
 window.__ctR343.prepareHomePayload=fastPrepareHome359;
 window.__ctR343.hydrateHomeDom=noHydrate359;
}
window.__ctR359Early=early359;

const style=document.createElement('style');style.id='ct-web-r359';style.textContent=`
[data-ct336-foryou] .ct359-enter{animation:ct359-enter .14s ease-out both!important}
@keyframes ct359-enter{from{opacity:.62;transform:translateY(2px)}to{opacity:1;transform:none}}
`;document.head.appendChild(style);

window.__ctR359={
 version:'1.0.150',early:early359,handleAction:handleAction359,renderSlot:renderSlot359,fastPrepareHome:fastPrepareHome359,
 backgroundTvRefresh:backgroundTvRefresh359,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR359Test={
 cloneState359,mutate359,itemForSlot359,metaFromTarget359,handleAction359,renderSlot359,fastPrepareHome359,noHydrate359,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get prepared(){return window.__ctR359HomePrepared||[]}
};
})();