/* CineTracker Web 1.0.96 / r305 — persistent real interaction authority. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR305Final)return;
window.__ctR305Final='persistent-movie-actions+top10+f1+sports+profile-stable';
window.__ctR305Android='preserved-1.0.20-10062';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():location.pathname.split('/').filter(Boolean)[0]||'')}catch{return''}};
const busy=new WeakSet();
let scheduled=false;
function later(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;reconcile()})}
function mediaSpec(node){
 const card=node?.closest?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]');
 const raw=node?.dataset?.ct169RelatedWatch||node?.dataset?.ct169RelatedSeen||node?.dataset?.relatedWatch||node?.dataset?.relatedSeen||node?.dataset?.media||node?.dataset?.ct169RelatedCard||card?.dataset?.ct169RelatedCard||card?.dataset?.media||q('[data-media]',card)?.dataset?.media||'';
 const [t,id0]=String(raw).split(':');const id=Number(id0)||0;const type=t==='movie'?'movie':t==='tv'?'tv':'';return type&&id?{type,id}:null;
}
function relatedCard(n){return n?.closest?.('.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card]')||null}
async function relatedAction(el,spec,kind){
 if(!el||busy.has(el))return;busy.add(el);const old=el.innerHTML;el.disabled=true;el.setAttribute('aria-busy','true');
 try{if(kind==='watch'){if(typeof addWatchlist!=='function')throw Error('Watchlist indisponível');await addWatchlist(spec.type,spec.id)}else{if(typeof markSeen!=='function')throw Error('Visto indisponível');await markSeen(spec.type,spec.id)}el.innerHTML='✓';el.classList.add('is-saved')}
 catch(err){el.innerHTML=old;try{toast(err?.message||String(err))}catch{}}
 finally{el.disabled=false;el.removeAttribute('aria-busy');busy.delete(el)}
}
function handleMovieClick(e){
 const person=e.target?.closest?.('.actor-link,.js-person,[data-person-id],[data-person]');
 if(person&&!relatedCard(person)){
  const id=Number(person.dataset?.personId||person.dataset?.person||person.dataset?.id||0);if(!id)return false;
  e.preventDefault();e.stopPropagation();
  if(typeof openPerson==='function')openPerson(id);else if(typeof openPersonDetail==='function')openPersonDetail(id);else if(typeof go==='function')go(`/person/${id}`);
  return true;
 }
 const card=relatedCard(e.target);if(!card)return false;
 const ctl=e.target?.closest?.('[data-ct169-related-watch],[data-ct169-related-seen],[data-related-watch],[data-related-seen],[data-action="watchlist"],[data-action="seen"],[data-action="watched"],[data-related-open],[data-similar-open],[data-media]');
 if(!ctl&&e.target?.closest?.('button,a,[role="button"]'))return false;
 const target=ctl||card,spec=mediaSpec(target);if(!spec)return false;
 e.preventDefault();e.stopPropagation();
 if(target.matches?.('[data-ct169-related-watch],[data-related-watch],[data-action="watchlist"]'))void relatedAction(target,spec,'watch');
 else if(target.matches?.('[data-ct169-related-seen],[data-related-seen],[data-action="seen"],[data-action="watched"]'))void relatedAction(target,spec,'seen');
 else if(typeof go==='function')go(`/${spec.type==='movie'?'movie':'series'}/${spec.id}`);
 return true;
}
function fixMovieTargets(){
 qa('.actor-link,.js-person,[data-person-id],[data-person],.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],[data-ct169-related-watch],[data-ct169-related-seen],[data-related-watch],[data-related-seen]').forEach(el=>{el.style.removeProperty('pointer-events');el.removeAttribute('aria-disabled');if('disabled'in el)el.disabled=false});
}
function ensureDrivers(){
 try{if(typeof F1_TABS255!=='undefined'&&Array.isArray(F1_TABS255)&&!F1_TABS255.some(x=>String(x?.[0])==='drivers'||norm(x?.[1])==='pilotos')){const i=F1_TABS255.findIndex(x=>String(x?.[0])==='stats');F1_TABS255.splice(i<0?F1_TABS255.length:i,0,['drivers','Pilotos'])}}catch{}
 const tabs=q('.ct255-f1-tabs,.ct257-f1-tabs');if(!tabs)return false;
 let b=q('[data-ct255-f1tab="drivers"],[data-ct257-f1tab="drivers"]',tabs);
 if(!b){const ref=q('[data-ct255-f1tab="stats"],[data-ct257-f1tab="stats"]',tabs);b=document.createElement('button');b.type='button';b.className=ref?.className||'ct255-f1-tab';b.textContent='Pilotos';b.dataset.ct255F1tab='drivers';ref?tabs.insertBefore(b,ref):tabs.appendChild(b)}
 b.hidden=false;b.disabled=false;b.removeAttribute('hidden');b.removeAttribute('aria-disabled');return true;
}
function orderSports(){
 if(routeNow()!=='sports')return false;const root=q('[data-ct255-sports],[data-sports]');if(!root)return false;
 const f1=q('.ct255-f1hub,[data-ct255-f1]',root),tabs=q('.ct255-sports-tabs',root),filters=q('.ct255-sport-filters,[data-ct302-sport-filters]',root),feed=q('.ct255-sports-feed',root);
 if(f1&&root.firstElementChild!==f1)root.insertBefore(f1,root.firstElementChild);if(f1&&tabs&&f1.nextElementSibling!==tabs)f1.after(tabs);if(tabs&&filters&&tabs.nextElementSibling!==filters)tabs.after(filters);const a=filters||tabs||f1;if(a&&feed&&a.nextElementSibling!==feed)a.after(feed);return true;
}
function ensureSportsRefresh(){
 const root=q('[data-ct255-sports],[data-sports]'),tabs=root&&q('.ct255-sports-tabs',root);if(!tabs)return false;
 let b=q('[data-ct305-sports-refresh]',tabs);if(!b){b=document.createElement('button');b.type='button';b.className='chip ct305-sports-refresh';b.dataset.ct305SportsRefresh='1';b.innerHTML='<span aria-hidden="true">↻</span><span>Atualizar</span>';b.title='Rebuscar e sincronizar jogos';b.setAttribute('aria-label','Rebuscar e sincronizar jogos');tabs.appendChild(b)}return true;
}
async function refreshSports(btn){
 if(!btn||busy.has(btn))return;busy.add(btn);btn.disabled=true;btn.classList.add('busy');
 try{try{if(typeof sport255!=='undefined'){sport255.payload=null;sport255.at=0}}catch{}if(typeof loadSports255==='function')await loadSports255(true);if(typeof renderSports==='function')await renderSports();later();try{toast('Jogos e sincronização atualizados')}catch{}}
 catch(err){try{toast(err?.message||'Não foi possível atualizar os jogos')}catch{}}
 finally{btn.disabled=false;btn.classList.remove('busy');busy.delete(btn)}
}
function fixCalendar(){qa('[data-ct301-f1-event],[data-f1-event]').forEach(el=>{el.hidden=false;el.disabled=false;el.removeAttribute('disabled');el.removeAttribute('aria-disabled');el.tabIndex=0;el.style.setProperty('pointer-events','auto','important');el.style.setProperty('cursor','pointer','important')})}
function compactTop10(){
 if(routeNow()!=='discover')return false;const hs=qa('h1,h2,h3,strong,.title,.section-title');const h=hs.find(x=>/^top\s*10\b/.test(norm(x.textContent)));if(!h)return false;const sec=h.closest('section,.panel,.card,.top10-placement-wrap,[data-ct-top10]')||h.parentElement;sec?.classList.add('ct305-top10-section');(sec?.closest('#viewDiscover,[data-view="discover"],main,#app'))?.classList.add('ct305-discover-compact');return !!sec;
}
function stableProfile(){
 if(routeNow()!=='profile')return false;const profile=q('[data-profile],#viewProfile,[data-view="profile"]')||q('#app');if(!profile)return false;
 const watch=q('#profileWatchlistGrid',profile)||qa('section,.panel,.card',profile).find(x=>/watchlist/.test(norm(x.textContent)));
 if(watch){qa('.profile-card-arrow,[data-profile-open-icon]',watch).forEach(x=>x.remove());qa('small,span,em,i',watch).forEach(x=>{if(['abrir','open','↗','›','→'].includes(norm(x.textContent)))x.remove()});watch.classList.add('ct305-watchlist-clean')}
 const heading=qa('h1,h2,h3,h4,.title,.section-title',profile).find(x=>/atores mais vistos|atores favoritos|atores/.test(norm(x.textContent)));
 if(heading){const section=heading.closest('section,.panel,.card')||heading.parentElement;if(section){section.classList.add('ct305-profile-actors');const cards=[...new Set(qa('[data-person],[data-person-key],.person-card,.actor-card,.ct-person-card',section).map(x=>x.closest('article,li,.card,.person-card,.actor-card,.ct-person-card')||x))];cards.forEach(x=>x.classList.add('ct305-actor-card'));let rail=cards[0]?.parentElement;if(rail&&cards.every(x=>x.parentElement===rail))rail.classList.add('ct305-actor-rail')}}return true;
}
function reconcile(){fixMovieTargets();compactTop10();const r=routeNow();if(r==='sports'){ensureDrivers();orderSports();ensureSportsRefresh();fixCalendar()}else if(r==='profile')stableProfile()}
document.addEventListener('click',e=>{
 const refresh=e.target?.closest?.('[data-ct305-sports-refresh]');if(refresh){e.preventDefault();e.stopPropagation();void refreshSports(refresh);return}
 const ev=e.target?.closest?.('[data-ct301-f1-event],[data-f1-event]');if(ev&&routeNow()==='sports'&&typeof openF1Modal301==='function'){e.preventDefault();e.stopPropagation();openF1Modal301(ev);return}
 handleMovieClick(e);
},false);
document.addEventListener('cinetracker:data-changed',later,false);window.addEventListener('popstate',later,false);window.addEventListener('hashchange',later,false);
const root=q('#app')||document.body;new MutationObserver(later).observe(root,{subtree:true,childList:true});
reconcile();setTimeout(reconcile,120);setTimeout(reconcile,500);
window.__ctR305Test={handleMovieClick,fixMovieTargets,ensureDrivers,orderSports,ensureSportsRefresh,refreshSports,fixCalendar,compactTop10,stableProfile,reconcile};
})();
