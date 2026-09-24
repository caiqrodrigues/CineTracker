/* CineTracker Web 1.0.146 r355 — hard owner for Pra Você clicks + always-visible Sports sync. */
(()=>{
'use strict';
if(window.__ctR355?.version==='1.0.146')return;
window.__ctR355Marker='foryou-hard-click-owner+local-slot-only+sports-sync-always-visible';
window.__ctR355Scope='discover-foryou-actions+sports-sync-only';
window.__ctR355Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const pending=new Map();
let testBridge=null,sportsMo=null,sportsHost=null;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function typeOf(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function idOf(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf(x){const id=idOf(x);return id>0?(typeOf(x)==='movie'?'movie':'tv')+':'+id:''}
function current(pool,index){const a=rows(pool);return a.length?a[Math.min(Math.max(0,Number(index||0)),a.length-1)]:null}
function modelItem(slot){
 const st=window.__ctR309Test?.state,name=String(slot?.dataset?.ct336Slot||'');if(!st||!name)return null;
 if(name==='daily')return current(st.dailyPool,st.dailyIndex);
 const [bucket,kind]=name.split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
 return current(st?.[bucket+'Pools']?.[kind],st?.[bucket+'Index']?.[kind]);
}
function cloneState(st){
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
function normalize(st){
 for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime']){
  const pool=rows(st?.[bucket+'Pools']?.[kind]);if(!st[bucket+'Index'])st[bucket+'Index']={movie:0,series:0,anime:0};
  const v=Math.max(0,Number(st[bucket+'Index'][kind]||0));
  st[bucket+'Index'][kind]=pool.length?Math.min(v,pool.length-1):0;
 }
 const d=rows(st.dailyPool);st.dailyIndex=d.length?Math.min(Math.max(0,Number(st.dailyIndex||0)),d.length-1):0;
 return st;
}
function install(st){normalize(st);window.__ctR309Test?.setForYouState?.(st);return true}
function removeKey(list,key){return rows(list).filter(x=>keyOf(x)!==key)}
function renderOnly(slotName){
 const ok=window.__ctR352?.renderSlot?.(slotName,{animate:true});
 if(ok){
  try{window.__ctR348?.fixAll?.()}catch{}
  try{window.__ctR349?.compact?.()}catch{}
 }
 return !!ok;
}
function repair(btn){
 const slot=btn?.closest?.('[data-ct336-slot]');if(!slot)return null;
 const item=modelItem(slot),key=keyOf(item),name=String(slot.dataset.ct336Slot||'');
 if(btn.matches?.('[data-ct336-action]')){
  const label=String(btn.textContent||'').toLowerCase();
  if(!btn.dataset.ct336Action)btn.dataset.ct336Action=label.includes('watch')?'watchlist':'seen';
  btn.dataset.ct336Swap=name;if(key)btn.dataset.ct336Media=key;
 }else if(btn.matches?.('[data-ct336-swap-only]'))btn.dataset.ct336SwapOnly=name;
 return{slot,item,key,name};
}
async function persistBackend(action,type,id){
 if(testBridge){
  if(action==='watchlist'&&typeof testBridge.watchlist==='function')return await testBridge.watchlist(type,id);
  if(action==='seen'&&typeof testBridge.seen==='function')return await testBridge.seen(type,id);
 }
 if(action==='watchlist'){if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');return await addWatchlist(type,id)}
 if(action==='seen'){if(typeof markSeen!=='function')throw new Error('Visto indisponível');return await markSeen(type,id)}
 throw new Error('Ação inválida');
}
function mutateAction(action,key){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const before=cloneState(st),next=cloneState(st);
 if(action==='seen'){
  for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime'])next[bucket+'Pools'][kind]=removeKey(next[bucket+'Pools'][kind],key);
  next.dailyPool=removeKey(next.dailyPool,key);
 }else if(action==='watchlist'){
  for(const kind of ['movie','series','anime'])next.freshPools[kind]=removeKey(next.freshPools[kind],key);
  next.dailyPool=removeKey(next.dailyPool,key);
 }else return null;
 install(next);return{before,next};
}
function action(btn){
 if(!btn||btn.disabled)return false;
 const meta=repair(btn);if(!meta?.key||!meta.name)return false;
 const action=String(btn.dataset.ct336Action||''),[type,idRaw]=meta.key.split(':'),id=Number(idRaw||0);
 if(!['watchlist','seen'].includes(action)||!['movie','tv'].includes(type)||!(id>0))return false;
 const tx=mutateAction(action,meta.key);if(!tx)return false;
 const gen=(pending.get(meta.name)||0)+1;pending.set(meta.name,gen);
 if(!renderOnly(meta.name)){install(tx.before);return false}
 void persistBackend(action,type,id).catch(e=>{
  if(pending.get(meta.name)===gen){install(tx.before);renderOnly(meta.name)}
  try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}
 });
 return true;
}
function swap(btn){
 if(!btn||btn.disabled)return false;
 const meta=repair(btn);if(!meta?.name)return false;
 const st=window.__ctR309Test?.state;if(!st)return false;
 const next=cloneState(st),name=meta.name;
 if(name==='daily'){
  const pool=rows(next.dailyPool);if(pool.length<2)return false;next.dailyIndex=(Number(next.dailyIndex||0)+1)%pool.length;
 }else{
  const [bucket,kind]=name.split(':');if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;
  const pool=rows(next?.[bucket+'Pools']?.[kind]);if(pool.length<2)return false;
  const cur=Number(next?.[bucket+'Index']?.[kind]||0);let idx=(cur+1)%pool.length;
  if(bucket==='watch'&&window.__ctR353?.pickIndex){
   const smart=Number(window.__ctR353.pickIndex(pool,kind,cur));if(Number.isInteger(smart)&&smart>=0&&smart<pool.length&&smart!==cur)idx=smart;
  }
  next[bucket+'Index']={...(next[bucket+'Index']||{})};next[bucket+'Index'][kind]=idx;
 }
 install(next);pending.set(name,(pending.get(name)||0)+1);return renderOnly(name);
}
function directClick(target,event){
 if(!target?.closest||routeNow()!=='discover')return false;
 const root=target.closest('[data-ct336-foryou]');if(!root)return false;
 const btn=target.closest('button.ct336-action,.ct336-actions button');if(!btn)return false;
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 let ok=false;
 if(btn.matches('[data-ct336-swap-only]')||label.includes('trocar'))ok=swap(btn);
 else if(btn.matches('[data-ct336-action]')||label.includes('watchlist')||label.includes('visto')){
  if(!btn.dataset.ct336Action)btn.dataset.ct336Action=label.includes('watchlist')?'watchlist':'seen';
  ok=action(btn);
 }
 if(ok){event?.preventDefault?.();event?.stopPropagation?.();event?.stopImmediatePropagation?.()}
 return ok;
}
window.__ctR355DirectClick=directClick;

/* SPORTS: always show a manual sync control even when the page has no legacy .header. */
function sportsAnchor(){
 const content=q('.content');if(!content)return null;
 return q('[data-sports]',content)||q('[data-ct255-sports]',content)||q('.ct255-sports',content)||q('.page',content);
}
function ensureSportsButton(){
 if(routeNow()!=='sports')return false;
 const content=q('.content'),anchor=sportsAnchor();if(!content||!anchor)return false;
 qa('[data-ct354-sports-sync],.ct306-sports-sync',content).forEach(x=>x.remove());
 let bar=q(':scope > .ct355-sports-toolbar',content);
 if(!bar){bar=document.createElement('div');bar.className='ct355-sports-toolbar';content.insertBefore(bar,anchor)}
 let btn=q('[data-ct355-sports-sync]',bar);
 if(!btn){
  btn=document.createElement('button');btn.type='button';btn.className='btn ct355-sports-sync';btn.dataset.ct355SportsSync='1';btn.textContent='↻ Sincronizar';
  btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();void syncSports(btn)},true);
  bar.appendChild(btn);
 }
 return true;
}
async function syncSports(btn){
 if(!window.__ctR354?.forceSportsSync)return false;
 const old=btn?.textContent||'↻ Sincronizar';if(btn){btn.disabled=true;btn.textContent='↻ Sincronizando…'}
 try{return await window.__ctR354.forceSportsSync(null,{silent:false})}
 finally{if(btn){btn.disabled=false;btn.textContent=old}ensureSportsButton()}
}
function bindSports(){
 const app=q('#app')||document.body;if(!app||app===sportsHost)return false;
 sportsMo?.disconnect?.();sportsHost=app;sportsMo=new MutationObserver(()=>{if(routeNow()==='sports')queueMicrotask(ensureSportsButton)});
 sportsMo.observe(app,{subtree:true,childList:true});return true;
}
try{
 const baseRender=renderSports;
 renderSports=async function(){const out=await baseRender.apply(this,arguments);ensureSportsButton();bindSports();return out};
}catch{}
setTimeout(()=>{if(routeNow()==='sports'){ensureSportsButton();bindSports()}},0);

const style=document.createElement('style');style.id='ct-web-r355';style.textContent=`
.ct355-sports-toolbar{box-sizing:border-box!important;display:flex!important;justify-content:flex-end!important;align-items:center!important;width:100%!important;margin:0 0 10px!important}
.ct355-sports-sync{min-height:34px!important;padding:6px 12px!important;white-space:nowrap!important}
[data-ct336-foryou] .ct336-actions>button{pointer-events:auto!important;cursor:pointer!important}
`;document.head.appendChild(style);

window.__ctR355={version:'1.0.146',directClick,action,swap,renderOnly,ensureSportsButton,syncSports,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
window.__ctR355Test={cloneState,mutateAction,repair,directClick,action,swap,ensureSportsButton,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();