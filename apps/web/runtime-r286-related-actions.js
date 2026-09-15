/* CineTracker Web 1.0.77 / r286 — related titles own open, Watchlist and Visto interactions before legacy document handlers. */
(()=>{
'use strict';
if(window.__ctR286)return;
window.__ctR286='related-open-watchlist-seen-window-capture';
window.__ctR286Detail='related-open+watchlist+seen-r286-owned';
window.__ctR286Scope='detail-related-only';
window.__ctR286Frozen='r285-home+imported-series+r284+r283+r282+r281+discover+sports+android-preserved';

let ct286LastPointer=null;
const ct286Busy=new WeakSet();

function ct286RelatedCard(node){return node?.closest?.('.ct169-related-card,.ct170-related-card')||null}
function ct286Control(target){
 const c=target?.closest?.('[data-ct169-related-watch],[data-ct169-related-seen],.ct169-related-open[data-media]')||null;
 return c&&ct286RelatedCard(c)?c:null;
}
function ct286Spec(control){
 if(!control)return null;
 const raw=control.dataset.ct169RelatedWatch||control.dataset.ct169RelatedSeen||control.dataset.media||'';
 const [rawType,rawId]=String(raw).split(':'),type=rawType==='movie'?'movie':rawType==='tv'?'tv':'',id=Number(rawId)||0;
 return type&&id>0?{type,id}:null;
}
function ct286Stop(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
function ct286UpdateCount(section){
 if(!section)return;
 const count=section.querySelector('.ct169-section-head>span,.panel-head>span,.panel-head>small');
 const remaining=section.querySelectorAll('.ct169-related-card,.ct170-related-card').length;
 if(count)count.textContent=String(remaining);
 const rail=section.querySelector('.ct169-related-row');
 if(rail&&remaining===0&&!rail.querySelector('.empty'))rail.innerHTML='<div class="empty">Nenhum título relacionado elegível fora do histórico e da Watchlist.</div>';
}
function ct286RemoveCard(button){
 const card=ct286RelatedCard(button),section=card?.closest?.('.ct169-detail-section,section')||null;
 if(card?.isConnected)card.remove();ct286UpdateCount(section);
}
async function ct286Watchlist(button,spec){
 if(ct286Busy.has(button))return;ct286Busy.add(button);const old=button.textContent;button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Adicionando...';
 try{if(typeof addWatchlist!=='function')throw new Error('Ação de Watchlist indisponível');await addWatchlist(spec.type,spec.id);ct286RemoveCard(button)}
 catch(err){if(button.isConnected){button.disabled=false;button.removeAttribute('aria-busy');button.textContent=old}try{toast(err?.message||String(err))}catch{}}
 finally{ct286Busy.delete(button)}
}
async function ct286Seen(button,spec){
 if(ct286Busy.has(button))return;ct286Busy.add(button);const old=button.textContent;button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Marcando...';
 try{if(typeof markSeen!=='function')throw new Error('Ação de visto indisponível');await markSeen(spec.type,spec.id);ct286RemoveCard(button)}
 catch(err){if(button.isConnected){button.disabled=false;button.removeAttribute('aria-busy');button.textContent=old}try{toast(err?.message||String(err))}catch{}}
 finally{ct286Busy.delete(button)}
}
function ct286Open(spec){
 if(typeof go!=='function')return false;
 go(`/${spec.type==='movie'?'movie':'series'}/${spec.id}`);return true;
}
function ct286Activate(e,control=ct286Control(e.target)){
 if(!control)return false;const spec=ct286Spec(control);if(!spec)return false;ct286Stop(e);
 if(control.matches('[data-ct169-related-watch]'))void ct286Watchlist(control,spec);
 else if(control.matches('[data-ct169-related-seen]'))void ct286Seen(control,spec);
 else ct286Open(spec);
 return true;
}
window.addEventListener('pointerup',e=>{const control=ct286Control(e.target);if(!control)return;ct286LastPointer={el:control,at:Date.now()};ct286Activate(e,control)},true);
window.addEventListener('click',e=>{const control=ct286Control(e.target);if(!control)return;if(ct286LastPointer?.el===control&&Date.now()-ct286LastPointer.at<800){ct286Stop(e);return}ct286Activate(e,control)},true);
window.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&ct286Control(e.target))ct286Activate(e)},true);

window.__ctR286Test={relatedCard:ct286RelatedCard,control:ct286Control,spec:ct286Spec,activate:ct286Activate,open:ct286Open,watchlist:ct286Watchlist,seen:ct286Seen,removeCard:ct286RemoveCard};
})();
