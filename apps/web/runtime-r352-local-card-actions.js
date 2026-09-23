/* CineTracker Web 1.0.143 r352 — local optimistic card actions, zero page/section reload. */
(()=>{
'use strict';
if(window.__ctR352?.version==='1.0.143')return;
window.__ctR352Marker='local-card-swap+no-global-repaint+optimistic-background-persist';
window.__ctR352Scope='discover-card-actions-only';
window.__ctR352Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const pendingGen=new Map();
let testBridge=null;

function routeNow352(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function typeOf352(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function idOf352(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf352(x){const id=idOf352(x);return id>0?(typeOf352(x)==='movie'?'movie':'tv')+':'+id:''}
function category352(x){
 try{return window.__ctR309Test?.category?.(x)||(typeOf352(x)==='movie'?'movie':'series')}catch{return typeOf352(x)==='movie'?'movie':'series'}
}
function cloneState352(st){
 if(!st)return null;
 return {
  ...st,
  watchPools:{movie:[...rows(st.watchPools?.movie)],series:[...rows(st.watchPools?.series)],anime:[...rows(st.watchPools?.anime)]},
  freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},
  watchIndex:{...(st.watchIndex||{movie:0,series:0,anime:0})},
  freshIndex:{...(st.freshIndex||{movie:0,series:0,anime:0})},
  dailyPool:[...rows(st.dailyPool)],
  initial:st.initial?{...st.initial,watch:{...(st.initial.watch||{})},fresh:{...(st.initial.fresh||{})}}:st.initial
 };
}
function normalizeIndex352(v,len){return len>0?Math.min(Math.max(0,Number(v||0)),len-1):0}
function normalizeState352(st){
 for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime']){
  const pool=rows(st?.[bucket+'Pools']?.[kind]);
  if(!st[bucket+'Index'])st[bucket+'Index']={movie:0,series:0,anime:0};
  st[bucket+'Index'][kind]=normalizeIndex352(st[bucket+'Index'][kind],pool.length);
 }
 st.dailyIndex=normalizeIndex352(st.dailyIndex,rows(st.dailyPool).length);
 return st;
}
function installState352(st){
 normalizeState352(st);
 window.__ctR309Test?.setForYouState?.(st);
 return true;
}
function current352(pool,index){const a=rows(pool);return a.length?a[normalizeIndex352(index,a.length)]:null}
function itemForSlot352(st,name){
 if(!st)return null;
 if(name==='daily')return current352(st.dailyPool,st.dailyIndex);
 const [bucket,kind]=String(name||'').split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
 return current352(st[bucket+'Pools']?.[kind],st[bucket+'Index']?.[kind]);
}
function removeKey352(list,key){return rows(list).filter(x=>keyOf352(x)!==key)}
function mutate352(action,key,slotName){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const before=cloneState352(st),next=cloneState352(st);
 if(action==='swap'){
  if(slotName==='daily'){
   const pool=rows(next.dailyPool);if(pool.length<2)return null;
   next.dailyIndex=(normalizeIndex352(next.dailyIndex,pool.length)+1)%pool.length;
  }else{
   const [bucket,kind]=String(slotName||'').split(':');
   if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
   const pool=rows(next[bucket+'Pools']?.[kind]);if(pool.length<2)return null;
   next[bucket+'Index'][kind]=(normalizeIndex352(next[bucket+'Index'][kind],pool.length)+1)%pool.length;
  }
 }else if(action==='seen'){
  for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime'])next[bucket+'Pools'][kind]=removeKey352(next[bucket+'Pools'][kind],key);
  next.dailyPool=removeKey352(next.dailyPool,key);
 }else if(action==='watchlist'){
  for(const kind of ['movie','series','anime'])next.freshPools[kind]=removeKey352(next.freshPools[kind],key);
  next.dailyPool=removeKey352(next.dailyPool,key);
 }else return null;
 installState352(next);
 return{before,next};
}
function renderGenre352(item,slot){
 const copy=q('.ct336-cardwrap .ct288-copy',slot);if(!copy)return;
 q(':scope > .ct344-primary-genre',copy)?.remove();
 let genre='';try{genre=window.__ctR344?.primaryGenre?.(item)||''}catch{}
 const g=document.createElement('small');g.className='ct344-primary-genre';g.textContent=genre||'Gênero não informado';copy.appendChild(g);
}
function styleTarget352(slot){
 const poster=q('.ct288-poster,.ct288-empty-poster',slot),state=q('.ct288-state',slot),pr=poster?.getBoundingClientRect?.();
 if(pr&&pr.width>40){
  const w=Math.round(pr.width*1000)/1000+'px';
  for(const k of ['width','min-width','max-width','flex-basis'])slot.style.setProperty(k,w,'important');
  slot.style.setProperty('flex','0 0 '+w,'important');
  const wrap=q('.ct336-cardwrap',slot);if(wrap)for(const k of ['width','min-width','max-width'])wrap.style.setProperty(k,w,'important');
 }
 if(state){
  for(const [k,v] of Object.entries({position:'absolute',top:'8px',right:'8px',bottom:'auto',left:'auto','z-index':'6',margin:'0'}))state.style.setProperty(k,v,'important');
 }
}
function animateSlot352(slot){
 if(!slot)return;
 slot.classList.add('transition-opacity','duration-300','ease-in-out','ct352-swap');
 slot.classList.remove('ct352-swap-in');slot.style.opacity='.58';
 requestAnimationFrame(()=>requestAnimationFrame(()=>{slot.classList.add('ct352-swap-in');slot.style.opacity='1'}));
 setTimeout(()=>{slot.classList.remove('ct352-swap','ct352-swap-in')},320);
}
function renderSlot352(slotName,{animate=true}={}){
 const slot=q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(slotName||''))+'"]');if(!slot)return false;
 const st=window.__ctR309Test?.state,item=itemForSlot352(st,slotName);
 if(!item){
  slot.hidden=true;slot.setAttribute('hidden','');return true;
 }
 slot.hidden=false;slot.removeAttribute('hidden');
 const wrap=q(':scope > .ct336-cardwrap',slot);if(!wrap)return false;
 let html='';try{html=typeof ct288Card==='function'?ct288Card(item,{watch:false,add:false,slot:true}):''}catch{}
 if(!html)return false;
 wrap.innerHTML=html;
 renderGenre352(item,slot);
 try{window.__ctR348?.fixSlot?.(slot,window.__ctR336Test?.fyModel336?.())}catch{}
 styleTarget352(slot);
 if(animate)animateSlot352(slot);
 return true;
}
async function persist352(action,type,id){
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
function actionForYou352(btn){
 if(!btn||btn.disabled)return false;
 const action=String(btn.dataset.ct336Action||''),media=String(btn.dataset.ct336Media||'');
 const slotName=String(btn.dataset.ct336Swap||btn.closest('[data-ct336-slot]')?.dataset?.ct336Slot||'');
 const [type,idRaw]=media.split(':'),id=Number(idRaw||0);
 if(!['watchlist','seen'].includes(action)||!['movie','tv'].includes(type)||!(id>0)||!slotName)return false;
 const tx=mutate352(action,media,slotName);if(!tx)return false;
 const gen=(pendingGen.get(slotName)||0)+1;pendingGen.set(slotName,gen);
 renderSlot352(slotName,{animate:true});
 window.dispatchEvent(new CustomEvent('cinetracker:library-change',{detail:{action,type,tmdb_id:id,optimistic:true}}));
 void persist352(action,type,id).then(()=>{
  window.dispatchEvent(new CustomEvent('cinetracker:library-change',{detail:{action,type,tmdb_id:id,persisted:true}}));
 }).catch(e=>{
  if(pendingGen.get(slotName)===gen){installState352(tx.before);renderSlot352(slotName,{animate:true})}
  try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}
 });
 return true;
}
function swapForYou352(btn){
 if(!btn||btn.disabled)return false;
 const slotName=String(btn.dataset.ct336SwapOnly||btn.closest('[data-ct336-slot]')?.dataset?.ct336Slot||'');if(!slotName)return false;
 const tx=mutate352('swap','',slotName);if(!tx)return false;
 pendingGen.set(slotName,(pendingGen.get(slotName)||0)+1);
 renderSlot352(slotName,{animate:true});
 return true;
}
function publicAction352(btn){
 if(!btn||btn.disabled)return false;
 const action=String(btn.dataset.ct319Action||''),media=String(btn.dataset.media||btn.closest('[data-ct319-item]')?.dataset?.ct319Item||'');
 const [type,idRaw]=media.split(':'),id=Number(idRaw||0);
 if(!['watchlist','seen'].includes(action)||!['movie','tv'].includes(type)||!(id>0))return false;
 const old={text:btn.textContent,disabled:btn.disabled,active:btn.classList.contains('active')};
 btn.classList.add('active');btn.disabled=true;btn.textContent=action==='watchlist'?'✓ Salvo':'✓ Visto';
 window.dispatchEvent(new CustomEvent('cinetracker:library-change',{detail:{action,type,tmdb_id:id,optimistic:true}}));
 void persist352(action,type,id).then(()=>{
  window.dispatchEvent(new CustomEvent('cinetracker:library-change',{detail:{action,type,tmdb_id:id,persisted:true}}));
 }).catch(e=>{
  btn.textContent=old.text;btn.disabled=old.disabled;btn.classList.toggle('active',old.active);
  try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}
 });
 return true;
}
const previousDirect352=window.__ctR351DirectClick;
function directClick352(target,event){
 if(!target?.closest||routeNow352()!=='discover')return false;
 const fy=target.closest('[data-ct336-foryou]');
 if(fy){
  const swap=target.closest('[data-ct336-swap-only]');
  const action=target.closest('[data-ct336-action]');
  if(swap||action){
   event?.preventDefault?.();event?.stopPropagation?.();event?.stopImmediatePropagation?.();
   return swap?swapForYou352(swap):actionForYou352(action);
  }
 }
 const publicBtn=target.closest('[data-ct319-action]');
 if(publicBtn){
  event?.preventDefault?.();event?.stopPropagation?.();event?.stopImmediatePropagation?.();
  return publicAction352(publicBtn);
 }
 return typeof previousDirect352==='function'?previousDirect352(target,event):false;
}
window.__ctR351DirectClick=directClick352;

const previousEarly352=window.__ctR336EarlyHandle;
window.__ctR336EarlyHandle=function(target,event){
 if(directClick352(target,event))return true;
 return typeof previousEarly352==='function'?previousEarly352(target,event):false;
};

const style=document.createElement('style');style.id='ct-web-r352';style.textContent=`
[data-ct336-foryou] .transition-opacity{transition-property:opacity!important}
[data-ct336-foryou] .duration-300{transition-duration:300ms!important}
[data-ct336-foryou] .ease-in-out{transition-timing-function:ease-in-out!important}
[data-ct336-foryou] .ct352-swap{will-change:opacity!important}
[data-ct319-action].active{opacity:.82!important}
`;document.head.appendChild(style);

window.__ctR352={
 version:'1.0.143',directClick:directClick352,action:actionForYou352,swap:swapForYou352,renderSlot:renderSlot352,publicAction:publicAction352,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR352Test={
 cloneState352,mutate352,itemForSlot352,renderSlot352,actionForYou352,swapForYou352,publicAction352,directClick352,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
})();