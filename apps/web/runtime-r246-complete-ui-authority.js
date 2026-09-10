/* CineTracker Web 1.0.37 r246 — WEB ONLY.
   Final authority for Home freshness, Discover stability, Sports/F1 behavior,
   Profile statistics topology and item-local horizontal scrolling. */
(()=>{
'use strict';
if(window.__ctR246)return;
window.__ctR246='complete-ui-authority';
window.__ctR246Scope='web-only';
window.__ctR246Home='eager-canonical-series-refresh';
window.__ctR246Discover='stable-canonical-r239-r240';
window.__ctR246Sports='four-tabs-no-events-animated-watched';
window.__ctR246F1='persistent-collapse-six-tabs';
window.__ctR246Profile='single-statistics-group';
window.__ctR246Horizontal='local-scrollbars-no-page-x';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route246=()=>String(typeof route==='function'?route():location.pathname||'').replace(/^\//,'');
const raf246=fn=>(window.requestAnimationFrame||((cb)=>setTimeout(cb,0)))(fn);

/* HOME — r245 remains the data authority. r246 forces a fresh canonical pass on
   Home entry/data changes so stale caught-up/completed snapshots cannot survive a
   newly released episode. This stays title-agnostic, therefore tracked event-series
   such as F1/Super Bowl follow the exact same released-unwatched rule. */
let homeTimer246=0,lastForcedHome246=0;
function home246(force=false){
  if(route246()!=='home'&&!q('[data-home]'))return;
  const now=Date.now();
  const shouldForce=force||now-lastForcedHome246>45000;
  if(shouldForce&&typeof window.__ctR245AuditStarted==='function'){
    lastForcedHome246=now;
    try{window.__ctR245AuditStarted()}catch(e){console.warn('r246 Home audit',e)}
  }
  const root=q('[data-home]');
  if(root){
    root.dataset.ct246Home='eager-canonical';
    for(const el of qa('.ct236-home-episode-pending',root))el.dataset.ct246EpisodeVisible='1';
  }
}
function scheduleHome246(force=false,delay=0){
  clearTimeout(homeTimer246);
  homeTimer246=setTimeout(()=>home246(force),delay);
}

/* DISCOVER — keep the proven r239 semantic renderer + r240 exclusions, but stop
   geometry from changing underneath the user while async metadata arrives. */
function discover246(){
  const root=q('[data-page="discover"],[data-discover]');if(!root)return;
  const content=q('[data-discover-content]',root)||root;
  root.dataset.ct246Discover='stable';
  content.classList.add('ct246-discover-content');
  for(const row of qa('.row,.ct171-top-row,.foryou-grid,[data-top10]',content))row.classList.add('ct246-local-track','ct246-discover-track');
  for(const card of qa('.card,article[data-media],.ct166-slot,.foryou-slot',content))card.classList.add('ct246-discover-card');
}

/* SPORTS — r240 owns payload/filter semantics. r246 only canonicalizes the live DOM:
   exactly four tabs, no Eventos action and a single animated watched action. */
const SPORT_TABS_246=new Map([['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']]);
function isEvent246(el){const t=norm(el?.textContent||'');return t==='eventos'||t==='ver eventos'||t==='agenda'||t==='ver agenda'||el?.hasAttribute?.('data-ct165-open-favorite')}
function isWatch246(el){const t=norm(el?.textContent||'');return t.includes('assistido')||t.includes('marcar como assistido')||t.includes('desmarcar assistido')}
function sports246(){
  const root=q('[data-sports]');if(!root)return;
  root.dataset.ct246Sports='four-tabs';
  const tabs=qa('[data-sport-tab]',root);
  for(const tab of tabs){
    const key=String(tab.dataset.sportTab||'');
    if(!SPORT_TABS_246.has(key)){tab.remove();continue}
    const label=SPORT_TABS_246.get(key);if(tab.textContent.trim()!==label)tab.textContent=label;
  }
  const liveTabs=qa('[data-sport-tab]',root).filter(x=>SPORT_TABS_246.has(String(x.dataset.sportTab||'')));
  const parent=liveTabs[0]?.parentElement;
  if(parent&&liveTabs.every(x=>x.parentElement===parent))for(const key of SPORT_TABS_246.keys()){const el=liveTabs.find(x=>x.dataset.sportTab===key);if(el)parent.appendChild(el)}
  for(const card of qa('.event-grid > *',root)){
    const actions=qa('button,a,[role="button"]',card);
    for(const el of actions)if(isEvent246(el))el.remove();
    const watched=qa('button,a,[role="button"]',card).filter(isWatch246);
    for(const el of watched.slice(1))el.remove();
    const w=watched[0];if(!w)continue;
    const unwatch=norm(w.textContent||'').includes('desmarcar');
    const label=unwatch?'↶ Desmarcar assistido':'✓ Assistido';if(w.textContent.trim()!==label)w.textContent=label;
    w.classList.add('ct246-sport-watch');w.dataset.ct246SportWatch='1';
  }
}

/* F1 HUB — the old capture handler calls window.__ctR239SetF1Open. Replacing that
   exported hook makes collapse state durable even when Sports repaints the whole Hub. */
const F1_KEY_246='cinetracker:web:f1-hub-open';
const F1_TABS_246=[['overview','Visão geral'],['calendar','Calendário'],['next','Próximo GP'],['drivers','Pilotos'],['constructors','Construtores'],['last','Último GP']];
let f1Memory246=null;
function readF1Open246(){
  if(f1Memory246!==null)return f1Memory246;
  try{const v=localStorage.getItem(F1_KEY_246);f1Memory246=v===null?true:v!=='0'}catch{f1Memory246=true}
  return f1Memory246;
}
function persistF1Open246(open){f1Memory246=Boolean(open);try{localStorage.setItem(F1_KEY_246,open?'1':'0')}catch{}}
const legacySetF1Open246=typeof window.__ctR239SetF1Open==='function'?window.__ctR239SetF1Open:null;
function setF1Open246(card,open){
  persistF1Open246(open);
  if(card)card.dataset.ct236F1Open=open?'1':'0';
  if(legacySetF1Open246)legacySetF1Open246(card,open);
  applyF1246(card);
}
window.__ctR239SetF1Open=setF1Open246;
function f1Card246(){
  const direct=q('[data-ct236-f1-card],[data-r235-f1-card],[data-f1-hub],.f1Hub,.f1-hub');if(direct)return direct;
  const h=qa('h1,h2,h3,h4,b,strong').find(x=>norm(x.textContent)==='f1 hub');return h?.closest?.('.panel,section,article')||null;
}
function applyF1246(card=f1Card246()){
  if(!card)return;
  try{if(typeof window.__ctR236NormalizeF1==='function')window.__ctR236NormalizeF1()}catch{}
  card=f1Card246()||card;const open=readF1Open246();card.dataset.ct236F1Open=open?'1':'0';card.dataset.ct246F1=open?'open':'collapsed';
  const toggle=q('[data-ct236-f1-toggle]',card);if(toggle){toggle.textContent=open?'−':'+';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Minimizar F1 Hub':'Expandir F1 Hub')}
  const body=q('.f1Body,[data-f1-body]',card);if(body)body.hidden=!open;
  const shell=q('.ct236-f1-shell',card);if(shell){shell.hidden=!open;shell.dataset.ct246F1Shell='1'}
  const tabParent=q('.ct236-f1-tabs',card);if(tabParent){
    for(const [key,label] of F1_TABS_246){const b=q(`[data-ct236-f1-tab="${key}"]`,tabParent);if(b){if(b.textContent.trim()!==label)b.textContent=label;tabParent.appendChild(b)}}
    for(const b of qa('[data-ct236-f1-tab]',tabParent))if(!F1_TABS_246.some(([k])=>k===b.dataset.ct236F1Tab))b.remove();
  }
}

/* PROFILE — fold the legacy separate sports-statistics panel into the canonical
   Statistics grid, preserving r239's 4+4+2 ordering for media stats. */
function panelTitle246(panel){return norm(q(':scope > .panel-head h1,:scope > .panel-head h2,:scope > .panel-head h3,:scope > h1,:scope > h2,:scope > h3',panel)?.textContent||'')}
function profile246(){
  const root=q('[data-profile]');if(!root)return;
  const panels=qa('section.panel,.panel',root);
  const main=panels.find(p=>panelTitle246(p)==='estatisticas');if(!main)return;
  const grid=q('.ct-r238-profile-grid,.ct-r180-stats-grid,.ct239-profile-grid,.stats',main);if(!grid)return;
  grid.classList.add('ct246-profile-grid');
  const sports=panels.filter(p=>{const t=panelTitle246(p);return t==='estatisticas de esporte'||t==='estatisticas de esportes'||t==='estatistica de esporte'||t==='estatistica de esportes'});
  for(const panel of sports){
    for(const stat of qa('.stat',panel)){stat.classList.add('ct246-sport-stat');grid.appendChild(stat)}
    panel.remove();
  }
  main.dataset.ct246Profile='single-statistics-group';
}

/* HORIZONTAL LAYOUT — document stays vertically scrollable and never scrolls on X.
   Every wide detail/Discover track owns its own visible horizontal scrollbar. */
const DIRECT_X_246='.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct244-seasons-scroll,.ct244-chart-scroll,[data-seasons],[data-related],[data-similar],[data-episode-chart]';
const HEADING_X_246=['temporadas','titulos semelhantes','titulos relacionados','relacionados','semelhantes','recomendados','avaliacao dos episodios','avaliacoes dos episodios','notas dos episodios','grafico de episodios'];
function markX246(el){if(!el||el===document.body||el===document.documentElement)return;el.classList.add('ct246-local-track')}
function horizontal246(){
  for(const el of qa(DIRECT_X_246))markX246(el);
  for(const scope of qa('[data-detail],.series-modal,.movie-modal,[data-page="discover"],[data-discover]')){
    for(const h of qa('h1,h2,h3,h4',scope)){
      const t=norm(h.textContent||'');if(!HEADING_X_246.some(x=>t===x||t.includes(x)))continue;
      const panel=h.closest('.panel,section,article')||scope;
      const head=h.closest('.panel-head')||h;
      const candidate=head.nextElementSibling||q('.row,[data-seasons],[data-related],[data-similar],[class*="chart"],[class*="graph"]',panel);
      if(candidate)markX246(candidate);
    }
    for(const row of qa('.row,.carousel,.rail,[class*="related"],[class*="similar"],[class*="season"]',scope)){
      raf246(()=>{if(row.scrollWidth>row.clientWidth+2)markX246(row)})
    }
  }
}

let reconcileTimer246=0,reconciling246=false;
function reconcile246(forceHome=false){
  if(reconciling246)return;reconciling246=true;
  try{home246(forceHome);discover246();sports246();applyF1246();profile246();horizontal246()}finally{reconciling246=false}
}
function queue246(forceHome=false,delay=20){clearTimeout(reconcileTimer246);reconcileTimer246=setTimeout(()=>reconcile246(forceHome),delay)}
try{new MutationObserver(()=>queue246(false,35)).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',()=>queue246(true,0));
window.addEventListener('pageshow',()=>queue246(true,0));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue246(true,0)});
document.addEventListener('cinetracker:data-changed',()=>queue246(true,0));
document.addEventListener('click',e=>{
  const watch=e.target.closest?.('[data-ct246-sport-watch],.ct246-sport-watch');
  if(watch){watch.classList.remove('ct246-watch-pop');void watch.offsetWidth;watch.classList.add('ct246-watch-pop');setTimeout(()=>watch.classList.remove('ct246-watch-pop'),360)}
},true);
try{const basePaintSports246=paintSports;paintSports=function(...a){const out=basePaintSports246.apply(this,a);queue246(false,0);return out}}catch{}
try{const baseRenderProfile246=renderProfile;renderProfile=async function(...a){const out=await baseRenderProfile246.apply(this,a);profile246();return out}}catch{}
try{const basePaintDiscover246=paintDiscover;paintDiscover=function(...a){const out=basePaintDiscover246.apply(this,a);discover246();horizontal246();return out}}catch{}

window.__ctR246HomeRefresh=home246;
window.__ctR246DiscoverStabilize=discover246;
window.__ctR246SportsNormalize=sports246;
window.__ctR246SetF1Open=setF1Open246;
window.__ctR246ApplyF1=applyF1246;
window.__ctR246Profile=profile246;
window.__ctR246Horizontal=horizontal246;
window.__ctR246Reconcile=reconcile246;
queue246(true,0);
})();
