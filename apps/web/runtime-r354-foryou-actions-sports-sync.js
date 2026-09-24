/* CineTracker Web 1.0.145 r354 — functional Pra Você actions + Sports manual/next-games sync. */
(()=>{
'use strict';
if(window.__ctR354?.version==='1.0.145')return;
window.__ctR354Marker='foryou-actions-live-first-capture+sports-manual-sync+future-window';
window.__ctR354Scope='discover-foryou-actions+sports-sync-only';
window.__ctR354Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const rows=v=>Array.isArray(v)?v:[];
let sportsTask=null,testBridge=null;

function routeNow354(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function modelItem354(slot,model){
 const name=String(slot?.dataset?.ct336Slot||'');
 if(name==='daily')return model?.daily||null;
 const [bucket,kind]=name.split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
 return model?.[bucket]?.[kind]||null;
}
function key354(item){
 const type=String(item?.media_type||item?.type||item?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
 const id=Number(item?.tmdb_id||item?.source_tmdb_id||item?.id||item?.raw_tmdb?.id||0);
 return id>0?type+':'+id:'';
}
function repairAction354(btn){
 const slot=btn?.closest?.('[data-ct336-slot]');if(!slot)return false;
 const name=String(slot.dataset.ct336Slot||'');
 const model=window.__ctR336Test?.fyModel336?.(),item=modelItem354(slot,model),key=key354(item);
 if(btn.matches?.('[data-ct336-action]')){
  if(!btn.dataset.ct336Swap)btn.dataset.ct336Swap=name;
  if(!btn.dataset.ct336Media&&key)btn.dataset.ct336Media=key;
 }
 if(btn.matches?.('[data-ct336-swap-only]')&&!btn.dataset.ct336SwapOnly)btn.dataset.ct336SwapOnly=name;
 return true;
}
function swap354(btn){
 repairAction354(btn);
 try{if(window.__ctR352?.swap?.(btn))return true}catch{}
 const name=String(btn?.dataset?.ct336SwapOnly||btn?.closest?.('[data-ct336-slot]')?.dataset?.ct336Slot||'');
 if(!name)return false;
 try{if(window.__ctR350?.swap?.(name))return true}catch{}
 try{return !!window.__ctR336?.swapForYou?.(name)}catch{return false}
}
function action354(btn){
 repairAction354(btn);
 try{if(window.__ctR352?.action?.(btn))return true}catch{}
 /*
  * Do not consume the click if r352 cannot execute. This is intentionally
  * different from r352: the older handler stopped propagation before it knew
  * whether it had a usable state/media key.
  */
 try{
  const media=String(btn?.dataset?.ct336Media||''),action=String(btn?.dataset?.ct336Action||'');
  if(media&&['watchlist','seen'].includes(action)&&window.__ctR336?.persistForYou){
   void window.__ctR336.persistForYou(btn);return true;
  }
 }catch{}
 return false;
}
function directClick354(target,event){
 if(!target?.closest||routeNow354()!=='discover')return false;
 if(!target.closest('[data-ct336-foryou]'))return false;
 const swap=target.closest('[data-ct336-swap-only]');
 if(swap){
  const ok=swap354(swap);
  if(ok){event?.preventDefault?.();event?.stopPropagation?.();event?.stopImmediatePropagation?.()}
  return ok;
 }
 const action=target.closest('[data-ct336-action]');
 if(action){
  const ok=action354(action);
  if(ok){event?.preventDefault?.();event?.stopPropagation?.();event?.stopImmediatePropagation?.()}
  return ok;
 }
 return false;
}
window.__ctR354DirectClick=directClick354;

/* ---------- SPORTS ---------- */
function day354(offset=0){
 const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);
 return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function futureRanges354(){
 return [[-3,-1],[0,2],[3,5],[6,9]].map(([a,b])=>[day354(a),day354(b)]);
}
async function syncRange354(from,to){
 if(testBridge?.sync)return testBridge.sync(from,to,true);
 if(typeof edge==='function')return edge('ct-sports-sync',{action:'sync',date_from:from,date_to:to,force:true},55000);
 if(typeof SUPABASE_URL==='undefined'||typeof authHeaders!=='function')throw new Error('Sessão de Esportes indisponível');
 const r=await fetch(SUPABASE_URL+'/functions/v1/ct-sports-sync',{
  method:'POST',headers:{...(authHeaders()||{}),'content-type':'application/json'},
  body:JSON.stringify({action:'sync',date_from:from,date_to:to,force:true})
 });
 if(!r.ok){const t=await r.text().catch(()=> '');const e=new Error('Sports sync '+r.status+' '+t.slice(0,120));e.status=r.status;throw e}
 return r.json().catch(()=>({ok:true}));
}
async function reloadSports354(){
 if(testBridge?.load)return testBridge.load(true);
 if(typeof loadSports255==='function')return loadSports255(true);
 if(typeof sportsPayload==='function')return sportsPayload(true);
 return null;
}
function paintSports354(){
 if(testBridge?.paint)return testBridge.paint();
 try{if(typeof paintSports255==='function')return paintSports255()}catch{}
 try{if(typeof paintSports==='function')return paintSports()}catch{}
 return false;
}
function ensureSportsButton354(){
 if(routeNow354()!=='sports')return false;
 const content=q('.content'),header=q(':scope > .header',content)||q('.header',content);if(!header)return false;
 q('.ct306-sports-sync',header)?.remove();
 let btn=q('[data-ct354-sports-sync]',header);
 if(!btn){
  btn=document.createElement('button');btn.type='button';btn.className='btn ct354-sports-sync';btn.dataset.ct354SportsSync='1';
  btn.textContent='↻ Sincronizar';header.appendChild(btn);
 }
 return true;
}
async function forceSportsSync354(button=null,{silent=false}={}){
 if(sportsTask)return sportsTask;
 sportsTask=(async()=>{
  if(button){button.disabled=true;button.dataset.oldLabel=button.textContent;button.textContent='↻ Sincronizando…'}
  document.documentElement.dataset.ct354Sports='syncing';
  try{
   for(const [from,to] of futureRanges354())await syncRange354(from,to);
   await reloadSports354();
   if(routeNow354()==='sports'){paintSports354();ensureSportsButton354()}
   document.documentElement.dataset.ct354Sports='synced';
   if(!silent)try{toast('Próximos jogos atualizados.')}catch{}
   return true;
  }catch(e){
   document.documentElement.dataset.ct354Sports='failed';
   document.documentElement.dataset.ct354SportsError=String(e?.message||e||'').slice(0,140);
   if(!silent)try{toast('Esportes: '+(e?.message||String(e)))}catch{}
   return false;
  }finally{
   if(button){button.disabled=false;button.textContent=button.dataset.oldLabel||'↻ Sincronizar';delete button.dataset.oldLabel}
   sportsTask=null;
  }
 })();
 return sportsTask;
}
function bindSports354(){
 ensureSportsButton354();
}
try{
 const baseRenderSports354=renderSports;
 renderSports=async function(){
  const out=await baseRenderSports354.apply(this,arguments);
  ensureSportsButton354();
  void forceSportsSync354(null,{silent:true});
  return out;
 };
}catch{}
try{
 if(typeof paintSports255==='function'){
  const basePaintSports354=paintSports255;
  paintSports255=function(){const out=basePaintSports354.apply(this,arguments);ensureSportsButton354();return out};
 }
}catch{}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct354-sports-sync]');
 if(!b)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();void forceSportsSync354(b,{silent:false});
},true);

setTimeout(()=>{if(routeNow354()==='sports')ensureSportsButton354()},0);

window.__ctR354={
 version:'1.0.145',directClick:directClick354,action:action354,swap:swap354,
 ensureSportsButton:ensureSportsButton354,forceSportsSync:forceSportsSync354,futureRanges:futureRanges354,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR354Test={repairAction354,directClick354,action354,swap354,day354,futureRanges354,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();