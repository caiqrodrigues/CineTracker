/* Android r290/1.0.48 — injected INSIDE r289 profile modal private module. */
(()=>{
'use strict';
if(window.__ctR290Profile)return;
window.__ctR290Profile='history-newest-first-and-four-watchlist-sort-modes';
const kinds=['series-watchlist','movies-watchlist'];
const date=x=>{
 const v=x?.watched_at||x?.last_watched_at||x?.created_at||x?.added_at||x?.updated_at||x?.starts_at||'';
 return Date.parse(v)||0;
};
const added=x=>Date.parse(x?.added_at||x?.created_at||x?.updated_at||'')||0;
const title=x=>String(x?.title||x?.media_title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'');
const collator=new Intl.Collator('pt-BR',{sensitivity:'base',numeric:true});
function sorted(items,order){
 const arr=[...(Array.isArray(items)?items:[])];
 if(order==='oldest')return arr.sort((a,b)=>added(a)-added(b)||collator.compare(title(a),title(b)));
 if(order==='az')return arr.sort((a,b)=>collator.compare(title(a),title(b)));
 if(order==='za')return arr.sort((a,b)=>collator.compare(title(b),title(a)));
 if(order==='recent')return arr.sort((a,b)=>date(b)-date(a)||collator.compare(title(a),title(b)));
 return arr.sort((a,b)=>added(b)-added(a)||collator.compare(title(a),title(b)));
}
const oldFetch=fetchItems;
fetchItems=async function(kind){
 if(kind.endsWith('-watchlist')){
  // v119 returns the REAL user's full Watchlist with added_at timestamps.
  // The Profile summary/dashboard has no reliable is_watchlist per-row flag.
  const fetched=await bounded(rpc('cinetracker_watchlist_full_v119',{}),18000);
  const type=kind==='movies-watchlist'?'movie':'tv';
  return rows(fetched).filter(x=>String(x.media_type||'')===type);
 }
 const found=await oldFetch.apply(this,arguments);
 if(kind.endsWith('-history')||kind.startsWith('sports'))return sorted(found,'recent');
 return found;
};
const oldCreate=createModal;
createModal=function(kind){
 const mod=oldCreate.apply(this,arguments);
 if(!mod||!kinds.includes(kind))return mod;
 mod.order='latest';
 const label=document.createElement('label');
 label.className='ct290-profile-filter';
 label.textContent='Ordenar por ';
 const select=document.createElement('select');
 select.dataset.ct290ProfileSort='1';
 select.setAttribute('aria-label','Ordenar Watchlist');
 for(const [value,caption] of [
  ['latest','Último adicionado'],['oldest','Primeiro adicionado'],
  ['az','Letra de A a Z'],['za','Letra de Z a A']
 ]){
  const opt=document.createElement('option');opt.value=value;opt.textContent=caption;
  select.appendChild(opt);
 }
 label.appendChild(select);
 const status=mod.el.querySelector('.ct289-status');
 status?.parentNode?.insertBefore(label,status);
 select.addEventListener('change',()=>{
  if(activeModal!==mod)return;
  mod.order=select.value;mod.offset=0;draw(mod);
 });
 return mod;
};
const oldDraw=draw;
draw=function(mod){
 if(mod?.rows){
  mod.rows=sorted(mod.rows,kinds.includes(mod.kind)?mod.order||'latest':'recent');
 }
 return oldDraw.apply(this,arguments);
};
const style=document.createElement('style');style.id='ct290-profile-sorting';
style.textContent='.ct290-profile-filter{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;font-size:12px!important;margin:9px 0!important}.ct290-profile-filter select{background:#102b3b!important;color:#e9f6fd!important;border:1px solid #50728a!important;border-radius:9px!important;padding:9px!important;max-width:190px!important;min-width:0!important;font-size:12px!important}';
document.head.appendChild(style);
window.__ctR290ProfileTest={sorted,date,added,fetchItems,draw,createModal};
})();