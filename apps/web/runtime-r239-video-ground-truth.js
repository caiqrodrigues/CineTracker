/* CineTracker Web 1.0.31 r239 — production-video ground truth authority. */
(()=>{
'use strict';
if(window.__ctR239)return;
window.__ctR239='production-video-ground-truth';
window.__ctR239Profile='exact-four-column-reference-layout';
window.__ctR239Discover='restore-real-foryou-sections-from-r166';
window.__ctR239Sports='canonical-app-button-not-gray';
window.__ctR239F1='single-tab-group-real-collapse';
window.__ctR239FreezeFix='idempotent-reconcile';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function profile239(){
 const root=q('[data-profile]');if(!root)return;
 const panel=qa('section.panel',root).find(p=>norm(q('.panel-head h2',p)?.textContent||'')==='estatisticas');if(!panel)return;
 const grid=q('.ct-r238-profile-grid,.ct-r180-stats-grid,.stats',panel);if(!grid)return;
 grid.classList.add('ct239-profile-grid');
 const cards=qa(':scope > .stat',grid);
 const expected=['episodios','filmes','series watchlist','filmes watchlist','tempo em series','tempo em filmes','tempo de serie em watchlist','tempo de filme em watchlist','tempo total de tela','tempo total em watchlist'];
 if(cards.length>=10){
  const current=cards.map(c=>norm(q('small',c)?.textContent||''));
  if(expected.some((label,i)=>current[i]!==label)){
   const by=new Map(cards.map(c=>[norm(q('small',c)?.textContent||''),c]));
   for(const label of expected){const c=by.get(label);if(c&&c.parentElement===grid)grid.appendChild(c)}
  }
 }
 for(const c of qa(':scope > .stat',grid)){
  const label=norm(q('small',c)?.textContent||'');
  c.classList.toggle('ct239-profile-total',label==='tempo total de tela'||label==='tempo total em watchlist');
  c.style.removeProperty('order');
  c.style.removeProperty('grid-column');
 }
 panel.dataset.ct239Profile='reference-layout';
}

try{if(typeof ct169TuneForYou==='function')ct169TuneForYou=function(){}}catch{}
let lastForYou239=null,paintingForYou239=false;
function forYou239(data){
 const root=q('[data-page="discover"],[data-discover]');if(!root)return false;
 const content=q('[data-discover-content]',root);if(!content||typeof ct166RenderForYou!=='function')return false;
 const currentTab=String(globalThis.discoverState?.tab||'');if(currentTab&&currentTab!=='foryou')return false;
 lastForYou239=data||lastForYou239||{};
 if(paintingForYou239)return true;
 paintingForYou239=true;
 try{
  const next=ct166RenderForYou(lastForYou239);
  if(content.innerHTML!==next)content.innerHTML=next;
  content.classList.add('ct239-foryou');
  const sections=qa(':scope > section.panel',content);
  const names=['Indicação do dia','Da sua Watchlist','100% novos'];
  sections.slice(0,3).forEach((sec,i)=>{
   sec.classList.add('ct239-foryou-section');
   let head=q(':scope > .panel-head',sec);
   if(!head){head=document.createElement('div');head.className='panel-head';sec.insertBefore(head,sec.firstChild)}
   let h=q('h2',head);if(!h){h=document.createElement('h2');head.prepend(h)}if(h.textContent!==names[i])h.textContent=names[i];
  });
  root.dataset.ct239Discover='r166-three-real-sections';
  return sections.length>=3;
 }finally{paintingForYou239=false}
}
function discoverHealthy239(){
 const root=q('[data-page="discover"],[data-discover]');if(!root)return true;
 if(String(globalThis.discoverState?.tab||'')!=='foryou')return true;
 const content=q('[data-discover-content]',root);if(!content)return false;
 const heads=qa(':scope > section.panel .panel-head h2',content).map(x=>norm(x.textContent));
 return ['indicacao do dia','da sua watchlist','100 novos'].every(x=>heads.includes(x));
}
try{
 const prior=paintDiscover;
 paintDiscover=function(rows,...rest){const out=prior.call(this,rows,...rest);if(String(globalThis.discoverState?.tab||'')==='foryou'){lastForYou239=rows||{};forYou239(lastForYou239)}return out};
}catch{}

function isEvent239(el){const t=norm(el?.textContent||'');return t==='eventos'||t==='ver eventos'||t==='agenda'||t==='ver agenda'||el?.hasAttribute?.('data-ct165-open-favorite')}
function isWatch239(el){const t=norm(el?.textContent||'');return t.includes('assistido')||t.includes('marcar como assistido')||t.includes('desmarcar assistido')}
function sports239(){
 const root=q('[data-sports]');if(!root)return;
 for(const card of qa('.event-grid > *',root)){
  for(const el of qa('button,a,[role="button"]',card))if(isEvent239(el))el.remove();
  const watches=qa('button,a,[role="button"]',card).filter(isWatch239);
  for(const x of watches.slice(1))x.remove();
  const w=watches[0];if(!w)continue;
  const off=norm(w.textContent||'').includes('desmarcar');
  const desired=off?'↶ Desmarcar assistido':'✓ Assistido';if(w.textContent.trim()!==desired)w.textContent=desired;
  w.classList.add('btn','ct239-sport-watch');
  w.classList.remove('secondary','ct127-sport-action');
  w.dataset.ct239SportWatch='1';
  const bar=w.parentElement;if(bar){bar.classList.add('ct239-sport-actions');for(const x of [...bar.children])if(x!==w&&isEvent239(x))x.remove()}
 }
 root.dataset.ct239Sports='canonical-button';
}

const legacyF1Labels239=new Set(['visao geral','ultimo gp','voltas','grid de largada','pilotos','equipes','construtores','pontuacao','pit stops','quartis','corridas','calendario','proximo gp']);
function f1Card239(){
 const explicit=q('[data-ct236-f1-card],[data-r235-f1-card],[data-f1-hub],.f1Hub,.f1-hub');if(explicit)return explicit;
 const title=qa('h1,h2,h3,h4,b,strong').find(x=>norm(x.textContent||'')==='f1 hub');return title?.closest?.('.panel,section,article')||null;
}
function topChild239(card,node){let x=node;while(x?.parentElement&&x.parentElement!==card)x=x.parentElement;return x?.parentElement===card?x:null}
function f1239(){
 const card=f1Card239();if(!card)return;
 const title=qa('h1,h2,h3,h4,b,strong',card).find(x=>norm(x.textContent||'')==='f1 hub');if(!title)return;
 const headerTop=topChild239(card,title)||card.firstElementChild;
 const shell=q('.ct236-f1-shell',card);
 if(shell&&headerTop&&shell!==headerTop&&headerTop.nextElementSibling!==shell){headerTop.after(shell)}
 if(shell)shell.classList.add('ct239-f1-shell');
 const old=qa('button,[role="tab"]',card).filter(x=>!x.hasAttribute('data-ct236-f1-tab')&&!x.hasAttribute('data-ct236-f1-toggle')&&legacyF1Labels239.has(norm(x.textContent||'')));
 for(const b of old)b.classList.add('ct239-f1-legacy-tab');
 const parents=new Map();for(const b of old){const p=b.parentElement;if(p)parents.set(p,(parents.get(p)||0)+1)}
 for(const [p,n] of parents){const buttons=qa(':scope > button,:scope > [role="tab"]',p);if(n>=2&&buttons.length&&buttons.every(x=>x.classList.contains('ct239-f1-legacy-tab')))p.classList.add('ct239-f1-legacy-group')}
 const toggle=q('[data-ct236-f1-toggle]',card);if(toggle){toggle.classList.add('ct239-f1-toggle');toggle.dataset.ct239F1Toggle='1'}
 const open=card.dataset.ct236F1Open!=='0';
 for(const child of [...card.children]){
  if(child===headerTop)continue;
  child.classList.add('ct239-f1-collapsible');
  if(child.hidden===open)child.hidden=!open;
 }
 if(toggle){const txt=open?'−':'+';if(toggle.textContent!==txt)toggle.textContent=txt;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Minimizar F1 Hub':'Expandir F1 Hub')}
 card.dataset.ct239F1='single-tabs-'+(open?'open':'collapsed');
}
function setF1Open239(card,open){if(!card)return;const v=open?'1':'0';if(card.dataset.ct236F1Open!==v)card.dataset.ct236F1Open=v;f1239()}
window.__ctR239SetF1Open=setF1Open239;

let timer239=0,reconciling239=false;
function reconcile239(){
 if(reconciling239)return;reconciling239=true;
 try{profile239();sports239();f1239();if(!discoverHealthy239()&&lastForYou239)forYou239(lastForYou239)}finally{reconciling239=false}
}
function queue239(){clearTimeout(timer239);timer239=setTimeout(reconcile239,70)}
try{new MutationObserver(queue239).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',queue239);window.addEventListener('cinetracker:data-changed',queue239);
try{const prior=renderProfile;renderProfile=async function(...a){const out=await prior.apply(this,a);profile239();return out}}catch{}
try{const prior=paintSports;paintSports=function(...a){const out=prior.apply(this,a);setTimeout(()=>{sports239();f1239()},0);return out}}catch{}

const st=document.createElement('style');st.id='ct-r239-video-ground-truth';st.textContent=`
[data-profile] .ct239-profile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}
[data-profile] .ct239-profile-grid>.stat{grid-column:span 1!important;min-width:0!important}
[data-profile] .ct239-profile-grid>.ct239-profile-total{grid-column:span 2!important}
[data-discover-content].ct239-foryou{display:block!important}
.ct239-foryou>.ct239-foryou-section{display:block!important;width:100%!important;margin:0 0 14px!important;padding:13px!important;overflow:hidden!important}
.ct239-foryou>.ct239-foryou-section>.panel-head{display:flex!important;visibility:visible!important;opacity:1!important;min-height:28px!important;margin-bottom:10px!important}
.ct239-foryou>.ct239-foryou-section>.panel-head h2{display:block!important;visibility:visible!important;opacity:1!important;margin:0!important}
.ct239-foryou .foryou-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,200px))!important;grid-auto-flow:unset!important;gap:14px!important;justify-content:start!important;align-items:start!important;overflow-x:auto!important}
.ct239-foryou .ct166-daily-grid{grid-template-columns:minmax(0,200px)!important}
.ct239-foryou .ct166-slot,.ct239-foryou .foryou-slot{width:200px!important;min-width:200px!important;max-width:200px!important;min-height:0!important}
.ct239-foryou .ct166-slot article,.ct239-foryou .ct166-slot>.card,.ct239-foryou .foryou-slot article,.ct239-foryou .foryou-slot>.card{box-sizing:border-box!important;width:200px!important;min-width:200px!important;max-width:200px!important}
.ct239-foryou .empty.compact{box-sizing:border-box!important;width:200px!important;min-width:200px!important;max-width:200px!important;min-height:300px!important;display:grid!important;place-items:center!important}
[data-sports] .ct239-sport-actions{margin-top:auto!important;padding-top:10px!important;width:100%!important;background:transparent!important;border:0!important}
[data-sports] .ct239-sport-watch{box-sizing:border-box!important;width:100%!important;min-height:38px!important;height:38px!important;border:1px solid var(--line2,#315f78)!important;background:#0a1b25!important;color:#eaf8ff!important;border-radius:10px!important;padding:8px 11px!important;font:inherit!important;font-size:11px!important;line-height:1!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:none!important;appearance:none!important;-webkit-appearance:none!important;cursor:pointer!important}
[data-ct236-f1-card] .ct239-f1-legacy-tab,[data-ct236-f1-card] .ct239-f1-legacy-group{display:none!important}
[data-ct236-f1-card]>.ct239-f1-shell{order:0!important;margin-top:0!important;padding-top:0!important}
[data-ct236-f1-card] .ct239-f1-toggle{width:34px!important;height:34px!important;border-radius:999px!important;border:1px solid #3a7796!important;background:#0b2635!important;color:#eaf8ff!important;display:grid!important;place-items:center!important;cursor:pointer!important}
@media(max-width:700px){
 [data-profile] .ct239-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
 [data-profile] .ct239-profile-grid>.ct239-profile-total{grid-column:span 2!important}
 .ct239-foryou .foryou-grid{grid-template-columns:repeat(3,minmax(0,170px))!important}
 .ct239-foryou .ct166-slot,.ct239-foryou .foryou-slot,.ct239-foryou .ct166-slot article,.ct239-foryou .foryou-slot article,.ct239-foryou .empty.compact{width:170px!important;min-width:170px!important;max-width:170px!important}
}
`;document.getElementById(st.id)?.remove();document.head.appendChild(st);
window.__ctR239Profile=profile239;window.__ctR239ForYou=forYou239;window.__ctR239Sports=sports239;window.__ctR239F1=f1239;window.__ctR239Reconcile=reconcile239;
queue239();
})();