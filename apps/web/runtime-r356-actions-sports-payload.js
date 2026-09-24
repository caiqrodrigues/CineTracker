/* CineTracker Web 1.0.147 r356 — metadata-proof Pra Você actions + authoritative Sports payload repaint. */
(()=>{
'use strict';
if(window.__ctR356?.version==='1.0.147')return;
window.__ctR356Marker='foryou-actions-dom-key-fallback+sports-authoritative-payload-repaint';
window.__ctR356Scope='discover-foryou-actions+sports-payload-only';
window.__ctR356Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
let sportsTask=null;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function typeOf(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function idOf(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf(x){const id=idOf(x);return id>0?(typeOf(x)==='movie'?'movie':'tv')+':'+id:''}
function validKey(v){return /^(movie|tv):\d+$/.test(String(v||''))?String(v):''}
function slotStateItem(slotName){
 const st=window.__ctR309Test?.state;if(!st)return null;
 if(slotName==='daily'){const p=rows(st.dailyPool),i=Math.max(0,Math.min(Number(st.dailyIndex||0),Math.max(0,p.length-1)));return p[i]||null}
 const [bucket,kind]=String(slotName||'').split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
 const p=rows(st?.[bucket+'Pools']?.[kind]),i=Math.max(0,Math.min(Number(st?.[bucket+'Index']?.[kind]||0),Math.max(0,p.length-1)));
 return p[i]||null;
}
function domKey(slot){
 return validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)
  ||validKey(q('[data-media]',slot)?.dataset?.media)
  ||'';
}
function syncStateToVisible(slotName,key){
 const st=window.__ctR309Test?.state;if(!st||!key)return false;
 let changed=false;
 if(slotName==='daily'){
  const p=rows(st.dailyPool),idx=p.findIndex(x=>keyOf(x)===key);
  if(idx>=0&&Number(st.dailyIndex||0)!==idx){st.dailyIndex=idx;changed=true}
 }else{
  const [bucket,kind]=String(slotName||'').split(':');
  if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;
  const p=rows(st?.[bucket+'Pools']?.[kind]),idx=p.findIndex(x=>keyOf(x)===key);
  if(idx>=0&&Number(st?.[bucket+'Index']?.[kind]||0)!==idx){
   st[bucket+'Index']={...(st[bucket+'Index']||{})};st[bucket+'Index'][kind]=idx;changed=true;
  }
 }
 if(changed)window.__ctR309Test?.setForYouState?.(st);
 return true;
}
function repairAction(btn){
 const slot=btn?.closest?.('[data-ct336-slot]');if(!slot)return null;
 const name=String(slot.dataset.ct336Slot||'');if(!name)return null;
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(btn.matches('[data-ct336-swap-only]')||label.includes('trocar')){
  btn.dataset.ct336SwapOnly=name;return{slot,name,key:'',action:'swap'};
 }
 let action=String(btn.dataset.ct336Action||'');
 if(!['watchlist','seen'].includes(action))action=label.includes('watchlist')?'watchlist':label.includes('visto')?'seen':'';
 if(!action)return null;
 let key=validKey(btn.dataset.ct336Media)||domKey(slot)||keyOf(slotStateItem(name));
 if(!key)return null;
 btn.dataset.ct336Action=action;btn.dataset.ct336Swap=name;btn.dataset.ct336Media=key;
 syncStateToVisible(name,key);
 return{slot,name,key,action};
}
function action356(btn){
 if(!btn||btn.disabled)return false;
 const meta=repairAction(btn);if(!meta||meta.action==='swap'||!meta.key)return false;
 try{
  if(window.__ctR352?.action?.(btn))return true;
 }catch{}
 try{
  if(window.__ctR355?.action?.(btn))return true;
 }catch{}
 try{
  if(window.__ctR336?.persistForYou){void window.__ctR336.persistForYou(btn);return true}
 }catch{}
 return false;
}
function swap356(btn){
 if(!btn||btn.disabled)return false;
 const meta=repairAction(btn);if(!meta?.name)return false;
 try{if(window.__ctR355?.swap?.(btn))return true}catch{}
 try{if(window.__ctR352?.swap?.(btn))return true}catch{}
 return false;
}
const previousDirect=window.__ctR355DirectClick;
function directClick356(target,event){
 if(!target?.closest||routeNow()!=='discover')return typeof previousDirect==='function'?previousDirect(target,event):false;
 const root=target.closest('[data-ct336-foryou]');if(!root)return typeof previousDirect==='function'?previousDirect(target,event):false;
 const btn=target.closest('button.ct336-action,.ct336-actions button');if(!btn)return false;
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 let ok=false;
 if(btn.matches('[data-ct336-swap-only]')||label.includes('trocar'))ok=swap356(btn);
 else if(label.includes('watchlist')||label.includes('visto')||btn.matches('[data-ct336-action]'))ok=action356(btn);
 if(ok){event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();return true}
 return typeof previousDirect==='function'?previousDirect(target,event):false;
}
/* r355's earliest window capture reads this variable dynamically on every click. */
window.__ctR355DirectClick=directClick356;

/* Keep action metadata valid even if a legacy repaint recreated the row. */
function repairAll(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 let n=0;for(const btn of qa('.ct336-actions button',root))if(repairAction(btn)){n++}
 root.dataset.ct356Repaired=String(n);return n>0;
}
let actionMo=null,actionHost=null;
function bindActions(){
 const h=q('[data-ct319-content]');if(!h||h===actionHost)return false;
 actionMo?.disconnect?.();actionHost=h;
 actionMo=new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes.length||m.removedNodes.length))queueMicrotask(repairAll)});
 actionMo.observe(h,{subtree:true,childList:true});queueMicrotask(repairAll);return true;
}

/* r255's sports state lives in its closure. build-r356 exposes a narrow bridge to that exact state/loader/painter. */
function sportsBridge(){return window.__ctR356SportsBridge||null}
async function refreshSports356({sync=true,silent=true,button=null}={}){
 if(sportsTask)return sportsTask;
 sportsTask=(async()=>{
  const old=button?.textContent||'↻ Sincronizar';
  if(button){button.disabled=true;button.textContent='↻ Sincronizando…'}
  document.documentElement.dataset.ct356Sports='loading';
  try{
   if(sync&&window.__ctR354?.forceSportsSync)await window.__ctR354.forceSportsSync(null,{silent:true});
   const b=sportsBridge();if(!b?.state||typeof b.load!=='function'||typeof b.paint!=='function')throw new Error('Sports bridge indisponível');
   b.state.payload=null;b.state.at=0;
   const payload=await b.load(true);
   b.state.payload=payload||b.state.payload||{};b.state.at=Date.now();
   const next=typeof b.rows==='function'?rows(b.rows(b.state.payload,'next')):[];
   document.documentElement.dataset.ct356SportsUpcoming=String(next.length);
   if(routeNow()==='sports')b.paint();
   document.documentElement.dataset.ct356Sports='ready';
   if(!silent&&next.length)try{toast(next.length+' eventos próximos carregados.')}catch{}
   return next.length>0;
  }catch(e){
   document.documentElement.dataset.ct356Sports='failed';
   document.documentElement.dataset.ct356SportsError=String(e?.message||e||'').slice(0,160);
   if(!silent)try{toast('Esportes: '+(e?.message||String(e)))}catch{}
   return false;
  }finally{
   if(button){button.disabled=false;button.textContent=old}
   sportsTask=null;
  }
 })();
 return sportsTask;
}
try{
 const baseRenderSports=renderSports;
 renderSports=async function(){
  const out=await baseRenderSports.apply(this,arguments);
  try{window.__ctR355?.ensureSportsButton?.()}catch{}
  void refreshSports356({sync:true,silent:true});
  return out;
 };
}catch{}
window.addEventListener('click',e=>{
 const btn=e.target?.closest?.('[data-ct355-sports-sync],[data-ct354-sports-sync]');
 if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
 void refreshSports356({sync:true,silent:false,button:btn});
},true);

setTimeout(()=>{if(routeNow()==='discover')bindActions();if(routeNow()==='sports')void refreshSports356({sync:true,silent:true})},0);

window.__ctR356={version:'1.0.147',directClick:directClick356,repairAction,repairAll,action:action356,swap:swap356,refreshSports:refreshSports356,sportsBridge,bindActions};
window.__ctR356Test={repairAction,syncStateToVisible,directClick:directClick356,action:action356,swap:swap356,refreshSports:refreshSports356,sportsBridge};
})();