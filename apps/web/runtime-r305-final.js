/* CineTracker Web 1.0.96 / r305 — canonical final authority, no post-render observer. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR305Final)return;
window.__ctR305Final='canonical-first-paint+overlay-hit-actions+provider-sync+stable-profile';
window.__ctR305Android='preserved-1.0.20-10062';
window.__ctR305Lifecycle='pre-boot+renderer-hooks+no-mutation-observer+no-delayed-reconcile';

const q305=(s,r=document)=>r?.querySelector?.(s)||null;
const qa305=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm305=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route305=()=>{try{return String(typeof route==='function'?route():(location.pathname.split('/').filter(Boolean)[0]||''))}catch{return''}};
const busy305=new WeakSet();
let lastPointer305=null;

function stop305(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
function hit305(e,selector){
 const direct=e.target?.closest?.(selector);if(direct)return direct;
 const x=Number(e.clientX),y=Number(e.clientY);if(!Number.isFinite(x)||!Number.isFinite(y))return null;
 if(typeof document.elementsFromPoint==='function')for(const node of document.elementsFromPoint(x,y)||[]){const hit=node?.closest?.(selector);if(hit)return hit}
 let best=null,bestArea=Infinity;
 for(const node of qa305(selector)){
  if(!node?.isConnected||typeof node.getBoundingClientRect!=='function')continue;
  const r=node.getBoundingClientRect();if(!r||r.width<=0||r.height<=0||x<r.left||x>r.right||y<r.top||y>r.bottom)continue;
  const cs=typeof getComputedStyle==='function'?getComputedStyle(node):null;if(cs&&(cs.display==='none'||cs.visibility==='hidden'))continue;
  const area=Math.max(1,r.width*r.height);if(area<bestArea){best=node;bestArea=area}
 }
 return best;
}
function mediaSpec305(node){
 const card=node?.closest?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]');
 const raw=node?.dataset?.ct169RelatedWatch||node?.dataset?.ct169RelatedSeen||node?.dataset?.relatedWatch||node?.dataset?.relatedSeen||node?.dataset?.media||card?.dataset?.ct169RelatedCard||card?.dataset?.media||q305('[data-media]',card)?.dataset?.media||'';
 const [rawType,rawId]=String(raw).split(':'),id=Number(rawId)||0,type=rawType==='movie'?'movie':rawType==='tv'?'tv':'';
 return type&&id>0?{type,id}:null;
}
function removeRelated305(el){
 const card=el?.closest?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]');if(!card)return;
 const section=card.closest?.('.ct169-detail-section,section');card.remove();
 const count=section&&q305('.ct169-section-head>span,.panel-head>span,.panel-head>small',section);if(count)count.textContent=String(qa305('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]',section).length);
}
async function saveRelated305(el,spec,kind){
 if(!el||busy305.has(el))return;busy305.add(el);const old=el.textContent;el.disabled=true;el.setAttribute('aria-busy','true');el.textContent=kind==='watch'?'Adicionando...':'Marcando...';
 try{
  if(kind==='watch'){if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');await addWatchlist(spec.type,spec.id)}
  else{if(typeof markSeen!=='function')throw new Error('Ação de visto indisponível');await markSeen(spec.type,spec.id)}
  removeRelated305(el);
 }catch(err){if(el.isConnected){el.disabled=false;el.textContent=old;el.removeAttribute('aria-busy')}try{toast(err?.message||String(err))}catch{}}
 finally{busy305.delete(el)}
}
function relatedControl305(e){return hit305(e,'[data-ct169-related-watch],[data-ct169-related-seen],[data-related-watch],[data-related-seen],.ct169-related-open[data-media],[data-related-open],[data-similar-open]')}
function personControl305(e){return hit305(e,'.ct169-person-card [data-person],.ct170-person-card [data-person],.actor-card [data-person],.person-card [data-person],[data-profile] [data-person],.actor-link,.js-person,[data-person-id]')}
function activateMedia305(e){
 const related=relatedControl305(e);if(related){const spec=mediaSpec305(related);if(!spec)return false;stop305(e);if(related.matches('[data-ct169-related-watch],[data-related-watch]'))void saveRelated305(related,spec,'watch');else if(related.matches('[data-ct169-related-seen],[data-related-seen]'))void saveRelated305(related,spec,'seen');else if(typeof go==='function')go(`/${spec.type==='movie'?'movie':'series'}/${spec.id}`);return true}
 const person=personControl305(e);if(person){const id=Number(person.dataset?.person||person.dataset?.personId||person.dataset?.id||0);if(!id)return false;stop305(e);if(typeof go==='function')go(`/person/${id}`);return true}
 return false;
}

function normalizeSportsModel305(){
 try{if(typeof SPORT_TABS255!=='undefined'&&Array.isArray(SPORT_TABS255)){SPORT_TABS255.splice(0,SPORT_TABS255.length,['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos'])}}catch{}
 try{if(typeof F1_TABS255!=='undefined'&&Array.isArray(F1_TABS255)&&!F1_TABS255.some(x=>String(x?.[0])==='drivers')){const at=Math.max(0,F1_TABS255.findIndex(x=>String(x?.[0])==='teams'));F1_TABS255.splice(at<0?F1_TABS255.length:at,0,['drivers','Pilotos'])}}catch{}
}
function sportsRefreshButton305(){return '<button type="button" class="chip ct305-sports-refresh" data-ct305-sports-refresh aria-label="Rebuscar e sincronizar jogos" title="Rebuscar e sincronizar jogos"><span aria-hidden="true">↻</span><span>Atualizar</span></button>'}
function decorateSports305(){
 if(route305()!=='sports')return false;const root=q305('[data-ct255-sports],[data-sports]');if(!root)return false;
 const f1=q305('.ct255-f1hub,[data-ct255-f1]',root),tabs=q305('.ct255-sports-tabs',root),filters=q305('.ct255-sport-filters,[data-ct302-sport-filters]',root),feed=q305('.ct255-sports-feed',root);
 if(f1&&root.firstElementChild!==f1)root.insertBefore(f1,root.firstElementChild);
 if(tabs&&f1&&f1.nextElementSibling!==tabs)f1.after(tabs);
 if(tabs&&!q305('[data-ct305-sports-refresh]',tabs))tabs.insertAdjacentHTML('beforeend',sportsRefreshButton305());
 if(filters&&tabs&&tabs.nextElementSibling!==filters)tabs.after(filters);const anchor=filters||tabs||f1;if(feed&&anchor&&anchor.nextElementSibling!==feed)anchor.after(feed);
 return !!(f1&&tabs&&feed);
}
async function refreshSports305(btn){
 if(!btn||busy305.has(btn))return;busy305.add(btn);btn.disabled=true;btn.classList.add('busy');
 try{
  let sports=[];try{sports=(sport255?.payload?.preferences?.favorite_sports||sport255?.payload?.sports?.map(x=>x.slug)||[]).filter(Boolean)}catch{}if(!sports.length)sports=['soccer','formula_1','basketball','american_football','baseball','hockey','tennis'];
  if(typeof edge==='function')await edge('ct-sports-sync',{action:'sync',date_from:typeof day255==='function'?day255():new Date().toISOString().slice(0,10),date_to:typeof shift255==='function'?shift255(30):new Date(Date.now()+30*86400000).toISOString().slice(0,10),sports,force:true},50000);
  try{sport255.payload=null;sport255.at=0}catch{}if(typeof loadSports255==='function')await loadSports255(true);if(typeof paintSports255==='function')paintSports255();try{toast('Jogos rebuscados e sincronizados.')}catch{}
 }catch(err){try{toast(`Esportes: ${err?.message||err}`)}catch{}}
 finally{btn.disabled=false;btn.classList.remove('busy');busy305.delete(btn)}
}

function f1Event305(e){return hit305(e,'[data-ct301-f1-event]')}
function activateF1305(e){const ev=f1Event305(e);if(!ev||route305()!=='sports'||typeof openF1Modal301!=='function')return false;stop305(e);openF1Modal301(ev);return true}

function compactTop10305(){
 if(route305()!=='discover')return false;const shell=q305('.ct171-top10-shell,[data-ct171-top-content]')?.closest?.('.ct171-top10-shell')||q305('.ct171-top10-shell');if(!shell)return false;
 shell.classList.add('ct305-top10-section');const app=q305('.app');app?.classList.add('ct305-top10-active');return true;
}
function clearTop10305(){if(route305()!=='discover'||!q305('.ct171-top10-shell'))q305('.app')?.classList.remove('ct305-top10-active')}

function statCard305(root,label){const wanted=norm305(label);for(const x of qa305('small,label,[data-stat-label],.stat-label',root)){if(norm305(x.textContent)===wanted||norm305(x.textContent).includes(wanted)){const c=x.closest?.('.stat,[data-stat],button,a,.profile-stat');if(c)return c}}return null}
function cleanWatchlistStat305(card){
 if(!card)return;card.classList.remove('ct299-clickable-stat','ct300-watchlist-stat','ct301-watchlist-stat');delete card.dataset.ct300WatchlistStyle;card.removeAttribute('role');card.removeAttribute('tabindex');card.removeAttribute('title');card.removeAttribute('aria-label');
 for(const x of qa305('span,small,em,i,b,strong',card)){const t=norm305(x.textContent);if(['abrir','open','›','→','↗'].includes(t)||x.matches('.profile-card-arrow,[data-profile-open-icon]'))x.remove()}
 card.classList.add('ct305-watchlist-stat-clean');
}
function stableProfile305(){
 if(route305()!=='profile')return false;const root=q305('[data-profile]');if(!root)return false;
 cleanWatchlistStat305(statCard305(root,'Séries Watchlist'));cleanWatchlistStat305(statCard305(root,'Filmes Watchlist'));
 const headings=qa305('h1,h2,h3,h4,.panel-title,.section-title',root);for(const h of headings){if(!/atores favoritos|atores mais vistos/.test(norm305(h.textContent)))continue;const section=h.closest('section,.panel,article')||h.parentElement;if(!section)continue;section.classList.add('ct305-profile-actors');const controls=qa305('[data-person]',section),cards=[...new Set(controls.map(x=>x.closest('article,li,.card,.actor-card,.person-card')||x))];if(!cards.length)continue;cards.forEach(x=>x.classList.add('ct305-actor-card'));const rail=cards[0].parentElement;if(rail&&cards.every(x=>x.parentElement===rail))rail.classList.add('ct305-actor-rail')}
 return true;
}

normalizeSportsModel305();
try{if(typeof paintSports255==='function'){const base=paintSports255;paintSports255=function(){normalizeSportsModel305();const out=base.apply(this,arguments);decorateSports305();return out}}}catch{}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);stableProfile305();return out}}}catch{}
try{if(typeof setApp==='function'){const base=setApp;setApp=function(){const out=base.apply(this,arguments);queueMicrotask(()=>{compactTop10305();clearTop10305()});return out}}}catch{}

function pointer305(e){
 if(activateF1305(e)||activateMedia305(e)){lastPointer305={x:Number(e.clientX),y:Number(e.clientY),at:Date.now()};return}
 const refresh=hit305(e,'[data-ct305-sports-refresh]');if(refresh){stop305(e);lastPointer305={el:refresh,at:Date.now()};void refreshSports305(refresh)}
}
window.addEventListener('pointerup',pointer305,true);
window.addEventListener('click',e=>{
 const refresh=hit305(e,'[data-ct305-sports-refresh]');if(lastPointer305&&Date.now()-lastPointer305.at<800&&(refresh&&lastPointer305.el===refresh||Number(e.clientX)===lastPointer305.x&&Number(e.clientY)===lastPointer305.y)){stop305(e);return}
 if(activateF1305(e)||activateMedia305(e))return;if(refresh){stop305(e);void refreshSports305(refresh)}
},true);
window.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;if(activateF1305(e)||activateMedia305(e))return;const refresh=e.target?.closest?.('[data-ct305-sports-refresh]');if(refresh){stop305(e);void refreshSports305(refresh)}},true);

window.__ctR305Test={hit305,mediaSpec305,activateMedia305,normalizeSportsModel305,decorateSports305,refreshSports305,activateF1305,compactTop10305,stableProfile305,statCard305};
})();