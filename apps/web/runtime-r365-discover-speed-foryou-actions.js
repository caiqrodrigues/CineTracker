/* CineTracker Web 1.0.156 r365 — fast Discover tabs + direct local Pra Você actions. */
(()=>{
'use strict';
if(window.__ctR365?.version==='1.0.156')return;
window.__ctR365Marker='discover-warm-authority+foryou-direct-local-actions';
window.__ctR365Scope='discover-speed+foryou-actions-only';
window.__ctR365Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const pending=new Map();
let clicks=0,testBridge=null;
function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function validKey(v){return /^(movie|tv):[1-9]\d*$/.test(String(v||''))?String(v):''}
function slotByName(name){try{return q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(name||''))+'"]')}catch{return null}}
function armSlot(slot){
 if(!slot)return false;
 const row=q(':scope > .ct336-actions',slot);if(row){row.removeAttribute('inert');row.style.setProperty('pointer-events','auto','important')}
 for(const b of slot.querySelectorAll('.ct336-actions button')){
  b.type='button';b.removeAttribute('inert');b.removeAttribute('aria-disabled');
  b.style.setProperty('pointer-events','auto','important');b.style.setProperty('cursor','pointer','important');
 }
 return true;
}
function armAll(){const root=q('[data-ct336-foryou]');if(!root)return false;for(const s of root.querySelectorAll('[data-ct336-slot]'))armSlot(s);return true}
function actionOf(btn){
 const label=String(btn?.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(btn?.matches?.('[data-ct336-swap-only]')||label.includes('trocar'))return'swap';
 if(btn?.dataset?.ct336Action==='watchlist'||label.includes('watchlist'))return'watchlist';
 if(btn?.dataset?.ct336Action==='seen'||label.includes('visto'))return'seen';
 return'';
}
function meta(target){
 if(!target?.closest||routeNow()!=='discover'||!target.closest('[data-ct336-foryou]'))return null;
 const btn=target.closest('.ct336-actions button');if(!btn)return null;
 const slot=btn.closest('[data-ct336-slot]');if(!slot)return null;
 const name=String(slot.dataset.ct336Slot||''),action=actionOf(btn);if(!name||!action)return null;
 if(action==='watchlist'&&name.startsWith('watch:'))return null;
 const key=validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)||validKey(btn.dataset.ct336Media)||validKey(q('[data-media]',slot)?.dataset?.media);
 if(action!=='swap'&&!key)return null;
 armSlot(slot);return{btn,slot,name,key,action};
}
function renderSlot(name){
 const ok=!!window.__ctR359?.renderSlot?.(name,{animate:true});
 queueMicrotask(()=>armSlot(slotByName(name)));return ok;
}
async function persistDirect(action,key){
 if(testBridge?.persist)return await testBridge.persist(action,key);
 const [type,idRaw]=String(key||'').split(':'),id=Number(idRaw||0);
 if(!['movie','tv'].includes(type)||!(id>0))throw new Error('Mídia inválida');
 if(typeof ensureMedia!=='function'||typeof api!=='function')throw new Error('Persistência indisponível');
 const m=await ensureMedia(type,id);
 if(action==='watchlist'){
  const ex=await api(`media_overrides?select=id&media_id=eq.${m.id}&state=eq.AddedToWatchlist&limit=1`).catch(()=>[]);
  if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({media_id:m.id,state:'AddedToWatchlist',origin:'manual'})});
 }else if(action==='seen'){
  if(type==='movie'){
   if(typeof rpc!=='function')throw new Error('Persistência indisponível');
   await rpc('cinetracker_mark_watch_v0994',{p_media_id:m.id,p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:m.title||null,p_runtime_minutes:null,p_released_episodes:null,p_watched_at:new Date().toISOString()});
  }else{
   const ex=await api(`media_overrides?select=id&media_id=eq.${m.id}&state=eq.AlreadySeen&limit=1`).catch(()=>[]);
   if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({media_id:m.id,state:'AlreadySeen',origin:'manual'})});
  }
 }else throw new Error('Ação inválida');
 try{homeCache=null}catch{}try{profileCache=null}catch{}
 try{toast(action==='watchlist'?'Adicionado à Watchlist.':'Biblioteca atualizada.')}catch{}
 return true;
}
function rollback(name,before){try{window.__ctR309Test?.setForYouState?.(before)}catch{}renderSlot(name)}
function refillAfter(m){
 try{window.__ctR363Test?.mutate?.(m.action,m.key,m.name)}catch{}
 void Promise.resolve(window.__ctR319?.personal?.(true)).catch(()=>{});
 try{void window.__ctR363?.refill?.(m.name,{force:true})}catch{}
 if(m.action==='watchlist'){
  const kind=String(m.name||'').split(':')[1];
  if(['movie','series','anime'].includes(kind))try{void window.__ctR363?.refill?.('watch:'+kind,{force:true})}catch{}
 }
}
function handle(m){
 if(!m)return false;
 if(m.action==='swap'){
  const ok=!!window.__ctR363?.handle?.(m);if(ok)clicks++;return ok;
 }
 const mutate=window.__ctR359Test?.mutate359;if(typeof mutate!=='function')return false;
 const tx=mutate(m.action,m.key,m.name);if(!tx)return false;
 const gen=(pending.get(m.name)||0)+1;pending.set(m.name,gen);
 if(!renderSlot(m.name)){rollback(m.name,tx.before);return false}
 clicks++;
 void persistDirect(m.action,m.key).then(()=>{
  if(pending.get(m.name)!==gen)return;
  refillAfter(m);
 }).catch(e=>{
  if(pending.get(m.name)===gen)rollback(m.name,tx.before);
  try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}
 });
 return true;
}
function early(target,event){
 const m=meta(target);if(!m)return false;
 const ok=handle(m);
 if(ok){
  event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
  document.documentElement.dataset.ct365LastAction=m.action+':'+m.name+':'+(m.key||'');
  document.documentElement.dataset.ct365Clicks=String(clicks);
 }
 return ok;
}
window.__ctR358Early=early;
window.__ctR359Early=early;
window.__ctR336EarlyHandle=early;
if(window.__ctR360)window.__ctR360.early=early;
if(window.__ctR361)window.__ctR361.early=early;
if(window.__ctR362)window.__ctR362.early=early;
setTimeout(armAll,0);
window.__ctR365={version:'1.0.156',early,handle,meta,armAll,armSlot,persistDirect,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get clicks(){return clicks}};
window.__ctR365Test={early,handle,meta,armAll,persistDirect,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get clicks(){return clicks}};
})();
