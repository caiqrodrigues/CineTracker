/* CineTracker Web 1.0.151 r360 — repeated Pra Você clicks stay live after every slot repaint. */
(()=>{
'use strict';
if(window.__ctR360?.version==='1.0.151')return;
window.__ctR360Marker='foryou-repeat-clicks+dom-state-resync+slot-stays-live';
window.__ctR360Scope='discover-foryou-actions-only';
window.__ctR360Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const pending=new Map();
let testBridge=null,mo=null,host=null;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function typeOf(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function idOf(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf(x){const id=idOf(x);return id>0?(typeOf(x)==='movie'?'movie':'tv')+':'+id:''}
function validKey(v){return /^(movie|tv):\d+$/.test(String(v||''))?String(v):''}
function cloneState(st){
 if(!st)return null;
 return {...st,
  watchPools:{movie:[...rows(st.watchPools?.movie)],series:[...rows(st.watchPools?.series)],anime:[...rows(st.watchPools?.anime)]},
  freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},
  watchIndex:{...(st.watchIndex||{movie:0,series:0,anime:0})},
  freshIndex:{...(st.freshIndex||{movie:0,series:0,anime:0})},
  dailyPool:[...rows(st.dailyPool)]};
}
function norm(v,len){return len>0?Math.min(Math.max(0,Number(v||0)),len-1):0}
function install(st){
 for(const b of ['watch','fresh'])for(const k of ['movie','series','anime']){
  const p=rows(st?.[b+'Pools']?.[k]);st[b+'Index']={...(st[b+'Index']||{})};st[b+'Index'][k]=norm(st[b+'Index'][k],p.length);
 }
 st.dailyIndex=norm(st.dailyIndex,rows(st.dailyPool).length);
 window.__ctR309Test?.setForYouState?.(st);return true;
}
function visibleKey(slot){return validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)||validKey(q('[data-media]',slot)?.dataset?.media)}
function syncVisible(name,key){
 const st=window.__ctR309Test?.state;if(!st||!key)return false;
 if(name==='daily'){
  const p=rows(st.dailyPool),i=p.findIndex(x=>keyOf(x)===key);
  if(i>=0&&Number(st.dailyIndex||0)!==i){st.dailyIndex=i;window.__ctR309Test?.setForYouState?.(st)}
  return i>=0;
 }
 const [b,k]=String(name||'').split(':');
 if(!['watch','fresh'].includes(b)||!['movie','series','anime'].includes(k))return false;
 const p=rows(st?.[b+'Pools']?.[k]),i=p.findIndex(x=>keyOf(x)===key);
 if(i>=0&&Number(st?.[b+'Index']?.[k]||0)!==i){st[b+'Index']={...(st[b+'Index']||{})};st[b+'Index'][k]=i;window.__ctR309Test?.setForYouState?.(st)}
 return i>=0;
}
function removeKey(a,key){return rows(a).filter(x=>keyOf(x)!==key)}
function mutate(action,key,name){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const before=cloneState(st),next=cloneState(st);
 if(action==='swap'){
  if(name==='daily'){const p=rows(next.dailyPool);if(p.length<2)return null;next.dailyIndex=(norm(next.dailyIndex,p.length)+1)%p.length}
  else{
   const [b,k]=String(name||'').split(':');if(!['watch','fresh'].includes(b)||!['movie','series','anime'].includes(k))return null;
   const p=rows(next?.[b+'Pools']?.[k]);if(p.length<2)return null;next[b+'Index']={...(next[b+'Index']||{})};next[b+'Index'][k]=(norm(next[b+'Index'][k],p.length)+1)%p.length;
  }
 }else if(action==='seen'){
  for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])next[b+'Pools'][k]=removeKey(next[b+'Pools'][k],key);
  next.dailyPool=removeKey(next.dailyPool,key);
 }else if(action==='watchlist'){
  for(const k of ['movie','series','anime'])next.freshPools[k]=removeKey(next.freshPools[k],key);
  next.dailyPool=removeKey(next.dailyPool,key);
 }else return null;
 install(next);return{before,next};
}
function slotByName(name){try{return q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(name||''))+'"]')}catch{return null}}
function keepLive(name){
 const slot=slotByName(name);if(!slot)return false;
 try{window.__ctR348?.fixSlot?.(slot,window.__ctR336Test?.fyModel336?.())}catch{}
 try{window.__ctR349?.compact?.()}catch{}
 const row=q(':scope > .ct336-actions',slot);
 if(row){
  row.style.setProperty('position','relative','important');row.style.setProperty('z-index','30','important');row.style.setProperty('pointer-events','auto','important');
  for(const b of qa(':scope > button',row)){b.style.setProperty('pointer-events','auto','important');b.style.setProperty('cursor','pointer','important')}
 }
 slot.dataset.ct360Live='1';return true;
}
function render(name){const ok=!!window.__ctR359?.renderSlot?.(name,{animate:true});if(ok)keepLive(name);return ok}
async function persist(action,key){
 const [type,idRaw]=String(key||'').split(':'),id=Number(idRaw||0);if(!['movie','tv'].includes(type)||!(id>0))throw new Error('Mídia inválida');
 if(testBridge){if(action==='watchlist'&&testBridge.watchlist)return await testBridge.watchlist(type,id);if(action==='seen'&&testBridge.seen)return await testBridge.seen(type,id)}
 if(action==='watchlist'){if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');return await addWatchlist(type,id)}
 if(action==='seen'){if(typeof markSeen!=='function')throw new Error('Visto indisponível');return await markSeen(type,id)}
 throw new Error('Ação inválida');
}
async function rememberSwap(name,key){
 const mapped=String(name||'').startsWith('watch:')?'watchlist:'+String(name).split(':')[1]:name;
 if(!/^((fresh|watchlist):(movie|series|anime))$/.test(mapped))return false;
 const [type,idRaw]=String(key||'').split(':'),id=Number(idRaw||0);if(!(id>0))return false;
 try{if(testBridge?.swapMemory)return await testBridge.swapMemory(type,id,mapped);if(typeof rpc==='function')await rpc('cinetracker_recommendation_record_v113',{p_tmdb_id:id,p_media_type:type,p_slot:mapped,p_action:'swapped'});return true}catch{return false}
}
function meta(target){
 const btn=target?.closest?.('button.ct336-action,.ct336-actions button');if(!btn||btn.disabled)return null;
 const slot=btn.closest('[data-ct336-slot]');if(!slot)return null;
 const name=String(slot.dataset.ct336Slot||'');if(!name)return null;
 const beforeKey=visibleKey(slot);if(beforeKey)syncVisible(name,beforeKey);
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const action=(btn.matches('[data-ct336-swap-only]')||label.includes('trocar'))?'swap':(btn.dataset.ct336Action==='watchlist'||label.includes('watchlist'))?'watchlist':(btn.dataset.ct336Action==='seen'||label.includes('visto'))?'seen':'';
 if(!action)return null;
 return{btn,slot,name,key:visibleKey(slot)||beforeKey,action};
}
function handle(m){
 if(!m)return false;
 const tx=mutate(m.action,m.key,m.name);if(!tx)return false;
 const gen=(pending.get(m.name)||0)+1;pending.set(m.name,gen);
 if(!render(m.name)){install(tx.before);keepLive(m.name);return false}
 document.documentElement.dataset.ct360LastAction=m.action+':'+m.name+':'+(m.key||'');
 if(m.action==='swap'){void rememberSwap(m.name,m.key);return true}
 void persist(m.action,m.key).catch(e=>{if(pending.get(m.name)===gen){install(tx.before);render(m.name)}try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}});
 return true;
}
function early(target,event){
 if(!target?.closest||routeNow()!=='discover'||!target.closest('[data-ct336-foryou]'))return false;
 const m=meta(target);if(!m)return false;
 const ok=handle(m);if(ok){event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.()}return ok;
}
window.__ctR359Early=early;

function bind(){
 const h=q('[data-ct319-content]');if(!h||h===host)return false;mo?.disconnect?.();host=h;
 mo=new MutationObserver(ms=>{if(ms.some(x=>x.addedNodes.length||x.removedNodes.length))queueMicrotask(()=>qa('[data-ct336-slot]',h).forEach(s=>keepLive(s.dataset.ct336Slot)))});
 mo.observe(h,{subtree:true,childList:true});return true;
}
setTimeout(()=>{bind();qa('[data-ct336-foryou] [data-ct336-slot]').forEach(s=>keepLive(s.dataset.ct336Slot))},0);

const style=document.createElement('style');style.id='ct-web-r360';
style.textContent='[data-ct336-foryou] .ct336-actions{position:relative!important;z-index:30!important;pointer-events:auto!important}[data-ct336-foryou] .ct336-actions>button{pointer-events:auto!important;cursor:pointer!important}';
document.head.appendChild(style);

window.__ctR360={version:'1.0.151',early,handle,meta,render,keepLive,syncVisible,bind,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
window.__ctR360Test={cloneState,mutate,meta,handle,syncVisible,keepLive,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();