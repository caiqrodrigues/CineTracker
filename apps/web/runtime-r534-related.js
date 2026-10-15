/* CineTracker Web 0.3.61 r534 — related actions only; native CineTracker data-media handler owns navigation. */
(()=>{
'use strict';
if(window.__ctR534Related?.version==='0.3.61')return;
const busy=new WeakSet();let lastPointer={el:null,at:0};
function card(node){return node?.closest?.('.ct169-related-card,.ct170-related-card')||null}
function control(target){
 const c=target?.closest?.('[data-ct169-related-watch],[data-ct169-related-seen]')||null;
 return c&&card(c)?c:null
}
function spec(c){
 const raw=c?.dataset?.ct169RelatedWatch||c?.dataset?.ct169RelatedSeen||'';
 const [rt,ri]=String(raw).split(':'),type=rt==='movie'?'movie':rt==='tv'?'tv':'',id=Number(ri)||0;
 return type&&id>0?{type,id}:null
}
function stop(e){try{e.preventDefault()}catch{}try{e.stopImmediatePropagation()}catch{}try{e.stopPropagation()}catch{}}
function update(section){
 const n=section?.querySelectorAll?.('.ct169-related-card,.ct170-related-card').length||0;
 const count=section?.querySelector?.('.ct169-section-head>span,.panel-head>span,.panel-head>small');if(count)count.textContent=String(n);
 const rail=section?.querySelector?.('.ct169-related-row');if(rail&&n===0&&!rail.querySelector('.empty'))rail.innerHTML='<div class="empty">Nenhum título relacionado elegível fora do histórico e da Watchlist.</div>'
}
function remove(c){const x=card(c),section=x?.closest?.('.ct169-detail-section,section')||null;if(x?.isConnected)x.remove();update(section)}
async function watch(c,s){
 if(busy.has(c))return false;busy.add(c);const old=c.textContent;c.disabled=true;c.setAttribute('aria-busy','true');c.textContent='Adicionando...';
 try{if(typeof addWatchlist!=='function')throw new Error('Ação de Watchlist indisponível');await addWatchlist(s.type,s.id);remove(c);return true}
 catch(e){if(c.isConnected){c.disabled=false;c.removeAttribute('aria-busy');c.textContent=old}try{toast(e?.message||String(e))}catch{}return false}
 finally{busy.delete(c)}
}
async function seen(c,s){
 if(busy.has(c))return false;busy.add(c);const old=c.textContent;c.disabled=true;c.setAttribute('aria-busy','true');c.textContent='Marcando...';
 try{if(typeof markSeen!=='function')throw new Error('Ação de visto indisponível');await markSeen(s.type,s.id);remove(c);return true}
 catch(e){if(c.isConnected){c.disabled=false;c.removeAttribute('aria-busy');c.textContent=old}try{toast(e?.message||String(e))}catch{}return false}
 finally{busy.delete(c)}
}
function activate(e,c=control(e.target)){
 if(!c)return false;const s=spec(c);if(!s)return false;stop(e);
 if(c.matches('[data-ct169-related-watch]'))void watch(c,s);else void seen(c,s);
 return true
}
window.addEventListener('pointerup',e=>{
 const c=control(e.target);if(!c)return;lastPointer={el:c,at:Date.now()};activate(e,c)
},true);
window.addEventListener('click',e=>{
 const c=control(e.target);if(!c)return;
 if(lastPointer.el===c&&Date.now()-lastPointer.at<900){stop(e);return}
 activate(e,c)
},true);
window.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&control(e.target))activate(e)},true);
window.__ctR534RelatedMarker='related-actions-only+native-go-opens-media';
window.__ctR534Related={version:'0.3.61',card,control,spec,activate,watch,seen};
})();