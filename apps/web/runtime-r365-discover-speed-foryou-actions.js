/* CineTracker Web 1.0.156 r365 — fast Discover tabs + direct local Pra Você actions. */
(()=>{
'use strict';
if(window.__ctR365?.version==='1.0.156')return;
window.__ctR365Marker='discover-warm-authority+foryou-direct-local-actions+stable-action-row+render-owned-actions';
window.__ctR365Scope='discover-speed+foryou-actions-only';
window.__ctR365Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
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
function poolLen(name){
 const st=window.__ctR309Test?.state;if(!st)return -1;
 if(name==='daily')return Array.isArray(st.dailyPool)?st.dailyPool.length:0;
 const [bucket,kind]=String(name||'').split(':');
 const p=st?.[bucket+'Pools']?.[kind];return Array.isArray(p)?p.length:-1;
}
function mkAction(label,action,name,key){
 const b=document.createElement('button');b.type='button';b.className='chip ct336-action';b.textContent=label;
 if(action==='swap')b.dataset.ct336SwapOnly=name;
 else{b.dataset.ct336Action=action;b.dataset.ct336Swap=name;if(key)b.dataset.ct336Media=key}
 return b;
}
function ensureActionSlot(slot){
 if(!slot)return false;
 const name=String(slot.dataset.ct336Slot||'');if(!name)return false;
 const bucket=name==='daily'?'daily':name.split(':')[0];
 if(!['daily','watch','fresh'].includes(bucket))return false;
 const key=validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)||validKey(q('[data-media]',slot)?.dataset?.media);
 if(!key)return false;
 let row=q(':scope > .ct336-actions',slot);if(!row){row=document.createElement('div');slot.appendChild(row)}
 const spec=bucket==='watch'?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];
 const direct=qa(':scope > button.ct336-action',row);
 const valid=direct.length===spec.length&&direct.every((b,i)=>{
  const [label,action]=spec[i];if(String(b.textContent||'').trim()!==label)return false;
  if(action==='swap')return String(b.dataset.ct336SwapOnly||'')===name;
  return String(b.dataset.ct336Action||'')===action&&String(b.dataset.ct336Media||'')===key&&String(b.dataset.ct336Swap||'')===name;
 });
 if(!valid)row.replaceChildren(...spec.map(([label,action])=>mkAction(label,action,name,key)));
 row.className='ct336-actions '+(bucket==='watch'?'ct336-actions-two':'ct336-actions-three');
 row.dataset.ct336Bucket=bucket;
 const sw=q(':scope > [data-ct336-swap-only]',row);if(sw){const n=poolLen(name);sw.disabled=n>=0&&n<2;sw.hidden=false;sw.style.setProperty('display','flex','important')}
 for(const b of qa(':scope > button.ct336-action',row)){b.type='button';b.hidden=false;b.removeAttribute('hidden');b.removeAttribute('inert');b.style.setProperty('display','flex','important');b.style.setProperty('pointer-events','auto','important')}
 try{window.__ctR348?.styleRow?.(row,q('.ct288-poster,.ct288-empty-poster',slot),spec.length)}catch{}
 armSlot(slot);return true;
}
function ensureAllActions(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 let n=0;for(const slot of qa('[data-ct336-slot]',root))if(ensureActionSlot(slot))n++;
 root.dataset.ct365ActionRows=String(n);return n>0;
}
function repairSoon(){
 ensureAllActions();
 queueMicrotask(ensureAllActions);
 requestAnimationFrame(()=>ensureAllActions());
 setTimeout(ensureAllActions,0);
 setTimeout(ensureAllActions,80);
}
function ownRenderers(){
 const fy=window.__ctR336;
 if(fy&&typeof fy.paintForYou==='function'&&!fy.paintForYou.__ctR365Owned){
  const base=fy.paintForYou;
  const wrapped=function(){
   const out=base.apply(this,arguments);
   ensureAllActions();
   queueMicrotask(ensureAllActions);
   return out;
  };
  wrapped.__ctR365Owned=true;wrapped.__ctR365Base=base;fy.paintForYou=wrapped;
 }
 const r359=window.__ctR359;
 if(r359&&typeof r359.renderSlot==='function'&&!r359.renderSlot.__ctR365Owned){
  const base=r359.renderSlot;
  const wrapped=function(name){
   const out=base.apply(this,arguments);
   ensureActionSlot(slotByName(name));
   queueMicrotask(()=>ensureActionSlot(slotByName(name)));
   return out;
  };
  wrapped.__ctR365Owned=true;wrapped.__ctR365Base=base;r359.renderSlot=wrapped;
 }
 return true;
}
function renderSlot(name){
 const ok=!!window.__ctR359?.renderSlot?.(name,{animate:true});
 queueMicrotask(()=>{armSlot(slotByName(name));ensureActionSlot(slotByName(name))});return ok;
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
  repairSoon();
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
let repairMo=null,repairHost=null;
function bindRepair(){const h=q('[data-ct319-content]');if(!h||h===repairHost)return false;repairMo?.disconnect?.();repairHost=h;repairMo=new MutationObserver(ms=>{if(ms.some(x=>x.addedNodes.length||x.removedNodes.length))repairSoon()});repairMo.observe(h,{subtree:true,childList:true});return true}
ownRenderers();
setTimeout(()=>{ownRenderers();armAll();ensureAllActions();bindRepair()},0);
setTimeout(()=>{ownRenderers();ensureAllActions();bindRepair()},250);
setTimeout(()=>{ensureAllActions()},1000);
window.__ctR365={version:'1.0.156',early,handle,meta,armAll,armSlot,ensureActionSlot,ensureAllActions,ownRenderers,bindRepair,persistDirect,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get clicks(){return clicks}};
window.__ctR365Test={early,handle,meta,armAll,ensureActionSlot,ensureAllActions,ownRenderers,persistDirect,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get clicks(){return clicks}};
})();
