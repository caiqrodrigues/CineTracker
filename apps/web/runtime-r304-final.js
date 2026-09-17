/* CineTracker Web 1.0.95 r304 — canonical interaction authority. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR304Final)return;
window.__ctR304Final='canonical-clicks+f1-drivers-calendar+sports-sync-order+profile-layout-only';
window.__ctR304='no-r303-capture+drivers-preserved+calendar-native+sports-refresh+profile-stats-preserved';
window.__ctR304Android='preserved-1.0.20-10062';

const q304=(s,r=document)=>r?.querySelector?.(s)||null;
const qa304=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm304=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route304=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};

function ensureDriversData304(){
 try{
  if(typeof F1_TABS255==='undefined'||!Array.isArray(F1_TABS255))return false;
  const found=F1_TABS255.find(x=>String(x?.[0]||'')==='drivers'||norm304(x?.[1])==='pilotos');
  if(!found){const stats=F1_TABS255.findIndex(x=>String(x?.[0]||'')==='stats'||norm304(x?.[1])==='estatisticas');const at=stats>=0?stats:F1_TABS255.length;F1_TABS255.splice(at,0,['drivers','Pilotos'])}
  return true;
 }catch{return false}
}

function orderSports304(){
 if(route304()!=='sports')return false;
 const root=q304('[data-ct255-sports],[data-sports]');if(!root)return false;
 try{window.__ctR301Test?.orderSports301?.()}catch{}
 const f1=q304('.ct255-f1hub,[data-ct255-f1]',root),tabs=q304('.ct255-sports-tabs',root),filters=q304('.ct255-sport-filters,[data-ct302-sport-filters]',root),feed=q304('.ct255-sports-feed',root);
 if(f1&&root.firstElementChild!==f1)root.insertBefore(f1,root.firstElementChild);
 if(f1&&tabs&&f1.nextElementSibling!==tabs)f1.after(tabs);
 if(tabs&&filters&&tabs.nextElementSibling!==filters)tabs.after(filters);
 const anchor=filters||tabs||f1;if(anchor&&feed&&anchor.nextElementSibling!==feed)anchor.after(feed);
 if(root)root.dataset.ct304Order='f1-sports-tabs-filters-feed';
 return !!f1;
}

function ensureSportsRefresh304(){
 if(route304()!=='sports')return false;
 const root=q304('[data-ct255-sports],[data-sports]');if(!root)return false;
 const tabs=q304('.ct255-sports-tabs',root);if(!tabs)return false;
 let btn=q304('[data-ct304-sports-refresh]',tabs);
 if(!btn){btn=document.createElement('button');btn.type='button';btn.className='chip ct304-sports-refresh';btn.dataset.ct304SportsRefresh='1';btn.title='Rebuscar e sincronizar jogos';btn.setAttribute('aria-label','Rebuscar e sincronizar jogos');btn.innerHTML='<span aria-hidden="true">↻</span><span>Atualizar</span>';tabs.appendChild(btn)}
 return true;
}

async function refreshSports304(btn){
 if(!btn||btn.disabled)return false;btn.disabled=true;btn.classList.add('busy');
 try{
  try{if(typeof sport255!=='undefined'){sport255.payload=null;sport255.at=0}}catch{}
  if(typeof loadSports255==='function')await loadSports255(true);
  if(typeof renderSports==='function')await renderSports();
  orderSports304();ensureSportsRefresh304();
  try{await window.__ctR301Test?.decorateF1Calendar301?.(true)}catch{}
  try{toast('Jogos e sincronização atualizados')}catch{}
  return true;
 }catch(e){try{toast(e?.message||'Não foi possível atualizar os jogos')}catch{}return false}
 finally{btn.disabled=false;btn.classList.remove('busy')}
}

function stabilizeTop10304(){
 if(route304()!=='discover')return false;
 const nodes=qa304('h1,h2,h3,strong,b,.title,.section-title');
 const h=nodes.find(x=>/^top\s*10\b/.test(norm304(x.textContent)));if(!h)return false;
 const section=h.closest('section,.panel,.card,.top10-placement-wrap,[data-ct-top10]')||h.parentElement;if(!section)return false;
 section.classList.add('ct304-top10-section');
 const view=section.closest('#viewDiscover,[data-view="discover"],[data-route="discover"],main,#app');view?.classList?.add('ct304-discover-compact');
 return true;
}

function commonActorRail304(cards,section){
 if(cards.length<2)return cards[0]?.parentElement||null;
 const parents=cards.map(c=>c.parentElement).filter(Boolean);if(parents.length===cards.length&&parents.every(p=>p===parents[0]))return parents[0];
 let p=cards[0]?.parentElement;while(p&&p!==section){if(cards.every(c=>p.contains(c)))return p;p=p.parentElement}return null;
}
function stabilizeProfile304(){
 if(route304()!=='profile')return false;
 const profile=q304('[data-profile],#viewProfile,[data-view="profile"]')||q304('#app');if(!profile)return false;
 profile.dataset.ct304StatsPreserved='1';
 const watch=q304('#profileWatchlistGrid',profile)||qa304('section,.panel,.card',profile).find(s=>/watchlist/.test(norm304(s.textContent)));
 if(watch){qa304('.profile-card-arrow,[data-profile-open-icon]',watch).forEach(x=>x.remove());qa304('span,small,em,i',watch).forEach(x=>{const t=norm304(x.textContent);if(t==='abrir'||t==='open'||t==='↗'||t==='›'||t==='→')x.remove()});watch.dataset.ct304NoOpenSignal='1'}
 const headings=qa304('h1,h2,h3,h4,.title,.section-title',profile),heading=headings.find(h=>/atores mais vistos|atores favoritos|atores/.test(norm304(h.textContent)));
 if(heading){const section=heading.closest('section,.panel,.card')||heading.parentElement;if(section){section.classList.add('ct304-profile-actors');const raw=qa304('[data-person],[data-person-key],.person-card,.actor-card,.ct-person-card',section);const cards=[...new Set(raw.map(x=>x.closest('article,li,.card,.person-card,.actor-card,.ct-person-card')||x))];cards.forEach(c=>c.classList.add('ct304-actor-card'));const rail=commonActorRail304(cards,section);if(rail){rail.classList.add('ct304-actor-rail');section.dataset.ct304ActorRail='1'}}}
 return true;
}

function reconcile304(){ensureDriversData304();if(route304()==='sports'){orderSports304();ensureSportsRefresh304()}else if(route304()==='discover')stabilizeTop10304();else if(route304()==='profile')stabilizeProfile304()}

ensureDriversData304();
try{if(typeof renderSports==='function'){const base304=renderSports;renderSports=async function(){const out=await base304.apply(this,arguments);queueMicrotask(()=>{orderSports304();ensureSportsRefresh304()});return out}}}catch{}
try{if(typeof renderProfile==='function'){const baseProfile304=renderProfile;renderProfile=async function(){const out=await baseProfile304.apply(this,arguments);queueMicrotask(stabilizeProfile304);return out}}}catch{}
try{if(typeof renderDiscover==='function'){const baseDiscover304=renderDiscover;renderDiscover=async function(){const out=await baseDiscover304.apply(this,arguments);queueMicrotask(stabilizeTop10304);return out}}}catch{}

document.addEventListener('click',e=>{const refresh=e.target?.closest?.('[data-ct304-sports-refresh]');if(refresh){e.preventDefault();void refreshSports304(refresh);return}const sportsTab=e.target?.closest?.('[data-ct255-sport-tab],[data-ct255-f1tab],[data-ct257-f1tab]');if(sportsTab)queueMicrotask(()=>{ensureDriversData304();orderSports304();ensureSportsRefresh304()})},false);
document.addEventListener('cinetracker:data-changed',()=>queueMicrotask(reconcile304),false);
window.addEventListener('popstate',()=>queueMicrotask(reconcile304),false);
window.addEventListener('hashchange',()=>queueMicrotask(reconcile304),false);
for(const ms of[0,120,420])setTimeout(reconcile304,ms);

window.__ctR304Test={ensureDriversData304,orderSports304,ensureSportsRefresh304,refreshSports304,stabilizeTop10304,stabilizeProfile304,reconcile304,get hasMovieCaptureInterceptor(){return false},get profileRewritesStats(){return false}};
})();
