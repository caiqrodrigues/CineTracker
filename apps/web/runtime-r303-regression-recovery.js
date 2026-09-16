/* CineTracker Web 1.0.94 / r303 — regression recovery over r302. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR303)return;
window.__ctR303='movie-actions+top10+f1-drivers-calendar+sports-refresh-order+profile-stable';
window.__ctR303Detail='related-open+actors+watchlist+seen-canonical-actions';
window.__ctR303Top10='higher-in-viewport+reduced-blank-space';
window.__ctR303F1='drivers-restored+past-calendar-clickable';
window.__ctR303Sports='f1-first+tabs-below-hub+manual-resync';
window.__ctR303Profile='r301-statistics-preserved+watchlist-open-signal-removed';
window.__ctR303Android='preserved-1.0.20-10062';

const q303=(s,r=document)=>r?.querySelector?.(s)||null;
const qa303=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm303=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route303=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const busy303=new WeakSet();

function restoreF1TabsAuthority303(){
 try{
  if(typeof F1_TABS255!=='undefined'&&Array.isArray(F1_TABS255)){
   const has=F1_TABS255.some(x=>String(x?.[0]||'')==='drivers'||norm303(x?.[1])==='pilotos');
   if(!has){const at=F1_TABS255.findIndex(x=>String(x?.[0]||'')==='teams');F1_TABS255.splice(at>=0?at:F1_TABS255.length,0,['drivers','Pilotos'])}
  }
 }catch{}
}
function ensureF1Drivers303(){
 if(route303()!=='sports')return false;restoreF1TabsAuthority303();
 const tabs=q303('.ct255-f1-tabs,.ct257-f1-tabs');if(!tabs)return false;
 let btn=q303('[data-ct255-f1tab="drivers"],[data-ct257-f1tab="drivers"]',tabs);
 if(!btn){
  const ref=q303('[data-ct255-f1tab="teams"],[data-ct257-f1tab="teams"]',tabs)||q303('[data-ct255-f1tab="circuits"],[data-ct257-f1tab="circuits"]',tabs);
  btn=document.createElement('button');btn.type='button';btn.className=ref?.className||'ct255-f1-tab';btn.textContent='Pilotos';btn.dataset.ct255F1tab='drivers';
  if(ref?.parentNode===tabs)tabs.insertBefore(btn,ref);else tabs.appendChild(btn);
 }
 btn.hidden=false;btn.disabled=false;btn.removeAttribute('hidden');btn.removeAttribute('aria-disabled');btn.style.removeProperty('display');btn.style.removeProperty('visibility');btn.style.removeProperty('pointer-events');btn.dataset.ct303Restored='1';return true;
}
function repairF1Calendar303(){
 if(route303()!=='sports')return false;let hit=false;
 for(const b of qa303('[data-ct301-f1-event]')){b.hidden=false;b.disabled=false;b.removeAttribute('disabled');b.removeAttribute('aria-disabled');b.style.setProperty('pointer-events','auto','important');b.style.setProperty('cursor','pointer','important');if(!b.hasAttribute('tabindex'))b.tabIndex=0;b.dataset.ct303Clickable='1';hit=true}
 return hit;
}
function orderSports303(){
 if(route303()!=='sports')return false;const root=q303('[data-ct255-sports],[data-sports]');if(!root)return false;
 const f1=q303('.ct255-f1hub,[data-ct255-f1]',root),tabs=q303('.ct255-sports-tabs',root),filters=q303('.ct255-sport-filters,[data-ct302-sport-filters]',root),feed=q303('.ct255-sports-feed',root);
 if(f1&&root.firstElementChild!==f1)root.insertBefore(f1,root.firstElementChild);
 if(tabs&&f1&&f1.nextElementSibling!==tabs)f1.after(tabs);
 if(filters&&tabs&&tabs.nextElementSibling!==filters)tabs.after(filters);
 const anchor=filters||tabs||f1;if(feed&&anchor&&anchor.nextElementSibling!==feed)anchor.after(feed);
 root.dataset.ct303Order='f1hub-sports-tabs-filters-feed';return true;
}
async function refreshSports303(btn){
 if(btn&&busy303.has(btn))return false;if(btn)busy303.add(btn);
 const old=btn?.textContent;if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true');btn.textContent='Atualizando…'}
 try{
  try{if(typeof sport255!=='undefined'){sport255.payload=null;sport255.at=0}}catch{}
  if(typeof loadSports255==='function')await loadSports255(true);
  if(typeof renderSports==='function')await renderSports();
  for(const ms of[0,80,240,650])setTimeout(stabilizeSports303,ms);
  try{toast('Esportes atualizados')}catch{}
  return true;
 }catch(err){try{toast(err?.message||String(err))}catch{}return false}
 finally{if(btn?.isConnected){btn.disabled=false;btn.removeAttribute('aria-busy');btn.textContent=old||'↻ Atualizar'}if(btn)busy303.delete(btn)}
}
function ensureSportsRefresh303(){
 if(route303()!=='sports')return false;const root=q303('[data-ct255-sports],[data-sports]');if(!root)return false;const tabs=q303('.ct255-sports-tabs',root);if(!tabs)return false;
 let btn=q303('[data-ct303-sports-refresh]',tabs);if(!btn){btn=document.createElement('button');btn.type='button';btn.className='chip ct303-sports-refresh';btn.dataset.ct303SportsRefresh='1';btn.textContent='↻ Atualizar';btn.title='Rebuscar e sincronizar jogos';tabs.appendChild(btn)}return true;
}
function stabilizeSports303(){
 if(route303()!=='sports')return false;
 try{window.__ctR302Test?.ensureSportsFilters302?.()}catch{}
 restoreF1TabsAuthority303();orderSports303();ensureF1Drivers303();ensureSportsRefresh303();repairF1Calendar303();return true;
}

function relatedCard303(node){return node?.closest?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]')||null}
function relatedControl303(target){
 const card=relatedCard303(target);if(!card)return null;
 const explicit=target?.closest?.('[data-ct169-related-watch],[data-ct169-related-seen],[data-related-watch],[data-related-seen],[data-action="watchlist"],[data-action="seen"],[data-action="watched"],.ct169-related-open[data-media],.ct170-related-open[data-media],[data-related-open],[data-similar-open]');
 if(explicit&&relatedCard303(explicit)===card)return explicit;
 if(target?.closest?.('button,a,[role="button"]'))return null;
 return target?.closest?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]')||null;
}
function relatedSpec303(control){
 const card=relatedCard303(control)||control;
 const raw=control?.dataset?.ct169RelatedWatch||control?.dataset?.ct169RelatedSeen||control?.dataset?.relatedWatch||control?.dataset?.relatedSeen||control?.dataset?.media||card?.dataset?.media||card?.querySelector?.('[data-media]')?.dataset?.media||'';
 const [rawType,rawId]=String(raw).split(':'),type=rawType==='movie'?'movie':rawType==='tv'?'tv':'',id=Number(rawId)||0;return type&&id?{type,id}:null;
}
function stop303(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
function isWatch303(c){return !!c?.matches?.('[data-ct169-related-watch],[data-related-watch],[data-action="watchlist"]')}
function isSeen303(c){return !!c?.matches?.('[data-ct169-related-seen],[data-related-seen],[data-action="seen"],[data-action="watched"]')}
async function runRelated303(control,spec,kind){
 if(busy303.has(control))return;busy303.add(control);const old=control.textContent;if(control){control.disabled=true;control.setAttribute('aria-busy','true')}
 try{
  if(kind==='watch'){if(typeof addWatchlist!=='function')throw new Error('Ação de Watchlist indisponível');await addWatchlist(spec.type,spec.id)}
  else if(kind==='seen'){if(typeof markSeen!=='function')throw new Error('Ação de Visto indisponível');await markSeen(spec.type,spec.id)}
  if(control?.isConnected){control.textContent='✓';control.classList.add('is-saved')}
 }catch(err){if(control?.isConnected)control.textContent=old;try{toast(err?.message||String(err))}catch{}}
 finally{if(control?.isConnected){control.disabled=false;control.removeAttribute('aria-busy')}busy303.delete(control)}
}
function activateRelated303(e,control=relatedControl303(e.target)){
 if(!control)return false;const spec=relatedSpec303(control);if(!spec)return false;stop303(e);
 if(isWatch303(control))void runRelated303(control,spec,'watch');else if(isSeen303(control))void runRelated303(control,spec,'seen');else if(typeof go==='function')go(`/${spec.type==='movie'?'movie':'series'}/${spec.id}`);return true;
}
function repairMovieInteractions303(){
 try{window.__ctR293Test?.normalizeRelatedAll?.(document)}catch{}
 try{if(typeof bindPersonActions==='function')bindPersonActions()}catch{}
 for(const el of qa303('.actor-link,.js-person,.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],[data-ct169-related-watch],[data-ct169-related-seen],[data-related-watch],[data-related-seen]')){el.style?.removeProperty?.('pointer-events');el.removeAttribute?.('aria-disabled');if(el.matches?.('button'))el.disabled=false}
 return true;
}
function top10303(){
 const top=q303('.top10-placement-wrap,[data-ct-top10],.ct171-top-row')?.closest?.('.top10-placement-wrap,[data-ct-top10],section')||q303('.top10-placement-wrap,[data-ct-top10]');if(!top)return false;
 const welcome=q303('.welcome-banner');if(welcome&&welcome.nextElementSibling!==top)welcome.after(top);top.style.setProperty('margin-top','8px','important');top.style.setProperty('padding-top','0','important');top.style.setProperty('margin-bottom','12px','important');
 const host=top.parentElement;if(host)host.style.setProperty('gap','12px','important');return true;
}
function profile303(){
 if(route303()!=='profile')return false;try{window.__ctR301Test?.stabilizeProfile301?.()}catch{}
 const wrap=q303('#profileWatchlistGrid');if(!wrap)return false;
 for(const icon of qa303('svg,.profile-card-arrow,[data-profile-open-icon]',wrap))icon.remove();
 for(const b of qa303('[title*="Abrir" i],[aria-label*="Abrir" i]',wrap)){b.removeAttribute('title');const a=b.getAttribute('aria-label');if(a&&/abrir/i.test(a))b.removeAttribute('aria-label')}
 wrap.dataset.ct303Profile='r301-layout-no-open-signal';return true;
}
function stabilize303(){const r=route303();repairMovieInteractions303();top10303();if(r==='sports')stabilizeSports303();else if(r==='profile')profile303()}
function burst303(){for(const ms of[0,90,260,720])setTimeout(stabilize303,ms)}

window.addEventListener('pointerup',e=>{const c=relatedControl303(e.target);if(c)activateRelated303(e,c)},true);
document.addEventListener('click',e=>{
 const refresh=e.target?.closest?.('[data-ct303-sports-refresh]');if(refresh){e.preventDefault();e.stopImmediatePropagation();void refreshSports303(refresh);return}
 const f1=e.target?.closest?.('[data-ct255-f1tab],[data-ct257-f1tab]');if(f1)for(const ms of[10,100,280,700])setTimeout(stabilizeSports303,ms);
},true);
document.addEventListener('cinetracker:data-changed',burst303,false);window.addEventListener('popstate',burst303,false);

let queued303=false;const app303=q303('#app');if(app303&&window.MutationObserver){new MutationObserver(()=>{if(queued303)return;queued303=true;setTimeout(()=>{queued303=false;stabilize303()},40)}).observe(app303,{subtree:true,childList:true})}

const style=document.createElement('style');style.id='ct-web-r303-regression-recovery';style.textContent=`
.actor-link,.js-person,.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],[data-ct301-f1-event]{pointer-events:auto!important}
.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]{cursor:pointer}
.top10-placement-wrap,[data-ct-top10]{margin-top:8px!important;padding-top:0!important}
.ct255-sports-tabs{display:flex!important;align-items:center!important;max-width:100%!important}
.ct303-sports-refresh{margin-left:auto!important;flex:0 0 auto!important;white-space:nowrap!important;cursor:pointer!important}
[data-ct301-f1-event]{cursor:pointer!important}
#profileWatchlistGrid .profile-card-arrow,#profileWatchlistGrid [data-profile-open-icon]{display:none!important}
`;
document.head.appendChild(style);
for(const ms of[0,180,700])setTimeout(stabilize303,ms);
window.__ctR303Test={ensureF1Drivers303,restoreF1TabsAuthority303,repairF1Calendar303,orderSports303,ensureSportsRefresh303,refreshSports303,relatedCard303,relatedControl303,relatedSpec303,activateRelated303,repairMovieInteractions303,top10303,profile303,stabilizeSports303};
})();
