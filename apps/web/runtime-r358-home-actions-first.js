/* CineTracker Web 1.0.149 r358 — true first-capture Pra Você actions + Home ready gate. */
(()=>{
'use strict';
if(window.__ctR358?.version==='1.0.149')return;
window.__ctR358Marker='true-first-capture-foryou-actions+home-ready-before-reveal';
window.__ctR358Scope='discover-foryou-actions+home-startup-ready';
window.__ctR358Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const validKey=v=>/^(movie|tv):\d+$/.test(String(v||''))?String(v):'';
const pending=new Map();
let testBridge=null,homePrimeTask=null;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function repairButton(btn){
 const slot=btn?.closest?.('[data-ct336-slot]');if(!slot)return null;
 const name=String(slot.dataset.ct336Slot||'');if(!name)return null;
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(btn.matches('[data-ct336-swap-only]')||label.includes('trocar')){
  btn.dataset.ct336SwapOnly=name;
  return{slot,name,key:'',action:'swap'};
 }
 const action=label.includes('watchlist')?'watchlist':label.includes('visto')?'seen':String(btn.dataset.ct336Action||'');
 const key=validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)||validKey(btn.dataset.ct336Media);
 if(!['watchlist','seen'].includes(action)||!key)return null;
 btn.dataset.ct336Action=action;btn.dataset.ct336Swap=name;btn.dataset.ct336Media=key;
 try{window.__ctR356Test?.syncStateToVisible?.(name,key)}catch{}
 return{slot,name,key,action};
}
function renderLocal(name){
 const ok=!!window.__ctR352?.renderSlot?.(name,{animate:true});
 if(ok){
  try{window.__ctR348?.fixAll?.()}catch{}
  try{window.__ctR349?.compact?.()}catch{}
  try{window.__ctR357?.normalizeCards?.(slotByName(name))}catch{}
 }
 return ok;
}
function slotByName(name){
 try{return q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(name||''))+'"]')}catch{return null}
}
async function persistBackend(action,key){
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
function mutateLocal(meta){
 const mutate=window.__ctR352Test?.mutate352;
 if(typeof mutate!=='function')return null;
 return mutate(meta.action,meta.key,meta.name);
}
function handleAction(meta){
 const tx=mutateLocal(meta);if(!tx)return false;
 const gen=(pending.get(meta.name)||0)+1;pending.set(meta.name,gen);
 if(!renderLocal(meta.name)){
  try{window.__ctR309Test?.setForYouState?.(tx.before)}catch{}
  return false;
 }
 if(meta.action!=='swap'){
  void persistBackend(meta.action,meta.key).catch(e=>{
   if(pending.get(meta.name)===gen){
    try{window.__ctR309Test?.setForYouState?.(tx.before)}catch{}
    renderLocal(meta.name);
   }
   try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}
  });
 }
 document.documentElement.dataset.ct358LastAction=meta.action+':'+meta.name+(meta.key?':'+meta.key:'');
 return true;
}

/* This function is called by a capture listener prepended before every legacy listener in build-r358. */
function early358(target,event){
 if(!target?.closest||routeNow()!=='discover')return false;
 if(!target.closest('[data-ct336-foryou]'))return false;
 const btn=target.closest('button.ct336-action,.ct336-actions button');
 if(!btn||btn.disabled)return false;
 const meta=repairButton(btn);if(!meta)return false;
 const ok=handleAction(meta);
 if(ok){
  event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
  return true;
 }
 return false;
}
window.__ctR358Early=early358;

function supabaseBase(){
 try{return String(typeof SUPABASE_URL!=='undefined'?SUPABASE_URL:(window.SUPABASE_URL||''))}catch{return String(window.SUPABASE_URL||'')}
}
function auth358(){try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}}
async function primeTvState(){
 if(homePrimeTask)return homePrimeTask;
 homePrimeTask=(async()=>{
  document.documentElement.dataset.ct358HomePrime='loading';
  try{
   let out;
   if(testBridge?.primeTv)out=await testBridge.primeTv();
   else{
    const base=supabaseBase();
    if(base){
     const r=await fetch(base+'/functions/v1/ct-refresh-tv-state-user',{
      method:'POST',headers:{...auth358(),'content-type':'application/json'},body:'{}'
     });
     if(!r.ok)throw new Error('TV refresh '+r.status);
     out=await r.json();
    }else out={skipped:true};
   }
   try{sessionStorage.setItem('ct325:tv-refresh-at',String(Date.now()))}catch{}
   try{ct275ShowCache?.clear?.();ct275SeasonCache?.clear?.()}catch{}
   try{homeCache=null;window.__ct0997PreloadedHomeLive=null}catch{}
   document.documentElement.dataset.ct358HomePrime='ready';
   return out||{};
  }catch(e){
   try{sessionStorage.setItem('ct325:tv-refresh-at',String(Date.now()))}catch{}
   document.documentElement.dataset.ct358HomePrime='failed';
   document.documentElement.dataset.ct358HomePrimeError=String(e?.message||e||'').slice(0,160);
   return{failed:true};
  }finally{homePrimeTask=null}
 })();
 return homePrimeTask;
}
function incompleteHomeCards(){
 return qa('[data-home] [data-ct274-episode-card]').filter(el=>{
  const t=String(q('.ct274-meta',el)?.textContent||'');
  return /Ep:\s*Episódio\s*\d+/i.test(t)||/⭐\s*[—-]/.test(t)||/\s•\s*[—-]\s*$/.test(t);
 });
}
async function hydrateIncomplete(){
 let list=incompleteHomeCards();if(!list.length)return 0;
 if(testBridge?.hydrate){
  await testBridge.hydrate(list);return incompleteHomeCards().length;
 }
 if(typeof ct274HydrateEpisodeCard==='function'){
  try{
   if(typeof ct274MapLimit==='function')await ct274MapLimit(list,8,ct274HydrateEpisodeCard);
   else await Promise.all(list.map(ct274HydrateEpisodeCard));
  }catch{}
 }
 return incompleteHomeCards().length;
}
async function waitHomeReady({timeout=12000}={}){
 const start=Date.now();let left=incompleteHomeCards().length;
 while(routeNow()==='home'&&left>0&&Date.now()-start<timeout){
  try{await window.__ctR343?.hydrateHomeDom?.()}catch{}
  left=await hydrateIncomplete();
  if(left>0)await sleep(140);
 }
 document.documentElement.dataset.ct358HomeIncomplete=String(left);
 return left===0;
}
function showHomeGate(){
 document.documentElement.dataset.ct358HomeGate='loading';
}
function releaseHomeGate(){
 delete document.documentElement.dataset.ct358HomeGate;
 document.documentElement.dataset.ct358HomeReady='1';
}

/* Put TV refresh before ct274's first real Home paint. */
try{
 const baseHome358=ct274RenderHome;
 ct274RenderHome=async function(seq){
  showHomeGate();
  try{
   if(typeof setApp==='function'&&typeof shell==='function'&&typeof loading==='function'){
    setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home>'+loading('Carregando Home completa...')+'</div>'));
   }
  }catch{}
  await primeTvState();
  if(routeNow()!=='home')return false;
  const out=await baseHome358.apply(this,arguments);
  if(routeNow()!=='home')return out;
  await waitHomeReady({timeout:12000});
  releaseHomeGate();
  return out;
 };
}catch{}

const style=document.createElement('style');style.id='ct-web-r358';style.textContent=`
html[data-ct358-home-gate="loading"] [data-home]{position:relative!important;min-height:150px!important}
html[data-ct358-home-gate="loading"] [data-home]>*{visibility:hidden!important}
html[data-ct358-home-gate="loading"] [data-home]::before{
 content:'Carregando Home completa…';visibility:visible!important;display:block!important;padding:18px!important;opacity:.78!important
}
[data-ct336-foryou] .ct336-actions>button{pointer-events:auto!important;cursor:pointer!important}
`;document.head.appendChild(style);

window.__ctR358={
 version:'1.0.149',early:early358,repairButton,handleAction,primeTvState,waitHomeReady,incompleteHomeCards,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR358Test={repairButton,early358,handleAction,primeTvState,waitHomeReady,incompleteHomeCards,hydrateIncomplete,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();