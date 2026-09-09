/* CineTracker Web 1.0.28 r236 — current user/video scope only. */
(()=>{
'use strict';
if(window.__ctR236)return;
window.__ctR236='current-video-scope-authority';
window.__ctR236Home='generic-aired-unwatched-hydration-no-title-hardcode';
window.__ctR236Discover='restore-approved-layout-stable-routes';
window.__ctR236Sports='standard-card-assistido-only';
window.__ctR236F1='overview-calendar-next-drivers-constructors-last';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const txt=e=>norm(e?.textContent||'');
const route=()=>String(location.pathname||'');

/* HOME — generic authority; no series title is hardcoded. Incomplete episode cards stay out of view until hydration resolves. */
let homeHydrating236=false;
function pendingHome236(){
 const root=q('[data-home]');if(!root)return;
 for(const row of qa('.media-row,.card,article',root)){
  const t=norm(row.textContent||'');
  const pending=t.includes('carregando')||t.includes('sincronizando episodio');
  row.classList.toggle('ct236-home-episode-pending',pending);
 }
}
async function hydrateHome236(){
 if(homeHydrating236||!q('[data-home]'))return;homeHydrating236=true;
 try{
  if(typeof window.__ctV127RefreshHome==='function')await window.__ctV127RefreshHome();
  if(route().startsWith('/home')){try{if(typeof paintHome==='function')paintHome()}catch{};pendingHome236()}
 }finally{homeHydrating236=false}
}
try{
 const prior=paintHome;
 paintHome=function(...args){const out=prior.apply(this,args);pendingHome236();queueMicrotask(()=>void hydrateHome236());return out};
}catch{}

/* DISCOVER — undo the r235 200px normalization and let the proven base grid own card geometry. */
function activeDiscover236(root){
 const b=qa('button.active,[aria-selected="true"],[data-discover-tab].active',root).find(x=>x.offsetParent!==null||!x.hidden);
 return norm(b?.dataset?.discoverTab||b?.dataset?.tab||b?.textContent||'pra voce');
}
function stabilizeDiscover236(){
 const root=q('[data-page="discover"],[data-discover]');if(!root)return;
 const content=q('[data-discover-content]',root)||root;
 root.dataset.ct236Discover='stable';
 for(const el of qa('.ct127-discover-card',content))el.classList.remove('ct127-discover-card');
 for(const el of qa('.ct127-discover-row',content))el.classList.remove('ct127-discover-row');
 for(const el of qa('.ct127-discover-pending',content)){el.classList.remove('ct127-discover-pending');el.removeAttribute('aria-busy')}
 const active=activeDiscover236(root);
 root.dataset.ct236DiscoverRoute=active;
 for(const el of qa('button,.chip,[role="tab"]',root)){
  const n=norm(el.textContent||'');
  if(['em alta','populares','novidades','lancamentos','mais aguardados','mais bem avaliados','calendario','pra voce','top 10','top10'].includes(n)){
   el.style.animation='none';el.style.transition='background-color .16s ease,border-color .16s ease,color .16s ease';el.style.transform='none';
  }
 }
 for(const row of qa('.row,.ct171-top-row,[data-top10],.top10',content)){
  row.style.animation='none';row.style.transform='none';
 }
}
let discoverTimer236=0;
function queueDiscover236(){clearTimeout(discoverTimer236);discoverTimer236=setTimeout(stabilizeDiscover236,45)}
try{const prior=paintDiscover;paintDiscover=function(...args){const out=prior.apply(this,args);queueDiscover236();return out}}catch{}
try{const prior=renderDiscover;renderDiscover=async function(...args){const out=await prior.apply(this,args);queueDiscover236();return out}}catch{}

/* SPORTS — remove every Eventos/agenda action and keep the watched action as the card's single footer action. */
function watchedAction236(el){const n=norm(el?.textContent||'');return n.includes('assistido')||n.includes('marcar como assistido')||n.includes('desmarcar assistido')}
function eventAction236(el){const n=norm(el?.textContent||'');return n==='eventos'||n.includes('ver eventos')||n==='agenda'||n.includes('ver agenda')||el?.hasAttribute?.('data-ct165-open-favorite')}
function normalizeSports236(){
 const root=q('[data-sports]');if(!root)return;
 for(const card of qa('.event-grid > *',root)){
  if(!card.querySelector('button,a,[role="button"]'))continue;
  card.classList.add('ct236-standard-sport-card');card.classList.remove('ct127-sports-card');
  const actions=qa('button,a,[role="button"]',card);
  for(const el of actions)if(eventAction236(el))el.remove();
  const watched=qa('button,a,[role="button"]',card).filter(watchedAction236);
  for(const el of watched.slice(1))el.remove();
  let bar=q(':scope > .ct123-actions,:scope > .ct127-sports-actions,:scope > .ct236-sport-actions',card);
  if(watched[0]){
   if(!bar){bar=document.createElement('div');card.appendChild(bar)}
   bar.className='ct236-sport-actions';watched[0].className='ct236-sport-watch';
   const off=norm(watched[0].textContent||'').includes('desmarcar');watched[0].textContent=off?'↶ Desmarcar assistido':'✓ Assistido';
   if(watched[0].parentElement!==bar)bar.appendChild(watched[0]);
   for(const x of [...bar.children])if(x!==watched[0])x.remove();
  }else if(bar){for(const x of [...bar.children])if(eventAction236(x))x.remove();if(!bar.children.length)bar.remove()}
 }
 root.dataset.ct236Sports='standard-assistido-only';
}

/* F1 HUB — own header, own collapse state and exact requested navigation. Existing race data remains the source of truth. */
const F1_TABS236=[['overview','Visão geral'],['calendar','Calendário'],['next','Próximo GP'],['drivers','Pilotos'],['constructors','Construtores'],['last','Último GP']];
function f1Card236(){
 const explicit=q('[data-r235-f1-card],.f1Hub,.f1-hub,[data-f1-hub]');if(explicit)return explicit;
 const marker=qa('h1,h2,h3,h4,b,strong,div').find(x=>norm(x.textContent||'')==='f1 hub');
 return marker?.closest?.('.panel,.event,section,article,div[data-card]')||null;
}
function oldF1Buttons236(card){return qa('button,[role="tab"]',card).filter(x=>!x.hasAttribute('data-ct236-f1-tab')&&!x.hasAttribute('data-ct236-f1-toggle')&&['pilotos','equipes','construtores','pontuacao','pit stops','quartis','corridas','calendario'].includes(norm(x.textContent||'')))}
function clickOld236(card,labels){const buttons=oldF1Buttons236(card);const target=buttons.find(b=>labels.includes(norm(b.textContent||'')));if(target){target.click();return true}return false}
function raceCandidates236(card){
 const body=q('.f1Body,[data-f1-body]',card)||card;
 return qa('article,.race,.event,.card,.media-row,li',body).filter(x=>{const t=norm(x.textContent||'');return t&&(t.includes('gp')||t.includes('grand prix')||/\bround\b|\betapa\b/.test(t))&&!x.closest('.ct236-f1-shell')});
}
function dateValue236(el){const t=String(el.textContent||'');const iso=t.match(/20\d\d[-/]\d\d[-/]\d\d/);if(iso)return Date.parse(iso[0].replaceAll('/','-'))||0;const br=t.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d\d)\b/);if(br)return Date.parse(`${br[3]}-${br[2].padStart(2,'0')}-${br[1].padStart(2,'0')}`)||0;return 0}
function cloneRace236(card,which){
 const rows=raceCandidates236(card);if(!rows.length)return '<div class="ct236-f1-empty">Dados da corrida ainda estão sincronizando.</div>';
 const now=Date.now(),dated=rows.map(el=>({el,t:dateValue236(el)})).filter(x=>x.t>0).sort((a,b)=>a.t-b.t);
 let pick=null;
 if(which==='next')pick=dated.find(x=>x.t>=now)?.el||rows[0];else pick=[...dated].reverse().find(x=>x.t<now)?.el||rows[rows.length-1];
 const clone=pick.cloneNode(true);for(const b of qa('button',clone))b.removeAttribute('id');
 const grid=norm(clone.textContent||'').includes('grid')||norm(clone.textContent||'').includes('largada');
 return `<div class="ct236-f1-race-focus">${clone.outerHTML}${which==='next'&&!grid?'<div class="ct236-f1-grid-note"><b>Grid de largada</b><span>Ainda não definido ou não disponível para este GP.</span></div>':''}</div>`;
}
function showF1Tab236(card,key){
 const panel=q('[data-ct236-f1-panel]',card);if(!panel)return;
 for(const b of qa('[data-ct236-f1-tab]',card)){const on=b.dataset.ct236F1Tab===key;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))}
 panel.dataset.ct236F1Panel=key;
 if(key==='drivers'){clickOld236(card,['pilotos']);panel.innerHTML='<div class="ct236-f1-bridge">Classificação e informações dos pilotos estão exibidas abaixo.</div>';return}
 if(key==='constructors'){clickOld236(card,['equipes','construtores']);panel.innerHTML='<div class="ct236-f1-bridge">Classificação e informações dos construtores estão exibidas abaixo.</div>';return}
 if(key==='calendar'){clickOld236(card,['corridas','calendario']);panel.innerHTML='<div class="ct236-f1-bridge">Selecione uma corrida no calendário abaixo para ver suas informações completas.</div>';return}
 if(key==='next'){clickOld236(card,['corridas','calendario']);setTimeout(()=>{if(panel.isConnected&&panel.dataset.ct236F1Panel==='next')panel.innerHTML=cloneRace236(card,'next')},0);return}
 if(key==='last'){clickOld236(card,['corridas','calendario']);setTimeout(()=>{if(panel.isConnected&&panel.dataset.ct236F1Panel==='last')panel.innerHTML=cloneRace236(card,'last')},0);return}
 clickOld236(card,['pontuacao']);panel.innerHTML='<div class="ct236-f1-overview"><b>Temporada de Fórmula 1</b><span>Calendário, próximo GP, pilotos, construtores e último GP reunidos em um único hub.</span></div>';
}
function normalizeF1236(){
 const card=f1Card236();if(!card)return;card.setAttribute('data-ct236-f1-card','1');
 let body=q('.f1Body,[data-f1-body]',card);if(!body){body=document.createElement('div');body.className='f1Body';card.appendChild(body)}
 let toggle=q('[data-ct236-f1-toggle]',card);
 if(!toggle){
  const head=qa('h1,h2,h3,h4,b,strong').find(x=>norm(x.textContent||'')==='f1 hub')?.parentElement||card.firstElementChild||card;
  toggle=document.createElement('button');toggle.type='button';toggle.dataset.ct236F1Toggle='1';toggle.className='ct236-f1-toggle';toggle.setAttribute('aria-label','Minimizar F1 Hub');toggle.setAttribute('aria-expanded','true');toggle.textContent='−';head.appendChild(toggle);
 }
 if(!q('.ct236-f1-shell',body)){
  const shell=document.createElement('section');shell.className='ct236-f1-shell';shell.innerHTML=`<div class="ct236-f1-tabs" role="tablist">${F1_TABS236.map(([k,l],i)=>`<button type="button" role="tab" data-ct236-f1-tab="${k}" aria-selected="${i===0}">${l}</button>`).join('')}</div><div class="ct236-f1-panel" data-ct236-f1-panel="overview"></div>`;
  body.insertBefore(shell,body.firstChild);
  for(const b of oldF1Buttons236(card))b.classList.add('ct236-f1-old-tab');
  showF1Tab236(card,'overview');
 }
 const open=card.dataset.ct236F1Open!=='0';body.hidden=!open;toggle.textContent=open?'−':'+';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Minimizar F1 Hub':'Expandir F1 Hub');
}

document.addEventListener('click',e=>{
 const toggle=e.target.closest?.('[data-ct236-f1-toggle]');if(toggle){e.preventDefault();e.stopImmediatePropagation();const card=toggle.closest('[data-ct236-f1-card]');card.dataset.ct236F1Open=card.dataset.ct236F1Open==='0'?'1':'0';normalizeF1236();return}
 const tab=e.target.closest?.('[data-ct236-f1-tab]');if(tab){e.preventDefault();e.stopImmediatePropagation();const card=tab.closest('[data-ct236-f1-card]');showF1Tab236(card,tab.dataset.ct236F1Tab);return}
},true);

let reconcileTimer236=0;
function reconcile236(){if(q('[data-home]'))pendingHome236();if(q('[data-page="discover"],[data-discover]'))queueDiscover236();if(q('[data-sports]')){normalizeSports236();normalizeF1236()}}
function queue236(){clearTimeout(reconcileTimer236);reconcileTimer236=setTimeout(reconcile236,55)}
try{new MutationObserver(queue236).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
window.addEventListener('popstate',queue236);window.addEventListener('cinetracker:data-changed',queue236);queue236();

const style=document.createElement('style');style.id='ct-r236-current-video-scope';style.textContent=`
.ct236-home-episode-pending{display:none!important}
[data-page="discover"] .row,[data-discover] .row{grid-auto-columns:minmax(128px,152px)!important;gap:10px!important}
[data-page="discover"] .ct127-discover-card,[data-discover] .ct127-discover-card,[data-page="discover"] .card,[data-discover] .card{width:auto!important;min-width:0!important;max-width:none!important;transform:none!important;animation:none!important}
[data-page="discover"] .ct171-top-row,[data-discover] .ct171-top-row{grid-auto-columns:minmax(128px,152px)!important;gap:10px!important;transform:none!important;animation:none!important}
[data-page="discover"] .ct171-top-row .card,[data-discover] .ct171-top-row .card,[data-page="discover"] [data-top10] .card,[data-discover] [data-top10] .card{width:auto!important;min-width:0!important;max-width:none!important}
.ct236-standard-sport-card{border:1px solid #203f52!important;background:#091821!important;border-radius:13px!important;padding:11px!important;display:flex!important;flex-direction:column!important;min-width:0!important;box-shadow:none!important}.ct236-sport-actions{margin-top:auto!important;padding-top:10px!important;width:100%!important}.ct236-sport-watch{width:100%!important;min-height:38px!important;border:1px solid #315f78!important;background:#0a1b25!important;color:#eaf8ff!important;border-radius:10px!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important}.ct127-sports-actions{grid-template-columns:1fr!important}
[data-ct236-f1-card="1"]{position:relative!important;border:1px solid #28566f!important;background:linear-gradient(145deg,#07131b,#0b1f2a)!important;border-radius:16px!important;overflow:hidden!important;box-shadow:0 14px 40px #00000026!important}[data-ct236-f1-card="1"] .f1Body{padding-top:4px}.ct236-f1-toggle{margin-left:auto!important;width:34px!important;height:34px!important;border-radius:999px!important;border:1px solid #3a7796!important;background:#0b2635!important;color:#eaf8ff!important;font-size:22px!important;line-height:1!important;display:grid!important;place-items:center!important;cursor:pointer!important}.ct236-f1-tabs{display:flex!important;gap:7px!important;overflow-x:auto!important;padding:10px 0 12px!important;scrollbar-width:none!important}.ct236-f1-tabs::-webkit-scrollbar{display:none}.ct236-f1-tabs button{white-space:nowrap!important;border:1px solid #315f78!important;background:#081923!important;color:#91afbf!important;border-radius:999px!important;padding:7px 11px!important;font-size:10px!important;cursor:pointer!important;transform:none!important;animation:none!important}.ct236-f1-tabs button.active,.ct236-f1-tabs button[aria-selected="true"]{background:#103a55!important;border-color:#55b5eb!important;color:#fff!important}.ct236-f1-panel{border:1px solid #1f455b!important;background:#06131b!important;border-radius:12px!important;padding:12px!important;margin-bottom:10px!important}.ct236-f1-overview,.ct236-f1-grid-note{display:grid!important;gap:5px!important}.ct236-f1-overview span,.ct236-f1-grid-note span,.ct236-f1-bridge{color:#8fa9b7!important;font-size:10px!important;line-height:1.45!important}.ct236-f1-old-tab{position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}.ct236-f1-race-focus>*{max-width:100%!important}
@media(max-width:700px){[data-page="discover"] .row,[data-discover] .row,[data-page="discover"] .ct171-top-row,[data-discover] .ct171-top-row{grid-auto-columns:minmax(128px,148px)!important}.ct236-f1-tabs{margin-right:-4px!important}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
window.__ctR236Reconcile=reconcile236;window.__ctR236NormalizeSports=normalizeSports236;window.__ctR236NormalizeF1=normalizeF1236;window.__ctR236StabilizeDiscover=stabilizeDiscover236;window.__ctR236HydrateHome=hydrateHome236;
})();