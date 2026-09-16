/* CineTracker Web 1.0.93 r302 — final UI authority: detail actions, sports sync/order, F1 clickability, Top 10 fit and profile visual preservation. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR302UIFinal)return;
window.__ctR302UIFinal='detail-actions+top10-fit+f1-calendar+sports-sync-order+profile-preserved';
window.__ctR302Detail='related-open-watch-seen+cast-open';
window.__ctR302Top10='viewport-fit-less-whitespace';
window.__ctR302SportsFinal='f1-first+tabs-below+filters+manual-sync';
window.__ctR302ProfileFinal='legacy-stat-visual+watchlist-no-open-label';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const busy=new WeakSet();

function parseMedia(raw){const m=String(raw||'').match(/^(movie|tv|series):(\d+)$/);if(!m)return null;return {type:m[1]==='movie'?'movie':'tv',id:Number(m[2])}}
function relatedCard(node){return node?.closest?.('.ct169-related-card,.ct170-related-card')||null}
function relatedSpec(node){
 const card=relatedCard(node),control=node?.closest?.('[data-ct169-related-watch],[data-ct169-related-seen],[data-media]');
 const raw=control?.dataset?.ct169RelatedWatch||control?.dataset?.ct169RelatedSeen||control?.dataset?.media||card?.dataset?.media||q('[data-media]',card)?.dataset?.media||'';
 return parseMedia(raw);
}
function removeRelated(node){const card=relatedCard(node),section=card?.closest?.('.ct169-detail-section,section');if(card?.isConnected)card.remove();try{window.__ctR286Test?.removeCard?.(node)}catch{}if(section){const count=q('.ct169-section-head>span,.panel-head>span,.panel-head>small',section),n=qa('.ct169-related-card,.ct170-related-card',section).length;if(count)count.textContent=String(n)}}
async function relatedFallback(e){
 if(window.__ctR286Test?.control?.(e.target))return false;
 const card=relatedCard(e.target);if(!card)return false;const spec=relatedSpec(e.target);if(!spec)return false;
 const action=e.target?.closest?.('.ct169-related-actions button,button');const txt=norm(action?.textContent||'');
 e.preventDefault();e.stopImmediatePropagation();
 if(action&&/watchlist|adicionar/.test(txt)){
  if(busy.has(action))return true;busy.add(action);action.disabled=true;try{if(typeof addWatchlist!=='function')throw new Error('Ação de Watchlist indisponível');await addWatchlist(spec.type,spec.id);removeRelated(action)}catch(err){action.disabled=false;try{toast(err?.message||String(err))}catch{}}finally{busy.delete(action)};return true;
 }
 if(action&&/visto|assistid/.test(txt)){
  if(busy.has(action))return true;busy.add(action);action.disabled=true;try{if(typeof markSeen!=='function')throw new Error('Ação de visto indisponível');await markSeen(spec.type,spec.id);removeRelated(action)}catch(err){action.disabled=false;try{toast(err?.message||String(err))}catch{}}finally{busy.delete(action)};return true;
 }
 if(typeof go==='function')go(`/${spec.type==='movie'?'movie':'series'}/${spec.id}`);return true;
}
function personId(node){
 const el=node?.closest?.('[data-person-id],[data-person],[data-actor-id],[data-cast-id],a[href*="/person/"],.ct169-cast-card,.cast-card,.actor-card');if(!el)return 0;
 const vals=[el.dataset?.personId,el.dataset?.person,el.dataset?.actorId,el.dataset?.castId,(el.getAttribute?.('href')||'').match(/\/person\/(\d+)/)?.[1],q('[data-person-id],[data-person],[data-actor-id],[data-cast-id],a[href*="/person/"]',el)?.dataset?.personId,q('a[href*="/person/"]',el)?.getAttribute?.('href')?.match(/\/person\/(\d+)/)?.[1]];
 for(const v of vals){const n=Number(v);if(Number.isFinite(n)&&n>0)return n}return 0;
}
function actorFallback(e){const id=personId(e.target);if(!id)return false;const anchor=e.target?.closest?.('a[href*="/person/"]');if(anchor&&anchor.getAttribute('href')?.match(/^\/person\/\d+/)){}e.preventDefault();e.stopImmediatePropagation();if(typeof go==='function')go(`/person/${id}`);return true}

function removePilots(){
 for(const b of qa('[data-ct255-f1tab],[data-ct257-f1tab],.ct255-f1-tabs button,.ct257-f1-tabs button')){const k=String(b.dataset?.ct255F1tab||b.dataset?.ct257F1tab||'');if(k==='drivers'||norm(b.textContent)==='pilotos')b.remove()}
 try{window.__ctR302Test?.removeDrivers302?.()}catch{}
}
function makeCalendarClickable(){removePilots();for(const el of qa('[data-ct301-f1-event],.ct301-f1-event')){el.disabled=false;el.removeAttribute('disabled');el.style.removeProperty('pointer-events');el.style.removeProperty('opacity');el.dataset.ct302Clickable='1'}return true}
function ensureSportsOrder(){
 if(routeNow()!=='sports')return false;const root=q('[data-ct255-sports],[data-sports]');if(!root)return false;removePilots();try{window.__ctR302Test?.ensureSportsFilters302?.()}catch{}
 const f1=q('.ct255-f1hub,[data-ct255-f1]',root),tabs=q('.ct255-sports-tabs',root),filters=q('.ct255-sport-filters,[data-ct302-sport-filters]',root),feed=q('.ct255-sports-feed',root);
 if(f1&&root.firstElementChild!==f1)root.insertBefore(f1,root.firstElementChild);if(f1&&tabs&&f1.nextElementSibling!==tabs)f1.after(tabs);if(tabs&&filters&&tabs.nextElementSibling!==filters)tabs.after(filters);const anchor=filters||tabs||f1;if(anchor&&feed&&anchor.nextElementSibling!==feed)anchor.after(feed);
 ensureSportsSync(root,filters||tabs||f1);makeCalendarClickable();root.dataset.ct302FinalOrder='f1-tabs-filters-feed';return true;
}
function ensureSportsSync(root,anchor){
 if(q('[data-ct302-sports-sync]',root))return;const b=document.createElement('button');b.type='button';b.className='chip ct302-sports-sync';b.dataset.ct302SportsSync='1';b.setAttribute('aria-label','Atualizar e sincronizar jogos');b.title='Atualizar e sincronizar jogos';b.innerHTML='<span aria-hidden="true">↻</span><span>Sincronizar</span>';
 const filters=q('.ct255-sport-filters,[data-ct302-sport-filters]',root);if(filters)filters.appendChild(b);else if(anchor)anchor.after(b);else root.prepend(b);
}
async function syncSports(){
 const b=q('[data-ct302-sports-sync]');if(b?.disabled)return false;if(b){b.disabled=true;b.classList.add('loading')}
 try{try{if(typeof sport255!=='undefined'){sport255.payload=null;sport255.at=0}}catch{}if(typeof loadSports255==='function')await loadSports255(true);if(typeof renderSports==='function')await renderSports();ensureSportsOrder();try{toast('Jogos atualizados e sincronizados')}catch{}return true}catch(err){try{toast(err?.message||'Não foi possível sincronizar os jogos')}catch{}return false}finally{if(b?.isConnected){b.disabled=false;b.classList.remove('loading')}}
}

function watchlistStatCards(){const root=q('[data-profile]');if(!root)return[];return qa('.stat,[data-stat],button,a,.profile-stat',root).filter(x=>{const t=norm(x.textContent);return t.includes('series watchlist')||t.includes('filmes watchlist')})}
function preserveProfile(){
 if(routeNow()!=='profile')return false;for(const card of watchlistStatCards()){card.classList.remove('ct301-watchlist-stat');for(const el of qa('span,small,em,strong,b,i',card)){if(norm(el.textContent)==='abrir')el.remove()}for(const attr of['data-ct301-no-icon'])card.removeAttribute(attr);card.dataset.ct302ProfilePreserved='1'}return true;
}
function fitTop10(){if(routeNow()!=='discover')return false;const row=q('.ct171-top-row,[data-ct171-top-row],.ct170-top-row,[data-top10]');if(!row)return false;row.dataset.ct302TopFit='1';return true}
function finite(){const r=routeNow();if(r==='sports')ensureSportsOrder();else if(r==='profile')preserveProfile();else if(r==='discover')fitTop10()}
function burst(){for(const ms of[0,80,240,650,1300])setTimeout(finite,ms)}

window.addEventListener('click',e=>{if(relatedCard(e.target)){void relatedFallback(e);return}if(personId(e.target)){actorFallback(e);return}},true);
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-ct302-sports-sync]')){e.preventDefault();e.stopImmediatePropagation();void syncSports();return}if(e.target?.closest?.('[data-ct255-sport-tab],[data-ct255-f1tab],[data-ct257-f1tab]'))burst()},true);
document.addEventListener('cinetracker:data-changed',burst,false);window.addEventListener('popstate',burst,false);
for(const ms of[0,250,900,1800])setTimeout(finite,ms);

window.__ctR302UIFinalTest={relatedSpec,personId,removePilots,makeCalendarClickable,ensureSportsOrder,ensureSportsSync,syncSports,preserveProfile,fitTop10};
})();
