/* Android 1.0.35 r277 — ONLY Descobrir > Pra Você.
   One action owner per card. No interaction with Home, Sports, F1 or Web. */
(()=>{
'use strict';
if(window.__ctR277AndroidV1035)return;
try{
window.__ctR277AndroidV1035='single-owner-seven-slots+real-media-params+eligible-swap';
const labels={
 'daily:movie':'Filme','watchlist:movie':'Filme','watchlist:series':'Série',
 'watchlist:anime':'Anime','fresh:movie':'Filme','fresh:series':'Série','fresh:anime':'Anime'
};
const keys=Object.keys(labels),picked=new Map(),busy=new Set();
const kindOf=k=>k.endsWith(':movie')?'movie':k.endsWith(':anime')?'anime':'series';
const watchKind=k=>k.startsWith('watchlist:');
const mediaRef=x=>{const id=Number(ct186Id(x));return Number.isSafeInteger(id)&&id>0?(ct186Type(x)==='movie'?'movie':'tv')+':'+id:''};
const actualUser=()=>String(session?.user?.id||user?.id||'');
let owner=actualUser(),auditing=null;
const q=(sel,root=document)=>root?.querySelector?.(sel)||null;
function contentAllowed(x,key,ctx){
 if(!x||!ctx||!mediaRef(x))return false;
 const kind=kindOf(key),type=ct186Type(x),anime=ct186Anime(x);
 if(kind==='movie'?(type!=='movie'||anime):kind==='anime'?(type!=='tv'||!anime):(type!=='tv'||anime))return false;
 const allowed=window.__ctR265Test?.allowed;
 if(typeof allowed!=='function'||!allowed(x)||!ct186Quality(x))return false;
 // Strict authenticated exclusions including watched episodes, aliases
 // and user-supplied manual states; never fake a Watchlist candidate.
 if(watchKind(key))return ct186WatchEligible(x,ctx);
 return ct186FreshEligible(x,ctx);
}
function poolFor(data,key,ctx){
 const kind=kindOf(key),bag=watchKind(key)?data?._ct186_watchlist:data?._ct186_fresh;
 return ct186UniqueRows(Array.isArray(bag?.[kind])?bag[kind]:[]).filter(x=>contentAllowed(x,key,ctx));
}
function selectedData(){return ct186ForYouData||ct166ForYouData||null}
function isVisible(){return route()==='discover'&&discoverState?.tab==='foryou'}
function mediaIn(slot){return String(q('button[data-media]',slot)?.dataset?.media||'')}
function getContext(){
 const ctx=ct186ContextValue;
 if(ctx)return ctx;
 if(!auditing&&isVisible()&&session){
  auditing=Promise.resolve(ct186Context(false)).then(()=>requestAnimationFrame(reconcile)).catch(()=>{}).finally(()=>{auditing=null});
 }
 return null;
}
function emptySlot(slot,key){
 if(!slot)return;
 // Empty categories remain empty. "Da sua Watchlist" is never filled
 // with unrelated TMDB candidates.
 slot.querySelector('.discover-card')?.remove();
 let message=q('[data-ct277-empty]',slot);
 if(!message){
  message=document.createElement('div');
  message.className='ct277-empty';message.dataset.ct277Empty=key;
  slot.appendChild(message);
 }
 message.textContent=watchKind(key)?'Nenhum título não assistido nesta categoria da Watchlist.':'Nenhuma indicação elegível nesta categoria.';
 slot.querySelectorAll('.ct166-swap,[data-ct237-swap],.ct275-mark-seen,.ct274-mark-seen').forEach(el=>el.remove());
}
function mount(slot,key,item){
 const ref=mediaRef(item);if(!ref)return slot;
 const wrapper=document.createElement('div');
 wrapper.innerHTML=ct186Slot(labels[key],item,key,1);
 const replacement=wrapper.firstElementChild;
 if(!replacement)return slot;
 slot.replaceWith(replacement);
 return replacement;
}
function controls(slot,key,item,nChoices){
 const card=q('.discover-card',slot),ref=mediaRef(item);
 if(!card||!ref)return;
 // Remove EVERY legacy button source — including headers and their
 // old data attributes. Delegated legacy listeners cannot fire.
 slot.querySelectorAll(
  '.discover-watch,.ct166-swap,[data-ct237-swap],.ct274-mark-seen,.ct275-mark-seen,[data-ct275-watchlist],[data-ct274-seen]'
 ).forEach(el=>el.remove());
 // The old 42px action bar remains even after removing its buttons.
 // Remove that dead space so the single new bar follows the caption.
 card.querySelector('.ct169-card-actions')?.remove();
 let bar=q('.ct277-actions',card);
 if(!bar){bar=document.createElement('div');bar.className='ct277-actions';card.appendChild(bar)}
 const list=watchKind(key)?[['seen','✓','Marcar como visto'],['swap','↻','Trocar indicação']]:
  [['watchlist','+','Adicionar à Watchlist'],['seen','✓','Marcar como visto'],['swap','↻','Trocar indicação']];
 const fingerprint=ref+'|'+key+'|'+nChoices+'|'+(busy.has(key)?'busy':'ready');
 if(bar.dataset.ct277Fingerprint===fingerprint)return;
 bar.dataset.ct277Fingerprint=fingerprint;
 bar.innerHTML=list.map(([act,glyph,label])=>{
  const disabled=(act==='swap'&&nChoices<2)||busy.has(key);
  return '<button type="button" class="ct277-control ct277-'+act+'" data-ct277-action="'+act+
    '" data-ct277-slot="'+key+'" data-ct277-ref="'+ref+'" aria-label="'+label+
    '" title="'+(disabled&&act==='swap'?'Sem outra indicação elegível':label)+'"'+
    (disabled?' disabled':'')+'>'+glyph+'</button>';
 }).join('');
}
function reconcile(){
 if(!isVisible()||!session)return;
 const currentUser=actualUser();
 if(owner!==currentUser){owner=currentUser;picked.clear();busy.clear()}
 const root=q('[data-discover-content]');
 const data=selectedData(),ctx=getContext();
 if(!root||!data||!ctx)return;
 let all;
 try{all=ct186Select(data)}catch{return}
 const suggested={
  'daily:movie':all.daily,'watchlist:movie':all.wm,'watchlist:series':all.ws,
  'watchlist:anime':all.wa,'fresh:movie':all.fm,'fresh:series':all.fs,'fresh:anime':all.fa
 };
 const occupied=new Set();
 for(const key of keys){
  let slot=q('[data-ct241-slot-key="'+key+'"]',root);
  if(!slot)continue;
  const pool=poolFor(data,key,ctx);
  const usable=pool.filter(x=>!occupied.has(mediaRef(x)));
  const override=picked.get(key);
  let candidate=usable.find(x=>mediaRef(x)===override)||usable.find(x=>mediaRef(x)===mediaIn(slot))||
   usable.find(x=>mediaRef(x)===mediaRef(suggested[key]))||usable[0]||null;
  if(!candidate){
   picked.delete(key);emptySlot(slot,key);continue;
  }
  const ref=mediaRef(candidate);
  // Distinct Daily and 100%-new Movie, even when another renderer was
  // holding a stale selection. Never use a watched or Watchlist title.
  occupied.add(ref);
  if(mediaIn(slot)!==ref)slot=mount(slot,key,candidate);
  picked.set(key,ref);
  const occupiedOthers=new Set([...picked].filter(([k])=>k!==key).map(([,r])=>r));
  controls(slot,key,candidate,pool.filter(x=>!occupiedOthers.has(mediaRef(x))).length);
 }
}
let raf=0;
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;reconcile()})}
const priorPaint=paintDiscover;
paintDiscover=function(...args){
 const result=priorPaint.apply(this,args);
 if(isVisible())schedule();
 return result;
};
function slotChoice(key,current){
 const data=selectedData(),ctx=ct186ContextValue;
 if(!data||!ctx)return null;
 const pool=poolFor(data,key,ctx);
 const used=new Set();
 for(const [other,ref] of picked)if(other!==key)used.add(ref);
 const options=pool.filter(x=>mediaRef(x)!==current&&!used.has(mediaRef(x)));
 return options.length?options[0]:null;
}
function changeOne(key){
 let slot=q('[data-ct241-slot-key="'+key+'"]',q('[data-discover-content]'));
 if(!slot)return;
 const data=selectedData(),ctx=ct186ContextValue;
 if(!data||!ctx)return;
 const pool=poolFor(data,key,ctx);
 const preferred=picked.get(key);
 const candidate=pool.find(x=>mediaRef(x)===preferred)||pool.find(x=>mediaRef(x)===mediaIn(slot));
 if(candidate&&mediaIn(slot)!==mediaRef(candidate))slot=mount(slot,key,candidate);
 const occupied=new Set([...picked].filter(([k])=>k!==key).map(([,r])=>r));
 if(candidate)controls(slot,key,candidate,pool.filter(x=>!occupied.has(mediaRef(x))).length);
 else emptySlot(slot,key);
}
async function operate(key,ref,action){
 if(busy.has(key)||!isVisible())return;
 const data=selectedData(),ctx=ct186ContextValue;
 if(!data||!ctx)return;
 const current=poolFor(data,key,ctx).find(x=>mediaRef(x)===ref);
 const live=q('[data-ct241-slot-key="'+key+'"]',q('[data-discover-content]'));
 if(!current||!live||mediaIn(live)!==ref)return;
 if(action==='swap'){
  const next=slotChoice(key,ref);
  if(!next)return;
  picked.set(key,mediaRef(next));
  if(key==='daily:movie')try{ct186SaveDaily268(next)}catch{}
  changeOne(key);
  return;
 }
 if(action!=='seen'&&action!=='watchlist')return;
 if(action==='watchlist'&&watchKind(key))return;
 busy.add(key);
 const [type,idText]=ref.split(':'),id=Number(idText);
 // Optimistic local exclusion; do not refetch the page or move scroll.
 ct186LocalBlocked.add(ref);
 picked.delete(key);
 reconcile();
 try{
  if(action==='seen')await markSeen(type,id);
  else await addWatchlist(type,id);
  // Preserve the rest of the cards: keep the audited context and update
  // precisely this user's media ID after successful persistence.
  const set=action==='seen'
   ?(type==='movie'?ctx.historyMovieIds:ctx.historyTvIds)
   :(type==='movie'?ctx.watchMovieIds:ctx.watchTvIds);
  if(set?.add)set.add(id);
 }catch(error){
  ct186LocalBlocked.delete(ref);
  picked.set(key,ref);
  try{toast(String(error?.message||'Não foi possível atualizar'))}catch{}
 }finally{
  busy.delete(key);
  schedule();
 }
}
window.addEventListener('click',event=>{
 if(!isVisible())return;
 const target=event.target?.closest?.('[data-ct277-action]');
 if(!target)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(target.disabled)return;
 const action=String(target.dataset.ct277Action||''),key=String(target.dataset.ct277Slot||''),ref=String(target.dataset.ct277Ref||'');
 if(!Object.prototype.hasOwnProperty.call(labels,key)||!/^(movie|tv):[1-9][0-9]*$/.test(ref))return;
 if((kindOf(key)==='movie'?!ref.startsWith('movie:'):ref.startsWith('movie:')))return;
 void operate(key,ref,action);
},{capture:true,passive:false});
window.addEventListener('cinetracker:data-changed',()=>{if(isVisible())schedule()});
const style=document.createElement('style');style.id='ct277-foryou-single-owner';
style.textContent=[
 '[data-discover-content] .ct166-slot .ct277-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:100%!important;min-width:0!important;max-width:100%!important;padding:5px 4px!important;margin:0!important;position:static!important;box-sizing:border-box!important;height:45px!important;min-height:45px!important;max-height:45px!important;flex:0 0 45px!important;overflow:hidden!important}',
 '[data-discover-content] .watchlist-picks-r162 .ct277-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}',
 '[data-discover-content] .ct277-actions>.ct277-control{box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:100%!important;height:34px!important;min-height:34px!important;max-height:34px!important;border-radius:7px!important;border:1px solid #42617a!important;background:#0c2737!important;color:#d9f4ff!important;font:700 18px/1 system-ui!important;padding:0!important;margin:0!important;position:static!important;inset:auto!important;transform:none!important;white-space:nowrap!important;overflow:hidden!important;touch-action:manipulation!important;cursor:pointer!important}',
 '[data-discover-content] .ct277-actions>.ct277-control::before,[data-discover-content] .ct277-actions>.ct277-control::after{content:none!important;display:none!important}',
 '[data-discover-content] .ct277-actions>.ct277-control:disabled{opacity:.42!important;cursor:default!important}',
 '[data-discover-content] .ct277-empty{display:flex;align-items:center;justify-content:center;min-height:125px;padding:12px 5px;color:#9fb5c6;text-align:center;line-height:1.35;font-size:11px;border:1px dashed #31536a;border-radius:8px}',
 '[data-discover-content] [data-ct241-section] .ct166-slot>.discover-card{min-height:0!important;height:auto!important;display:flex!important;flex-direction:column!important}',
 '[data-discover-content] [data-ct241-section] .ct166-slot>.discover-card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '[data-discover-content] [data-ct241-section] .ct166-slot .ct166-slot-head small{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
].join('\n');
document.head.appendChild(style);
window.__ctR277Test={reconcile,contentAllowed,poolFor,operate,slotChoice,schedule};
}catch(error){
 window.__ctR277StartupError=String(error?.message||error);
 try{console.warn('Pra Você r277 disabled safely:',error)}catch{}
}
})();